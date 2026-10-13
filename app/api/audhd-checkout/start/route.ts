import { NextRequest, NextResponse } from "next/server";
import { AUDHD_CHECKOUT_ATTEMPT_COOKIE, hashAudhdCheckoutBrowserSecret } from "../../../_lib/audhdCheckoutAttempt.server";
import { bindAudhdCheckoutSession, releaseAudhdCheckoutReservation, releaseExpiredAudhdCheckoutSession, reserveAudhdCheckoutAttempt } from "../../../_lib/audhdCheckoutAttemptsDb.server";
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

/**
 * Not yet called by the client. It is the next server-only boundary after
 * preparation: one browser-bound draft becomes at most one Stripe Session.
 */
export async function POST(request: NextRequest) {
  if (!sameOriginRequest(request)) return response({ error: "Not found." }, 404);
  let pendingReservation: { attemptId: string; browserSecretHash: string; checkoutReferenceId: string } | null = null;
  try {
    const body: unknown = await request.json();
    const attemptId = body && typeof body === "object" && !Array.isArray(body) ? (body as { attemptId?: unknown }).attemptId : null;
    const browserSecret = request.cookies.get(AUDHD_CHECKOUT_ATTEMPT_COOKIE)?.value ?? "";
    if (!isAttemptId(attemptId) || !/^[A-Za-z0-9_-]{43}$/.test(browserSecret)) return response({ error: "Checkout attempt is unavailable." }, 404);

    const browserSecretHash = hashAudhdCheckoutBrowserSecret(browserSecret);
    const reservation = await reserveAudhdCheckoutAttempt(attemptId, browserSecretHash);
    if (reservation.kind === "invalid") return response({ error: "Checkout attempt is unavailable." }, 404);
    if (reservation.kind === "in_progress") return response({ error: "Checkout is already being prepared." }, 409);
    if (reservation.kind === "existing") {
      const checkout = await existingAudhdStripeCheckout(reservation.checkoutSessionId, reservation.checkoutReferenceId);
      if (checkout.kind === "open") return response({ checkoutUrl: checkout.checkoutUrl }, 200);
      if (checkout.kind !== "expired") return response({ error: "Checkout is no longer available." }, 409);

      const released = await releaseExpiredAudhdCheckoutSession({ attemptId, browserSecretHash, checkoutReferenceId: reservation.checkoutReferenceId, checkoutSessionId: reservation.checkoutSessionId });
      if (!released) return response({ error: "Checkout is no longer available." }, 409);
      const retry = await reserveAudhdCheckoutAttempt(attemptId, browserSecretHash);
      if (retry.kind !== "reserved") return response({ error: "Checkout is no longer available." }, 409);
      pendingReservation = { attemptId, browserSecretHash, checkoutReferenceId: retry.checkoutReferenceId };
      const renewedCheckout = await createAudhdStripeCheckout(retry.checkoutReferenceId);
      await bindAudhdCheckoutSession({ attemptId, browserSecretHash, checkoutReferenceId: retry.checkoutReferenceId, checkoutSessionId: renewedCheckout.checkoutSessionId });
      pendingReservation = null;
      return response({ checkoutUrl: renewedCheckout.checkoutUrl }, 201);
    }

    pendingReservation = { attemptId, browserSecretHash, checkoutReferenceId: reservation.checkoutReferenceId };
    const checkout = await createAudhdStripeCheckout(reservation.checkoutReferenceId);
    await bindAudhdCheckoutSession({ attemptId, browserSecretHash, checkoutReferenceId: reservation.checkoutReferenceId, checkoutSessionId: checkout.checkoutSessionId });
    pendingReservation = null;
    return response({ checkoutUrl: checkout.checkoutUrl }, 201);
  } catch {
    if (pendingReservation) {
      try { await releaseAudhdCheckoutReservation(pendingReservation); } catch { /* A short database lease still prevents duplicate sessions. */ }
    }
    return response({ error: "Checkout preparation is unavailable." }, 503);
  }
}
