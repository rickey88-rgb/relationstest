/* eslint-disable @typescript-eslint/no-require-imports -- real generic PostgreSQL + real verifier, with synthetic Stripe and external journal only. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { randomBytes } = require("node:crypto");
const { PGlite } = require("@electric-sql/pglite");
const createLoader = require("../../autism-test/test/test-loader.cjs");
const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
const journal = new Map(), payments = new Map();
let overrideSession, overrideItems, overrideIntent, offline = false, stripeCalls = 0, historicalDispute = false;
const prices = { iq_test: "price_IqSynthetic", hsp_test: "price_HspSynthetic", angest_test: "price_AngestSynthetic", ptsd_test: "price_PtsdSynthetic", adhd_test: "price_AdhdSynthetic", narcissism_selftest: "price_NarcissismSynthetic", screening_test: "price_ScreeningSynthetic", autism_test: "price_AutismSynthetic", attachment_test: "price_AttachmentSynthetic", codependency_test: "price_CodependencySynthetic", gaslighting_test: "price_GaslightingSynthetic", narcissist_partner: "price_PartnerSynthetic", trauma_bond_test: "price_TraumaBondSynthetic", psychological_abuse_test: "price_PsychologicalAbuseSynthetic" };
class Stripe {
  checkout = { sessions: {
    retrieve: async id => { stripeCalls++; return overrideSession ?? payments.get(id).session; },
    listLineItems: async id => overrideItems ?? payments.get(id).items,
  } };
  paymentIntents = { retrieve: async id => overrideIntent ?? [...payments.values()].find(value => value.intent.id === id).intent };
  disputes = { list: async () => ({ data: historicalDispute ? [{ status: "won" }] : [] }) };
}
Object.assign(process.env, { DATABASE_URL: "postgres://synthetic-only", STRIPE_SECRET_KEY: "synthetic-only", ACCOUNT_STORAGE_MODE: "active", TEST_ACCOUNTS_STORAGE_MODE: "active", TEST_ACCOUNTS_ENCRYPTION_KEY: randomBytes(32).toString("base64url"), TEST_ACCOUNTS_HEALTHCHECKS_URL: "https://hc-ping.com/11111111-1111-4111-8111-111111111111" });
async function run(slugs = ["hsp", "angest", "ptsd"], answerFactory = () => Array.from({ length: 30 }, (_, index) => index % 5), extraChecks = async () => {}) {
  const pg = new PGlite();
  try {
    await pg.exec("create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key);");
    await pg.query("insert into auth.users(id) values($1),($2)", [A, B]);
    await pg.exec(fs.readFileSync(path.join(__dirname, "../../../supabase/migrations/202610260001_test_accounts.sql"), "utf8"));
    function sql(connection) {
      const tagged = async (strings, ...values) => {
        const query = strings.reduce((out, part, index) => out + (index ? `$${index}` : "") + part, "");
        if (query.trim() === "select pg_advisory_xact_lock(20261026)") return []; // same documented WASM limitation as stage 1
        return (await connection.query(query, values)).rows;
      };
      tagged.begin = cb => pg.transaction(tx => cb(sql(tx))); return tagged;
    }
    global.testAccountsSql = sql(pg);
    const load = createLoader({ stripe: { default: Stripe }, "../paymentProductCatalog.server": { configuredPriceIdsForProduct: product => [prices[product]] },
      "../accountErasureJournal.server": {
        accountErasureIdentity: () => "synthetic-private-registry",
        assertAccountStorageActive: () => { if (process.env.ACCOUNT_STORAGE_MODE !== "active") throw new Error("maintenance"); },
        assertErasureJournalAvailable: async () => { if (offline) throw new Error("offline"); },
        readAnalysisErasure: async id => { if (offline) throw new Error("offline"); return journal.get(id) ?? null; },
        writeAnalysisErasure: async (id, reason) => { if (offline) throw new Error("offline"); journal.set(id, { reason }); },
      } });
    const registry = load(path.join(__dirname, "adapter.ts")), store = load(path.join(__dirname, "store.server.ts"));
    const service = load(path.join(__dirname, "service.server.ts")), ops = load(path.join(__dirname, "operations.server.ts"));
    const { verifyPayment } = load(path.join(__dirname, "payment.server.ts"));
    global.fetch = async () => ({ ok: true }); await ops.cleanup();
    for (const slug of slugs) {
      const model = registry.adapterForSlug(slug), secret = randomBytes(32).toString("base64url");
      process.env[`${model.flagPrefix}_SAVE_ENABLED`] = process.env[`${model.flagPrefix}_READ_ENABLED`] = "true";
      const input = { answers: answerFactory(model), questionVersion: model.questionVersion, reportVersion: model.reportVersion };
      async function make() {
        const id = await store.createAttempt(model.product, input, secret, prices[model.product]);
        const sid = `cs_${id}`, pi = `pi_${id}`;
        await store.bindCheckout(id, sid);
        const session = { id: sid, client_reference_id: `ta:${id}`, livemode: true, mode: "payment", status: "complete", payment_status: "paid", amount_total: model.amount, currency: "sek", payment_intent: pi };
        const items = { has_more: false, data: [{ quantity: 1, price: { id: prices[model.product] }, amount_total: model.amount }] };
        const intent = { id: pi, livemode: true, status: "succeeded", amount: model.amount, amount_received: model.amount, currency: "sek", latest_charge: { payment_intent: pi, livemode: true, paid: true, captured: true, amount: model.amount, currency: "sek", amount_refunded: 0, refunded: false, disputed: false, created: Math.floor(Date.now() / 1000) } };
        payments.set(sid, { session, items, intent }); return id;
      }
      const id = await make(), row = await store.attempt(id);
      await extraChecks({ stage: "prepared", model, id, row, secret, store, service, A, B, paymentCalls: () => stripeCalls });
      const payment = payments.get(row.session_id);
      await verifyPayment(row);
      for (const changes of [{ payment_status: "unpaid" }, { client_reference_id: "ta:another" }, { amount_total: 1 }, { livemode: false }]) { overrideSession = { ...payment.session, ...changes }; await assert.rejects(verifyPayment(row)); } overrideSession = null;
      overrideItems = { ...payment.items, data: [{ ...payment.items.data[0], price: { id: prices.adhd_test } }] }; await assert.rejects(verifyPayment(row)); overrideItems = null;
      overrideIntent = { ...payment.intent, latest_charge: { ...payment.intent.latest_charge, amount_refunded: 1 } }; await assert.rejects(verifyPayment(row), /revoked/); overrideIntent = null;
      historicalDispute = true; await assert.rejects(verifyPayment(row), /revoked/); historicalDispute = false;
      assert.deepEqual((await service.guestForProduct(id, secret, model.product)).result, model.calculate(input.answers));
      await assert.rejects(service.guestForProduct(id, randomBytes(32).toString("base64url"), model.product));
      await assert.rejects(service.guestForProduct(id, secret, "adhd_test"));
      await assert.rejects(service.save(id, secret, A, "test-account-storage-v1", "adhd_test"));
      await assert.rejects(service.save(id, secret, A, "", model.product));
      await service.save(id, secret, A, "test-account-storage-v1", model.product);
      await extraChecks({ stage: "saved", model, id, row, secret, store, service, A, B, paymentCalls: () => stripeCalls });
      await assert.rejects(service.save(id, secret, B, "test-account-storage-v1", model.product), /claimed/);
      stripeCalls = 0; await assert.rejects(service.openForProduct(id, B, model.product)); assert.equal(stripeCalls, 0);
      await assert.rejects(service.openForProduct(id, A, "adhd_test")); assert.equal(stripeCalls, 0, "product checked before Stripe/decryption");
      await assert.rejects(service.open(id, A), /unavailable/, "old ADHD route cannot render another test");
      const backup = (await pg.query("select * from test_account_analyses where purchase_id=$1", [id])).rows[0];
      const draftBackup = (await pg.query("select * from test_account_attempts where id=$1", [id])).rows[0];
      assert(!backup.ciphertext.includes('"answers"'));
      await pg.query("delete from test_account_attempts where id=$1", [id]);
      assert.deepEqual(await service.openForProduct(id, A, model.product), model.calculate(input.answers), "independent account copy survives guest purge");
      offline = true; await assert.rejects(service.openForProduct(id, A, model.product)); await assert.rejects(service.remove(id, A)); offline = false;
      await service.remove(id, B); assert(await store.owned(id, A));
      await service.remove(id, A); assert.equal(await store.owned(id, A), null);
      assert((await store.list(A)).some(p => p.id === id), "purchase history survives deletion");
      async function restore(table, value) { const keys = Object.keys(value); await pg.query(`insert into ${table}(${keys.join(",")}) values(${keys.map((_, index) => `$${index + 1}`).join(",")})`, keys.map(key => value[key])); }
      await pg.query("delete from test_account_erasure_receipts where generation_id=$1", [backup.generation_id]);
      await restore("test_account_analyses", backup); await restore("test_account_attempts", draftBackup);
      await assert.rejects(service.openForProduct(id, A, model.product)); await assert.rejects(service.guestForProduct(id, secret, model.product));
      process.env.ACCOUNT_STORAGE_MODE = process.env.TEST_ACCOUNTS_STORAGE_MODE = "maintenance";
      assert.equal((await ops.reconcile(new Date(Date.now() - 86400000).toISOString())).complete, true);
      process.env.ACCOUNT_STORAGE_MODE = process.env.TEST_ACCOUNTS_STORAGE_MODE = "active";
      assert.equal(await store.owned(id, A), null);
      const revokedId = await make(); await service.save(revokedId, secret, A, "test-account-storage-v1", model.product);
      payments.get((await store.attempt(revokedId)).session_id).intent.latest_charge.amount_refunded = 1;
      await assert.rejects(service.openForProduct(revokedId, A, model.product), /revoked/); assert.equal(await store.owned(revokedId, A), null);
      const expiredId = await make(); await service.save(expiredId, secret, A, "test-account-storage-v1", model.product);
      await pg.exec("alter table test_account_analyses disable trigger test_account_analysis_guard");
      await pg.query("update test_account_analyses set saved_at=now()-interval '300 days', expires_at=now()-interval '1 second' where purchase_id=$1", [expiredId]);
      await pg.exec("alter table test_account_analyses enable trigger test_account_analysis_guard");
      await assert.rejects(service.openForProduct(expiredId, A, model.product)); await ops.cleanup();
      assert.equal((await pg.query("select * from test_account_analyses where purchase_id=$1", [expiredId])).rows.length, 0);
      console.log(`PASS: ${slug}: bound Stripe payment, wrong product/owner, guest/account reopening, consent, refunds, expiry, erasure/history and old-backup protection using the same engine/migration.`);
    }
  } finally { await pg.close(); delete global.testAccountsSql; }
}
module.exports = run;
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
