import { db, erase } from "./store.server";
import { active, notErased } from "./service.server";
import { assertErasureJournalAvailable } from "../accountErasureJournal.server";
import { hasCleanupContext } from "../accountCleanupContext.server";

export function monitorUrl() {
  const value = process.env.TEST_ACCOUNTS_HEALTHCHECKS_URL ?? "";
  if (!/^https:\/\/hc-ping\.com\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
    || value === process.env.ACCOUNT_CLEANUP_HEALTHCHECKS_URL) throw new Error("Separate cleanup monitor required");
  return value;
}
async function ping(failed = false) {
  const response = await fetch(monitorUrl() + (failed ? "/fail" : ""), { method: "POST", body: "", redirect: "error",
    signal: AbortSignal.timeout(3000), cache: "no-store" });
  if (!response.ok) throw new Error("Monitor unavailable");
}
export async function cleanup() {
  if (!hasCleanupContext("tests")) active();
  monitorUrl(); await assertErasureJournalAvailable();
  try {
    const started = Date.now();
    for (let batch = 0; batch < 10; batch++) {
      const rows = await db()<Array<{ purchase_id: string }>>`select purchase_id from public.test_account_analyses
        where expires_at <= now() order by expires_at limit 100`;
      if (!rows.length) break;
      for (const row of rows) {
        if (Date.now() - started > 210000) throw new Error("Cleanup incomplete");
        await erase(row.purchase_id, null, "expired");
      }
    }
    await db()`delete from public.test_account_attempts where expires_at <= now()`;
    const remaining = await db()`select 1 from public.test_account_analyses where expires_at <= now() limit 1`;
    if (remaining.length) throw new Error("Cleanup backlog");
    await db()`update public.test_account_cleanup_state set last_success_at = now() where id = true`;
    await ping();
    await db()`update public.test_account_cleanup_state set last_monitor_at = now() where id = true`;
  } catch (error) {
    try { await ping(true); } catch { /* Missing successful ping also alarms externally. */ }
    throw error;
  }
}
export async function health() {
  if (!hasCleanupContext("tests")) active();
  monitorUrl(); await assertErasureJournalAvailable();
  const rows = await db()<Array<{ healthy: boolean }>>`select last_success_at > now() - interval '26 hours'
    and last_monitor_at > now() - interval '26 hours'
    and not exists(select 1 from public.test_account_analyses where expires_at < now() - interval '24 hours') as healthy
    from public.test_account_cleanup_state where id = true`;
  return rows[0]?.healthy === true;
}
export async function eraseOwner(owner: string) {
  if (process.env.TEST_ACCOUNTS_STORAGE_MODE !== "maintenance" || process.env.ACCOUNT_STORAGE_MODE !== "maintenance") throw new Error("Maintenance required");
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(owner)) throw new Error("Invalid owner");
  await assertErasureJournalAvailable();
  const rows = await db()<Array<{ purchase_id: string }>>`select a.purchase_id from public.test_account_analyses a
    join public.test_account_purchases p on p.id = a.purchase_id where p.owner_id = ${owner} limit 100`;
  for (const row of rows) await erase(row.purchase_id, owner, "user_deleted");
  return { removed: rows.length, complete: rows.length < 100 };
}
/** Run only while BOTH account storage modes are maintenance. Never reopen until complete=true.
 * Caller must attest an independently checked backup timestamp <=7 days old (journal TTL400d).
 */
export async function reconcile(snapshotAt: string, after = "00000000-0000-0000-0000-000000000000") {
  if (process.env.TEST_ACCOUNTS_STORAGE_MODE !== "maintenance" || process.env.ACCOUNT_STORAGE_MODE !== "maintenance") throw new Error("Maintenance required");
  const age = Date.now() - new Date(snapshotAt).getTime();
  if (!Number.isFinite(age) || age < 0 || age > 7 * 86400000 || !/^[a-f0-9-]{36}$/i.test(after)) throw new Error("Backup outside verified window");
  await assertErasureJournalAvailable();
  const rows = await db()<Array<{ purchase_id: string; generation_id: string; journal_identity: string; expires_at: Date }>>`
    select purchase_id, generation_id, journal_identity, expires_at from public.test_account_analyses
    where purchase_id > ${after}::uuid order by purchase_id limit 100`;
  let removed = 0;
  for (const row of rows) {
    // Identity mismatch and journal outage MUST abort, never treat an unreadable journal as a deletion.
    const { accountErasureIdentity, readAnalysisErasure } = await import("../accountErasureJournal.server");
    if (row.journal_identity !== accountErasureIdentity()) throw new Error("Journal identity mismatch");
    const receipt = await readAnalysisErasure(row.generation_id);
    if (receipt || row.expires_at <= new Date()) { await erase(row.purchase_id, null, receipt ? "user_deleted" : "expired"); removed++; }
    else await notErased(row.generation_id, row.journal_identity);
  }
  // Drafts can otherwise reintroduce an erased saved analysis from an old backup.
  const drafts = await db()<Array<{ id: string; analysis_id: string; journal_identity: string }>>`select id, analysis_id, journal_identity
    from public.test_account_attempts where id > ${after}::uuid order by id limit 100`;
  for (const row of drafts) {
    const { accountErasureIdentity, readAnalysisErasure } = await import("../accountErasureJournal.server");
    if (row.journal_identity !== accountErasureIdentity()) throw new Error("Journal identity mismatch");
    if (await readAnalysisErasure(row.analysis_id)) await db()`delete from public.test_account_attempts where id = ${row.id}`;
  }
  await db()`delete from public.test_account_attempts where expires_at <= now()`;
  // Advance using the lower cursor when either stream fills a page; no rows may be skipped.
  const cursors = [rows.length === 100 ? rows[99].purchase_id : null, drafts.length === 100 ? drafts[99].id : null].filter((v): v is string => v !== null).sort();
  return { checked: rows.length, removed, complete: cursors.length === 0, nextCursor: cursors[0] ?? null };
}
