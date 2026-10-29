/* eslint-disable @typescript-eslint/no-require-imports -- synthetic SDK boundary tests; no network or customer data. */
const assert = require("node:assert/strict");
const path = require("node:path");
const load = require("../../autism-test/test/test-loader.cjs")({ "../paymentProductCatalog.server": { configuredPriceIdsForProduct: () => ["price_synthetic"] } });
const { verifyPayment } = load(path.join(__dirname, "payment.server.ts"));
process.env.TEST_ACCOUNTS_ADHD_PRICE_ID = "price_synthetic";
const binding = { id: "11111111-1111-4111-8111-111111111111", product: "adhd_test", session_id: "cs_synthetic", price_id: "price_synthetic", live_mode: true };
let session, items, intent, disputes;
const stripe = { checkout: { sessions: { retrieve: async () => session, listLineItems: async () => items } },
  paymentIntents: { retrieve: async () => intent }, disputes: { list: async () => ({ data: disputes }) } };
function reset() {
  session = { id: binding.session_id, client_reference_id: `ta:${binding.id}`, livemode: true, mode: "payment", status: "complete", payment_status: "paid", amount_total: 3900, currency: "sek", payment_intent: "pi_synthetic" };
  items = { has_more: false, data: [{ quantity: 1, price: { id: binding.price_id }, amount_total: 3900 }] };
  intent = { id: "pi_synthetic", livemode: true, status: "succeeded", currency: "sek", amount: 3900, amount_received: 3900,
    latest_charge: { payment_intent: "pi_synthetic", livemode: true, paid: true, captured: true, amount: 3900, currency: "sek", refunded: false, amount_refunded: 0, disputed: false, created: 1792800000 } };
  disputes = [];
}
(async () => {
  reset(); assert.equal((await verifyPayment(binding, stripe)).intentId, "pi_synthetic");
  delete process.env.TEST_ACCOUNTS_ADHD_PRICE_ID;
  assert.equal((await verifyPayment(binding, stripe)).intentId, "pi_synthetic", "historical reads survive switching off/changing the current checkout price");
  const mutations = [
    () => session.client_reference_id = "ta:another-attempt", () => session.payment_status = "unpaid",
    () => session.status = "open", () => session.mode = "subscription", () => session.livemode = false,
    () => session.amount_total = 1, () => session.currency = "usd", () => session.id = "cs_another",
    () => session.payment_intent = null, () => items.data[0].price.id = "price_wrong_product",
    () => items.data[0].quantity = 2, () => items.has_more = true, () => items.data.push(items.data[0]),
    () => items.data[0].amount_total = 1, () => intent.status = "processing", () => intent.amount_received = 1,
    () => intent.currency = "usd", () => intent.livemode = false, () => intent.latest_charge = null,
    () => intent.latest_charge.captured = false, () => intent.latest_charge.paid = false,
    () => intent.latest_charge.refunded = true, () => intent.latest_charge.amount_refunded = 1,
    () => intent.latest_charge.disputed = true, () => disputes = [{ status: "won" }],
    () => intent.id = "pi_other", () => intent.latest_charge.payment_intent = "pi_other",
  ];
  for (const mutate of mutations) { reset(); mutate(); await assert.rejects(verifyPayment(binding, stripe)); }
  reset(); await assert.rejects(verifyPayment({ ...binding, price_id: "price_unknown" }, stripe));
  await assert.rejects(verifyPayment(binding, { ...stripe, checkout: { sessions: { retrieve: async () => { throw new Error("offline"); } } } }));
  console.log(`PASS: ${mutations.length + 3} strict payment cases, including attempt binding, wrong product, refunds, historical disputes and outage.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
