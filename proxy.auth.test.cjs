/* eslint-disable @typescript-eslint/no-require-imports -- executable proxy regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("./app/autism-test/test/test-loader.cjs");

let refreshed = 0;
let signedIn = null;
const proxyModule = createLoader({
  "./app/_lib/authConfig.server": {
    ACCOUNT_PATH: "/mina-sidor",
    LOGIN_PATH: "/logga-in",
    loginUrl: (origin, status) => new URL(`/logga-in${status ? `?status=${status}` : ""}`, origin),
  },
  "./app/_lib/authSession.server": {
    privateCacheControl: "private, no-store",
    refreshAuthSession: async (_request, response) => { refreshed += 1; response.headers.set("cache-control", "private, no-store"); return signedIn; },
    copyResponseCookies: (_source, destination) => destination,
  },
})(path.join(__dirname, "proxy.ts"));

(async () => {
  let response = await proxyModule.proxy(new NextRequest("https://relationsvarning.se/mina-sidor"));
  assert.equal(response.status, 308);
  assert.equal(new URL(response.headers.get("location")).hostname, "www.relationsvarning.se");
  assert.equal(refreshed, 0, "canonical redirect occurs before any Auth cookie handling");

  response = await proxyModule.proxy(new NextRequest("https://www.relationsvarning.se/api/audhd-checkout/return"));
  assert.equal(response.status, 200);
  assert.equal(refreshed, 0, "existing Checkout routes remain anonymous");

  response = await proxyModule.proxy(new NextRequest("https://www.relationsvarning.se/mina-sidor"));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "https://www.relationsvarning.se/logga-in");
  assert.equal(refreshed, 1);

  signedIn = { id: "authenticated-user" };
  response = await proxyModule.proxy(new NextRequest("https://www.relationsvarning.se/mina-sidor"));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /private, no-store/);
  console.log("PASS: proxy keeps canonical Checkout-cookie handling, bypasses payment routes, and protects only Mina sidor.");
})().catch(error => { console.error(error); process.exitCode = 1; });
