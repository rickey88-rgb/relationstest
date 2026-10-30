/* eslint-disable @typescript-eslint/no-require-imports -- synthetic in-memory maintenance integration. */
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const { randomUUID } = require("node:crypto");
const { PGlite } = require("@electric-sql/pglite");
const { NextRequest, NextResponse } = require("next/server");
const createLoader = require("../autism-test/test/test-loader.cjs");
const owner = "11111111-1111-4111-8111-111111111111", identity = owner + ":" + "a".repeat(64);
const secret = "synthetic-maintenance-cron-only", journalEntries = new Map(), pings = [];
let journalAvailable = true, journalWriteFails = false, monitorFails = false;
Object.assign(process.env, { ACCOUNT_PORTAL_ENABLED: "false", ACCOUNT_STORAGE_MODE: "maintenance",
  TEST_ACCOUNTS_STORAGE_MODE: "maintenance", CRON_SECRET: secret, DATABASE_URL: "postgres://synthetic-only",
  ACCOUNT_CLEANUP_HEALTHCHECKS_URL: "https://hc-ping.com/11111111-1111-4111-8111-111111111111",
  TEST_ACCOUNTS_HEALTHCHECKS_URL: "https://hc-ping.com/22222222-2222-4222-8222-222222222222" });
delete process.env.TEST_ACCOUNTS_ENCRYPTION_KEY;
delete process.env.AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY;
const actualStorageAssert = createLoader()(path.join(__dirname, "accountErasureJournal.server.ts")).assertAccountStorageActive;
const journal = {
  accountStorageMode: () => process.env.ACCOUNT_STORAGE_MODE,
  accountErasureIdentity: () => identity, assertAccountStorageActive: actualStorageAssert,
  assertErasureJournalAvailable: async () => { if (!journalAvailable) throw Error("synthetic-offline"); },
  writeAnalysisErasure: async (generation, reason) => { if (journalWriteFails) throw Error("synthetic-write-failure"); journalEntries.set(generation, { reason }); },
  readAnalysisErasure: async generation => journalEntries.get(generation) ?? null,
};
const overrides = {};
for (const prefix of ["./", "../", "../../../_lib/", "../../../../_lib/"]) overrides[prefix + "accountErasureJournal.server"] = journal;
const load = createLoader(overrides);
const req = (pathname, token = secret) => new NextRequest("https://www.relationsvarning.se" + pathname, { headers: { authorization: "Bearer " + token } });
const originalFetch = global.fetch;
global.fetch = async (url, options) => {
  assert(/^https:\/\/hc-ping\.com\/(11111111-1111-4111-8111-111111111111|22222222-2222-4222-8222-222222222222)(\/fail)?$/.test(String(url)));
  assert.equal(options.method, "POST"); assert.equal(options.body, "");
  pings.push(String(url)); return { ok: !monitorFails };
};
(async () => {
  const pg = new PGlite();
  try {
    await pg.exec("create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key)");
    await pg.query("insert into auth.users(id) values($1)", [owner]);
    for (const file of ["202610250001_account_audhd_purchases.sql", "202610260001_test_accounts.sql"])
      await pg.exec(fs.readFileSync(path.join(__dirname, "../../supabase/migrations", file), "utf8"));
    const adapter = connection => {
      const tagged = async (strings, ...values) => {
        const query = strings.reduce((text, part, i) => text + (i ? "$" + i : "") + part, "");
        if (/^delete from public\.(account_audhd_analyses|test_account_analyses)\b/.test(query.trim()))
          assert(journalEntries.has(values.at(-1)), "External erasure journal must precede SQL deletion");
        return (await connection.query(query, values)).rows;
      };
      tagged.begin = callback => pg.transaction(transaction => callback(adapter(transaction)));
      return tagged;
    };
    global.accountPurchasesSql = adapter(pg); global.testAccountsSql = adapter(pg);
    const db = load(path.join(__dirname, "accountPurchasesDb.server.ts"));
    const store = load(path.join(__dirname, "testAccounts/store.server.ts"));
    const context = load(path.join(__dirname, "accountCleanupContext.server.ts"));
    const audhd = load(path.join(__dirname, "../api/cron/account-analysis-cleanup/route.ts"));
    const audhdHealth = load(path.join(__dirname, "../api/cron/account-analysis-cleanup/health/route.ts"));
    const general = load(path.join(__dirname, "../api/cron/test-account-cleanup/route.ts"));
    const count = async table => Number((await pg.query("select count(*)::int as n from public." + table)).rows[0].n);
    async function seed(engine, expired) {
      const id = randomUUID(), generation = randomUUID(), suffix = id.replaceAll("-", "");
      const saved = new Date(Date.now() - (expired ? 2 : 0) * 86400000), expires = new Date(Date.now() + (expired ? -1 : 1) * 86400000);
      if (engine === "audhd") {
        await pg.query("insert into public.account_purchases(id,user_id,product_key,stripe_checkout_session_id,stripe_payment_intent_id,stripe_price_id,purchased_at,amount_total_ore,currency,proof_kind) values($1,$2,'audhd_test',$3,$4,'price_synthetic',now(),7900,'sek','checkout')",
          [id, owner, "cs_live_" + suffix, "pi_" + suffix]);
        await pg.query("insert into public.account_audhd_analyses(purchase_id,generation_id,journal_identity,report_version,answers_ciphertext,encryption_iv,encryption_auth_tag,consent_version,saved_at,expires_at) values($1,$2,$3,'audhd-v1','synthetic-ciphertext','synthetic-iv','synthetic-tag','account-analysis-v1',$4,$5)",
          [id, generation, identity, saved, expires]);
      } else {
        await pg.query("insert into public.test_account_purchases(id,owner_id,product,session_id,price_id,payment_intent_id,purchased_at,amount,currency) values($1,$2,'adhd_test',$3,'price_synthetic',$4,now(),3900,'sek')",
          [id, owner, "cs_synthetic" + suffix, "pi_synthetic" + suffix]);
        await pg.query("insert into public.test_account_analyses(purchase_id,generation_id,journal_identity,product,question_version,report_version,ciphertext,consent_version,saved_at,expires_at) values($1,$2,$3,'adhd_test','adhd-questions-v1','adhd-report-v1','synthetic-ciphertext','test-account-storage-v1',$4,$5)",
          [id, generation, identity, saved, expires]);
        await pg.query("insert into public.test_account_attempts(id,analysis_id,product,question_version,report_version,browser_hash,journal_identity,ciphertext,price_id,live_mode,created_at,expires_at) values($1,$2,'adhd_test','adhd-questions-v1','adhd-report-v1',$3,$4,'synthetic-ciphertext','price_synthetic',true,$5,$6)",
          [id, generation, "a".repeat(64), identity, saved, expires]);
      }
      return { id, generation };
    }
    const dueAudhd = await seed("audhd", true); await seed("audhd", false);
    const dueGeneral = await seed("tests", true); await seed("tests", false);
    await assert.rejects(db.accountStorageReady(), /Account portal unavailable/);
    assert.throws(() => store.db(), /Account portal unavailable/, "Maintenance setting alone grants no DB authority");
    for (const [route, url] of [[audhd, "/api/cron/account-analysis-cleanup"], [general, "/api/cron/test-account-cleanup"]])
      assert.equal((await route.GET(req(url, "wrong"))).status, 503);
    assert.equal(journalEntries.size, 0); assert.equal(pings.length, 0);
    assert.equal((await audhd.GET(req("/api/cron/account-analysis-cleanup"))).status, 200);
    assert.equal((await audhdHealth.GET(req("/api/cron/account-analysis-cleanup/health"))).status, 200);
    assert.equal((await general.GET(req("/api/cron/test-account-cleanup"))).status, 200);
    assert.equal((await general.GET(req("/api/cron/test-account-cleanup?health=true"))).status, 200);
    assert.equal(journalEntries.get(dueAudhd.generation).reason, "expired");
    assert.equal(journalEntries.get(dueGeneral.generation).reason, "expired");
    for (const table of ["account_audhd_analyses", "test_account_analyses", "test_account_attempts"]) assert.equal(await count(table), 1);
    for (const table of ["account_purchases", "test_account_purchases"]) assert.equal(await count(table), 2, "Purchase history survives");
    assert.equal((await pg.query("select last_success_at is not null and last_monitor_success_at is not null as ok from public.account_analysis_cleanup_state")).rows[0].ok, true);
    assert.equal((await pg.query("select last_success_at is not null and last_monitor_at is not null as ok from public.test_account_cleanup_state")).rows[0].ok, true);
    const cannotSave = context.accountCleanupHandler("tests", async () => {
      await assert.rejects(store.createAttempt("adhd_test", {}, "synthetic", "price_synthetic"), /Account portal unavailable/);
      await assert.rejects(db.saveAccountAudhdPurchase(owner, {}), /Account portal unavailable/);
      return NextResponse.json({ ok: true });
    });
    assert.equal((await cannotSave(req("/api/cron/test-account-cleanup"))).status, 200);
    const pingCount = pings.length;
    assert.equal((await audhd.GET(req("/api/cron/account-analysis-cleanup"))).status, 200);
    assert.equal((await general.GET(req("/api/cron/test-account-cleanup"))).status, 200);
    assert.equal(journalEntries.size, 2); assert.equal(pings.length, pingCount + 2, "Empty runs are real monitored successes");
    const failing = await seed("tests", true);
    const before = (await pg.query("select last_success_at from public.test_account_cleanup_state")).rows[0].last_success_at;
    journalWriteFails = true;
    assert.equal((await general.GET(req("/api/cron/test-account-cleanup"))).status, 503);
    assert.equal(await count("test_account_analyses"), 2); assert(!journalEntries.has(failing.generation));
    assert(pings.at(-1).endsWith("/fail"));
    assert.equal(String((await pg.query("select last_success_at from public.test_account_cleanup_state")).rows[0].last_success_at), String(before));
    journalWriteFails = false; journalAvailable = false;
    const beforeJournalFailure = pings.length;
    assert.equal((await general.GET(req("/api/cron/test-account-cleanup"))).status, 503);
    assert.equal(pings.length, beforeJournalFailure, "Preflight journal failure never sends a false success; missed-run alert remains necessary");
    journalAvailable = true; monitorFails = true;
    const monitorBefore = (await pg.query("select last_monitor_at from public.test_account_cleanup_state")).rows[0].last_monitor_at;
    assert.equal((await general.GET(req("/api/cron/test-account-cleanup"))).status, 503);
    assert.equal(String((await pg.query("select last_monitor_at from public.test_account_cleanup_state")).rows[0].last_monitor_at), String(monitorBefore));
    assert(!context.hasCleanupContext("tests"));
    await assert.rejects(db.accountStorageReady(), /Account portal unavailable/);
    console.log("PASS: actual maintenance cron/SQL for both engines; expired ciphertext erased after journal; fresh analyses/history retained; no saves/checkout; zero-row runs, monitor/journal failures and scoped DB denial verified.");
  } finally { delete global.accountPurchasesSql; delete global.testAccountsSql; global.fetch = originalFetch; await pg.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
