import type Stripe from "stripe";
import { identifyPaymentProduct } from "./paymentProductCatalog.server";
import type { StripePaymentLineItem, VerifiedStripePayment } from "./paymentsDb.server";

const SUPPORTED_EVENT_TYPES = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
]);

export type StripeWebhookFailureStage = "session_retrieve" | "line_items_retrieve" | "product_map" | "database_ledger";

/**
 * Carries only the processing boundary that failed. The route deliberately
 * extracts a small allowlisted diagnostic instead of logging the original
 * error, which may contain Stripe or database connection details.
 */
export class StripeWebhookProcessingError extends Error {
  constructor(readonly stage: StripeWebhookFailureStage, readonly source: unknown) {
    super("Stripe webhook processing failed");
    this.name = "StripeWebhookProcessingError";
  }
}

async function atStage<T>(stage: StripeWebhookFailureStage, work: () => Promise<T> | T) {
  try {
    return await work();
  } catch (error) {
    throw new StripeWebhookProcessingError(stage, error);
  }
}

type StripeDependencies = {
  retrieveSession: (sessionId: string) => Promise<Stripe.Checkout.Session>;
  listLineItems: (sessionId: string) => Promise<Stripe.ApiList<Stripe.LineItem>>;
  recordPayment: (payment: VerifiedStripePayment) => Promise<{ duplicate: boolean }>;
};

function idOf(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id ?? null;
}

function productIdOf(price: Stripe.Price | string | null | undefined) {
  if (!price || typeof price === "string") return null;
  return idOf(price.product);
}

function lineItemsFromStripe(lineItems: Stripe.ApiList<Stripe.LineItem>): StripePaymentLineItem[] {
  const seen = new Set<string>();
  const result: StripePaymentLineItem[] = [];
  for (const item of lineItems.data) {
    const priceId = idOf(item.price);
    if (!priceId || seen.has(priceId)) continue;
    seen.add(priceId);
    result.push({
      priceId,
      productId: productIdOf(item.price),
      quantity: typeof item.quantity === "number" ? item.quantity : null,
      unitAmountOre: typeof item.price === "string" ? null : item.price?.unit_amount ?? null,
    });
  }
  return result;
}

function eventSessionId(event: Stripe.Event) {
  const object = event.data.object;
  return object && "id" in object && typeof object.id === "string" && object.id.startsWith("cs_") ? object.id : null;
}

export async function processStripeWebhookEvent(event: Stripe.Event, dependencies: StripeDependencies) {
  if (!SUPPORTED_EVENT_TYPES.has(event.type)) return { kind: "ignored" as const };
  const sessionId = eventSessionId(event);
  if (!sessionId) throw new StripeWebhookProcessingError("session_retrieve", new Error("Checkout webhook event is missing a session identifier"));

  const session = await atStage("session_retrieve", () => dependencies.retrieveSession(sessionId));
  const stripeLineItems = await atStage("line_items_retrieve", () => dependencies.listLineItems(sessionId));
  const lineItems = lineItemsFromStripe(stripeLineItems);
  const paymentLinkId = idOf(session.payment_link);
  const productKey = await atStage("product_map", () => identifyPaymentProduct({ priceIds: lineItems.map((item) => item.priceId), paymentLinkId }));
  const isPaid = session.status === "complete" && session.payment_status === "paid";
  const payment = {
    eventId: event.id,
    eventType: event.type,
    eventCreatedAt: new Date(event.created * 1000),
    livemode: session.livemode,
    checkoutSessionId: session.id,
    paymentIntentId: idOf(session.payment_intent),
    paymentLinkId,
    productKey,
    amountTotalOre: session.amount_total,
    currency: session.currency,
    checkoutStatus: session.status,
    paymentStatus: session.payment_status,
    paidAt: isPaid ? new Date(event.created * 1000) : null,
    lineItems,
  } satisfies VerifiedStripePayment;

  const recorded = await atStage("database_ledger", () => dependencies.recordPayment(payment));
  return { kind: "recorded" as const, duplicate: recorded.duplicate, productKey, paid: isPaid };
}
