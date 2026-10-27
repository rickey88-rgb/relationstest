/* eslint-disable @typescript-eslint/no-require-imports -- synthetic standalone deployment regression. */
const assert = require('node:assert/strict');
const path = require('node:path');
const config = require('../deploy/pricing79.json');
const { mergeProductMap, verifyCoverage } = require('../deploy/merge-price79-map.cjs');
const createLoader = require('../app/autism-test/test/test-loader.cjs');
// Verified reference catalog with synthetic additional history; never a claim about the current hidden Vercel map.
const before = Object.fromEntries(Object.entries(config.referencePriceIds).map(([key, id]) => [key, { priceIds: [id], paymentLinkIds: [] }]));
before.adhd_test.priceIds.push('price_SyntheticHistoricalADHD');
before.autism_test.paymentLinkIds.push('plink_SyntheticHistoricalAutism');
before.audhd_bok = { priceIds: ['price_SyntheticBook'], paymentLinkIds: ['plink_SyntheticBook'] };
const original = structuredClone(before), after = mergeProductMap(before);
assert.deepEqual(before, original, 'merge must not mutate input');
assert.equal(verifyCoverage(after), true);
for (const [key, entry] of Object.entries(before)) {
  if (!['adhd_test', 'autism_test'].includes(key)) assert.deepEqual(after[key], entry, 'every unrelated product remains byte-for-byte equivalent');
  for (const field of ['priceIds', 'paymentLinkIds']) for (const id of entry[field]) assert(after[key][field].includes(id));
}
assert.deepEqual(mergeProductMap(after), after, 'repeat application is idempotent');
const prior = process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;
try {
  process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON = JSON.stringify(after);
  const catalog = createLoader()(path.resolve(__dirname, '../app/_lib/paymentProductCatalog.server.ts'));
  for (const [key, entry] of Object.entries(after)) {
    for (const id of entry.priceIds) assert.equal(catalog.identifyPaymentProduct({ priceIds: [id], paymentLinkId: null }), key);
    for (const id of entry.paymentLinkIds) assert.equal(catalog.identifyPaymentProduct({ priceIds: [], paymentLinkId: id }), key);
  }
  for (const [key, product] of Object.entries(config.products)) assert.equal(catalog.identifyPaymentProduct({ priceIds: [product.priceId], paymentLinkId: product.paymentLinkId }), key);
  assert.equal(catalog.identifyPaymentProduct({ priceIds: [config.products.adhd_test.priceId], paymentLinkId: config.products.autism_test.paymentLinkId }), 'unmapped');
} finally {
  if (prior === undefined) delete process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON; else process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON = prior;
}
const collision = structuredClone(before); collision.iq_test.priceIds.push(config.products.adhd_test.priceId);
assert.throws(() => mergeProductMap(collision), /multiple products/);
assert.throws(() => mergeProductMap(before, { iq_test: { priceIds: ['price_SyntheticWrongScope'] } }), /only add/);
const missing = structuredClone(after); delete missing.ptsd_test;
assert.throws(() => verifyCoverage(missing), /Missing/);
assert.throws(() => mergeProductMap({ adhd_test: { priceIds: 'invalid' } }), /array/);
assert.throws(() => mergeProductMap({ adhd_test: { priceIds: ['not-a-price'] } }), /identifier/);
console.log('PASS: all 15 reference tests map correctly; all history and other products retained; additive/idempotent merge; missing products and collisions rejected. Current production map requires a separate export.');
