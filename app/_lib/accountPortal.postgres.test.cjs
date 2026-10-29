/* eslint-disable @typescript-eslint/no-require-imports -- local PostgreSQL regression harness. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { randomBytes } = require("node:crypto");
const { PGlite } = require("@electric-sql/pglite");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.DATABASE_URL = "postgres://local-test-only";
process.env.AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY = randomBytes(32).toString("base64url");
process.env.ACCOUNT_STORAGE_MODE = "active";
process.env.ACCOUNT_CLEANUP_HEALTHCHECKS_URL = "https://hc-ping.com/11111111-1111-4111-8111-111111111111";
const userA = "11111111-1111-4111-8111-111111111111";
const userB = "22222222-2222-4222-8222-222222222222";

(async () => {
  const pg = new PGlite();
  try {
    await pg.exec("create role anon; create role authenticated; create schema auth; create table auth.users (id uuid primary key);");
    await pg.query("insert into auth.users(id) values ($1), ($2)", [userA, userB]);
    await pg.exec("alter default privileges in schema public grant all on tables to anon, authenticated");
    function adapter(connection) {
      const tagged = async (strings, ...values) => {
        const text = strings.reduce((out, part, index) => out + (index ? `$${index}` : "") + part, "");
        return (await connection.query(text, values)).rows;
      };
      tagged.begin = callback => pg.transaction(tx => callback(adapter(tx)));
      return tagged;
    }
    delete global.accountPurchasesSql;
    const externalJournal = new Map();
    let journalFailure = false, wrongJournal = false;
    const journalIdentity = userA + ":" + "a".repeat(64);
    const journal = {
      accountErasureIdentity: () => wrongJournal ? userB + ":" + "b".repeat(64) : journalIdentity,
      accountStorageMode: () => process.env.ACCOUNT_STORAGE_MODE,
      assertAccountStorageActive: () => { if (process.env.ACCOUNT_STORAGE_MODE !== "active") throw new Error("maintenance"); },
      assertErasureJournalAvailable: async () => { if (journalFailure) throw new Error("offline"); },
      readAnalysisErasure: async id => { if (journalFailure) throw new Error("offline"); return externalJournal.get(id) ?? null; },
      writeAnalysisErasure: async (id, reason) => { if (journalFailure) throw new Error("offline"); externalJournal.set(id, { reason }); },
    };
    const load = createLoader({ "./accountErasureJournal.server": journal, postgres: { default: (_url, options) => {
      assert.equal(options.ssl.rejectUnauthorized, true, "account DB requires a trusted certificate chain");
      assert.equal(options.ssl.checkServerIdentity, require("node:tls").checkServerIdentity, "hostname verification remains enabled");
      assert(options.ssl.ca.includes("BEGIN CERTIFICATE"), "official public CA is bundled");
      return adapter(pg);
    } } });
    const db = load(path.join(__dirname, "accountPurchasesDb.server.ts"));
    assert.equal(await db.accountStorageReady(), false);
    await pg.exec(fs.readFileSync(path.join(__dirname, "../../supabase/migrations/202610250001_account_audhd_purchases.sql"), "utf8"));
    assert.equal(await db.accountStorageReady(), true);
    assert.equal((await db.accountCleanupHealth()).healthy, false, "never-run cleanup must alert");
    for (const table of ["account_purchases", "account_audhd_analyses", "account_analysis_cleanup_state", "account_analysis_erasure_receipts"]) {
      for (const role of ["anon", "authenticated"]) {
        const access = await pg.query("select has_table_privilege($1, $2, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') as allowed", [role, table]);
        assert.equal(access.rows[0].allowed, false, "explicit revokes override production-style default grants");
      }
    }
    const crypto = load(path.join(__dirname, "audhdCheckoutAttempt.server.ts"));
    const answers = { reportVersion: "audhd-v1", answers: Array(48).fill(2), contextAnswers: Array(6).fill(3) };
    const encrypted = crypto.encryptAudhdCheckoutAnswers(answers);
    const proof = suffix => ({ kind: "verified", source: "checkout", encrypted, fingerprint: "test", payment: {
      checkoutSessionId: `cs_live_account${suffix}`, paymentIntentId: `pi_account${suffix}`, priceId: "price_account",
      purchasedAt: new Date("2026-10-01T12:00:00Z"), amountTotalOre: 7900, currency: "sek",
    } });
    assert.deepEqual(await db.listAccountPurchases(userA), [], "new account has a real empty result");
    const saved = await db.saveAccountAudhdPurchase(userA, proof("One"));
    assert.equal(saved.kind, "saved");
    const first = await db.loadOwnedAccountAnalysis(userA, saved.purchaseId);
    assert.deepEqual(crypto.decryptAudhdCheckoutAnswers(first), answers);
    wrongJournal = true;
    await assert.rejects(db.loadOwnedAccountAnalysis(userA, saved.purchaseId), /identity mismatch/);
    await assert.rejects(db.removeOwnedAccountAnalysis(userA, saved.purchaseId), /identity mismatch/);
    wrongJournal = false;
    const monitorUrl = process.env.ACCOUNT_CLEANUP_HEALTHCHECKS_URL;
    delete process.env.ACCOUNT_CLEANUP_HEALTHCHECKS_URL;
    await assert.rejects(db.saveAccountAudhdPurchase(userA, proof("NoMonitor")), /monitoring unavailable/);
    process.env.ACCOUNT_CLEANUP_HEALTHCHECKS_URL = monitorUrl;
    await db.saveAccountAudhdPurchase(userA, proof("One"));
    assert.equal((await db.loadOwnedAccountAnalysis(userA, saved.purchaseId)).expiresAt.getTime(), first.expiresAt.getTime(), "retry does not extend retention");
    assert.equal((await db.saveAccountAudhdPurchase(userB, proof("One"))).kind, "denied", "a verified bearer cannot move an owned purchase to another account");
    assert.deepEqual(await db.listAccountPurchases(userB), []);
    assert.equal(await db.loadOwnedAccountAnalysis(userB, saved.purchaseId), null);
    assert.equal(await db.hasOwnedAccountPurchase(userB, saved.purchaseId), false);
    assert.equal(await db.removeOwnedAccountAnalysis(userB, saved.purchaseId), false);
    const summary = (await db.listAccountPurchases(userA))[0];
    assert.equal(summary.status, "available");
    assert(!JSON.stringify(summary).includes(encrypted.ciphertext));
    assert(!JSON.stringify(summary).includes("cs_live_"));
    await pg.exec("set role authenticated");
    await assert.rejects(pg.query("select * from public.account_audhd_analyses"), /permission denied/);
    await assert.rejects(pg.query("select * from public.account_purchases"), /permission denied/);
    await assert.rejects(pg.query("select * from public.account_analysis_cleanup_state"), /permission denied/);
    await pg.exec("reset role");

    // There are intentionally NO guest-attempt/recovery tables in this DB.
    // Backdate the independent account copy past seven days; it still opens.
    await pg.query("update account_audhd_analyses set saved_at = now() - interval '8 days', expires_at = now() + interval '300 days' where purchase_id = $1", [saved.purchaseId]);
    let paymentState = { kind: "verified", payment: proof("One").payment }, paymentCalls = 0;
    const open = createLoader({ "./accountPurchasesDb.server": db, "./accountAudhdPayment.server": {
      verifyAccountAudhdPayment: async () => { paymentCalls += 1; return paymentState; },
    } })(path.join(__dirname, "accountAnalysis.server.ts")).openOwnedAccountAnalysis;
    assert.equal((await open(userA, saved.purchaseId)).kind, "available", "account copy opens after original seven-day retention");
    await pg.exec(fs.readFileSync(path.join(__dirname, "../../supabase/migrations/202610120001_audhd_recovery_grants.sql"), "utf8"));
    const grantId = "33333333-3333-4333-8333-333333333333";
    await pg.query("insert into audhd_recovery_grants(id,token_hash,stripe_checkout_session_id,stripe_payment_intent_id,stripe_price_id,product_key,created_at,expires_at,redeemed_at) values($1,$2,'cs_live_history','pi_history','price_account','audhd_test',now()-interval '10 days',now()-interval '7 days',now()-interval '5 minutes')", [grantId, "a".repeat(64)]);
    assert.equal((await db.loadAccountRecoveryPurchase(grantId)).checkoutSessionId, "cs_live_history");
    const historyOnly = await db.saveAccountAudhdPurchase(userB, { ...proof("History"), encrypted: null, source: "recovery" });
    assert.equal(historyOnly.kind, "saved");
    assert.equal(await db.loadOwnedAccountAnalysis(userB, historyOnly.purchaseId), null);
    assert.equal((await db.listAccountPurchases(userB))[0].status, "missing");
    await pg.query("update audhd_recovery_grants set revoked_at = now() where id = $1", [grantId]);
    assert.equal(await db.loadAccountRecoveryPurchase(grantId), null);
    const callsBefore = paymentCalls;
    assert.equal((await open(userB, saved.purchaseId)).kind, "not_found");
    assert.equal(paymentCalls, callsBefore, "ownership is checked before Stripe/decryption");
    paymentState = { kind: "unavailable" };
    assert.equal((await open(userA, saved.purchaseId)).kind, "unavailable");
    assert(await db.loadOwnedAccountAnalysis(userA, saved.purchaseId), "outage must not revoke or erase");
    paymentState = { kind: "revoked" };
    assert.equal((await open(userA, saved.purchaseId)).kind, "not_found");
    assert.equal(await db.loadOwnedAccountAnalysis(userA, saved.purchaseId), null);
    assert.equal((await db.listAccountPurchases(userA))[0].status, "revoked", "refund retains purchase but removes account payload");
    assert.equal((await db.saveAccountAudhdPurchase(userA, proof("One"))).kind, "denied", "revocation cannot be undone by an old proof");

    const two = await db.saveAccountAudhdPurchase(userA, proof("Two"));
    assert.equal(await db.removeOwnedAccountAnalysis(userA, two.purchaseId), true);
    assert.equal(await db.loadOwnedAccountAnalysis(userA, two.purchaseId), null);
    assert((await db.listAccountPurchases(userA)).some(p => p.id === two.purchaseId && p.status === "user_deleted"));
    const concurrent = await db.saveAccountAudhdPurchase(userA, proof("ConcurrentDelete"));
    const openDuringDelete = createLoader({ "./accountPurchasesDb.server": db, "./accountAudhdPayment.server": {
      verifyAccountAudhdPayment: async () => {
        await db.removeOwnedAccountAnalysis(userA, concurrent.purchaseId);
        return { kind: "verified", payment: proof("ConcurrentDelete").payment };
      },
    } })(path.join(__dirname, "accountAnalysis.server.ts")).openOwnedAccountAnalysis;
    assert.equal((await openDuringDelete(userA, concurrent.purchaseId)).kind, "not_found", "deletion during Stripe verification prevents report disclosure");
    const three = await db.saveAccountAudhdPurchase(userA, proof("Three"));
    await assert.rejects(pg.query("update account_audhd_analyses set expires_at = saved_at + interval '13 months' where purchase_id = $1", [three.purchaseId]), /check constraint/);
    await pg.query("update account_audhd_analyses set saved_at = now() - interval '13 months', expires_at = now() - interval '2 months' where purchase_id = $1", [three.purchaseId]);
    assert.equal(await db.loadOwnedAccountAnalysis(userA, three.purchaseId), null, "expiry denies access before cleanup");
    assert.equal(await db.deleteExpiredAccountAnalyses(), 1);
    assert.equal((await db.accountCleanupHealth()).healthy, false, "successful SQL alone does not prove monitoring delivery");
    await db.recordAccountMonitorSuccess();
    assert.equal((await db.accountCleanupHealth()).healthy, true, "successful physical cleanup atomically records heartbeat");
    assert.equal((await pg.query("select count(*)::int as count from account_audhd_analyses where purchase_id = $1", [three.purchaseId])).rows[0].count, 0, "cleanup physically deletes ciphertext row");
    assert((await db.listAccountPurchases(userA)).some(p => p.id === three.purchaseId && p.status === "expired"));
    assert.equal(await db.deleteExpiredAccountAnalyses(), 0, "cleanup is idempotent");
    await pg.exec("update account_analysis_cleanup_state set last_success_at = now() - interval '27 hours'");
    assert.equal((await db.accountCleanupHealth()).healthy, false, "missed daily run alerts even when no analyses expire");
    await db.deleteExpiredAccountAnalyses();
    const overdue = await db.saveAccountAudhdPurchase(userB, proof("Overdue"));
    await pg.query("update account_audhd_analyses set saved_at = now() - interval '12 months' + interval '10 days', expires_at = now() - interval '25 hours' where purchase_id = $1", [overdue.purchaseId]);
    assert.equal((await db.accountCleanupHealth()).healthy, false, "unremoved payloads alert even with a fresh heartbeat");
    assert.equal((await db.accountCleanupHealth()).overdueCount, 1);
    await db.deleteExpiredAccountAnalyses();
    assert.equal((await db.accountCleanupHealth()).healthy, true);
    await pg.query("insert into account_purchases(id,user_id,product_key,stripe_checkout_session_id,stripe_payment_intent_id,stripe_price_id,purchased_at,amount_total_ore,currency,proof_kind) select gen_random_uuid(), $1, 'audhd_test','cs_live_Batch'||i,'pi_Batch'||i,'price_account',now(),7900,'sek','checkout' from generate_series(1,101) i", [userB]);
    await pg.query("insert into account_audhd_analyses(purchase_id,generation_id,journal_identity,report_version,answers_ciphertext,encryption_iv,encryption_auth_tag,consent_version,saved_at,expires_at) select id,gen_random_uuid(),$4,'audhd-v1',$1,$2,$3,'account-analysis-v1',now()-interval '13 months',now()-interval '2 months' from account_purchases where stripe_checkout_session_id like 'cs_live_Batch%'", [encrypted.ciphertext, encrypted.iv, encrypted.authTag, journalIdentity]);
    assert.equal(await db.deleteExpiredAccountAnalyses(), 101, "daily cleanup processes multiple bounded batches without manual intervention");

    const races = await Promise.all([db.saveAccountAudhdPurchase(userA, proof("Race")), db.saveAccountAudhdPurchase(userB, proof("Race"))]);
    assert.equal(races.filter(r => r.kind === "saved").length, 1);
    assert.equal(races.filter(r => r.kind === "denied").length, 1);
    // Restore a backup taken BEFORE a real deletion. R2 is deliberately outside
    // the database snapshot; even accidentally enabling active mode cannot
    // expose this generation before reconciliation.
    const beforeDelete = await db.saveAccountAudhdPurchase(userB, proof("Restore"));
    const backup = (await pg.query("select * from account_audhd_analyses where purchase_id = $1", [beforeDelete.purchaseId])).rows[0];
    journalFailure = true;
    await assert.rejects(db.removeOwnedAccountAnalysis(userB, beforeDelete.purchaseId));
    assert.equal((await pg.query("select count(*)::int as count from account_audhd_analyses where purchase_id = $1", [beforeDelete.purchaseId])).rows[0].count, 1, "failed journal write cannot acknowledge/delete SQL data");
    journalFailure = false;
    await db.removeOwnedAccountAnalysis(userB, beforeDelete.purchaseId);
    await pg.query("delete from account_analysis_erasure_receipts where generation_id = $1", [backup.generation_id]);
    externalJournal.set(backup.generation_id, { reason: "expired" });
    await pg.query("insert into account_audhd_analyses select * from json_populate_record(null::account_audhd_analyses, $1::json)", [JSON.stringify(backup)]);
    assert.equal(await db.loadOwnedAccountAnalysis(userB, beforeDelete.purchaseId), null, "restored deleted generation is blocked by external journal on every read");
    const liveDuringMaintenance = await db.saveAccountAudhdPurchase(userB, proof("LiveMaintenance"));
    await pg.query("insert into account_audhd_analyses(purchase_id,generation_id,journal_identity,report_version,answers_ciphertext,encryption_iv,encryption_auth_tag,consent_version) select id,gen_random_uuid(),$4,'audhd-v1',$1,$2,$3,'account-analysis-v1' from account_purchases where stripe_checkout_session_id like 'cs_live_Batch%'", [encrypted.ciphertext, encrypted.iv, encrypted.authTag, journalIdentity]);
    process.env.ACCOUNT_STORAGE_MODE = "maintenance";
    await assert.rejects(db.saveAccountAudhdPurchase(userB, proof("Maintenance")));
    await assert.rejects(db.loadOwnedAccountAnalysis(userB, liveDuringMaintenance.purchaseId), /maintenance/);
    await assert.rejects(db.reconcileAccountRestore(new Date(Date.now() - 8 * 86400000)), /preconditions/);
    journalFailure = true;
    await assert.rejects(db.reconcileAccountRestore(new Date(Date.now() - 86400000)));
    journalFailure = false;
    let reconciled = await db.reconcileAccountRestore(new Date(Date.now() - 86400000));
    assert.equal(reconciled.complete, false, "restore verification is bounded and returns an explicit continuation cursor");
    let restoreRemoved = reconciled.removed;
    while (!reconciled.complete) {
      reconciled = await db.reconcileAccountRestore(new Date(Date.now() - 86400000), reconciled.nextCursor);
      restoreRemoved += reconciled.removed;
    }
    assert(restoreRemoved >= 1);
    assert.equal((await pg.query("select count(*)::int as count from account_audhd_analyses where purchase_id = $1", [beforeDelete.purchaseId])).rows[0].count, 0, "restored deleted copy is physically erased again");
    process.env.ACCOUNT_STORAGE_MODE = "active";
    await db.saveAccountAudhdPurchase(userB, proof("Restore"));
    const consentAgain = await db.loadOwnedAccountAnalysis(userB, beforeDelete.purchaseId);
    assert(consentAgain && consentAgain.generationId !== backup.generation_id, "new explicit saving has a new generation, never revives old copy");
    await pg.exec("create function synthetic_delete_failure() returns trigger language plpgsql as $$ begin raise exception 'synthetic database failure'; end; $$; create trigger synthetic_delete_failure before delete on account_audhd_analyses for each row execute function synthetic_delete_failure()");
    await assert.rejects(db.removeOwnedAccountAnalysis(userB, beforeDelete.purchaseId), /synthetic database failure/);
    assert(externalJournal.has(consentAgain.generationId), "external receipt survives SQL transaction rollback");
    assert.equal(await db.loadOwnedAccountAnalysis(userB, beforeDelete.purchaseId), null, "SQL rollback cannot expose externally erased data");
    await pg.exec("drop trigger synthetic_delete_failure on account_audhd_analyses; drop function synthetic_delete_failure()");
    await db.removeOwnedAccountAnalysis(userB, beforeDelete.purchaseId);
    await assert.rejects(pg.query("delete from auth.users where id = $1", [userA]), /receipt required/);
    await db.eraseAccountPortalAnalyses(userA);
    await pg.query("delete from auth.users where id = $1", [userA]);
    assert.deepEqual(await db.listAccountPurchases(userA), [], "account deletion cascades through history and analysis");
    const inventoryResults = await pg.exec(fs.readFileSync(path.join(__dirname, "../../scripts/sql/account-phase2-schema-inventory.sql"), "utf8"));
    const inventory = inventoryResults.flatMap(result => result.rows ?? []).find(row => row.schema_inventory)?.schema_inventory;
    assert.equal(inventory.read_only, "on", "schema inventory executes in a read-only transaction");
    assert(inventory.tables.some(table => table.table_name === "account_audhd_analyses" && table.relrowsecurity));
    assert(!JSON.stringify(inventory).includes(encrypted.ciphertext), "metadata export contains no answer payloads");
    console.log("PASS: local PostgreSQL migration, owner isolation, one-owner claims, encrypted reopen after 7 days, refunds, deletion, retention and RLS.");
  } finally { await pg.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
