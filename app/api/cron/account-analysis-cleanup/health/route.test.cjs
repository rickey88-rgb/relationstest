/* eslint-disable @typescript-eslint/no-require-imports -- local health endpoint tests. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../../autism-test/test/test-loader.cjs");
process.env.CRON_SECRET = "local-health-only";
let checks = 0, healthy = true, failure = false;
let journalOffline = false, mode = "active";
const route = createLoader({
  "../../../../_lib/accountErasureJournal.server": { accountStorageMode: () => mode, assertErasureJournalAvailable: async () => { if (journalOffline) throw new Error("offline"); } },
  "../../../../_lib/accountMonitoring.server": { accountMonitoringConfigured: () => true },
  "../../../../_lib/accountPurchasesDb.server": {
  accountCleanupHealth: async () => {
    checks += 1;
    if (failure) throw new Error("private-error-must-not-leak");
    return { healthy, lastSuccessAt: null, overdueCount: healthy ? 0 : 1 };
  },
} })(path.join(__dirname, "route.ts"));
const request = token => new NextRequest("https://www.relationsvarning.se/api/cron/account-analysis-cleanup/health", { headers: { authorization: token } });
(async () => {
  assert.equal((await route.GET(request(""))).status, 401);
  assert.equal(checks, 0);
  const token = "Bearer " + process.env.CRON_SECRET;
  assert.equal((await route.GET(request(token))).status, 200);
  journalOffline = true; assert.equal((await route.GET(request(token))).status, 503); journalOffline = false;
  mode = "maintenance"; assert.equal((await route.GET(request(token))).status, 503); mode = "active";
  healthy = false;
  const response = await route.GET(request(token));
  assert.equal(response.status, 503);
  assert.match(response.headers.get("cache-control"), /no-store/);
  failure = true;
  const unavailable = await route.GET(request(token));
  assert.equal(unavailable.status, 503);
  assert(!JSON.stringify(await unavailable.json()).includes("private-error"));
  delete process.env.CRON_SECRET;
  assert.equal((await route.GET(request(token))).status, 401);
  console.log("PASS: read-only cleanup health requires Cron authorization and exposes stale/missing success without customer data.");
})().catch(error => { console.error(error); process.exitCode = 1; });
