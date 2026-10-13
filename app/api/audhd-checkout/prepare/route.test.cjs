/* eslint-disable @typescript-eslint/no-require-imports -- executable server-route regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

process.env.NODE_ENV = "test";
let stored = null;
const route = createLoader({
  "../../../_lib/audhdCheckoutAttempt.server": {
    AUDHD_CHECKOUT_ATTEMPT_COOKIE: "rv_audhd_checkout_attempt",
    audhdCheckoutAttemptCookieMaxAge: 604800,
    parseAudhdCheckoutAnswers: body => body?.valid ? { reportVersion: "audhd-v1", answers: Array(48).fill(2), contextAnswers: Array(6).fill(2) } : null,
    issueAudhdCheckoutBrowserSecret: () => "browser-secret",
    hashAudhdCheckoutBrowserSecret: value => `hash:${value}`,
    encryptAudhdCheckoutAnswers: () => ({ ciphertext: "ciphertext", iv: "iv", authTag: "tag" }),
  },
  "../../../_lib/audhdCheckoutAttemptsDb.server": { createAudhdCheckoutAttempt: async value => { stored = value; return { id: "11111111-1111-4111-8111-111111111111" }; } },
})(path.join(__dirname, "route.ts"));

function request(body, origin = "http://localhost:3000") {
  return new NextRequest("http://localhost:3000/api/audhd-checkout/prepare", { method: "POST", headers: origin ? { origin, "content-type": "application/json" } : undefined, body: JSON.stringify(body) });
}

(async () => {
  let response = await route.POST(request({ valid: true }, "https://evil.example"));
  assert.equal(response.status, 404);

  response = await route.POST(request({ valid: false }));
  assert.equal(response.status, 400);

  response = await route.POST(request({ valid: true }));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { attemptId: "11111111-1111-4111-8111-111111111111" });
  assert.deepEqual(stored, { ciphertext: "ciphertext", iv: "iv", authTag: "tag", browserSecretHash: "hash:browser-secret", reportVersion: "audhd-v1" });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /SameSite=lax/i);
  assert.match(response.headers.get("set-cookie"), /Max-Age=604800/);
  assert.match(response.headers.get("set-cookie"), /Path=\//);
  process.env.NODE_ENV = "production";
  response = await route.POST(request({ valid: true }, "https://relationsvarning.se"));
  assert.equal(response.status, 404, "the apex cannot set a competing host-only browser secret");
  response = await route.POST(request({ valid: true }, "https://www.relationsvarning.se"));
  assert.equal(response.status, 201);
  process.env.NODE_ENV = "test";
  console.log("PASS: AuDHD checkout preparation accepts only same-origin valid drafts and returns an opaque attempt ID with an HttpOnly browser secret.");
})().catch(error => { console.error(error); process.exitCode = 1; });
