/* eslint-disable @typescript-eslint/no-require-imports -- isolated Stripe regressions, no network. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");
process.env.STRIPE_SECRET_KEY = "local-mock";
process.env.AUTISM_BOOK_PAYMENT_LINK_ID_149 = "plink_standard";
process.env.AUTISM_BOOK_PAYMENT_LINK_ID_99 = "plink_analysis";
process.env.AUTISM_BOOK_ALLOWED_PRICE_IDS = "price_standard,price_analysis";
let session, items, intent, charge, fail;
class StripeMock {
  constructor() {
    const read = async (stage, value) => { if (fail === stage) throw Error("Stripe unavailable"); return value; };
    this.checkout = { sessions: { retrieve: () => read("session", session), listLineItems: () => read("items", items) } };
    this.paymentIntents = { retrieve: () => read("intent", intent) };
    this.charges = { retrieve: () => read("charge", charge) };
  }
}
const products = createLoader({ stripe: { default: StripeMock } })(path.join(__dirname, "bookProducts.server.ts"));
function reset(price = "price_standard", link = "plink_standard") {
  fail = null;
  session = { status: "complete", payment_status: "paid", mode: "payment", livemode: true, currency: "sek", payment_link: link, payment_intent: "pi_mock" };
  items = { data: [{ price: { id: price }, quantity: 1 }], has_more: false };
  charge = { paid: true, captured: true, refunded: false, amount_refunded: 0, disputed: false };
  intent = { status: "succeeded", latest_charge: charge };
}
const verify = () => products.verifyAutismBookCheckoutSession("cs_live_mock");
(async () => {
  let cases = 0;
  for (const [price, link] of [["price_standard", "plink_standard"], ["price_analysis", "plink_analysis"]]) { reset(price, link); assert.equal(await verify(), true); cases++; }
  for (const changes of [{ status: "open" }, { payment_status: "unpaid" }, { mode: "subscription" }, { livemode: false }, { currency: "usd" }, { payment_link: "plink_wrong" }, { payment_intent: null }]) { reset(); Object.assign(session, changes); assert.equal(await verify(), false, JSON.stringify(changes)); cases++; }
  for (const data of [[], [{ price: { id: "price_other_book" }, quantity: 1 }], [{ price: { id: "price_standard" }, quantity: 2 }], [{ price: { id: "price_standard" }, quantity: 0 }], [{ price: null, quantity: 1 }], [{ price: { id: "price_standard" }, quantity: 1 }, { price: { id: "price_analysis" }, quantity: 1 }]]) { reset(); items.data = data; assert.equal(await verify(), false); cases++; }
  reset(); items.has_more = true; assert.equal(await verify(), false); cases++;
  reset(); intent.status = "processing"; assert.equal(await verify(), false); cases++;
  for (const changes of [{ paid: false }, { captured: false }, { refunded: true }, { amount_refunded: 1 }, { disputed: true }]) { reset(); Object.assign(charge, changes); assert.equal(await verify(), false, JSON.stringify(changes)); cases++; }
  reset(); intent.latest_charge = null; assert.equal(await verify(), false); cases++;
  reset(); intent.latest_charge = "ch_mock"; assert.equal(await verify(), true); cases++;
  for (const stage of ["session", "items", "intent", "charge"]) { reset(); intent.latest_charge = "ch_mock"; fail = stage; assert.equal(await verify(), false); cases++; }
  for (const value of [undefined, "wrong", "price_standard,"]) { reset(); if (value === undefined) delete process.env.AUTISM_BOOK_ALLOWED_PRICE_IDS; else process.env.AUTISM_BOOK_ALLOWED_PRICE_IDS = value; assert.equal(await verify(), false); cases++; }
  assert.equal(await products.verifyAutismBookCheckoutSession("paid=true"), false); cases++;
  console.log(`PASS: ${cases} autism book price/payment/refund/configuration checks.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
