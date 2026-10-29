import { createHash } from "node:crypto";
import { AUDHD_CHECKOUT_ACCESS_COOKIE, AUDHD_CHECKOUT_ATTEMPT_COOKIE, verifyAudhdCheckoutAccessToken,
  hashAudhdCheckoutBrowserSecret, decryptAudhdCheckoutAnswers, type EncryptedAudhdCheckoutAnswers } from "./audhdCheckoutAttempt.server";
import { loadAudhdCheckoutRestoreRecord } from "./audhdCheckoutAttemptsDb.server";
import { AUDHD_RECOVERY_COOKIE, verifyAudhdBrowserUnlockToken } from "./audhdRecovery.server";
import { loadAudhdRecoveryRestoreRecord } from "./audhdRecoveryDb.server";
import { verifyAccountAudhdPayment, type AccountPayment } from "./accountAudhdPayment.server";
import { loadAccountRecoveryPurchase } from "./accountPurchasesDb.server";

export type AccountProofKind = "checkout" | "recovery";
type CookieReader = { get(name: string): { value: string } | undefined };
export type AccountAudhdProof = { kind: "verified"; source: AccountProofKind; payment: AccountPayment;
  encrypted: EncryptedAudhdCheckoutAnswers | null; fingerprint: string } | { kind: "denied" | "unavailable" };
type Candidate = { checkoutSessionId: string; paymentIntentId: string; priceId?: string; encrypted: EncryptedAudhdCheckoutAnswers | null };

export function purchaseFingerprint(sessionId: string) {
  return createHash("sha256").update(`account-purchase-preview-v1:${sessionId}`).digest("hex");
}

/** Both proof paths use existing read-only recovery/checkout helpers. They do
 * not consume, reissue or extend a guest token, and do not accept a payment id.
 */
export async function resolveAccountAudhdProof(source: AccountProofKind, cookies: CookieReader): Promise<AccountAudhdProof> {
  try {
    const load: (() => Promise<Candidate | null>) | null = (() => {
      if (source === "checkout") {
        const access = verifyAudhdCheckoutAccessToken(cookies.get(AUDHD_CHECKOUT_ACCESS_COOKIE)?.value ?? null);
        const secret = cookies.get(AUDHD_CHECKOUT_ATTEMPT_COOKIE)?.value ?? "";
        if (!access || !/^[A-Za-z0-9_-]{43}$/.test(secret)) return null;
        return async () => {
          const record = await loadAudhdCheckoutRestoreRecord(access.attemptId, hashAudhdCheckoutBrowserSecret(secret));
          return record ? { ...record, encrypted: { ciphertext: record.ciphertext, iv: record.iv, authTag: record.authTag } } : null;
        };
      }
      if (source === "recovery") {
        const access = verifyAudhdBrowserUnlockToken(cookies.get(AUDHD_RECOVERY_COOKIE)?.value ?? null);
        return access ? async () => {
          const report = await loadAudhdRecoveryRestoreRecord(access.grantId);
          if (report) return { ...report, encrypted: { ciphertext: report.ciphertext, iv: report.iv, authTag: report.authTag } };
          const purchase = await loadAccountRecoveryPurchase(access.grantId);
          return purchase ? { ...purchase, encrypted: null } : null;
        } : null;
      }
      return null;
    })();
    if (!load) return { kind: "denied" };
    const record = await load();
    if (!record) return { kind: "denied" };
    const checked = await verifyAccountAudhdPayment(record.checkoutSessionId);
    if (checked.kind === "unavailable") return checked;
    if (checked.kind !== "verified" || checked.payment.paymentIntentId !== record.paymentIntentId
      || (record.priceId && record.priceId !== checked.payment.priceId)) return { kind: "denied" };
    // Re-read to catch a concurrent revocation/removal while Stripe was checked.
    const current = await load();
    if (!current || current.checkoutSessionId !== record.checkoutSessionId || current.paymentIntentId !== record.paymentIntentId
      || current.priceId !== record.priceId || current.encrypted?.iv !== record.encrypted?.iv
      || current.encrypted?.authTag !== record.encrypted?.authTag || current.encrypted?.ciphertext !== record.encrypted?.ciphertext
      || (current.encrypted && !decryptAudhdCheckoutAnswers(current.encrypted))) return { kind: "denied" };
    return { kind: "verified", source, payment: checked.payment,
      encrypted: current.encrypted, fingerprint: purchaseFingerprint(current.checkoutSessionId) };
  } catch { return { kind: "unavailable" }; }
}
