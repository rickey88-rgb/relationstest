import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Stripe from "stripe";
import { validLoginEmail } from "./authConfig.server";
import { bookFiles, LEGACY_BOOKS, type BookFile, type LegacyBookId } from "./bookCatalog";
import { capturedBookPayment, stripeObjectId as idOf } from "./bookPayment.server";
import { adhdDeluxeBookR2Config, audhdBookR2Config, autismBookR2Config, legacyBookForLineItem } from "./bookProducts.server";

export function legacyBookLibraryEnabled() {
  return /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY?.trim() ?? "");
}

export async function legacyCheckoutBook(stripe: Stripe, session: Stripe.Checkout.Session) {
  const amount = session.amount_total;
  if (!session.livemode || session.mode !== "payment" || session.status !== "complete" ||
    session.currency !== "sek" || (amount !== 7900 && amount !== 9900 && amount !== 14900)) return null;

  const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 2 });
  if (items.has_more || items.data.length !== 1 || items.data[0].amount_total !== amount) return null;
  const book = legacyBookForLineItem(session.payment_link, items.data[0]);
  return book ? { book, amount } : null;
}

export async function legacyCheckoutState(stripe: Stripe, session: Stripe.Checkout.Session, expected: LegacyBookId) {
  const purchase = await legacyCheckoutBook(stripe, session);
  if (!purchase || purchase.book !== expected) return "none";
  if (session.payment_status === "unpaid") return "pending";
  const intentId = idOf(session.payment_intent);
  return session.payment_status === "paid" && intentId &&
    await capturedBookPayment(stripe, intentId, true, purchase.amount) ? "ready" : "none";
}

export async function ownedLegacyBooks(verifiedEmail: string | null, only?: LegacyBookId) {
  const email = validLoginEmail(verifiedEmail);
  const owned = new Set<LegacyBookId>();
  if (!email) return owned;
  if (!legacyBookLibraryEnabled()) throw new Error("Legacy book library is not configured");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim(), { timeout: 10000, maxNetworkRetries: 1 });
  const sessions = stripe.checkout.sessions.list({ status: "complete", customer_details: { email }, limit: 100 });
  for await (const session of sessions) {
    const intentId = idOf(session.payment_intent);
    if (session.customer_details?.email?.trim().toLowerCase() !== email.toLowerCase() ||
        session.payment_status !== "paid" || !intentId) continue;
    const purchase = await legacyCheckoutBook(stripe, session);
    if (!purchase) continue;
    const { book, amount } = purchase;
    if ((only && only !== book) || owned.has(book) || !await capturedBookPayment(stripe, intentId, true, amount)) continue;
    owned.add(book);
    if (only || owned.size === LEGACY_BOOKS.length) break;
  }
  return owned;
}

export async function signedLegacyBookDownload(book: LegacyBookId, file: BookFile["id"] = "book", download = false) {
  const entry = LEGACY_BOOKS.find(candidate => candidate.id === book);
  const asset = entry && bookFiles(entry).find(candidate => candidate.id === file);
  if (!asset) throw new Error("Unknown library file");
  const config = book === "adhd-deluxe" ? adhdDeluxeBookR2Config(file) :
    book === "autism-bok" ? autismBookR2Config(file === "worksheets" ? file : "book") : audhdBookR2Config();
  const client = new S3Client({ region: "auto", endpoint: config.endpoint, forcePathStyle: true, credentials: config.credentials });
  try {
    return await getSignedUrl(client, new GetObjectCommand({
      Bucket: config.bucket, Key: config.key,
      ResponseContentType: "application/pdf",
      ResponseContentDisposition: `${file === "book" && !download ? "inline" : "attachment"}; filename="${asset.filename}"`,
      ResponseCacheControl: "private, no-store",
    }), { expiresIn: 60 });
  } finally {
    client.destroy();
  }
}
