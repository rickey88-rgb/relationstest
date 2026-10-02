/* eslint-disable @typescript-eslint/no-require-imports -- Executable support-token regression harness. */
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

process.env.AUTISM_RECOVERY_TOKEN_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
const recovery = createLoader()(path.join(__dirname, "autismRecovery.server.ts"));
const now = Math.floor(Date.now() / 1000); const future = now + 60 * 60;
function supportToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", process.env.AUTISM_RECOVERY_TOKEN_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}
const valid = supportToken({ v: 1, product: "autism", kind: "support-recovery", exp: future, nonce: "support-case-autism-123" });
assert(recovery.verifyAutismSupportRecoveryToken(valid));
assert.equal(recovery.verifyAutismSupportRecoveryToken(`${valid}x`), null);
assert.equal(recovery.verifyAutismSupportRecoveryToken(supportToken({ v: 1, product: "audhd", kind: "support-recovery", exp: future, nonce: "support-case-autism-123" })), null);
assert.equal(recovery.verifyAutismSupportRecoveryToken(supportToken({ v: 1, product: "autism", kind: "support-recovery", exp: now - 1, nonce: "support-case-autism-123" })), null);
const browserUnlock = recovery.issueAutismBrowserUnlockToken();
assert(recovery.verifyAutismBrowserUnlockToken(browserUnlock));
assert.equal(recovery.verifyAutismSupportRecoveryToken(browserUnlock), null);
console.log("PASS: autism support recovery tokens reject tampering, wrong product and expiry; browser unlock is a separate token type.");
