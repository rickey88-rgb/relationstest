/* eslint-disable @typescript-eslint/no-require-imports -- executable signature-verification regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

process.env.STRIPE_SECRET_KEY = "local-stripe-test-placeholder";
process.env.STRIPE_WEBHOOK_SECRET = "local-webhook-test-placeholder";
let signatureAccepted = true;
let processed = 0;
let processingFailure = null;
class StripeWebhookProcessingError extends Error {
  constructor(stage, source) {
    super("Stripe webhook processing failed");
    this.name = "StripeWebhookProcessingError";
    this.stage = stage;
    this.source = source;
  }
}
class StripeMock {
  constructor() {
    this.webhooks = { constructEvent: () => {
      if (!signatureAccepted) throw new Error("invalid signature");
      return { id: "evt_route_test", type: "checkout.session.completed", created: 1760054400, data: { object: { id: "cs_test_route" } } };
    } };
    this.checkout = { sessions: { retrieve: async () => ({}), listLineItems: async () => ({ data: [] }) } };
  }
}
const route = createLoader({
  stripe: { default: StripeMock },
  "../../../_lib/stripeWebhook.server": { StripeWebhookProcessingError, processStripeWebhookEvent: async () => { processed += 1; if (processingFailure) throw processingFailure; return { kind: "recorded", duplicate: false }; } },
  "../../../_lib/paymentsDb.server": { recordVerifiedStripePayment: async () => ({ duplicate: false }) },
})(path.join(__dirname, "route.ts"));

function request(signature = "test-signature") {
  return new NextRequest("https://www.relationsvarning.se/api/stripe/webhook", { method: "POST", headers: signature ? { "stripe-signature": signature } : undefined, body: "{}" });
}

(async () => {
  let response = await route.POST(request(""));
  assert.equal(response.status, 400);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  delete process.env.STRIPE_WEBHOOK_SECRET;
  response = await route.POST(request());
  assert.equal(response.status, 400);
  assert.equal(processed, 0);
  process.env.STRIPE_WEBHOOK_SECRET = webhookSecret;
  signatureAccepted = false;
  response = await route.POST(request());
  assert.equal(response.status, 400);
  assert.equal(processed, 0);
  signatureAccepted = true;
  response = await route.POST(request());
  assert.equal(response.status, 200);
  assert.equal(processed, 1);
  assert.equal(response.headers.get("cache-control"), "no-store");

  const originalConsoleError = console.error;
  const logs = [];
  console.error = message => logs.push(message);
  const databaseError = Object.assign(new Error("postgres://must-not-appear@example.test"), { code: "42P01" });
  processingFailure = new StripeWebhookProcessingError("database_ledger", databaseError);
  response = await route.POST(request());
  console.error = originalConsoleError;
  processingFailure = null;
  assert.equal(response.status, 500);
  assert.equal(logs.length, 1);
  assert.equal(logs[0], JSON.stringify({ event: "stripe_webhook_processing_failed", stage: "database_ledger", error_class: "Error", error_code: "42P01" }));
  assert(!logs[0].includes("postgres://"), "diagnostics must not log raw database connection details");
  console.log("PASS: the webhook rejects missing or invalid signatures before processing and accepts a verified event.");
})().catch(error => { console.error(error); process.exitCode = 1; });
