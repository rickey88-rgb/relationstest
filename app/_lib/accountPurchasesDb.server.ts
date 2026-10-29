import { randomUUID } from "node:crypto";
import postgres from "postgres";
import type { AccountAudhdProof } from "./accountAudhdProof.server";
import type { EncryptedAudhdCheckoutAnswers } from "./audhdCheckoutAttempt.server";
import { audhdBrowserUnlockMaxAge } from "./audhdRecovery.server";
import { accountMonitoringConfigured } from "./accountMonitoring.server";
import { accountErasureIdentity, accountStorageMode, assertAccountStorageActive, assertErasureJournalAvailable, readAnalysisErasure, writeAnalysisErasure, type ErasureReason } from "./accountErasureJournal.server";

const globals = globalThis as typeof globalThis & { accountPurchasesSql?: ReturnType<typeof postgres> };
function database() {
  if (!globals.accountPurchasesSql) {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) throw new Error("Account storage unavailable");
    globals.accountPurchasesSql = postgres(url, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10, ssl: "verify-full",
      connection: { statement_timeout: 20000, lock_timeout: 5000 } });
  }
  return globals.accountPurchasesSql;
}

export function validAccountRecordId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function ownerId(id: string) { if (!validAccountRecordId(id)) throw new Error("Invalid account identifier"); return id; }

export async function accountStorageReady() {
  const rows = await database()<{ ready: boolean }[]>`
    select to_regclass('public.account_purchases') is not null
       and to_regclass('public.account_audhd_analyses') is not null
       and to_regclass('public.account_analysis_cleanup_state') is not null
       and to_regclass('public.account_analysis_erasure_receipts') is not null as ready
  `;
  return rows[0]?.ready === true;
}

/** Purchase-bound recovery proof can still link history when answers have
 * expired. It never reconstructs or releases a deleted analysis.
 */
export async function loadAccountRecoveryPurchase(grantId: string) {
  if (!validAccountRecordId(grantId)) return null;
  const rows = await database()<Array<{ stripe_checkout_session_id: string; stripe_payment_intent_id: string; stripe_price_id: string }>>`
    select stripe_checkout_session_id, stripe_payment_intent_id, stripe_price_id
    from public.audhd_recovery_grants
    where id = ${grantId} and product_key = 'audhd_test' and redeemed_at is not null and revoked_at is null
      and redeemed_at + ${audhdBrowserUnlockMaxAge} * interval '1 second' > now()
    limit 1
  `;
  const row = rows[0];
  return row ? { checkoutSessionId: row.stripe_checkout_session_id, paymentIntentId: row.stripe_payment_intent_id, priceId: row.stripe_price_id } : null;
}

type PurchaseRow = {
  id: string; purchased_at: Date; amount_total_ore: number; currency: string; revoked_at: Date | null;
  analysis_removal_reason: "expired" | "user_deleted" | "revoked" | null; expires_at: Date | null;
};
export type AccountPurchaseSummary = { id: string; productKey: "audhd_test"; purchasedAt: Date; amountTotalOre: number;
  currency: string; analysisExpiresAt: Date | null; status: "available" | "expired" | "user_deleted" | "revoked" | "missing" };

/** Summary query deliberately never selects answer ciphertext or Stripe ids. */
export async function listAccountPurchases(userId: string): Promise<AccountPurchaseSummary[]> {
  assertAccountStorageActive();
  const rows = await database()<PurchaseRow[]>`
    select p.id, p.purchased_at, p.amount_total_ore, p.currency, p.revoked_at,
           p.analysis_removal_reason, a.expires_at
    from public.account_purchases p
    left join public.account_audhd_analyses a on a.purchase_id = p.id
    where p.user_id = ${ownerId(userId)}
    order by p.purchased_at desc, p.id
    limit 50
  `;
  return rows.map(row => ({ id: row.id, productKey: "audhd_test", purchasedAt: row.purchased_at,
    amountTotalOre: row.amount_total_ore, currency: row.currency, analysisExpiresAt: row.expires_at,
    status: row.revoked_at ? "revoked" : row.expires_at ? (row.expires_at.getTime() > Date.now() ? "available" : "expired")
      : row.analysis_removal_reason ?? "missing" }));
}

/** Uniqueness + row locking make first ownership atomic. Conflict never moves
 * a purchase between accounts and retries never extend an analysis's expiry.
 */
export async function saveAccountAudhdPurchase(userId: string, proof: Extract<AccountAudhdProof, { kind: "verified" }>) {
  ownerId(userId);
  assertAccountStorageActive();
  if (!accountMonitoringConfigured()) throw new Error("Account monitoring unavailable");
  await assertErasureJournalAvailable();
  return database().begin(async sql => {
    await sql`
      insert into public.account_purchases (id, user_id, product_key, stripe_checkout_session_id,
        stripe_payment_intent_id, stripe_price_id, purchased_at, amount_total_ore, currency, proof_kind)
      values (${randomUUID()}, ${userId}, 'audhd_test', ${proof.payment.checkoutSessionId},
        ${proof.payment.paymentIntentId}, ${proof.payment.priceId}, ${proof.payment.purchasedAt},
        ${proof.payment.amountTotalOre}, 'sek', ${proof.source})
      on conflict (stripe_checkout_session_id) do nothing
    `;
    const owned = await sql<{ id: string; revoked_at: Date | null; stripe_payment_intent_id: string; stripe_price_id: string }[]>`
      select id, revoked_at, stripe_payment_intent_id, stripe_price_id from public.account_purchases
      where stripe_checkout_session_id = ${proof.payment.checkoutSessionId} and user_id = ${userId}
      for update
    `;
    const purchase = owned[0];
    if (!purchase || purchase.revoked_at || purchase.stripe_payment_intent_id !== proof.payment.paymentIntentId
      || purchase.stripe_price_id !== proof.payment.priceId) return { kind: "denied" as const };
    if (!proof.encrypted) return { kind: "saved" as const, purchaseId: purchase.id };
    const created = await sql<{ expires_at: Date }[]>`
      insert into public.account_audhd_analyses (purchase_id, generation_id, journal_identity, report_version, answers_ciphertext, encryption_iv, encryption_auth_tag, consent_version)
      values (${purchase.id}, ${randomUUID()}, ${accountErasureIdentity()}, 'audhd-v1', ${proof.encrypted.ciphertext}, ${proof.encrypted.iv}, ${proof.encrypted.authTag}, 'account-analysis-v1')
      on conflict (purchase_id) do nothing
      returning expires_at
    `;
    if (created.length) await sql`
      update public.account_purchases set analysis_removed_at = null, analysis_removal_reason = null
      where id = ${purchase.id} and user_id = ${userId}
    `;
    return { kind: "saved" as const, purchaseId: purchase.id };
  });
}

export type OwnedAccountAnalysis = EncryptedAudhdCheckoutAnswers & {
  purchaseId: string; generationId: string; checkoutSessionId: string; paymentIntentId: string; priceId: string;
  reportVersion: string; savedAt: Date; expiresAt: Date;
};
export async function hasOwnedAccountPurchase(userId: string, purchaseId: string) {
  if (!validAccountRecordId(purchaseId)) return false;
  const rows = await database()<{ id: string }[]>`
    select id from public.account_purchases where id = ${purchaseId} and user_id = ${ownerId(userId)} limit 1
  `;
  return rows.length === 1;
}

export async function loadOwnedAccountAnalysis(userId: string, purchaseId: string): Promise<OwnedAccountAnalysis | null> {
  if (!validAccountRecordId(purchaseId)) return null;
  const rows = await database()<Array<{ id: string; stripe_checkout_session_id: string; stripe_payment_intent_id: string; stripe_price_id: string;
    generation_id: string; journal_identity: string; report_version: string; answers_ciphertext: string; encryption_iv: string; encryption_auth_tag: string; saved_at: Date; expires_at: Date }>>`
    select p.id, p.stripe_checkout_session_id, p.stripe_payment_intent_id, p.stripe_price_id,
           a.generation_id, a.journal_identity, a.report_version, a.answers_ciphertext, a.encryption_iv, a.encryption_auth_tag, a.saved_at, a.expires_at
    from public.account_purchases p join public.account_audhd_analyses a on a.purchase_id = p.id
    where p.id = ${purchaseId} and p.user_id = ${ownerId(userId)} and p.revoked_at is null and a.expires_at > now()
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  assertAccountStorageActive();
  if (row.journal_identity !== accountErasureIdentity()) throw new Error("Analysis journal identity mismatch");
  if (await readAnalysisErasure(row.generation_id)) return null;
  return { purchaseId: row.id, generationId: row.generation_id, checkoutSessionId: row.stripe_checkout_session_id, paymentIntentId: row.stripe_payment_intent_id,
    priceId: row.stripe_price_id, reportVersion: row.report_version, ciphertext: row.answers_ciphertext,
    iv: row.encryption_iv, authTag: row.encryption_auth_tag, savedAt: row.saved_at, expiresAt: row.expires_at };
}

/** Erase only the owner's saved copy; history and guest recovery are separate. */
export async function removeOwnedAccountAnalysis(userId: string, purchaseId: string) {
  return eraseOwnedAnalysis(userId, purchaseId, "user_deleted");
}

async function eraseOwnedAnalysis(userId: string, purchaseId: string, reason: ErasureReason, expectedGeneration?: string) {
  if (!validAccountRecordId(purchaseId)) return false;
  return database().begin(async sql => {
    const owned = await sql<{ id: string }[]>`
      select id from public.account_purchases where id = ${purchaseId} and user_id = ${ownerId(userId)} for update
    `;
    if (!owned.length) return false;
    const rows = await sql<{ generation_id: string; journal_identity: string; expired: boolean }[]>`
      select generation_id, journal_identity, expires_at <= now() as expired from public.account_audhd_analyses where purchase_id = ${purchaseId} for update
    `;
    const analysis = rows[0];
    if (analysis && analysis.journal_identity !== accountErasureIdentity()) throw new Error("Analysis journal identity mismatch");
    if (expectedGeneration && analysis?.generation_id !== expectedGeneration) return false;
    if (reason === "expired" && !analysis?.expired) {
      // On restore, an external expiry receipt is authoritative even if the
      // older snapshot has different expiry metadata for this generation.
      if (!analysis || !await readAnalysisErasure(analysis.generation_id)) return false;
    }
    if (analysis) {
      // Receipt survives both a SQL rollback and restoring an older database.
      await writeAnalysisErasure(analysis.generation_id, reason);
      await sql`insert into public.account_analysis_erasure_receipts (generation_id) values (${analysis.generation_id}) on conflict do nothing`;
      await sql`delete from public.account_audhd_analyses where purchase_id = ${purchaseId} and generation_id = ${analysis.generation_id}`;
    }
    await sql`
      update public.account_purchases set analysis_removed_at = now(), analysis_removal_reason = ${reason},
        revoked_at = case when ${reason} = 'revoked' then coalesce(revoked_at, now()) else revoked_at end
      where id = ${purchaseId} and user_id = ${userId}
    `;
    return true;
  });
}

export async function revokeOwnedAccountPurchase(userId: string, purchaseId: string) {
  await eraseOwnedAnalysis(userId, purchaseId, "revoked");
}

/** The scheduled job physically removes payloads, not just their UI links. */
export async function deleteExpiredAccountAnalyses() {
  if (!["active", "maintenance"].includes(accountStorageMode())) throw new Error("Account maintenance disabled");
  await assertErasureJournalAvailable();
  const started = Date.now();
  let deleted = 0;
  for (let batch = 0; batch < 10; batch += 1) {
    if (Date.now() - started > 210000) throw new Error("Cleanup time budget reached; retry required");
    const rows = await database()<{ id: string; user_id: string; generation_id: string }[]>`
      select p.id, p.user_id, a.generation_id from public.account_audhd_analyses a
      join public.account_purchases p on p.id = a.purchase_id where a.expires_at <= now() order by a.expires_at limit 100
    `;
    if (!rows.length) break;
    for (const row of rows) {
      if (Date.now() - started > 210000) throw new Error("Cleanup time budget reached; retry required");
      if (await eraseOwnedAnalysis(row.user_id, row.id, "expired", row.generation_id)) deleted += 1;
    }
  }
  const pending = await database()<{ pending: boolean }[]>`select exists(select 1 from public.account_audhd_analyses where expires_at <= now()) as pending`;
  if (pending[0]?.pending) throw new Error("Cleanup batch incomplete; retry required");
  await database()`
    delete from public.account_analysis_erasure_receipts r where recorded_at < now() - interval '400 days'
    and not exists (select 1 from public.account_audhd_analyses a where a.generation_id = r.generation_id)
  `;
  await database()`
    insert into public.account_analysis_cleanup_state (job_key, last_success_at) values ('account-analysis-cleanup', now())
    on conflict (job_key) do update set last_success_at = excluded.last_success_at
  `;
  return deleted;
}

/** Aggregate-only monitoring. Never exposes customer ids, answers or keys. */
export async function accountCleanupHealth(requireMonitor = true) {
  const rows = await database()<Array<{ healthy: boolean; last_success_at: Date | null; overdue_count: number }>>`
    select coalesce(s.last_success_at > now() - interval '26 hours', false)
      and (${!requireMonitor} or coalesce(s.last_monitor_success_at > now() - interval '26 hours', false))
      and not exists (select 1 from public.account_audhd_analyses where expires_at <= now() - interval '24 hours') as healthy,
      s.last_success_at,
      (select count(*)::int from public.account_audhd_analyses where expires_at <= now() - interval '24 hours') as overdue_count
    from (values ('account-analysis-cleanup')) as job(job_key)
    left join public.account_analysis_cleanup_state s on s.job_key = job.job_key
  `;
  return { healthy: rows[0]?.healthy === true, lastSuccessAt: rows[0]?.last_success_at ?? null, overdueCount: rows[0]?.overdue_count ?? 0 };
}

export async function recordAccountMonitorSuccess() {
  const rows = await database()<{ job_key: string }[]>`update public.account_analysis_cleanup_state set last_monitor_success_at = now() where job_key = 'account-analysis-cleanup' returning job_key`;
  if (rows.length !== 1) throw new Error("Cleanup heartbeat unavailable");
}

/** Operator-only reconciliation; never imports a backup or activates traffic. */
export async function reconcileAccountRestore(snapshotCreatedAt: Date, afterPurchaseId?: string) {
  if (accountStorageMode() !== "maintenance" || !Number.isFinite(snapshotCreatedAt.getTime())
    || snapshotCreatedAt.getTime() > Date.now() || snapshotCreatedAt.getTime() < Date.now() - 7 * 86400000
    || (afterPurchaseId && !validAccountRecordId(afterPurchaseId))) throw new Error("Restore preconditions not met");
  await assertErasureJournalAvailable();
  await database()`delete from public.account_analysis_cleanup_state`;
  let checked = 0, removed = 0, cursor = afterPurchaseId ?? "00000000-0000-0000-0000-000000000000";
  const rows = await database()<{ id: string; user_id: string; generation_id: string; journal_identity: string; expired: boolean }[]>`
    select p.id, p.user_id, a.generation_id, a.journal_identity, a.expires_at <= now() as expired
    from public.account_audhd_analyses a join public.account_purchases p on p.id = a.purchase_id
    where p.id > ${cursor} order by p.id limit 100
  `;
  for (const row of rows) {
    if (row.journal_identity !== accountErasureIdentity()) throw new Error("Restore journal identity mismatch");
    const receipt = await readAnalysisErasure(row.generation_id);
    if (receipt || row.expired) if (await eraseOwnedAnalysis(row.user_id, row.id, receipt?.reason ?? "expired", row.generation_id)) removed += 1;
    checked += 1; cursor = row.id;
  }
  const pending = await database()<{ pending: boolean }[]>`
    select exists(select 1 from public.account_audhd_analyses where purchase_id > ${cursor}) as pending
  `;
  return { checked, removed, complete: !pending[0]?.pending, nextCursor: pending[0]?.pending ? cursor : null };
}

/** Required before deleting Auth users with account analyses; direct cascade
 * without receipts is rejected by the database trigger. Auth deletion itself
 * belongs to the separately approved identity-management workflow.
 */
export async function eraseAccountPortalAnalyses(userId: string) {
  ownerId(userId);
  const rows = await database()<{ id: string }[]>`select id from public.account_purchases where user_id = ${userId} order by id`;
  for (const row of rows) await eraseOwnedAnalysis(userId, row.id, "user_deleted");
}
