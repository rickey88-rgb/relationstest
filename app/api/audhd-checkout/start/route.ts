import { NextRequest, NextResponse } from "next/server";
import { AUDHD_CHECKOUT_ATTEMPT_COOKIE, hashAudhdCheckoutBrowserSecret } from "../../../_lib/audhdCheckoutAttempt.server";
import { parseAudhdCheckoutAnalyticsAttribution } from "../../../_lib/audhdCheckoutAnalytics.server";
import { bindAudhdCheckoutSession, releaseAudhdCheckoutReservation, releaseExpiredAudhdCheckoutSession, reserveAudhdCheckoutAttempt, saveAudhdCheckoutAnalyticsAttribution } from "../../../_lib/audhdCheckoutAttemptsDb.server";
import { createAudhdStripeCheckout, existingAudhdStripeCheckout } from "../../../_lib/audhdCheckoutStripe.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = process.env.NODE_ENV === "production"
    ? new Set(["https://www.relationsvarning.se"])
    : new Set(["http://localhost:3000", "http://127.0.0.1:3000"]);
  return allowed.has(origin);
}

function isAttemptId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function response(body: Record<string, string>, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff" } });
}

type CheckoutStartStage = "price_config" | "reserve" | "stripe_price" | "stripe_create" | "bind";
const checkoutStartStages = new Set<CheckoutStartStage>(["price_config", "reserve", "stripe_price", "stripe_create", "bind"]);

function stageFromError(error: unknown, fallback: CheckoutStartStage): CheckoutStartStage {
  if (!error || typeof error !== "object") return fallback;
  const stage = (error as { stage?: unknown }).stage;
  return typeof stage === "string" && checkoutStartStages.has(stage as CheckoutStartStage) ? stage as CheckoutStartStage : fallback;
}

function safeErrorCode(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const code = (error as { code?: unknown }).code;
  // SQLSTATE is a fixed five-character machine code. Other provider fields are
  // deliberately omitted rather than risking that arbitrary error metadata leaks.
  return typeof code === "string" && /^[0-9A-Z]{5}$/.test(code) ? code : undefined;
}

/** Intentionally excludes error messages, request data, identifiers, and secrets. */
function logCheckoutStartFailure(stage: CheckoutStartStage, error: unknown) {
  const errorClass = error instanceof Error && error.constructor?.name ? error.constructor.name : "UnknownError";
  const errorCode = safeErrorCode(error);
  console.error(JSON.stringify({ event: "audhd_checkout_start_failed", stage, error_class: errorClass, ...(errorCode ? { error_code: errorCode } : {}) }));
}

/**
 * Not yet called by the client. It is the next server-only boundary after
 * preparation: one browser-bound draft becomes at most one Stripe Session.
 */
export async function POST(request: NextRequest) {
  if (!sameOriginRequest(request)) return response({ error: "Not found." }, 404);
  let pendingReservation: { attemptId: string; browserSecretHash: string; checkoutReferenceId: string } | null = null;
  let stage: CheckoutStartStage = "reserve";
  try {
    const body: unknown = await request.json();
    const attemptId = body && typeof body === "object" && !Array.isArray(body) ? (body as { attemptId?: unknown }).attemptId : null;
    const analyticsAttribution = body && typeof body === "object" && !Array.isArray(body) ? parseAudhdCheckoutAnalyticsAttribution((body as { analytics?: unknown }).analytics) : null;
    const browserSecret = request.cookies.get(AUDHD_CHECKOUT_ATTEMPT_COOKIE)?.value ?? "";
    if (!isAttemptId(attemptId) || !/^[A-Za-z0-9_-]{43}$/.test(browserSecret)) return response({ error: "Checkout attempt is unavailable." }, 404);

    const browserSecretHash = hashAudhdCheckoutBrowserSecret(browserSecret);
    stage = "reserve";
    const reservation = await reserveAudhdCheckoutAttempt(attemptId, browserSecretHash);
    if (reservation.kind === "invalid") return response({ error: "Checkout attempt is unavailable." }, 404);
    if (reservation.kind === "in_progress") return response({ error: "Checkout is already being prepared." }, 409);
    if (analyticsAttribution) {
      // Analytics is optional: a storage outage must never prevent a customer
      // from reaching the already secure Checkout flow.
      try { await saveAudhdCheckoutAnalyticsAttribution({ attemptId, browserSecretHash, attribution: analyticsAttribution }); }
      catch { console.error(JSON.stringify({ event: "audhd_checkout_analytics_attribution_failed" })); }
    }
    if (reservation.kind === "existing") {
      stage = "stripe_create";
      const checkout = await existingAudhdStripeCheckout(reservation.checkoutSessionId, reservation.checkoutReferenceId);
      if (checkout.kind === "open") return response({ checkoutUrl: checkout.checkoutUrl }, 200);
      if (checkout.kind !== "expired") return response({ error: "Checkout is no longer available." }, 409);

      stage = "reserve";
      const released = await releaseExpiredAudhdCheckoutSession({ attemptId, browserSecretHash, checkoutReferenceId: reservation.checkoutReferenceId, checkoutSessionId: reservation.checkoutSessionId });
      if (!released) return response({ error: "Checkout is no longer available." }, 409);
      const retry = await reserveAudhdCheckoutAttempt(attemptId, browserSecretHash);
      if (retry.kind !== "reserved") return response({ error: "Checkout is no longer available." }, 409);
      pendingReservation = { attemptId, browserSecretHash, checkoutReferenceId: retry.checkoutReferenceId };
      stage = "stripe_create";
      const renewedCheckout = await createAudhdStripeCheckout(retry.checkoutReferenceId);
      stage = "bind";
      await bindAudhdCheckoutSession({ attemptId, browserSecretHash, checkoutReferenceId: retry.checkoutReferenceId, checkoutSessionId: renewedCheckout.checkoutSessionId });
      pendingReservation = null;
      return response({ checkoutUrl: renewedCheckout.checkoutUrl }, 201);
    }

    pendingReservation = { attemptId, browserSecretHash, checkoutReferenceId: reservation.checkoutReferenceId };
    stage = "stripe_create";
    const checkout = await createAudhdStripeCheckout(reservation.checkoutReferenceId);
    stage = "bind";
    await bindAudhdCheckoutSession({ attemptId, browserSecretHash, checkoutReferenceId: reservation.checkoutReferenceId, checkoutSessionId: checkout.checkoutSessionId });
    pendingReservation = null;
    return response({ checkoutUrl: checkout.checkoutUrl }, 201);
  } catch (error) {
    logCheckoutStartFailure(stageFromError(error, stage), error);
    if (pendingReservation) {
      try { await releaseAudhdCheckoutReservation(pendingReservation); } catch { /* A short database lease still prevents duplicate sessions. */ }
    }
    return response({ error: "Checkout preparation is unavailable." }, 503);
  }
}
