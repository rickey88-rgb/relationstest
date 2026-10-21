import { createHash } from "node:crypto";
import { createAutomaticAudhdRecoveryGrant, discardUndeliveredAutomaticAudhdRecoveryGrant } from "./audhdRecoveryDb.server";
import { hashAudhdRecoveryToken, issueAudhdRecoveryToken } from "./audhdRecovery.server";
import { AudhdRecoveryEmailRejected, isAudhdRecoveryEmailConfigured, sendAudhdRecoveryEmail } from "./audhdRecoveryEmail.server";

const RECOVERY_ORIGIN = "https://www.relationsvarning.se";
type VerifiedPayment = { checkoutSessionId: string; paymentIntentId: string; priceId: string; customerEmail: string | null };
export type AudhdAutomaticRecoveryResult = { kind: "unavailable" | "existing" | "database_failed" | "delivery_failed" | "delivery_unknown" } | { kind: "accepted" };

/** A Stripe Session URL can request mail, but can never return a report itself. */
export async function sendAutomaticAudhdRecovery(payment: VerifiedPayment): Promise<AudhdAutomaticRecoveryResult> {
  if (!payment.customerEmail || !isAudhdRecoveryEmailConfigured()) return { kind: "unavailable" as const };
  const token = issueAudhdRecoveryToken();
  let grant;
  try {
    grant = await createAutomaticAudhdRecoveryGrant({ tokenHash: hashAudhdRecoveryToken(token), checkoutSessionId: payment.checkoutSessionId, paymentIntentId: payment.paymentIntentId, priceId: payment.priceId });
  } catch {
    return { kind: "database_failed" };
  }
  if (grant.kind !== "created") return { kind: "existing" as const };
  const recoveryUrl = new URL("/api/audhd-recovery/redeem", RECOVERY_ORIGIN);
  recoveryUrl.searchParams.set("token", token);
  try {
    await sendAudhdRecoveryEmail({
      to: payment.customerEmail,
      recoveryUrl: recoveryUrl.toString(),
      // Resend keeps this deduplication key for 24h. The database uniqueness
      // constraint remains the durable cross-job protection after that.
      idempotencyKey: `audhd-recovery/${createHash("sha256").update(payment.checkoutSessionId).digest("hex")}`,
    });
  } catch (error) {
    // A definite HTTP rejection means Resend did not accept the message, so a
    // future, separately verified delivery event may safely make one new
    // delivery attempt. Network errors and timeouts retain the grant.
    if (error instanceof AudhdRecoveryEmailRejected) {
      try {
        return await discardUndeliveredAutomaticAudhdRecoveryGrant({ id: grant.id, checkoutSessionId: payment.checkoutSessionId })
          ? { kind: "delivery_failed" }
          : { kind: "delivery_unknown" };
      } catch {
        return { kind: "delivery_unknown" };
      }
    }
    // A timeout is ambiguous: Resend may have accepted the message. Keep the
    // single grant so no later webhook delivery can issue a second link/email.
    return { kind: "delivery_unknown" };
  }
  // Resend accepted the request; that is not proof that the recipient received it.
  return { kind: "accepted" as const };
}
