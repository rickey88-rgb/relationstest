import { norwayCheckoutOrigin } from "../../../_lib/norwayLaunch.server";
import { checkoutMarket, marketCookie, norwegian, type Market } from "../../../_content/market";
import { NextRequest, NextResponse } from "next/server";
import { AUDHD_CHECKOUT_ACCESS_COOKIE, AUDHD_CHECKOUT_ATTEMPT_COOKIE, hashAudhdCheckoutBrowserSecret, issueAudhdCheckoutAccessToken } from "../../../_lib/audhdCheckoutAttempt.server";
import { finalizeVerifiedAudhdCheckout, hasAudhdCheckoutRecoveryCandidate } from "../../../_lib/audhdCheckoutAttemptsDb.server";
import { verifyAudhdCheckoutPayment, type AudhdCheckoutPaymentVerification } from "../../../_lib/audhdCheckoutPayment.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const SITE_ORIGIN = "https://www.relationsvarning.se";

type ReturnState = "unavailable" | "pending" | "recovery";
type ReturnOutcome = "access_issued" | "cookie_missing" | "browser_binding_mismatch" | "payment_pending" | "stripe_verification_failed" | "database_finalization_failed";

function destination(market: Market, state?: ReturnState) {
  // Never derive a post-payment redirect target from a request Host header.
  const url = new URL(market === "no" ? norwegian.questionnaire : "/audhd-test/test", market === "no" ? norwayCheckoutOrigin() : SITE_ORIGIN);
  if (state) url.searchParams.set("checkout", state);
  return url;
}

function response(market: Market, state?: ReturnState) {
  const result = NextResponse.redirect(destination(market, state), 303);
  result.headers.set("Cache-Control", "no-store");
  result.headers.set("Referrer-Policy", "no-referrer");
  result.headers.set("X-Content-Type-Options", "nosniff");
  return result;
}

function safeErrorClass(error: unknown) {
  return error instanceof Error && ["Error", "PostgresError", "TypeError"].includes(error.name) ? error.name : "unknown";
}

/** Never includes cookies, Stripe IDs, emails, tokens, answers, IPs, or user agents. */
function logReturn(outcome: ReturnOutcome, details: Record<string, string | boolean> = {}) {
  console.info(JSON.stringify({ event: "audhd_checkout_return", outcome, ...details }));
}

function retryable(payment: AudhdCheckoutPaymentVerification) {
  return !payment.verified && (payment.reason === "session_not_paid" || payment.reason === "stripe_request_failed");
}

async function hasAutomaticRecoveryCandidate(payment: Extract<AudhdCheckoutPaymentVerification, { verified: true }>) {
  return hasAudhdCheckoutRecoveryCandidate({ checkoutReferenceId: payment.checkoutReferenceId, checkoutSessionId: payment.checkoutSessionId });
}

/** Stripe sends the Session ID here; this route strips it before the test page loads. */
export async function GET(request: NextRequest) {
  const market = checkoutMarket(request);
  const sessionId = request.nextUrl.searchParams.get("session_id") ?? "";
  const browserSecret = request.cookies.get(marketCookie(AUDHD_CHECKOUT_ATTEMPT_COOKIE, market))?.value ?? "";
  const browserSecretValid = /^[A-Za-z0-9_-]{43}$/.test(browserSecret);

  // A context switch may lose the browser secret. Stripe can prove payment,
  // but only a one-time link delivered to the purchaser email can restore it.
  if (!browserSecretValid) {
    const payment = await verifyAudhdCheckoutPayment(sessionId, market);
    if (!payment.verified) {
      logReturn("cookie_missing", { stripe_reason: payment.reason, retryable: retryable(payment) });
      return response(market, retryable(payment) ? "pending" : "unavailable");
    }
    try { if (await hasAutomaticRecoveryCandidate(payment)) return response(market, "recovery"); }
    catch (error) { logReturn("cookie_missing", { error_class: safeErrorClass(error) }); }
    logReturn("cookie_missing");
    return response(market, "unavailable");
  }
  try {
    const verified = await verifyAudhdCheckoutPayment(sessionId, market);
    if (!verified.verified) {
      logReturn(retryable(verified) ? "payment_pending" : "stripe_verification_failed", { stripe_reason: verified.reason, retryable: retryable(verified) });
      return response(market, retryable(verified) ? "pending" : "unavailable");
    }
    let paidAttempt;
    try {
      paidAttempt = await finalizeVerifiedAudhdCheckout({
        browserSecretHash: hashAudhdCheckoutBrowserSecret(browserSecret),
        checkoutReferenceId: verified.checkoutReferenceId,
        checkoutSessionId: verified.checkoutSessionId,
        paymentIntentId: verified.paymentIntentId,
      });
    } catch (error) {
      logReturn("database_finalization_failed", { error_class: safeErrorClass(error) });
      return response(market, "pending");
    }
    if (!paidAttempt) {
      try { if (await hasAutomaticRecoveryCandidate(verified)) return response(market, "recovery"); }
      catch (error) { logReturn("browser_binding_mismatch", { error_class: safeErrorClass(error) }); }
      logReturn("browser_binding_mismatch");
      return response(market, "unavailable");
    }

    const maxAge = Math.max(1, Math.floor((paidAttempt.accessExpiresAt.getTime() - Date.now()) / 1000));
    const result = response(market);
    result.cookies.set(marketCookie(AUDHD_CHECKOUT_ATTEMPT_COOKIE, market), browserSecret, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
    result.cookies.set(marketCookie(AUDHD_CHECKOUT_ACCESS_COOKIE, market), issueAudhdCheckoutAccessToken(paidAttempt.id, paidAttempt.accessExpiresAt), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
    logReturn("access_issued");
    return result;
  } catch (error) {
    logReturn("stripe_verification_failed", { error_class: safeErrorClass(error), retryable: true });
    return response(market, "pending");
  }
}
