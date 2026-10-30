/* eslint-disable @typescript-eslint/no-require-imports -- synthetic browser/transport boundary. */
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const {randomBytes,webcrypto}=require("node:crypto");
const createLoader=require("../../autism-test/test/test-loader.cjs");
const memory=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};};
global.localStorage=memory();global.window={sessionStorage:memory(),location:{assign:value=>navigations.push(value)}};
Object.defineProperty(global,"crypto",{value:webcrypto,configurable:true});
const navigations=[],calls=[];let sequence=0,fail=false;
Object.assign(process.env,{NEXT_PUBLIC_SUPABASE_URL:"https://synthetic.supabase.co",NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"synthetic-public",NEXT_PUBLIC_DIRECT_TEST_ACCOUNTS_ENABLED:"true"});
const token="synthetic-session-not-a-real-token";
const load=createLoader({"@supabase/supabase-js":{createClient:(_url,_key,config)=>{
  assert.equal(config.auth.storage,window.sessionStorage);assert.equal(config.auth.detectSessionInUrl,false);
  return {auth:{getSession:async()=>({data:{session:{access_token:token}}})}};
}}});
const client=load(path.join(__dirname,"directClient.ts")),config=load(path.join(__dirname,"directPublic.ts"));
global.fetch=async(url,options)=>{
  calls.push({url,options});
  if(fail)return {ok:false};
  const id="11111111-1111-4111-8111-"+String(++sequence).padStart(12,"0");
  return {ok:true,json:async()=>({id,secret:options.headers["x-test-possession"]||randomBytes(32).toString("base64url"),url:"https://checkout.stripe.com/c/pay/synthetic"})};
};
(async()=>{
  assert.equal(config.directCustomerEnabled(),true);
  const sensitive={answers:Array(30).fill(2),questionVersion:"adhd-questions-v1",reportVersion:"adhd-report-v1"};
  await client.startDirectCheckout("adhd_test",sensitive);
  await client.startDirectCheckout("autism_test",sensitive);
  assert.equal(client.pendingPurchases().length,2,"two unclaimed purchases are preserved independently");
  await client.directRequest({action:"open",id:"private-purchase",product:"adhd_test"},{authenticated:true});
  for(const {url,options} of calls){
    assert.equal(url,"https://synthetic.supabase.co/functions/v1/customer-tests?forceFunctionRegion=eu-central-1");
    assert.equal(new URL(url).search,"?forceFunctionRegion=eu-central-1");assert.equal(new URL(url).hash,"");
    assert.equal(options.credentials,"omit");assert.equal(options.referrerPolicy,"no-referrer");assert.equal(options.headers["x-region"],"eu-central-1");
  }
  assert.equal(calls.at(-1).options.headers.Authorization,"Bearer "+token);
  const first=client.pendingPurchases()[0].id;client.forgetPending(first);
  assert.equal(client.pendingPurchases().length,1);
  fail=true;await assert.rejects(client.startDirectCheckout("adhd_test",sensitive));
  assert.equal(navigations.length,2,"an Edge error never creates a legacy payment navigation");
  const login=client.directLoginRedirect("https://www.relationsvarning.se");
  assert.equal(new URL(login).pathname,"/mina-sidor");assert.equal(new URL(login).search,"");assert.equal(new URL(login).hash,"#login");
  const hash="f".repeat(64);assert.equal(client.readLoginFragment("#login?token_hash="+hash+"&type=email"),hash);
  assert.equal(client.readLoginFragment("#login?token_hash="+hash+"&type=recovery"),null);
  assert.equal(client.readLoginFragment("?token_hash="+hash+"&type=email"),null);
  const hook=fs.readFileSync(path.resolve(__dirname,"../../_components/useTestAccountCheckout.ts"),"utf8");
  assert(hook.includes("if (directCustomerEnabled())"));assert(hook.includes("never fall through"));
  const proxy=fs.readFileSync(path.resolve(__dirname,"../../../proxy.ts"),"utf8");
  assert(proxy.includes('pathname === "/mina-sidor" && directPortalEnabled()'));
  process.env.ACCOUNT_DIRECT_PORTAL_ENABLED="true";process.env.ACCOUNT_PORTAL_ENABLED="true";
  const {NextRequest}=require("next/server"),gate=load(path.resolve(__dirname,"../../../proxy.ts")).proxy;
  for(const route of ["/api/account/purchases","/api/test-accounts/adhd/checkout","/mina-sidor/analyser/private-id"]) {
    assert.equal((await gate(new NextRequest("https://www.relationsvarning.se"+route))).status,503,"old personalized routes stay closed even if the old flag is accidentally true");
  }
  assert.equal((await gate(new NextRequest("https://www.relationsvarning.se/mina-sidor"))).status,200);
  assert.equal((await gate(new NextRequest("https://www.relationsvarning.se/logga-in"))).status,303);
  assert.equal((await gate(new NextRequest("https://www.relationsvarning.se/api/audhd-checkout/return"))).status,200,"legacy guest callback is preserved");
  console.log("PASS: direct browser transport, private URL fragments, session-only Auth, multiple pending purchases, no Vercel sensitive proxy/fallback and no PLUS requirement.");
})().catch(error=>{console.error(error);process.exitCode=1;});
