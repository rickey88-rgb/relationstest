/* eslint-disable @typescript-eslint/no-require-imports -- executable catalogue regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

// Production has both books enabled; also exercise the paused configuration below.
const crossSell = createLoader({ "../_lib/featureFlags": { AUTISM_BOOK_SALE_ENABLED: true, ADHD_DELUXE_SALE_ENABLED: true } })(path.join(__dirname, "crossSellConfig.ts"));
const noExistingUnlocks = () => false;

const adhdOffers = crossSell.resolveCrossSellOffers("adhd_test", { hasTestAccess: noExistingUnlocks });
assert.deepEqual(adhdOffers.map((offer) => [offer.productId, offer.displayPosition]), [["audhd_test", "primary"], ["adhd_deluxe", "secondary"]]);
assert.deepEqual(
  crossSell.resolveCrossSellOffers("adhd_test", { hasTestAccess: (testId) => testId === "audhd_test" }).map((offer) => offer.productId),
  ["adhd_deluxe"],
);

const autismOffers = crossSell.resolveCrossSellOffers("autism_test", { hasTestAccess: noExistingUnlocks });
assert.deepEqual(autismOffers.map((offer) => [offer.productId, offer.displayPosition]), [["audhd_test", "primary"], ["autism_book", "secondary"]]);

const audhdOffers = crossSell.resolveCrossSellOffers("audhd_test", {
  preferredProductIds: ["autism_test", "adhd_test"],
  hasTestAccess: noExistingUnlocks,
});
assert.deepEqual(audhdOffers.map((offer) => [offer.productId, offer.displayPosition]), [["autism_test", "primary"], ["audhd_book", "secondary"]]);
assert.deepEqual(
  crossSell.resolveCrossSellOffers("audhd_test", {
    preferredProductIds: ["autism_test", "adhd_test"],
    hasTestAccess: (testId) => testId === "autism_test",
  }).map((offer) => offer.productId),
  ["adhd_test", "audhd_book"],
);

assert.deepEqual(
  crossSell.resolveCrossSellOffers("autism_book", { hasTestAccess: noExistingUnlocks }).map((offer) => offer.productId),
  ["autism_test"],
);
assert.deepEqual(
  crossSell.resolveCrossSellOffers("audhd_book", { hasTestAccess: noExistingUnlocks }).map((offer) => offer.productId),
  ["audhd_test"],
);
assert.equal(crossSell.productCatalog.adhd_deluxe.enabled, true);
assert.equal(crossSell.productCatalog.autism_book.enabled, true);
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

const paused = createLoader({ "../_lib/featureFlags": { AUTISM_BOOK_SALE_ENABLED: false, ADHD_DELUXE_SALE_ENABLED: false } })(path.join(__dirname, "crossSellConfig.ts"));
assert.deepEqual(paused.resolveCrossSellOffers("autism_test").map(offer => offer.productId), ["audhd_test"]);
assert.deepEqual(paused.resolveCrossSellOffers("adhd_test").map(offer => offer.productId), ["audhd_test"]);
const bookOffers = createLoader()(path.join(__dirname, "../_lib/bookOffers.ts"));
const testConfig = createLoader()(path.join(__dirname, "../_analytics/config.ts")).testConfig;
for (const [source, book, getter] of [["adhd_test", "adhd_deluxe", "getAdhdDeluxeBookOffer"], ["autism_test", "autism_book", "getAutismBookOffer"], ["audhd_test", "audhd_book", "getAudhdBookOffer"]]) {
  const offers = crossSell.resolveCrossSellOffers(source);
  assert.equal(offers.length, 2);
  assert.equal(offers[0].product.type, "test");
  assert.equal(offers[0].product.price, testConfig[offers[0].productId].price);
  assert.equal(offers[1].productId, book);
  assert.equal(offers[1].product.price, bookOffers[getter]("analysis").price);
  assert.equal(offers[1].product.purchasePath, bookOffers[getter]("analysis").paymentLink);
}
assert.deepEqual(crossSell.resolveCrossSellOffers("audhd_test", { hasTestAccess: () => true }).map(offer => offer.productId), ["audhd_book"]);
const disabledBook = crossSell.productCatalog.audhd_book;
crossSell.productCatalog.audhd_book = undefined;
assert.deepEqual(crossSell.resolveCrossSellOffers("audhd_test").map(offer => offer.productId), ["adhd_test"]);
crossSell.productCatalog.audhd_book = disabledBook;
for (const source of Object.keys(crossSell.crossSellOffers)) {
  const offers = crossSell.resolveCrossSellOffers(source);
  assert(offers.length <= 2);
  assert(!offers.some(offer => offer.productId === source));
  assert.equal(new Set(offers.map(offer => offer.productId)).size, offers.length);
  for (const offer of offers) assert(offer.path ?? offer.product.path);
}
console.log("PASS: next test + book, shared prices/checkout links, paused/missing books, existing unlocks and recommendation fallbacks.");
