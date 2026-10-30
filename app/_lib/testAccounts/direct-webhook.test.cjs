/* eslint-disable @typescript-eslint/no-require-imports -- actual Stripe signature verification, synthetic events only. */
const assert=require("node:assert/strict"),path=require("node:path"),Stripe=require("stripe");
const load=require("../../autism-test/test/test-loader.cjs")(),handler=load(path.join(__dirname,"directWebhook.server.ts")).directStripeWebhook;
const secret="whsec_synthetic_not_a_real_secret";process.env.STRIPE_WEBHOOK_SECRET=secret;process.env.DIRECT_CUSTOMER_TESTS_WEBHOOK_ENABLED="true";
const stripe=new Stripe("sk_test_synthetic");let lookups=0,forwarded=[];
stripe.paymentIntents.retrieve=async id=>{lookups++;if(id==="pi_unavailable")throw new Error("synthetic outage");return {id,metadata:id==="pi_new"?{rv_flow:"direct_customer_v1"}:{}};};
stripe.charges.retrieve=async()=>({payment_intent:"pi_new"});
const relay=async(url,options)=>{forwarded.push({url,options});return {ok:true};};
async function send(type,object,signatureOverride){
  const payload=JSON.stringify({id:"evt_synthetic",object:"event",type,data:{object}});
  const signature=signatureOverride??stripe.webhooks.generateTestHeaderString({payload,secret});
  const request=new Request("https://synthetic.supabase.co/functions/v1/customer-tests/stripe-webhook",{method:"POST",headers:{"stripe-signature":signature},body:payload});
  return {response:await handler(request,stripe,relay),payload,signature};
}
(async()=>{
  for(const [type,object] of [
    ["checkout.session.completed",{client_reference_id:"ta:synthetic",metadata:{rv_flow:"direct_customer_v1"}}],
    ["payment_intent.succeeded",{metadata:{rv_flow:"direct_customer_v1"}}],
    ["charge.refunded",{payment_intent:"pi_new"}],
    ["charge.dispute.created",{charge:"ch_new"}],
  ])assert.equal((await send(type,object)).response.status,200);
  assert.equal(forwarded.length,0,"no new payment metadata reaches Vercel");
  const legacy=await send("checkout.session.completed",{client_reference_id:"audhd_historical",metadata:{}});
  assert.equal(legacy.response.status,200);assert.equal(forwarded.length,1);
  assert.equal(forwarded[0].url,"https://www.relationsvarning.se/api/stripe/webhook");
  assert.equal(Buffer.from(forwarded[0].options.body).toString(),legacy.payload);
  assert.equal(forwarded[0].options.headers["stripe-signature"],legacy.signature);
  assert.equal((await send("checkout.session.completed",{},"forged")).response.status,400);
  assert.equal((await send("checkout.session.completed",{client_reference_id:"ta:unclassified"})).response.status,503);
  assert.equal((await send("charge.refunded",{payment_intent:"pi_unavailable"})).response.status,503);
  assert.equal(forwarded.length,1,"unclassifiable/refunded events fail closed rather than leaking");
  assert.equal(lookups,3);
  console.log("PASS: real Stripe HMAC verification, new session/refund/dispute isolation, unchanged legacy signatures, safe retries and no metadata leakage.");
})().catch(error=>{console.error(error);process.exitCode=1;});
