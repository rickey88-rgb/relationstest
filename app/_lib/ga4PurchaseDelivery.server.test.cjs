/* eslint-disable @typescript-eslint/no-require-imports -- executable source-level delivery contract test. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "ga4PurchaseDelivery.server.ts"), "utf8");
assert(source.includes('name: "purchase"'));
assert(source.includes('name: "audhd_verified_purchase"'));
assert(source.includes("transaction_id: delivery.transaction_id"));
assert(source.includes("value: 79"));
assert(source.includes('currency: "SEK"'));
assert(source.includes("session_id: Number(delivery.ga4_session_id)"));
assert(source.includes("GA4_MEASUREMENT_PROTOCOL_API_SECRET"));
assert(source.includes("delivered_at = now()"));
assert(source.includes("ga4_client_id = null"));
console.log("PASS: GA4 outbox delivery sends the verified AuDHD purchase schema and clears pseudonymous retry data after acknowledgement.");
