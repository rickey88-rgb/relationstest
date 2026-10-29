/* eslint-disable @typescript-eslint/no-require-imports -- real local SQL/crypto, real signed legacy cookies, simulated Stripe/R2 only. */
const assert = require("node:assert/strict");
const { createHmac, createHash, randomBytes } = require("node:crypto");
const path = require("node:path");
const { NextRequest } = require("next/server");
const load = require("../../autism-test/test/test-loader.cjs")();
const run = require("./stage2-flow.test.cjs");
process.env.AUTISM_RECOVERY_TOKEN_SECRET = randomBytes(48).toString("base64url");
const recovery = load(path.join(__dirname, "../autismRecovery.server.ts"));
const redeem = load(path.join(__dirname, "../../api/autism-recovery/redeem/route.ts"));
const status = load(path.join(__dirname, "../../api/autism-recovery/status/route.ts"));
const factory = load(path.join(__dirname, "handlers.server.ts")).testAccountHandlers;
const origin = "https://www.relationsvarning.se";
function signed(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${createHmac("sha256", process.env.AUTISM_RECOVERY_TOKEN_SECRET).update(encoded).digest("base64url")}`;
}
const payload = { v: 1, product: "autism", kind: "support-recovery", exp: Math.floor(Date.now() / 1000) + 600, nonce: "synthetic-autism-support-12345" };
const token = signed(payload);
const supportResponse = redeem.GET(new NextRequest(`${origin}/api/autism-recovery/redeem?token=${encodeURIComponent(token)}`));
assert.equal(supportResponse.status, 303);
assert.equal(new URL(supportResponse.headers.get("location")).pathname, "/autism-test/test");
assert.equal(new URL(supportResponse.headers.get("location")).searchParams.get("recovery"), "success");
const cookie = supportResponse.cookies.get(recovery.AUTISM_RECOVERY_COOKIE);
assert(cookie && recovery.verifyAutismBrowserUnlockToken(cookie.value));
assert(cookie.httpOnly); assert.equal(cookie.sameSite, "lax"); assert.equal(cookie.path, "/"); assert.equal(cookie.maxAge, 365 * 86400);
const supportCookie = `${recovery.AUTISM_RECOVERY_COOKIE}=${cookie.value}`;
async function extraChecks({ stage, model, id, store, service, A, B, paymentCalls }) {
  assert.deepEqual(await status.GET(new NextRequest(`${origin}/api/autism-recovery/status`, { headers: { cookie: supportCookie } })).json(), { unlocked: true });
  assert.equal(recovery.verifyAutismSupportRecoveryToken(cookie.value), null, "browser token cannot be redeemed as support token");
  const before = paymentCalls();
  await assert.rejects(service.guestForProduct(id, cookie.value, model.product));
  await assert.rejects(service.save(id, cookie.value, A, "test-account-storage-v1", model.product));
  await assert.rejects(service.save(id, createHash("sha256").update(cookie.value).digest("base64url"), A, "test-account-storage-v1", model.product));
  const handlers = factory(model.product, model.slug, { accountIdentity: async () => ({ kind: "authenticated", userId: stage === "saved" ? B : A, email: "synthetic@example.invalid" }), save: service.save });
  const response = await handlers.POST(new NextRequest(`${origin}/api/test-accounts/autism/save`, {
    method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded", cookie: supportCookie },
    body: `id=${id}&consent=test-account-storage-v1&paid=true&email=synthetic%40example.invalid&userId=${A}`,
  }), { params: Promise.resolve({ action: "save" }) });
  assert.equal(response.status, 503, "valid support cookie plus authenticated account/local paid flag/email is not a purchase-possession proof");
  assert.equal(paymentCalls(), before, "unsupported legacy proof is denied before Stripe");
  if (stage === "prepared") { assert.equal(await store.owned(id, A), null); assert.equal((await store.list(A)).length, 0); }
  else {
    await assert.rejects(service.openForProduct(id, B, model.product)); assert.equal(paymentCalls(), before);
    assert(await store.owned(id, A), "support-cookie holder cannot take another account's analysis");
  }
}
(async () => {
  const unlocked = await status.GET(new NextRequest(`${origin}/api/autism-recovery/status`, { headers: { cookie: supportCookie } }));
  assert.match(unlocked.headers.get("cache-control"), /no-store/);
  for (const bad of [token + "x", signed({ ...payload, product: "audhd" }), signed({ ...payload, exp: Math.floor(Date.now() / 1000) - 1 }), cookie.value]) {
    const result = redeem.GET(new NextRequest(`${origin}/api/autism-recovery/redeem?token=${encodeURIComponent(bad)}`));
    assert.equal(new URL(result.headers.get("location")).searchParams.get("recovery"), "invalid");
    assert.equal(result.cookies.get(recovery.AUTISM_RECOVERY_COOKIE), undefined);
  }
  for (const bad of [cookie.value + "x", signed({ ...payload, kind: "browser-unlock", exp: Math.floor(Date.now() / 1000) - 1 }), token]) assert.deepEqual(await status.GET(new NextRequest(`${origin}/api/autism-recovery/status`, { headers: { cookie: `${recovery.AUTISM_RECOVERY_COOKIE}=${bad}` } })).json(), { unlocked: false });
  await run(["autism"], () => Array.from({ length: 30 }, (_, index) => index % 5), extraChecks);
  console.log("PASS: actual legacy redeem/status remain compatible, invalid tokens fail; valid support cookie cannot claim or access another account's analysis, while verified new purchases use the existing SQL/Stripe/erasure engine.");
})().catch(error => { console.error(error); process.exitCode = 1; });
