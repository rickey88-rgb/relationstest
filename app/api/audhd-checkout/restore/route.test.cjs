/* eslint-disable @typescript-eslint/no-require-imports -- executable encrypted-answer restoration regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

const browserSecret = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ";
const restoredAnswers = { reportVersion: "audhd-v1", answers: Array(48).fill(2), contextAnswers: Array(6).fill(3) };
let access = { attemptId: "11111111-1111-4111-8111-111111111111" };
let record = { ciphertext: "cipher", iv: "iv", authTag: "tag", checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123" };
let verification = { verified: true, checkoutSessionId: "cs_live_audhd123", checkoutReferenceId: "audhd_12345678901234567890123456789012", paymentIntentId: "pi_audhd123" };
let revokeCalls = 0, loads = 0;
const route = createLoader({
  "../../../_lib/audhdCheckoutAttempt.server": { AUDHD_CHECKOUT_ACCESS_COOKIE: "rv_audhd_checkout_access", AUDHD_CHECKOUT_ATTEMPT_COOKIE: "rv_audhd_checkout_attempt", verifyAudhdCheckoutAccessToken: () => access, hashAudhdCheckoutBrowserSecret: value => `hash:${value}`, decryptAudhdCheckoutAnswers: value => value === record ? restoredAnswers : null },
  "../../../_lib/audhdCheckoutAttemptsDb.server": { loadAudhdCheckoutRestoreRecord: async (attemptId, hash) => { loads += 1; return attemptId === access?.attemptId && hash === `hash:${browserSecret}` ? record : null; }, revokeAudhdCheckoutAccessForPaymentIntent: async paymentIntent => { assert.equal(paymentIntent, "pi_audhd123"); revokeCalls += 1; record = null; return true; } },
  "../../../_lib/audhdCheckoutPayment.server": { verifyAudhdCheckoutPayment: async session => { assert.equal(session, "cs_live_audhd123"); return verification; } },
})(path.join(__dirname, "route.ts"));
function request(cookie = `rv_audhd_checkout_access=signed; rv_audhd_checkout_attempt=${browserSecret}`) { return new NextRequest("https://www.relationsvarning.se/api/audhd-checkout/restore", { headers: cookie ? { cookie } : undefined }); }

(async () => {
  global.localStorage = undefined;
  let response = await route.GET(request());
  assert.equal(response.status, 200, "server restore works with empty local storage");
  assert.deepEqual(await response.json(), { restored: true, answers: restoredAnswers });
  assert.equal(loads, 2, "the entitlement is re-read after direct Stripe verification");
  assert.equal(response.headers.get("cache-control"), "no-store");

  verification = { verified: false, reason: "payment_refunded" };
  response = await route.GET(request());
  assert.equal(response.status, 404, "an old access cookie cannot restore after a refund even if the webhook is delayed");
  assert.equal(revokeCalls, 1);
  response = await route.GET(request());
  assert.equal(response.status, 404, "repeated restore remains denied after durable webhook-style revocation");
  assert.equal(revokeCalls, 1);
  record = { ciphertext: "cipher", iv: "iv", authTag: "tag", checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123" };
  verification = { verified: false, reason: "payment_disputed" };
  response = await route.GET(request());
  assert.equal(response.status, 404, "a disputed payment is also denied and revoked");
  assert.equal(revokeCalls, 2);
  record = { ciphertext: "cipher", iv: "iv", authTag: "tag", checkoutSessionId: "cs_live_audhd123", paymentIntentId: "pi_audhd123" };
  verification = { verified: false, reason: "stripe_request_failed" };
  response = await route.GET(request());
  assert.equal(response.status, 503, "Stripe verification failure fails closed but remains retryable");
  assert.equal(response.headers.get("retry-after"), "2");
  assert.deepEqual(await response.json(), { restored: false, retryable: true });
  assert.equal(revokeCalls, 2);

  access = null;
  response = await route.GET(request());
  assert.equal(response.status, 404, "a manipulated access cookie is rejected");
  access = { attemptId: "11111111-1111-4111-8111-111111111111" };
  response = await route.GET(request("rv_audhd_checkout_access=signed; rv_audhd_checkout_attempt=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPR"));
  assert.equal(response.status, 404, "a different browser secret cannot restore another browser's answers");
  console.log("PASS: restore re-verifies Stripe, fails closed during outages, and permanently denies refunded or disputed payments despite old cookies.");
})().catch(error => { console.error(error); process.exitCode = 1; });
