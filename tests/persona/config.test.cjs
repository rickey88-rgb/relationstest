/* eslint-disable @typescript-eslint/no-require-imports -- prepare configuration without touching an external environment. */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {mergePersonaMap}=require("../../deploy/merge-persona-map.cjs");
test("PERSONA config merge preserves every existing product/history and refuses shared Prices or Payment Links",()=>{
  const before={adhd_test:{priceIds:["price_OldADHD","price_CurrentADHD"],paymentLinkIds:["plink_Historical"]},audhd_test:{priceIds:["price_AuDHD"],paymentLinkIds:[]}};
  const snapshot=structuredClone(before),after=mergePersonaMap(before,"price_Persona");
  assert.deepEqual(before,snapshot);for(const key of Object.keys(before))assert.deepEqual(after[key],before[key]);
  assert.deepEqual(after.persona_test,{priceIds:["price_Persona"],paymentLinkIds:[]});assert.deepEqual(mergePersonaMap(after,"price_Persona"),after);
  assert.throws(()=>mergePersonaMap(before,"price_OldADHD"));assert.throws(()=>mergePersonaMap(before,"plink_Forbidden"));
  assert.throws(()=>mergePersonaMap({persona_test:{priceIds:[],paymentLinkIds:["plink_Forbidden"]}},"price_Persona"));
});
test("offline configuration is not application runtime configuration and production verification stays live-only",()=>{
  const config=require("./isolated.config.json");assert.equal(config.network,"deny-external-loopback-only");assert.equal(config.productionCredentials,false);
  const root=path.resolve(__dirname,"../..");
  const payment=fs.readFileSync(path.join(root,"app/_lib/testAccounts/payment.server.ts"),"utf8");
  assert(payment.includes("return { price, live: true }"));assert(payment.includes("!session.livemode"));assert(payment.includes("charge.amount_refunded > 0"));
  const migration=fs.readFileSync(path.join(root,"supabase/migrations/202610260001_test_accounts.sql"),"utf8");assert(migration.includes("check (live_mode)"));
  const runner=fs.readFileSync(path.join(root,"scripts/test-persona-release.cjs"),"utf8");assert(!runner.includes("...process.env"));assert(!runner.includes("dotenv"+".config"));
  const sitemap=require("../../next-sitemap.config.js");assert(sitemap.exclude.includes("/persona/test"));
});
