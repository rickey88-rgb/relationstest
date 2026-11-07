/* eslint-disable @typescript-eslint/no-require-imports -- isolated provider fixtures; never imported by application code. */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {randomBytes}=require("node:crypto"),{PGlite}=require("@electric-sql/pglite");
const RealStripe=require("stripe");
const createLoader=require("../../app/autism-test/test/test-loader.cjs");
const config=require("./isolated.config.json"),root=path.resolve(__dirname,"../..");
const owner="11111111-1111-4111-8111-111111111111",other="22222222-2222-4222-8222-222222222222";
const token="A".repeat(50),otherToken="B".repeat(50),origin="https://persona-test.example.invalid";
function payloadFor(load,index=0) {
  const api=load(path.join(root,"app/persona/_domain/index.ts"));
  const {profiles,fixed}=require("../../app/persona/_domain/tests/v2-fixtures.cjs");
  const profile=profiles[index],answers=fixed(profile);
  return {questionVersion:api.VERSIONS.question,reportVersion:api.VERSIONS.report,
    answers:[...answers,...api.selectAdaptive(answers).selectedIds.map(id=>"ABCD".indexOf(profile.followups[id]))]};
}
async function createRuntime() {
  assert.equal(config.productionCredentials,false);assert.equal(config.network,"deny-external-loopback-only");
  const pg=new PGlite(),sessions=new Map(),intents=new Map(),journal=new Map(),outbox=[];
  let sequence=0,journalOffline=false,mailFailure=false,priceAmount=7900;
  const price="price_PersonaIsolated",webhookSecret="whsec_persona_synthetic_fixture";
  Object.assign(process.env,{ACCOUNT_PORTAL_ENABLED:"true",DIRECT_CUSTOMER_TESTS_ENABLED:"true",DIRECT_CUSTOMER_TESTS_WEBHOOK_ENABLED:"true",
    ACCOUNT_STORAGE_MODE:"active",TEST_ACCOUNTS_STORAGE_MODE:"active",TEST_ACCOUNTS_SITE_ORIGIN:origin,
    TEST_ACCOUNTS_PERSONA_ENABLED:"true",TEST_ACCOUNTS_PERSONA_CHECKOUT_ENABLED:"true",TEST_ACCOUNTS_PERSONA_SAVE_ENABLED:"true",TEST_ACCOUNTS_PERSONA_READ_ENABLED:"true",
    TEST_ACCOUNTS_PERSONA_PRICE_ID:price,STRIPE_PAYMENT_PRODUCT_MAP_JSON:JSON.stringify({persona_test:{priceIds:[price],paymentLinkIds:[]}}),
    TEST_ACCOUNTS_ENCRYPTION_KEY:randomBytes(32).toString("base64url"),STRIPE_SECRET_KEY:"synthetic-not-a-key",STRIPE_WEBHOOK_SECRET:webhookSecret,
    SUPABASE_URL:"https://persona-fixture.supabase.co",SUPABASE_ANON_KEY:"synthetic-public-key",TEST_GUEST_RECOVERY_ENABLED:"true",
    RESEND_API_KEY:"synthetic-not-a-mail-key",AUDHD_RECOVERY_EMAIL_FROM:"support@example.invalid"});
  delete process.env.ACCOUNT_PILOT_USERS_JSON;
  await pg.exec("create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key);");
  await pg.query("insert into auth.users values($1),($2)",[owner,other]);
  for(const migration of ["202610260001_test_accounts.sql","202610310001_test_guest_recovery.sql"])
    await pg.exec(fs.readFileSync(path.join(root,"supabase/migrations",migration),"utf8"));
  await pg.exec("update test_account_cleanup_state set last_success_at=now(),last_monitor_at=now()");
  function sql(connection) {
    const tagged=async(strings,...values)=>{
      const query=strings.reduce((out,part,index)=>out+(index?"$"+index:"")+part,"");
      // WASM PostgreSQL cannot exercise advisory process locks; production SQL is unchanged.
      if(query.trim()==="select pg_advisory_xact_lock(20261026)")return [];
      return (await connection.query(query,values)).rows;
    };
    tagged.begin=fn=>pg.transaction(tx=>fn(sql(tx)));return tagged;
  }
  global.testAccountsSql=sql(pg);
  const webhookSdk=new RealStripe("sk_test_synthetic_local_only");
  class Stripe {
    webhooks=webhookSdk.webhooks;
    prices={retrieve:async id=>({id,active:true,livemode:true,type:"one_time",unit_amount:priceAmount,currency:"sek"})};
    checkout={sessions:{
      create:async(input,options)=>{
        assert.equal(input.mode,"payment");assert.equal(input.allow_promotion_codes,false);
        assert.equal(input.line_items.length,1);assert.equal(input.line_items[0].price,price);assert.equal(input.line_items[0].quantity,1);
        assert.equal(input.metadata.rv_flow,"direct_customer_v1");assert.equal(options.idempotencyKey,"test-account:"+input.client_reference_id.slice(3));
        assert.equal(input.cancel_url,origin+"/persona/test");assert.equal(new URL(input.success_url).search,"");
        const id="cs_synthetic_persona_"+(++sequence),intent="pi_synthetic_persona_"+sequence;
        const session={id,livemode:true,mode:"payment",status:"open",payment_status:"unpaid",amount_total:7900,currency:"sek",
          client_reference_id:input.client_reference_id,payment_intent:intent,metadata:input.metadata,customer_details:{email:"buyer@example.invalid"},url:"https://checkout.stripe.com/c/pay/"+id};
        sessions.set(id,session);
        intents.set(intent,{id:intent,livemode:true,status:"requires_payment_method",amount:7900,amount_received:0,currency:"sek",
          latest_charge:{id:"ch_synthetic_"+sequence,payment_intent:intent,livemode:true,paid:false,captured:false,amount:7900,currency:"sek",created:Math.floor(Date.now()/1000),refunded:false,amount_refunded:0,disputed:false}});
        return session;
      },
      retrieve:async id=>{assert(sessions.has(id));return sessions.get(id);},
      listLineItems:async()=>({has_more:false,data:[{quantity:1,price:{id:price},amount_total:7900}]}),
    }};
    paymentIntents={retrieve:async id=>{assert(intents.has(id));return intents.get(id);}};
    disputes={list:async()=>({data:[]})};
  }
  global.fetch=async(url,options={})=>{
    const parsed=new URL(String(url));
    if(parsed.origin==="https://persona-fixture.supabase.co"&&parsed.pathname==="/auth/v1/user") {
      const proof=new Headers(options.headers).get("authorization");
      const id=proof==="Bearer "+token?owner:proof==="Bearer "+otherToken?other:null;
      return id?Response.json({id,email:"buyer@example.invalid",email_confirmed_at:"2026-11-01T00:00:00Z",is_anonymous:false,role:"authenticated",aud:"authenticated"}):Response.json({message:"invalid"},{status:401});
    }
    if(parsed.href==="https://api.resend.com/emails") {
      if(mailFailure)return Response.json({error:"synthetic rejection"},{status:503});
      const message=JSON.parse(options.body);assert.deepEqual(message.to,["buyer@example.invalid"]);
      assert(!/PERSONA|P0[1-9]|answers|personlighet/.test(message.text));
      outbox.push(message);return Response.json({id:"mail_synthetic_"+outbox.length});
    }
    throw Error("Blocked unmocked network destination");
  };
  const load=createLoader({stripe:{default:Stripe},"../accountErasureJournal.server":{
    accountErasureIdentity:()=>"persona-isolated-journal",assertAccountStorageActive:()=>{if(process.env.ACCOUNT_STORAGE_MODE!=="active")throw Error("maintenance");},
    assertErasureJournalAvailable:async()=>{if(journalOffline)throw Error("journal unavailable");},
    readAnalysisErasure:async id=>{if(journalOffline)throw Error("journal unavailable");return journal.get(id)??null;},
    writeAnalysisErasure:async(id,reason)=>{if(journalOffline)throw Error("journal unavailable");journal.set(id,{reason});},
  }});
  const handler=load(path.join(root,"app/_lib/testAccounts/directHandler.server.ts")).directCustomerHandler({health:async()=>!journalOffline});
  const store=load(path.join(root,"app/_lib/testAccounts/store.server.ts"));
  const recovery=load(path.join(root,"app/_lib/testAccounts/guestRecovery.server.ts"));
  const request=(body,authorization=null,secret=null,site=origin)=>handler(new Request("https://persona-fixture.supabase.co/functions/v1/customer-tests",{
    method:"POST",headers:{origin:site,"content-type":"application/json",...(authorization?{authorization:"Bearer "+authorization}:{}),...(secret?{"x-test-possession":secret}:{})},body:JSON.stringify(body)}));
  async function checkout(index=0) {
    const response=await request({action:"checkout",product:"persona_test",payload:payloadFor(load,index),consent:"test-guest-processing-v1"});
    assert.equal(response.status,201);const receipt=await response.json(),row=await store.attempt(receipt.id);return {...receipt,row};
  }
  function pay(receipt) {
    const session=sessions.get(receipt.row.session_id),intent=intents.get(session.payment_intent);
    Object.assign(session,{status:"complete",payment_status:"paid"});Object.assign(intent,{status:"succeeded",amount_received:7900});Object.assign(intent.latest_charge,{paid:true,captured:true});
  }
  return {pg,load,request,checkout,pay,store,recovery,sessions,intents,outbox,journal,token,otherToken,owner,other,origin,price,
    setJournalOffline:value=>{journalOffline=value;},setMailFailure:value=>{mailFailure=value;},setPrice:value=>{priceAmount=value;},
    webhookSdk,webhookSecret,handler,close:async()=>{await pg.close();delete global.testAccountsSql;}};
}
module.exports={createRuntime,payloadFor,root};
