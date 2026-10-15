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
let deliveryFailure = null;
let eventType = "checkout.session.completed";
let revocationCalls = 0;
let recoveryRevocationCalls = 0;
class StripeWebhookProcessingError extends Error {
  constructor(stage, source) {
    super("Stripe webhook processing failed");
    this.name = "StripeWebhookProcessingError";
    this.stage = stage;
    this.source = source;
  }
}
class Ga4PurchaseDeliveryError extends Error {
  constructor(stage, source) {
    super("GA4 purchase delivery failed");
    this.name = "Ga4PurchaseDeliveryError";
    this.stage = stage;
    this.source = source;
  }
}
class StripeMock {
  constructor() {
    this.webhooks = { constructEvent: () => {
      if (!signatureAccepted) throw new Error("invalid signature");
      return { id: "evt_route_test", type: eventType, livemode: true, created: 1760054400, data: { object: eventType.startsWith("charge.") ? { payment_intent: "pi_audhd123" } : { id: "cs_test_route" } } };
    } };
    this.checkout = { sessions: { retrieve: async () => ({}), listLineItems: async () => ({ data: [] }) } };
  }
}
const route = createLoader({
  stripe: { default: StripeMock },
  "../../../_lib/stripeWebhook.server": { StripeWebhookProcessingError, processStripeWebhookEvent: async () => { processed += 1; if (processingFailure) throw processingFailure; return { kind: "recorded", duplicate: false, checkoutSessionId: "cs_live_audhd123" }; } },
  "../../../_lib/paymentsDb.server": { recordVerifiedStripePayment: async () => ({ duplicate: false }) },
  "../../../_lib/ga4PurchaseDelivery.server": { Ga4PurchaseDeliveryError, deliverPendingGa4Purchase: async sessionId => { assert.equal(sessionId, "cs_live_audhd123"); if (deliveryFailure) throw deliveryFailure; } },
  "../../../_lib/audhdCheckoutAttemptsDb.server": { revokeAudhdCheckoutAccessForPaymentIntent: async paymentIntent => { assert.equal(paymentIntent, "pi_audhd123"); revocationCalls += 1; return true; } },
  "../../../_lib/audhdRecoveryDb.server": { revokeAudhdRecoveryGrantsForPaymentIntent: async paymentIntent => { assert.equal(paymentIntent, "pi_audhd123"); recoveryRevocationCalls += 1; return true; } },
  "../../../_lib/audhdCheckoutRevocation.server": { processAudhdCheckoutRevocationEvent: async (event, revoke) => { if (event.type === "charge.refunded") await revoke(event.data.object.payment_intent); } },
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

  const originalDeliveryConsoleError = console.error;
  const deliveryLogs = [];
  console.error = message => deliveryLogs.push(message);
  deliveryFailure = new Ga4PurchaseDeliveryError("transport", new Error("GA4 unavailable"));
  response = await route.POST(request());
  deliveryFailure = null;
  console.error = originalDeliveryConsoleError;
  assert.equal(response.status, 200, "a pending GA4 delivery must not fail an already-recorded Stripe webhook");
  assert.deepEqual(deliveryLogs, [JSON.stringify({ event: "ga4_purchase_delivery_failed", stage: "transport", error_class: "Error" })]);

  eventType = "charge.refunded";
  response = await route.POST(request());
  assert.equal(response.status, 200);
  assert.equal(revocationCalls, 1, "only an already signature-verified refund event can revoke access");
  assert.equal(recoveryRevocationCalls, 1, "the same verified refund revokes recovery grants");
  eventType = "checkout.session.completed";

  const originalProcessingConsoleError = console.error;
  const processingLogs = [];
  console.error = message => processingLogs.push(message);
  const databaseError = Object.assign(new Error("postgres://must-not-appear@example.test"), { code: "42P01" });
  processingFailure = new StripeWebhookProcessingError("database_ledger", databaseError);
  response = await route.POST(request());
  console.error = originalProcessingConsoleError;
  processingFailure = null;
  assert.equal(response.status, 500);
  assert.equal(processingLogs.length, 1);
  assert.equal(processingLogs[0], JSON.stringify({ event: "stripe_webhook_processing_failed", stage: "database_ledger", error_class: "Error", error_code: "42P01" }));
  assert(!processingLogs[0].includes("postgres://"), "diagnostics must not log raw database connection details");
  console.log("PASS: the webhook rejects missing or invalid signatures before processing and accepts a verified event.");
})().catch(error => { console.error(error); process.exitCode = 1; });
