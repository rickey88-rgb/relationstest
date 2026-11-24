import type Stripe from "stripe";

export function stripeObjectId(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id;
}

export async function capturedBookPayment(stripe: Stripe, intentId: string, live: boolean, amount: number) {
  const intent = await stripe.paymentIntents.retrieve(intentId, { expand: ["latest_charge"] });
  const charge = typeof intent.latest_charge === "string"
    ? await stripe.charges.retrieve(intent.latest_charge)
    : intent.latest_charge;
  return Boolean(intent.id === intentId && intent.livemode === live && intent.status === "succeeded" &&
    intent.currency === "sek" && intent.amount_received === amount && charge && charge.livemode === live &&
    stripeObjectId(charge.payment_intent) === intentId && charge.paid && charge.captured &&
    charge.currency === "sek" && charge.amount === amount && !charge.disputed &&
    !charge.refunded && charge.amount_refunded === 0);
}
