/* eslint-disable @typescript-eslint/no-require-imports -- executable server-route regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

process.env.AUDHD_RECOVERY_TOKEN_SECRET = "test-recovery-secret-that-is-longer-than-thirty-two-characters";
let redeemedHash = null;
let grantId = "11111111-1111-4111-8111-111111111111", grantAvailable = true, redeemCalls = 0, grantLoads = 0, paymentChecks = 0;
let verification = { verified: true, checkoutSessionId: "cs_live_paid", paymentIntentId: "pi_paid", priceId: "price_audhd" };
let revocations = 0;
const route = createLoader({
  "../../../_lib/audhdRecoveryDb.server": { loadAudhdRecoveryGrantForRedemption: async () => { grantLoads += 1; return grantAvailable ? ({ id: grantId, checkoutSessionId: "cs_live_paid", paymentIntentId: "pi_paid", priceId: "price_audhd" }) : null; }, redeemAudhdRecoveryGrant: async hash => { redeemedHash = hash; redeemCalls += 1; grantAvailable = false; return grantId; }, revokeAudhdRecoveryGrantsForPaymentIntent: async () => { revocations += 1; return true; } },
  "../../../_lib/audhdRecoveryPayment.server": { inspectAudhdCheckoutSession: async () => { paymentChecks += 1; return verification; } },
})(path.join(__dirname, "route.ts"));
const recovery = createLoader()(path.join(__dirname, "../../../_lib/audhdRecovery.server.ts"));

function postRecovery(token) {
  return route.POST(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/redeem", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token }),
  }));
}

(async () => {
  const v2Token = recovery.issueAudhdRecoveryToken();
  let response = await route.GET(new NextRequest(`https://www.relationsvarning.se/api/audhd-recovery/redeem?token=${v2Token}`));
  assert.equal(response.status, 200, "a link preview gets only the confirmation page");
  assert.match(response.headers.get("content-type"), /^text\/html/i);
  assert.match(await response.text(), /<form method="post" action="\/api\/audhd-recovery\/redeem">/);
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(redeemCalls, 0, "GET must never consume the grant");
  assert.equal(grantLoads, 0, "GET must not even look up the grant");
  assert.equal(paymentChecks, 0, "GET must not call Stripe");

  response = await postRecovery(v2Token);
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
  assert.equal(response.status, 200, "a later GET remains non-consuming");
  assert.equal(redeemCalls, 1);
  response = await postRecovery(v2Token);
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=invalid", "an already redeemed one-time link cannot be reused");

  grantAvailable = true; grantId = null;
  response = await postRecovery(recovery.issueAudhdRecoveryToken());
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=invalid");
  grantId = "11111111-1111-4111-8111-111111111111"; grantAvailable = true; verification = { verified: false, reason: "payment_refunded" };
  response = await postRecovery(recovery.issueAudhdRecoveryToken());
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=invalid");
  assert.equal(revocations, 1, "a refund revokes a recovery grant before it can be redeemed");
  console.log("PASS: a GET link preview cannot look up or consume a grant; an explicit POST redeems once, redirects safely to the paid result and rejects reuse.");
})().catch(error => { console.error(error); process.exitCode = 1; });
