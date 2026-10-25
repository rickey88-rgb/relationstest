/* eslint-disable @typescript-eslint/no-require-imports -- executable privacy-safe recovery failure regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

const logs = [];
const originalError = console.error;
console.error = value => logs.push(String(value));
const route = createLoader({
  "../../../_lib/audhdRecovery.server": { AUDHD_RECOVERY_COOKIE: "rv_audhd_recovery_v2", verifyAudhdBrowserUnlockToken: value => value === "signed" ? { grantId: "11111111-1111-4111-8111-111111111111" } : null },
  "../../../_lib/audhdRecoveryDb.server": { loadAudhdRecoveryRestoreRecord: async () => { throw new Error("database failure with no identifiers logged"); } },
})(path.join(__dirname, "route.ts"));

(async () => {
  const response = await route.GET(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/restore", { headers: { cookie: "rv_audhd_recovery_v2=signed" } }));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("retry-after"), "2");
  assert.deepEqual(await response.json(), { restored: false, retryable: true });
  assert.deepEqual(JSON.parse(logs.at(-1)), { event: "audhd_recovery_restore_unavailable", reason: "restore_query_failed" });
  assert.equal(logs.some(value => /database failure|signed|11111111/.test(value)), false, "outer-catch log contains no raw error, cookie or grant ID");
  console.error = originalError;
  console.log("PASS: an unexpected recovery restore query failure stays retryable and emits only the safe failure code.");
})().catch(error => { console.error = originalError; console.error(error); process.exitCode = 1; });
