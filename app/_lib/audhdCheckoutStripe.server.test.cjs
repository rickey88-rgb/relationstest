/* eslint-disable @typescript-eslint/no-require-imports -- executable Stripe-boundary regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
class StripeMock {
  static price = null;
  static created = null;
  static retrieved = null;
  static priceFailure = null;
  static createFailure = null;
  static retrieveFailure = null;
  constructor() {
    this.prices = { retrieve: async () => { if (StripeMock.priceFailure) throw StripeMock.priceFailure; return StripeMock.price; } };
    this.checkout = { sessions: { create: async params => { if (StripeMock.createFailure) throw StripeMock.createFailure; StripeMock.created = params; return StripeMock.session; }, retrieve: async () => { if (StripeMock.retrieveFailure) throw StripeMock.retrieveFailure; return StripeMock.retrieved; } } };
  }
}
StripeMock.session = { id: "cs_live_audhd123", livemode: true, client_reference_id: "audhd_12345678901234567890123456789012", url: "https://checkout.stripe.com/c/pay/live", status: "open" };
let priceConfigFailure = null;
const checkout = createLoader({
  stripe: { default: StripeMock },
  "./paymentProductCatalog.server": { configuredAudhdCheckoutPriceId: () => { if (priceConfigFailure) throw priceConfigFailure; return "price_audhd_79"; } },
})(path.join(__dirname, "audhdCheckoutStripe.server.ts"));
const reference = "audhd_12345678901234567890123456789012";

(async () => {
  StripeMock.price = { id: "price_audhd_79", livemode: true, active: true, type: "one_time", unit_amount: 7900, currency: "sek" };
  assert.deepEqual(await checkout.createAudhdStripeCheckout(reference), { checkoutSessionId: "cs_live_audhd123", checkoutUrl: "https://checkout.stripe.com/c/pay/live" });
  assert.equal(StripeMock.created.line_items[0].price, "price_audhd_79");
  assert.equal(StripeMock.created.line_items[0].quantity, 1);
  assert.equal(StripeMock.created.client_reference_id, reference);
  assert.equal(typeof StripeMock.created.expires_at, "number");
  assert(StripeMock.created.expires_at >= Math.floor(Date.now() / 1000) + (60 * 60 * 24) - 2);
  assert.equal(StripeMock.created.success_url, "https://www.relationsvarning.se/api/audhd-checkout/return?session_id={CHECKOUT_SESSION_ID}");
  assert.equal(StripeMock.created.cancel_url, "https://www.relationsvarning.se/audhd-test/test?checkout=cancelled");

  StripeMock.price = { ...StripeMock.price, unit_amount: 7901 };
  await assert.rejects(() => checkout.createAudhdStripeCheckout(reference), error => error.stage === "stripe_price");

  priceConfigFailure = new Error("AUDHD_CHECKOUT_PRICE_ID is not configured");
  await assert.rejects(() => checkout.createAudhdStripeCheckout(reference), error => error.stage === "price_config");
  priceConfigFailure = null;
  StripeMock.price = { id: "price_audhd_79", livemode: true, active: true, type: "one_time", unit_amount: 7900, currency: "sek" };
  StripeMock.priceFailure = new Error("Stripe request failed");
  await assert.rejects(() => checkout.createAudhdStripeCheckout(reference), error => error.stage === "stripe_price");
  StripeMock.priceFailure = null;
  StripeMock.createFailure = new Error("Stripe create failed");
  await assert.rejects(() => checkout.createAudhdStripeCheckout(reference), error => error.stage === "stripe_create");
  StripeMock.createFailure = null;

  StripeMock.retrieved = { ...StripeMock.session };
  assert.deepEqual(await checkout.existingAudhdStripeCheckout("cs_live_audhd123", reference), { kind: "open", checkoutSessionId: "cs_live_audhd123", checkoutUrl: "https://checkout.stripe.com/c/pay/live" });
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  await assert.rejects(() => checkout.existingAudhdStripeCheckout("cs_live_audhd123", reference), error => error.stage === "price_config");
  process.env.STRIPE_SECRET_KEY = stripeSecretKey;
  StripeMock.retrieveFailure = new Error("Stripe retrieve failed");
  await assert.rejects(() => checkout.existingAudhdStripeCheckout("cs_live_audhd123", reference), error => error.stage === "stripe_create");
  StripeMock.retrieveFailure = null;
  StripeMock.retrieved = { ...StripeMock.session, client_reference_id: "audhd_other" };
  assert.deepEqual(await checkout.existingAudhdStripeCheckout("cs_live_audhd123", reference), { kind: "unavailable" });
  StripeMock.retrieved = { ...StripeMock.session, status: "expired" };
  assert.deepEqual(await checkout.existingAudhdStripeCheckout("cs_live_audhd123", reference), { kind: "expired" });
  assert.deepEqual(await checkout.existingAudhdStripeCheckout("cs_test_audhd123", reference), { kind: "unavailable" });
  console.log("PASS: server-created AuDHD Checkout requires the configured live 79 SEK Price, has an explicit 24-hour Session expiry, and distinguishes retryable expiration.");
})().catch(error => { console.error(error); process.exitCode = 1; });
