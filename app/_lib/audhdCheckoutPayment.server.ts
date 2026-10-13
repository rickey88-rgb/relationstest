import Stripe from "stripe";
import { configuredAudhdCheckoutPriceId } from "./paymentProductCatalog.server";

const AUDHD_PRICE_ORE = 7900;
type StripeReference = string | { id: string } | null | undefined;
function idOf(value: StripeReference) { return typeof value === "string" ? value : value?.id ?? null; }
function required(name: string) { const value = process.env[name]?.trim(); if (!value) throw new Error(`${name} is not configured`); return value; }
function liveSessionId(value: string) { return /^cs_live_[A-Za-z0-9]+$/.test(value); }

export type AudhdCheckoutPaymentVerification =
  | { verified: true; checkoutSessionId: string; checkoutReferenceId: string; paymentIntentId: string }
  | { verified: false; reason: "invalid_session_id" | "price_not_configured" | "session_not_paid" | "wrong_reference" | "wrong_price_or_amount" | "payment_not_captured" | "payment_refunded" | "payment_disputed" | "stripe_request_failed" };

/** Direct Stripe verification used only by the return route, never by browser state. */
export async function verifyAudhdCheckoutPayment(sessionId: string): Promise<AudhdCheckoutPaymentVerification> {
  if (!liveSessionId(sessionId)) return { verified: false, reason: "invalid_session_id" };
  let expectedPriceId: string;
  try {
    expectedPriceId = configuredAudhdCheckoutPriceId();
  } catch {
    return { verified: false, reason: "price_not_configured" };
  }
  try {
    const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session.livemode || session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") return { verified: false, reason: "session_not_paid" };
    if (!session.client_reference_id || !/^audhd_[A-Za-z0-9_-]{32}$/.test(session.client_reference_id)) return { verified: false, reason: "wrong_reference" };
    if (session.amount_total !== AUDHD_PRICE_ORE || session.currency?.toLowerCase() !== "sek") return { verified: false, reason: "wrong_price_or_amount" };

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ["data.price"] });
    const prices = lineItems.data.map(lineItem => idOf(lineItem.price)).filter((id): id is string => id !== null);
    if (prices.length !== 1 || prices[0] !== expectedPriceId || lineItems.data[0]?.quantity !== 1) return { verified: false, reason: "wrong_price_or_amount" };

    const paymentIntentId = idOf(session.payment_intent);
    if (!paymentIntentId) return { verified: false, reason: "payment_not_captured" };
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ["latest_charge"] });
    if (paymentIntent.status !== "succeeded" || paymentIntent.amount_received !== AUDHD_PRICE_ORE) return { verified: false, reason: "payment_not_captured" };
    const charge = typeof paymentIntent.latest_charge === "string" ? await stripe.charges.retrieve(paymentIntent.latest_charge) : paymentIntent.latest_charge;
    // Policy: any refund, including a partial refund, revokes the whole report.
    // A chargeback is revoked when opened; a later won dispute never restores it
    // automatically, so support can make the explicit customer-service decision.
    if (!charge || !charge.paid || charge.refunded || charge.amount_refunded > 0) return { verified: false, reason: "payment_refunded" };
    if (charge.disputed) return { verified: false, reason: "payment_disputed" };
    return { verified: true, checkoutSessionId: session.id, checkoutReferenceId: session.client_reference_id, paymentIntentId };
  } catch { return { verified: false, reason: "stripe_request_failed" }; }
}
