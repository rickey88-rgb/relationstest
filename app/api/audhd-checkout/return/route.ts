import { NextRequest, NextResponse } from "next/server";
import { AUDHD_CHECKOUT_ACCESS_COOKIE, AUDHD_CHECKOUT_ATTEMPT_COOKIE, hashAudhdCheckoutBrowserSecret, issueAudhdCheckoutAccessToken } from "../../../_lib/audhdCheckoutAttempt.server";
import { finalizeVerifiedAudhdCheckout } from "../../../_lib/audhdCheckoutAttemptsDb.server";
import { verifyAudhdCheckoutPayment } from "../../../_lib/audhdCheckoutPayment.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const SITE_ORIGIN = "https://www.relationsvarning.se";

function destination(unavailable = false) {
  // Never derive a post-payment redirect target from a request Host header.
  const url = new URL("/audhd-test/test", SITE_ORIGIN);
  if (unavailable) url.searchParams.set("checkout", "unavailable");
  return url;
}

function response(unavailable = false) {
  const result = NextResponse.redirect(destination(unavailable), 303);
  result.headers.set("Cache-Control", "no-store");
  result.headers.set("Referrer-Policy", "no-referrer");
  result.headers.set("X-Content-Type-Options", "nosniff");
  return result;
}

/** Stripe sends the Session ID here; this route strips it before the test page loads. */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id") ?? "";
  const browserSecret = request.cookies.get(AUDHD_CHECKOUT_ATTEMPT_COOKIE)?.value ?? "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(browserSecret)) return response(true);
  try {
    const verified = await verifyAudhdCheckoutPayment(sessionId);
    if (!verified.verified) return response(true);
    const paidAttempt = await finalizeVerifiedAudhdCheckout({
      browserSecretHash: hashAudhdCheckoutBrowserSecret(browserSecret),
      checkoutReferenceId: verified.checkoutReferenceId,
      checkoutSessionId: verified.checkoutSessionId,
      paymentIntentId: verified.paymentIntentId,
    });
    if (!paidAttempt) return response(true);

    const maxAge = Math.max(1, Math.floor((paidAttempt.accessExpiresAt.getTime() - Date.now()) / 1000));
    const result = response();
    result.cookies.set(AUDHD_CHECKOUT_ATTEMPT_COOKIE, browserSecret, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
    result.cookies.set(AUDHD_CHECKOUT_ACCESS_COOKIE, issueAudhdCheckoutAccessToken(paidAttempt.id, paidAttempt.accessExpiresAt), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
    return result;
  } catch {
    return response(true);
  }
}
