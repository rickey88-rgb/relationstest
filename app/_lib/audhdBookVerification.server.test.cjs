/* eslint-disable @typescript-eslint/no-require-imports -- isolated verification regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");
process.env.STRIPE_SECRET_KEY = "mock";
process.env.AUDHD_BOOK_PAYMENT_LINK_149 = "plink_current149";
process.env.AUDHD_BOOK_PAYMENT_LINK_79 = "plink_current79";
process.env.AUDHD_BOOK_ALLOWED_PRICE_IDS = "price_1UMq7YAgF4ugWkEkkPZcHThd, price_1UMqCSAgF4ugWkEkksEu2KqG";
let session = { status: "complete", payment_status: "paid", mode: "payment", payment_link: "plink_old", payment_intent: "pi_mock" };
let items = { data: [{ price: { id: "price_1UMq7YAgF4ugWkEkkPZcHThd" }, quantity: 1 }], has_more: false };
let charge = { paid: true, refunded: false, amount_refunded: 0, disputed: false };
class StripeMock {
  constructor() {
    this.checkout = { sessions: { retrieve: async () => session, listLineItems: async () => items } };
    this.paymentIntents = { retrieve: async () => ({ status: "succeeded", latest_charge: charge }) };
    this.charges = { retrieve: async () => charge };
  }
}
const products = createLoader({ stripe: { default: StripeMock } })(path.join(__dirname, "bookProducts.server.ts"));
(async () => {
  const errors = []; const originalError = console.error;
  console.error = value => errors.push(JSON.parse(value));
  try {
    assert.equal(await products.verifyAudhdBookCheckoutSession("cs_live_example"), true, "older verified price");
    items.data[0].price.id = "price_1UMqCSAgF4ugWkEkksEu2KqG";
    assert.equal(await products.verifyAudhdBookCheckoutSession("cs_live_example"), true, "second verified price");
    items = { data: [{ price: { id: "price_other" }, quantity: 1 }], has_more: false };
    assert.equal(await products.verifyAudhdBookCheckoutSession("cs_live_example"), false);
    assert.equal(errors.at(-1).reason, "wrong_product");
    session.payment_link = "plink_current149";
    assert.equal(await products.verifyAudhdBookCheckoutSession("cs_live_example"), false, "current link cannot authorize another product");
    items.data[0].price.id = "price_1UMq7YAgF4ugWkEkkPZcHThd";
    for (const link of ["plink_current149", "plink_current79"]) {
      session.payment_link = link;
      assert.equal(await products.verifyAudhdBookCheckoutSession("cs_live_example"), true, "existing Payment Link");
    }
    charge = { ...charge, amount_refunded: 1 };
    assert.equal(await products.verifyAudhdBookCheckoutSession("cs_live_example"), false);
    assert.equal(errors.at(-1).reason, "payment_refunded");
    charge = { ...charge, amount_refunded: 0, disputed: true };
    assert.equal(await products.verifyAudhdBookCheckoutSession("cs_live_example"), false);
    assert.equal(errors.at(-1).reason, "payment_disputed");
    charge = { ...charge, disputed: false }; session.payment_link = "plink_old";
    delete process.env.AUDHD_BOOK_ALLOWED_PRICE_IDS;
    assert.equal(await products.verifyAudhdBookCheckoutSession("cs_live_example"), false);
    assert.equal(errors.at(-1).reason, "price_configuration_missing");
    process.env.AUDHD_BOOK_ALLOWED_PRICE_IDS = "invalid-price";
    assert.equal(await products.verifyAudhdBookCheckoutSession("cs_live_example"), false);
    assert.equal(errors.at(-1).reason, "price_configuration_error");
    assert(errors.every(entry => Object.keys(entry).sort().join(",") === "event,reason"));
  } finally { console.error = originalError; }
  console.log("PASS: AuDHD book product, historical price, refund, dispute and configuration checks.");
})().catch(error => { console.error(error); process.exitCode = 1; });
