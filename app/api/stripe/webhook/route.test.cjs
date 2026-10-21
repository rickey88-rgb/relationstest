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
let webhookDuplicate = false;
let recoveryCandidate = true;
let answersValid = true;
let safetyEmailCalls = 0;
let safetyEmailFailure = null;
let recoveryVerification = { verified: true, checkoutSessionId: "cs_live_audhd123", checkoutReferenceId: "audhd_12345678901234567890123456789012", paymentIntentId: "pi_audhd123", priceId: "price_audhd", customerEmail: "buyer@example.test" };
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
  "../../../_lib/stripeWebhook.server": { StripeWebhookProcessingError, processStripeWebhookEvent: async () => { processed += 1; if (processingFailure) throw processingFailure; return { kind: "recorded", duplicate: webhookDuplicate, productKey: "audhd_test", paid: true, checkoutSessionId: "cs_live_audhd123" }; } },
  "../../../_lib/paymentsDb.server": { recordVerifiedStripePayment: async () => ({ duplicate: false }) },
  "../../../_lib/ga4PurchaseDelivery.server": { Ga4PurchaseDeliveryError, deliverPendingGa4Purchase: async sessionId => { assert.equal(sessionId, "cs_live_audhd123"); if (deliveryFailure) throw deliveryFailure; } },
  "../../../_lib/audhdCheckoutAttemptsDb.server": { revokeAudhdCheckoutAccessForPaymentIntent: async paymentIntent => { assert.equal(paymentIntent, "pi_audhd123"); revocationCalls += 1; return true; }, loadAudhdRecoveryCandidateAnswers: async input => { assert.deepEqual(input, { checkoutReferenceId: "audhd_12345678901234567890123456789012", checkoutSessionId: "cs_live_audhd123" }); return recoveryCandidate ? { ciphertext: "cipher", iv: "iv", authTag: "tag" } : null; } },
  "../../../_lib/audhdCheckoutAttempt.server": { decryptAudhdCheckoutAnswers: value => answersValid && value.ciphertext === "cipher" ? { answers: Array(48).fill(2), contextAnswers: Array(6).fill(2) } : null },
  "../../../_lib/audhdRecoveryDb.server": { revokeAudhdRecoveryGrantsForPaymentIntent: async paymentIntent => { assert.equal(paymentIntent, "pi_audhd123"); recoveryRevocationCalls += 1; return true; } },
  "../../../_lib/audhdCheckoutRevocation.server": { processAudhdCheckoutRevocationEvent: async (event, revoke) => { if (event.type === "charge.refunded") await revoke(event.data.object.payment_intent); } },
  "../../../_lib/audhdCheckoutPayment.server": { verifyAudhdCheckoutPayment: async sessionId => { assert.equal(sessionId, "cs_live_audhd123"); return recoveryVerification; } },
  "../../../_lib/audhdAutomaticRecovery.server": { sendAutomaticAudhdRecovery: async payment => { safetyEmailCalls += 1; assert.equal(payment.customerEmail, "buyer@example.test"); if (safetyEmailFailure) throw safetyEmailFailure; return { kind: "accepted" }; } },
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
  assert.equal(safetyEmailCalls, 1, "a new verified paid AuDHD purchase requests one safety email");

  webhookDuplicate = true;
  response = await route.POST(request());
  assert.equal(response.status, 200);
  assert.equal(safetyEmailCalls, 1, "a duplicate Stripe webhook must not request a second recovery link/email");
  webhookDuplicate = false;
  recoveryCandidate = false;
  response = await route.POST(request());
  assert.equal(response.status, 200);
  assert.equal(safetyEmailCalls, 1, "mail is not requested without a retained encrypted test attempt");
  recoveryCandidate = true;
  answersValid = false;
  response = await route.POST(request());
  assert.equal(response.status, 200);
  assert.equal(safetyEmailCalls, 1, "mail is not sent if encrypted answers cannot be restored");
  answersValid = true;
  safetyEmailFailure = new Error("ResendUnavailable");
  response = await route.POST(request());
  safetyEmailFailure = null;
  assert.equal(response.status, 200, "safety-email failure must not turn a paid webhook into a failed payment flow");
  assert.equal(safetyEmailCalls, 2);
  webhookDuplicate = true;

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
  webhookDuplicate = false;

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
