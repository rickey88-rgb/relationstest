/* eslint-disable @typescript-eslint/no-require-imports -- cleanup authorization regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");
let deleted = 0, failure = false, monitorFailure = false, notifications = [], deliveries = 0;
process.env.CRON_SECRET = "local-account-cleanup-only";
const route = createLoader({ "../../../_lib/accountMonitoring.server": { notifyAccountCleanup: async success => {
  notifications.push(success); if (monitorFailure) throw new Error("offline");
} }, "../../../_lib/accountPurchasesDb.server": {
  accountStorageReady: async () => true,
  deleteExpiredAccountAnalyses: async () => { if (failure) throw new Error("offline"); deleted += 1; return 3; },
  accountCleanupHealth: async () => ({ healthy: true }),
  recordAccountMonitorSuccess: async () => { deliveries += 1; },
} })(path.join(__dirname, "route.ts"));
function request(token = "") { return new NextRequest("https://www.relationsvarning.se/api/cron/account-analysis-cleanup", { headers: { authorization: token } }); }
(async () => {
  assert.equal((await route.GET(request())).status, 401);
  assert.equal((await route.GET(request("Bearer wrong"))).status, 401);
  assert.equal(deleted, 0);
  const response = await route.GET(request("Bearer " + process.env.CRON_SECRET));
  assert.equal(response.status, 200); assert.deepEqual(await response.json(), { deleted: 3 });
  assert.deepEqual(notifications, [true]); assert.equal(deliveries, 1);
  monitorFailure = true;
  assert.equal((await route.GET(request("Bearer " + process.env.CRON_SECRET))).status, 503);
  assert.equal(deliveries, 1, "failed ping is not recorded as delivered");
  monitorFailure = false;
  failure = true;
  assert.equal((await route.GET(request("Bearer " + process.env.CRON_SECRET))).status, 503, "cleanup failure is observable, not a false success");
  assert.equal(notifications.at(-1), false);
  console.log("PASS: scheduled payload deletion requires the Cron secret and reports failures without exposing customer data.");
})().catch(error => { console.error(error); process.exitCode = 1; });
