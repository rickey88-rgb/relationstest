/* eslint-disable @typescript-eslint/no-require-imports -- executable server-route regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

process.env.AUDHD_RECOVERY_TOKEN_SECRET = "test-recovery-secret-that-is-longer-than-thirty-two-characters";
process.env.AUDHD_RECOVERY_ISSUER_SECRET = "test-issuer-secret-that-is-longer-than-thirty-two-characters";
let grantInput = null;
let failureReason = "wrong_product";
const route = createLoader({
  "../../../_lib/audhdRecovery.server": { issueAudhdRecoveryToken: () => "opaque-support-token", hashAudhdRecoveryToken: value => `hash:${value}` },
  "../../../_lib/audhdRecoveryDb.server": { createAudhdRecoveryGrant: async input => { grantInput = input; return { id: "11111111-1111-4111-8111-111111111111" }; } },
  "../../../_lib/audhdRecoveryPayment.server": { inspectAudhdCheckoutSession: async id => id === "cs_live_paid" ? { verified: true, checkoutSessionId: id, paymentIntentId: "pi_paid", priceId: "price_audhd" } : { verified: false, reason: failureReason } },
})(path.join(__dirname, "route.ts"));

function request(authorization, body) {
  return new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/issue", {
    method: "POST",
    headers: authorization ? { authorization, "content-type": "application/json" } : undefined,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

(async () => {
  let response = await route.POST(request());
  assert.equal(response.status, 404);
  assert.equal(await response.json().then(body => body.error), "Not found.");

  response = await route.POST(request("Bearer wrong-admin-secret"));
  assert.equal(response.status, 404);

  const logs = [];
  const originalError = console.error;
  console.error = value => logs.push(value);
  try {
    for (const reason of ["wrong_product", "stripe_request_failed", "session_not_paid", "invalid_session_id", "price_not_configured", "payment_not_captured", "payment_refunded", "payment_disputed", "sensitive-unexpected-value"]) {
      failureReason = reason;
      response = await route.POST(request(`Bearer ${process.env.AUDHD_RECOVERY_ISSUER_SECRET}`, { checkoutSessionId: "cs_live_wrong_product" }));
      assert.equal(response.status, 422);
      assert.deepEqual(await response.json(), { error: "Payment could not be verified." });
      assert.deepEqual(JSON.parse(logs.pop()), { event: "audhd_recovery_issue_failed", reason: reason === "sensitive-unexpected-value" ? "unexpected" : reason });
    }
  } finally {
    console.error = originalError;
  }
  assert.equal(grantInput, null, "failed verification never creates a grant");

  response = await route.POST(request(`Bearer ${process.env.AUDHD_RECOVERY_ISSUER_SECRET}`, { checkoutSessionId: "cs_live_paid" }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  const body = await response.json();
  assert.deepEqual(Object.keys(body), ["recoveryUrl"]);
  const recoveryUrl = new URL(body.recoveryUrl);
  assert.equal(recoveryUrl.origin, "https://www.relationsvarning.se");
  assert.equal(recoveryUrl.pathname, "/api/audhd-recovery/redeem");
  assert.equal(recoveryUrl.searchParams.get("token"), "opaque-support-token");
  assert.deepEqual(grantInput, { tokenHash: "hash:opaque-support-token", checkoutSessionId: "cs_live_paid", paymentIntentId: "pi_paid", priceId: "price_audhd" });

  const configuredIssuerSecret = process.env.AUDHD_RECOVERY_ISSUER_SECRET;
  delete process.env.AUDHD_RECOVERY_ISSUER_SECRET;
  response = await route.POST(request(`Bearer ${configuredIssuerSecret}`));
  assert.equal(response.status, 404);
  process.env.AUDHD_RECOVERY_ISSUER_SECRET = configuredIssuerSecret;

  console.log("PASS: AuDHD recovery issuance requires a server-side admin bearer secret, verifies the exact paid AuDHD session, and returns only an opaque production-origin recovery URL.");
})().catch(error => { console.error(error); process.exitCode = 1; });
