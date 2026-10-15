import { NextRequest, NextResponse } from "next/server";
import { AUDHD_CHECKOUT_ACCESS_COOKIE, AUDHD_CHECKOUT_ATTEMPT_COOKIE, hashAudhdCheckoutBrowserSecret, issueAudhdCheckoutAccessToken } from "../../../_lib/audhdCheckoutAttempt.server";
import { finalizeVerifiedAudhdCheckout, hasAudhdCheckoutRecoveryCandidate } from "../../../_lib/audhdCheckoutAttemptsDb.server";
import { verifyAudhdCheckoutPayment, type AudhdCheckoutPaymentVerification } from "../../../_lib/audhdCheckoutPayment.server";
import { sendAutomaticAudhdRecovery } from "../../../_lib/audhdAutomaticRecovery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const SITE_ORIGIN = "https://www.relationsvarning.se";

type ReturnState = "unavailable" | "pending" | "recovery";
type ReturnOutcome = "access_issued" | "cookie_missing" | "browser_binding_mismatch" | "payment_pending" | "stripe_verification_failed" | "database_finalization_failed" | "recovery_database_failed" | "recovery_email_accepted" | "recovery_link_existing" | "recovery_email_unavailable" | "recovery_email_failed" | "recovery_email_unknown";

function destination(state?: ReturnState) {
  // Never derive a post-payment redirect target from a request Host header.
  const url = new URL("/audhd-test/test", SITE_ORIGIN);
  if (state) url.searchParams.set("checkout", state);
  return url;
}

function response(state?: ReturnState) {
  const result = NextResponse.redirect(destination(state), 303);
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

async function offerAutomaticRecovery(payment: Extract<AudhdCheckoutPaymentVerification, { verified: true }>) {
  const candidate = await hasAudhdCheckoutRecoveryCandidate({ checkoutReferenceId: payment.checkoutReferenceId, checkoutSessionId: payment.checkoutSessionId });
  if (!candidate) return "unavailable" as const;
  const result = await sendAutomaticAudhdRecovery(payment);
  return result.kind;
}

/** Stripe sends the Session ID here; this route strips it before the test page loads. */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id") ?? "";
  const browserSecret = request.cookies.get(AUDHD_CHECKOUT_ATTEMPT_COOKIE)?.value ?? "";
  const browserSecretValid = /^[A-Za-z0-9_-]{43}$/.test(browserSecret);

  // A context switch may lose the browser secret. Stripe can prove payment,
  // but only a one-time link delivered to the purchaser email can restore it.
  if (!browserSecretValid) {
    const payment = await verifyAudhdCheckoutPayment(sessionId);
    if (!payment.verified) {
      logReturn("cookie_missing", { stripe_reason: payment.reason, retryable: retryable(payment) });
      return response(retryable(payment) ? "pending" : "unavailable");
    }
    try {
      const recovery = await offerAutomaticRecovery(payment);
      if (recovery === "accepted" || recovery === "existing") {
        logReturn(recovery === "accepted" ? "recovery_email_accepted" : "recovery_link_existing");
        return response("recovery");
      }
      if (recovery === "database_failed") logReturn("recovery_database_failed");
      else if (recovery === "delivery_failed") logReturn("recovery_email_failed");
      else if (recovery === "delivery_unknown") logReturn("recovery_email_unknown");
      else logReturn("recovery_email_unavailable");
    } catch (error) {
      logReturn("recovery_email_failed", { error_class: safeErrorClass(error) });
    }
    logReturn("cookie_missing");
    return response("unavailable");
  }
  try {
    const verified = await verifyAudhdCheckoutPayment(sessionId);
    if (!verified.verified) {
      logReturn(retryable(verified) ? "payment_pending" : "stripe_verification_failed", { stripe_reason: verified.reason, retryable: retryable(verified) });
      return response(retryable(verified) ? "pending" : "unavailable");
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
      return response("pending");
    }
    if (!paidAttempt) {
      try {
        const recovery = await offerAutomaticRecovery(verified);
        if (recovery === "accepted" || recovery === "existing") {
          logReturn(recovery === "accepted" ? "recovery_email_accepted" : "recovery_link_existing");
          return response("recovery");
        }
        if (recovery === "database_failed") logReturn("recovery_database_failed");
        else if (recovery === "delivery_failed") logReturn("recovery_email_failed");
        else if (recovery === "delivery_unknown") logReturn("recovery_email_unknown");
        else logReturn("recovery_email_unavailable");
      } catch (error) {
        logReturn("recovery_email_failed", { error_class: safeErrorClass(error) });
      }
      logReturn("browser_binding_mismatch");
      return response("unavailable");
    }

    const maxAge = Math.max(1, Math.floor((paidAttempt.accessExpiresAt.getTime() - Date.now()) / 1000));
    const result = response();
    result.cookies.set(AUDHD_CHECKOUT_ATTEMPT_COOKIE, browserSecret, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
    result.cookies.set(AUDHD_CHECKOUT_ACCESS_COOKIE, issueAudhdCheckoutAccessToken(paidAttempt.id, paidAttempt.accessExpiresAt), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
    logReturn("access_issued");
    return result;
  } catch (error) {
    logReturn("stripe_verification_failed", { error_class: safeErrorClass(error), retryable: true });
    return response("pending");
  }
}
