/* eslint-disable @typescript-eslint/no-require-imports -- synthetic SQL/API integration. */
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const { randomBytes, createHmac } = require("node:crypto");
const { PGlite } = require("@electric-sql/pglite");
const createLoader = require("../../autism-test/test/test-loader.cjs");
const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
const tokenA = "A".repeat(50), tokenB = "B".repeat(50), origin = "https://www.relationsvarning.se";
const objects = new Map(), sessions = new Map(), intents = new Map(), prices = new Map();
let sequence = 0, journalOffline = false, monitorCalls = 0, stripeCalls = 0;
const key = randomBytes(32).toString("base64url");
Object.assign(process.env, { ACCOUNT_PORTAL_ENABLED: "true", DIRECT_CUSTOMER_TESTS_ENABLED: "true",
  ACCOUNT_STORAGE_MODE: "active", TEST_ACCOUNTS_STORAGE_MODE: "active", TEST_ACCOUNTS_SITE_ORIGIN: origin,
  TEST_ACCOUNTS_ENCRYPTION_KEY: key, ACCOUNT_ERASURE_SIGNING_KEY: key,
  ACCOUNT_ERASURE_REGISTRY_ID: A, ACCOUNT_ERASURE_R2_ENDPOINT: "https://synthetic.r2.cloudflarestorage.com",
  ACCOUNT_ERASURE_R2_BUCKET: "synthetic-erasure", R2_BUCKET_NAME: "synthetic-books",
  ACCOUNT_ERASURE_R2_ACCESS_KEY_ID: "synthetic", ACCOUNT_ERASURE_R2_SECRET_ACCESS_KEY: "synthetic",
  SUPABASE_URL: "https://synthetic.supabase.co", SUPABASE_ANON_KEY: "synthetic-public-key",
  TEST_ACCOUNTS_HEALTHCHECKS_URL: "https://hc-ping.com/11111111-1111-4111-8111-111111111111",
  ACCOUNT_CLEANUP_HEALTHCHECKS_URL: "https://hc-ping.com/22222222-2222-4222-8222-222222222222",
  STRIPE_SECRET_KEY: "synthetic-not-a-key", CRON_SECRET: "synthetic-cron-secret-longer-than-32-characters",
});
delete process.env.ACCOUNT_PILOT_USERS_JSON;
const sentinel = { v: 1, kind: "account-erasure-registry", registryId: A };
objects.set("v1/registry.json", JSON.stringify({ body: sentinel, signature: createHmac("sha256", Buffer.from(key, "base64url")).update(JSON.stringify(sentinel)).digest("base64url") }));
class GetObjectCommand { constructor(input) { this.input = input; this.kind = "get"; } }
class PutObjectCommand { constructor(input) { this.input = input; this.kind = "put"; } }
class S3Client {
  async send(command) {
    if (journalOffline) throw Object.assign(new Error("synthetic unavailable"), { name: "AccessDenied" });
    const key = command.input.Key;
    if (command.kind === "put") {
      assert.equal(command.input.IfNoneMatch, "*");
      if (objects.has(key)) throw Object.assign(new Error("exists"), { name: "PreconditionFailed" });
      objects.set(key, command.input.Body);
    }
    const value = objects.get(key);
    if (!value) throw Object.assign(new Error("missing"), { name: "NoSuchKey" });
    return { ContentLength: Buffer.byteLength(value), Body: { transformToString: async () => value } };
  }
}
class Stripe {
  prices = { retrieve: async id => prices.get(id) };
  checkout = { sessions: {
    create: async input => {
      const id = "cs_live_synthetic" + ++sequence, intentId = "pi_synthetic" + sequence;
      const price = prices.get(input.line_items[0].price);
      assert.equal(input.mode, "payment"); assert.equal(input.allow_promotion_codes, false);
      assert.equal(input.metadata.rv_flow,"direct_customer_v1");
      assert.equal(input.payment_intent_data.metadata.rv_flow,"direct_customer_v1");
      assert.equal(new URL(input.success_url).search, ""); assert.match(new URL(input.success_url).hash, /^#attempt=/);
      const row = { id, livemode: true, mode: "payment", status: "open", payment_status: "unpaid",
        client_reference_id: input.client_reference_id, payment_intent: intentId, amount_total: price.unit_amount,
        currency: "sek", url: "https://checkout.stripe.com/c/pay/" + id, price: price.id };
      sessions.set(id, row);
      intents.set(intentId, { id: intentId, livemode: true, status: "succeeded", amount: price.unit_amount, amount_received: price.unit_amount, currency: "sek",
        latest_charge: { id: "ch_synthetic" + sequence, payment_intent: intentId, livemode: true, paid: true, captured: true, amount: price.unit_amount, currency: "sek", created: Math.floor(Date.now()/1000), refunded: false, amount_refunded: 0, disputed: false } });
      return row;
    },
    retrieve: async id => { stripeCalls++; return sessions.get(id); },
    listLineItems: async id => { const row = sessions.get(id); return { has_more: false, data: [{quantity: 1, price: {id: row.price}, amount_total: row.amount_total}] }; },
  } };
  paymentIntents = { retrieve: async id => intents.get(id) };
  disputes = { list: async () => ({data: []}) };
}
const load = createLoader({
  stripe: {default: Stripe}, "@aws-sdk/client-s3": {S3Client, GetObjectCommand, PutObjectCommand},
  "@supabase/supabase-js": { createClient: () => ({ auth: { getUser: async token => ({error: null, data: {user: token === tokenA || token === tokenB
    ? {id: token === tokenA ? A : B, email: "same@example.invalid", email_confirmed_at: "2026-10-30", is_anonymous: false} : null}}) } }) },
});
global.fetch = async (url, options) => {
  assert.match(String(url), /^https:\/\/hc-ping\.com\//); assert.equal(options.body, ""); monitorCalls++; return {ok: true};
};
(async () => {
  const pg = new PGlite();
  try {
    await pg.exec("create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key);");
    await pg.query("insert into auth.users values($1),($2)", [A,B]);
    await pg.exec(fs.readFileSync(path.join(__dirname,"../../../supabase/migrations/202610260001_test_accounts.sql"),"utf8"));
    function sql(connection) {
      const tag = async (strings,...values) => {
        const query = strings.reduce((text,part,i)=>text+(i ? "$"+i : "")+part,"");
        if (query.trim() === "select pg_advisory_xact_lock(20261026)") return [];
        return (await connection.query(query,values)).rows;
      };
      tag.begin = callback => pg.transaction(tx=>callback(sql(tx))); return tag;
    }
    global.testAccountsSql = sql(pg);
    const adapters = load(path.join(__dirname,"adapter.ts")).registeredAdapters();
    assert.equal(adapters.length,15);
    const catalog = {};
    for (const model of adapters) {
      process.env[model.flagPrefix+"_CHECKOUT_ENABLED"]="true";
      process.env[model.flagPrefix+"_SAVE_ENABLED"]="true"; process.env[model.flagPrefix+"_READ_ENABLED"]="true";
      const id="price_synthetic"+model.slug.replaceAll("-","");
      process.env[model.priceEnv]=id; catalog[model.product]={priceIds:[id],paymentLinkIds:[]};
      prices.set(id,{id,active:true,livemode:true,type:"one_time",unit_amount:model.amount,currency:"sek"});
    }
    process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON=JSON.stringify(catalog);
    const handler=load(path.join(__dirname,"directHandler.server.ts")).directCustomerHandler();
    const store=load(path.join(__dirname,"store.server.ts"));
    async function request(body, token, secret, extra={}) {
      return handler(new Request("https://synthetic.supabase.co/functions/v1/customer-tests",{
        method:"POST",headers:{"origin":origin,"content-type":"application/json",...(token ? {authorization:"Bearer "+token}:{}),...(secret ? {"x-test-possession":secret}:{}),...extra},body:JSON.stringify(body),
      }));
    }
    async function ok(body,token,secret) { const response=await request(body,token,secret); assert.equal(response.status,200,body.action); return response.json(); }
    assert.equal((await request({action:"list"})).status,401);
    assert.equal((await request({action:"legacy-import",paid:true,email:"same@example.invalid"})).status,404);
    assert.equal((await request({action:"capabilities"},null,null,{origin:"https://attacker.invalid"})).status,403);
    assert.equal((await ok({action:"capabilities"})).tests.length,15);
    const firstModel=adapters[0];
    assert.equal((await request({action:"checkout",product:firstModel.product,consent:"test-guest-processing-v1",
      payload:{answers:Array(54).fill(0),questionVersion:firstModel.questionVersion,reportVersion:firstModel.reportVersion}})).status,503,"do not charge new customers when account saving is operationally blocked");
    assert.equal(sequence,0);
    // No customer data exists. The maintenance-scope job establishes fresh cleanup health.
    process.env.ACCOUNT_PORTAL_ENABLED="false";
    assert.equal((await request({action:"capabilities"})).status,503);
    const cron = await handler(new Request("https://synthetic.supabase.co/functions/v1/customer-tests/cleanup",{method:"POST",headers:{authorization:"Bearer "+process.env.CRON_SECRET}}));
    assert.equal(cron.status,200); assert.equal(monitorCalls,1);
    process.env.ACCOUNT_PORTAL_ENABLED="true";
    const ids=[];
    for(const model of adapters) {
      let answers;
      for(let n=1;n<=100;n++) { try { const value=Array(n).fill(0); model.parse({answers:value,questionVersion:model.questionVersion,reportVersion:model.reportVersion}); answers=value; break; } catch {} }
      assert(answers);
      const payload={answers,questionVersion:model.questionVersion,reportVersion:model.reportVersion};
      const checkoutBody={action:"checkout",product:model.product,payload,consent:"test-guest-processing-v1"};
      assert.equal((await request({...checkoutBody,consent:""})).status,400);
      const checkout=await request(checkoutBody); assert.equal(checkout.status,201);
      const receipt=await checkout.json(), id=receipt.id, secret=receipt.secret; ids.push({id,product:model.product});
      const attempt=await store.attempt(id);
      assert(!attempt.ciphertext.includes(JSON.stringify(answers)),"stored answers are encrypted");
      assert((attempt.expires_at-new Date())/86400000<=7);
      assert.equal((await request({action:"guest",id,product:model.product},null,secret)).status,503,"unpaid must not open");
      const session=sessions.get(attempt.session_id); session.status="complete"; session.payment_status="paid";
      const guest=await ok({action:"guest",id,product:model.product},null,secret);
      assert.deepEqual(guest.result,model.calculate(answers));
      assert.equal(guest.answers.length,answers.length); assert(guest.answers.every(item=>item.question && typeof item.answer==="string"));
      if(model.product==="iq_test") assert(!JSON.stringify(guest.answers).includes('"correct"'));
      assert.equal((await request({action:"guest",id,product:model.product},null,randomBytes(32).toString("base64url"))).status,503);
      assert.equal((await request({action:"save",id,product:model.product,consent:"test-account-storage-v1"},null,secret)).status,401);
      await ok({action:"save",id,product:model.product,consent:"test-account-storage-v1"},tokenA,secret);
      const previousCalls=stripeCalls;
      assert.equal((await request({action:"open",id,product:model.product,userId:A},tokenB)).status,503);
      assert.equal(stripeCalls,previousCalls,"other owner denied before Stripe");
      assert.equal((await request({action:"save",id,product:model.product,consent:"test-account-storage-v1"},tokenB,secret)).status,503,"same email does not transfer ownership");
      const opened=await ok({action:"open",id,product:model.product},tokenA);
      assert.deepEqual(opened.result,guest.result); assert.deepEqual(opened.answers,guest.answers);
      // A new session for the same Auth account still sees the SQL-owned result after guest expiry.
      await pg.query("update test_account_attempts set created_at=now()-interval '8 days',expires_at=now()-interval '1 day' where id=$1",[id]);
      assert.equal((await request({action:"guest",id,product:model.product},null,secret)).status,503);
      assert.deepEqual((await ok({action:"open",id,product:model.product},tokenA)).result,guest.result);
    }
    assert.equal((await ok({action:"list"},tokenA)).purchases.length,15);
    assert.equal((await ok({action:"list"},tokenB)).purchases.length,0);
    const first=ids[0], snapshot=(await pg.query("select * from test_account_analyses where purchase_id=$1",[first.id])).rows[0];
    journalOffline=true;
    assert.equal((await request({action:"delete",...first},tokenA)).status,503);
    assert.equal((await pg.query("select 1 from test_account_analyses where purchase_id=$1",[first.id])).rows.length,1);
    journalOffline=false;
    await ok({action:"delete",...first},tokenA);
    assert.equal((await pg.query("select 1 from test_account_analyses where purchase_id=$1",[first.id])).rows.length,0);
    assert.equal((await pg.query("select 1 from test_account_purchases where id=$1",[first.id])).rows.length,1);
    // Restore older SQL state, including losing its SQL erasure receipt: external journal must still deny it.
    await pg.query("delete from test_account_erasure_receipts where generation_id=$1",[snapshot.generation_id]);
    const columns=Object.keys(snapshot); await pg.query("insert into test_account_analyses("+columns.join(",")+") values("+columns.map((_,i)=>"$"+(i+1)).join(",")+")",Object.values(snapshot));
    assert.equal((await request({action:"open",...first},tokenA)).status,503);
    const refunded=ids[1], owned=await store.owned(refunded.id,A);
    intents.get(sessions.get(owned.session_id).payment_intent).latest_charge.amount_refunded=1;
    assert.equal((await request({action:"open",...refunded},tokenA)).status,503);
    assert.equal((await pg.query("select 1 from test_account_analyses where purchase_id=$1",[refunded.id])).rows.length,0);
    for(const table of ["test_account_attempts","test_account_purchases","test_account_analyses","test_account_erasure_receipts","test_account_cleanup_state"]) {
      for(const role of ["anon","authenticated"]) assert.equal((await pg.query("select has_table_privilege($1,$2,'SELECT,INSERT,UPDATE,DELETE') as allowed",[role,table])).rows[0].allowed,false);
    }
    console.log("PASS: all 15 new paid-test flows: real SQL, encrypted full answers, simulated Stripe/Auth/R2, ownership, guest expiry, consent, refund, deletion and restored-backup denial. No real network/data/payments.");
  } finally { delete global.testAccountsSql; await pg.close(); }
})().catch(error=>{ console.error(error);process.exitCode=1; });
