/* eslint-disable @typescript-eslint/no-require-imports -- executable recovery-restore regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

const grantId = "11111111-1111-4111-8111-111111111111";
let record = { checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", ciphertext: "cipher", iv: "iv", authTag: "tag" };
let verification = { verified: true, checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd" };
let revoked = 0, decrypts = true;
const logs = [];
const originalError = console.error;
console.error = value => logs.push(String(value));
const answers = { reportVersion: "audhd-v1", answers: Array(48).fill(2), contextAnswers: Array(6).fill(2) };
const route = createLoader({
  "../../../_lib/audhdCheckoutAttempt.server": { decryptAudhdCheckoutAnswers: value => decrypts && value === record ? answers : null },
  "../../../_lib/audhdRecovery.server": { AUDHD_RECOVERY_COOKIE: "rv_audhd_recovery_v2", verifyAudhdBrowserUnlockToken: value => value === "signed" ? { grantId } : null },
  "../../../_lib/audhdRecoveryDb.server": { loadAudhdRecoveryRestoreRecord: async id => id === grantId ? record : null, revokeAudhdRecoveryGrantsForPaymentIntent: async () => { revoked += 1; return true; } },
  "../../../_lib/audhdRecoveryPayment.server": { inspectAudhdCheckoutSession: async () => verification },
})(path.join(__dirname, "route.ts"));
function request(cookie = "signed") { return new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/restore", { headers: cookie ? { cookie: `rv_audhd_recovery_v2=${cookie}` } : undefined }); }

(async () => {
  let response = await route.GET(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { restored: true, answers });

  record = null;
  response = await route.GET(request());
  assert.equal(response.status, 404, "expired or cleaned-up answers are a permanent recovery failure, never a leaked report");
  assert.deepEqual(await response.json(), { restored: false, retryable: false });
  assert.deepEqual(JSON.parse(logs.at(-1)), { event: "audhd_recovery_restore_unavailable", reason: "record_missing" });

  record = { checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd", ciphertext: "cipher", iv: "iv", authTag: "tag" };
  verification = { verified: false, reason: "payment_refunded" };
  response = await route.GET(request());
  assert.equal(response.status, 404);
  assert.equal(revoked, 1);
  assert.deepEqual(JSON.parse(logs.at(-1)), { event: "audhd_recovery_restore_unavailable", reason: "stripe_verification_failed" });
  assert.deepEqual(await response.json(), { restored: false, retryable: false });

  verification = { verified: true, checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123", priceId: "price_audhd" };
  decrypts = false;
  response = await route.GET(request());
  assert.equal(response.status, 404);
  assert.deepEqual(JSON.parse(logs.at(-1)), { event: "audhd_recovery_restore_unavailable", reason: "decrypt_failed" });
  assert.equal(logs.some(value => /cs_live|pi_audhd|cipher|signed/.test(value)), false, "failure logs contain no payment IDs, ciphertext or cookie values");
  assert.deepEqual(await response.json(), { restored: false, retryable: false });
  console.error = originalError;

  decrypts = true;
  verification = { verified: false, reason: "stripe_request_failed" };
  const revokedBeforeTemporaryFailure = revoked;
  response = await route.GET(request());
  assert.equal(response.status, 503, "a transient Stripe verification failure keeps the recovery grant retryable");
  assert.equal(response.headers.get("retry-after"), "2");
  assert.deepEqual(await response.json(), { restored: false, retryable: true });
  assert.equal(revoked, revokedBeforeTemporaryFailure, "a temporary Stripe failure does not consume or revoke recovery access");
  assert.deepEqual(JSON.parse(logs.at(-1)), { event: "audhd_recovery_restore_unavailable", reason: "stripe_temporarily_unavailable" });
  console.log("PASS: redeemed recovery can restore only its own retained answers and revokes on a later refund.");
})().catch(error => { console.error = originalError; console.error(error); process.exitCode = 1; });
