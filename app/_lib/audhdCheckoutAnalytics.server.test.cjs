/* eslint-disable @typescript-eslint/no-require-imports -- Executable parser regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

const analytics = createLoader()(path.join(__dirname, "audhdCheckoutAnalytics.server.ts"));

assert.deepEqual(
  analytics.parseAudhdCheckoutAnalyticsAttribution({ clientId: "123456789.987654321", sessionId: "1760000000" }),
  { clientId: "123456789.987654321", sessionId: "1760000000" },
);
for (const value of [null, {}, { clientId: "abc", sessionId: "1" }, { clientId: "1.2", sessionId: "0" }, { clientId: "1.2", sessionId: "1.5" }]) {
  assert.equal(analytics.parseAudhdCheckoutAnalyticsAttribution(value), null);
}
console.log("PASS: AuDHD accepts only bounded GA4 client/session attribution and treats it as optional.");
