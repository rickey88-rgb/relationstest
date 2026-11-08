import { randomUUID } from "node:crypto";
import { GA_MEASUREMENT_ID } from "../_analytics/config";
import { paymentsDatabase } from "./paymentsDb.server";

type Purchase = {
  client_id: string;
  session_id: string;
  reference: string;
  product_key: string;
  currency: string;
  amount_total_ore: number;
  tax_ore: number;
  shipping_ore: number;
  paid_at: Date;
};
type Line = { stripe_price_id: string; quantity: number; net_ore: number };
const HOURS_72 = 72 * 60 * 60 * 1000;

export function verifiedPurchasePayload(checkoutSessionId: string, purchase: Purchase, lines: Line[], now = Date.now()) {
  const time = purchase.paid_at.getTime();
  if (purchase.currency !== "sek" || time > now || now - time >= HOURS_72 || !lines.length
      || !Number.isSafeInteger(purchase.tax_ore) || !Number.isSafeInteger(purchase.shipping_ore)
      || lines.some(line => !/^price_[A-Za-z0-9_]+$/.test(line.stripe_price_id) || !Number.isSafeInteger(line.quantity)
        || line.quantity < 1 || !Number.isSafeInteger(line.net_ore) || line.net_ore < 0)) return null;
  const valueOre = lines.reduce((sum, line) => sum + line.net_ore, 0);
  if (valueOre <= 0 || valueOre + purchase.tax_ore + purchase.shipping_ore !== purchase.amount_total_ore) return null;
  return {
    client_id: purchase.client_id,
    timestamp_micros: time * 1000,
    consent: { ad_user_data: "DENIED", ad_personalization: "DENIED" },
    events: [{
      name: "purchase",
      params: {
        transaction_id: checkoutSessionId,
        value: valueOre / 100,
        tax: purchase.tax_ore / 100,
        shipping: purchase.shipping_ore / 100,
        currency: "SEK",
        session_id: Number(purchase.session_id),
        engagement_time_msec: 1,
        items: lines.map(line => ({ item_id: line.stripe_price_id, quantity: line.quantity, price: line.net_ore / (100 * line.quantity) })),
      },
    }],
  };
}

export async function deliverVerifiedPurchase(session: string, send = fetch) {
  const sql = paymentsDatabase();
  const token = randomUUID();
  const [purchase] = await sql<Purchase[]>`
    update public.stripe_purchase_measurements measurement
    set lease_token = ${token}, lease_until = now() + interval '2 minutes', attempts = attempts + 1
    from public.checkout_measurement_attribution attribution, public.stripe_payments payment
    where measurement.stripe_checkout_session_id = ${session}
      and measurement.stripe_checkout_session_id = payment.stripe_checkout_session_id
      and measurement.attribution_reference = attribution.reference
      and measurement.accepted_at is null and measurement.skipped_at is null
      and (measurement.lease_until is null or measurement.lease_until < now())
      and attribution.expires_at > now() and attribution.client_id is not null
      and payment.livemode and payment.payment_status = 'paid' and payment.paid_at is not null
    returning attribution.client_id, attribution.session_id, attribution.reference, payment.product_key,
      payment.paid_at, payment.currency, payment.amount_total_ore, payment.tax_ore, payment.shipping_ore
  `;
  if (!purchase) return false;

  let accepted = false;
  let skipReason: "product" | "age_or_amount" | "withdrawn" | null = null;
  try {
    // Approve each product after reviewing whether its purchase signals may be
    // shared with Google. No item name, referral, test/attempt ID or email leaves here.
    const products = (process.env.GA4_PURCHASE_ALLOWED_PRODUCTS ?? "").split(",").map(product => product.trim());
    if (!products.includes(purchase.product_key)) { skipReason = "product"; return false; }
    const lines = await sql<Line[]>`
      select stripe_price_id, quantity, net_ore
      from public.stripe_payment_line_items where stripe_checkout_session_id = ${session}
      order by stripe_price_id
    `;
    const body = verifiedPurchasePayload(session, purchase, lines);
    if (!body) { skipReason = "age_or_amount"; return false; }
    const secret = process.env.GA4_MEASUREMENT_PROTOCOL_API_SECRET?.trim();
    if (!secret) throw new Error("GA4 purchase transport is not configured");
    // Recheck consent after preparing the payload. An opt-out cannot retract a request already in flight.
    const [active] = await sql`
      select 1 from public.checkout_measurement_attribution
      where reference = ${purchase.reference} and expires_at > now() and client_id is not null
    `;
    if (!active) { skipReason = "withdrawn"; return false; }
    const query = new URLSearchParams({ measurement_id: GA_MEASUREMENT_ID, api_secret: secret });
    const result = await send("https://www.google-analytics.com/mp/collect?" + query, {
      method: "POST", headers: { "Content-Type": "application/json" }, redirect: "error",
      body: JSON.stringify(body), signal: AbortSignal.timeout(5000),
    });
    if (!result.ok) throw new Error("GA4 purchase transport failed");
    accepted = true;
    return true;
  } finally {
    const rows = await sql`
      update public.stripe_purchase_measurements
      set lease_token = null, lease_until = null,
            accepted_at = case when ${accepted} then now() else null end,
            skipped_at = case when ${Boolean(skipReason)} then now() else null end,
            skip_reason = ${skipReason}
      where stripe_checkout_session_id = ${session} and lease_token = ${token}
      returning attribution_reference
    `;
    if ((accepted || skipReason) && rows[0]?.attribution_reference) {
      await sql`
        update public.checkout_measurement_attribution set client_id = null, session_id = null
        where reference = ${purchase.reference}
      `;
    }
  }
}

export async function maintainVerifiedPurchases() {
  const sql = paymentsDatabase();
  await sql`delete from public.checkout_measurement_attribution where expires_at <= now()`;
  await sql`delete from public.checkout_measurement_withdrawals where expires_at <= now()`;
  // The retired AuDHD queue can still contain identifiers from older failures.
  await sql`
    update public.ga4_purchase_deliveries set ga4_client_id = null, ga4_session_id = null
    where created_at <= now() - interval '72 hours' and ga4_client_id is not null
  `;
  const pending = await sql<{ stripe_checkout_session_id: string }[]>`
    select stripe_checkout_session_id
    from public.stripe_purchase_measurements
    where accepted_at is null and skipped_at is null and attribution_reference is not null
      and (lease_until is null or lease_until < now())
    order by attempts asc, created_at asc limit 40
  `;
  let accepted = 0;
  let failed = 0;
  for (let i = 0; i < pending.length; i += 8) {
    const batch = await Promise.allSettled(pending.slice(i, i + 8).map(row => deliverVerifiedPurchase(row.stripe_checkout_session_id)));
    for (const result of batch) {
      if (result.status === "rejected") failed++;
      else if (result.value) accepted++;
    }
  }
  return { accepted, failed };
}
