/* eslint-disable @typescript-eslint/no-require-imports -- executable server-only regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

const original = process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;
const originalCheckoutPrice = process.env.AUDHD_CHECKOUT_PRICE_ID;
const originalBookPrice = process.env.OVERTHINKING_BOOK_PRICE_ID;
process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON = JSON.stringify({
  adhd_test: { priceIds: ["price_adhd_39"], paymentLinkIds: ["plink_adhd"] },
  audhd_test: { priceIds: ["price_Current123", "price_Historical456"] },
});
process.env.AUDHD_CHECKOUT_PRICE_ID = "price_Current123";
const catalog = createLoader()(path.join(__dirname, "paymentProductCatalog.server.ts"));

assert.equal(catalog.identifyPaymentProduct({ priceIds: ["price_adhd_39"], paymentLinkId: null }), "adhd_test");
assert.equal(catalog.identifyPaymentProduct({ priceIds: [], paymentLinkId: "plink_adhd" }), "adhd_test");
assert.equal(catalog.identifyPaymentProduct({ priceIds: ["price_unknown"], paymentLinkId: null }), "unmapped");
assert.equal(catalog.identifyPaymentProduct({ priceIds: ["price_adhd_39", "price_Current123"], paymentLinkId: null }), "unmapped");
assert.equal(catalog.identifyPaymentProduct({ priceIds: ["price_Historical456"], paymentLinkId: null }), "audhd_test");
assert.equal(catalog.configuredAudhdCheckoutPriceId(), "price_Current123");
process.env.AUDHD_CHECKOUT_PRICE_ID = "price_other";
assert.throws(() => catalog.configuredAudhdCheckoutPriceId(), /must be allowlisted/);
delete process.env.AUDHD_CHECKOUT_PRICE_ID;
assert.throws(() => catalog.configuredAudhdCheckoutPriceId(), /not configured/);
process.env.AUDHD_CHECKOUT_PRICE_ID = "price_Current123";

process.env.OVERTHINKING_BOOK_PRICE_ID = "price_Book149";
assert.equal(catalog.identifyPaymentProduct({ priceIds: ["price_Book149"], paymentLinkId: null }), "overthinking_book");
process.env.OVERTHINKING_BOOK_PRICE_ID = "price_Current123";
assert.deepEqual(catalog.configuredPriceIdsForProduct("overthinking_book"), []);
assert.equal(catalog.configuredAudhdCheckoutPriceId(), "price_Current123");
assert.equal(catalog.identifyPaymentProduct({ priceIds: [], paymentLinkId: "plink_adhd" }), "adhd_test");
if (originalBookPrice === undefined) delete process.env.OVERTHINKING_BOOK_PRICE_ID;
else process.env.OVERTHINKING_BOOK_PRICE_ID = originalBookPrice;

process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON = "not-json";
assert.throws(() => catalog.paymentProductCatalog(), /not valid JSON/);
if (original === undefined) delete process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;
else process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON = original;
if (originalCheckoutPrice === undefined) delete process.env.AUDHD_CHECKOUT_PRICE_ID;
else process.env.AUDHD_CHECKOUT_PRICE_ID = originalCheckoutPrice;
console.log("PASS: product mapping keeps historical AuDHD prices allowlisted while one explicit current Price is required for Checkout.");
