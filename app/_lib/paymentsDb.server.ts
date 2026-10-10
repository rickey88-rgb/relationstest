import postgres from "postgres";
import type { PaymentProductIdentification } from "./paymentProductCatalog.server";

type Sql = ReturnType<typeof postgres>;

const globalForPayments = globalThis as typeof globalThis & { paymentsSql?: Sql };

export type StripePaymentLineItem = {
  priceId: string;
  productId: string | null;
  quantity: number | null;
  unitAmountOre: number | null;
};

export type VerifiedStripePayment = {
  eventId: string;
  eventType: string;
  eventCreatedAt: Date;
  livemode: boolean;
  checkoutSessionId: string;
  paymentIntentId: string | null;
  paymentLinkId: string | null;
  productKey: PaymentProductIdentification;
  amountTotalOre: number | null;
  currency: string | null;
  checkoutStatus: string | null;
  paymentStatus: string | null;
  paidAt: Date | null;
  lineItems: StripePaymentLineItem[];
};

function connectionString() {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) throw new Error("DATABASE_URL is not configured");
  return value;
}

function database() {
  if (!globalForPayments.paymentsSql) {
    globalForPayments.paymentsSql = postgres(connectionString(), {
      max: 1,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require",
    });
  }
  return globalForPayments.paymentsSql;
}

/**
 * The event insert, payment upsert and line-item upserts share one database
 * transaction. A duplicate event can only exist after a prior transaction has
 * fully completed, so it is safe to treat it as a no-op.
 */
export async function recordVerifiedStripePayment(input: VerifiedStripePayment) {
  const sql = database();
  return sql.begin(async (transaction) => {
    const inserted = await transaction<{ stripe_event_id: string }[]>`
      insert into stripe_webhook_events (
        stripe_event_id, event_type, livemode, stripe_created_at, processing_status
      ) values (
        ${input.eventId}, ${input.eventType}, ${input.livemode}, ${input.eventCreatedAt}, 'received'
      )
      on conflict (stripe_event_id) do nothing
      returning stripe_event_id
    `;

    if (inserted.length === 0) return { duplicate: true as const };

    await transaction`
      insert into stripe_payments (
        stripe_checkout_session_id, stripe_payment_intent_id, stripe_payment_link_id,
        product_key, amount_total_ore, currency, checkout_status, payment_status,
        paid_at, livemode
      ) values (
        ${input.checkoutSessionId}, ${input.paymentIntentId}, ${input.paymentLinkId},
        ${input.productKey}, ${input.amountTotalOre}, ${input.currency}, ${input.checkoutStatus}, ${input.paymentStatus},
        ${input.paidAt}, ${input.livemode}
      )
      on conflict (stripe_checkout_session_id) do update set
        stripe_payment_intent_id = coalesce(excluded.stripe_payment_intent_id, stripe_payments.stripe_payment_intent_id),
        stripe_payment_link_id = coalesce(excluded.stripe_payment_link_id, stripe_payments.stripe_payment_link_id),
        product_key = case when stripe_payments.product_key = 'unmapped' then excluded.product_key else stripe_payments.product_key end,
        amount_total_ore = coalesce(excluded.amount_total_ore, stripe_payments.amount_total_ore),
        currency = coalesce(excluded.currency, stripe_payments.currency),
        checkout_status = case when stripe_payments.payment_status = 'paid' then stripe_payments.checkout_status else excluded.checkout_status end,
        payment_status = case when stripe_payments.payment_status = 'paid' then 'paid' else excluded.payment_status end,
        paid_at = coalesce(stripe_payments.paid_at, excluded.paid_at),
        livemode = stripe_payments.livemode,
        updated_at = now()
    `;

    for (const lineItem of input.lineItems) {
      await transaction`
        insert into stripe_payment_line_items (
          stripe_checkout_session_id, stripe_price_id, stripe_product_id, quantity, unit_amount_ore
        ) values (
          ${input.checkoutSessionId}, ${lineItem.priceId}, ${lineItem.productId}, ${lineItem.quantity}, ${lineItem.unitAmountOre}
        )
        on conflict (stripe_checkout_session_id, stripe_price_id) do update set
          stripe_product_id = coalesce(excluded.stripe_product_id, stripe_payment_line_items.stripe_product_id),
          quantity = coalesce(excluded.quantity, stripe_payment_line_items.quantity),
          unit_amount_ore = coalesce(excluded.unit_amount_ore, stripe_payment_line_items.unit_amount_ore)
      `;
    }

    await transaction`
      update stripe_webhook_events
      set processing_status = 'processed', processed_at = now()
      where stripe_event_id = ${input.eventId}
    `;
    return { duplicate: false as const };
  });
}
