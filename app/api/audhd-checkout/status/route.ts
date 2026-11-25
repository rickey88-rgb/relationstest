import { checkoutMarket, marketCookie } from "../../../_content/market";
import { NextRequest, NextResponse } from "next/server";
import { AUDHD_CHECKOUT_ACCESS_COOKIE, AUDHD_CHECKOUT_ATTEMPT_COOKIE, hashAudhdCheckoutBrowserSecret, issueAudhdCheckoutAccessToken } from "../../../_lib/audhdCheckoutAttempt.server";
import { finalizeVerifiedAudhdCheckout, loadAudhdCheckoutPendingRecord } from "../../../_lib/audhdCheckoutAttemptsDb.server";
import { verifyAudhdCheckoutPayment } from "../../../_lib/audhdCheckoutPayment.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function response(status: "ready" | "pending" | "unavailable", code: number) {
  return NextResponse.json({ status }, { status: code, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", Vary: "Cookie" } });
}

/**
 * Retries only the already-bound Session belonging to the same browser secret.
 * No Checkout Session value is accepted from a query string or request body.
 */
export async function GET(request: NextRequest) {
  const market = checkoutMarket(request);
  const browserSecret = request.cookies.get(marketCookie(AUDHD_CHECKOUT_ATTEMPT_COOKIE, market))?.value ?? "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(browserSecret)) return response("unavailable", 404);
  try {
    const browserSecretHash = hashAudhdCheckoutBrowserSecret(browserSecret);
    const pending = await loadAudhdCheckoutPendingRecord(browserSecretHash);
    if (!pending) return response("unavailable", 404);
    const payment = await verifyAudhdCheckoutPayment(pending.checkoutSessionId, market);
    if (!payment.verified) {
      return (payment.reason === "session_not_paid" || payment.reason === "stripe_request_failed") ? response("pending", 202) : response("unavailable", 404);
    }
    if (payment.checkoutReferenceId !== pending.checkoutReferenceId) return response("unavailable", 404);
    const paidAttempt = await finalizeVerifiedAudhdCheckout({ browserSecretHash, checkoutReferenceId: payment.checkoutReferenceId, checkoutSessionId: payment.checkoutSessionId, paymentIntentId: payment.paymentIntentId });
    if (!paidAttempt) return response("unavailable", 404);

    const maxAge = Math.max(1, Math.floor((paidAttempt.accessExpiresAt.getTime() - Date.now()) / 1000));
    const result = response("ready", 200);
    result.cookies.set(marketCookie(AUDHD_CHECKOUT_ACCESS_COOKIE, market), issueAudhdCheckoutAccessToken(paidAttempt.id, paidAttempt.accessExpiresAt), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
    return result;
  } catch {
    return response("pending", 202);
  }
}
