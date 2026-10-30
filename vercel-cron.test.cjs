/* eslint-disable @typescript-eslint/no-require-imports -- executable Vercel Cron configuration regression test. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "vercel.json"), "utf8"));
assert.deepEqual(config.crons, [
  { path: "/api/cron/audhd-checkout-cleanup", schedule: "15 3 * * *" },
  { path: "/api/cron/account-analysis-cleanup", schedule: "0 2 * * *" },
  { path: "/api/cron/test-account-cleanup", schedule: "30 3 * * *" },
]);
console.log("PASS: approved account cleanup schedules at 02:00/03:30 UTC; existing 03:15 guest cron unchanged; no other jobs.");
