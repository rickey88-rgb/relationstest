/* eslint-disable @typescript-eslint/no-require-imports -- executable server regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.AUDHD_RECOVERY_TOKEN_SECRET = "test-recovery-secret-that-is-longer-than-thirty-two-characters";
const recovery = createLoader()(path.join(__dirname, "audhdRecovery.server.ts"));

const token = recovery.issueAudhdRecoveryToken();
assert.match(token, /^[A-Za-z0-9_-]{43}$/);
assert.equal(recovery.hashAudhdRecoveryToken(token).length, 64);
assert.equal(recovery.hashAudhdRecoveryToken(token), recovery.hashAudhdRecoveryToken(token));
assert.notEqual(token, recovery.issueAudhdRecoveryToken());

const grantId = "11111111-1111-4111-8111-111111111111";
const browserToken = recovery.issueAudhdBrowserUnlockToken(grantId);
const payload = recovery.verifyAudhdBrowserUnlockToken(browserToken);
assert.equal(payload.grantId, grantId);
assert.equal(payload.product, "audhd_test");
assert(payload.exp > Math.floor(Date.now() / 1000));
assert.equal(recovery.verifyAudhdBrowserUnlockToken(`${browserToken}x`), null);
assert.equal(recovery.audhdBrowserUnlockMaxAge, 60 * 60);
assert.equal(recovery.AUDHD_LEGACY_RECOVERY_COOKIE, "rv_audhd_recovery");
assert.equal(recovery.AUDHD_RECOVERY_COOKIE, "rv_audhd_recovery_v2");
assert.equal(recovery.verifyAudhdLegacyBrowserUnlockToken(browserToken), null);
const legacyCookie = recovery.issueAudhdLegacyBrowserUnlockToken(Math.floor(Date.now() / 1000) + 300);
assert.equal(recovery.verifyAudhdLegacyBrowserUnlockToken(legacyCookie).product, "audhd");
assert.equal(recovery.verifyAudhdBrowserUnlockToken(legacyCookie), null);
assert.equal(recovery.isAudhdRecoveryToken(token), true);
assert.equal(recovery.isAudhdRecoveryToken(legacyCookie), false);

console.log("PASS: AuDHD v1 and v2 recovery credentials are product/version separated; v2 remains opaque, hashed and one hour long.");
