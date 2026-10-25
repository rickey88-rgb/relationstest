/* eslint-disable @typescript-eslint/no-require-imports -- executable configuration regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");
const auth = createLoader()(path.join(__dirname, "authConfig.server.ts"));

assert.equal(auth.applicationOrigin({ NODE_ENV: "production" }), "https://www.relationsvarning.se");
assert.equal(auth.applicationOrigin({ NODE_ENV: "development" }), "http://localhost:3000");
assert.equal(auth.applicationOrigin({ NODE_ENV: "production", AUTH_SITE_URL: "https://staging.example.test" }), "https://staging.example.test");
assert.throws(() => auth.applicationOrigin({ AUTH_SITE_URL: "https://example.test/path" }), /AUTH_SITE_URL/);
assert.equal(auth.authConfirmUrl({ NODE_ENV: "production" }), "https://www.relationsvarning.se/auth/confirm");
assert.equal(auth.validLoginEmail("  customer@example.test "), "customer@example.test");
assert.equal(auth.validLoginEmail("not-an-email"), null);
assert.equal(auth.loginUrl("https://www.relationsvarning.se", "invalid-link").toString(), "https://www.relationsvarning.se/logga-in?status=invalid-link");
console.log("PASS: Auth URLs are fixed, validation is conservative, and no caller-controlled redirect is accepted.");
