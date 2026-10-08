/* eslint-disable @typescript-eslint/no-require-imports -- Executable browser-flow regression harness. */
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
const timers = [];
const cleared = [];
global.localStorage = storage;
global.document = { cookie: "", referrer: "", title: "Test" };
global.window = {
  localStorage: storage,
  sessionStorage: storage,
  location: { href: "https://www.relationsvarning.se/adhd-test/test", origin: "https://www.relationsvarning.se", hostname: "www.relationsvarning.se" },
  dataLayer: [],
  setTimeout: (callback, delay) => { const timer = { callback, delay }; timers.push(timer); return timer; },
  clearTimeout: timer => { cleared.push(timer); },
  dispatchEvent: () => true,
};

const analytics = createLoader({ "./config": { GA_MEASUREMENT_ID: "G-TEST" } })(path.join(__dirname, "analytics.ts"));
const params = { test_id: "adhd_test", test_name: "ADHD-test för vuxna", attempt_id: "attempt-1", value: 39, currency: "SEK", items: [{ item_id: "adhd_test", item_name: "ADHD-test för vuxna", price: 39, quantity: 1 }] };

analytics.setConsent("granted");
analytics.initializeAnalytics();
let navigations = 0;
assert.equal(analytics.trackEventBeforeNavigation("begin_checkout", params, () => { navigations += 1; }), true);
let event = Array.from(window.dataLayer.at(-1));
assert.equal(event[0], "event");
assert.equal(event[1], "begin_checkout");
assert.equal(event[2].event_timeout, 500);
assert.equal(timers.at(-1).delay, 500);
event[2].event_callback();
event[2].event_callback();
assert.equal(navigations, 1, "callback navigates exactly once");
assert.equal(cleared.length, 1, "callback clears the fallback timeout");

navigations = 0;
assert.equal(analytics.trackEventBeforeNavigation("begin_checkout", params, () => { navigations += 1; }), true);
timers.at(-1).callback();
timers.at(-1).callback();
assert.equal(navigations, 1, "timeout navigates exactly once when GA never calls back");

analytics.setConsent("denied");
const eventCount = window.dataLayer.length;
navigations = 0;
assert.equal(analytics.trackEventBeforeNavigation("begin_checkout", params, () => { navigations += 1; }), false);
assert.equal(navigations, 1, "blocked analytics never blocks checkout navigation");
assert.equal(window.dataLayer.length, eventCount, "blocked analytics does not enqueue checkout tracking");

let dispatched = 0;
let checkoutNavigations = 0;
const checkoutEvents = createLoader({
  "./analytics": {
    ATTEMPT_PREFIX: "attempt:",
    consent: () => "granted",
    trackEvent: () => true,
    trackEventBeforeNavigation: (_name, _params, finish) => { dispatched += 1; finish(); return true; },
  },
  "./config": {
    ANALYTICS_RELEASE_ID: "test-release",
    testConfig: { adhd_test: { name: "ADHD-test för vuxna", price: 39, currency: "SEK" } },
  },
})(path.join(__dirname, "testEvents.ts"));
checkoutEvents.clearAttemptMemory();
checkoutEvents.checkoutEvent("adhd_test", () => { checkoutNavigations += 1; });
checkoutEvents.checkoutEvent("adhd_test", () => { checkoutNavigations += 1; });
assert.equal(dispatched, 1, "rapid repeat clicks dispatch one begin_checkout event");
assert.equal(checkoutNavigations, 1, "rapid repeat clicks navigate once");

console.log("PASS: checkout navigation waits for GA callback or a 500 ms timeout, proceeds when analytics is blocked, and ignores rapid duplicate clicks.");
