/* eslint-disable @typescript-eslint/no-require-imports -- the route fixtures use the repository's TypeScript loader. */
const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

test("Lite Autism binds the exact sale, serves the private edition and records opt-in attribution", async () => {
  const origin = "https://book.example.test";
  const slug = "lite-autism-har-val-ingen-dott-av";
  const api = "/api/books/" + slug;
  const price = "price_book149";
  const product = "prod_book149";
  const id = "cs_live_book149";
  const email = "buyer@example.test";
  const file = "v1/" + slug + ".pdf";
  const attribution = { clientId: "391081.902932", sessionId: "1202123" };
  Object.assign(process.env, {
    AUTH_SITE_URL: origin, STRIPE_SECRET_KEY: "sk_live_fixture", OVERTHINKING_BOOK_STRIPE_TEST_MODE: "false",
    ACCOUNT_PORTAL_ENABLED: "true", ACCOUNT_DIRECT_PORTAL_ENABLED: "false", STRIPE_PAYMENT_PRODUCT_MAP_JSON: "{}",
    BOOK_ACCESS_TOKEN_SECRET: "fixture-crypto-secret-for-book-link-verification",
    RESEND_API_KEY: "fixture", AUDHD_RECOVERY_EMAIL_FROM: "Relationsvarning <book@example.test>",
    NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co", OVERTHINKING_BOOK_STORAGE_SECRET_KEY: "fixture",
    LITE_AUTISM_BOOK_PRICE_ID: price, LITE_AUTISM_BOOK_PRODUCT_ID: product, LITE_AUTISM_BOOK_CHECKOUT_ENABLED: "false",
  });
  delete process.env.LITE_AUTISM_BOOK_TAX_RATE_ID;
  const now = Math.floor(Date.now() / 1000);
  const session = {
    id, livemode: true, mode: "payment", status: "open", payment_status: "unpaid", payment_link: null,
    amount_total: 14900, currency: "sek", created: now, expires_at: now + 1800,
    url: "https://checkout.stripe.com/c/pay/fixture",
  };
  const item = { price: { id: price, product, unit_amount: 14900 }, quantity: 1, amount_total: 14900, currency: "sek" };
  const charge = { livemode: true, payment_intent: "pi_fixture", paid: true, captured: true,
    amount: 14900, currency: "sek", refunded: false, amount_refunded: 0, disputed: false };
  let user = null;
  let signed = 0;
  let availableSize = 12165871;
  let signatures;
  const stripe = {
    prices: { retrieve: async key => {
      assert.equal(key, price);
      return { id: key, product, livemode: true, active: true, type: "one_time", currency: "sek", unit_amount: 14900, tax_behavior: "inclusive" };
    } },
    checkout: { sessions: {
      create: async (input, options) => {
        assert.deepEqual(input.line_items, [{ price, quantity: 1 }]);
        assert.equal(input.automatic_tax.enabled, true);
        assert.equal(input.success_url, origin + "/" + slug + "/tack");
        assert.match(options.idempotencyKey, /^lite-autism-book-[a-f0-9]{64}$/);
        assert.deepEqual(signatures.readBookAttribution(input.metadata.rv_book_ga4), attribution);
        assert.ok(!JSON.stringify(input.metadata).includes(attribution.clientId));
        return Object.assign(session, { metadata: input.metadata });
      },
      retrieve: async key => { assert.equal(key, id); return session; },
      update: async (key, update) => {
        assert.equal(key, id);
        session.metadata = { ...session.metadata, ...update.metadata };
        return session;
      },
      list: async function* () { yield session; },
      listLineItems: async () => ({ data: [item], has_more: false }),
    } },
    paymentIntents: { retrieve: async key => ({
      id: key, livemode: true, status: "succeeded", currency: "sek", amount_received: 14900, latest_charge: charge,
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
  const mail = load(path.join(library, "liteAutismDelivery.server.ts"));
  const request = (target = api, method = "GET", headers = {}, body) =>
    new Request(origin + target, { method, headers: { origin, ...headers }, body });
  assert.equal((await route.POST(request(api, "POST"))).status, 503);
  process.env.LITE_AUTISM_BOOK_CHECKOUT_ENABLED = "true";
  assert.equal((await route.POST(request(api, "POST", { origin: "https://other.example.test" }))).status, 403);
  const checkout = await route.POST(request(api, "POST", {}, JSON.stringify(attribution)));
  assert.equal(checkout.status, 200);
  assert.equal((await checkout.json()).url, session.url);
  const cookie = checkout.headers.get("set-cookie").split(";")[0];
  assert.match(cookie, /^rv_lite_autism_book_guest=/);
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
  assert.equal(booked.amountTotalOre, 14900);
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

  const originalFetch = global.fetch;
  let messages = 0;
  global.fetch = async (url, request) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(request.headers["Idempotency-Key"], "lite-autism-book/" + id);
    const message = JSON.parse(request.body);
    assert.deepEqual(message.to, [email]);
    assert.match(message.subject, /Lite autism har väl ingen dött av/);
    assert.ok(message.text.includes(origin + api + "/download?email=" + token));
    messages++;
    return { ok: true };
  };
  try {
    await mail.deliverLiteAutismEmail(stripe, id);
    await mail.deliverLiteAutismEmail(stripe, id);
    assert.equal(messages, 1);
    assert.equal(session.metadata.rv_book_ga4, "");
  } finally {
    global.fetch = originalFetch;
  }
});

test("the existing GA4 queue sends the book's verified order once at 149 SEK", async () => {
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
        ga4_session_id: "1202123", paid_at: new Date(), product_key: "lite_autism_book",
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
        transaction_id: checkout, value: 149, currency: "SEK", session_id: 1202123, engagement_time_msec: 1,
        items: [{ item_id: "lite_autism_book", item_name: "Lite autism har väl ingen dött av", price: 149, quantity: 1 }],
      },
    }]);
  } finally {
    global.fetch = originalFetch;
  }
});
