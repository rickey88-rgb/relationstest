/* eslint-disable @typescript-eslint/no-require-imports -- synthetic capability import; existing server remains the authority. */
const assert=require('node:assert/strict'),path=require('node:path'),{randomBytes,webcrypto}=require('node:crypto');
const createLoader=require('../../autism-test/test/test-loader.cjs');
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};
global.localStorage=memory();global.window={sessionStorage:memory()};Object.defineProperty(global,'crypto',{value:webcrypto,configurable:true});
process.env.NEXT_PUBLIC_SUPABASE_URL='https://synthetic.supabase.co';process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='synthetic-public';
const client=createLoader({'@supabase/supabase-js':{createClient:()=>({auth:{getSession:async()=>({data:{session:{access_token:'synthetic-auth'}}})}})}})(path.join(__dirname,'directClient.ts'));
const first='11111111-1111-4111-8111-111111111111',second='22222222-2222-4222-8222-222222222222',secret=randomBytes(32).toString('base64url');
const hash='#restore?'+new URLSearchParams({id:first,product:'autism_test',secret});
const globalSecret=client.browserPossession(true),calls=[];let deny=true,mismatch=false;
localStorage.setItem('rv-direct-purchases-v1',JSON.stringify([{id:second,product:'adhd_test'}]));
global.fetch=async(url,options)=>{calls.push({url,options});const body=JSON.parse(options.body);return {ok:!deny,json:async()=>({product:mismatch?'adhd_test':body.product,title:'Syntetiskt test',result:{},answers:[],expiresAt:'2026-11-01'})};};
(async()=>{
 const restored=client.readGuestRestore(hash);assert.deepEqual(restored,{id:first,product:'autism_test',secret});
 for(const invalid of [hash+'&paid=true',hash.replace(first,'forged'),hash.replace(secret,'invalid'),hash.replace('autism_test','https://attacker.invalid'),hash.replace('#restore?','#login?')])assert.equal(client.readGuestRestore(invalid),null);
 await assert.rejects(client.restoreGuestPurchase(restored));assert.equal(localStorage.getItem('rv-direct-restored-possession-v1'),null);assert.equal(client.pendingPurchases().length,1,'denied/unpaid/expired restore persists no entitlement');
 deny=false;mismatch=true;await assert.rejects(client.restoreGuestPurchase(restored));assert.equal(localStorage.getItem('rv-direct-restored-possession-v1'),null);
 mismatch=false;await client.restoreGuestPurchase(restored);assert.equal(client.pendingPurchases().length,2);assert.equal(client.pendingPurchase().id,first);
 await client.directRequest({action:'guest',id:first,product:'autism_test'},{possession:true});assert.equal(calls.at(-1).options.headers['x-test-possession'],secret);
 await client.directRequest({action:'guest',id:second,product:'adhd_test'},{possession:true});assert.equal(calls.at(-1).options.headers['x-test-possession'],globalSecret,'other guest purchases retain original proof');
 for(const call of calls){assert(call.url.startsWith('https://synthetic.supabase.co/'));assert(!call.url.includes(secret));assert(!call.options.body.includes(secret));assert.equal(call.options.referrerPolicy,'no-referrer');assert.equal(call.options.credentials,'omit');}
 client.forgetPending(first);assert.equal(JSON.parse(localStorage.getItem('rv-direct-restored-possession-v1'))[first],undefined);assert.equal(client.pendingPurchases()[0].id,second);assert.equal(client.browserPossession(),globalSecret);
 const {harness}=require('../../mina-sidor/payment-return.test.cjs');const h=harness('autism_test',{pending:false,hash});h.render();const html=await h.settle();assert(html.includes('data-paid-analysis'));assert.equal(window.location.hash,'');assert(!html.includes(secret));h.cleanup();
 console.log('PASS: strictly parsed support fragment, no local entitlement before server verification, failed/product-mismatched grant denied, per-purchase proof preserves other guests, Supabase-only transport and normal result-first UI.');
})().catch(error=>{console.error(error);process.exitCode=1;});
