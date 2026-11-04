/* eslint-disable @typescript-eslint/no-require-imports -- isolated PostgreSQL newsletter regression harness. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { PGlite } = require("@electric-sql/pglite");
const createLoader = require("../autism-test/test/test-loader.cjs");

async function main() {
  const pg = new PGlite();
  const originalFetch = global.fetch, originalError = console.error;
  const messages = [], logs = [];
  let mailFailure = false;
  process.env.DATABASE_URL = "postgres://isolated-newsletter-test";
  process.env.NEWSLETTER_ENABLED = "true";
  process.env.NEWSLETTER_TOKEN_SECRET = "test-only-newsletter-secret-of-at-least-32-characters";
  process.env.RESEND_API_KEY = "test-only";
  process.env.NEWSLETTER_EMAIL_FROM = "Newsletter Test <test@example.invalid>";
  console.error = value => logs.push(value);
  global.fetch = async (_url, input) => {
    if (mailFailure === "rejected") return { ok: false };
    if (mailFailure) throw new Error("network failure must never be logged raw");
    messages.push(JSON.parse(input.body));
    return { ok: true };
  };
  function adapter(connection) {
    const sql = async (strings, ...values) => {
      const text = strings.reduce((result, part, index) => result + (index ? `$${index}` : "") + part, "");
      return (await connection.query(text, values)).rows;
    };
    sql.begin = callback => pg.transaction(tx => callback(adapter(tx)));
    return sql;
  }
  try {
    await pg.exec("create role anon; create role authenticated; create role service_role bypassrls; create table public.existing_customer_fixture(email text); insert into public.existing_customer_fixture values ('buyer@example.invalid'); alter default privileges in schema public grant all on tables to anon, authenticated;");
    await pg.exec(fs.readFileSync(path.join(__dirname, "../../supabase/migrations/202611040001_newsletter.sql"), "utf8"));
    delete global.newsletterSql;
    const load = createLoader({ postgres: { default: () => adapter(pg) } });
    const shared = load(path.join(__dirname, "newsletter.ts"));
    const db = load(path.join(__dirname, "newsletterDb.server.ts"));
    const service = load(path.join(__dirname, "newsletter.server.ts"));
    const register = (email, source = "home", ip = "192.0.2.1") => service.subscribeNewsletter({ email, source, consent: true, version: shared.NEWSLETTER_CONSENT_VERSION }, ip);
    assert.equal((await pg.query("select count(*)::int as n from public.newsletter_subscribers")).rows[0].n, 0, "migration never imports existing customers");
    for (const table of ["newsletter_subscribers", "newsletter_rate_limits"]) {
      for (const role of ["anon", "authenticated"]) {
        const r = await pg.query("select has_table_privilege($1,$2,'SELECT,INSERT,UPDATE,DELETE') as allowed", [role, table]);
        assert.equal(r.rows[0].allowed, false, "browser roles cannot access newsletter tables");
      }
      assert.equal((await pg.query("select relrowsecurity from pg_class where oid = $1::regclass", [table])).rows[0].relrowsecurity, true);
    }
    assert.equal(await register("bad\r\naddress"), "invalid");
    assert.equal(await register("a..b@example.invalid"), "invalid");
    assert.equal(await service.subscribeNewsletter({ email: "new@example.invalid", source: "home", consent: false, version: shared.NEWSLETTER_CONSENT_VERSION }, "ip"), "invalid");
    assert.equal(await service.subscribeNewsletter({ email: "new@example.invalid", source: "audhd_test", consent: true, version: shared.NEWSLETTER_CONSENT_VERSION }, "ip"), "invalid");
    assert.equal(await register(" Buyer@Example.Invalid "), "accepted");
    assert.equal(await register("buyer@example.invalid"), "accepted");
    assert.equal(messages.length, 1, "duplicate registration does not send duplicate confirmation");
    let rows = (await pg.query("select * from public.newsletter_subscribers")).rows;
    assert.equal(rows.length, 1);
    assert.equal(rows[0].email, "buyer@example.invalid");
    assert.equal(rows[0].status, "pending");
    assert.equal((await db.newsletterRecipients()).length, 0, "pending addresses never enter campaign list");
    const token = messages[0].text.match(/#token=([A-Za-z0-9_-]+)/)[1];
    assert.equal(rows[0].confirmation_hash, service.newsletterHash(token));
    assert(!JSON.stringify(rows).includes(token), "plaintext token is not stored");
    const confirmation = await service.confirmNewsletterToken(token);
    assert.equal(confirmation.source, "home");
    assert(confirmation.unsubscribeUrl.startsWith("https://www.relationsvarning.se/nyhetsbrev/avsluta#token="));
    assert(!confirmation.unsubscribeUrl.includes("buyer@example.invalid"));
    assert.equal(await service.confirmNewsletterToken(token), null, "confirmation is single use");
    assert.equal((await db.newsletterRecipients()).length, 1);
    assert.equal(await register("buyer@example.invalid"), "accepted");
    assert.equal(messages.length, 1, "active customer receives neutral response without another email");
    const recipient = (await db.newsletterRecipients())[0];
    const unsubscribeUrl = service.newsletterUnsubscribeUrl(recipient.id, recipient.unsubscribe_nonce);
    assert.equal(confirmation.unsubscribeUrl, unsubscribeUrl, "confirmation page receives the current generation's real unsubscribe link");
    const unsubscribeToken = new URLSearchParams(new URL(unsubscribeUrl).hash.slice(1)).get("token");
    assert.equal(await service.unsubscribeNewsletterToken(unsubscribeToken.slice(0, -1) + "!"), false);
    process.env.NEWSLETTER_ENABLED = "false";
    assert.equal(await service.unsubscribeNewsletterToken(unsubscribeToken), true, "unsubscribe remains available when signup is disabled");
    process.env.NEWSLETTER_ENABLED = "true";
    assert.equal(await service.unsubscribeNewsletterToken(unsubscribeToken), true, "unsubscribe can safely be repeated");
    assert.equal((await db.newsletterRecipients()).length, 0);
    await pg.exec("update public.newsletter_subscribers set requested_at = now() - interval '20 minutes'");
    // Reset only test rate counters, allowing the explicit re-subscribe exercise.
    await pg.exec("delete from public.newsletter_rate_limits");
    assert.equal(await register("buyer@example.invalid", "footer"), "accepted");
    assert.equal((await db.newsletterRecipients()).length, 0, "re-subscribe still requires a new email confirmation");
    const newToken = messages.at(-1).text.match(/#token=([A-Za-z0-9_-]+)/)[1];
    assert.equal((await service.confirmNewsletterToken(newToken)).source, "footer");
    assert.equal((await pg.query("select count(*)::int n from public.newsletter_subscribers")).rows[0].n, 1);
    assert.equal(await service.unsubscribeNewsletterToken(unsubscribeToken), false, "old unsubscribe generation cannot modify a newly confirmed subscription");
    await Promise.all([register("parallel@example.invalid", "article"), register("parallel@example.invalid", "article")]);
    assert.equal(messages.filter(m => m.to[0] === "parallel@example.invalid").length, 1);
    const parallelToken = messages.at(-1).text.match(/#token=([A-Za-z0-9_-]+)/)[1];
    await pg.query("update public.newsletter_subscribers set confirmation_expires_at = now() - interval '1 second' where email = $1", ["parallel@example.invalid"]);
    assert.equal(await service.confirmNewsletterToken(parallelToken), null, "expired links do not activate");
    mailFailure = true;
    assert.equal(await register("failure@example.invalid", "result"), "accepted");
    assert.equal((await pg.query("select status from public.newsletter_subscribers where email = 'failure@example.invalid'")).rows[0].status, "pending");
    assert(logs.every(line => !/example|token=|network failure/.test(line)));
    mailFailure = "rejected";
    assert.equal(await register("rejected@example.invalid", "home", "192.0.2.9"), "accepted");
    assert(logs.some(line => JSON.parse(line).reason === "email_rejected"));
    assert.equal((await pg.query("select status from public.newsletter_subscribers where email='rejected@example.invalid'")).rows[0].status, "pending");
    for (let n = 0; n < 4; n++) await register("limited@example.invalid", "home");
    assert((await pg.query("select max(attempts)::int n from public.newsletter_rate_limits")).rows[0].n >= 3);
    const columns = (await pg.query("select column_name from information_schema.columns where table_name='newsletter_subscribers'")).rows.map(row => row.column_name);
    assert(!columns.some(name => /customer|user_id|test|product|stripe|answer|diagnos/.test(name)));
    assert.equal((await pg.query("select email from public.existing_customer_fixture")).rows[0].email, "buyer@example.invalid", "unsubscribe never touches customer records");
    process.env.NEWSLETTER_ENABLED = "false";
    process.env.NEWSLETTER_TEST_EMAIL = " Rehearsal@Example.Invalid ";
    mailFailure = false;
    assert.equal(service.newsletterConfigured(), false, "rehearsal never exposes the public signup forms");
    const beforeRehearsal = messages.length;
    assert.equal(await register("unapproved@example.invalid", "footer", "rehearsal-ip"), "unavailable");
    assert.equal((await pg.query("select count(*)::int n from public.newsletter_subscribers where email='unapproved@example.invalid'")).rows[0].n, 0);
    assert.equal(messages.length, beforeRehearsal, "unapproved addresses never trigger an email");
    assert.equal(await register("rehearsal@example.invalid", "footer", "rehearsal-ip"), "accepted");
    assert.equal(messages.length, beforeRehearsal + 1);
    assert.equal((await pg.query("select status from public.newsletter_subscribers where email='rehearsal@example.invalid'")).rows[0].status, "pending");
    delete process.env.NEWSLETTER_ENABLED;
    assert.equal(await register("rehearsal@example.invalid", "footer", "rehearsal-ip"), "unavailable", "rehearsal requires an explicit false flag");
    process.env.NEWSLETTER_ENABLED = "false";
    const originalSecret = process.env.NEWSLETTER_TOKEN_SECRET;
    delete process.env.NEWSLETTER_TOKEN_SECRET;
    assert.equal(await register("rehearsal@example.invalid", "footer", "rehearsal-ip"), "unavailable", "rehearsal cannot bypass required configuration");
    process.env.NEWSLETTER_TOKEN_SECRET = originalSecret;
    delete process.env.NEWSLETTER_TEST_EMAIL;
    process.env.NEWSLETTER_ENABLED = "true";
    await pg.exec("update public.newsletter_subscribers set requested_at=now()-interval '29 days 12 hours' where status='pending'; update public.newsletter_rate_limits set window_start=now()-interval '25 hours'");
    await db.cleanupNewsletter();
    assert.equal((await pg.query("select count(*)::int n from public.newsletter_subscribers where status='pending'")).rows[0].n, 0);
    assert.equal((await pg.query("select count(*)::int n from public.newsletter_rate_limits")).rows[0].n, 0, "daily sweep leaves margin to the 48-hour maximum");
    assert.equal((await db.newsletterRecipients()).length, 1, "retention cleanup preserves active subscribers");
    mailFailure = false;
    for (const source of shared.NEWSLETTER_SOURCES) {
      await register(`${source}@placements.invalid`, source, `placement-${source}`);
      const placementToken = messages.at(-1).text.match(/#token=([A-Za-z0-9_-]+)/)[1];
      assert.equal((await service.confirmNewsletterToken(placementToken)).source, source);
      const saved = (await pg.query("select source, consent_version, registered_at, confirmed_at from public.newsletter_subscribers where email=$1", [`${source}@placements.invalid`])).rows[0];
      assert.equal(saved.source, source);
      assert.equal(saved.consent_version, shared.NEWSLETTER_CONSENT_VERSION);
      assert(saved.registered_at && saved.confirmed_at);
    }
    console.log("PASS: actual PostgreSQL migration/queries, RLS/grants, separate customers, duplicate/concurrent requests, confirmation/expiry, unsubscribe/re-subscribe, rate limits, retention and safe mail failure.");
  } finally { global.fetch = originalFetch; console.error = originalError; delete global.newsletterSql; await pg.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
