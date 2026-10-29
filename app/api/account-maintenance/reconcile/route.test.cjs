/* eslint-disable @typescript-eslint/no-require-imports -- protected operator route test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const load = require("../../../autism-test/test/test-loader.cjs");
process.env.CRON_SECRET = "synthetic-scheduler-only";
process.env.ACCOUNT_MAINTENANCE_SECRET = "synthetic-restore-secret-at-least-32-characters";
let calls = 0, fail = false;
const route = load({ "../../../_lib/accountPurchasesDb.server": { reconcileAccountRestore: async date => {
  calls++; if (fail || !Number.isFinite(date.getTime())) throw new Error("private failure"); return { checked: 3, removed: 2 };
} } })(path.join(__dirname, "route.ts"));
const request = (token, body, origin = "https://www.relationsvarning.se") => new NextRequest(origin + "/api/account-maintenance/reconcile", {
  method: "POST", headers: { authorization: token, origin, "content-type": "application/x-www-form-urlencoded" }, body,
});
(async () => {
  const body = "confirm=reconcile-isolated-restore&snapshotCreatedAt=2026-10-25T12%3A00%3A00Z";
  assert.equal((await route.POST(request("", body))).status, 401); assert.equal(calls, 0);
  assert.equal((await route.POST(request("Bearer " + process.env.CRON_SECRET, body))).status, 401);
  const token = "Bearer " + process.env.ACCOUNT_MAINTENANCE_SECRET;
  assert.equal((await route.POST(request(token, ""))).status, 400);
  assert.equal((await route.POST(request(token, body))).status, 200);
  fail = true;
  const failed = await route.POST(request(token, body)); assert.equal(failed.status, 503);
  assert(!JSON.stringify(await failed.json()).includes("private failure"));
  assert.equal(route.GET, undefined);
  console.log("PASS: reconciliation requires operator authorization, explicit confirmation and does not activate customer traffic.");
})().catch(error => { console.error(error); process.exitCode = 1; });
