/* eslint-disable @typescript-eslint/no-require-imports -- executable server-token regression test. */
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.AUDHD_RECOVERY_TOKEN_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
const recovery = createLoader()(path.join(__dirname, "audhdRecovery.server.ts"));

function supportToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", process.env.AUDHD_RECOVERY_TOKEN_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

const future = Math.floor(Date.now() / 1000) + 60 * 60;
const valid = supportToken({ v: 1, product: "audhd", kind: "support-recovery", exp: future, nonce: "support-case-sara-123" });
assert(recovery.verifyAudhdLegacySupportRecoveryToken(valid));
assert.equal(recovery.verifyAudhdLegacySupportRecoveryToken(`${valid}x`), null);
assert.equal(recovery.verifyAudhdLegacySupportRecoveryToken(supportToken({ v: 1, product: "adhd", kind: "support-recovery", exp: future, nonce: "support-case-sara-123" })), null);
assert.equal(recovery.verifyAudhdLegacySupportRecoveryToken(supportToken({ v: 1, product: "audhd", kind: "support-recovery", exp: future - 60 * 60 - 1, nonce: "support-case-sara-123" })), null);

assert.equal(typeof recovery.issueAudhdSupportRecoveryToken, "undefined", "the recovery module must not expose a v1 support-token issuer");
assert.equal(fs.existsSync(path.join(__dirname, "../../scripts/create-audhd-recovery-link.cjs")), false, "the retired v1 issuer script must not be restored");

const browserUnlock = recovery.issueAudhdBrowserUnlockToken("11111111-1111-4111-8111-111111111111");
assert(recovery.verifyAudhdBrowserUnlockToken(browserUnlock));
assert.equal(recovery.verifyAudhdLegacySupportRecoveryToken(browserUnlock), null);

console.log("PASS: existing signed v1 support links remain verifiable, while no v1 issuer function or script remains.");
