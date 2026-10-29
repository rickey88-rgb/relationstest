/* eslint-disable @typescript-eslint/no-require-imports -- synthetic standalone pricing regression. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const root = process.cwd();
const createLoader = require(path.join(root, 'app/autism-test/test/test-loader.cjs'));
const load = createLoader();
const current = require('../deploy/pricing39.json');
const history = require('../deploy/pricing79.json');
const expected = { iq_test:79, audhd_test:79, hsp_test:49, ptsd_test:39, autism_test:39, adhd_test:39, angest_test:39, screening_test:39, psychological_abuse_test:39, attachment_test:39, codependency_test:39, gaslighting_test:39, trauma_bond_test:39, narcissist_partner:39, narcissism_selftest:39 };
assert.deepEqual(Object.fromEntries(Object.entries(load(path.join(root,'app/_analytics/config.ts')).testConfig).map(([key,value]) => [key,value.price])), expected);
// Original complete models at 39 SEK: questions, scoring, state versions,
// storage keys and persisted-unlock parsing must remain exactly unchanged.
const pins = { adhd:'b66ba5fd17805d6335fd0c3289368d0d2814cdb2b9f53b09a3321f77ec71604b', autism:'3b1be9bc3b6b24e60107905ab58fee0826e4eafe72577b0c0fee6fc3b1c4dbe2' };
for (const slug of ['adhd','autism']) {
  const key=slug+'_test', upper=slug.toUpperCase(), modelPath=path.join(root,`app/${slug}-test/test/model.ts`);
  const source=fs.readFileSync(modelPath,'utf8').replace(/\r\n/g,'\n');
  assert.equal(createHash('sha256').update(source).digest('hex'),pins[slug]);
  const model=load(modelPath); assert.equal(model.PRICE_SEK,39);
  for (const previouslyPaid of [39,79]) {
    const saved={version:model.STATE_VERSION,answers:Array(30).fill(2),index:29,unlocked:true,paidPrice:previouslyPaid};
    const restored=model.parseState(JSON.stringify(saved));
    assert.equal(restored.unlocked,true); assert.deepEqual(restored.answers,saved.answers);
  }
  assert(fs.readFileSync(path.join(root,`app/${slug}-test/page.tsx`),'utf8').includes('analysen kostar 39 kr.'));
  const envName=`NEXT_PUBLIC_${upper}_PAYMENT_LINK_79`, prior=process.env[envName];
  try {
    for (const stale of [undefined, '', history.products[key].url, 'https://example.invalid/wrong']) {
      if(stale===undefined)delete process.env[envName];else process.env[envName]=stale;
      assert.equal(createLoader()(path.join(root,`app/${slug}-test/test/payment.ts`))[upper+'_STRIPE_URL'],current.products[key].url);
    }
  } finally { if(prior===undefined)delete process.env[envName];else process.env[envName]=prior; }
  assert.equal(current.products[key].amount,3900); assert.equal(current.products[key].currency,'sek');
  assert.equal(current.products[key].returnUrl,`https://relationsvarning.se/${slug}-test/test?paid=true`);
  assert(history.productMapMerge[key].priceIds.includes(current.products[key].priceId));
  assert(history.productMapMerge[key].priceIds.includes(history.products[key].priceId));
}
const priorMap=process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;
try {
  process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON=JSON.stringify(history.productMapMerge);
  const catalog=load(path.join(root,'app/_lib/paymentProductCatalog.server.ts'));
  for (const key of ['adhd_test','autism_test']) {
    for (const priceId of history.productMapMerge[key].priceIds) assert.equal(catalog.identifyPaymentProduct({priceIds:[priceId],paymentLinkId:null}),key);
    for (const paymentLinkId of history.productMapMerge[key].paymentLinkIds) assert.equal(catalog.identifyPaymentProduct({priceIds:[],paymentLinkId}),key);
  }
} finally { if(priorMap===undefined)delete process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;else process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON=priorMap; }
console.log('PASS: ADHD/autism 39 SEK; original links ignore former 79 variables; entire analyses/state parsing unchanged; 39/79 history retained; AuDHD and other prices unchanged.');
