/* eslint-disable @typescript-eslint/no-require-imports -- Executable Node regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

const stored = new Map();
const storage = {
  getItem: key => stored.get(key) ?? null,
  setItem: (key, value) => stored.set(key, String(value)),
  removeItem: key => stored.delete(key),
  get length() { return stored.size; },
  key: index => [...stored.keys()][index] ?? null,
};
global.localStorage = storage;
global.document = { cookie: "", referrer: "", title: "Test" };
global.window = {
  localStorage: storage,
  sessionStorage: storage,
  location: { href: "https://www.relationsvarning.se/test", origin: "https://www.relationsvarning.se", hostname: "www.relationsvarning.se" },
  dataLayer: [],
  dispatchEvent: () => true,
};

const analytics = createLoader({ "./config": { GA_MEASUREMENT_ID: "G-TEST" } })(path.join(__dirname, "analytics.ts"));
analytics.setConsent("granted");
analytics.initializeAnalytics();
assert.equal(analytics.trackEvent("paywall_view", {
  test_id: "autism_test",
  test_name: "Autismtest för vuxna",
  attempt_id: "attempt-1",
  paywall_version: "personal-finding-v2",
  release_id: "rv-ga4-2026-10-08-etapp-1",
  price: 39,
  currency: "SEK",
  answers: "never-send",
  score: 99,
  profile_type: "never-send",
}), true);
const sent = Array.from(window.dataLayer.at(-1));
assert.equal(sent[0], "event");
assert.equal(sent[1], "paywall_view");
assert.deepEqual(sent[2], {
  test_id: "autism_test",
  test_name: "Autismtest för vuxna",
  attempt_id: "attempt-1",
  paywall_version: "personal-finding-v2",
  release_id: "rv-ga4-2026-10-08-etapp-1",
  price: 39,
  currency: "SEK",
  send_to: "G-TEST",
  transport_type: "beacon",
});
analytics.setConsent("denied");
const count = window.dataLayer.length;
assert.equal(analytics.trackEvent("begin_checkout", { test_id: "autism_test" }), false);
assert.equal(window.dataLayer.length, count);
console.log("PASS: GA4 allowlist retains funnel identity/version/release fields, filters sensitive fields, and respects denied consent.");
