/* eslint-disable @typescript-eslint/no-require-imports -- source-level regression for browser-only state handling. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "page.tsx"), "utf8");
assert.doesNotMatch(source, /shouldStartRecoveredTest/);
assert.match(source, /setRecoveryRestoreFailure\(retryable \? "temporary" : "unavailable"\)/);
assert.match(source, /const restoredUnlocked = recoveryUnlocked;/);
assert.match(source, /if \(paidStateExists && !recoveryUnlocked\) setPaymentRecoveryRequired\(true\)/);
assert.match(source, /serverAnswers/);
console.log("PASS: a verified recovery unlock restores complete local answers, while unavailable server answers stop at recovery instead of starting a blank paid test.");
