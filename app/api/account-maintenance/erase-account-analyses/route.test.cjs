/* eslint-disable @typescript-eslint/no-require-imports -- account erasure operator tests. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const load = require("../../../autism-test/test/test-loader.cjs");
process.env.ACCOUNT_MAINTENANCE_SECRET = "synthetic-erasure-secret-at-least-32-characters";
let mode = "active", calls = 0, fail = false;
const route = load({
  "../../../_lib/accountErasureJournal.server": { accountStorageMode: () => mode },
  "../../../_lib/accountPurchasesDb.server": {
    validAccountRecordId: id => id === "11111111-1111-4111-8111-111111111111",
    eraseAccountPortalAnalyses: async () => { calls++; if (fail) throw new Error("private failure"); },
  },
})(path.join(__dirname, "route.ts"));
const request = (token, body) => new NextRequest("https://www.relationsvarning.se/api/account-maintenance/erase-account-analyses", {
  method: "POST", headers: { authorization: token, origin: "https://www.relationsvarning.se", "content-type": "application/x-www-form-urlencoded" }, body,
});
(async () => {
  const body = "confirm=erase-account-analyses&userId=11111111-1111-4111-8111-111111111111", token = "Bearer " + process.env.ACCOUNT_MAINTENANCE_SECRET;
  assert.equal((await route.POST(request("", body))).status, 401);
  assert.equal((await route.POST(request(token, body))).status, 503); assert.equal(calls, 0);
  mode = "maintenance";
  assert.equal((await route.POST(request(token, ""))).status, 400);
  const success = await route.POST(request(token, body)); assert.equal(success.status, 200);
  assert.equal((await success.json()).authUserDeleted, false);
  fail = true; assert.equal((await route.POST(request(token, body))).status, 503);
  assert.equal(route.GET, undefined);
  console.log("PASS: operator account erasure requires maintenance, valid target and confirmation, and never deletes Auth users.");
})().catch(error => { console.error(error); process.exitCode = 1; });
