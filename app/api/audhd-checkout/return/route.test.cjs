/* eslint-disable @typescript-eslint/no-require-imports -- executable verified-return regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

const secret = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ";
let verification = { verified: true, checkoutSessionId: "cs_live_audhd123", checkoutReferenceId: "audhd_12345678901234567890123456789012", paymentIntentId: "pi_audhd123" };
let finalized = { id: "11111111-1111-4111-8111-111111111111", accessExpiresAt: new Date(Date.now() + 60_000) };
const route = createLoader({
  "../../../_lib/audhdCheckoutAttempt.server": { AUDHD_CHECKOUT_ACCESS_COOKIE: "rv_audhd_checkout_access", AUDHD_CHECKOUT_ATTEMPT_COOKIE: "rv_audhd_checkout_attempt", hashAudhdCheckoutBrowserSecret: value => `hash:${value}`, issueAudhdCheckoutAccessToken: attemptId => `signed:${attemptId}` },
  "../../../_lib/audhdCheckoutAttemptsDb.server": { finalizeVerifiedAudhdCheckout: async value => { assert.deepEqual(value, { browserSecretHash: `hash:${secret}`, checkoutReferenceId: "audhd_12345678901234567890123456789012", checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123" }); return finalized; } },
  "../../../_lib/audhdCheckoutPayment.server": { verifyAudhdCheckoutPayment: async () => verification },
})(path.join(__dirname, "route.ts"));
function request({ session = "cs_live_audhd123", cookie = secret } = {}) {
  return new NextRequest(`https://www.relationsvarning.se/api/audhd-checkout/return?session_id=${session}`, { headers: cookie ? { cookie: `rv_audhd_checkout_attempt=${cookie}` } : undefined });
}

(async () => {
  let response = await route.GET(request({ cookie: "" }));
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get("location")).search, "?checkout=unavailable");

  verification = { verified: false, reason: "session_not_paid" };
  response = await route.GET(request());
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("set-cookie"), null);

  verification = { verified: true, checkoutSessionId: "cs_live_audhd123", checkoutReferenceId: "audhd_12345678901234567890123456789012", paymentIntentId: "pi_audhd123" };
  finalized = null;
  response = await route.GET(request());
  assert.equal(new URL(response.headers.get("location")).search, "?checkout=unavailable", "another browser or mismatched attempt cannot use the session URL");

  finalized = { id: "11111111-1111-4111-8111-111111111111", accessExpiresAt: new Date(Date.now() + 60_000) };
  response = await route.GET(request());
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get("location")).pathname, "/audhd-test/test");
  assert.equal(new URL(response.headers.get("location")).search, "", "the Session ID never reaches the final page URL");
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /rv_audhd_checkout_access=signed%3A11111111/);
  console.log("PASS: Stripe return requires the matching browser-bound attempt, issues only HttpOnly cookies, and removes the Session ID before redirecting.");
})().catch(error => { console.error(error); process.exitCode = 1; });
