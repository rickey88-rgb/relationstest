/* eslint-disable @typescript-eslint/no-require-imports -- exercises the actual routes using Stripe and Storage fixtures. */
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

test("Steinler guest checkout and library isolate payment, buyer and the approved PDF", async () => {
  const origin = "https://book-launch.example.test";
  const api = "/api/books/nar-du-borjar-tvivla-pa-dig-sjalv";
  const price = "price_steinler149";
  const id = "cs_test_steinler149";
  const email = "buyer@example.test";
  const file = "Nar-du-borjar-tvivla-pa-dig-sjalv-My-Steinler.pdf";
  const pdf = process.env.STEINLER_BOOK_TEST_PDF ? readFileSync(process.env.STEINLER_BOOK_TEST_PDF) : null;
  Object.assign(process.env, {
    AUTH_SITE_URL: origin, STRIPE_SECRET_KEY: "sk_test_fixture", OVERTHINKING_BOOK_STRIPE_TEST_MODE: "true",
    ACCOUNT_PORTAL_ENABLED: "true", ACCOUNT_DIRECT_PORTAL_ENABLED: "false",
    NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co", OVERTHINKING_BOOK_STORAGE_SECRET_KEY: "fixture",
    STEINLER_BOOK_PRICE_ID: price, STEINLER_BOOK_CHECKOUT_ENABLED: "false",
    OVERTHINKING_BOOK_PRICE_ID: "price_adrian149", STRIPE_PAYMENT_PRODUCT_MAP_JSON: "{}",
  });
  let user = null;
  let reads = 0;
  let corrupt = false;
  const session = {
    id, livemode: false, mode: "payment", status: "open", payment_status: "unpaid",
    payment_link: null, amount_total: 14900, currency: "sek", expires_at: Date.now() / 1000 + 1800,
    url: "https://checkout.stripe.com/c/pay/fixture",
  };
  const item = { price: { id: price }, quantity: 1, currency: "sek", amount_total: 14900 };
  const charge = {
    livemode: false, payment_intent: "pi_fixture", paid: true, captured: true, amount: 14900,
    currency: "sek", refunded: false, amount_refunded: 0, disputed: false,
  };
  const stripe = {
    prices: { retrieve: async id => {
      assert.equal(id, price);
      return { id, livemode: false, active: true, type: "one_time", currency: "sek", unit_amount: 14900 };
    } },
    checkout: { sessions: {
      create: async (request, options) => {
        assert.deepEqual(request.line_items, [{ price, quantity: 1 }]);
        assert.equal(request.metadata.rv_product, "steinler_book");
        assert.equal(request.success_url, origin + "/nar-du-borjar-tvivla-pa-dig-sjalv/tack");
        assert.match(options.idempotencyKey, /^steinler-book-[a-f0-9]{64}$/);
        return Object.assign(session, { metadata: request.metadata });
      },
      retrieve: async key => { assert.equal(key, id); return session; },
      list: async function* ({ customer_details: details }) { assert.ok(details.email); yield session; },
      listLineItems: async () => ({ data: [item], has_more: false }),
    } },
    paymentIntents: { retrieve: async id => ({
      id, livemode: false, status: "succeeded", currency: "sek", amount_received: 14900, latest_charge: charge,
    }) },
  };
  const load = createLoader({
    stripe: { default: class FixtureStripe { constructor() { return stripe; } } },
    "./authSession.server": { authenticatedUser: async () => user },
    "@supabase/supabase-js": { createClient: () => ({ storage: { from: bucket => {
      assert.equal(bucket, "overthinking-book-private");
      return { download: async key => {
        assert.equal(key, "v1/" + file);
        reads++;
        return { data: pdf ? new Blob([corrupt ? Buffer.alloc(pdf.length) : pdf]) : null };
      } };
    } } }) },
  });
  const route = load(path.join(__dirname, "route.ts"));
  const download = load(path.join(__dirname, "download/route.ts"));
  const request = (target = api, method = "GET", headers = {}) =>
    new Request(origin + target, { method, headers: { origin, ...headers } });
  assert.equal((await route.POST(request(api, "POST"))).status, 503);
  process.env.STEINLER_BOOK_CHECKOUT_ENABLED = "true";
  assert.equal((await route.POST(request(api, "POST", { origin: "https://foreign.example.test" }))).status, 403);
  const checkout = await route.POST(request(api, "POST"));
  assert.equal(checkout.status, 200);
  assert.equal((await checkout.json()).url, session.url);
  const cookie = checkout.headers.get("set-cookie").split(";")[0];
  assert.match(cookie, /^rv_steinler_book_guest=/);
  assert.equal((await download.GET(request(api + "/download?guest=1"))).status, 401);
  const guestDownload = () => download.GET(request(api + "/download?guest=1", "GET", { cookie }));
  assert.equal((await guestDownload()).status, 403);
  Object.assign(session, { status: "complete", payment_status: "paid", payment_intent: "pi_fixture", customer_details: { email } });
  user = { id: "buyer", email, email_confirmed_at: null };
  assert.equal((await route.GET(request())).status, 401);
  user.email_confirmed_at = "2026-11-24";
  assert.deepEqual(await (await route.GET(request())).json(), { state: "ready" });
  user.email = "someone-else@example.test";
  assert.deepEqual(await (await route.GET(request())).json(), { state: "none" });
  assert.equal((await download.GET(request(api + "/download"))).status, 403);
  charge.disputed = true;
  assert.equal((await guestDownload()).status, 403);
  charge.disputed = false;
  charge.amount_refunded = 1;
  assert.equal((await guestDownload()).status, 403);
  charge.amount_refunded = 0;
  item.price.id = "price_adrian149";
  assert.equal((await guestDownload()).status, 403);
  item.price.id = price;
  assert.equal(reads, 0);
  if (pdf) {
    corrupt = true;
    assert.equal((await guestDownload()).status, 503);
    corrupt = false;
    const guest = await guestDownload();
    assert.equal(guest.status, 200);
    assert.equal(guest.headers.get("Content-Disposition"), 'attachment; filename="' + file + '"');
    assert.deepEqual(Buffer.from(await guest.arrayBuffer()), pdf);
    user.email = email;
    const library = await download.GET(request(api + "/download"));
    assert.equal(library.status, 200);
    assert.deepEqual(Buffer.from(await library.arrayBuffer()), pdf);
  }
});
