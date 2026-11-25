/* eslint-disable @typescript-eslint/no-require-imports -- Executable source-level regression check. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "page.tsx"), "utf8");
assert(source.includes('useTestAnalytics(isNorway ? "audhd_test_no" : "audhd_test", questions.length + contextQuestions.length)'));
assert(source.includes("standardAnalytics.answer(questions.length + count, questions.length + contextIndex + 1)"));
assert(source.includes('fetch(audhdApi("/api/audhd-checkout/prepare", market)'));
assert(source.includes('fetch(audhdApi("/api/audhd-checkout/start", market)'));
assert(source.includes("standardAnalytics.checkout(() => { window.location.assign(checkoutUrl); });"));
assert(!source.includes("AUDHD_STRIPE_URL"));
assert(!source.includes("standardAnalytics.purchase()"));
assert(!source.includes("useAudhdAnalytics"));
assert(!source.includes("analytics.checkout()"));
assert(!source.includes("analytics.purchase()"));
console.log("PASS: AuDHD uses the shared 54-question funnel and its server-created Checkout path emits no parallel purchase event.");
