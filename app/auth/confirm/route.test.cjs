/* eslint-disable @typescript-eslint/no-require-imports -- executable Magic Link callback regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../autism-test/test/test-loader.cjs");

let outcome = "success";
let verification = null;
const route = createLoader({
  "../../_lib/authConfig.server": {
    ACCOUNT_PATH: "/mina-sidor",
    loginUrl: (origin, status) => new URL(`/logga-in${status ? `?status=${status}` : ""}`, origin),
  },
  "../../_lib/authSession.server": { privateCacheControl: "private, no-store" },
  "../../_lib/supabase/routeClient.server": {
    createRouteSupabaseClient: () => ({
      auth: {
        verifyOtp: async input => {
          verification = input;
          if (outcome === "throw") throw new Error("transport unavailable");
          return { error: outcome === "error" ? new Error("expired") : null };
        },
      },
    }),
  },
})(path.join(__dirname, "route.ts"));

(async () => {
  let response = await route.GET(new NextRequest("https://www.relationsvarning.se/auth/confirm?token_hash=safe-token-value&type=email"));
  assert.equal(response.status, 200);
  assert.match(await response.text(), /<form method="post" action="\/auth\/confirm">/);
  assert.equal(verification, null, "a mail scanner GET must never consume a Magic Link");
  assert.match(response.headers.get("content-security-policy"), /form-action 'self'/);

  response = await route.POST(new NextRequest("https://www.relationsvarning.se/auth/confirm", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token_hash: "safe-token-value", type: "email" }),
  }));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "https://www.relationsvarning.se/mina-sidor");
  assert.deepEqual(verification, { token_hash: "safe-token-value", type: "email" });
  assert.match(response.headers.get("cache-control"), /private, no-store/);
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");

  verification = null;
  response = await route.GET(new NextRequest("https://www.relationsvarning.se/auth/confirm?token_hash=safe-token-value&type=recovery"));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "https://www.relationsvarning.se/logga-in?status=invalid-link");
  assert.equal(verification, null, "only email Magic Links may establish an account session");

  outcome = "error";
  response = await route.POST(new NextRequest("https://www.relationsvarning.se/auth/confirm", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token_hash: "safe-token-value", type: "email" }),
  }));
  assert.equal(response.headers.get("location"), "https://www.relationsvarning.se/logga-in?status=invalid-link");

  outcome = "throw";
  response = await route.POST(new NextRequest("https://www.relationsvarning.se/auth/confirm", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token_hash: "safe-token-value", type: "email" }),
  }));
  assert.equal(response.headers.get("location"), "https://www.relationsvarning.se/logga-in?status=unavailable");
  console.log("PASS: Magic Link callback requires an explicit POST, accepts only email token hashes, and fails with a safe retry path.");
})().catch(error => { console.error(error); process.exitCode = 1; });
