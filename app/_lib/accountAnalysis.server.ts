import { loadOwnedAccountAnalysis, revokeOwnedAccountPurchase } from "./accountPurchasesDb.server";
import { verifyAccountAudhdPayment } from "./accountAudhdPayment.server";
import { decryptAudhdCheckoutAnswers } from "./audhdCheckoutAttempt.server";
import { calculateReport, REPORT_VERSION } from "../audhd-test/test/model";

/** Account ownership is checked before any Stripe request or decryption.
 * The account copy is independent of short-lived guest/recovery records.
 */
export async function openOwnedAccountAnalysis(userId: string, purchaseId: string) {
  try {
    const record = await loadOwnedAccountAnalysis(userId, purchaseId);
    if (!record) return { kind: "not_found" as const };
    const check = await verifyAccountAudhdPayment(record.checkoutSessionId);
    if (check.kind === "unavailable") return { kind: "unavailable" as const };
    if (check.kind !== "verified" || check.payment.paymentIntentId !== record.paymentIntentId || check.payment.priceId !== record.priceId) {
      if (check.kind === "revoked") await revokeOwnedAccountPurchase(userId, purchaseId);
      return { kind: "not_found" as const };
    }
    // Concurrent deletion/revocation/expiry must also fail closed.
    const current = await loadOwnedAccountAnalysis(userId, purchaseId);
    if (!current || current.generationId !== record.generationId || current.checkoutSessionId !== record.checkoutSessionId || current.paymentIntentId !== record.paymentIntentId
      || current.priceId !== record.priceId || current.iv !== record.iv || current.authTag !== record.authTag
      || current.ciphertext !== record.ciphertext || current.reportVersion !== REPORT_VERSION) return { kind: "not_found" as const };
    const answers = decryptAudhdCheckoutAnswers(current);
    if (!answers) return { kind: "unavailable" as const };
    return { kind: "available" as const, report: calculateReport(answers.answers, answers.contextAnswers), expiresAt: current.expiresAt };
  } catch { return { kind: "unavailable" as const }; }
}
