/* eslint-disable @typescript-eslint/no-require-imports -- executable automatic-recovery regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

let created = 0, discarded = 0, mailed = 0, configured = true, grantFailure = false, mailFailure = false, grantExists = false;
const automatic = createLoader({
  "./audhdRecoveryDb.server": {
    createAutomaticAudhdRecoveryGrant: async input => { created += 1; assert.equal(input.checkoutSessionId, "cs_live_audhd123"); if (grantFailure) throw new Error("DatabaseFailure"); if (grantExists) return { kind: "existing" }; grantExists = true; return { kind: "created", id: "11111111-1111-4111-8111-111111111111" }; },
    discardUndeliveredAutomaticAudhdRecoveryGrant: async input => { discarded += 1; assert.equal(input.checkoutSessionId, "cs_live_audhd123"); grantExists = false; return true; },
  },
  "./audhdRecovery.server": { issueAudhdRecoveryToken: () => "opaque-token", hashAudhdRecoveryToken: value => `hash:${value}` },
  "./audhdRecoveryEmail.server": { isAudhdRecoveryEmailConfigured: () => configured, sendAudhdRecoveryEmail: async input => { mailed += 1; assert.equal(input.to, "buyer@example.test"); assert.match(input.recoveryUrl, /token=opaque-token/); if (mailFailure) throw new Error("MailFailure"); } },
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
  assert.deepEqual(result, { kind: "delivery_failed" });
  assert.equal(grantExists, false, "a failed first mail must not strand an active grant");
  assert.equal(discarded, 1);
  mailFailure = false;
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "accepted" }, "a retry after failed delivery gets one fresh token");
  assert.equal(mailed, 3);
  grantExists = false;
  mailFailure = "timeout";
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "delivery_failed" }, "a timeout retires the uncertain token");
  assert.equal(grantExists, false);
  mailFailure = false;
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "accepted" }, "a retry after timeout gets one fresh token");
  configured = false;
  grantExists = false;
  result = await automatic.sendAutomaticAudhdRecovery({ checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" });
  assert.deepEqual(result, { kind: "unavailable" });
  assert.equal(created, 7, "no inaccessible grant is created while mail is unconfigured");
  console.log("PASS: automatic recovery retries safely after failed or timed-out mail without retaining extra active links.");
})().catch(error => { console.error(error); process.exitCode = 1; });
