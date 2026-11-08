import postgres from "postgres";
import { accountDatabaseTls } from "./accountDatabaseTls.server";
import type { PaymentProductIdentification } from "./paymentProductCatalog.server";

type Sql = ReturnType<typeof postgres>;

const globalForPayments = globalThis as typeof globalThis & { paymentsSql?: Sql };

export type StripePaymentLineItem = {
  priceId: string;
  productId: string | null;
  quantity: number | null;
  unitAmountOre: number | null;
  netOre?: number;
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
  ledgerV2?: { attributionReference: string | null; checkoutFlow: "direct_account" | "payment_link" | "checkout_session"; taxOre: number; shippingOre: number };
};

function connectionString() {
  const value = (process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL)?.trim();
  if (!value) throw new Error("DATABASE_URL is not configured");
  return value;
}

export function paymentsDatabase() {
  if (!globalForPayments.paymentsSql) {
    globalForPayments.paymentsSql = postgres(connectionString(), {
      max: 1,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.PAYMENT_LEDGER_V2_ENABLED === "true" ? accountDatabaseTls() : "require",
      connection: { statement_timeout: 6000, lock_timeout: 3000 },
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
  const sql = paymentsDatabase();
  return sql.begin(async (transaction) => {
    const inserted = await transaction<{ stripe_event_id: string }[]>`
      insert into public.stripe_webhook_events (
        stripe_event_id, event_type, livemode, stripe_created_at, processing_status
      ) values (
        ${input.eventId}, ${input.eventType}, ${input.livemode}, ${input.eventCreatedAt}, 'received'
      )
      on conflict (stripe_event_id) do nothing
      returning stripe_event_id
    `;

    if (inserted.length === 0) return { duplicate: true as const };

    await transaction`
      insert into public.stripe_payments (
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
        paid_at = least(stripe_payments.paid_at, excluded.paid_at),
        livemode = stripe_payments.livemode,
        updated_at = now()
    `;

    for (const lineItem of input.lineItems) {
      await transaction`
        insert into public.stripe_payment_line_items (
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

    if (input.ledgerV2) {
      const { attributionReference, checkoutFlow, taxOre, shippingOre } = input.ledgerV2;
      await transaction`
        update public.stripe_payments
        set checkout_flow = ${checkoutFlow}, tax_ore = ${taxOre}, shipping_ore = ${shippingOre},
            stripe_state_at = greatest(stripe_state_at, ${input.eventCreatedAt})
        where stripe_checkout_session_id = ${input.checkoutSessionId}
      `;
      for (const item of input.lineItems) {
        await transaction`
          update public.stripe_payment_line_items set net_ore = ${item.netOre ?? null}
          where stripe_checkout_session_id = ${input.checkoutSessionId} and stripe_price_id = ${item.priceId}
        `;
      }
      if (input.livemode && input.paidAt && attributionReference && input.productKey !== "unmapped") {
        await transaction`
          insert into public.stripe_purchase_measurements (stripe_checkout_session_id, attribution_reference)
          select ${input.checkoutSessionId}, attribution.reference
          from public.checkout_measurement_attribution attribution
          where attribution.reference = ${attributionReference}
            and attribution.product_key = ${input.productKey} and attribution.expires_at > now()
            and not exists (select 1 from public.ga4_purchase_deliveries
                            where stripe_checkout_session_id = ${input.checkoutSessionId})
          for key share of attribution
          on conflict do nothing
        `;
      }
    }

    // This outbox is intentionally created in the same transaction as the
    // Stripe ledger update. It cannot exist for an unverified browser return,
    // a test-mode checkout, another product, a wrong amount/currency, or a
    // visitor who has not explicitly supplied GA4 attribution after consent.
    if (
      !input.ledgerV2
      && input.livemode
      && input.productKey === "audhd_test"
      && input.checkoutStatus === "complete"
      && input.paymentStatus === "paid"
      && input.amountTotalOre === 7900
      && input.currency?.toLowerCase() === "sek"
    ) {
      await transaction`
        insert into public.ga4_purchase_deliveries (
          stripe_checkout_session_id, transaction_id, ga4_client_id, ga4_session_id
        )
        select attempt.stripe_checkout_session_id,
               attempt.stripe_checkout_session_id,
               attempt.ga4_client_id,
               attempt.ga4_session_id
        from public.audhd_checkout_attempts attempt
        where attempt.stripe_checkout_session_id = ${input.checkoutSessionId}
          and (attempt.stripe_payment_intent_id is null or attempt.stripe_payment_intent_id = ${input.paymentIntentId})
          and attempt.ga4_client_id is not null
          and attempt.ga4_session_id is not null
        on conflict (stripe_checkout_session_id) do nothing
      `;
    }

    await transaction`
      update public.stripe_webhook_events
      set processing_status = 'processed', processed_at = now()
      where stripe_event_id = ${input.eventId}
    `;
    return { duplicate: false as const };
  });
}
