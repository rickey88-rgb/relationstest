/* eslint-disable @typescript-eslint/no-require-imports -- Executable source-level regression check. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "page.tsx"), "utf8");
assert(source.includes('useTestAnalytics("audhd_test", questions.length + contextQuestions.length)'));
assert(source.includes("standardAnalytics.answer(questions.length + count, questions.length + contextIndex + 1)"));
assert(source.includes("standardAnalytics.checkout(() => { window.location.href = AUDHD_STRIPE_URL; });"));
assert(source.includes("standardAnalytics.purchase()"));
assert(!source.includes("useAudhdAnalytics"));
assert(!source.includes("analytics.checkout()"));
assert(!source.includes("analytics.purchase()"));
console.log("PASS: AuDHD uses the shared 54-question funnel and emits no parallel checkout or purchase event.");
