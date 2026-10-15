/* eslint-disable @typescript-eslint/no-require-imports -- executable Stripe verification regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
class StripeMock {
  static session = null;
  static lineItems = [];
  static paymentIntent = null;
  static charge = null;
  constructor() {
    this.checkout = { sessions: { retrieve: async () => StripeMock.session, listLineItems: async () => ({ data: StripeMock.lineItems }) } };
    this.paymentIntents = { retrieve: async () => StripeMock.paymentIntent };
    this.charges = { retrieve: async () => StripeMock.charge };
  }
}
let allowedPrices = ["price_audhd_current", "price_audhd_historical"];
const products = {
  configuredPriceIdsForProduct: () => allowedPrices,
  identifyPaymentProduct: ({ priceIds }) => priceIds.length === 1 && allowedPrices.includes(priceIds[0]) ? "audhd_test" : "unmapped",
};
const payment = createLoader({ stripe: { default: StripeMock }, "./paymentProductCatalog.server": products })(path.join(__dirname, "audhdRecoveryPayment.server.ts"));

function paidFixtures() {
  StripeMock.session = { id: "cs_live_paid", livemode: true, mode: "payment", status: "complete", payment_status: "paid", payment_link: "plink_audhd", payment_intent: "pi_paid", amount_total: 7900 };
  StripeMock.lineItems = [{ price: { id: "price_audhd_current" } }];
  StripeMock.paymentIntent = { status: "succeeded", amount_received: 7900, latest_charge: { refunded: false, amount_refunded: 0 } };
  StripeMock.charge = null;
}

(async () => {
  paidFixtures();
  assert.deepEqual(await payment.inspectAudhdCheckoutSession("cs_live_paid"), { verified: true, checkoutSessionId: "cs_live_paid", paymentIntentId: "pi_paid", priceId: "price_audhd_current" });

  paidFixtures(); StripeMock.lineItems = [{ price: { id: "price_audhd_historical" } }];
  assert.deepEqual(await payment.inspectAudhdCheckoutSession("cs_live_paid"), { verified: true, checkoutSessionId: "cs_live_paid", paymentIntentId: "pi_paid", priceId: "price_audhd_historical" });

  paidFixtures(); StripeMock.lineItems = [{ price: { id: "price_other" } }];
  assert.equal((await payment.inspectAudhdCheckoutSession("cs_live_paid")).reason, "wrong_product");

  paidFixtures(); StripeMock.paymentIntent.latest_charge = { refunded: true, amount_refunded: 7900 };
  assert.equal((await payment.inspectAudhdCheckoutSession("cs_live_paid")).reason, "payment_refunded");

  paidFixtures(); StripeMock.paymentIntent.latest_charge = { refunded: false, amount_refunded: 0, disputed: true };
  assert.equal((await payment.inspectAudhdCheckoutSession("cs_live_paid")).reason, "payment_disputed");

  paidFixtures(); StripeMock.session.livemode = false;
  assert.equal((await payment.inspectAudhdCheckoutSession("cs_live_paid")).reason, "session_not_paid");

  allowedPrices = [];
  assert.equal((await payment.inspectAudhdCheckoutSession("cs_live_paid")).reason, "price_not_configured");
  allowedPrices = ["price_audhd_current", "price_audhd_historical"];

  assert.equal((await payment.inspectAudhdCheckoutSession("cs_test_paid")).reason, "invalid_session_id");
  console.log("PASS: AuDHD support recovery requires a live, complete, captured, non-refunded checkout with exactly the configured AuDHD Price ID.");
})().catch(error => { console.error(error); process.exitCode = 1; });
