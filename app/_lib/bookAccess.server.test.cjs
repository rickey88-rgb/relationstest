/* eslint-disable @typescript-eslint/no-require-imports -- executable server-token regression test. */
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.BOOK_ACCESS_TOKEN_SECRET = "test-book-secret-that-is-longer-than-thirty-two-characters";
const access = createLoader()(path.join(__dirname, "bookAccess.server.ts"));

const issued = access.issueBookAccessToken("audhd-bok");
assert(access.verifyBookAccessToken(issued, "audhd-bok"));
assert.equal(access.verifyBookAccessToken(issued, "autism-bok"), null);
assert.equal(access.verifyBookAccessToken(`${issued}x`, "audhd-bok"), null);

const autismIssued = access.issueBookAccessToken("autism-bok");
assert(access.verifyBookAccessToken(autismIssued, "autism-bok"));
assert.equal(access.verifyBookAccessToken(autismIssued, "audhd-bok"), null);

const adhdDeluxeIssued = access.issueBookAccessToken("adhd-deluxe");
assert(access.verifyBookAccessToken(adhdDeluxeIssued, "adhd-deluxe"));
assert.equal(access.verifyBookAccessToken(adhdDeluxeIssued, "audhd-bok"), null);

const expiredPayload = Buffer.from(JSON.stringify({
  v: 1,
  product: "audhd-bok",
  kind: "book-access",
  exp: Math.floor(Date.now() / 1000) - 1,
  nonce: "book-access-expired-123",
})).toString("base64url");
const expiredToken = `${expiredPayload}.${createHmac("sha256", process.env.BOOK_ACCESS_TOKEN_SECRET).update(expiredPayload).digest("base64url")}`;
assert.equal(access.verifyBookAccessToken(expiredToken, "audhd-bok"), null);

console.log("PASS: only signed, unexpired tokens unlock the matching book product.");
