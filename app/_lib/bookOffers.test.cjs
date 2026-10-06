/* eslint-disable @typescript-eslint/no-require-imports -- executable offer selection regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

const offers = createLoader()(path.join(__dirname, "bookOffers.ts"));

assert.deepEqual(offers.getAutismBookOffer(undefined), { price: 149, paymentLink: "https://buy.stripe.com/5kQ28q0ut5Adb4H5MI0gw0v", isAnalysisOffer: false });
assert.deepEqual(offers.getAutismBookOffer("analysis"), { price: 99, paymentLink: "https://buy.stripe.com/9B600i0utaUx7Sv5MI0gw0w", isAnalysisOffer: true });
assert.deepEqual(offers.getAudhdBookOffer(undefined), { price: 149, paymentLink: "https://buy.stripe.com/8x2aEWgtr2o1gp13EA0gw0t", isAnalysisOffer: false });
assert.deepEqual(offers.getAudhdBookOffer("analysis"), { price: 79, paymentLink: "https://buy.stripe.com/8x23cu0ut5Adgp11ws0gw0u", isAnalysisOffer: true });

for (const value of ["other", ["analysis"], null, true]) {
  assert.equal(offers.getAutismBookOffer(value).isAnalysisOffer, false);
  assert.equal(offers.getAudhdBookOffer(value).isAnalysisOffer, false);
}

console.log("PASS: book offers use the analysis price only for the exact offer=analysis value.");
