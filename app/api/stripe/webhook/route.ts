import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { recordVerifiedStripePayment } from "../../../_lib/paymentsDb.server";
import { deliverPendingGa4Purchase, Ga4PurchaseDeliveryError } from "../../../_lib/ga4PurchaseDelivery.server";
import { processStripeWebhookEvent, StripeWebhookProcessingError } from "../../../_lib/stripeWebhook.server";
import { revokeAudhdCheckoutAccessForPaymentIntent } from "../../../_lib/audhdCheckoutAttemptsDb.server";
import { processAudhdCheckoutRevocationEvent } from "../../../_lib/audhdCheckoutRevocation.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function noStore(status: number) {
  return new NextResponse(null, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

function safeErrorClass(error: unknown) {
  if (!(error instanceof Error) || !/^[A-Za-z0-9_.-]{1,80}$/.test(error.name)) return "unknown";
  return error.name;
}

function safeErrorCode(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const candidate = error as { code?: unknown; type?: unknown };
  const value = typeof candidate.code === "string" ? candidate.code : typeof candidate.type === "string" ? candidate.type : undefined;
  return value && /^[A-Za-z0-9_.:-]{1,80}$/.test(value) ? value : undefined;
}

function logProcessingFailure(error: unknown) {
  if (error instanceof Ga4PurchaseDeliveryError) {
    console.error(JSON.stringify({ event: "ga4_purchase_delivery_failed", stage: error.stage, error_class: safeErrorClass(error.source) }));
    return;
  }
  const isStagedFailure = error instanceof StripeWebhookProcessingError;
  const source = isStagedFailure ? error.source : error;
  const commit = process.env.VERCEL_GIT_COMMIT_SHA;
  const diagnostic = {
    event: "stripe_webhook_processing_failed",
    stage: isStagedFailure ? error.stage : "unknown",
    error_class: safeErrorClass(source),
    ...(safeErrorCode(source) ? { error_code: safeErrorCode(source) } : {}),
    ...(commit && /^[a-f0-9]{7,64}$/i.test(commit) ? { commit_sha: commit } : {}),
  };
  console.error(JSON.stringify(diagnostic));
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return noStore(400);

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
    event = stripe.webhooks.constructEvent(await request.text(), signature, required("STRIPE_WEBHOOK_SECRET"));
  } catch {
    // Never log a signature, payload, customer data, or payment identifiers.
    return noStore(400);
  }

  try {
    const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
    const processed = await processStripeWebhookEvent(event, {
      retrieveSession: (sessionId) => stripe.checkout.sessions.retrieve(sessionId),
      listLineItems: (sessionId) => stripe.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ["data.price.product"] }),
      recordPayment: recordVerifiedStripePayment,
    });
    if (processed.kind === "recorded") {
      // The payment ledger and optional GA4 outbox are already committed. A
      // Measurement Protocol outage must not turn a verified Stripe payment
      // into a failed webhook delivery; the cron job safely retries the row.
      try { await deliverPendingGa4Purchase(processed.checkoutSessionId); }
      catch (error) { logProcessingFailure(error); }
    }
    // This is independent from the shadow ledger: signed refund/dispute events
    // only revoke a matching short-lived AuDHD checkout entitlement.
    await processAudhdCheckoutRevocationEvent(event, revokeAudhdCheckoutAccessForPaymentIntent);
    return noStore(200);
  } catch (error) {
    // Stripe retries 5xx responses. Do not mark events as processed on failure.
    logProcessingFailure(error);
    return noStore(500);
  }
}
