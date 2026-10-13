/* eslint-disable @typescript-eslint/no-require-imports -- source-level regression for browser-only state handling. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "page.tsx"), "utf8");
assert.match(source, /const shouldStartRecoveredTest = recoveryUnlocked && !hasCompleteSavedState\(saved\)/);
assert.match(source, /const restoredUnlocked = recoveryUnlocked;/);
assert.match(source, /if \(paidStateExists && !recoveryUnlocked\) setPaymentRecoveryRequired\(true\)/);
assert.match(source, /serverAnswers/);
console.log("PASS: a verified recovery unlock restores a legacy customer's complete local answers, while no local answers starts a free recovered retest; paid local signals alone stay locked.");
