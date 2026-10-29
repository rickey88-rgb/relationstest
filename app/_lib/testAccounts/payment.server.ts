import Stripe from "stripe";
import { configuredPriceIdsForProduct } from "../paymentProductCatalog.server";
import { adapter } from "./adapter";

export type PaymentBinding = { id: string; product: string; session_id: string; price_id: string; live_mode: boolean };
export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error("Payment unavailable");
  return new Stripe(key, { timeout: 10000, maxNetworkRetries: 1 });
}
export function paymentConfig(product: string) {
  const model = adapter(product);
  const price = process.env[model.priceEnv]?.trim();
  if (!price || !configuredPriceIdsForProduct(model.product).includes(price)) throw new Error("Price not allowlisted");
  // This delivery accepts live-mode checkout only. Tests use a mocked SDK; no test/live keys are switched automatically.
  return { price, live: true };
}
export async function verifyPayment(binding: PaymentBinding, stripe = stripeClient()) {
  const model = adapter(binding.product);
  // Historical account reads use the product allowlist, not the currently selected checkout Price.
  if (!configuredPriceIdsForProduct(model.product).includes(binding.price_id) || !binding.live_mode) throw new Error("Payment denied");
  const session = await stripe.checkout.sessions.retrieve(binding.session_id);
  const items = await stripe.checkout.sessions.listLineItems(binding.session_id, { limit: 2 });
  const intentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (session.id !== binding.session_id || session.client_reference_id !== `ta:${binding.id}` || !session.livemode
    || session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid"
    || session.amount_total !== model.amount || session.currency !== "sek" || !intentId
    || items.has_more || items.data.length !== 1 || items.data[0].quantity !== 1
    || items.data[0].price?.id !== binding.price_id || items.data[0].amount_total !== model.amount) throw new Error("Payment denied");
  const intent = await stripe.paymentIntents.retrieve(intentId, { expand: ["latest_charge"] });
  const charge = typeof intent.latest_charge === "string" ? await stripe.charges.retrieve(intent.latest_charge) : intent.latest_charge;
  const chargeIntent = typeof charge?.payment_intent === "string" ? charge.payment_intent : charge?.payment_intent?.id;
  if (intent.id !== intentId || chargeIntent !== intentId || !intent.livemode || intent.status !== "succeeded" || intent.currency !== "sek" || intent.amount !== model.amount
    || intent.amount_received !== model.amount || !charge || !charge.livemode || !charge.paid || !charge.captured
    || charge.amount !== model.amount || charge.currency !== "sek") throw new Error("Payment denied");
  if (charge.refunded || charge.amount_refunded > 0 || charge.disputed
    || (await stripe.disputes.list({ payment_intent: intentId, limit: 1 })).data.length) throw new Error("Payment revoked");
  return { intentId, purchasedAt: new Date(charge.created * 1000) };
}
