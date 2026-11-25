/* eslint-disable @typescript-eslint/no-require-imports -- the route fixtures use the repository's TypeScript loader. */
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const path = require("node:path");
const test = require("node:test");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

test("Lite Autism verifies the 149 kr standard order and delivers the private PDF", () => testCheckout(14900));
test("Lite Autism verifies the 99 kr cross-sell order and delivers the private PDF", () => testCheckout(9900));

async function testCheckout(amount) {
  const origin = "https://book.example.test";
  const slug = "lite-autism-har-val-ingen-dott-av";
  const api = "/api/books/" + slug;
  const isOffer = amount === 9900;
  const price = isOffer ? "price_book99" : "price_book149";
  const checkoutPath = isOffer ? api + "?guest=1&offer=analysis" : api;
  const product = "prod_book149";
  const id = "cs_live_book" + amount;
  const email = "buyer@example.test";
  const file = "v1/" + slug + ".pdf";
  const attribution = { clientId: "391081.902932", sessionId: "1202123" };
  Object.assign(process.env, {
    AUTH_SITE_URL: origin, STRIPE_SECRET_KEY: "sk_live_fixture", OVERTHINKING_BOOK_STRIPE_TEST_MODE: "false",
    ACCOUNT_PORTAL_ENABLED: "true", ACCOUNT_DIRECT_PORTAL_ENABLED: "false", STRIPE_PAYMENT_PRODUCT_MAP_JSON: "{}",
    BOOK_ACCESS_TOKEN_SECRET: "fixture-crypto-secret-for-book-link-verification",
    RESEND_API_KEY: "fixture", AUDHD_RECOVERY_EMAIL_FROM: "Relationsvarning <book@example.test>",
    NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co", OVERTHINKING_BOOK_STORAGE_SECRET_KEY: "fixture",
    LITE_AUTISM_BOOK_PRICE_ID: "price_book149", LITE_AUTISM_BOOK_PRODUCT_ID: product, LITE_AUTISM_BOOK_CHECKOUT_ENABLED: "false",
    NEXT_PUBLIC_LITE_AUTISM_BOOK_OFFER_PRICE_ID: "price_book99",
  });
  delete process.env.LITE_AUTISM_BOOK_TAX_RATE_ID;
  const now = Math.floor(Date.now() / 1000);
  const session = {
    id, livemode: true, mode: "payment", status: "open", payment_status: "unpaid", payment_link: null,
    amount_total: amount, currency: "sek", created: now, expires_at: now + 1800,
    url: "https://checkout.stripe.com/c/pay/fixture",
  };
  const item = { price: { id: price, product, unit_amount: amount }, quantity: 1, amount_total: amount, currency: "sek" };
  const charge = { livemode: true, payment_intent: "pi_fixture", paid: true, captured: true,
    amount, currency: "sek", refunded: false, amount_refunded: 0, disputed: false };
  const previousSecret = "g".repeat(43);
  const previous = { ...session, id: "cs_live_prior149", amount_total: 14900, metadata: {
    rv_product: "lite_autism_book", rv_book_price: "price_book149", rv_guest_hash: createHash("sha256").update(previousSecret).digest("hex"),
  } };
  let user = null;
  let signed = 0;
  let availableSize = 12165871;
  let signatures;
  const stripe = {
    prices: { retrieve: async key => {
      assert.equal(key, price);
      return { id: key, product, livemode: true, active: true, type: "one_time", currency: "sek", unit_amount: amount, tax_behavior: "inclusive" };
    } },
    checkout: { sessions: {
      create: async (input, options) => {
        assert.deepEqual(input.line_items, [{ price, quantity: 1 }]);
        assert.equal(input.automatic_tax.enabled, true);
        assert.equal(input.success_url, origin + "/" + slug + "/tack");
        assert.equal(input.cancel_url, origin + (isOffer ? "/autism-test/test" : "/" + slug + "#kop"));
        assert.equal(input.adaptive_pricing?.enabled, isOffer ? false : undefined);
        assert.match(options.idempotencyKey, /^lite-autism-book-[a-f0-9]{64}$/);
        assert.deepEqual(signatures.readBookAttribution(input.metadata.rv_book_ga4), attribution);
        assert.ok(!JSON.stringify(input.metadata).includes(attribution.clientId));
        return Object.assign(session, { metadata: input.metadata });
      },
      retrieve: async key => { if (key === previous.id) return previous; assert.equal(key, id); return session; },
      expire: async key => { assert.equal(key, previous.id); return Object.assign(previous, { status: "expired" }); },
      update: async (key, update) => {
        assert.equal(key, id);
        session.metadata = { ...session.metadata, ...update.metadata };
        return session;
      },
      list: async function* () { yield session; },
      listLineItems: async () => ({ data: [item], has_more: false }),
    } },
    paymentIntents: { retrieve: async key => ({
      id: key, livemode: true, status: "succeeded", currency: "sek", amount_received: amount, latest_charge: charge,
    }) },
  };
  const signedUrl = "https://fixture.supabase.co/storage/v1/object/sign/overthinking-book-private/" + file + "?token=fixture";
  const load = createLoader({
    stripe: { default: class FixtureStripe { constructor() { return stripe; } } },
    "./authSession.server": { authenticatedUser: async () => user },
    "@supabase/supabase-js": { createClient: () => ({ storage: { from: bucket => {
      assert.equal(bucket, "overthinking-book-private");
      return {
        info: async key => {
          assert.equal(key, file);
          return { data: { size: availableSize, contentType: "application/pdf" } };
        },
        createSignedUrl: async (key, seconds, options) => {
          assert.equal(key, file);
          assert.equal(seconds, 180);
          assert.equal(options.download, slug + ".pdf");
          signed++;
          return { data: { signedUrl } };
        },
      };
    } } }) },
  });
  const library = path.resolve(__dirname, "../../../_lib");
  signatures = load(path.join(library, "liteAutismProof.server.ts"));
  const route = load(path.join(__dirname, "route.ts"));
  const download = load(path.join(__dirname, "download/route.ts"));
  const webhook = load(path.join(library, "stripeWebhook.server.ts"));
  const request = (target = api, method = "GET", headers = {}, body) =>
    new Request(origin + target, { method, headers: { origin, ...headers }, body });
  assert.equal((await route.POST(request(checkoutPath, "POST"))).status, 503);
  process.env.LITE_AUTISM_BOOK_CHECKOUT_ENABLED = "true";
  assert.equal((await route.POST(request(api, "POST", { origin: "https://other.example.test" }))).status, 403);
  if (isOffer) {
    delete process.env.NEXT_PUBLIC_LITE_AUTISM_BOOK_OFFER_PRICE_ID;
    assert.equal((await route.POST(request(checkoutPath, "POST"))).status, 503);
    process.env.NEXT_PUBLIC_LITE_AUTISM_BOOK_OFFER_PRICE_ID = price;
  }
  const requestCookies = isOffer ? { cookie: `rv_lite_autism_book_guest=${previousSecret}.${previous.id}` } : {};
  const checkout = await route.POST(request(checkoutPath, "POST", requestCookies, JSON.stringify(attribution)));
  assert.equal(checkout.status, 200);
  assert.equal((await checkout.json()).url, session.url);
  const cookie = checkout.headers.get("set-cookie").split(";")[0];
  assert.match(cookie, /^rv_lite_autism_book_guest=/);
  assert.equal(previous.status, isOffer ? "expired" : "open");
  const guestPath = api + "/download?guest=1";
  const guest = () => download.GET(request(guestPath, "GET", { cookie }));
  assert.equal((await download.GET(request(guestPath))).status, 401);
  assert.equal((await guest()).status, 403);
  assert.equal(signed, 0);

  Object.assign(session, { status: "complete", payment_status: "paid", payment_intent: "pi_fixture", customer_details: { email } });
  let booked;
  const result = await webhook.processStripeWebhookEvent(
    { id: "evt_fixture", created: now, type: "checkout.session.completed", data: { object: { id } } },
    { retrieveSession: async () => session, listLineItems: async () => ({ data: [item], has_more: false }),
      recordPayment: async payment => { booked = payment; return { duplicate: false }; } },
  );
  assert.equal(result.productKey, "lite_autism_book");
  assert.deepEqual(booked.bookAttribution, attribution);
  assert.equal(booked.amountTotalOre, amount);
  assert.equal(booked.currency, "sek");

  availableSize--;
  assert.equal((await guest()).status, 503);
  availableSize++;
  const eligible = await guest();
  assert.equal(eligible.status, 303);
  assert.equal(eligible.headers.get("Location"), signedUrl);
  user = { id: "buyer", email, email_confirmed_at: "2026-11-24" };
  assert.deepEqual(await (await route.GET(request())).json(), { state: "ready" });
  assert.deepEqual(await (await download.GET(request(api + "/download"))).json(), { url: signedUrl });
  user.email = "someone-else@example.test";
  assert.equal((await download.GET(request(api + "/download"))).status, 403);

  const token = signatures.issueBookEmailLink(id, now);
  assert.equal(signatures.verifyBookEmailLink(token, now + 31 * 86400), null);
  const [payload, signature] = token.split(".");
  const badToken = (payload[0] === "A" ? "B" : "A") + payload.slice(1) + "." + signature;
  assert.equal((await download.GET(request(api + "/download?email=" + badToken))).status, 403);
  assert.equal((await download.GET(request(api + "/download?email=" + token))).status, 303);
  charge.refunded = true;
  assert.equal((await download.GET(request(api + "/download?email=" + token))).status, 403);
  charge.refunded = false;
  item.price.product = "prod_other";
  assert.equal((await guest()).status, 403);
  item.price.product = product;
}

test("the existing GA4 queue sends the book's verified standard order once at 149 SEK", () => testGa4(149));
test("the existing GA4 queue sends the book's verified cross-sell order once at 99 SEK", () => testGa4(99));

async function testGa4(price) {
  const checkout = "cs_live_bookGa4";
  const originalFetch = global.fetch;
  process.env.DATABASE_URL = "postgresql://fixture/example";
  process.env.GA4_MEASUREMENT_PROTOCOL_API_SECRET = "analytics_fixture";
  let sent = false;
  let events;
  const load = createLoader({
    postgres: { default: () => async parts => {
      const sql = parts.join(" ");
      if (sql.includes("returning delivery.stripe_checkout_session_id")) return sent ? [] : [{
        stripe_checkout_session_id: checkout, transaction_id: checkout, ga4_client_id: "391081.902932",
        ga4_session_id: "1202123", paid_at: new Date(), product_key: "lite_autism_book", amount_total_ore: price * 100,
      }];
      if (sql.includes("set delivered_at = now()")) sent = true;
      return [];
    } },
  });
  global.fetch = async (url, input) => {
    assert.equal(new URL(url).hostname, "www.google-analytics.com");
    ({ events } = JSON.parse(input.body));
    return { ok: true };
  };
  try {
    const ga4 = load(path.resolve(__dirname, "../../../_lib/ga4PurchaseDelivery.server.ts"));
    assert.deepEqual(await ga4.deliverPendingGa4Purchase(checkout), { kind: "delivered" });
    assert.deepEqual(await ga4.deliverPendingGa4Purchase(checkout), { kind: "not_pending" });
    assert.deepEqual(events, [{
      name: "purchase", params: {
        transaction_id: checkout, value: price, currency: "SEK", session_id: 1202123, engagement_time_msec: 1,
        items: [{ item_id: "lite_autism_book", item_name: "Lite autism har väl ingen dött av", price, quantity: 1 }],
      },
    }]);
  } finally {
    global.fetch = originalFetch;
    delete global.ga4PurchaseDeliverySql;
  }
}
