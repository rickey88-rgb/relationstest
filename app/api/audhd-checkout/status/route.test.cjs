/* eslint-disable @typescript-eslint/no-require-imports -- executable retry-route regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

const secret = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ";
let pending = { checkoutReferenceId: "audhd_12345678901234567890123456789012", checkoutSessionId: "cs_live_audhd123" };
let verification = { verified: true, checkoutSessionId: pending.checkoutSessionId, checkoutReferenceId: pending.checkoutReferenceId, paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: null };
let finalized = { id: "11111111-1111-4111-8111-111111111111", accessExpiresAt: new Date(Date.now() + 60_000) };
const route = createLoader({
  "../../../_lib/audhdCheckoutAttempt.server": { AUDHD_CHECKOUT_ACCESS_COOKIE: "rv_audhd_checkout_access", AUDHD_CHECKOUT_ATTEMPT_COOKIE: "rv_audhd_checkout_attempt", hashAudhdCheckoutBrowserSecret: value => `hash:${value}`, issueAudhdCheckoutAccessToken: id => `signed:${id}` },
  "../../../_lib/audhdCheckoutAttemptsDb.server": { loadAudhdCheckoutPendingRecord: async hash => hash === `hash:${secret}` ? pending : null, finalizeVerifiedAudhdCheckout: async () => finalized },
  "../../../_lib/audhdCheckoutPayment.server": { verifyAudhdCheckoutPayment: async sessionId => { assert.equal(sessionId, pending.checkoutSessionId); return verification; } },
})(path.join(__dirname, "route.ts"));

function request(cookie = secret) { return new NextRequest("https://www.relationsvarning.se/api/audhd-checkout/status", { headers: cookie ? { cookie: `rv_audhd_checkout_attempt=${cookie}` } : undefined }); }

(async () => {
  let response = await route.GET(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ready" });
  assert.match(response.headers.get("set-cookie"), /rv_audhd_checkout_access=/);

  verification = { verified: false, reason: "session_not_paid" };
  response = await route.GET(request());
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { status: "pending" });

  verification = { verified: false, reason: "wrong_price_or_amount" };
  response = await route.GET(request());
  assert.equal(response.status, 404);

  response = await route.GET(request(""));
  assert.equal(response.status, 404, "a retry never accepts a session ID from a cookie-less browser");
  console.log("PASS: checkout status retries only the Session already bound to the requesting browser secret.");
})().catch(error => { console.error(error); process.exitCode = 1; });
