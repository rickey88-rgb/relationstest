/* eslint-disable @typescript-eslint/no-require-imports -- executable server-route regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

process.env.AUDHD_RECOVERY_TOKEN_SECRET = "test-recovery-secret-that-is-longer-than-thirty-two-characters";
let redeemedHash = null;
let grantId = "11111111-1111-4111-8111-111111111111", grantAvailable = true, redeemCalls = 0;
let verification = { verified: true, checkoutSessionId: "cs_live_paid", paymentIntentId: "pi_paid", priceId: "price_audhd" };
let revocations = 0;
const route = createLoader({
  "../../../_lib/audhdRecoveryDb.server": { loadAudhdRecoveryGrantForRedemption: async () => grantAvailable ? ({ id: grantId, checkoutSessionId: "cs_live_paid", paymentIntentId: "pi_paid", priceId: "price_audhd" }) : null, redeemAudhdRecoveryGrant: async hash => { redeemedHash = hash; redeemCalls += 1; grantAvailable = false; return grantId; }, revokeAudhdRecoveryGrantsForPaymentIntent: async () => { revocations += 1; return true; } },
  "../../../_lib/audhdRecoveryPayment.server": { inspectAudhdCheckoutSession: async () => verification },
})(path.join(__dirname, "route.ts"));
const recovery = createLoader()(path.join(__dirname, "../../../_lib/audhdRecovery.server.ts"));

(async () => {
  const v2Token = recovery.issueAudhdRecoveryToken();
  let response = await route.GET(new NextRequest(`https://www.relationsvarning.se/api/audhd-recovery/redeem?token=${v2Token}`));
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=success");
  assert.equal(new URL(response.headers.get("location")).searchParams.has("token"), false);
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /SameSite=lax/i);
  assert.match(response.headers.get("set-cookie"), /Max-Age=3600/);
  assert.match(response.headers.get("set-cookie"), /rv_audhd_recovery_v2=/);
  assert.doesNotMatch(response.headers.get("set-cookie"), /rv_audhd_recovery=/);
  assert.equal(redeemedHash.length, 64);

  response = await route.GET(new NextRequest(`https://www.relationsvarning.se/api/audhd-recovery/redeem?token=${v2Token}`));
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=invalid", "an already redeemed one-time link cannot be reused");
  assert.equal(redeemCalls, 1);

  grantAvailable = true;
  grantId = null;
  response = await route.GET(new NextRequest(`https://www.relationsvarning.se/api/audhd-recovery/redeem?token=${recovery.issueAudhdRecoveryToken()}`));
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=invalid");
  assert.equal(response.headers.get("set-cookie"), null);
  grantId = "11111111-1111-4111-8111-111111111111";
  grantAvailable = true;
  verification = { verified: false, reason: "payment_refunded" };
  response = await route.GET(new NextRequest(`https://www.relationsvarning.se/api/audhd-recovery/redeem?token=${recovery.issueAudhdRecoveryToken()}`));
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=invalid");
  assert.equal(revocations, 1, "a refund revokes a recovery grant before it can be redeemed");
  console.log("PASS: AuDHD v2 recovery redemption atomically consumes an opaque token, strips it from the redirect and sets only a short v2 browser cookie.");
})().catch(error => { console.error(error); process.exitCode = 1; });
