/* eslint-disable @typescript-eslint/no-require-imports -- synthetic standalone pricing regression. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const createLoader = require(path.join(root, 'app/autism-test/test/test-loader.cjs'));
const load = createLoader();
const previous = require('../deploy/pricing39.json');
const current = require('../deploy/pricing79.json');
const expected = { iq_test:79, audhd_test:79, audhd_test_no:199, hsp_test:49, ptsd_test:39, autism_test:79, adhd_test:79, angest_test:39, screening_test:39, psychological_abuse_test:39, attachment_test:39, codependency_test:39, gaslighting_test:39, trauma_bond_test:39, narcissist_partner:39, narcissism_selftest:39 };
assert.deepEqual(Object.fromEntries(Object.entries(load(path.join(root,'app/_analytics/config.ts')).testConfig).map(([key,value]) => [key,value.price])), expected);
const { npfPrices, npfReportAmount } = load(path.join(root, 'app/_content/npfPricing.ts'));
for (const slug of ['adhd','autism']) {
  const key=slug+'_test', upper=slug.toUpperCase(), modelPath=path.join(root,`app/${slug}-test/test/model.ts`);
  const model=load(modelPath); assert.equal(model.PRICE_SEK,79);
  assert.equal(model.STATE_VERSION,1);
  assert.equal(model.STORAGE_KEY,`relationsvarning_${slug}_state_v1`);
  assert.deepEqual(npfPrices[key].current, { amount: 7900, priceId: current.products[key].priceId, paymentLinkId: current.products[key].paymentLinkId, url: current.products[key].url });
  assert.equal(npfReportAmount(key, previous.products[key].priceId, 7900), 3900);
  assert.equal(npfReportAmount(key, current.products[key].priceId, 7900), 7900);
  for (const previouslyPaid of [39,79]) {
    const saved={version:model.STATE_VERSION,answers:Array(30).fill(2),index:29,unlocked:true,paidPrice:previouslyPaid};
    const restored=model.parseState(JSON.stringify(saved));
    assert.equal(restored.unlocked,true); assert.deepEqual(restored.answers,saved.answers);
  }
  assert(fs.readFileSync(path.join(root,`app/${slug}-test/page.tsx`),'utf8').includes(`analysen kostar {npfTests.${slug}.price} kr.`));
  const envName=`NEXT_PUBLIC_${upper}_PAYMENT_LINK_79`, prior=process.env[envName];
  try {
    for (const stale of [undefined, '', previous.products[key].url, 'https://example.invalid/wrong']) {
      if(stale===undefined)delete process.env[envName];else process.env[envName]=stale;
      assert.equal(createLoader()(path.join(root,`app/${slug}-test/test/payment.ts`))[upper+'_STRIPE_URL'],current.products[key].url);
    }
  } finally { if(prior===undefined)delete process.env[envName];else process.env[envName]=prior; }
  assert.equal(current.products[key].amount,7900); assert.equal(current.products[key].currency,'sek');
  assert.equal(current.products[key].returnUrl,`https://relationsvarning.se/${slug}-test/test?paid=true`);
  assert(current.productMapMerge[key].priceIds.includes(current.products[key].priceId));
  assert(current.productMapMerge[key].priceIds.includes(previous.products[key].priceId));
}
const priorMap=process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;
try {
  process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON=JSON.stringify(current.productMapMerge);
  const catalog=load(path.join(root,'app/_lib/paymentProductCatalog.server.ts'));
  for (const key of ['adhd_test','autism_test']) {
    for (const priceId of current.productMapMerge[key].priceIds) assert.equal(catalog.identifyPaymentProduct({priceIds:[priceId],paymentLinkId:null}),key);
    for (const paymentLinkId of current.productMapMerge[key].paymentLinkIds) assert.equal(catalog.identifyPaymentProduct({priceIds:[],paymentLinkId}),key);
  }
} finally { if(priorMap===undefined)delete process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;else process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON=priorMap; }
console.log('PASS: ADHD/autism 79 SEK with the correct links, current/historical product mapping and all unrelated prices unchanged.');
