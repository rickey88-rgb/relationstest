/* eslint-disable @typescript-eslint/no-require-imports -- executable signed-event revocation regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");
const revocation = createLoader({})(path.join(__dirname, "audhdCheckoutRevocation.server.ts"));

let calls = 0;
const revoke = async paymentIntent => { calls += 1; assert.equal(paymentIntent, "pi_audhd123"); return calls === 1; };
const event = (type, object, livemode = true) => ({ type, livemode, data: { object } });

(async () => {
  assert.deepEqual(await revocation.processAudhdCheckoutRevocationEvent(event("charge.refunded", { payment_intent: "pi_audhd123" }), revoke), { kind: "revocation_checked", revoked: true });
  assert.deepEqual(await revocation.processAudhdCheckoutRevocationEvent(event("charge.refunded", { payment_intent: "pi_audhd123" }), revoke), { kind: "revocation_checked", revoked: false }, "duplicate events are idempotent in the database");
  assert.deepEqual(await revocation.processAudhdCheckoutRevocationEvent(event("charge.dispute.created", { payment_intent: "pi_audhd123" }), revoke), { kind: "revocation_checked", revoked: false }, "out-of-order dispute events keep access revoked");
  assert.deepEqual(await revocation.processAudhdCheckoutRevocationEvent(event("charge.refunded", { payment_intent: "pi_audhd123" }, false), revoke), { kind: "ignored" }, "test events never affect live entitlements");
  assert.deepEqual(await revocation.processAudhdCheckoutRevocationEvent(event("charge.dispute.funds_withdrawn", { payment_intent: "pi_audhd123" }), revoke), { kind: "revocation_checked", revoked: false });
  assert.deepEqual(await revocation.processAudhdCheckoutRevocationEvent(event("charge.dispute.closed", { payment_intent: "pi_audhd123", status: "lost" }), revoke), { kind: "revocation_checked", revoked: false }, "a late lost-dispute event keeps access revoked");
  assert.deepEqual(await revocation.processAudhdCheckoutRevocationEvent(event("charge.dispute.closed", { payment_intent: "pi_audhd123", status: "won" }), revoke), { kind: "ignored" }, "a won dispute never silently reopens access");
  console.log("PASS: signed live refund and dispute events revoke AuDHD access idempotently; test, duplicate and closed-dispute events cannot grant access.");
})().catch(error => { console.error(error); process.exitCode = 1; });
