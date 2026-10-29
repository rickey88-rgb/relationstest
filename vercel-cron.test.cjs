/* eslint-disable @typescript-eslint/no-require-imports -- executable Vercel Cron configuration regression test. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "vercel.json"), "utf8"));
assert.deepEqual(config.crons, [
  { path: "/api/cron/audhd-checkout-cleanup", schedule: "15 3 * * *" },
]);
console.log("PASS: only the existing AuDHD guest cron is registered; account jobs require a later approved release.");
