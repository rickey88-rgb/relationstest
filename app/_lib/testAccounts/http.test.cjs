/* eslint-disable @typescript-eslint/no-require-imports -- synthetic HTTP, disabled-flow and anonymous guest regression tests. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../autism-test/test/test-loader.cjs");
let user = null, saves = [], deletes = [], checkoutCalls = 0;
const http = createLoader({ "./authSession.server": { authenticatedUser: async () => user } })(path.join(__dirname, "../accountHttp.server.ts"));
const route = createLoader({ "../../../../_lib/accountHttp.server": http,
  "../../../../_lib/testAccounts/store.server": { createAttempt: async () => { checkoutCalls++; throw new Error("not reached when disabled"); } },
  "../../../../_lib/testAccounts/payment.server": { paymentConfig: () => { checkoutCalls++; throw new Error("not reached when disabled"); } },
  "../../../../_lib/testAccounts/service.server": { save: async (...args) => saves.push(args), remove: async (...args) => deletes.push(args), prepareLegacyImport: () => { throw new Error("No verified historic proof"); } },
})(path.join(__dirname, "../../api/test-accounts/adhd/[action]/route.ts"));
const A = "11111111-1111-4111-8111-111111111111";
function request(action, body = "", origin = "https://www.relationsvarning.se") {
  return new NextRequest(`https://www.relationsvarning.se/api/test-accounts/adhd/${action}`, { method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded", cookie: "rv_test_accounts_browser=synthetic-browser-proof" }, body });
}
const params = action => ({ params: Promise.resolve({ action }) });
(async () => {
  const caps = await route.GET(request("capabilities"), params("capabilities"));
  assert.deepEqual(await caps.json(), { checkout: false }); assert.match(caps.headers.get("cache-control"), /no-store/);
  assert.equal((await route.POST(request("checkout", "payload={}"), params("checkout"))).status, 503);
  assert.equal(checkoutCalls, 0, "disabled checkout performs no database or Stripe work");
  assert.equal((await route.POST(request("save"), params("save"))).status, 401);
  user = { id: A, email_confirmed_at: "2026-01-01", is_anonymous: false };
  assert.equal((await route.POST(request("save", "id=x", "https://attacker.invalid"), params("save"))).status, 403);
  assert.equal((await route.POST(request("save", "x=" + "a".repeat(5000)), params("save"))).status, 400);
  assert.equal((await route.POST(request("save", "id=purchase&consent=test-account-storage-v1&owner=forged&paid=true"), params("save"))).status, 303);
  assert.equal(saves[0][2], A, "owner always comes from verified Auth, never posted owner/email");
  assert.equal(saves[0][1], "synthetic-browser-proof");
  await route.POST(request("delete", "id=purchase&owner=forged"), params("delete")); assert.deepEqual(deletes[0], ["purchase", A]);
  assert.equal((await route.POST(request("legacy-import", "paid=true&email=synthetic@example.invalid"), params("legacy-import"))).status, 503);
  user = { id: A, is_anonymous: true }; assert.equal((await route.POST(request("save"), params("save"))).status, 401);
  let authCalls = 0;
  const { proxy } = createLoader({ "./app/_lib/authConfig.server": { ACCOUNT_PATH: "/mina-sidor", loginUrl: origin => new URL("/logga-in", origin) },
    "./app/_lib/authSession.server": { refreshAuthSession: async () => { authCalls++; return null; }, copyResponseCookies: (_, to) => to },
  })(path.join(__dirname, "../../../proxy.ts"));
  assert.equal((await proxy(new NextRequest(`https://www.relationsvarning.se/mina-sidor/gast/adhd/${A}`))).status, 200);
  assert.equal(authCalls, 0, "verified guest reports are accessible without an account");
  for (const pathname of ["/mina-sidor", "/mina-sidor/tester", `/mina-sidor/tester/adhd/${A}`, "/mina-sidor/analyser/private", `/mina-sidor/gast/adhd/${A}/other`, "/mina-sidor/gast/adhd/invalid"]) assert.equal((await proxy(new NextRequest(`https://www.relationsvarning.se${pathname}`))).status, 303);
  console.log("PASS: CSRF/body limits/Auth identity, disabled checkout isolation, fail-closed legacy import and narrowly scoped anonymous guest exception.");
})().catch(error => { console.error(error); process.exitCode = 1; });
