/* eslint-disable @typescript-eslint/no-require-imports -- executable database-boundary regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.DATABASE_URL = "postgres://placeholder";
let query = "", values = [], nextRows = [{ id: "11111111-1111-4111-8111-111111111111", expires_at: new Date() }];
function postgresMock() {
  return (strings, ...parameters) => {
    query = strings.join("?"); values = parameters;
    return Promise.resolve(nextRows);
  };
}
const db = createLoader({ postgres: { default: postgresMock } })(path.join(__dirname, "audhdCheckoutAttemptsDb.server.ts"));

(async () => {
  await db.createAudhdCheckoutAttempt({ browserSecretHash: "a".repeat(64), reportVersion: "audhd-v1", ciphertext: "cipher", iv: "iv", authTag: "tag" });
  assert.match(query, /insert into public\.audhd_checkout_attempts/i);
  assert(values.includes("a".repeat(64)));
  assert(!values.some(value => value === "browser-secret"), "only the browser-secret hash reaches the database layer");

  nextRows = [{ id: "11111111-1111-4111-8111-111111111111" }];
  await db.attachStripeCheckoutSessionToAudhdAttempt("11111111-1111-4111-8111-111111111111", "cs_live_abc123");
  assert.match(query, /update public\.audhd_checkout_attempts/i);
  assert.match(query, /stripe_checkout_session_id is null/i);
  assert(values.includes("cs_live_abc123"));
  await assert.rejects(() => db.attachStripeCheckoutSessionToAudhdAttempt("11111111-1111-4111-8111-111111111111", "cs_test_abc123"), /live Stripe Checkout Session/);
  nextRows = [{ id: "11111111-1111-4111-8111-111111111111" }];
  assert.equal(await db.revokeAudhdCheckoutAccessForPaymentIntent("pi_abc123"), true);
  assert.match(query, /set revoked_at = coalesce\(revoked_at, now\(\)\)/i);
  assert.match(query, /and revoked_at is null/i);
  assert.equal(await db.revokeAudhdCheckoutAccessForPaymentIntent("not-a-payment-intent"), false);
  nextRows = [{ id: "11111111-1111-4111-8111-111111111111" }];
  assert.equal(await db.releaseExpiredAudhdCheckoutSession({ attemptId: "11111111-1111-4111-8111-111111111111", browserSecretHash: "a".repeat(64), checkoutReferenceId: "audhd_12345678901234567890123456789012", checkoutSessionId: "cs_live_abc123" }), true);
  assert.match(query, /set stripe_checkout_session_id = null/i);
  assert.match(query, /and paid_at is null/i);
  nextRows = [{ deleted_count: 2 }];
  assert.equal(await db.deleteExpiredAudhdCheckoutAttempts(), 2);
  assert.match(query, /delete from public\.audhd_checkout_attempts/i);
  assert.match(query, /where expires_at <= now\(\)/i);
  assert(!/stripe_payments|audhd_recovery_grants/i.test(query), "cleanup is isolated to encrypted checkout attempts");
  console.log("PASS: AuDHD checkout attempts store only a browser-secret hash, reserve one live Stripe Checkout Session binding, and revoke access idempotently.");
})().catch(error => { console.error(error); process.exitCode = 1; });
