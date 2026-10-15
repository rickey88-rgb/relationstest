/* eslint-disable @typescript-eslint/no-require-imports -- executable mail transport regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

const original = { key: process.env.RESEND_API_KEY, from: process.env.AUDHD_RECOVERY_EMAIL_FROM, fetch: global.fetch, AbortController: global.AbortController, setTimeout: global.setTimeout, clearTimeout: global.clearTimeout };
process.env.RESEND_API_KEY = "test-resend-key";
process.env.AUDHD_RECOVERY_EMAIL_FROM = "Recovery <support@mail.example.test>";

let request;
global.fetch = async (url, init) => { request = { url, init }; return { ok: true }; };
let mail = createLoader()(path.join(__dirname, "audhdRecoveryEmail.server.ts"));

(async () => {
  await mail.sendAudhdRecoveryEmail({ to: "buyer@example.test", recoveryUrl: "https://www.relationsvarning.se/api/audhd-recovery/redeem?token=test" });
  assert.equal(request.url, "https://api.resend.com/emails");
  assert.equal(request.init.headers.Authorization, "Bearer test-resend-key");
  assert.equal(request.init.signal.aborted, false);

  class ImmediateAbortController {
    constructor() { this.signal = { aborted: false }; }
    abort() { this.signal.aborted = true; }
  }
  global.AbortController = ImmediateAbortController;
  global.setTimeout = callback => { callback(); return 1; };
  global.clearTimeout = () => {};
  global.fetch = async (_url, init) => {
    assert.equal(init.signal.aborted, true);
    const error = new Error("Timed out"); error.name = "AbortError"; throw error;
  };
  mail = createLoader()(path.join(__dirname, "audhdRecoveryEmail.server.ts"));
  await assert.rejects(() => mail.sendAudhdRecoveryEmail({ to: "buyer@example.test", recoveryUrl: "https://example.test" }), /Timed out/);
  console.log("PASS: Resend mail is server-authenticated and aborts a timed-out request.");
})().finally(() => {
  if (original.key === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = original.key;
  if (original.from === undefined) delete process.env.AUDHD_RECOVERY_EMAIL_FROM; else process.env.AUDHD_RECOVERY_EMAIL_FROM = original.from;
  global.fetch = original.fetch; global.AbortController = original.AbortController; global.setTimeout = original.setTimeout; global.clearTimeout = original.clearTimeout;
}).catch(error => { console.error(error); process.exitCode = 1; });
