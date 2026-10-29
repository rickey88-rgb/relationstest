/* eslint-disable @typescript-eslint/no-require-imports -- account HTTP security regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../autism-test/test/test-loader.cjs");
const userA = "11111111-1111-4111-8111-111111111111";
const userB = "22222222-2222-4222-8222-222222222222";
let user = null, authFailure = false, ready = true, cleanupHealthy = true, proofKind = "verified", saves = [], removals = [], lists = [];
const http = createLoader({ "./authSession.server": { authenticatedUser: async () => { if (authFailure) throw new Error("offline"); return user; } } })(path.join(__dirname, "../../_lib/accountHttp.server.ts"));
const proof = { kind: "verified", fingerprint: "safe-preview", source: "checkout", payment: { checkoutSessionId: "cs_live_test" }, encrypted: {} };
const store = {
  accountStorageReady: async () => ready,
  accountCleanupHealth: async () => ({ healthy: cleanupHealthy }),
  listAccountPurchases: async owner => { lists.push(owner); return []; },
  saveAccountAudhdPurchase: async (owner, candidate) => { saves.push({ owner, candidate }); return { kind: "saved", purchaseId: userA }; },
  removeOwnedAccountAnalysis: async (owner, id) => { removals.push({ owner, id }); return id === userA; },
};
const claim = createLoader({ "../../../../_lib/accountHttp.server": http, "../../../../_lib/accountPurchasesDb.server": store,
  "../../../../_lib/accountAudhdProof.server": { resolveAccountAudhdProof: async () => proofKind === "verified" ? proof : { kind: proofKind } },
})(path.join(__dirname, "purchases/claim/route.ts"));
const list = createLoader({ "../../../_lib/accountHttp.server": http, "../../../_lib/accountPurchasesDb.server": store })(path.join(__dirname, "purchases/route.ts"));
const remove = createLoader({ "../../../../../../_lib/accountHttp.server": http, "../../../../../../_lib/accountPurchasesDb.server": store })(path.join(__dirname, "purchases/[purchaseId]/analysis/delete/route.ts"));
function post(pathname, body, origin = "https://www.relationsvarning.se") {
  return new NextRequest(`https://www.relationsvarning.se${pathname}`, { method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded" }, body });
}
const form = "source=checkout&fingerprint=safe-preview&consent=account-analysis-v1&userId=" + userB + "&session_id=forged";
(async () => {
  assert.equal((await list.GET()).status, 401);
  assert.equal((await claim.POST(post("/api/account/purchases/claim", form))).status, 401);
  user = { id: userA, email_confirmed_at: "2026-01-01", is_anonymous: false };
  assert.equal((await claim.POST(post("/api/account/purchases/claim", form, "https://attacker.test"))).status, 403);
  assert.equal((await claim.POST(post("/api/account/purchases/claim", "source=checkout&fingerprint=safe-preview"))).status, 400);
  await claim.POST(post("/api/account/purchases/claim", form.replace("safe-preview", "different-purchase")));
  assert.equal(saves.length, 0, "proof preview must still identify the current cookie-bound purchase");
  cleanupHealthy = false;
  assert.match((await claim.POST(post("/api/account/purchases/claim", form))).headers.get("location"), /unavailable/);
  assert.equal(saves.length, 0, "new storage is blocked before cleanup succeeds or while cleanup health fails");
  cleanupHealthy = true;
  const saved = await claim.POST(post("/api/account/purchases/claim", form));
  assert.equal(saved.status, 303);
  assert.equal(saves[0].owner, userA, "caller-supplied user id is ignored");
  assert.equal(saves[0].candidate.payment.checkoutSessionId, "cs_live_test", "caller-supplied Stripe session is ignored");
  assert.match(saved.headers.get("cache-control"), /no-store/);
  proof.encrypted = null;
  const history = await claim.POST(post("/api/account/purchases/claim", form.replace("account-analysis-v1", "account-purchase-v1")));
  assert.match(history.headers.get("location"), /purchase-linked/);
  proof.encrypted = {};
  await list.GET(new NextRequest("https://www.relationsvarning.se/api/account/purchases?user_id=" + userB));
  assert.deepEqual(lists, [userA]);
  ready = false; assert.equal((await list.GET()).status, 503); ready = true;
  assert.equal((await remove.POST(post("/api/account/x", "confirm=delete-analysis&userId=" + userB), { params: Promise.resolve({ purchaseId: userB }) })).status, 404);
  assert.deepEqual(removals[0], { owner: userA, id: userB });
  assert.equal((await remove.POST(post("/api/account/x", "confirm=delete-analysis"), { params: Promise.resolve({ purchaseId: userA }) })).status, 303);
  assert.equal((await claim.POST(post("/api/account/purchases/claim", form + "&padding=" + "x".repeat(5000)))).status, 400);
  proofKind = "unavailable";
  const count = saves.length;
  assert.match((await claim.POST(post("/api/account/purchases/claim", form))).headers.get("location"), /unavailable/);
  assert.equal(saves.length, count);
  user = { id: userB, email: "same-address@example.test", email_confirmed_at: "2026-01-01", is_anonymous: false };
  proofKind = "denied";
  assert.match((await claim.POST(post("/api/account/purchases/claim", form + "&email=same-address%40example.test"))).headers.get("location"), /proof-required/);
  assert.equal(saves.length, count, "a verified email and a client-supplied matching email never replace purchase-bound proof");
  authFailure = true; assert.equal((await list.GET()).status, 503); authFailure = false;
  user = { id: userA, email_confirmed_at: null };
  assert.equal((await list.GET()).status, 401, "unverified account does not access purchases");
  assert.equal(claim.GET, undefined); assert.equal(remove.GET, undefined);
  console.log("PASS: account APIs enforce verified auth, same-origin POST, consent, purchase-bound proof, bounded bodies and server-derived ownership.");
})().catch(error => { console.error(error); process.exitCode = 1; });
