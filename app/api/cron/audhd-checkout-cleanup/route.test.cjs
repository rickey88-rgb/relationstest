/* eslint-disable @typescript-eslint/no-require-imports -- executable cron authorization and retention regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

process.env.CRON_SECRET = "local-cron-secret-for-test-only";
let deleted = 0, delivered = 0, calls = 0, deliveryCalls = 0, failure = null;
const route = createLoader({
  "../../../_lib/audhdCheckoutAttemptsDb.server": { deleteExpiredAudhdCheckoutAttempts: async () => { calls += 1; if (failure) throw failure; return deleted; } },
  "../../../_lib/ga4PurchaseDelivery.server": { deliverPendingGa4Purchases: async () => { deliveryCalls += 1; if (failure) throw failure; return delivered; } },
})(path.join(__dirname, "route.ts"));
function request(authorization = "") { return new NextRequest("https://www.relationsvarning.se/api/cron/audhd-checkout-cleanup", { headers: authorization ? { authorization } : undefined }); }

(async () => {
  let response = await route.GET(request());
  assert.equal(response.status, 401);
  response = await route.GET(request("Bearer wrong"));
  assert.equal(response.status, 401);
  assert.equal(calls, 0, "unauthorized requests never reach the database");

  const originalInfo = console.info, info = [];
  console.info = value => info.push(value);
  deleted = 4;
  delivered = 2;
  response = await route.GET(request(`Bearer ${process.env.CRON_SECRET}`));
  console.info = originalInfo;
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { deleted: 4, delivered: 2 });
  assert.deepEqual(info, [JSON.stringify({ event: "audhd_checkout_maintenance_completed", deleted_count: 4, ga4_purchases_delivered: 2 })]);
  assert.equal(deliveryCalls, 1);

  deleted = 0;
  delivered = 0;
  response = await route.GET(request(`Bearer ${process.env.CRON_SECRET}`));
  assert.equal(response.status, 200, "an empty cleanup is idempotent");
  assert.deepEqual(await response.json(), { deleted: 0, delivered: 0 });

  const originalError = console.error, errors = [];
  console.error = value => errors.push(value);
  failure = Object.assign(new Error("postgres://must-not-appear@example.test"), { name: "DatabaseError" });
  response = await route.GET(request(`Bearer ${process.env.CRON_SECRET}`));
  console.error = originalError;
  failure = null;
  assert.equal(response.status, 503);
  assert.deepEqual(errors, [JSON.stringify({ event: "audhd_checkout_maintenance_failed", error_class: "DatabaseError" })]);
  assert(!errors[0].includes("postgres://"), "logs never contain database details or customer data");
  console.log("PASS: AuDHD cron cleanup requires CRON_SECRET, logs only counts or safe error classes, and is safe when no expired attempts exist.");
})().catch(error => { console.error(error); process.exitCode = 1; });
