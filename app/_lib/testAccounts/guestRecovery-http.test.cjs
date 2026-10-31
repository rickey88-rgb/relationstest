/* eslint-disable @typescript-eslint/no-require-imports -- anonymous transport and webhook isolation, simulated mail only. */
const assert=require('node:assert/strict'),path=require('node:path'),Stripe=require('stripe');
let enabled=true,fail=false,indexed=0,requested=0,identityCalls=0;
const load=require('../../autism-test/test/test-loader.cjs')({'./guestRecovery.server':{
 guestRecoveryEnabled:()=>enabled,indexGuestRecovery:async()=>{indexed++;if(fail)throw Error('sensitive-provider-detail');},
 requestGuestRecovery:async()=>{requested++;if(fail)throw Error('sensitive-provider-detail');},
 redeemGuestRecovery:async token=>{if(fail||token!=='t'.repeat(43))throw Error('sensitive-token-detail');return {id:'11111111-1111-4111-8111-111111111111',product:'autism_test',secret:'s'.repeat(43)};}}});
Object.assign(process.env,{ACCOUNT_PORTAL_ENABLED:'true',DIRECT_CUSTOMER_TESTS_ENABLED:'true',DIRECT_CUSTOMER_TESTS_WEBHOOK_ENABLED:'true',STRIPE_WEBHOOK_SECRET:'whsec_synthetic'});
const handler=load(path.join(__dirname,'directHandler.server.ts')).directCustomerHandler({directIdentity:async()=>{identityCalls++;return null;}});
const request=(body,method='POST',origin='https://www.relationsvarning.se')=>handler(new Request('https://synthetic.supabase.co/functions/v1/customer-tests',{method,headers:{origin,'content-type':'application/json'},...(method==='POST'?{body:JSON.stringify(body)}:{})}));
(async()=>{
 const old=console.error,logs=[];console.error=value=>logs.push(value);try{
 for(const failure of [false,true]){fail=failure;const r=await request({action:'recovery-request',email:'synthetic@example.invalid'});assert.equal(r.status,202);assert.deepEqual(await r.json(),{requested:true});}
 assert(!logs.join('').includes('sensitive-provider-detail'));assert(!logs.join('').includes('synthetic@example.invalid'));
 fail=false;const r=await request({action:'recovery-redeem',token:'t'.repeat(43)});assert.equal(r.status,200);assert.equal((await r.json()).secret,'s'.repeat(43));assert.equal(identityCalls,0);
 assert.equal((await request({},'GET')).status,405);assert.equal((await request({action:'recovery-request'},'POST','https://attacker.invalid')).status,403);
 enabled=false;assert.equal((await request({action:'recovery-request'})).status,503);enabled=true;
 const webhook=load(path.join(__dirname,'directWebhook.server.ts')).directStripeWebhook,stripe=new Stripe('sk_test_synthetic');
 const raw=JSON.stringify({type:'checkout.session.completed',data:{object:{id:'cs_live_synthetic',payment_status:'paid',metadata:{rv_flow:'direct_customer_v1'}}}});
 const signature=stripe.webhooks.generateTestHeaderString({payload:raw,secret:'whsec_synthetic'});
 const send=()=>webhook(new Request('https://synthetic.supabase.co/functions/v1/customer-tests/stripe-webhook',{method:'POST',headers:{'stripe-signature':signature},body:raw}),stripe,async()=>{throw Error('New payment must not be sent to Vercel');});
 assert.equal((await send()).status,200);assert.equal(indexed,1);fail=true;assert.equal((await send()).status,503,'Stripe can retry failed index writes');fail=false;
 enabled=false;assert.equal((await send()).status,200);assert.equal(indexed,2,'disabled feature leaves existing new payment flow unchanged');assert.equal(requested,2);
 console.log('PASS: no Auth/account requirement, uniform non-enumerating response, no sensitive logs, CORS/GET rejection, signed webhook indexing and safe feature-off/legacy boundary.');
 }finally{console.error=old;}
})().catch(e=>{console.error(e);process.exitCode=1;});
