/* eslint-disable @typescript-eslint/no-require-imports -- account analytics privacy regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");
global.localStorage = { getItem: () => "granted", setItem: () => {} };
global.document = { referrer: "https://www.relationsvarning.se/mina-sidor/analyser/private-purchase", title: "Din analys" };
global.window = { location: { href: "https://www.relationsvarning.se/mina-sidor/analyser/private-purchase?secret=hidden", origin: "https://www.relationsvarning.se" }, dataLayer: [] };
const analytics = createLoader({ "./config": { GA_MEASUREMENT_ID: "G-TEST" } })(path.join(__dirname, "analytics.ts"));
analytics.initializeAnalytics(); analytics.pageView("/mina-sidor/analyser/private-purchase");
assert.equal(analytics.trackEvent("page_view", { page_path: "/mina-sidor/analyser/private-purchase" }), false);
assert.deepEqual(window.dataLayer, []);
assert.equal(window["ga-disable-G-TEST"], true);
assert.equal(analytics.safeLocation(window.location.href), "https://www.relationsvarning.se/mina-sidor");
window.location.href = "https://www.relationsvarning.se/test";
analytics.initializeAnalytics(); analytics.pageView("/test");
assert(!JSON.stringify(window.dataLayer).includes("private-purchase"), "private paths must not leak as initial location or referrer after leaving portal");
console.log("PASS: account views and events are excluded and private identifiers are stripped from subsequent analytics context.");
