import type Stripe from "stripe";
import { paymentsDatabase } from "./paymentsDb.server";

export const REFUND_EVENT_TYPES = new Set(["refund.created", "refund.updated", "refund.failed", "charge.refunded", "charge.refund.updated"]);

export function stripeId(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id ?? null;
}

export async function recordStripeRefunds(event: Stripe.Event, stripe: Stripe) {
  if (!REFUND_EVENT_TYPES.has(event.type)) return;
  const object = event.data.object as Stripe.Charge | Stripe.Refund;
  let refunds: Stripe.Refund[];
  if (object.id.startsWith("re_")) refunds = [await stripe.refunds.retrieve(object.id)];
  else if (event.type === "charge.refunded" && object.id.startsWith("ch_")) {
    refunds = [];
    for await (const refund of stripe.refunds.list({ charge: object.id, limit: 100 })) refunds.push(refund);
  } else throw new Error("Unexpected Stripe refund object");

  // Retrieve current status so delayed Stripe events cannot regress the refund.
  const observedAt = new Date();
  const facts = await Promise.all(refunds.map(async refund => {
    let intent = stripeId(refund.payment_intent);
    if (!intent) {
      const charge = stripeId(refund.charge);
      if (charge) intent = stripeId((await stripe.charges.retrieve(charge)).payment_intent);
    }
    return { refund, intent };
  }));
  await paymentsDatabase().begin(async transaction => {
    const inserted = await transaction`
      insert into public.stripe_webhook_events
        (stripe_event_id, event_type, livemode, stripe_created_at, processed_at, processing_status)
      values (${event.id}, ${event.type}, ${event.livemode}, ${new Date(event.created * 1000)}, now(), 'processed')
      on conflict (stripe_event_id) do nothing returning stripe_event_id
    `;
    if (!inserted.length) return;
    for (const { refund, intent } of facts) {
      if (!intent) continue;
      await transaction`
        insert into public.stripe_refunds
          (stripe_refund_id, stripe_payment_intent_id, amount_ore, currency, status, livemode, stripe_created_at, stripe_state_at)
        values (${refund.id}, ${intent}, ${refund.amount}, ${refund.currency}, ${refund.status ?? "unknown"},
                ${event.livemode}, ${new Date(refund.created * 1000)}, ${observedAt})
        on conflict (stripe_refund_id) do update set
          status = excluded.status, stripe_state_at = excluded.stripe_state_at
        where stripe_refunds.stripe_state_at <= excluded.stripe_state_at
      `;
    }
  });
}
