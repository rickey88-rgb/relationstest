import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type Stripe from "stripe";
import { GA_MEASUREMENT_ID, testConfig } from "../../_analytics/config";
import { npfCurrentPrice } from "../../_content/npfPricing";
import { parseAudhdCheckoutAnalyticsAttribution } from "../audhdCheckoutAnalytics.server";

export function npfCheckoutAnalyticsMetadata(product: string, input: unknown): Record<string, string> {
  if (!npfCurrentPrice(product)) return {};
  const attribution = parseAudhdCheckoutAnalyticsAttribution(input);
  return attribution ? {
    rv_npf_product: product,
    rv_npf_ga_client: attribution.clientId,
    rv_npf_ga_session: attribution.sessionId,
  } : {};
}

// Relay only the attribution and purchase fields, never the Stripe event or receipt.
export async function relayNpfDirectPurchase(session: Stripe.Checkout.Session, secret: string, relay: typeof fetch = fetch) {
  const product = session.metadata?.rv_npf_product;
  if (product !== "adhd_test" && product !== "autism_test") return;
  const expected = npfCurrentPrice(product);
  const attribution = parseAudhdCheckoutAnalyticsAttribution({
    clientId: session.metadata?.rv_npf_ga_client,
    sessionId: session.metadata?.rv_npf_ga_session,
  });
  if (!expected || !attribution || !session.livemode || session.status !== "complete" || session.mode !== "payment"
    || session.payment_status !== "paid" || session.currency !== "sek" || session.amount_total !== expected.amount) return;

  const transactionId = createHash("sha256").update(`rv-npf:${session.id}`).digest("hex");
  const body = JSON.stringify({ product, amount: session.amount_total, transactionId, ...attribution });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const result = await relay("https://www.relationsvarning.se/api/stripe/npf-ga4", {
    method: "POST", body, redirect: "error", signal: AbortSignal.timeout(8000),
    headers: { "Content-Type": "application/json", "x-rv-timestamp": timestamp, "x-rv-signature": signature(secret, timestamp, body) },
  });
  if (!result.ok) throw new Error("NPF purchase relay unavailable");
}

function signature(secret: string, timestamp: string, body: string) {
  return createHmac("sha256", secret).update(`rv-npf-purchase-v1.${timestamp}.${body}`).digest("hex");
}

export async function receiveNpfDirectPurchase(request: Request, signingSecret: string, secret: string, deliver: typeof fetch = fetch) {
  const timestamp = request.headers.get("x-rv-timestamp") ?? "";
  const received = request.headers.get("x-rv-signature") ?? "";
  if (!/^\d{10}$/.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300 || !/^[a-f0-9]{64}$/.test(received)) return false;
  const body = await request.text();
  if (body.length > 1024 || !timingSafeEqual(Buffer.from(received, "hex"), Buffer.from(signature(signingSecret, timestamp, body), "hex"))) return false;
  const data = JSON.parse(body) as { product?: unknown; amount?: unknown; transactionId?: unknown } | null;
  if (!data) return false;
  const product = data.product;
  if (product !== "adhd_test" && product !== "autism_test") return false;
  const attribution = parseAudhdCheckoutAnalyticsAttribution(data);
  const expected = npfCurrentPrice(product);
  if (!expected || !attribution || data.amount !== expected.amount || typeof data.transactionId !== "string" || !/^[a-f0-9]{64}$/.test(data.transactionId)) return false;
  const amount = data.amount / 100;
  const query = new URLSearchParams({ measurement_id: GA_MEASUREMENT_ID, api_secret: secret });
  const response = await deliver(`https://www.google-analytics.com/mp/collect?${query}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(5000),
    body: JSON.stringify({
      client_id: attribution.clientId,
      events: [{ name: "purchase", params: {
        transaction_id: data.transactionId, value: amount, currency: "SEK",
        session_id: Number(attribution.sessionId), engagement_time_msec: 1,
        items: [{ item_id: product, item_name: testConfig[product].name, price: amount, quantity: 1 }],
      } }],
    }),
  });
  if (!response.ok) throw new Error("GA4 delivery unavailable");
  return true;
}
