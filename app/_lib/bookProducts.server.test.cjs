/* eslint-disable @typescript-eslint/no-require-imports -- executable server configuration regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.AUDHD_BOOK_PAYMENT_LINK_149 = "plink_audhd_book_149";
process.env.AUDHD_BOOK_PAYMENT_LINK_79 = "plink_audhd_book_79";
process.env.AUTISM_BOOK_PAYMENT_LINK_ID_149 = "plink_autism_book_149";
process.env.AUTISM_BOOK_PAYMENT_LINK_ID_99 = "plink_autism_book_99";
process.env.STRIPE_SECRET_KEY = "test-secret-used-only-with-a-local-mock";
process.env.R2_ENDPOINT = "https://r2.example.test";
process.env.R2_BUCKET_NAME = "relationsvarning-private";
process.env.R2_ACCESS_KEY_ID = "test-access-key";
process.env.R2_SECRET_ACCESS_KEY = "test-secret-key";
process.env.AUTISM_BOOK_R2_KEY = "books/autism/Pa-mitt-satt_Elias-Voss.pdf";

class StripeMock {
  static session = null;
  constructor() {
    this.checkout = { sessions: { retrieve: async () => StripeMock.session } };
  }
}

const products = createLoader({ stripe: { default: StripeMock } })(path.join(__dirname, "bookProducts.server.ts"));

assert(products.isStripeCheckoutSessionId("cs_test_audhdbook123"));
assert(products.isStripeCheckoutSessionId("cs_live_audhdbook123"));
assert.equal(products.isStripeCheckoutSessionId("not-a-checkout-session"), false);
assert(products.isAllowedAudhdBookPaymentLink("plink_audhd_book_149"));
assert(products.isAllowedAudhdBookPaymentLink({ id: "plink_audhd_book_79" }));
assert.equal(products.isAllowedAudhdBookPaymentLink("plink_other_product"), false);
assert.equal(products.isAllowedAudhdBookPaymentLink(null), false);
assert(products.isAllowedAutismBookPaymentLink("plink_autism_book_149"));
assert(products.isAllowedAutismBookPaymentLink({ id: "plink_autism_book_99" }));
assert.equal(products.isAllowedAutismBookPaymentLink("plink_audhd_book_149"), false);
assert.equal(products.isAllowedAutismBookPaymentLink(null), false);
assert.equal(products.autismBookR2Config().key, "books/autism/Pa-mitt-satt_Elias-Voss.pdf");

(async () => {
  StripeMock.session = { status: "complete", payment_status: "paid", payment_link: "plink_audhd_book_149" };
  assert.equal(await products.verifyAudhdBookCheckoutSession("cs_test_audhdbook123"), true);

  StripeMock.session = { status: "complete", payment_status: "paid", payment_link: "plink_other_product" };
  assert.equal(await products.verifyAudhdBookCheckoutSession("cs_test_audhdbook123"), false);

  StripeMock.session = { status: "complete", payment_status: "unpaid", payment_link: "plink_audhd_book_149" };
  assert.equal(await products.verifyAudhdBookCheckoutSession("cs_test_audhdbook123"), false);

  StripeMock.session = { status: "complete", payment_status: "paid", payment_link: "plink_autism_book_149" };
  assert.equal(await products.verifyAutismBookCheckoutSession("cs_test_autismbook123"), true);

  StripeMock.session = { status: "complete", payment_status: "paid", payment_link: "plink_autism_book_99" };
  assert.equal(await products.verifyAutismBookCheckoutSession("cs_test_autismbook123"), true);

  StripeMock.session = { status: "complete", payment_status: "paid", payment_link: "plink_other_product" };
  assert.equal(await products.verifyAutismBookCheckoutSession("cs_test_autismbook123"), false);

  StripeMock.session = { status: "complete", payment_status: "unpaid", payment_link: "plink_autism_book_149" };
  assert.equal(await products.verifyAutismBookCheckoutSession("cs_test_autismbook123"), false);
  assert.equal(await products.verifyAutismBookCheckoutSession("not-a-checkout-session"), false);
  console.log("PASS: only completed, paid sessions from configured book Payment Links are accepted.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
