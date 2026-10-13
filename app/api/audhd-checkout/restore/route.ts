import { NextRequest, NextResponse } from "next/server";
import { AUDHD_CHECKOUT_ACCESS_COOKIE, AUDHD_CHECKOUT_ATTEMPT_COOKIE, decryptAudhdCheckoutAnswers, hashAudhdCheckoutBrowserSecret, verifyAudhdCheckoutAccessToken } from "../../../_lib/audhdCheckoutAttempt.server";
import { loadAudhdCheckoutRestoreRecord, revokeAudhdCheckoutAccessForPaymentIntent } from "../../../_lib/audhdCheckoutAttemptsDb.server";
import { verifyAudhdCheckoutPayment } from "../../../_lib/audhdCheckoutPayment.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unavailable() {
  return NextResponse.json({ restored: false }, { status: 404, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", Vary: "Cookie" } });
}

/** Returns only answer values, never payment identifiers, when both cookies and DB entitlement match. */
export async function GET(request: NextRequest) {
  const access = verifyAudhdCheckoutAccessToken(request.cookies.get(AUDHD_CHECKOUT_ACCESS_COOKIE)?.value ?? null);
  const browserSecret = request.cookies.get(AUDHD_CHECKOUT_ATTEMPT_COOKIE)?.value ?? "";
  if (!access || !/^[A-Za-z0-9_-]{43}$/.test(browserSecret)) return unavailable();
  try {
    const browserSecretHash = hashAudhdCheckoutBrowserSecret(browserSecret);
    const record = await loadAudhdCheckoutRestoreRecord(access.attemptId, browserSecretHash);
    if (!record) return unavailable();

    // Webhooks make revocation durable, but every restore independently checks
    // Stripe and fails closed if Stripe is unavailable or the payment changed.
    const payment = await verifyAudhdCheckoutPayment(record.checkoutSessionId);
    if (!payment.verified || payment.paymentIntentId !== record.paymentIntentId) {
      if (!payment.verified && (payment.reason === "payment_refunded" || payment.reason === "payment_disputed")) {
        try { await revokeAudhdCheckoutAccessForPaymentIntent(record.paymentIntentId); } catch { /* Deny this response even if durable revocation retries through Stripe webhook. */ }
      }
      return unavailable();
    }

    // Re-read after the Stripe check so a concurrent signed webhook revocation
    // cannot race a previously loaded entitlement into a response.
    const current = await loadAudhdCheckoutRestoreRecord(access.attemptId, browserSecretHash);
    const answers = current && decryptAudhdCheckoutAnswers(current);
    if (!answers) return unavailable();
    return NextResponse.json({ restored: true, answers }, { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", Vary: "Cookie" } });
  } catch { return unavailable(); }
}
