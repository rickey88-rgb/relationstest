/* eslint-disable @typescript-eslint/no-require-imports -- PGlite executes real migration/SQL using synthetic users only. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { randomBytes } = require("node:crypto");
const { PGlite } = require("@electric-sql/pglite");
const createLoader = require("../../autism-test/test/test-loader.cjs");
const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
const secret = randomBytes(32).toString("base64url"), journal = new Map();
const identity = A + ":" + "a".repeat(64);
let offline = false, revoked = false, paymentCalls = 0, pingFailure = false, wrongIdentity = false;
Object.assign(process.env, { DATABASE_URL: "postgres://synthetic-only", ACCOUNT_STORAGE_MODE: "active", TEST_ACCOUNTS_STORAGE_MODE: "active",
  TEST_ACCOUNTS_ADHD_SAVE_ENABLED: "true", TEST_ACCOUNTS_ADHD_READ_ENABLED: "true",
  TEST_ACCOUNTS_HEALTHCHECKS_URL: "https://hc-ping.com/11111111-1111-4111-8111-111111111111",
  TEST_ACCOUNTS_ENCRYPTION_KEY: randomBytes(32).toString("base64url") });
(async () => {
  const pg = new PGlite();
  try {
    await pg.exec("create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); alter default privileges in schema public grant all on tables to anon, authenticated;");
    await pg.query("insert into auth.users(id) values($1),($2)", [A, B]);
    await pg.exec(fs.readFileSync(path.join(__dirname, "../../../supabase/migrations/202610260001_test_accounts.sql"), "utf8"));
    function sql(connection) {
      const tagged = async (strings, ...values) => {
        const query = strings.reduce((text, part, i) => text + (i ? `$${i}` : "") + part, "");
        // WASM PostgreSQL has no advisory-lock backend. Production executes this standard PostgreSQL lock.
        if (query.trim() === "select pg_advisory_xact_lock(20261026)") return [];
        return (await connection.query(query, values)).rows;
      };
      tagged.begin = callback => pg.transaction(tx => callback(sql(tx)));
      return tagged;
    }
    global.testAccountsSql = sql(pg);
    const journalApi = {
      accountErasureIdentity: () => wrongIdentity ? "different-private-registry" : identity,
      assertAccountStorageActive: () => { if (process.env.ACCOUNT_STORAGE_MODE !== "active") throw new Error("maintenance"); },
      assertErasureJournalAvailable: async () => { if (offline) throw new Error("offline"); },
      readAnalysisErasure: async id => { if (offline) throw new Error("offline"); return journal.get(id) ?? null; },
      writeAnalysisErasure: async (id, reason) => { if (offline) throw new Error("offline"); journal.set(id, { reason }); },
    };
    const load = createLoader({ "../accountErasureJournal.server": journalApi, "./payment.server": {
      verifyPayment: async row => { paymentCalls++; if (revoked) throw new Error("Payment revoked");
        return { intentId: `pi_${row.id}`, purchasedAt: new Date() }; },
    } });
    const store = load(path.join(__dirname, "store.server.ts"));
    const service = load(path.join(__dirname, "service.server.ts"));
    const operations = load(path.join(__dirname, "operations.server.ts"));
    const model = load(path.join(__dirname, "adapter.ts")).adapter("adhd_test");
    const input = { answers: Array(30).fill(2), questionVersion: model.questionVersion, reportVersion: model.reportVersion };
    const newAttempt = async () => {
      const id = await store.createAttempt("adhd_test", input, secret, "price_synthetic");
      await store.bindCheckout(id, `cs_${id}`); return id;
    };
    for (const table of ["test_account_attempts", "test_account_purchases", "test_account_analyses", "test_account_erasure_receipts", "test_account_cleanup_state"]) {
      for (const role of ["anon", "authenticated"]) assert.equal((await pg.query("select has_table_privilege($1,$2,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') as allowed", [role, table])).rows[0].allowed, false);
      assert.equal((await pg.query("select relrowsecurity from pg_class where relname = $1", [table])).rows[0].relrowsecurity, true);
    }
    assert.equal(await operations.health(), false);
    const id = await newAttempt();
    assert.deepEqual((await service.guest(id, secret)).result, model.calculate(input.answers));
    await assert.rejects(service.guest(id, randomBytes(32).toString("base64url")));
    await assert.rejects(service.save(id, secret, A, "test-account-storage-v1"), /cleanup/);
    global.fetch = async (url, options) => { assert.equal(options.body, ""); assert.equal(options.redirect, "error"); if (pingFailure) throw new Error("monitor offline"); return { ok: true }; };
    await operations.cleanup(); assert.equal(await operations.health(), true);
    await assert.rejects(service.save(id, secret, A, ""), /consent/);
    await service.save(id, secret, A, "test-account-storage-v1");
    const original = (await pg.query("select * from test_account_analyses where purchase_id=$1", [id])).rows[0];
    await service.save(id, secret, A, "test-account-storage-v1");
    assert.equal((await store.owned(id, A)).expires_at.getTime(), original.expires_at.getTime(), "retry does not extend retention");
    await assert.rejects(service.save(id, secret, B, "test-account-storage-v1"), /already claimed/);
    paymentCalls = 0; await assert.rejects(service.open(id, B)); assert.equal(paymentCalls, 0, "owner checked before Stripe/decryption");
    // Even an accidental database owner reassignment must fail authenticated decryption.
    await pg.query("update test_account_purchases set owner_id=$1 where id=$2", [B, id]);
    await assert.rejects(service.open(id, B));
    await pg.query("update test_account_purchases set owner_id=$1 where id=$2", [A, id]);
    assert.equal(await store.owned(id, B), null); assert.equal((await store.list(B)).length, 0);
    await service.remove(id, B); assert(await store.owned(id, A));
    await assert.rejects(pg.query("update test_account_analyses set ciphertext='bad' where purchase_id=$1", [id]), /immutable/);
    await assert.rejects(pg.query("delete from test_account_analyses where purchase_id=$1", [id]), /receipt/);
    const backupDraft = (await pg.query("select * from test_account_attempts where id=$1", [id])).rows[0];
    await pg.query("delete from test_account_attempts where id=$1", [id]);
    assert.deepEqual(await service.open(id, A), model.calculate(input.answers), "saved account analysis survives deletion of original seven-day draft");
    wrongIdentity = true; await assert.rejects(service.open(id, A)); await assert.rejects(service.remove(id, A), /identity mismatch/); wrongIdentity = false;
    offline = true; await assert.rejects(service.open(id, A)); await assert.rejects(service.remove(id, A));
    assert(await store.owned(id, A), "journal outage never silently deletes SQL data"); offline = false;
    await service.remove(id, A);
    assert.equal(await store.owned(id, A), null); assert.equal((await store.list(A)).length, 1, "purchase history survives analysis deletion");
    async function restoreRow(table, row) {
      const names = Object.keys(row); await pg.query(`insert into ${table}(${names.join(",")}) values (${names.map((_, i) => `$${i + 1}`).join(",")})`, names.map(key => row[key]));
    }
    // Emulate restoring the database to the snapshot from BEFORE the user deleted their analysis.
    await pg.exec("delete from test_account_erasure_receipts");
    await restoreRow("test_account_analyses", original); await restoreRow("test_account_attempts", backupDraft);
    await assert.rejects(service.open(id, A), /unavailable/);
    await assert.rejects(service.guest(id, secret), /unavailable/);
    await assert.rejects(service.save(id, secret, A, "test-account-storage-v1"));
    process.env.ACCOUNT_STORAGE_MODE = process.env.TEST_ACCOUNTS_STORAGE_MODE = "maintenance";
    await assert.rejects(service.guest(id, secret), /maintenance/);
    await assert.rejects(newAttempt(), /maintenance/);
    const reconciled = await operations.reconcile(new Date(Date.now() - 86400000).toISOString());
    assert.equal(reconciled.complete, true); assert.equal(reconciled.removed, 1);
    assert.equal((await pg.query("select * from test_account_attempts where id=$1", [id])).rows.length, 0);
    await assert.rejects(operations.reconcile("2020-01-01"), /window/);
    process.env.ACCOUNT_STORAGE_MODE = process.env.TEST_ACCOUNTS_STORAGE_MODE = "active";
    const revokedId = await newAttempt(); await service.save(revokedId, secret, A, "test-account-storage-v1");
    revoked = true; await assert.rejects(service.open(revokedId, A), /revoked/); revoked = false;
    assert.equal(await store.owned(revokedId, A), null);
    const expiredId = await newAttempt(); await service.save(expiredId, secret, A, "test-account-storage-v1");
    await pg.exec("alter table test_account_analyses disable trigger test_account_analysis_guard");
    await pg.query("update test_account_analyses set saved_at=now()-interval '300 days', expires_at=now()-interval '1 second' where purchase_id=$1", [expiredId]);
    await pg.exec("alter table test_account_analyses enable trigger test_account_analysis_guard");
    await assert.rejects(service.open(expiredId, A)); await operations.cleanup();
    assert.equal((await pg.query("select * from test_account_analyses where purchase_id=$1", [expiredId])).rows.length, 0);
    assert.equal((await store.list(A)).length, 3);
    pingFailure = true; await assert.rejects(operations.cleanup()); pingFailure = false;
    await pg.exec("update test_account_cleanup_state set last_monitor_at=now()-interval '27 hours'");
    assert.equal(await operations.health(), false);
    process.env.TEST_ACCOUNTS_ADHD_SAVE_ENABLED = "false";
    await assert.rejects(service.save(await newAttempt(), secret, A, "test-account-storage-v1"), /disabled/);
    process.env.TEST_ACCOUNTS_ADHD_LEGACY_IMPORT_ENABLED = "true";
    assert.throws(() => service.prepareLegacyImport({ paid: true, email: "synthetic@example.invalid", sessionId: "cs_synthetic" }), /not available/);
    process.env.TEST_ACCOUNTS_ADHD_SAVE_ENABLED = "true";
    await operations.cleanup();
    const wipeId = await newAttempt(); await service.save(wipeId, secret, A, "test-account-storage-v1");
    await assert.rejects(pg.query("delete from auth.users where id=$1", [A]), /receipt/);
    await assert.rejects(operations.eraseOwner(A), /Maintenance/);
    process.env.ACCOUNT_STORAGE_MODE = process.env.TEST_ACCOUNTS_STORAGE_MODE = "maintenance";
    assert.equal((await operations.eraseOwner(A)).complete, true);
    await pg.query("delete from auth.users where id=$1", [A]);
    assert.equal((await pg.query("select * from test_account_purchases where owner_id=$1", [A])).rows.length, 0);
    console.log("PASS: real SQL/RLS/grants, consent, strict ownership, post-7-day opening, immutable retention, deletion/history, refund revocation, expired cleanup/monitor failure and old-backup resurrection prevention.");
  } finally { await pg.close(); delete global.testAccountsSql; }
})().catch(error => { console.error(error); process.exitCode = 1; });
