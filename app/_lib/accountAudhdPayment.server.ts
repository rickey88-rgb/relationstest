import Stripe from "stripe";
import { inspectAudhdCheckoutSession } from "./audhdRecoveryPayment.server";

export type AccountPayment = {
  checkoutSessionId: string;
  paymentIntentId: string;
  priceId: string;
  purchasedAt: Date;
  amountTotalOre: number;
  currency: "sek";
};
export type AccountPaymentCheck =
  | { kind: "verified"; payment: AccountPayment }
  | { kind: "revoked" }
  | { kind: "denied" }
  | { kind: "unavailable" };

/** Account adapter: reuse historical AuDHD allowlists/recovery verification.
 * Never use Stripe email, localStorage or a browser-supplied session as proof.
 */
export async function verifyAccountAudhdPayment(sessionId: string): Promise<AccountPaymentCheck> {
  try {
    const checked = await inspectAudhdCheckoutSession(sessionId);
    if (!checked.verified) {
      if (checked.reason === "payment_refunded" || checked.reason === "payment_disputed") return { kind: "revoked" };
      if (checked.reason === "stripe_request_failed" || checked.reason === "price_not_configured") return { kind: "unavailable" };
      return { kind: "denied" };
    }
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (!key) return { kind: "unavailable" };
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });
    const item = items.data[0];
    const price = typeof item?.price === "string" ? item.price : item?.price?.id;
    const intentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    if (!session.livemode || session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid"
      || intentId !== checked.paymentIntentId || items.has_more || items.data.length !== 1 || item.quantity !== 1 || price !== checked.priceId
      || !Number.isInteger(session.amount_total) || (session.amount_total ?? 0) <= 0 || session.currency?.toLowerCase() !== "sek") return { kind: "denied" };
    const intent = await stripe.paymentIntents.retrieve(intentId, { expand: ["latest_charge"] });
    const charge = typeof intent.latest_charge === "string" ? await stripe.charges.retrieve(intent.latest_charge) : intent.latest_charge;
    if (!charge || !charge.paid || !charge.captured || intent.status !== "succeeded" || intent.amount_received < session.amount_total!) return { kind: "denied" };
    if (charge.refunded || charge.amount_refunded > 0 || charge.disputed) return { kind: "revoked" };
    // Existing AuDHD policy permanently revokes access once a dispute opens.
    // A historical (even won) dispute must not regain access after guest rows
    // expire, so consult Stripe's history as well as the current charge flag.
    const disputes = await stripe.disputes.list({ payment_intent: intentId, limit: 1 });
    if (disputes.data.length) return { kind: "revoked" };
    const purchasedAt = new Date(charge.created * 1000);
    if (!Number.isFinite(purchasedAt.getTime())) return { kind: "denied" };
    return { kind: "verified", payment: { checkoutSessionId: checked.checkoutSessionId, paymentIntentId: checked.paymentIntentId,
      priceId: checked.priceId, purchasedAt, amountTotalOre: session.amount_total!, currency: "sek" } };
  } catch { return { kind: "unavailable" }; }
}
