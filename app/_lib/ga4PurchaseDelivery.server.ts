import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { GA_MEASUREMENT_ID } from "../_analytics/config";

type Sql = ReturnType<typeof postgres>;
const globalForGa4PurchaseDelivery = globalThis as typeof globalThis & { ga4PurchaseDeliverySql?: Sql };

type PendingDelivery = {
  checkout_session_id: string;
  transaction_id: string;
  ga4_client_id: string;
  ga4_session_id: string;
};

function database() {
  if (!globalForGa4PurchaseDelivery.ga4PurchaseDeliverySql) {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) throw new Error("DATABASE_URL is not configured");
    globalForGa4PurchaseDelivery.ga4PurchaseDeliverySql = postgres(connectionString, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10, ssl: "require" });
  }
  return globalForGa4PurchaseDelivery.ga4PurchaseDeliverySql;
}

export class Ga4PurchaseDeliveryError extends Error {
  constructor(readonly stage: "configuration" | "transport", readonly source?: unknown) {
    super("GA4 purchase delivery failed");
    this.name = "Ga4PurchaseDeliveryError";
  }
}

function apiSecret() {
  const secret = process.env.GA4_MEASUREMENT_PROTOCOL_API_SECRET?.trim();
  if (!secret) throw new Ga4PurchaseDeliveryError("configuration");
  return secret;
}

async function claimDelivery(checkoutSessionId: string, leaseToken: string) {
  const rows = await database()<PendingDelivery[]>`
    update public.ga4_purchase_deliveries
    set delivery_attempts = delivery_attempts + 1,
        last_attempt_at = now(),
        delivery_lease_token = ${leaseToken}::uuid,
        delivery_lease_expires_at = now() + interval '5 minutes'
    where stripe_checkout_session_id = ${checkoutSessionId}
      and delivered_at is null
      and (delivery_lease_expires_at is null or delivery_lease_expires_at < now())
    returning stripe_checkout_session_id, transaction_id, ga4_client_id, ga4_session_id
  `;
  return rows[0] ?? null;
}

async function releaseClaim(checkoutSessionId: string, leaseToken: string) {
  await database()`
    update public.ga4_purchase_deliveries
    set delivery_lease_token = null, delivery_lease_expires_at = null
    where stripe_checkout_session_id = ${checkoutSessionId}
      and delivery_lease_token = ${leaseToken}::uuid
      and delivered_at is null
  `;
}

async function markDelivered(checkoutSessionId: string, leaseToken: string) {
  await database()`
    update public.ga4_purchase_deliveries
    set delivered_at = now(),
        delivery_lease_token = null,
        delivery_lease_expires_at = null,
        -- The pseudonymous identifiers are only needed while a retry is pending.
        ga4_client_id = null,
        ga4_session_id = null
    where stripe_checkout_session_id = ${checkoutSessionId}
      and delivery_lease_token = ${leaseToken}::uuid
      and delivered_at is null
  `;
}

/**
 * Delivers the one outbox record for a verified AuDHD Checkout session.
 * A non-2xx response deliberately bubbles up to the signed Stripe webhook so
 * Stripe retries; GA4's transaction_id is stable if a response is lost.
 */
export async function deliverPendingGa4Purchase(checkoutSessionId: string) {
  const leaseToken = randomUUID();
  const delivery = await claimDelivery(checkoutSessionId, leaseToken);
  if (!delivery) return { kind: "not_pending" as const };

  try {
    const secret = apiSecret();
    const query = new URLSearchParams({ measurement_id: GA_MEASUREMENT_ID, api_secret: secret });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    let response: Response;
    try {
      response = await fetch(`https://www.google-analytics.com/mp/collect?${query.toString()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          client_id: delivery.ga4_client_id,
          events: [
            {
              name: "purchase",
              params: {
                transaction_id: delivery.transaction_id,
                value: 79,
                currency: "SEK",
                session_id: Number(delivery.ga4_session_id),
                engagement_time_msec: 1,
                items: [{ item_id: "audhd_test", item_name: "AuDHD-test för vuxna", price: 79, quantity: 1 }],
              },
            },
            // Ads imports this dedicated key event, not the legacy client-side
            // `purchase` population from the older test products.
            {
              name: "audhd_verified_purchase",
              params: {
                transaction_id: delivery.transaction_id,
                value: 79,
                currency: "SEK",
                session_id: Number(delivery.ga4_session_id),
                engagement_time_msec: 1,
              },
            },
          ],
        }),
      });
    } catch (error) {
      throw new Ga4PurchaseDeliveryError("transport", error);
    } finally {
      clearTimeout(timeout);
    }
    if (!response.ok) throw new Ga4PurchaseDeliveryError("transport");
    await markDelivered(checkoutSessionId, leaseToken);
    return { kind: "delivered" as const };
  } catch (error) {
    try { await releaseClaim(checkoutSessionId, leaseToken); } catch { /* The five-minute lease makes a later retry safe. */ }
    throw error;
  }
}

/** The authenticated daily job gives pending deliveries a durable retry path after Stripe has stopped retrying. */
export async function deliverPendingGa4Purchases(limit = 50) {
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 100);
  const rows = await database()<Array<{ stripe_checkout_session_id: string }>>`
    select stripe_checkout_session_id
    from public.ga4_purchase_deliveries
    where delivered_at is null
      and (delivery_lease_expires_at is null or delivery_lease_expires_at < now())
    order by created_at asc
    limit ${safeLimit}
  `;
  let delivered = 0;
  for (const row of rows) {
    const result = await deliverPendingGa4Purchase(row.stripe_checkout_session_id);
    if (result.kind === "delivered") delivered += 1;
  }
  return delivered;
}
