import { norwegian, type Market } from "../_content/market";
import { norwegianReportStripe, norwayStripeEnvironment } from "./norwayLaunch.server";
import Stripe from "stripe";
import { configuredAudhdCheckoutPriceId } from "./paymentProductCatalog.server";

const SITE_ORIGIN = "https://www.relationsvarning.se";
const AUDHD_PRICE_ORE = 7900;
/** Stripe's hosted session is intentionally much shorter than the seven-day encrypted draft. */
export const AUDHD_STRIPE_CHECKOUT_SESSION_SECONDS = 60 * 60 * 24;

export type AudhdCheckoutStripeStage = "price_config" | "stripe_price" | "stripe_create";

/** A non-sensitive classification for the start-route's operational logging. */
export class AudhdCheckoutStripeError extends Error {
  constructor(readonly stage: AudhdCheckoutStripeStage) {
    super(stage);
    this.name = "AudhdCheckoutStripeError";
  }
}

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
export async function createAudhdStripeCheckout(checkoutReferenceId: string, market: Market = "sv"): Promise<AudhdStripeCheckout> {
  let stripe: Stripe;
  let config: { live: boolean; origin: string; priceId: string; currency: string; amount: number; productId?: string };
  try {
    const { key, ...stripeConfig } = market === "sv"
      ? { key: required("STRIPE_SECRET_KEY"), live: true, origin: SITE_ORIGIN, priceId: configuredAudhdPriceId(), currency: "sek", amount: AUDHD_PRICE_ORE }
      : norwegianReportStripe();
    config = stripeConfig;
    stripe = new Stripe(key);
  } catch {
    throw new AudhdCheckoutStripeError("price_config");
  }

  const { priceId, live, origin, currency, amount } = config;
  const stripeReturn = market === "no" ? "&market=no" : "";
  const cancelPath = market === "no" ? norwegian.questionnaire : "/audhd-test/test";
  let automaticTax = false;
  let price: Stripe.Price;
  try {
    price = await stripe.prices.retrieve(priceId);
    if (price.livemode !== live || !price.active || price.type !== "one_time" || price.unit_amount !== amount || price.currency.toLowerCase() !== currency) {
      throw new Error("Unexpected Stripe Price");
    }
    if (market === "no" && (typeof price.product === "string" ? price.product : price.product.id) !== config.productId) throw new Error("Unexpected Norwegian Stripe Product");
    if (market === "no" && live) {
      if (price.tax_behavior !== "inclusive") throw new Error("Unexpected Norwegian price tax behavior");
      const taxMode = process.env.NORWAY_REPORT_TAX_MODE;
      if (taxMode !== "stripe-tax" && taxMode !== "below-threshold") throw new Error("Norwegian VAT treatment is unavailable");
      automaticTax = taxMode === "stripe-tax";
    }
  } catch {
    throw new AudhdCheckoutStripeError("stripe_price");
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(automaticTax ? { automatic_tax: { enabled: true } } : {}),
      ...(market === "no" ? { locale: "nb", billing_address_collection: "required", metadata: { rv_product: "audhd_test_no" } } : {}),
      client_reference_id: checkoutReferenceId,
      expires_at: Math.floor(Date.now() / 1000) + AUDHD_STRIPE_CHECKOUT_SESSION_SECONDS,
      success_url: `${origin}/api/audhd-checkout/return?session_id={CHECKOUT_SESSION_ID}${stripeReturn}`,
      cancel_url: `${origin}${cancelPath}?checkout=cancelled`,
    });
  } catch {
    throw new AudhdCheckoutStripeError("stripe_create");
  }
  if (session.livemode !== live || !(live ? isLiveSessionId(session.id) : /^cs_test_[A-Za-z0-9]+$/.test(session.id)) || session.client_reference_id !== checkoutReferenceId || !session.url) {
    throw new AudhdCheckoutStripeError("stripe_create");
  }
  return { checkoutSessionId: session.id, checkoutUrl: session.url };
}

/** Repeated clicks may reuse only the still-open Session originally bound to this attempt. */
export async function existingAudhdStripeCheckout(checkoutSessionId: string, checkoutReferenceId: string, market: Market = "sv"): Promise<ExistingAudhdStripeCheckout> {
  if (market === "sv" && !isLiveSessionId(checkoutSessionId)) return { kind: "unavailable" };
  let stripe: Stripe;
  let live: boolean;
  try {
    const config = market === "sv" ? { live: true, key: required("STRIPE_SECRET_KEY") } : norwayStripeEnvironment();
    live = config.live;
    if (!(live ? isLiveSessionId(checkoutSessionId) : /^cs_test_[A-Za-z0-9]+$/.test(checkoutSessionId))) return { kind: "unavailable" };
    stripe = new Stripe(config.key);
  } catch {
    throw new AudhdCheckoutStripeError("price_config");
  }
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  } catch {
    throw new AudhdCheckoutStripeError("stripe_create");
  }
  if (session.livemode !== live || session.client_reference_id !== checkoutReferenceId) return { kind: "unavailable" };
  if (session.status === "expired") return { kind: "expired" };
  if (session.status !== "open" || !session.url) return { kind: "unavailable" };
  return { kind: "open", checkoutSessionId: session.id, checkoutUrl: session.url };
}
