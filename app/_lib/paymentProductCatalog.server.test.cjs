/* eslint-disable @typescript-eslint/no-require-imports -- executable server-only regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

const original = process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;
process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON = JSON.stringify({
  adhd_test: { priceIds: ["price_adhd_39"], paymentLinkIds: ["plink_adhd"] },
  audhd_test: { priceIds: ["price_audhd_79"] },
});
const catalog = createLoader()(path.join(__dirname, "paymentProductCatalog.server.ts"));

assert.equal(catalog.identifyPaymentProduct({ priceIds: ["price_adhd_39"], paymentLinkId: null }), "adhd_test");
assert.equal(catalog.identifyPaymentProduct({ priceIds: [], paymentLinkId: "plink_adhd" }), "adhd_test");
assert.equal(catalog.identifyPaymentProduct({ priceIds: ["price_unknown"], paymentLinkId: null }), "unmapped");
assert.equal(catalog.identifyPaymentProduct({ priceIds: ["price_adhd_39", "price_audhd_79"], paymentLinkId: null }), "unmapped");

process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON = "not-json";
assert.throws(() => catalog.paymentProductCatalog(), /not valid JSON/);
if (original === undefined) delete process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;
else process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON = original;
console.log("PASS: payment product mapping accepts one matching Price or Payment Link and safely leaves ambiguous products unmapped.");
