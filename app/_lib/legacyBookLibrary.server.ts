import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Stripe from "stripe";
import { validLoginEmail } from "./authConfig.server";
import { LEGACY_BOOKS, type LegacyBookId } from "./bookCatalog";
import { adhdDeluxeBookR2Config, audhdBookR2Config, autismBookR2Config, legacyBookForLineItem } from "./bookProducts.server";

const storageFor = {
  "audhd-bok": audhdBookR2Config,
  "adhd-deluxe": adhdDeluxeBookR2Config,
  "autism-bok": autismBookR2Config,
};

function idOf(value: string | { id: string } | null) {
  return typeof value === "string" ? value : value?.id;
}

export function legacyBookLibraryEnabled() {
  return /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY?.trim() ?? "");
}

async function captured(stripe: Stripe, intentId: string, expectedAmount: number) {
  const intent = await stripe.paymentIntents.retrieve(intentId, { expand: ["latest_charge"] });
  const charge = typeof intent.latest_charge === "string"
    ? await stripe.charges.retrieve(intent.latest_charge)
    : intent.latest_charge;
  return Boolean(intent.id === intentId && intent.livemode && intent.status === "succeeded" &&
    intent.currency === "sek" && intent.amount_received === expectedAmount && charge &&
    charge.livemode && idOf(charge.payment_intent) === intentId && charge.paid && charge.captured &&
    charge.currency === "sek" && charge.amount === expectedAmount && !charge.disputed &&
    !charge.refunded && charge.amount_refunded === 0);
}

export async function ownedLegacyBooks(verifiedEmail: string | null, only?: LegacyBookId) {
  const email = validLoginEmail(verifiedEmail);
  const owned = new Set<LegacyBookId>();
  if (!email) return owned;
  if (!legacyBookLibraryEnabled()) throw new Error("Legacy book library is not configured");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim(), { timeout: 10000, maxNetworkRetries: 1 });
  const sessions = stripe.checkout.sessions.list({ status: "complete", customer_details: { email }, limit: 100 });
  for await (const session of sessions) {
    const amount = session.amount_total;
    const intentId = idOf(session.payment_intent);
    if (session.customer_details?.email?.trim().toLowerCase() !== email.toLowerCase() ||
        !session.livemode || session.mode !== "payment" || session.status !== "complete" ||
        session.payment_status !== "paid" || session.currency !== "sek" ||
        (amount !== 7900 && amount !== 9900 && amount !== 14900) || !intentId) continue;
    const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 2 });
    if (items.has_more || items.data.length !== 1 || items.data[0].amount_total !== amount) continue;
    const book = legacyBookForLineItem(session.payment_link, items.data[0]);
    if (!book || (only && only !== book) || owned.has(book) || !await captured(stripe, intentId, amount)) continue;
    owned.add(book);
    if (only || owned.size === LEGACY_BOOKS.length) break;
  }
  return owned;
}

export async function signedLegacyBookDownload(book: LegacyBookId) {
  const config = storageFor[book]();
  const entry = LEGACY_BOOKS.find(candidate => candidate.id === book);
  if (!entry) throw new Error("Unknown library book");
  const client = new S3Client({ region: "auto", endpoint: config.endpoint, forcePathStyle: true, credentials: config.credentials });
  try {
    return await getSignedUrl(client, new GetObjectCommand({
      Bucket: config.bucket, Key: config.key,
      ResponseContentType: "application/pdf",
      ResponseContentDisposition: `inline; filename="${entry.filename}"`,
      ResponseCacheControl: "private, no-store",
    }), { expiresIn: 60 });
  } finally {
    client.destroy();
  }
}
