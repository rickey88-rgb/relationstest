/* eslint-disable @typescript-eslint/no-require-imports -- synthetic standalone regression harness. */
/* Synthetic-only offer tests. No network, Stripe writes or customer data. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=process.cwd(),createLoader=require(path.join(root,'app/autism-test/test/test-loader.cjs'));
const load=createLoader(),config=load(path.join(root,'app/_analytics/config.ts')).testConfig;
const expected={iq_test:79,audhd_test:79,hsp_test:49,ptsd_test:39,autism_test:79,adhd_test:79,angest_test:39,screening_test:39,psychological_abuse_test:39,attachment_test:39,codependency_test:39,gaslighting_test:39,trauma_bond_test:39,narcissist_partner:39,narcissism_selftest:39};
assert.deepEqual(Object.fromEntries(Object.entries(config).map(([k,v])=>[k,v.price])),expected);
const pins={adhd:'b66ba5fd17805d6335fd0c3289368d0d2814cdb2b9f53b09a3321f77ec71604b',autism:'3b1be9bc3b6b24e60107905ab58fee0826e4eafe72577b0c0fee6fc3b1c4dbe2'};
const legacy={adhd:'https://buy.stripe.com/6oUcN46SR7Il6Or5MI0gw0m',autism:'https://buy.stripe.com/7sY6oG5ON6Eh0q3b720gw0n'};
let comparisons=0;
for(const slug of ['adhd','autism']){
 const upper=slug.toUpperCase(),envName=`NEXT_PUBLIC_${upper}_PAYMENT_LINK_79`,file=path.join(root,`app/${slug}-test/test/model.ts`),model=load(file);
 assert.equal(model.PRICE_SEK,79);
 const oldSource=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n').replace('export const PRICE_SEK = 79;','export const PRICE_SEK = 39;');
 assert.equal(createHash('sha256').update(oldSource).digest('hex'),pins[slug],'entire model unchanged except the price constant');
 const ts=require(path.join(root,'node_modules/typescript')),mod={exports:{}};
 new Function('require','module','exports',ts.transpileModule(oldSource,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(name=>name.startsWith('.')?load(path.resolve(path.dirname(file),name+'.ts')):require(name),mod,mod.exports);
 for(let i=0;i<250;i++){const answers=Array.from({length:30},(_,j)=>i<5?i:(i*7+j*j+Math.floor(i/5))%5);assert.deepEqual(model.calculate(answers),mod.exports.calculate(answers));comparisons++;}
 assert(fs.readFileSync(path.join(root,`app/${slug}-test/page.tsx`),'utf8').includes('analysen kostar 79 kr.'));
 const payment=path.join(root,`app/${slug}-test/test/payment.ts`),prior=process.env[envName];
 for(const invalid of [undefined,'',legacy[slug],'https://example.invalid/price79','https://buy.stripe.com.evil.invalid/test','https://buy.stripe.com/test?price=79']){if(invalid===undefined)delete process.env[envName];else process.env[envName]=invalid;assert.throws(()=>createLoader()(payment),/verified.*79 SEK Payment Link/);}
 process.env[envName]=`https://buy.stripe.com/Synthetic${upper}79LocalOnly`;
 assert.equal(createLoader()(payment)[`${upper}_STRIPE_URL`],process.env[envName]);
 if(prior===undefined)delete process.env[envName];else process.env[envName]=prior;
}
if(fs.existsSync(path.join(root,'app/_lib/testAccounts/adapter.ts'))){const adapters=load(path.join(root,'app/_lib/testAccounts/adapter.ts'));assert.equal(adapters.adapter('adhd_test').amount,7900);assert.equal(adapters.adapter('autism_test').amount,7900);for(const [key,value]of Object.entries(expected))if(key!=='audhd_test')assert.equal(adapters.adapter(key).amount,value*100);assert.deepEqual(adapters.flags('adhd_test'),{checkout:false,save:false,read:false,legacyImport:false});assert.deepEqual(adapters.flags('autism_test'),{checkout:false,save:false,read:false,legacyImport:false});}
console.log(`PASS: only ADHD/autism 79; all other prices unchanged; ${comparisons} identical original/new analyses; missing/old/invalid links fail closed; no import or flag activation.`);

const release=JSON.parse(fs.readFileSync(path.join(root,'deploy/pricing79.json'),'utf8'));
const catalog=load(path.join(root,'app/_lib/paymentProductCatalog.server.ts'));
const mapBefore=process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;
process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON=JSON.stringify(release.productMapMerge);
try{
 for(const [key,product]of Object.entries(release.products)){
  assert.equal(product.amount,7900);assert.equal(product.currency,'sek');assert.equal(product.type,'one_time');assert.equal(product.taxBehavior,'inclusive');
  for(const priceId of release.productMapMerge[key].priceIds)assert.equal(catalog.identifyPaymentProduct({priceIds:[priceId],paymentLinkId:null}),key);
  for(const paymentLinkId of release.productMapMerge[key].paymentLinkIds)assert.equal(catalog.identifyPaymentProduct({priceIds:[],paymentLinkId}),key);
  const slug=key==='adhd_test'?'adhd':'autism',envName='NEXT_PUBLIC_'+slug.toUpperCase()+'_PAYMENT_LINK_79';
  const prior=process.env[envName];process.env[envName]=release.buildEnvironment[envName];
  try{assert.equal(createLoader()(path.join(root,'app/'+slug+'-test/test/payment.ts'))[slug.toUpperCase()+'_STRIPE_URL'],product.url);}
  finally{if(prior===undefined)delete process.env[envName];else process.env[envName]=prior;}
  assert.equal(product.returnUrl,'https://relationsvarning.se/'+slug+'-test/test?paid=true');
 }
 if(fs.existsSync(path.join(root,'app/_lib/testAccounts/payment.server.ts'))){
  const server=load(path.join(root,'app/_lib/testAccounts/payment.server.ts'));
  for(const key of ['adhd_test','autism_test']){
   const envName=key==='adhd_test'?'TEST_ACCOUNTS_ADHD_PRICE_ID':'TEST_ACCOUNTS_AUTISM_PRICE_ID',prior=process.env[envName];
   process.env[envName]=release.accountEnvironment[envName];
   try{assert.equal(server.paymentConfig(key).price,release.products[key].priceId);}
   finally{if(prior===undefined)delete process.env[envName];else process.env[envName]=prior;}
  }
 }
}finally{if(mapBefore===undefined)delete process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON;else process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON=mapBefore;}
console.log('PASS: real public links resolve from deployment configuration; new and historical Stripe identifiers map correctly; account Price selection uses verified IDs. No network or live payment.');
