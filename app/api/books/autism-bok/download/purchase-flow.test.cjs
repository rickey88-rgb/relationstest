/* eslint-disable @typescript-eslint/no-require-imports -- offline Stripe/R2 integration with real signed cookies. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const crypto = require("node:crypto");
const { NextRequest } = require("next/server");
const createLoader = require("../../../../autism-test/test/test-loader.cjs");
process.env.BOOK_ACCESS_TOKEN_SECRET = "local-integration-only-secret-with-more-than-32-chars";
process.env.STRIPE_SECRET_KEY = "local-stripe-mock";
process.env.AUTISM_BOOK_PAYMENT_LINK_ID_149 = "plink_standard";
process.env.AUTISM_BOOK_PAYMENT_LINK_ID_99 = "plink_analysis";
process.env.AUTISM_BOOK_ALLOWED_PRICE_IDS = "price_standard,price_analysis";
Object.assign(process.env, { R2_ENDPOINT: "https://r2.example.test", R2_BUCKET_NAME: "private-books", R2_ACCESS_KEY_ID: "mock", R2_SECRET_ACCESS_KEY: "mock", AUTISM_BOOK_R2_KEY: "books/main.pdf", AUTISM_BOOK_WORKSHEETS_R2_KEY: "books/worksheets.pdf" });
let selectedPrice = "price_standard", paid = true, origin, signed;
class StripeMock { constructor() {
  this.checkout = { sessions: { retrieve: async () => ({ status: "complete", payment_status: paid ? "paid" : "unpaid", mode: "payment", livemode: true, currency: "sek", payment_link: selectedPrice === "price_standard" ? "plink_standard" : "plink_analysis", payment_intent: "pi_mock" }), listLineItems: async () => ({ data: [{ price: { id: selectedPrice }, quantity: 1 }], has_more: false }) } };
  this.paymentIntents = { retrieve: async () => ({ status: "succeeded", latest_charge: { paid: true, captured: true, refunded: false, amount_refunded: 0, disputed: false } }) };
} }
const load = createLoader({ stripe: { default: StripeMock }, "@aws-sdk/client-s3": { S3Client: class {}, GetObjectCommand: class { constructor(input) { this.input = input; } } }, "@aws-sdk/s3-request-presigner": { getSignedUrl: async (_client, command, options) => { signed = { ...command.input, ...options }; return `${origin}/${command.input.Key}`; } } });
const access = load(path.resolve(__dirname, "../../../../_lib/bookAccess.server.ts"));
const thanks = load(path.resolve(__dirname, "../../../../autism-bok/tack/route.ts"));
const book = load(path.join(__dirname, "route.ts"));
const worksheets = load(path.resolve(__dirname, "../worksheets/route.ts"));
const request = (cookie) => new NextRequest("https://www.relationsvarning.se/api/books/autism-bok/download", { headers: cookie ? { cookie } : {} });
(async () => {
  let checks = 0;
  for (const route of [book, worksheets]) {
    for (const token of [null, "forged", access.issueBookAccessToken("audhd-bok"), access.issueBookAccessToken("autism-bok") + "x"]) {
      assert.equal((await route.GET(request(token ? `${access.AUTISM_BOOK_ACCESS_COOKIE}=${token}` : null))).status, 403); checks++;
    }
  }
  const sources = process.env.AUTISM_PRIVATE_ASSETS;
  const payloads = sources ? { "books/main.pdf": fs.readFileSync(path.join(sources, "AUTISM_ALL_INCLUSIVE_Elias_Voss.pdf")), "books/worksheets.pdf": fs.readFileSync(path.join(sources, "AUTISM_ALL_INCLUSIVE_arbetsblad_A4.pdf")) } : { "books/main.pdf": Buffer.from("mock-book"), "books/worksheets.pdf": Buffer.from("mock-worksheets") };
  const server = http.createServer((req, res) => { const data = payloads[req.url.slice(1)]; if (!data) { res.writeHead(404).end(); return; } res.setHeader("Content-Type", "application/pdf"); res.end(data); });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve)); origin = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const price of ["price_standard", "price_analysis"]) {
      selectedPrice = price;
      const returned = await thanks.GET(new NextRequest("https://www.relationsvarning.se/autism-bok/tack?session_id=cs_live_mock"));
      assert.equal(returned.status, 303); assert(returned.headers.get("location").endsWith("/tack/klart")); checks += 2;
      const cookie = returned.headers.get("set-cookie").split(";")[0];
      assert(returned.headers.get("set-cookie").includes("HttpOnly")); checks++;
      for (const [route, key, filename] of [[book, "books/main.pdf", "AUTISM_ALL_INCLUSIVE_Elias_Voss.pdf"], [worksheets, "books/worksheets.pdf", "AUTISM_ALL_INCLUSIVE_arbetsblad_A4.pdf"]]) {
        const result = await route.GET(request(cookie));
        assert.equal(result.status, 302); assert.equal(signed.Key, key); assert.equal(signed.Bucket, "private-books"); assert.equal(signed.expiresIn, 60); assert.equal(signed.ResponseContentType, "application/pdf"); assert(signed.ResponseContentDisposition.includes(filename));
        for (const [name, value] of [["cache-control", "private, no-store"], ["referrer-policy", "no-referrer"], ["x-robots-tag", "noindex, nofollow"]]) assert.equal(result.headers.get(name), value);
        const downloaded = Buffer.from(await (await fetch(result.headers.get("location"))).arrayBuffer());
        assert.equal(crypto.createHash("sha256").update(downloaded).digest("hex"), crypto.createHash("sha256").update(payloads[key]).digest("hex"));
        if (process.env.AUTISM_DOWNLOADED_ASSETS) { fs.mkdirSync(process.env.AUTISM_DOWNLOADED_ASSETS, { recursive: true }); fs.writeFileSync(path.join(process.env.AUTISM_DOWNLOADED_ASSETS, filename), downloaded); }
        checks += 10;
      }
    }
    paid = false; const rejected = await thanks.GET(new NextRequest("https://www.relationsvarning.se/autism-bok/tack?session_id=cs_live_mock")); assert(rejected.headers.get("location").endsWith("/tack/fel")); assert.equal(rejected.headers.get("set-cookie"), null); checks += 2;
    const cookie = `${access.AUTISM_BOOK_ACCESS_COOKIE}=${access.issueBookAccessToken("autism-bok")}`;
    delete process.env.AUTISM_BOOK_WORKSHEETS_R2_KEY;
    assert.equal((await worksheets.GET(request(cookie))).status, 503); assert.equal((await book.GET(request(cookie))).status, 302); checks += 2;
    delete process.env.AUTISM_BOOK_R2_KEY; assert.equal((await book.GET(request(cookie))).status, 503); checks++;
    console.log(`PASS: ${checks} checkout, cookie, two-download and byte-preservation checks (${sources ? "actual private PDFs via local R2 fixture" : "synthetic files"}).`);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
