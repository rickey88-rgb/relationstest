/* eslint-disable @typescript-eslint/no-require-imports -- executable route regression. */
const assert = require("node:assert/strict");
const path = require("node:path");
const load = require("../../../autism-test/test/test-loader.cjs");

Object.assign(process.env, {
  STRIPE_SECRET_KEY: "sk_live_fixture",
  AUDHD_BOOK_ALLOWED_PRICE_IDS: "price_audhd149,price_audhd79",
  AUTISM_BOOK_ALLOWED_PRICE_IDS: "price_autism149,price_autism99",
  AUTISM_BOOK_PAYMENT_LINK_ID_149: "plink_autism149",
  AUTISM_BOOK_PAYMENT_LINK_ID_99: "plink_autism99",
  R2_ENDPOINT: "https://r2.example.test", R2_BUCKET_NAME: "private-books",
  R2_ACCESS_KEY_ID: "fixture", R2_SECRET_ACCESS_KEY: "fixture",
  AUDHD_BOOK_R2_KEY: "audhd.pdf", ADHD_DELUXE_BOOK_R2_KEY: "adhd.pdf", AUTISM_BOOK_R2_KEY: "autism.pdf",
});

const email = "buyer@example.test";
function purchase(id, price, amount, link, changes = {}) {
  return {
    session: {
      id, livemode: true, mode: "payment", status: "complete", payment_status: "paid", currency: "sek",
      customer_details: { email }, amount_total: amount, payment_intent: "pi_" + id, payment_link: link, ...changes,
    },
    line: { price: { id: price }, quantity: 1, currency: "sek", amount_total: amount },
    charge: {
      livemode: true, paid: true, captured: true, disputed: false, refunded: false, amount_refunded: 0,
      currency: "sek", amount, payment_intent: "pi_" + id,
    },
  };
}

const audhd = purchase("a", "price_audhd79", 7900, "plink_original_audhd");
const autism = purchase("b", "price_autism149", 14900, "plink_autism149");
const adhd = purchase("c", "price_1UO3F6AgF4ugWkEkRCM7L9yX", 9900, "plink_1UO3FGAgF4ugWkEkniqT0FGP");
const wrongEmail = purchase("d", "price_audhd149", 14900, null, { customer_details: { email: "other@example.test" } });
const testMode = purchase("e", "price_audhd149", 14900, null, { livemode: false });
const unpaid = purchase("f", "price_audhd149", 14900, null, { payment_status: "unpaid" });
const wrongLink = purchase("g", "price_autism99", 9900, "plink_unrelated");
const records = [wrongEmail, testMode, unpaid, wrongLink, audhd, autism, adhd];
let account = null;
const signed = [];
let searches = 0;

class StripeMock {
  checkout = { sessions: {
    list: async function* ({ customer_details, status }) {
      assert.equal(customer_details.email, email);
      assert.equal(status, "complete");
      searches++;
      // Include unrelated results to ensure the route independently verifies the email and product.
      for (const { session } of records) yield session;
    },
    listLineItems: async function (id) {
      assert.ok(!["d", "e", "f"].includes(id));
      return { data: [records.find(record => record.session.id === id).line], has_more: false };
    },
  } };
  paymentIntents = { retrieve: async (id) => {
    const record = records.find(record => record.session.payment_intent === id);
    return { id, livemode: true, status: "succeeded", currency: "sek", amount_received: record.charge.amount, latest_charge: record.charge };
  } };
}

const runtime = load({
  stripe: { default: StripeMock },
  "../../../_lib/overthinkingBook.server": { bookAccount: async () => account },
  "@aws-sdk/client-s3": {
    GetObjectCommand: class { constructor(input) { this.input = input; } },
    S3Client: class { destroy() {} },
  },
  "@aws-sdk/s3-request-presigner": {
    getSignedUrl: async (_client, command, opts) => {
      assert.equal(opts.expiresIn, 60);
      assert.equal(command.input.ResponseContentType, "application/pdf");
      assert.equal(command.input.ResponseCacheControl, "private, no-store");
      signed.push(command.input.Key);
      return "https://r2.example.test/private-books/" + command.input.Key + "?fixture=signed";
    },
  },
});
const { GET } = runtime(path.join(__dirname, "route.ts"));
const request = (query = "") => new Request("https://www.relationsvarning.se/api/books/library" + query, {
  headers: { Cookie: "rv_book_access=untrusted", "X-Email": email },
});

(async () => {
  assert.equal((await GET(request())).status, 401);
  assert.equal(searches, 0);
  account = { userId: "fixture", verifiedEmail: null };
  assert.deepEqual(await (await GET(request())).json(), { owned: [] });
  assert.equal(searches, 0);
  account.verifiedEmail = email;
  const list = await GET(request());
  assert.equal(list.headers.get("cache-control"), "private, no-store");
  assert.deepEqual((await list.json()).owned.sort(), ["adhd-deluxe", "audhd-bok", "autism-bok"]);
  for (const book of ["audhd-bok", "autism-bok", "adhd-deluxe"]) {
    assert.equal((await GET(request("?book=" + book))).status, 200);
  }
  assert.deepEqual(signed, ["audhd.pdf", "autism.pdf", "adhd.pdf"]);
  assert.equal((await GET(request("?book=unknown"))).status, 404);
  audhd.charge.amount_refunded = 1;
  autism.charge.disputed = true;
  adhd.charge.captured = false;
  assert.deepEqual(await (await GET(request())).json(), { owned: [] });
  for (const book of ["audhd-bok", "autism-bok", "adhd-deluxe"]) {
    assert.equal((await GET(request("?book=" + book))).status, 403);
  }
  assert.equal(signed.length, 3, "revoked purchases never produce a new file URL");
  console.log("PASS three historical e-books, safe guest-email lookup, private PDF links and revoked purchase denial");
})().catch(error => { console.error(error); process.exitCode = 1; });
