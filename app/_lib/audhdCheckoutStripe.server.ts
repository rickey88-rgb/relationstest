import Stripe from "stripe";
import { configuredAudhdCheckoutPriceId } from "./paymentProductCatalog.server";

const SITE_ORIGIN = "https://www.relationsvarning.se";
const AUDHD_PRICE_ORE = 7900;
/** Stripe's hosted session is intentionally much shorter than the seven-day encrypted draft. */
export const AUDHD_STRIPE_CHECKOUT_SESSION_SECONDS = 60 * 60 * 24;

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function configuredAudhdPriceId() {
  return configuredAudhdCheckoutPriceId();
}

function isLiveSessionId(value: string) {
  return /^cs_live_[A-Za-z0-9]+$/.test(value);
}

export type AudhdStripeCheckout = { checkoutSessionId: string; checkoutUrl: string };
export type ExistingAudhdStripeCheckout =
  | { kind: "open"; checkoutSessionId: string; checkoutUrl: string }
  | { kind: "expired" }
  | { kind: "unavailable" };

/** Creates one hosted live Checkout Session for a server-reserved attempt. */
export async function createAudhdStripeCheckout(checkoutReferenceId: string): Promise<AudhdStripeCheckout> {
  const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
  const priceId = configuredAudhdPriceId();
  const price = await stripe.prices.retrieve(priceId);
  if (!price.livemode || !price.active || price.type !== "one_time" || price.unit_amount !== AUDHD_PRICE_ORE || price.currency.toLowerCase() !== "sek") {
    throw new Error("Configured AuDHD Price is not an active live 79 SEK one-time price");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: checkoutReferenceId,
    expires_at: Math.floor(Date.now() / 1000) + AUDHD_STRIPE_CHECKOUT_SESSION_SECONDS,
    success_url: `${SITE_ORIGIN}/api/audhd-checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_ORIGIN}/audhd-test/test?checkout=cancelled`,
  });
  if (!session.livemode || !isLiveSessionId(session.id) || session.client_reference_id !== checkoutReferenceId || !session.url) {
    throw new Error("Stripe did not create the expected live AuDHD Checkout Session");
  }
  return { checkoutSessionId: session.id, checkoutUrl: session.url };
}

/** Repeated clicks may reuse only the still-open Session originally bound to this attempt. */
export async function existingAudhdStripeCheckout(checkoutSessionId: string, checkoutReferenceId: string): Promise<ExistingAudhdStripeCheckout> {
  if (!isLiveSessionId(checkoutSessionId)) return { kind: "unavailable" };
  const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  if (!session.livemode || session.client_reference_id !== checkoutReferenceId) return { kind: "unavailable" };
  if (session.status === "expired") return { kind: "expired" };
  if (session.status !== "open" || !session.url) return { kind: "unavailable" };
  return { kind: "open", checkoutSessionId: session.id, checkoutUrl: session.url };
}
