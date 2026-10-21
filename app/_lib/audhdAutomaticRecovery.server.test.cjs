/* eslint-disable @typescript-eslint/no-require-imports -- executable automatic-recovery regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

let created = 0, discarded = 0, mailed = 0, configured = true, grantFailure = false, mailFailure = false, grantExists = false;
class AudhdRecoveryEmailRejected extends Error {}
const automatic = createLoader({
  "./audhdRecoveryDb.server": {
    createAutomaticAudhdRecoveryGrant: async input => { created += 1; assert.equal(input.checkoutSessionId, "cs_live_audhd123"); if (grantFailure) throw new Error("DatabaseFailure"); if (grantExists) return { kind: "existing" }; grantExists = true; return { kind: "created", id: "11111111-1111-4111-8111-111111111111" }; },
    discardUndeliveredAutomaticAudhdRecoveryGrant: async input => { discarded += 1; assert.equal(input.checkoutSessionId, "cs_live_audhd123"); grantExists = false; return true; },
  },
  "./audhdRecovery.server": { issueAudhdRecoveryToken: () => "opaque-token", hashAudhdRecoveryToken: value => `hash:${value}` },
  "./audhdRecoveryEmail.server": { AudhdRecoveryEmailRejected, isAudhdRecoveryEmailConfigured: () => configured, sendAudhdRecoveryEmail: async input => { mailed += 1; assert.equal(input.to, "buyer@example.test"); assert.match(input.recoveryUrl, /token=opaque-token/); assert.match(input.idempotencyKey, /^audhd-recovery\/[a-f0-9]{64}$/); if (mailFailure === "rejected") throw new AudhdRecoveryEmailRejected(); if (mailFailure) throw new Error("MailFailure"); } },
})(path.join(__dirname, "audhdAutomaticRecovery.server.ts"));

(async () => {
  let result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "accepted" });
  assert.equal(created, 1); assert.equal(mailed, 1);
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "existing" });
  assert.equal(mailed, 1, "a duplicate Checkout return cannot replace or resend a one-time link");
  grantExists = false;
  grantFailure = true;
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "database_failed" });
  grantFailure = false;
  mailFailure = true;
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "delivery_unknown" });
  assert.equal(grantExists, true, "an ambiguous mail attempt retains its sole grant to prevent a duplicate message");
  mailFailure = false;
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "existing" }, "a later webhook delivery cannot resend after an ambiguous mail attempt");
  assert.equal(mailed, 2);
  grantExists = false;
  mailFailure = "rejected";
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "delivery_failed" }, "a confirmed Resend rejection may be retried later");
  assert.equal(grantExists, false);
  assert.equal(discarded, 1);
  configured = false;
  grantExists = false;
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "unavailable" });
  assert.equal(created, 6, "no inaccessible grant is created while mail is unconfigured");
  console.log("PASS: automatic recovery creates at most one recovery link and never sends a duplicate after an ambiguous delivery.");
})().catch(error => { console.error(error); process.exitCode = 1; });
