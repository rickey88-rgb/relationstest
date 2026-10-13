import type Stripe from "stripe";

const REVOCATION_EVENTS = new Set([
  "charge.refunded",
  "charge.dispute.created",
  "charge.dispute.funds_withdrawn",
  "charge.dispute.closed",
]);

function paymentIntentId(value: unknown) {
  if (typeof value === "string" && /^pi_[A-Za-z0-9]+$/.test(value)) return value;
  if (value && typeof value === "object" && "id" in value && typeof value.id === "string" && /^pi_[A-Za-z0-9]+$/.test(value.id)) return value.id;
  return null;
}

/**
 * Processes only signed live Stripe events. `charge.refunded` includes partial
 * refunds; policy deliberately revokes the entire analysis after any refund.
 * A dispute revokes on creation and is not automatically reinstated if won.
 */
export async function processAudhdCheckoutRevocationEvent(event: Stripe.Event, revoke: (paymentIntentId: string) => Promise<boolean>) {
  if (!event.livemode || !REVOCATION_EVENTS.has(event.type)) return { kind: "ignored" as const };
  // A won dispute never restores access automatically. A closed lost/warning
  // dispute still revokes if its earlier creation event was delayed or missed.
  if (event.type === "charge.dispute.closed") {
    const status = event.data.object && "status" in event.data.object ? event.data.object.status : null;
    if (status !== "lost" && status !== "warning_closed") return { kind: "ignored" as const };
  }
  const paymentIntent = paymentIntentId(event.data.object && "payment_intent" in event.data.object ? event.data.object.payment_intent : null);
  if (!paymentIntent) return { kind: "ignored" as const };
  return { kind: "revocation_checked" as const, revoked: await revoke(paymentIntent) };
}
