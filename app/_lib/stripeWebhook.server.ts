import type Stripe from "stripe";
import { attributionReference } from "./checkoutMeasurement.server";
import { configuredPriceIdsForProduct, identifyPaymentProduct } from "./paymentProductCatalog.server";
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
  ledgerV2?: boolean;
  recordPayment: (payment: VerifiedStripePayment) => Promise<{ duplicate: boolean }>;
};

function idOf(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id ?? null;
}

function productIdOf(price: Stripe.Price | string | null | undefined) {
  if (!price || typeof price === "string") return null;
  return idOf(price.product);
}

function lineItemsFromStripe(lineItems: Stripe.ApiList<Stripe.LineItem>, ledgerV2?: boolean): StripePaymentLineItem[] {
  if (ledgerV2 && lineItems.has_more) throw new Error("Unexpected incomplete Stripe line items");
  const seen = new Map<string, StripePaymentLineItem>();
  const result: StripePaymentLineItem[] = [];
  for (const item of lineItems.data) {
    const priceId = idOf(item.price);
    if (!priceId) {
      if (ledgerV2) throw new Error("Missing Stripe Price");
      continue;
    }
    const existing = seen.get(priceId);
    if (existing) {
      if (ledgerV2) {
        existing.quantity = (existing.quantity ?? 0) + (item.quantity ?? 0);
        existing.netOre = (existing.netOre ?? 0) + item.amount_subtotal - item.amount_discount;
      }
      continue;
    }
    const line = {
      priceId,
      productId: productIdOf(item.price),
      quantity: typeof item.quantity === "number" ? item.quantity : null,
      unitAmountOre: typeof item.price === "string" ? null : item.price?.unit_amount ?? null,
      ...(ledgerV2 ? { netOre: item.amount_subtotal - item.amount_discount } : {}),
    };
    seen.set(priceId, line);
    result.push(line);
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
  if (dependencies.ledgerV2 && (session.id !== sessionId || session.livemode !== event.livemode)) throw new StripeWebhookProcessingError("session_retrieve", new Error("Checkout identity mismatch"));
  if (dependencies.ledgerV2 && session.mode !== "payment") return { kind: "ignored" as const };
  const lineItems = await atStage("line_items_retrieve", () => lineItemsFromStripe(stripeLineItems, dependencies.ledgerV2));
  const paymentLinkId = idOf(session.payment_link);
  const { productKey, approvedPrices } = await atStage("product_map", () => {
    try {
      const productKey = identifyPaymentProduct({ priceIds: lineItems.map(item => item.priceId), paymentLinkId });
      const prices = dependencies.ledgerV2 && productKey !== "unmapped" ? configuredPriceIdsForProduct(productKey) : [];
      return { productKey, approvedPrices: lineItems.length > 0 && lineItems.every(item => prices.includes(item.priceId)) };
    } catch (error) {
      if (!dependencies.ledgerV2) throw error;
      console.error(JSON.stringify({ event: "stripe_ledger_product_map_unavailable" }));
      return { productKey: "unmapped" as const, approvedPrices: false };
    }
  });
  const isPaid = session.status === "complete" && session.payment_status === "paid";
  if (dependencies.ledgerV2 && isPaid &&
      (!idOf(session.payment_intent)?.startsWith("pi_") || !session.amount_total || session.amount_total < 0 || !/^[a-z]{3}$/.test(session.currency ?? ""))) {
    throw new StripeWebhookProcessingError("session_retrieve", new Error("Incomplete Stripe payment facts"));
  }
  const snapshot = event.data.object as Stripe.Checkout.Session;
  const paidEvent = event.type === "checkout.session.async_payment_succeeded"
    || (event.type === "checkout.session.completed" && snapshot.payment_status === "paid");
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
    paidAt: isPaid && (!dependencies.ledgerV2 || paidEvent) ? new Date(event.created * 1000) : null,
    ...(dependencies.ledgerV2 ? { ledgerV2: {
      attributionReference: approvedPrices ? attributionReference(paymentLinkId ? session.client_reference_id : session.metadata?.rv_measurement) : null,
      checkoutFlow: session.metadata?.rv_flow === "direct_customer_v1" ? "direct_account" as const
        : paymentLinkId ? "payment_link" as const : "checkout_session" as const,
      taxOre: session.total_details?.amount_tax ?? 0,
      shippingOre: session.total_details?.amount_shipping ?? 0,
    } } : {}),
    lineItems,
  } satisfies VerifiedStripePayment;

  const recorded = await atStage("database_ledger", () => dependencies.recordPayment(payment));
  return { kind: "recorded" as const, duplicate: recorded.duplicate, productKey, paid: Boolean(payment.paidAt), checkoutSessionId: session.id };
}
