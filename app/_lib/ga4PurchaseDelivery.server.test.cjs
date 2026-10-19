/* eslint-disable @typescript-eslint/no-require-imports -- executable source-level delivery contract test. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "ga4PurchaseDelivery.server.ts"), "utf8");
assert(source.includes('name: "purchase"'));
assert(source.includes('name: "audhd_verified_purchase"'));
assert(source.includes("transaction_id: delivery.transaction_id"));
assert(source.includes("value: 79"));
assert(source.includes('currency: "SEK"'));
assert(source.includes("session_id: Number(delivery.ga4_session_id)"));
assert(source.includes("payment.paid_at"));
assert(source.includes("timestamp_micros: timestampMicros"));
assert(source.includes("MAX_GA4_BACKDATE_MS"));
assert(source.includes("GA4_MEASUREMENT_PROTOCOL_API_SECRET"));
assert(source.includes("delivered_at = now()"));
assert(source.includes("ga4_client_id = null"));

const helper = source.match(/function paidAtTimestampMicros[\s\S]*?\r?\n}\r?\n\r?\nfunction database/);
assert(helper, "the paid-at timestamp helper must exist");
const maxBackdate = source.match(/const MAX_GA4_BACKDATE_MS = [^;]+;/);
assert(maxBackdate, "the GA4 backdate limit must exist");
const helperSource = `${maxBackdate[0]}\nexport ${helper[0].replace(/\r?\n\r?\nfunction database$/, "")}`;
const helperModule = { exports: {} };
Function("exports", "module", ts.transpileModule(helperSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(helperModule.exports, helperModule);
const { paidAtTimestampMicros } = helperModule.exports;
const now = Date.UTC(2026, 9, 19, 12, 0, 0);
assert.equal(paidAtTimestampMicros(new Date(now), now), now * 1000);
assert.equal(paidAtTimestampMicros(new Date(now - 72 * 60 * 60 * 1000), now), (now - 72 * 60 * 60 * 1000) * 1000);
assert.equal(paidAtTimestampMicros(new Date(now - 72 * 60 * 60 * 1000 - 1), now), null);
assert.equal(paidAtTimestampMicros(new Date(now + 1), now), null);
console.log("PASS: GA4 outbox delivery sends the verified AuDHD purchase schema and clears pseudonymous retry data after acknowledgement.");
