/* eslint-disable @typescript-eslint/no-require-imports -- executable server-token regression test. */
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
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
assert(recovery.verifyAudhdSupportRecoveryToken(valid));
assert.equal(recovery.verifyAudhdSupportRecoveryToken(`${valid}x`), null);
assert.equal(recovery.verifyAudhdSupportRecoveryToken(supportToken({ v: 1, product: "adhd", kind: "support-recovery", exp: future, nonce: "support-case-sara-123" })), null);
assert.equal(recovery.verifyAudhdSupportRecoveryToken(supportToken({ v: 1, product: "audhd", kind: "support-recovery", exp: future - 60 * 60 - 1, nonce: "support-case-sara-123" })), null);

const issuedAt = Math.floor(Date.now() / 1000);
const issuedSupportRecovery = recovery.issueAudhdSupportRecoveryToken();
const issuedSupportPayload = recovery.verifyAudhdSupportRecoveryToken(issuedSupportRecovery);
assert(issuedSupportPayload);
assert(issuedSupportPayload.exp >= issuedAt + (48 * 60 * 60));
assert(issuedSupportPayload.exp <= issuedAt + (48 * 60 * 60) + 1);
assert.equal(recovery.verifyAudhdBrowserUnlockToken(issuedSupportRecovery), null);

const browserUnlock = recovery.issueAudhdBrowserUnlockToken();
assert(recovery.verifyAudhdBrowserUnlockToken(browserUnlock));
assert.equal(recovery.verifyAudhdSupportRecoveryToken(browserUnlock), null);

console.log("PASS: only valid, unexpired AuDHD support tokens issue a separate browser-unlock token.");
