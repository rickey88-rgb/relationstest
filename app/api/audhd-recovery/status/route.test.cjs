/* eslint-disable @typescript-eslint/no-require-imports -- executable server-route regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

process.env.AUDHD_RECOVERY_TOKEN_SECRET = "test-recovery-secret-that-is-longer-than-thirty-two-characters";
let active = true;
const recovery = createLoader()(path.join(__dirname, "../../../_lib/audhdRecovery.server.ts"));
const route = createLoader({
  "../../../_lib/audhdRecoveryDb.server": { isAudhdRecoveryGrantActive: async () => active },
})(path.join(__dirname, "route.ts"));
const token = recovery.issueAudhdBrowserUnlockToken("11111111-1111-4111-8111-111111111111");

(async () => {
  let response = await route.GET(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/status", { headers: { cookie: `rv_audhd_recovery_v2=${token}` } }));
  assert.deepEqual(await response.json(), { unlocked: true });
  active = false;
  response = await route.GET(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/status", { headers: { cookie: `rv_audhd_recovery_v2=${token}` } }));
  assert.deepEqual(await response.json(), { unlocked: false });
  response = await route.GET(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/status", { headers: { cookie: "rv_audhd_recovery=forged" } }));
  assert.deepEqual(await response.json(), { unlocked: false });
  console.log("PASS: AuDHD v2 recovery status requires both a valid signed cookie and an active redeemed database grant.");
})().catch(error => { console.error(error); process.exitCode = 1; });
