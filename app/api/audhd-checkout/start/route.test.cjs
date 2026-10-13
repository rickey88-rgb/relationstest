/* eslint-disable @typescript-eslint/no-require-imports -- executable server-route regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

process.env.NODE_ENV = "test";
const attemptId = "11111111-1111-4111-8111-111111111111";
let reservation = { kind: "reserved", checkoutReferenceId: "audhd_12345678901234567890123456789012" };
let reservationSequence = null;
let created = 0, bound = null, released = null, expiredReleased = null, shouldFailCreation = false;
const route = createLoader({
  "../../../_lib/audhdCheckoutAttempt.server": { AUDHD_CHECKOUT_ATTEMPT_COOKIE: "rv_audhd_checkout_attempt", hashAudhdCheckoutBrowserSecret: value => `hash:${value}` },
  "../../../_lib/audhdCheckoutAttemptsDb.server": {
    reserveAudhdCheckoutAttempt: async () => reservationSequence ? reservationSequence.shift() : reservation,
    bindAudhdCheckoutSession: async value => { bound = value; },
    releaseAudhdCheckoutReservation: async value => { released = value; },
    releaseExpiredAudhdCheckoutSession: async value => { expiredReleased = value; return true; },
  },
  "../../../_lib/audhdCheckoutStripe.server": {
    createAudhdStripeCheckout: async reference => { created += 1; if (shouldFailCreation) throw new Error("Stripe unavailable"); return { checkoutSessionId: "cs_live_audhd123", checkoutUrl: `https://checkout.stripe.com/${reference}` }; },
    existingAudhdStripeCheckout: async (sessionId, reference) => sessionId === "cs_live_existing" ? { kind: "open", checkoutSessionId: sessionId, checkoutUrl: `https://checkout.stripe.com/${reference}` } : sessionId === "cs_live_expired" ? { kind: "expired" } : { kind: "unavailable" },
  },
})(path.join(__dirname, "route.ts"));

function request(body, { origin = "http://localhost:3000", cookie = "rv_audhd_checkout_attempt=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ" } = {}) {
  const headers = { origin, "content-type": "application/json" };
  if (cookie) headers.cookie = cookie;
  return new NextRequest("http://localhost:3000/api/audhd-checkout/start", { method: "POST", headers, body: JSON.stringify(body) });
}

(async () => {
  let response = await route.POST(request({ attemptId }, { origin: "https://evil.example" }));
  assert.equal(response.status, 404);

  response = await route.POST(request({ attemptId: "not-a-uuid" }));
  assert.equal(response.status, 404);
  response = await route.POST(request({ attemptId }, { cookie: "" }));
  assert.equal(response.status, 404);

  reservation = { kind: "invalid" };
  response = await route.POST(request({ attemptId }));
  assert.equal(response.status, 404, "expired, forged, or another browser's attempt is indistinguishable");

  reservation = { kind: "in_progress" };
  response = await route.POST(request({ attemptId }));
  assert.equal(response.status, 409);

  reservation = { kind: "reserved", checkoutReferenceId: "audhd_12345678901234567890123456789012" };
  response = await route.POST(request({ attemptId }));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { checkoutUrl: "https://checkout.stripe.com/audhd_12345678901234567890123456789012" });
  assert.equal(created, 1);
  assert.deepEqual(bound, { attemptId, browserSecretHash: "hash:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ", checkoutReferenceId: "audhd_12345678901234567890123456789012", checkoutSessionId: "cs_live_audhd123" });

  shouldFailCreation = true;
  reservation = { kind: "reserved", checkoutReferenceId: "audhd_abcdefghijklmnopqrstuvwxzyABCDEF" };
  response = await route.POST(request({ attemptId }));
  assert.equal(response.status, 503);
  assert.deepEqual(released, { attemptId, browserSecretHash: "hash:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ", checkoutReferenceId: "audhd_abcdefghijklmnopqrstuvwxzyABCDEF" });
  shouldFailCreation = false;

  reservation = { kind: "existing", checkoutSessionId: "cs_live_existing", checkoutReferenceId: "audhd_12345678901234567890123456789012" };
  const createdBeforeExisting = created;
  response = await route.POST(request({ attemptId }));
  assert.equal(response.status, 200);
  assert.equal(created, createdBeforeExisting, "a repeated click reuses the original Session instead of creating another charge opportunity");
  assert.equal(response.headers.get("cache-control"), "no-store");

  reservation = { kind: "existing", checkoutSessionId: "cs_live_expired", checkoutReferenceId: "audhd_12345678901234567890123456789012" };
  reservationSequence = [reservation, { kind: "reserved", checkoutReferenceId: "audhd_renewed1234567890123456789012345" }];
  const createdBeforeExpiredRetry = created;
  response = await route.POST(request({ attemptId }));
  assert.equal(response.status, 201, "a Stripe-confirmed expired Session can be replaced without starting a new test");
  assert.equal(created, createdBeforeExpiredRetry + 1);
  assert.deepEqual(expiredReleased, { attemptId, browserSecretHash: "hash:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ", checkoutReferenceId: "audhd_12345678901234567890123456789012", checkoutSessionId: "cs_live_expired" });
  reservationSequence = null;
  console.log("PASS: AuDHD Checkout start rejects forged or expired attempts, serializes concurrent starts, and binds one live Session to the browser-owned draft.");
})().catch(error => { console.error(error); process.exitCode = 1; });
