/* eslint-disable @typescript-eslint/no-require-imports -- executable Stripe payment-verification regression test. */
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
let checkoutPrice = "price_audhd_79";
const payment = createLoader({ stripe: { default: StripeMock }, "./paymentProductCatalog.server": { configuredAudhdCheckoutPriceId: () => { if (!checkoutPrice) throw new Error("missing"); return checkoutPrice; } } })(path.join(__dirname, "audhdCheckoutPayment.server.ts"));
function paid() {
  StripeMock.session = { id: "cs_live_audhd123", livemode: true, mode: "payment", status: "complete", payment_status: "paid", client_reference_id: "audhd_12345678901234567890123456789012", amount_total: 7900, currency: "sek", payment_intent: "pi_audhd123" };
  StripeMock.lineItems = [{ price: { id: "price_audhd_79" }, quantity: 1 }];
  StripeMock.paymentIntent = { status: "succeeded", amount_received: 7900, latest_charge: { paid: true, refunded: false, amount_refunded: 0, disputed: false } };
  StripeMock.charge = null;
}

(async () => {
  paid();
  assert.deepEqual(await payment.verifyAudhdCheckoutPayment("cs_live_audhd123"), { verified: true, checkoutSessionId: "cs_live_audhd123", checkoutReferenceId: "audhd_12345678901234567890123456789012", paymentIntentId: "pi_audhd123" });
  paid(); StripeMock.session.payment_status = "unpaid";
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_live_audhd123")).reason, "session_not_paid");
  paid(); StripeMock.session.livemode = false;
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_live_audhd123")).reason, "session_not_paid");
  paid(); StripeMock.session.client_reference_id = "audhd_wrong";
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_live_audhd123")).reason, "wrong_reference");
  paid(); StripeMock.lineItems = [{ price: { id: "price_other" }, quantity: 1 }];
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_live_audhd123")).reason, "wrong_price_or_amount");
  paid(); checkoutPrice = "price_audhd_current";
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_live_audhd123")).reason, "wrong_price_or_amount", "a historical recovery Price can never unlock a new Checkout return");
  checkoutPrice = "";
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_live_audhd123")).reason, "price_not_configured");
  checkoutPrice = "price_audhd_79";
  paid(); StripeMock.session.amount_total = 7901;
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_live_audhd123")).reason, "wrong_price_or_amount");
  paid(); StripeMock.paymentIntent.latest_charge = { paid: true, refunded: true, amount_refunded: 7900 };
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_live_audhd123")).reason, "payment_refunded");
  paid(); StripeMock.paymentIntent.latest_charge = { paid: true, refunded: false, amount_refunded: 0, disputed: true };
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_live_audhd123")).reason, "payment_disputed");
  assert.equal((await payment.verifyAudhdCheckoutPayment("cs_test_audhd123")).reason, "invalid_session_id");
  console.log("PASS: AuDHD payment return requires one exact live paid 79 SEK Price, the reserved reference, captured funds, and no refund or dispute.");
})().catch(error => { console.error(error); process.exitCode = 1; });
