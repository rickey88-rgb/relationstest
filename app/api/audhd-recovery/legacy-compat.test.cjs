/* eslint-disable @typescript-eslint/no-require-imports -- executable compatibility regression test. */
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../autism-test/test/test-loader.cjs");

process.env.AUDHD_RECOVERY_TOKEN_SECRET = "test-recovery-secret-that-is-longer-than-thirty-two-characters";
const recovery = createLoader()(path.join(__dirname, "../../_lib/audhdRecovery.server.ts"));
function legacyToken(kind, exp) {
  const payload = Buffer.from(JSON.stringify({ v: 1, product: "audhd", kind, exp, nonce: "legacy-nonce-long-enough" })).toString("base64url");
  return `${payload}.${createHmac("sha256", process.env.AUDHD_RECOVERY_TOKEN_SECRET).update(payload).digest("base64url")}`;
}
function postRecovery(token) {
  return redeemRoute.POST(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/redeem", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token }) }));
}
let v2RedeemCalls = 0;
const redeemRoute = createLoader({
  "../../../_lib/audhdRecoveryDb.server": { redeemAudhdRecoveryGrant: async () => { v2RedeemCalls += 1; return "11111111-1111-4111-8111-111111111111"; } },
})(path.join(__dirname, "redeem/route.ts"));
let active = false;
const statusRoute = createLoader({ "../../../_lib/audhdRecoveryDb.server": { isAudhdRecoveryGrantActive: async () => active } })(path.join(__dirname, "status/route.ts"));

(async () => {
  const now = Math.floor(Date.now() / 1000), validLink = legacyToken("support-recovery", now + 120);
  let response = await redeemRoute.GET(new NextRequest(`https://www.relationsvarning.se/api/audhd-recovery/redeem?token=${validLink}`));
  assert.equal(response.status, 200); assert.equal(response.headers.get("set-cookie"), null, "legacy links also require an explicit POST");
  response = await postRecovery(validLink);
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=success");
  assert.match(response.headers.get("set-cookie"), /rv_audhd_recovery=/); assert.doesNotMatch(response.headers.get("set-cookie"), /rv_audhd_recovery_v2=/); assert.match(response.headers.get("set-cookie"), /Max-Age=1(1[0-9]|20)/);
  response = await postRecovery(legacyToken("support-recovery", now - 1));
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=invalid");
  const legacyCookie = recovery.issueAudhdLegacyBrowserUnlockToken(now + 300);
  response = await statusRoute.GET(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/status", { headers: { cookie: `rv_audhd_recovery=${legacyCookie}` } }));
  assert.deepEqual(await response.json(), { unlocked: true });
  const v2Cookie = recovery.issueAudhdBrowserUnlockToken("11111111-1111-4111-8111-111111111111");
  response = await statusRoute.GET(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/status", { headers: { cookie: `rv_audhd_recovery=${v2Cookie}` } }));
  assert.deepEqual(await response.json(), { unlocked: false }); active = true;
  response = await statusRoute.GET(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/status", { headers: { cookie: `rv_audhd_recovery=${legacyCookie}; rv_audhd_recovery_v2=${v2Cookie}` } }));
  assert.deepEqual(await response.json(), { unlocked: true });
  response = await statusRoute.GET(new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/status", { headers: { cookie: `rv_audhd_recovery_v2=${v2Cookie}` } }));
  assert.deepEqual(await response.json(), { unlocked: true });
  response = await redeemRoute.GET(new NextRequest(`https://www.relationsvarning.se/api/audhd-recovery/redeem?token=${validLink}x`));
  assert.equal(response.status, 200, "even malformed links are inert on GET");
  response = await postRecovery(`${validLink}x`);
  assert.equal(new URL(response.headers.get("location")).search, "?recovery=invalid"); assert.equal(v2RedeemCalls, 0);
  console.log("PASS: v1 links/cookies remain compatible and require an explicit POST.");
})().catch(error => { console.error(error); process.exitCode = 1; });
