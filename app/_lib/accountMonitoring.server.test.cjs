/* eslint-disable @typescript-eslint/no-require-imports -- monitoring tests never send HTTP. */
const assert = require("node:assert/strict");
const path = require("node:path");
const load = require("../autism-test/test/test-loader.cjs");
let calls = [], ok = true;
global.fetch = async (url, options) => { calls.push({ url, options }); return { ok }; };
const monitor = load()(path.join(__dirname, "accountMonitoring.server.ts"));
(async () => {
  delete process.env.ACCOUNT_CLEANUP_HEALTHCHECKS_URL;
  assert.equal(monitor.accountMonitoringConfigured(), false);
  await assert.rejects(monitor.notifyAccountCleanup(true)); assert.equal(calls.length, 0);
  process.env.ACCOUNT_CLEANUP_HEALTHCHECKS_URL = "https://attacker.test/11111111-1111-4111-8111-111111111111";
  await assert.rejects(monitor.notifyAccountCleanup(true)); assert.equal(calls.length, 0);
  process.env.ACCOUNT_CLEANUP_HEALTHCHECKS_URL = "https://hc-ping.com/11111111-1111-4111-8111-111111111111";
  await monitor.notifyAccountCleanup(true); await monitor.notifyAccountCleanup(false);
  assert(calls[1].url.endsWith("/fail")); assert.equal(calls[0].options.body, ""); assert.equal(calls[0].options.redirect, "error");
  ok = false; await assert.rejects(monitor.notifyAccountCleanup(true));
  console.log("PASS: monitoring rejects missing/untrusted destinations, sends no customer data and reports delivery failures.");
})().catch(error => { console.error(error); process.exitCode = 1; });
