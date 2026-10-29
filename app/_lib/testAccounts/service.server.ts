import { adapter, assertFlag, consentVersion } from "./adapter";
import { context, matchesSecret, seal, unseal } from "./crypto.server";
import { verifyPayment } from "./payment.server";
import * as store from "./store.server";
import { accountErasureIdentity, assertAccountStorageActive, readAnalysisErasure } from "../accountErasureJournal.server";
import type { Result as AdhdResult } from "../../adhd-test/test/model";

export function active() {
  assertAccountStorageActive();
  if (process.env.TEST_ACCOUNTS_STORAGE_MODE !== "active") throw new Error("Test accounts unavailable");
}
export async function notErased(generation: string, identity: string) {
  if (identity !== accountErasureIdentity() || await readAnalysisErasure(generation)) throw new Error("Analysis unavailable");
}
function payload(row: { product: string; question_version: string; report_version: string; ciphertext: string }, id: string, owner?: string, purchase?: string) {
  const model = adapter(row.product);
  if (model.questionVersion !== row.question_version || model.reportVersion !== row.report_version) throw new Error("Unsupported report version");
  const data = unseal(row.ciphertext, context(row, id, owner, purchase));
  const answers = model.parse(data);
  return { data, result: model.calculate(answers) };
}
export async function guest(id: string, secret: string) {
  const checked = await guestForProduct(id, secret, "adhd_test");
  return { ...checked, result: checked.result as AdhdResult };
}
export async function guestForProduct(id: string, secret: string, expectedProduct: string) {
  active(); // Also closes guest reads in restore quarantine; an Auth account is still never required.
  const row = await store.attempt(id);
  if (!row || row.product !== expectedProduct || !matchesSecret(secret, row.browser_hash)) throw new Error("Attempt unavailable");
  await notErased(row.analysis_id, row.journal_identity);
  const payment = await verifyPayment(row);
  const current = await store.attempt(id);
  if (!current || current.ciphertext !== row.ciphertext || current.session_id !== row.session_id) throw new Error("Attempt changed");
  await notErased(row.analysis_id, row.journal_identity);
  return { row, payment, ...payload(row, row.id) };
}
export async function save(id: string, secret: string, owner: string, consent: string, expectedProduct?: string) {
  active();
  const candidate = await store.attempt(id);
  if (!candidate || (expectedProduct && candidate.product !== expectedProduct)) throw new Error("Attempt unavailable");
  assertFlag(candidate.product, "save");
  if (consent !== consentVersion) throw new Error("Explicit storage consent required");
  const health = await store.db()<Array<{ healthy: boolean }>>`select last_success_at > now() - interval '26 hours'
    and last_monitor_at > now() - interval '26 hours' as healthy from public.test_account_cleanup_state where id = true`;
  if (!health[0]?.healthy) throw new Error("Daily cleanup unavailable");
  const checked = await guestForProduct(id, secret, candidate.product);
  const cipher = seal(checked.data, context(checked.row, checked.row.analysis_id, owner, checked.row.id));
  await notErased(checked.row.analysis_id, checked.row.journal_identity);
  await store.claim(checked.row, owner, checked.payment.intentId, checked.payment.purchasedAt, cipher);
  try { await notErased(checked.row.analysis_id, checked.row.journal_identity); }
  catch (error) { await store.erase(id, owner, "user_deleted"); throw error; }
  return id;
}
export async function open(id: string, owner: string) {
  return await openForProduct(id, owner, "adhd_test") as AdhdResult;
}
export async function openForProduct(id: string, owner: string, expectedProduct: string) {
  active();
  const row = await store.owned(id, owner); // owner predicate BEFORE Stripe, journal or decryption
  if (!row || row.product !== expectedProduct) throw new Error("Analysis unavailable");
  assertFlag(row.product, "read");
  await notErased(row.generation_id, row.journal_identity);
  try { await verifyPayment(row); }
  catch (error) {
    if (error instanceof Error && error.message === "Payment revoked") await store.erase(id, owner, "revoked");
    throw error;
  }
  const current = await store.owned(id, owner);
  if (!current || current.generation_id !== row.generation_id || current.ciphertext !== row.ciphertext) throw new Error("Analysis changed");
  await notErased(row.generation_id, row.journal_identity);
  return payload(row, row.generation_id, owner, row.id).result;
}
export async function remove(id: string, owner: string) {
  active(); // Remains available when new saving/reading is disabled.
  await store.erase(id, owner, "user_deleted");
}

/** Separate legacy-import boundary. No existing ADHD flow provides a purchase-possession grant.
 * A future provider must verify that proof server-side AND attest the historical question version.
 * Email, session-id knowledge, localStorage and paid=true are never accepted by this function.
 */
export function prepareLegacyImport(untrusted: unknown): never {
  void untrusted;
  assertFlag("adhd_test", "legacyImport");
  throw new Error("Legacy purchase-possession verification is not available; no analysis imported");
}
