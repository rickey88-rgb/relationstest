import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { accountPortalEnabled } from "./accountGate.server";
import { applicationOrigin } from "./authConfig.server";
import { authenticatedUser } from "./authSession.server";
import { configuredPriceIdsForProduct, identifyPaymentProduct } from "./paymentProductCatalog.server";
import { directIdentity } from "./testAccounts/directAuth.server";
import { directPortalEnabled } from "./testAccounts/directPublic";
import { OVERTHINKING_BOOK as book } from "./overthinkingBook";
import { ownedBookCheckouts, recordBookCheckout, type BookCheckout } from "./overthinkingBookStore.server";

const bucket = "overthinking-book-private";
const objectPath = `v1/${book.filename}`;
const pdfSize = 2924829;
const pdfSha256 = "30e800dc56139fd2485354010cef2db79e01c598cde086ffaadea08ac1509738";

function stripeMode() {
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  const live = /^(sk|rk)_live_/.test(key);
  const origin = applicationOrigin();
  const host = new URL(origin).hostname;
  if (!live && !(process.env.OVERTHINKING_BOOK_STRIPE_TEST_MODE === "true" &&
    /^(sk|rk)_test_/.test(key) && host !== "www.relationsvarning.se" && host !== "relationsvarning.se")) {
    throw new Error("Book payment mode unavailable");
  }
  return { key, live, origin };
}

function storageConfig() {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const key = process.env.OVERTHINKING_BOOK_STORAGE_SECRET_KEY?.trim();
  if (url.protocol !== "https:" || !key) throw new Error("Book storage unavailable");
  return { url: url.origin, key };
}

function priceForCheckout() {
  const price = process.env.OVERTHINKING_BOOK_PRICE_ID?.trim() ?? "";
  if (!/^price_[A-Za-z0-9]+$/.test(price) ||
    identifyPaymentProduct({ priceIds: [price], paymentLinkId: null }) !== book.product) {
    throw new Error("Book price unavailable");
  }
  return price;
}

export function bookLibraryEnabled() {
  try {
    if (!accountPortalEnabled() && !directPortalEnabled()) return false;
    stripeMode();
    storageConfig();
    return configuredPriceIdsForProduct(book.product).length > 0 && Boolean(process.env.DATABASE_URL?.trim());
  } catch {
    return false;
  }
}

export function bookCheckoutEnabled() {
  if (process.env.OVERTHINKING_BOOK_CHECKOUT_ENABLED !== "true" || !bookLibraryEnabled()) return false;
  try { return Boolean(priceForCheckout()); } catch { return false; }
}

export async function bookAccount(request: Request) {
  if (directPortalEnabled()) return (await directIdentity(request.headers.get("authorization")))?.userId ?? null;
  if (!accountPortalEnabled()) return null;
  const user = await authenticatedUser();
  return user?.email_confirmed_at && !user.is_anonymous ? user.id : null;
}

function stripeClient(key: string) {
  return new Stripe(key, { timeout: 10000, maxNetworkRetries: 1 });
}

function stripeCheckoutUrl(url: string | null) {
  if (!url || new URL(url).origin !== "https://checkout.stripe.com") throw new Error("Invalid book checkout URL");
  return url;
}

function idOf(value: string | { id: string } | null) {
  return typeof value === "string" ? value : value?.id;
}

function matchesBookSession(session: Stripe.Checkout.Session, checkout: BookCheckout) {
  return session.id === checkout.sessionId && session.livemode === checkout.live &&
    session.mode === "payment" && session.metadata?.rv_product === book.product &&
    session.payment_link === null && session.amount_total === book.amountOre && session.currency === "sek";
}

/** The verified account's DB binding is required before this Stripe check. */
export async function verifiedBookPurchase(stripe: Stripe, session: Stripe.Checkout.Session, checkout: BookCheckout) {
  if (!matchesBookSession(session, checkout) || session.status !== "complete" || session.payment_status !== "paid"
    || identifyPaymentProduct({ priceIds: [checkout.priceId], paymentLinkId: null }) !== book.product) return false;

  const intentId = idOf(session.payment_intent);
  if (!intentId) return false;
  const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 2 });
  const item = items.data[0];
  if (items.has_more || items.data.length !== 1 || item.quantity !== 1 ||
    item.price?.id !== checkout.priceId || item.amount_total !== book.amountOre || item.currency !== "sek") return false;

  const intent = await stripe.paymentIntents.retrieve(intentId, { expand: ["latest_charge"] });
  const charge = typeof intent.latest_charge === "string" ? await stripe.charges.retrieve(intent.latest_charge) : intent.latest_charge;
  return Boolean(intent.id === intentId && intent.livemode === checkout.live && intent.status === "succeeded"
    && intent.currency === "sek" && intent.amount_received === book.amountOre && charge
    && charge.livemode === checkout.live && idOf(charge.payment_intent) === intentId
    && charge.paid && charge.captured && charge.amount === book.amountOre && charge.currency === "sek"
    && !charge.refunded && charge.amount_refunded === 0 && !charge.disputed);
}

async function inspectBookAccount(stripe: Stripe, userId: string, live: boolean, currentPrice?: string) {
  const checkouts = await ownedBookCheckouts(userId, live);
  let pending = false;
  let openUrl: string | null = null;
  for (const checkout of checkouts) {
    const session = await stripe.checkout.sessions.retrieve(checkout.sessionId);
    if (!matchesBookSession(session, checkout)) continue;
    if (await verifiedBookPurchase(stripe, session, checkout)) return { state: "ready" as const, openUrl: null };
    if (session.status === "complete" && session.payment_status === "unpaid") {
      const intentId = idOf(session.payment_intent);
      const intentStatus = intentId ? (await stripe.paymentIntents.retrieve(intentId)).status : null;
      if (intentStatus === "processing" || intentStatus === "requires_action"
        || (!intentId && checkout.expiresAt > new Date())) pending = true;
    }
    if (!openUrl && session.status === "open" && checkout.expiresAt > new Date()) {
      pending = true;
      if (checkout.priceId === currentPrice) openUrl = stripeCheckoutUrl(session.url);
    }
  }
  return { state: pending ? "pending" as const : "none" as const, openUrl };
}

export async function bookLibraryState(userId: string) {
  const { key, live } = stripeMode();
  return (await inspectBookAccount(stripeClient(key), userId, live)).state;
}

export async function startBookCheckout(userId: string) {
  const { key, live, origin } = stripeMode();
  const price = priceForCheckout();
  const stripe = stripeClient(key);
  const prior = await inspectBookAccount(stripe, userId, live, price);
  if (prior.state === "ready") return { kind: "owned" as const };
  if (prior.openUrl) return { kind: "checkout" as const, url: prior.openUrl };
  if (prior.state === "pending") return { kind: "pending" as const };

  const configuredPrice = await stripe.prices.retrieve(price);
  if (configuredPrice.id !== price || configuredPrice.livemode !== live || !configuredPrice.active
    || configuredPrice.type !== "one_time" || configuredPrice.currency !== "sek" || configuredPrice.unit_amount !== book.amountOre) {
    throw new Error("Book price mismatch");
  }
  const keyHash = createHash("sha256").update(`${userId}:${price}:${origin}:${Math.floor(Date.now()/60000)}`).digest("hex");
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price, quantity: 1 }],
    metadata: { rv_product: book.product },
    success_url: `${origin}/mina-sidor?bok=betalning#bibliotek`,
    cancel_url: `${origin}${book.path}#kop`,
  }, { idempotencyKey: `overthinking-book-${keyHash}` });
  const binding = { sessionId: session.id, priceId: price, live, expiresAt: new Date(session.expires_at * 1000) };
  if (!matchesBookSession(session, binding) || session.status !== "open"
    || !Number.isFinite(binding.expiresAt.valueOf())) throw new Error("Invalid book checkout session");
  const url = stripeCheckoutUrl(session.url);
  await recordBookCheckout(userId, binding);
  return { kind: "checkout" as const, url };
}

export async function readOwnedBookPdf(userId: string) {
  if (await bookLibraryState(userId) !== "ready") return null;
  const { url, key } = storageConfig();
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data, error } = await supabase.storage.from(bucket).download(objectPath);
  if (error || !data || data.size !== pdfSize) throw new Error("Book PDF unavailable");
  const bytes = await data.arrayBuffer();
  if (createHash("sha256").update(new Uint8Array(bytes)).digest("hex") !== pdfSha256) {
    throw new Error("Book PDF failed integrity check");
  }
  return bytes;
}
