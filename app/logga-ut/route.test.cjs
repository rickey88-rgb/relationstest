/* eslint-disable @typescript-eslint/no-require-imports -- executable sign-out route regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../autism-test/test/test-loader.cjs");

let signOuts = 0;
let clears = 0;
const route = createLoader({
  "../_lib/authSession.server": { privateCacheControl: "private, no-store" },
  "../_lib/supabase/routeClient.server": {
    createRouteSupabaseClient: () => ({ auth: { signOut: async () => { signOuts += 1; } } }),
    clearRouteAuthCookies: () => { clears += 1; },
  },
})(path.join(__dirname, "route.ts"));

(async () => {
  let response = await route.POST(new NextRequest("https://www.relationsvarning.se/logga-ut", { method: "POST" }));
  assert.equal(response.status, 403);
  assert.equal(signOuts, 0, "sign-out rejects a cross-site or missing-origin POST");

  response = await route.POST(new NextRequest("https://www.relationsvarning.se/logga-ut", { method: "POST", headers: { origin: "https://www.relationsvarning.se" } }));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "https://www.relationsvarning.se/");
  assert.equal(signOuts, 1);
  assert.equal(clears, 1, "local session cookies are always cleared after an accepted sign-out");
  assert.match(response.headers.get("cache-control"), /private, no-store/);
  console.log("PASS: sign-out requires same origin, is never cacheable, and clears browser Auth state.");
})().catch(error => { console.error(error); process.exitCode = 1; });
