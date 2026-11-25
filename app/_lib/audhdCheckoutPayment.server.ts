import type { Market } from "../_content/market";
import { norwegianReportStripe } from "./norwayLaunch.server";
import Stripe from "stripe";
import { configuredAudhdCheckoutPriceId } from "./paymentProductCatalog.server";

const AUDHD_PRICE_ORE = 7900;
type StripeReference = string | { id: string } | null | undefined;
function idOf(value: StripeReference) { return typeof value === "string" ? value : value?.id ?? null; }
function required(name: string) { const value = process.env[name]?.trim(); if (!value) throw new Error(`${name} is not configured`); return value; }
function liveSessionId(value: string) { return /^cs_live_[A-Za-z0-9]+$/.test(value); }
function customerEmail(value: unknown) { return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254 ? value : null; }

export type AudhdCheckoutPaymentVerification =
  | { verified: true; checkoutSessionId: string; checkoutReferenceId: string; paymentIntentId: string; priceId: string; customerEmail: string | null }
  | { verified: false; reason: "invalid_session_id" | "price_not_configured" | "session_not_paid" | "wrong_reference" | "wrong_price_or_amount" | "payment_not_captured" | "payment_refunded" | "payment_disputed" | "stripe_request_failed" };

/** Direct Stripe verification used only by the return route, never by browser state. */
export async function verifyAudhdCheckoutPayment(sessionId: string, market: Market = "sv"): Promise<AudhdCheckoutPaymentVerification> {
  if (!(market === "sv" ? liveSessionId(sessionId) : /^cs_(?:live|test)_[A-Za-z0-9]+$/.test(sessionId))) return { verified: false, reason: "invalid_session_id" };
  let config: { key: string; live: boolean; priceId: string; amount: number; currency: string; productId?: string };
  try {
    config = market === "sv"
      ? { key: required("STRIPE_SECRET_KEY"), live: true, priceId: configuredAudhdCheckoutPriceId(), amount: AUDHD_PRICE_ORE, currency: "sek" }
      : norwegianReportStripe();
  } catch {
    return { verified: false, reason: "price_not_configured" };
  }
  const { key, live, priceId: expectedPriceId, amount, currency } = config;
  if (live !== liveSessionId(sessionId)) return { verified: false, reason: "invalid_session_id" };
  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.livemode !== live || session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") return { verified: false, reason: "session_not_paid" };
    if (!session.client_reference_id || !/^audhd_[A-Za-z0-9_-]{32}$/.test(session.client_reference_id)) return { verified: false, reason: "wrong_reference" };
    if (session.amount_total !== amount || session.currency?.toLowerCase() !== currency || (market === "no" && session.metadata?.rv_product !== "audhd_test_no")) return { verified: false, reason: "wrong_price_or_amount" };

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ["data.price"] });
    const prices = lineItems.data.map(lineItem => idOf(lineItem.price)).filter((id): id is string => id !== null);
    if ((market === "no" && (lineItems.has_more || lineItems.data.length !== 1)) || prices.length !== 1 || prices[0] !== expectedPriceId || lineItems.data[0]?.quantity !== 1) return { verified: false, reason: "wrong_price_or_amount" };
    if (market === "no" && (idOf(lineItems.data[0].price?.product) !== config.productId || lineItems.data[0].amount_total !== amount || lineItems.data[0].currency !== currency)) {
      return { verified: false, reason: "wrong_price_or_amount" };
    }

    const paymentIntentId = idOf(session.payment_intent);
    if (!paymentIntentId) return { verified: false, reason: "payment_not_captured" };
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ["latest_charge"] });
    if (paymentIntent.status !== "succeeded" || paymentIntent.amount_received !== amount || (market === "no" && (paymentIntent.currency !== currency || paymentIntent.livemode !== live))) return { verified: false, reason: "payment_not_captured" };
    const charge = typeof paymentIntent.latest_charge === "string" ? await stripe.charges.retrieve(paymentIntent.latest_charge) : paymentIntent.latest_charge;
    // Policy: any refund, including a partial refund, revokes the whole report.
    // A chargeback is revoked when opened; a later won dispute never restores it
    // automatically, so support can make the explicit customer-service decision.
    if (!charge || !charge.paid || charge.refunded || charge.amount_refunded > 0) return { verified: false, reason: "payment_refunded" };
    if (charge.disputed) return { verified: false, reason: "payment_disputed" };
    // Customer email is used transiently for a transactional recovery link;
    // it is neither persisted in our database nor added to diagnostics.
    return { verified: true, checkoutSessionId: session.id, checkoutReferenceId: session.client_reference_id, paymentIntentId, priceId: expectedPriceId, customerEmail: customerEmail(session.customer_details?.email ?? session.customer_email) };
  } catch { return { verified: false, reason: "stripe_request_failed" }; }
}
