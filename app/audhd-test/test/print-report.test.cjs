/* eslint-disable @typescript-eslint/no-require-imports -- executable print regression checks. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const page = fs.readFileSync(path.join(__dirname, "page.tsx"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "../../globals.css"), "utf8");
assert.match(page, /id="audhd-print-report"/);
assert.match(page, /onClick=\{\(\) => window\.print\(\)\}/);
assert.doesNotMatch(page, /window\.open\(/, "the report must not depend on a popup window");
assert.match(css, /@media print\s*\{/);
assert.match(css, /#audhd-print-report\s*\*\s*\{\s*visibility:\s*visible/);
assert.match(css, /\.audhd-print-actions\s*\*\s*\{\s*visibility:\s*hidden/);
console.log("PASS: the report prints directly with report content visible and actions hidden.");
