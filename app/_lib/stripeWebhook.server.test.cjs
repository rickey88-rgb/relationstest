/* eslint-disable @typescript-eslint/no-require-imports -- executable webhook-processing regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON = JSON.stringify({ adhd_test: { priceIds: ["price_adhd_39"] } });
const webhook = createLoader()(path.join(__dirname, "stripeWebhook.server.ts"));

const session = { id: "cs_live_shadow123", status: "complete", payment_status: "paid", livemode: true, payment_intent: "pi_shadow123", payment_link: "plink_adhd", amount_total: 3900, currency: "sek" };
const event = { id: "evt_shadow123", type: "checkout.session.completed", created: 1760054400, data: { object: { id: session.id } } };
const lineItems = { data: [{ price: { id: "price_adhd_39", product: "prod_adhd", unit_amount: 3900 }, quantity: 1 }] };
const recorded = [];
const dependencies = {
  retrieveSession: async () => session,
  listLineItems: async () => lineItems,
  recordPayment: async payment => { recorded.push(payment); return { duplicate: false }; },
};

(async () => {
  let result = await webhook.processStripeWebhookEvent(event, dependencies);
  assert.deepEqual(result, { kind: "recorded", duplicate: false, productKey: "adhd_test", paid: true });
  assert.equal(recorded[0].paymentIntentId, "pi_shadow123");
  assert.equal(recorded[0].lineItems[0].priceId, "price_adhd_39");

  result = await webhook.processStripeWebhookEvent({ ...event, id: "evt_shadow_duplicate" }, { ...dependencies, recordPayment: async () => ({ duplicate: true }) });
  assert.equal(result.duplicate, true, "duplicate event acknowledgement is delegated to the transactional ledger");

  const unpaid = { ...session, status: "open", payment_status: "unpaid" };
  result = await webhook.processStripeWebhookEvent({ ...event, id: "evt_shadow_failed", type: "checkout.session.async_payment_failed" }, { ...dependencies, retrieveSession: async () => unpaid });
  assert.equal(result.paid, false, "failed or incomplete sessions are recorded but never classified as paid");

  // This mirrors the database upsert rule: a late non-paid event must never
  // downgrade a Checkout Session already recorded as paid.
  let storedPaymentStatus = null;
  const monotonicLedger = async payment => {
    storedPaymentStatus = storedPaymentStatus === "paid" ? "paid" : payment.paymentStatus;
    return { duplicate: false };
  };
  await webhook.processStripeWebhookEvent({ ...event, id: "evt_shadow_paid_first", type: "checkout.session.async_payment_succeeded" }, { ...dependencies, recordPayment: monotonicLedger });
  await webhook.processStripeWebhookEvent({ ...event, id: "evt_shadow_late_failure", type: "checkout.session.expired" }, { ...dependencies, retrieveSession: async () => unpaid, recordPayment: monotonicLedger });
  assert.equal(storedPaymentStatus, "paid", "a delayed unpaid event cannot overwrite a recorded paid status");

  result = await webhook.processStripeWebhookEvent({ ...event, type: "customer.created" }, dependencies);
  assert.deepEqual(result, { kind: "ignored" });
  console.log("PASS: webhook processing records verified Stripe session facts, handles duplicate delivery, and does not classify failed payments as paid.");
})().catch(error => { console.error(error); process.exitCode = 1; });
