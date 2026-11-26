/* eslint-disable @typescript-eslint/no-require-imports -- synthetic Stripe and GA4 contract. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { npfCheckoutAnalyticsMetadata, relayNpfDirectPurchase, receiveNpfDirectPurchase } = require("../../autism-test/test/test-loader.cjs")()(path.join(__dirname, "npfPurchaseAnalytics.server.ts"));

(async () => {
  const signer = "synthetic-webhook-secret";
  const input = { clientId: "123.456", sessionId: "12345", answers: [4], score: 93 };
  assert.deepEqual(npfCheckoutAnalyticsMetadata("audhd_test", input), {});
  assert.deepEqual(npfCheckoutAnalyticsMetadata("adhd_test", null), {});
  for (const product of ["adhd_test", "autism_test"]) {
    const attribution = npfCheckoutAnalyticsMetadata(product, input);
    assert.deepEqual(Object.keys(attribution), ["rv_npf_product", "rv_npf_ga_client", "rv_npf_ga_session"]);
    const session = { id: "cs_live_synthetic", metadata: attribution, livemode: true, status: "complete", mode: "payment", payment_status: "paid", currency: "sek", amount_total: 7900 };
    const events = [];
    const deliver = async (url, options) => {
      assert.equal(new URL(url).hostname, "www.google-analytics.com");
      assert.doesNotMatch(options.body, /answers|score|cs_live_synthetic/);
      events.push(JSON.parse(options.body).events[0]);
      return { ok: true };
    };
    const relay = async (url, options) => {
      assert.equal(url, "https://www.relationsvarning.se/api/stripe/npf-ga4");
      assert.doesNotMatch(options.body, /answers|score|cs_live_synthetic|customer/);
      assert.equal(await receiveNpfDirectPurchase(new Request(url, { ...options, body: options.body.replace("7900", "3900") }), signer, "synthetic", deliver), false);
      assert.equal(await receiveNpfDirectPurchase(new Request(url, options), signer, "synthetic", deliver), true);
      return { ok: true };
    };
    await relayNpfDirectPurchase({ ...session, amount_total: 3900 }, signer, relay);
    await relayNpfDirectPurchase({ ...session, metadata: {}, payment_status: "unpaid" }, signer, relay);
    await relayNpfDirectPurchase({ ...session, livemode: false }, signer, relay);
    assert.equal(events.length, 0);
    await relayNpfDirectPurchase(session, signer, relay);
    await relayNpfDirectPurchase(session, signer, relay);
    assert.equal(events[0].name, "purchase");
    assert.equal(events[0].params.value, 79);
    assert.equal(events[0].params.items[0].price, 79);
    assert.equal(events[0].params.items[0].item_id, product);
    assert.equal(events[0].params.transaction_id, events[1].params.transaction_id);
  }
  console.log("PASS: consent attribution, signed paid-checkout contract, exact 79 SEK and stable transaction IDs; no answer data.");
})().catch(error => { console.error(error); process.exitCode = 1; });
