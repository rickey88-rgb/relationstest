/* eslint-disable @typescript-eslint/no-require-imports -- synthetic SDK boundary tests; no network or customer data. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { products: npf } = require("../../../deploy/pricing79.json");
const load = require("../../autism-test/test/test-loader.cjs")({ "../paymentProductCatalog.server": { configuredPriceIdsForProduct: product => ["price_synthetic", npf[product]?.priceId].filter(Boolean) } });
const { paymentConfig, verifyPayment } = load(path.join(__dirname, "payment.server.ts"));
process.env.TEST_ACCOUNTS_ADHD_PRICE_ID = "price_synthetic";
const binding = { id: "11111111-1111-4111-8111-111111111111", product: "adhd_test", session_id: "cs_synthetic", price_id: "price_synthetic", live_mode: true };
let session, items, intent, disputes;
const stripe = { checkout: { sessions: { retrieve: async () => session, listLineItems: async () => items } },
  paymentIntents: { retrieve: async () => intent }, disputes: { list: async () => ({ data: disputes }) } };
function reset(priceId = binding.price_id, amount = 3900) {
  session = { id: binding.session_id, client_reference_id: `ta:${binding.id}`, livemode: true, mode: "payment", status: "complete", payment_status: "paid", amount_total: amount, currency: "sek", payment_intent: "pi_synthetic" };
  items = { has_more: false, data: [{ quantity: 1, price: { id: priceId }, amount_total: amount }] };
  intent = { id: "pi_synthetic", livemode: true, status: "succeeded", currency: "sek", amount, amount_received: amount,
    latest_charge: { payment_intent: "pi_synthetic", livemode: true, paid: true, captured: true, amount, currency: "sek", refunded: false, amount_refunded: 0, disputed: false, created: 1792800000 } };
  disputes = [];
}
(async () => {
  reset(); assert.equal((await verifyPayment(binding, stripe)).intentId, "pi_synthetic");
  assert.throws(() => paymentConfig("adhd_test"), /allowlisted/);
  for (const [product, { priceId }] of Object.entries(npf)) {
    process.env["TEST_ACCOUNTS_" + product.replace("_test", "").toUpperCase() + "_PRICE_ID"] = priceId;
    assert.equal(paymentConfig(product).price, priceId);
    const purchase = { ...binding, product, price_id: priceId };
    reset(priceId, 7900);
    assert.equal((await verifyPayment(purchase, stripe)).intentId, "pi_synthetic");
    reset(priceId, 3900);
    await assert.rejects(verifyPayment(purchase, stripe));
    reset();
    assert.equal((await verifyPayment({ ...binding, product }, stripe)).intentId, "pi_synthetic");
  }
  reset();
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
  console.log("PASS: 79 SEK purchases and original 39 SEK access, including amount, identity, refunds, disputes and provider outage.");
})().catch(error => { console.error(error); process.exitCode = 1; });
