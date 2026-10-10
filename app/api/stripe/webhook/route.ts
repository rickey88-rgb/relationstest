import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { recordVerifiedStripePayment } from "../../../_lib/paymentsDb.server";
import { processStripeWebhookEvent } from "../../../_lib/stripeWebhook.server";

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
    await processStripeWebhookEvent(event, {
      retrieveSession: (sessionId) => stripe.checkout.sessions.retrieve(sessionId),
      listLineItems: (sessionId) => stripe.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ["data.price.product"] }),
      recordPayment: recordVerifiedStripePayment,
    });
    return noStore(200);
  } catch {
    // Stripe retries 5xx responses. Do not mark events as processed on failure.
    return noStore(500);
  }
}
