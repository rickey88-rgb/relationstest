/* eslint-disable @typescript-eslint/no-require-imports -- offline payment and private-file security integration. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const crypto = require("node:crypto");
const { NextRequest } = require("next/server");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const createLoader = require("../../../../autism-test/test/test-loader.cjs");
const root = path.resolve(__dirname, "../../../../..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/adhd-deluxe-release-assets.json")));
Object.assign(process.env, {
  NODE_ENV: "production", BOOK_ACCESS_TOKEN_SECRET: "isolated-adhd-integration-only-secret-over-32-characters",
  STRIPE_SECRET_KEY: "local-stripe-mock", R2_ENDPOINT: "https://r2.example.test", R2_BUCKET_NAME: "private-books",
  R2_ACCESS_KEY_ID: "local-only", R2_SECRET_ACCESS_KEY: "local-only",
});
for (const file of manifest.files) process.env[file.env] = file.key;
const choices = [
  { price: "price_1UO3C0AgF4ugWkEkklryPLKO", amount: 14900, link: "plink_1UO3CpAgF4ugWkEkyWAfIbus" },
  { price: "price_1UO3F6AgF4ugWkEkRCM7L9yX", amount: 9900, link: "plink_1UO3FGAgF4ugWkEkniqT0FGP" },
];
let session, items, intent, charge, fault = false, signed, origin;
function reset(offer = choices[0]) {
  fault = false;
  session = { status: "complete", payment_status: "paid", mode: "payment", livemode: true, currency: "sek", amount_total: offer.amount, payment_link: offer.link, payment_intent: "pi_local" };
  items = { data: [{ price: { id: offer.price }, quantity: 1, amount_total: offer.amount }], has_more: false };
  charge = { paid: true, captured: true, refunded: false, amount_refunded: 0, disputed: false };
  intent = { status: "succeeded", latest_charge: charge };
}
class StripeMock { constructor() {
  this.checkout = { sessions: { retrieve: async () => { if (fault) throw Error("synthetic provider failure"); return session; }, listLineItems: async () => items } };
  this.paymentIntents = { retrieve: async () => intent };
  this.charges = { retrieve: async () => charge };
} }
const issued = new Map();
const load = createLoader({
  stripe: { default: StripeMock },
  "@aws-sdk/client-s3": { S3Client: class {}, GetObjectCommand: class { constructor(input) { this.input = input; } } },
  "@aws-sdk/s3-request-presigner": { getSignedUrl: async (_client, command, options) => {
    signed = { ...command.input, ...options };
    const token = crypto.randomBytes(24).toString("hex");
    issued.set(token, command.input.Key);
    return `${origin}/private/${token}`;
  } },
});
const access = load(path.resolve(__dirname, "../../../../_lib/bookAccess.server.ts"));
const thanks = load(path.resolve(__dirname, "../../../../adhd-deluxe/tack/route.ts"));
const products = load(path.resolve(__dirname, "../../../../_lib/bookProducts.server.ts"));
const download = load(path.join(__dirname, "route.ts"));
const request = (cookie, file = "book") => new NextRequest(`https://www.relationsvarning.se/api/books/adhd-deluxe/download?file=${encodeURIComponent(file)}`, { headers: cookie ? { cookie } : {} });
const returnRequest = () => new NextRequest("https://www.relationsvarning.se/adhd-deluxe/tack?session_id=cs_live_localOnly");
const hash = data => crypto.createHash("sha256").update(data).digest("hex");

(async () => {
  reset();
  let checks = 0;
  const expiredPayload = Buffer.from(JSON.stringify({ v: 1, kind: "book-access", product: "adhd-deluxe", exp: 1, nonce: "expired-cookie-nonce-long" })).toString("base64url");
  const expired = `${expiredPayload}.${crypto.createHmac("sha256", process.env.BOOK_ACCESS_TOKEN_SECRET).update(expiredPayload).digest("base64url")}`;
  for (const file of ["book", "worksheets", "print"]) {
    for (const token of [null, "forged", expired, access.issueBookAccessToken("autism-bok"), access.issueBookAccessToken("audhd-bok"), access.issueBookAccessToken("adhd-deluxe") + "x"]) {
      const denied = await download.GET(request(token ? `${access.ADHD_DELUXE_BOOK_ACCESS_COOKIE}=${token}` : null, file));
      assert.equal(denied.status, 403); assert.equal(denied.headers.get("location"), null); checks += 2;
    }
  }
  const attacks = [
    () => session.payment_status = "unpaid", () => session.status = "open", () => session.livemode = false,
    () => session.mode = "subscription", () => session.currency = "eur", () => session.payment_link = "plink_wrong",
    () => session.amount_total = 1, () => items.data[0].amount_total = 1, () => items.data[0].quantity = 2,
    () => items.data[0].price.id = "price_wrong", () => items.has_more = true, () => items.data.push({ ...items.data[0] }),
    () => items.data = [], () => session.payment_intent = null, () => intent.status = "requires_capture",
    () => charge.paid = false, () => charge.captured = false, () => charge.refunded = true,
    () => charge.amount_refunded = 1, () => charge.disputed = true, () => intent.latest_charge = null, () => fault = true,
  ];
  const errorLog = console.error;
  for (const attack of attacks) {
    reset(); attack();
    console.error = () => {};
    try {
      const denied = await thanks.GET(returnRequest());
      assert.equal(denied.status, 303); assert(denied.headers.get("location").endsWith("/tack/fel"));
      assert.equal(denied.headers.get("set-cookie"), null); checks += 3;
    } finally { console.error = errorLog; }
  }
  const source = process.env.ADHD_PRIVATE_ASSETS || path.join(root, ".artifacts/adhd-deluxe/private");
  const payloads = new Map(manifest.files.map(file => {
    const data = fs.readFileSync(path.join(source, file.file));
    assert.equal(hash(data), file.sha256); checks++;
    return [file.key, data];
  }));
  const server = http.createServer((req, res) => {
    const token = req.url?.startsWith("/private/") ? req.url.slice(9) : "";
    const data = payloads.get(issued.get(token));
    if (!data) return res.writeHead(403).end();
    res.setHeader("Content-Type", "application/pdf"); res.end(data);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const offer of choices) {
      reset(offer);
      const returned = await thanks.GET(returnRequest());
      assert.equal(returned.status, 303); assert(returned.headers.get("location").endsWith("/tack/klart"));
      const rawCookie = returned.headers.get("set-cookie");
      for (const property of ["HttpOnly", "Secure", "SameSite=lax"]) assert(rawCookie.includes(property));
      checks += 5;
      const cookie = rawCookie.split(";")[0];
      for (const [index, kind] of ["book", "worksheets", "print"].entries()) {
        const file = manifest.files[index];
        const result = await download.GET(request(cookie, kind));
        assert.equal(result.status, 302); assert.equal(signed.Key, file.key); assert.equal(signed.Bucket, "private-books");
        assert.equal(signed.expiresIn, 60); assert.equal(signed.ResponseContentType, "application/pdf");
        assert(signed.ResponseContentDisposition.includes(file.file)); assert.equal(signed.ResponseCacheControl, "private, no-store");
        for (const [name, value] of [["cache-control", "private, no-store"], ["referrer-policy", "no-referrer"], ["x-robots-tag", "noindex, nofollow"], ["x-content-type-options", "nosniff"]]) assert.equal(result.headers.get(name), value);
        const response = await fetch(result.headers.get("location")); assert.equal(response.status, 200);
        const bytes = Buffer.from(await response.arrayBuffer()); assert.equal(hash(bytes), file.sha256);
        const downloaded = path.join(root, ".artifacts/adhd-deluxe/downloaded"); fs.mkdirSync(downloaded, { recursive: true }); fs.writeFileSync(path.join(downloaded, file.file), bytes);
        checks += 13;
      }
      for (const kind of ["../other-book", "https://evil.invalid/file", "anything.pdf"]) {
        const denied = await download.GET(request(cookie, kind)); assert.equal(denied.status, 404); assert.equal(denied.headers.get("location"), null); checks += 2;
      }
      const key = process.env.ADHD_DELUXE_WORKSHEETS_R2_KEY;
      delete process.env.ADHD_DELUXE_WORKSHEETS_R2_KEY;
      assert.equal((await download.GET(request(cookie, "worksheets"))).status, 503);
      assert.equal((await download.GET(request(cookie, "book"))).status, 302); checks += 2;
      process.env.ADHD_DELUXE_WORKSHEETS_R2_KEY = key;
    }
    assert.equal((await fetch(`${origin}/private/not-issued`)).status, 403); checks++;
    // Check the actual AWS presigner separately from the offline HTTP fixture.
    const config = products.adhdDeluxeBookR2Config();
    const client = new S3Client({ region: "auto", endpoint: config.endpoint, forcePathStyle: true, credentials: config.credentials });
    const signedUrl = new URL(await getSignedUrl(client, new GetObjectCommand({ Bucket: config.bucket, Key: config.key, ResponseContentType: "application/pdf", ResponseCacheControl: "private, no-store" }), { expiresIn: 60 }));
    assert.equal(signedUrl.searchParams.get("X-Amz-Expires"), "60"); assert(signedUrl.searchParams.get("X-Amz-Signature")); assert(signedUrl.pathname.endsWith(config.key)); checks += 3;
    const summary = { checks, files: 3, actualPdfHashes: true, rejectedPaymentCases: attacks.length, externalWrites: 0 };
    fs.writeFileSync(path.join(root, ".artifacts/adhd-deluxe/purchase-flow-result.json"), JSON.stringify(summary, null, 2));
    console.log(`PASS: ${checks} checks; both existing prices, three real PDF byte streams, invalid/expired/cross-product cookies, payment/refund/dispute denial, unknown files, missing configuration and 60-second AWS signatures.`);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
