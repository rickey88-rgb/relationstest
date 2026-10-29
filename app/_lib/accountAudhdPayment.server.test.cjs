/* eslint-disable @typescript-eslint/no-require-imports -- strict account payment regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");
let session, items, intent, inspection, disputes;
class Stripe {
  checkout = { sessions: { retrieve: async () => session, listLineItems: async () => items } };
  paymentIntents = { retrieve: async () => intent };
  disputes = { list: async () => ({ data: disputes }) };
}
process.env.STRIPE_SECRET_KEY = "local-test-placeholder";
const verify = createLoader({ stripe: { default: Stripe }, "./audhdRecoveryPayment.server": { inspectAudhdCheckoutSession: async () => inspection } })(path.join(__dirname, "accountAudhdPayment.server.ts")).verifyAccountAudhdPayment;
function paid() {
  disputes = [];
  inspection = { verified: true, checkoutSessionId: "cs_live_account", paymentIntentId: "pi_account", priceId: "price_historical" };
  session = { livemode: true, mode: "payment", status: "complete", payment_status: "paid", payment_intent: "pi_account", amount_total: 7900, currency: "sek" };
  items = { has_more: false, data: [{ price: { id: "price_historical" }, quantity: 1 }] };
  intent = { status: "succeeded", amount_received: 7900, latest_charge: { paid: true, captured: true, amount_refunded: 0, refunded: false, disputed: false, created: 1790856000 } };
}
(async () => {
  paid(); assert.equal((await verify("cs_live_account")).kind, "verified");
  paid(); intent.latest_charge = null; assert.equal((await verify("cs_live_account")).kind, "denied");
  paid(); intent.latest_charge.captured = false; assert.equal((await verify("cs_live_account")).kind, "denied");
  paid(); intent.latest_charge.amount_refunded = 1; assert.equal((await verify("cs_live_account")).kind, "revoked");
  paid(); intent.latest_charge.disputed = true; assert.equal((await verify("cs_live_account")).kind, "revoked");
  paid(); disputes = [{ status: "won" }]; assert.equal((await verify("cs_live_account")).kind, "revoked", "historical dispute cannot silently restore account access");
  paid(); items.has_more = true; assert.equal((await verify("cs_live_account")).kind, "denied");
  paid(); items.data.push(items.data[0]); assert.equal((await verify("cs_live_account")).kind, "denied");
  paid(); session.livemode = false; assert.equal((await verify("cs_live_account")).kind, "denied");
  paid(); session.payment_status = "unpaid"; assert.equal((await verify("cs_live_account")).kind, "denied");
  paid(); session.status = "open"; assert.equal((await verify("cs_live_account")).kind, "denied");
  paid(); items.data[0].price.id = "price_other_product"; assert.equal((await verify("cs_live_account")).kind, "denied");
  paid(); inspection = { verified: false, reason: "wrong_product" }; assert.equal((await verify("cs_live_account")).kind, "denied");
  paid(); inspection = { verified: false, reason: "payment_refunded" }; assert.equal((await verify("cs_live_account")).kind, "revoked");
  paid(); inspection = { verified: false, reason: "stripe_request_failed" }; assert.equal((await verify("cs_live_account")).kind, "unavailable");
  console.log("PASS: account adapter reuses recovery allowlists and rejects absent charges, refunds, disputes, test mode and ambiguous line items.");
})().catch(error => { console.error(error); process.exitCode = 1; });
