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
assert.match(css, /@page\s+audhd-report\s*\{\s*size:\s*A4;\s*margin:\s*14mm 15mm/);
assert.match(css, /#audhd-print-report\s*\{[^}]*page:\s*audhd-report/s);
assert.match(css, /#audhd-print-report\s*>\s*section,[\s\S]*?break-inside:\s*avoid;\s*page-break-inside:\s*avoid/);
assert.match(css, /#audhd-print-report h2,[\s\S]*?break-after:\s*avoid;\s*page-break-after:\s*avoid/);
assert.match(css, /\.audhd-print-actions\s*\{\s*display:\s*none/);
assert.doesNotMatch(css, /#audhd-print-report[^}]*\{[^}]*(?:max-height|overflow:\s*hidden)/s, "the report must not be cropped during printing");
console.log("PASS: the report prints directly with report content visible and actions hidden.");
