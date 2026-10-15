import Stripe from "stripe";
import { configuredPriceIdsForProduct, identifyPaymentProduct } from "./paymentProductCatalog.server";

type StripeReference = string | { id: string } | null | undefined;

function idOf(reference: StripeReference) {
  return typeof reference === "string" ? reference : reference?.id ?? null;
}

function isCheckoutSessionId(value: string) {
  return /^cs_live_[A-Za-z0-9]+$/.test(value);
}

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export type AudhdCheckoutVerification =
  | { verified: true; checkoutSessionId: string; paymentIntentId: string; priceId: string }
  | { verified: false; reason: "invalid_session_id" | "price_not_configured" | "session_not_paid" | "payment_not_captured" | "payment_refunded" | "payment_disputed" | "wrong_product" | "stripe_request_failed" };

/**
 * Verification deliberately uses Stripe as the source of truth rather than a
 * browser value or the asynchronously populated shadow ledger.
 */
export async function inspectAudhdCheckoutSession(sessionId: string): Promise<AudhdCheckoutVerification> {
  if (!isCheckoutSessionId(sessionId)) return { verified: false, reason: "invalid_session_id" };
  const allowedPriceIds = new Set(configuredPriceIdsForProduct("audhd_test"));
  if (allowedPriceIds.size === 0) return { verified: false, reason: "price_not_configured" };

  try {
    const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session.livemode || session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") {
      return { verified: false, reason: "session_not_paid" };
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ["data.price"] });
    const priceIds = Array.from(new Set(lineItems.data.map((lineItem) => idOf(lineItem.price)).filter((id): id is string => id !== null)));
    const productKey = identifyPaymentProduct({ priceIds, paymentLinkId: idOf(session.payment_link) });
    const priceId = priceIds.find((id) => allowedPriceIds.has(id));
    if (productKey !== "audhd_test" || !priceId) return { verified: false, reason: "wrong_product" };

    const paymentIntentId = idOf(session.payment_intent);
    if (!paymentIntentId) return { verified: false, reason: "payment_not_captured" };
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ["latest_charge"] });
    if (paymentIntent.status !== "succeeded" || paymentIntent.amount_received < (session.amount_total ?? 0)) {
      return { verified: false, reason: "payment_not_captured" };
    }

    const expandedCharge = paymentIntent.latest_charge;
    const charge = typeof expandedCharge === "string"
      ? await stripe.charges.retrieve(expandedCharge)
      : expandedCharge;
    if (charge && (charge.refunded || charge.amount_refunded > 0)) return { verified: false, reason: "payment_refunded" };
    if (charge?.disputed) return { verified: false, reason: "payment_disputed" };

    return { verified: true, checkoutSessionId: session.id, paymentIntentId, priceId };
  } catch {
    return { verified: false, reason: "stripe_request_failed" };
  }
}
