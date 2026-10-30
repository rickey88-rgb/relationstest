import type Stripe from "stripe";
type ObjectReference = string | { id: string } | null | undefined;
type WebhookObject = { metadata?: Record<string, string> | null; client_reference_id?: string | null; payment_intent?: ObjectReference; charge?: ObjectReference };
const idOf = (value: ObjectReference) => typeof value === "string" ? value : value?.id;
const direct = (value: WebhookObject) => value.metadata?.rv_flow === "direct_customer_v1";
/** Same existing endpoint signing secret: verified old events retain their original signature/body.
 * New events never reach Vercel. This is notification routing, not a payment entitlement.
 */
export async function directStripeWebhook(request: Request, stripe: Stripe, relay: typeof fetch = fetch) {
  const respond = (ok: boolean, status: number) => Response.json({ received: ok }, { status, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST" || process.env.DIRECT_CUSTOMER_TESTS_WEBHOOK_ENABLED !== "true") return respond(false, 503);
  const signature = request.headers.get("stripe-signature"), secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return respond(false, 400);
  try {
    const reader = request.body?.getReader(); if (!reader) return respond(false, 400);
    const pieces: Uint8Array[] = []; let length = 0;
    try { for (;;) { const part = await reader.read(); if (part.done) break; length += part.value.length; if (length > 262144) { await reader.cancel(); return respond(false, 413); } pieces.push(part.value); } }
    finally { reader.releaseLock(); }
    const bytes = new Uint8Array(length); let offset = 0; for (const piece of pieces) { bytes.set(piece, offset); offset += piece.length; }
    let event: Stripe.Event;
    try { event = await stripe.webhooks.constructEventAsync(Buffer.from(bytes), signature, secret); }
    catch { return respond(false, 400); }
    const item = event.data.object as unknown as WebhookObject;
    let isDirect = direct(item);
    if (!isDirect && event.type.startsWith("checkout.session.") && item.client_reference_id?.startsWith("ta:")) {
      // Missing/incorrect classification must not leak a new session into legacy processing.
      return respond(false, 503);
    }
    if (!isDirect && event.type.startsWith("charge.")) {
      let intentId = idOf(item.payment_intent);
      if (!intentId && item.charge) {
        const charge = await stripe.charges.retrieve(idOf(item.charge)!);
        intentId = idOf(charge.payment_intent);
      }
      if (intentId) isDirect = direct(await stripe.paymentIntents.retrieve(intentId));
    }
    if (isDirect) return respond(true, 200); // guest/save/open independently verify Stripe and refunds
    if (!["checkout.session.", "payment_intent.", "charge."].some(prefix => event.type.startsWith(prefix))) return respond(true, 200);
    const result = await relay("https://www.relationsvarning.se/api/stripe/webhook", {
      method: "POST", headers: { "Content-Type": "application/json", "stripe-signature": signature },
      body: bytes, redirect: "error", signal: AbortSignal.timeout(45000),
    });
    return respond(result.ok, result.ok ? 200 : 503); // Stripe retries; legacy idempotency is preserved
  } catch { return respond(false, 503); } // no provider details or raw events in logs
}
