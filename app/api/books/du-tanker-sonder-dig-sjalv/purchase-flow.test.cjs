/* eslint-disable @typescript-eslint/no-require-imports -- local Stripe/Storage fixtures plus real SQL and route handlers. */
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { PGlite } = require("@electric-sql/pglite");
const Stripe = require("stripe");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

const origin = "https://book-launch.example.test";
const buyer = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const other = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const priceId = "price_local149";
const sessionId = "cs_test_localbook123";
const intentId = "pi_localbook123";
const filename = "Du-tanker-sonder-dig-sjalv-Adrian-Falk.pdf";
const source = process.env.OVERTHINKING_BOOK_TEST_PDF;
const pdf = source ? readFileSync(source) : null;
Object.assign(process.env, {
  AUTH_SITE_URL: origin, DATABASE_URL: "postgres://local-only",
  ACCOUNT_PORTAL_ENABLED: "true", ACCOUNT_DIRECT_PORTAL_ENABLED: "false",
  NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co",
  OVERTHINKING_BOOK_STORAGE_SECRET_KEY: "local-only",
  OVERTHINKING_BOOK_STRIPE_TEST_MODE: "true", STRIPE_SECRET_KEY: "sk_test_fixture",
  OVERTHINKING_BOOK_CHECKOUT_ENABLED: "true", OVERTHINKING_BOOK_PRICE_ID: priceId,
  STRIPE_PAYMENT_PRODUCT_MAP_JSON: JSON.stringify({ adhd_deluxe: { priceIds: ["price_other"] } }),
});
let signedIn = null, priceAmount = 14900, creation = null, calls = 0, storageReads = 0, wrongObject = false;
const session = {
  id: sessionId, amount_total: 14900, currency: "sek", livemode: false, mode: "payment",
  status: "open", payment_status: "unpaid", payment_intent: null, payment_link: null,
  metadata: { rv_product: "overthinking_book" }, expires_at: Math.floor(Date.now() / 1000) + 3600,
  url: "https://checkout.stripe.com/c/pay/fixture",
};
const items = { has_more: false, data: [{ price: { id: priceId, product: "prod_book", unit_amount: 14900 }, quantity: 1, currency: "sek", amount_total: 14900 }] };
const charge = {
  livemode: false, payment_intent: intentId, paid: true, captured: true, amount: 14900, currency: "sek",
  refunded: false, amount_refunded: 0, disputed: false,
};
const stripe = {
  prices: { retrieve: async id => ({ id, type: "one_time", currency: "sek", unit_amount: priceAmount, livemode: false, active: true }) },
  checkout: { sessions: {
    create: async (payload, options) => { creation = payload; session.metadata = payload.metadata; calls++; assert.match(options.idempotencyKey, /^overthinking-book-[a-f0-9]{64}$/); return session; },
    retrieve: async id => { assert.equal(id, sessionId); return session; },
    listLineItems: async id => { assert.equal(id, sessionId); return items; },
  } },
  paymentIntents: { retrieve: async id => ({ id, livemode: false, status: "succeeded", currency: "sek", amount_received: 14900, latest_charge: charge }) },
};

(async () => {
  const pg = new PGlite();
  try {
    const root = path.join(__dirname, "../../../..");
    await pg.exec("create role anon; create role authenticated; create schema auth; create table auth.users (id uuid primary key); alter default privileges in schema public grant all on tables to anon, authenticated;");
    await pg.query("insert into auth.users values ($1::uuid),($2::uuid)", [buyer, other]);
    for (const name of ["202610100001_stripe_shadow_ledger.sql", "202611230001_overthinking_book_checkouts.sql"]) {
      await pg.exec(readFileSync(path.join(root, "supabase/migrations", name), "utf8"));
    }
    const db = connection => {
      const query = async (parts, ...values) => (await connection.query(parts.map((part, i) => (i ? "$" + i : "") + part).join(""), values)).rows;
      query.begin = callback => pg.transaction(tx => callback(db(tx)));
      return query;
    };
    const load = createLoader({
      stripe: { default: class StripeMock { constructor() { return stripe; } } },
      postgres: { default: () => db(pg) },
      "./authSession.server": { authenticatedUser: async () => signedIn },
      "./testAccounts/directAuth.server": { directIdentity: async header => header === "Bearer fixture" ? { userId: buyer } : null },
      "@supabase/supabase-js": { createClient: (url, key) => {
        assert.equal(url, "https://fixture.supabase.co");
        assert.equal(key, "local-only");
        return { storage: { from: bucket => {
          assert.equal(bucket, "overthinking-book-private");
          return { download: async key => {
            storageReads++;
            assert.equal(key, "v1/" + filename);
            const payload = wrongObject && pdf ? Buffer.alloc(pdf.length) : pdf;
            return { data: payload ? new Blob([payload]) : null };
          } };
        } } };
      } },
    });
    const route = load(path.join(__dirname, "route.ts"));
    const download = load(path.join(__dirname, "download/route.ts"));
    const store = load(path.join(root, "app/_lib/overthinkingBookStore.server.ts"));
    const ledger = load(path.join(root, "app/_lib/paymentsDb.server.ts"));
    const webhook = load(path.join(root, "app/_lib/stripeWebhook.server.ts"));
    const req = (method = "GET", headers = {}) => new Request(origin + "/api/books/du-tanker-sonder-dig-sjalv?session_id=" + sessionId, { method, headers: { origin, ...headers } });
    for (const role of ["anon", "authenticated"]) {
      const result = await pg.query("select has_table_privilege($1, 'public.overthinking_book_checkouts', 'SELECT, INSERT, UPDATE, DELETE') as access", [role]);
      assert.equal(result.rows[0].access, false);
    }
    assert.equal((await route.POST(req("POST", { origin: "https://other.example.test" }))).status, 403);
    assert.equal((await route.POST(req("POST"))).status, 401);
    assert.equal((await download.GET(req())).status, 401);
    signedIn = { id: buyer, email_confirmed_at: null };
    assert.equal((await route.POST(req("POST"))).status, 401);
    signedIn.email_confirmed_at = "2026-11-23";
    process.env.STRIPE_SECRET_KEY = "sk_live_fixture";
    assert.equal((await route.POST(req("POST"))).status, 503, "test mode rejects a live key");
    assert.equal(calls, 0);
    process.env.STRIPE_SECRET_KEY = "sk_test_fixture";
    priceAmount = 9900;
    assert.equal((await route.POST(req("POST"))).status, 503);
    assert.equal(calls, 0);
    priceAmount = 14900;
    assert.deepEqual(await (await route.POST(req("POST"))).json(), { kind: "checkout", url: session.url });
    assert.deepEqual(creation.line_items, [{ price: priceId, quantity: 1 }]);
    assert.equal(creation.success_url, origin + "/mina-sidor?bok=betalning#bibliotek");
    assert.equal(creation.cancel_url, origin + "/du-tanker-sonder-dig-sjalv#kop");
    assert.equal(creation.mode, "payment");
    assert.equal(creation.client_reference_id, undefined);
    assert.equal((await store.ownedBookCheckouts(other, false)).length, 0);
    const [binding] = await store.ownedBookCheckouts(buyer, false);
    await assert.rejects(store.recordBookCheckout(other, binding), /bound/);
    await route.POST(req("POST"));
    assert.equal(calls, 1, "an open Stripe session is reused");
    assert.deepEqual(await (await route.GET(req())).json(), { state: "pending" });
    assert.equal((await download.GET(req())).status, 403);
    assert.equal(storageReads, 0);
    session.status = "complete"; session.payment_status = "paid"; session.payment_intent = intentId;
    const event = { type: "checkout.session.completed", id: "evt_book_fixture", created: 1795453123, data: { object: { id: sessionId } } };
    const deps = { retrieveSession: stripe.checkout.sessions.retrieve, listLineItems: stripe.checkout.sessions.listLineItems, recordPayment: ledger.recordVerifiedStripePayment };
    const sdk = new Stripe("sk_test_fixture");
    const payload = JSON.stringify(event);
    const secret = "whsec_local_fixture";
    const signature = sdk.webhooks.generateTestHeaderString({ payload, secret });
    assert.throws(() => sdk.webhooks.constructEvent(payload + " ", signature, secret));
    const signedEvent = sdk.webhooks.constructEvent(payload, signature, secret);
    assert.equal((await webhook.processStripeWebhookEvent(signedEvent, deps)).productKey, "overthinking_book");
    assert.equal((await webhook.processStripeWebhookEvent(signedEvent, deps)).duplicate, true);
    await webhook.processStripeWebhookEvent({ ...signedEvent, id: "evt_book_async_fixture", type: "checkout.session.async_payment_succeeded" }, deps);
    assert.deepEqual((await pg.query("select product_key, amount_total_ore, currency, livemode from stripe_payments")).rows,
      [{ product_key: "overthinking_book", amount_total_ore: 14900, currency: "sek", livemode: false }]);
    session.payment_status = "unpaid";
    assert.equal((await download.GET(req())).status, 403, "a paid ledger entry does not grant access");
    session.payment_status = "paid";
    assert.deepEqual(await (await route.GET(req())).json(), { state: "ready" });
    assert.deepEqual(await (await route.POST(req("POST"))).json(), { kind: "owned" });
    items.data[0].quantity = 2;
    assert.equal((await download.GET(req())).status, 403);
    items.data[0].quantity = 1;
    items.data[0].price.id = "price_other";
    assert.equal((await download.GET(req())).status, 403);
    items.data[0].price.id = priceId;
    charge.amount_refunded = 1;
    assert.equal((await download.GET(req())).status, 403);
    charge.amount_refunded = 0; charge.disputed = true;
    assert.equal((await download.GET(req())).status, 403);
    charge.disputed = false;
    signedIn.id = other;
    assert.equal((await download.GET(req())).status, 403);
    assert.equal(storageReads, 0);
    signedIn = null;
    assert.equal((await download.GET(req())).status, 401);
    signedIn = { id: buyer, email_confirmed_at: "2026-11-23" };
    assert.deepEqual(await (await route.GET(req())).json(), { state: "ready" });
    if (pdf) {
      const reopened = await download.GET(req());
      assert.equal(reopened.status, 200);
      assert.deepEqual(Buffer.from(await reopened.arrayBuffer()), pdf);
    }
    process.env.OVERTHINKING_BOOK_CHECKOUT_ENABLED = "false";
    assert.equal((await route.POST(req("POST"))).status, 503);
    assert.deepEqual(await (await route.GET(req())).json(), { state: "ready" });
    wrongObject = true;
    assert.equal((await download.GET(req())).status, 503);
    wrongObject = false;
    if (pdf) {
      process.env.ACCOUNT_DIRECT_PORTAL_ENABLED = "true";
      process.env.NEXT_PUBLIC_DIRECT_TEST_ACCOUNTS_ENABLED = "true";
      assert.equal((await download.GET(req())).status, 401);
      assert.deepEqual(await (await route.GET(req("GET", { authorization: "Bearer fixture" }))).json(), { state: "ready" });
      const delivered = await download.GET(req("GET", { authorization: "Bearer fixture" }));
      assert.equal(delivered.status, 200);
      assert.equal(delivered.headers.get("content-type"), "application/pdf");
      assert.equal(delivered.headers.get("cache-control"), "private, no-store");
      assert.equal(delivered.headers.get("content-disposition"), `attachment; filename="${filename}"`);
      assert.deepEqual(Buffer.from(await delivered.arrayBuffer()), pdf);
    }

    process.env.OVERTHINKING_BOOK_CHECKOUT_ENABLED = "true";
    session.status = "open"; session.payment_status = "unpaid"; session.payment_intent = null;
    const guestReq = (url, method = "GET", cookie = "") =>
      new Request(origin + "/api/books/du-tanker-sonder-dig-sjalv" + url, { method, headers: { origin, cookie } });
    const startsAsGuest = await route.POST(guestReq("?guest=1", "POST"));
    assert.equal(startsAsGuest.status, 200);
    assert.deepEqual(await startsAsGuest.json(), { kind: "checkout", url: session.url });
    assert.equal(creation.success_url, origin + "/du-tanker-sonder-dig-sjalv/tack");
    const cookieHeader = startsAsGuest.headers.get("set-cookie");
    assert.match(cookieHeader, /HttpOnly/i);
    assert.match(cookieHeader, /SameSite=lax/i);
    const guestCookie = cookieHeader.split(";")[0];
    const guestUrl = "/download?guest=1";
    assert.equal((await download.GET(guestReq(guestUrl))).status, 401);
    assert.equal((await download.GET(guestReq(guestUrl, "GET", guestCookie))).status, 403);
    const created = calls;
    assert.equal((await route.POST(guestReq("?guest=1", "POST", guestCookie))).status, 200);
    assert.equal(calls, created);
    session.status = "complete"; session.payment_status = "paid"; session.payment_intent = intentId;
    const copiedId = "rv_overthinking_book_guest=" + "B".repeat(43) + "." + sessionId;
    assert.equal((await download.GET(guestReq(guestUrl, "GET", copiedId))).status, 403);
    assert.deepEqual(await (await route.POST(guestReq("?guest=1", "POST", guestCookie))).json(), { kind: "guest_return" });
    process.env.OVERTHINKING_BOOK_CHECKOUT_ENABLED = "false";
    if (pdf) {
      const guestPdf = await download.GET(guestReq(guestUrl, "GET", guestCookie));
      assert.equal(guestPdf.status, 200);
      assert.deepEqual(Buffer.from(await guestPdf.arrayBuffer()), pdf);
    }
    charge.refunded = true;
    assert.equal((await download.GET(guestReq(guestUrl, "GET", guestCookie))).status, 403);
    console.log(`PASS: account and guest 149 SEK checkout, signed webhook, buyer-only reopening, refund/dispute denial and private storage${pdf ? " with the exact release PDF" : ""}.`);
  } finally { await pg.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
