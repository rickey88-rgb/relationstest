/* eslint-disable @typescript-eslint/no-require-imports -- executable server-only regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64url");
process.env.AUDHD_CHECKOUT_ACCESS_TOKEN_SECRET = "test-access-token-secret-that-is-longer-than-thirty-two-characters";
const attempt = createLoader()(path.join(__dirname, "audhdCheckoutAttempt.server.ts"));
const complete = { reportVersion: "audhd-v1", answers: Array(48).fill(2), contextAnswers: Array(6).fill(3) };

assert.deepEqual(attempt.parseAudhdCheckoutAnswers(complete), complete);
assert.equal(attempt.parseAudhdCheckoutAnswers({ ...complete, answers: Array(47).fill(2) }), null);
assert.equal(attempt.parseAudhdCheckoutAnswers({ ...complete, contextAnswers: Array(6).fill(5) }), null);
assert.equal(attempt.parseAudhdCheckoutAnswers({ ...complete, reportVersion: "future" }), null);

const encrypted = attempt.encryptAudhdCheckoutAnswers(complete);
assert.notEqual(encrypted.ciphertext, JSON.stringify(complete));
assert.deepEqual(attempt.decryptAudhdCheckoutAnswers(encrypted), complete);
assert.equal(attempt.decryptAudhdCheckoutAnswers({ ...encrypted, authTag: `${encrypted.authTag}x` }), null);

const secret = attempt.issueAudhdCheckoutBrowserSecret();
assert.match(secret, /^[A-Za-z0-9_-]{43}$/);
assert.match(attempt.hashAudhdCheckoutBrowserSecret(secret), /^[0-9a-f]{64}$/);
assert.equal(attempt.AUDHD_CHECKOUT_ATTEMPT_RETENTION_SECONDS, 60 * 60 * 24 * 7);
assert.equal(attempt.audhdCheckoutAttemptCookieMaxAge, attempt.AUDHD_CHECKOUT_ATTEMPT_RETENTION_SECONDS, "the browser secret remains available for any valid encrypted attempt");
const accessToken = attempt.issueAudhdCheckoutAccessToken("11111111-1111-4111-8111-111111111111", new Date(Date.now() + 60_000));
assert.equal(attempt.verifyAudhdCheckoutAccessToken(accessToken).attemptId, "11111111-1111-4111-8111-111111111111");
assert.equal(attempt.verifyAudhdCheckoutAccessToken(`${accessToken}x`), null);
console.log("PASS: AuDHD checkout drafts validate all 48 + 6 answers, encrypt at rest, and retain only a hash of the browser secret.");
