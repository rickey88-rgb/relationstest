import { NextRequest, NextResponse } from "next/server";
import { decryptAudhdCheckoutAnswers } from "../../../_lib/audhdCheckoutAttempt.server";
import { AUDHD_RECOVERY_COOKIE, verifyAudhdBrowserUnlockToken } from "../../../_lib/audhdRecovery.server";
import { loadAudhdRecoveryRestoreRecord, revokeAudhdRecoveryGrantsForPaymentIntent } from "../../../_lib/audhdRecoveryDb.server";
import { inspectAudhdCheckoutSession } from "../../../_lib/audhdRecoveryPayment.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unavailable() {
  return NextResponse.json({ restored: false }, { status: 404, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", Vary: "Cookie" } });
}

function logRestoreFailure(reason: "record_missing" | "stripe_verification_failed" | "decrypt_failed" | "restore_query_failed") {
  console.error(JSON.stringify({ event: "audhd_recovery_restore_unavailable", reason }));
}

/** A redeemed recovery link can restore only its own server-encrypted attempt. */
export async function GET(request: NextRequest) {
  const access = verifyAudhdBrowserUnlockToken(request.cookies.get(AUDHD_RECOVERY_COOKIE)?.value ?? null);
  if (!access) return unavailable();
  try {
    const record = await loadAudhdRecoveryRestoreRecord(access.grantId);
    if (!record) {
      logRestoreFailure("record_missing");
      return unavailable();
    }
    const payment = await inspectAudhdCheckoutSession(record.checkoutSessionId);
    if (!payment.verified || payment.paymentIntentId !== record.paymentIntentId || payment.priceId !== record.priceId) {
      if (!payment.verified && (payment.reason === "payment_refunded" || payment.reason === "payment_disputed")) {
        await revokeAudhdRecoveryGrantsForPaymentIntent(record.paymentIntentId);
      }
      logRestoreFailure("stripe_verification_failed");
      return unavailable();
    }
    const answers = decryptAudhdCheckoutAnswers(record);
    if (!answers) {
      logRestoreFailure("decrypt_failed");
      return unavailable();
    }
    return NextResponse.json({ restored: true, answers }, { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", Vary: "Cookie" } });
  } catch {
    logRestoreFailure("restore_query_failed");
    return unavailable();
  }
}
