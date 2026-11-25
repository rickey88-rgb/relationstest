/* eslint-disable @typescript-eslint/no-require-imports -- local Stripe, storage and mail fixtures. */
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { PGlite } = require("@electric-sql/pglite");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

test("all books deliver once, and verify the entire package again at access time", async () => {
  const now = Math.floor(Date.now() / 1000);
  const origin = "https://books.example.test";
  const buyer = "buyer@example.test";
  Object.assign(process.env, {
    BOOK_DELIVERY_START_AT: String(now - 60),
    BOOK_ACCESS_TOKEN_SECRET: "fixture-for-personal-book-delivery-signing",
    STRIPE_SECRET_KEY: "sk_live_fixture",
    AUTH_SITE_URL: origin,
    DATABASE_URL: "postgres://local-only",
    RESEND_API_KEY: "local-only", AUDHD_RECOVERY_EMAIL_FROM: "books@example.test",
    ACCOUNT_PORTAL_ENABLED: "true", ACCOUNT_DIRECT_PORTAL_ENABLED: "false",
    NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co", OVERTHINKING_BOOK_STORAGE_SECRET_KEY: "fixture",
    R2_ENDPOINT: "https://r2.example.test", R2_BUCKET_NAME: "private",
    R2_ACCESS_KEY_ID: "fixture", R2_SECRET_ACCESS_KEY: "fixture",
    AUDHD_BOOK_R2_KEY: "audhd.pdf", AUTISM_BOOK_R2_KEY: "autism.pdf",
    AUTISM_BOOK_WORKSHEETS_R2_KEY: "autism-sheets.pdf", ADHD_DELUXE_BOOK_R2_KEY: "adhd.pdf",
    ADHD_DELUXE_WORKSHEETS_R2_KEY: "adhd-sheets.pdf", ADHD_DELUXE_WORKSHEETS_PRINT_R2_KEY: "adhd-print.pdf",
    AUTISM_BOOK_PAYMENT_LINK_ID_149: "plink_autism", AUTISM_BOOK_PAYMENT_LINK_ID_99: "plink_autismAnalysis",
    AUTISM_BOOK_ALLOWED_PRICE_IDS: "price_autism,price_autismAnalysis",
    AUDHD_BOOK_ALLOWED_PRICE_IDS: "price_audhd,price_audhdAnalysis",
    OVERTHINKING_BOOK_PRICE_ID: "price_overthinking", STEINLER_BOOK_PRICE_ID: "price_steinler",
    LITE_AUTISM_BOOK_PRICE_ID: "price_lite", LITE_AUTISM_BOOK_PRODUCT_ID: "prod_lite",
    NORWAY_BOOK_PRICE_ID: "price_norwegian", NORWAY_BOOK_OFFER_PRICE_ID: "price_norwegianOffer",
    NORWAY_BOOK_PRODUCT_ID: "prod_norwegian",
    STRIPE_PAYMENT_PRODUCT_MAP_JSON: "{}",
  });
  const offers = [
    ["audhd_bok", "audhd-bok", "price_audhd", "plink_audhd", 14900, 1],
    ["audhd_bok", "audhd-bok", "price_audhdAnalysis", "plink_audhdAnalysis", 7900, 1],
    ["autism_bok", "autism-bok", "price_autism", "plink_autism", 14900, 2],
    ["autism_bok", "autism-bok", "price_autismAnalysis", "plink_autismAnalysis", 9900, 2],
    ["adhd_deluxe", "adhd-deluxe", "price_1UO3C0AgF4ugWkEkklryPLKO", "plink_1UO3CpAgF4ugWkEkyWAfIbus", 14900, 3],
    ["adhd_deluxe", "adhd-deluxe", "price_1UO3F6AgF4ugWkEkRCM7L9yX", "plink_1UO3FGAgF4ugWkEkniqT0FGP", 9900, 3],
    ["overthinking_book", "du-tanker-sonder-dig-sjalv", "price_overthinking", null, 14900, 1],
    ["steinler_book", "nar-du-borjar-tvivla-pa-dig-sjalv", "price_steinler", null, 14900, 1],
    ["lite_autism_book", "lite-autism-har-val-ingen-dott-av", "price_lite", null, 14900, 1],
    ["hjernen_i_kryssild", "hjernen-i-kryssild", "price_norwegian", null, 24900, 1],
    ["hjernen_i_kryssild", "hjernen-i-kryssild", "price_norwegianOffer", null, 14900, 1],
  ];
  let checkoutReads = 0;
  const orders = new Map();
  const messages = new Map();
  const attempts = [];
  let user = null;
  let failAfterAccept = false;
  const stripe = {
    checkout: { sessions: {
      retrieve: async id => { checkoutReads++; return orders.get(id).session; },
      list: async function* () { for (const order of orders.values()) yield order.session; },
      listLineItems: async id => ({ data: [orders.get(id).item], has_more: false }),
      update: async (id, update) => Object.assign(orders.get(id).session.metadata, update.metadata),
    } },
    paymentIntents: { retrieve: async id => orders.get(id.replace("pi_", "")).intent },
  };
  function orderFor(offer, sequence) {
    const [product, , price, link, amount] = offer;
    const norwegian = product === "hjernen_i_kryssild";
    const currency = norwegian ? "nok" : "sek";
    const id = "cs_live_fixture" + sequence;
    const intentId = "pi_" + id;
    const session = { id, livemode: true, mode: "payment", status: "complete", payment_status: "paid", currency,
      amount_total: amount, payment_intent: intentId, payment_link: link, customer_details: { email: buyer },
      metadata: { rv_product: product, ...(product === "steinler_book" || norwegian ? { rv_book_price: price } : {}) } };
    const item = { price: { id: price, product: norwegian ? "prod_norwegian" : product === "lite_autism_book" ? "prod_lite" : "prod_fixture" },
      quantity: 1, currency, amount_total: amount };
    const charge = { paid: true, captured: true, refunded: false, amount_refunded: 0, disputed: false,
      livemode: true, amount, currency, payment_intent: intentId };
    orders.set(id, { session, item, charge, intent: {
      id: intentId, livemode: true, status: "succeeded", currency, amount_received: amount, latest_charge: charge,
    } });
    return { session, charge };
  }
  const event = (session, type = "checkout.session.completed", created = now, payment = session.payment_status) =>
    ({ livemode: true, created, type, data: { object: { id: session.id, payment_status: payment } } });

  const pg = new PGlite();
  const originalFetch = global.fetch;
  try {
    await pg.exec("create role anon; create role authenticated;");
    await pg.exec(readFileSync(path.resolve(__dirname, "../../../../supabase/migrations/202611240001_book_email_deliveries.sql"), "utf8"));
    const sql = connection => {
      const tag = async (parts, ...values) => (await connection.query(
        parts.map((part, i) => (i ? "$" + i : "") + part).join(""), values)).rows;
      tag.begin = callback => pg.transaction(tx => callback(sql(tx)));
      return tag;
    };
    const load = createLoader({
      stripe: { default: class { constructor() { return stripe; } } },
      postgres: { default: () => sql(pg) },
      "./authSession.server": { authenticatedUser: async () => user },
      "@aws-sdk/client-s3": { S3Client: class { destroy() {} },
        GetObjectCommand: class { constructor(input) { this.input = input; } } },
      "@aws-sdk/s3-request-presigner": { getSignedUrl: async (_client, command, options) => {
        assert.equal(options.expiresIn, 60);
        return "https://r2.example.test/private/" + command.input.Key;
      } },
      "@supabase/supabase-js": { createClient: () => ({ storage: { from: () => ({
        download: async key => {
          const source = key === "v1/Hjernen-i-kryssild.pdf" ? process.env.NORWAY_BOOK_TEST_PDF :
            key.startsWith("v1/Du-tanker") ? process.env.OVERTHINKING_BOOK_TEST_PDF : process.env.STEINLER_BOOK_TEST_PDF;
          return { data: source ? new Blob([readFileSync(source)]) : null };
        },
        info: async () => ({ data: { size: 12165871, contentType: "application/pdf" } }),
        createSignedUrl: async (_, seconds) => {
          assert.equal(seconds, 180);
          return { data: { signedUrl: "https://fixture.supabase.co/storage/v1/object/sign/book?token=fixture" } };
        },
      }) } }) },
    });
    const library = path.resolve(__dirname, "../../../_lib");
    const mail = load(path.join(library, "bookDeliveryEmail.server.ts"));
    const delivery = load(path.join(library, "bookDelivery.server.ts"));
    const access = load(path.join(library, "bookAccess.server.ts"));
    const token = load(path.join(library, "bookDeliveryToken.server.ts"));
    global.fetch = async (url, request) => {
      assert.equal(url, "https://api.resend.com/emails");
      const key = request.headers["Idempotency-Key"];
      const message = JSON.parse(request.body);
      assert.deepEqual(message.to, [buyer]);
      attempts.push(key);
      if (messages.has(key)) assert.deepEqual(message, messages.get(key));
      messages.set(key, message);
      if (failAfterAccept) { failAfterAccept = false; throw new Error("synthetic timeout"); }
      return { ok: true };
    };

    for (const [index, offer] of offers.entries()) {
      const [product, bookId, , link, , fileCount] = offer;
      const { session, charge } = orderFor(offer, index);
      const reads = checkoutReads;
      await mail.deliverBookEmail(stripe, event(session, undefined, now - 61), product);
      await mail.deliverBookEmail(stripe, event(session, undefined, now, "unpaid"), product);
      assert.equal(checkoutReads, reads, "old and unpaid Stripe events are rejected before provider calls");
      await mail.deliverBookEmail(stripe, event(session, link ? "checkout.session.async_payment_succeeded" : undefined),
        index === 1 ? "unmapped" : product);
      await mail.deliverBookEmail(stripe, event(session, "checkout.session.async_payment_succeeded"), product);
      if (product === "lite_autism_book") {
        assert.equal(session.metadata.rv_lite_autism_email, "sent");
        assert.equal(session.metadata.rv_book_ga4, "");
      }
      const key = "book-delivery/" + session.id;
      assert.equal(attempts.filter(value => value === key).length, 1);
      const message = messages.get(key);
      if (product === "hjernen_i_kryssild") {
        assert.equal(message.subject, "Din e-bok – Hjernen i kryssild");
        assert.match(message.text, new RegExp(offer[4] / 100 + " NOK"));
        assert.match(message.text, /Angrerettskjema/);
      } else {
        assert.match(message.html, /<img src="https:\/\/books\.example\.test\//);
        assert.match(message.html, /Tack för ditt köp!|Mitt bibliotek/);
      }
      const urls = message.text.split("\n").flatMap(line => line.includes("/api/books/delivery/") ? [new URL(line.split(": ")[1])] : []);
      assert.equal(urls.length, fileCount);
      for (const url of urls) {
        assert.equal(url.pathname, "/api/books/delivery/" + bookId);
        const proof = url.searchParams.get("email");
        assert.equal(token.readBookDeliveryToken(bookId, "email", proof, now + 29 * 86400), session.id);
        assert.equal(token.readBookDeliveryToken(bookId, "email", proof, now + 31 * 86400), null);
        assert.equal(token.readBookDeliveryToken(bookId, "browser", proof), null);
        if (link || product === "lite_autism_book") {
          const response = await delivery.bookPackageDownload(new Request(url), bookId);
          assert.equal(response.status, 303);
          assert.equal(response.headers.get("cache-control"), "private, no-store");
          charge.disputed = true;
          assert.equal((await delivery.bookPackageDownload(new Request(url), bookId)).status, 403);
          charge.disputed = false;
        } else {
          const source = product === "hjernen_i_kryssild" ? process.env.NORWAY_BOOK_TEST_PDF :
            product === "overthinking_book" ? process.env.OVERTHINKING_BOOK_TEST_PDF : process.env.STEINLER_BOOK_TEST_PDF;
          if (!source) continue;
          const result = await delivery.bookPackageDownload(new Request(url), bookId);
          assert.equal(result.status, 200);
          assert.deepEqual(Buffer.from(await result.arrayBuffer()), readFileSync(source));
          charge.refunded = true;
          assert.equal((await delivery.bookPackageDownload(new Request(url), bookId)).status, 403);
          charge.refunded = false;
        }
      }
      if (link) {
        const returned = await delivery.legacyBookReturn(new NextRequest(origin + "/" + bookId + "/tack?session_id=" + session.id), bookId);
        assert.match(returned.headers.get("location"), /\/tack\/klart$/);
        const cookie = returned.headers.get("set-cookie").split(";")[0];
        const guest = new Request(origin + "/api/books/delivery/" + bookId + "?guest=1", { headers: { cookie } });
        assert.equal((await delivery.bookPackageDownload(guest, bookId)).status, 303);
        charge.refunded = true;
        assert.equal((await delivery.bookPackageDownload(guest, bookId)).status, 403);
        charge.refunded = false;
      }
    }
    user = { id: "fixture-account", email: buyer, email_confirmed_at: "fixture" };
    const asset = new Request(origin + "/api/books/delivery/adhd-deluxe?file=print");
    assert.deepEqual(await (await delivery.bookPackageDownload(asset, "adhd-deluxe")).json(),
      { url: "https://r2.example.test/private/adhd-print.pdf" });
    user.email = "someone-else@example.test";
    assert.equal((await delivery.bookPackageDownload(asset, "adhd-deluxe")).status, 403);
    const oldCookie = access.AUTISM_BOOK_ACCESS_COOKIE + "=" + access.issueBookAccessToken("autism-bok");
    const oldDownload = await delivery.bookPackageDownload(new Request(origin + "/api/books/autism-bok/download",
      { headers: { cookie: oldCookie } }), "autism-bok", "book");
    assert.equal(oldDownload.status, 303);
    assert.match(oldDownload.headers.get("location"), /mina-sidor/);

    const delayed = orderFor(offers[0], 20).session;
    failAfterAccept = true;
    await assert.rejects(mail.deliverBookEmail(stripe, event(delayed), "audhd_bok"), /synthetic timeout/);
    await mail.deliverBookEmail(stripe, event(delayed), "audhd_bok");
    assert.equal(attempts.filter(value => value === "book-delivery/" + delayed.id).length, 2);
    assert.equal(messages.size, offers.length + 1);
    assert.equal((await pg.query("select count(*)::int as sent from public.book_email_deliveries where sent_at is not null")).rows[0].sent,
      offers.length + 1);
  } finally {
    global.fetch = originalFetch;
    await pg.close();
  }
});
