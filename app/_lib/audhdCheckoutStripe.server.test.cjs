/* eslint-disable @typescript-eslint/no-require-imports -- executable Stripe-boundary regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
class StripeMock {
  static price = null;
  static created = null;
  static retrieved = null;
  constructor() {
    this.prices = { retrieve: async () => StripeMock.price };
    this.checkout = { sessions: { create: async params => { StripeMock.created = params; return StripeMock.session; }, retrieve: async () => StripeMock.retrieved } };
  }
}
StripeMock.session = { id: "cs_live_audhd123", livemode: true, client_reference_id: "audhd_12345678901234567890123456789012", url: "https://checkout.stripe.com/c/pay/live", status: "open" };
const checkout = createLoader({
  stripe: { default: StripeMock },
  "./paymentProductCatalog.server": { configuredAudhdCheckoutPriceId: () => "price_audhd_79" },
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
  await assert.rejects(() => checkout.createAudhdStripeCheckout(reference), /79 SEK/);

  StripeMock.retrieved = { ...StripeMock.session };
  assert.deepEqual(await checkout.existingAudhdStripeCheckout("cs_live_audhd123", reference), { kind: "open", checkoutSessionId: "cs_live_audhd123", checkoutUrl: "https://checkout.stripe.com/c/pay/live" });
  StripeMock.retrieved = { ...StripeMock.session, client_reference_id: "audhd_other" };
  assert.deepEqual(await checkout.existingAudhdStripeCheckout("cs_live_audhd123", reference), { kind: "unavailable" });
  StripeMock.retrieved = { ...StripeMock.session, status: "expired" };
  assert.deepEqual(await checkout.existingAudhdStripeCheckout("cs_live_audhd123", reference), { kind: "expired" });
  assert.deepEqual(await checkout.existingAudhdStripeCheckout("cs_test_audhd123", reference), { kind: "unavailable" });
  console.log("PASS: server-created AuDHD Checkout requires the configured live 79 SEK Price, has an explicit 24-hour Session expiry, and distinguishes retryable expiration.");
})().catch(error => { console.error(error); process.exitCode = 1; });
