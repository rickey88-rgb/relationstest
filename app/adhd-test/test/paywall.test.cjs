/* eslint-disable @typescript-eslint/no-require-imports -- source-level paywall regression guard. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "page.tsx"), "utf8");
const start = source.indexOf('{!unlocked ? <section data-flow="paywall"');
const end = source.indexOf('</section> : <>', start);
assert(start >= 0 && end > start, "The locked ADHD result section must be identifiable.");
const paywall = source.slice(start, end);

assert(paywall.includes("freeResult.finding"));
assert(paywall.includes("freeResult.explanation"));
assert(paywall.includes("Se min fullständiga analys"));
assert(paywall.includes("Engångsbetalning · Ingen prenumeration."));
assert(!paywall.includes("{result.level}"), "Overall level must remain locked.");
assert(!paywall.includes("levelTexts[result.level]"), "Overall level explanation must remain locked.");
assert(!paywall.includes("result.symptomIndex"), "Index must remain locked.");

console.log("PASS: ADHD pre-purchase view keeps one response-derived finding and locks the overall result.");
