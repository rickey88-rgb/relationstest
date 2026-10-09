/* eslint-disable @typescript-eslint/no-require-imports -- executable server-route regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

process.env.AUDHD_RECOVERY_TOKEN_SECRET = "test-recovery-secret-that-is-longer-than-thirty-two-characters";
process.env.AUDHD_RECOVERY_ISSUER_SECRET = "test-issuer-secret-that-is-longer-than-thirty-two-characters";
const recovery = createLoader()(path.join(__dirname, "../../../_lib/audhdRecovery.server.ts"));
const route = createLoader()(path.join(__dirname, "route.ts"));

function request(authorization) {
  return new NextRequest("https://www.relationsvarning.se/api/audhd-recovery/issue", {
    method: "POST",
    headers: authorization ? { authorization } : undefined,
  });
}

(async () => {
  let response = await route.POST(request());
  assert.equal(response.status, 404);
  assert.equal(await response.json().then(body => body.error), "Not found.");

  response = await route.POST(request("Bearer wrong-admin-secret"));
  assert.equal(response.status, 404);

  const issuedAt = Math.floor(Date.now() / 1000);
  response = await route.POST(request(`Bearer ${process.env.AUDHD_RECOVERY_ISSUER_SECRET}`));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  const body = await response.json();
  assert.deepEqual(Object.keys(body), ["recoveryUrl"]);
  const recoveryUrl = new URL(body.recoveryUrl);
  assert.equal(recoveryUrl.origin, "https://www.relationsvarning.se");
  assert.equal(recoveryUrl.pathname, "/api/audhd-recovery/redeem");
  const payload = recovery.verifyAudhdSupportRecoveryToken(recoveryUrl.searchParams.get("token"));
  assert(payload);
  assert(payload.exp >= issuedAt + (48 * 60 * 60));
  assert(payload.exp <= issuedAt + (48 * 60 * 60) + 1);

  const configuredIssuerSecret = process.env.AUDHD_RECOVERY_ISSUER_SECRET;
  delete process.env.AUDHD_RECOVERY_ISSUER_SECRET;
  response = await route.POST(request(`Bearer ${configuredIssuerSecret}`));
  assert.equal(response.status, 404);
  process.env.AUDHD_RECOVERY_ISSUER_SECRET = configuredIssuerSecret;

  console.log("PASS: AuDHD recovery issuance requires a server-side admin bearer secret and returns only a 48-hour, production-origin recovery URL.");
})().catch(error => { console.error(error); process.exitCode = 1; });
