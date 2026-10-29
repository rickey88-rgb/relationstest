import postgres from "postgres";
import { accountDatabaseTls } from "../accountDatabaseTls.server";
import { assertAccountPortalEnabled } from "../accountLaunch.server";
import { randomUUID } from "node:crypto";
import { adapter, consentVersion } from "./adapter";
import { context, seal, secretHash } from "./crypto.server";
import { accountErasureIdentity, assertAccountStorageActive, assertErasureJournalAvailable, writeAnalysisErasure } from "../accountErasureJournal.server";

const globals = globalThis as typeof globalThis & { testAccountsSql?: ReturnType<typeof postgres> };
export function db() {
  assertAccountPortalEnabled();
  if (!globals.testAccountsSql) {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) throw new Error("Test storage unavailable");
    globals.testAccountsSql = postgres(url, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10,
      ssl: accountDatabaseTls(), connection: { statement_timeout: 20000, lock_timeout: 5000 } });
  }
  return globals.testAccountsSql;
}
export type Attempt = { id: string; analysis_id: string; product: string; question_version: string; report_version: string;
  browser_hash: string; journal_identity: string; ciphertext: string; session_id: string; price_id: string;
  live_mode: boolean; expires_at: Date };
export type Owned = { id: string; product: string; session_id: string; price_id: string; live_mode: boolean;
  generation_id: string; journal_identity: string; question_version: string; report_version: string; ciphertext: string; expires_at: Date };
export const validId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
export async function createAttempt(product: string, input: unknown, browserSecret: string, price: string) {
  assertAccountStorageActive();
  if (process.env.TEST_ACCOUNTS_STORAGE_MODE !== "active") throw new Error("Test accounts unavailable");
  const model = adapter(product), answers = model.parse(input);
  await assertErasureJournalAvailable();
  const id = randomUUID(), generation = randomUUID();
  const row = { product, question_version: model.questionVersion, report_version: model.reportVersion };
  const ciphertext = seal({ answers, questionVersion: model.questionVersion, reportVersion: model.reportVersion }, context(row, id));
  await db().begin(async tx => {
    // Anonymous endpoint: bound storage/Stripe resource use without storing IPs or answers in a rate-limit log.
    await tx`select pg_advisory_xact_lock(20261026)`;
    const quota = await tx<Array<{ total: number; browser: number }>>`select count(*)::int as total,
      count(*) filter (where browser_hash = ${secretHash(browserSecret)})::int as browser
      from public.test_account_attempts where created_at > now() - interval '1 hour'`;
    if (quota[0].total >= 500 || quota[0].browser >= 10) throw new Error("Checkout temporarily limited");
    await tx`insert into public.test_account_attempts
    (id, analysis_id, product, question_version, report_version, browser_hash, journal_identity, ciphertext, price_id, live_mode, expires_at)
    values (${id}, ${generation}, ${product}, ${model.questionVersion}, ${model.reportVersion}, ${secretHash(browserSecret)},
      ${accountErasureIdentity()}, ${ciphertext}, ${price}, true, now() + interval '7 days')`;
  });
  return id;
}
export async function attempt(id: string) {
  if (!validId(id)) return null;
  return (await db()<Attempt[]>`select * from public.test_account_attempts where id = ${id} and expires_at > now()`)[0] ?? null;
}
export async function bindCheckout(id: string, session: string) {
  const rows = await db()`update public.test_account_attempts set session_id = ${session}
    where id = ${id} and session_id is null and expires_at > now() returning id`;
  if (rows.length !== 1) throw new Error("Attempt unavailable");
}
export async function owned(id: string, owner: string) {
  if (!validId(id)) return null;
  return (await db()<Owned[]>`select p.id, p.product, p.session_id, p.price_id, true as live_mode,
    a.generation_id, a.journal_identity, a.question_version, a.report_version, a.ciphertext, a.expires_at
    from public.test_account_purchases p join public.test_account_analyses a on a.purchase_id = p.id
    where p.id = ${id} and p.owner_id = ${owner} and a.expires_at > now()`)[0] ?? null;
}
export async function list(owner: string) {
  return db()<Array<{ id: string; product: string; purchased_at: Date; expires_at: Date | null }>>`
    select p.id, p.product, p.purchased_at, a.expires_at
    from public.test_account_purchases p left join public.test_account_analyses a on a.purchase_id = p.id
    where p.owner_id = ${owner} order by p.purchased_at desc limit 200`;
}
export async function claim(row: Attempt, owner: string, intent: string, purchasedAt: Date, savedCiphertext: string) {
  return db().begin(async tx => {
    // Lock the original attempt to serialize claim, deletion and cleanup. Never take an owner from the client.
    const current = await tx<Attempt[]>`select * from public.test_account_attempts where id = ${row.id} and expires_at > now() for update`;
    if (current[0]?.ciphertext !== row.ciphertext || current[0]?.session_id !== row.session_id) throw new Error("Attempt changed");
    await tx`insert into public.test_account_purchases(id, owner_id, product, session_id, price_id, payment_intent_id, purchased_at, amount, currency)
      values (${row.id}, ${owner}, ${row.product}, ${row.session_id}, ${row.price_id}, ${intent}, ${purchasedAt}, ${adapter(row.product).amount}, 'sek')
      on conflict (id) do nothing`;
    const owners = await tx`select owner_id from public.test_account_purchases where id = ${row.id} for update`;
    if (owners[0]?.owner_id !== owner) throw new Error("Purchase already claimed");
    if ((await tx`select 1 from public.test_account_erasure_receipts where generation_id = ${row.analysis_id}`).length) throw new Error("Analysis erased");
    await tx`insert into public.test_account_analyses(purchase_id, generation_id, journal_identity, product, question_version, report_version, ciphertext, consent_version, expires_at)
      values (${row.id}, ${row.analysis_id}, ${row.journal_identity}, ${row.product}, ${row.question_version}, ${row.report_version},
      ${savedCiphertext}, ${consentVersion}, now() + interval '12 months' - interval '10 days') on conflict (purchase_id) do nothing`;
    return row.id;
  });
}
export async function erase(id: string, owner: string | null, reason: "user_deleted" | "expired" | "revoked") {
  // Expired rows are deliberately included here, unlike the report reader.
  const rows = await db()<Array<{ generation_id: string; journal_identity: string }>>`select a.generation_id, a.journal_identity from public.test_account_analyses a
    join public.test_account_purchases p on p.id = a.purchase_id
    where p.id = ${id} and (${owner}::uuid is null or p.owner_id = ${owner}::uuid)`;
  if (!rows[0]) return;
  if (rows[0].journal_identity !== accountErasureIdentity()) throw new Error("Journal identity mismatch");
  const generation = rows[0].generation_id;
  await writeAnalysisErasure(generation, reason); // durable external journal FIRST; fails closed
  await db().begin(async tx => {
    await tx`insert into public.test_account_erasure_receipts(generation_id) values (${generation}) on conflict do nothing`;
    await tx`delete from public.test_account_analyses where purchase_id = ${id} and generation_id = ${generation}`;
    await tx`delete from public.test_account_attempts where id = ${id}`;
  });
}
