/* eslint-disable @typescript-eslint/no-require-imports -- executable catalogue regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

const crossSell = createLoader()(path.join(__dirname, "crossSellConfig.ts"));
const noExistingUnlocks = () => false;

const adhdOffers = crossSell.resolveCrossSellOffers("adhd_test", { hasTestAccess: noExistingUnlocks });
assert.deepEqual(adhdOffers.map((offer) => [offer.productId, offer.displayPosition]), [["audhd_test", "primary"]]);
assert.deepEqual(
  crossSell.resolveCrossSellOffers("adhd_test", { hasTestAccess: (testId) => testId === "audhd_test" }).map((offer) => offer.productId),
  [],
);

const autismOffers = crossSell.resolveCrossSellOffers("autism_test", { hasTestAccess: noExistingUnlocks });
assert.deepEqual(autismOffers.map((offer) => [offer.productId, offer.displayPosition]), [["autism_book", "primary"], ["audhd_test", "secondary"]]);
assert.equal(autismOffers[0].product.price, 99);
assert.equal(autismOffers[0].product.ordinaryPrice, 149);

const audhdOffers = crossSell.resolveCrossSellOffers("audhd_test", {
  preferredProductIds: ["autism_test", "adhd_test"],
  hasTestAccess: noExistingUnlocks,
});
assert.deepEqual(audhdOffers.map((offer) => [offer.productId, offer.displayPosition]), [["audhd_book", "primary"], ["autism_test", "secondary"]]);
assert.deepEqual(
  crossSell.resolveCrossSellOffers("audhd_test", {
    preferredProductIds: ["autism_test", "adhd_test"],
    hasTestAccess: (testId) => testId === "autism_test",
  }).map((offer) => offer.productId),
  ["audhd_book", "adhd_test"],
);

assert.deepEqual(
  crossSell.resolveCrossSellOffers("autism_book", { hasTestAccess: noExistingUnlocks }).map((offer) => offer.productId),
  ["autism_test"],
);
assert.deepEqual(
  crossSell.resolveCrossSellOffers("audhd_book", { hasTestAccess: noExistingUnlocks }).map((offer) => offer.productId),
  ["audhd_test"],
);
assert.equal(crossSell.productCatalog.adhd_deluxe.enabled, false);
assert.equal(crossSell.productCatalog.adhd_deluxe.path, "/adhd-deluxe?offer=analysis");
assert.equal(crossSell.productCatalog.adhd_deluxe.price, 99);
assert.equal(crossSell.productCatalog.adhd_deluxe.ordinaryPrice, 149);
assert.deepEqual(
  crossSell.resolveCrossSellOffers("gaslighting_test", { hasTestAccess: noExistingUnlocks }).map((offer) => offer.productId),
  ["psychological_abuse_test"],
);
assert.deepEqual(
  crossSell.resolveCrossSellOffers("hsp_test", { hasTestAccess: noExistingUnlocks }).map((offer) => offer.productId),
  ["autism_test"],
);
assert.deepEqual(
  crossSell.resolveCrossSellOffers("hsp_test", { hasTestAccess: (testId) => testId === "autism_test" }).map((offer) => offer.productId),
  ["adhd_test"],
);

console.log("PASS: central cross-sell catalogue preserves active recommendations and pauses ADHD Deluxe sales.");
