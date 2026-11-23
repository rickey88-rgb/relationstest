import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { accountPortalEnabled } from "./accountGate.server";
import { applicationOrigin, validLoginEmail } from "./authConfig.server";
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
export const guestBookCookie = "rv_overthinking_book_guest";

function guestProof(value: string | null) {
  const match = value?.match(/^([A-Za-z0-9_-]{43})\.(cs_(?:live|test)_[A-Za-z0-9]+)$/);
  return match ? { secret: match[1], sessionId: match[2] } : null;
}

export function guestBookCookieFrom(request: Request) {
  return request.headers.get("cookie")?.split(";").map(value => value.trim())
    .find(value => value.startsWith(guestBookCookie + "="))?.slice(guestBookCookie.length + 1) ?? null;
}

function proofHash(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

function stripeMode() {
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  const live = /^(sk|rk)_live_/.test(key);
  const origin = applicationOrigin();
  const host = new URL(origin).hostname;
  const testMode = process.env.OVERTHINKING_BOOK_STRIPE_TEST_MODE === "true";
  if (testMode ? !(
    /^(sk|rk)_test_/.test(key) && host !== "www.relationsvarning.se" && host !== "relationsvarning.se") : !live) {
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
  if (directPortalEnabled()) return directIdentity(request.headers.get("authorization"));
  if (!accountPortalEnabled()) return null;
  const user = await authenticatedUser();
  return user?.email_confirmed_at && !user.is_anonymous
    ? { userId: user.id, verifiedEmail: user.email ?? null }
    : null;
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

type BookAccount = { userId: string; verifiedEmail: string | null };

async function hasGuestPurchase(stripe: Stripe, live: boolean, verifiedEmail: string | null) {
  const email = validLoginEmail(verifiedEmail);
  if (!email) return false;

  // Existing guest Checkout Sessions already carry the book metadata and the
  // email collected by Stripe. Only Supabase's verified address scopes this lookup.
  const sessions = stripe.checkout.sessions.list({ customer_details: { email }, status: "complete", limit: 100 });
  for await (const session of sessions) {
    const priceId = session.metadata?.rv_book_price;
    if (!priceId || !session.metadata?.rv_guest_hash ||
        session.customer_details?.email?.trim().toLowerCase() !== email.toLowerCase()) continue;
    const checkout = { sessionId: session.id, priceId, live, expiresAt: new Date(session.expires_at * 1000) };
    if (await verifiedBookPurchase(stripe, session, checkout)) return true;
  }
  return false;
}

export async function bookLibraryState(account: BookAccount) {
  const { key, live } = stripeMode();
  const stripe = stripeClient(key);
  const { state } = await inspectBookAccount(stripe, account.userId, live);
  return state === "ready" || await hasGuestPurchase(stripe, live, account.verifiedEmail) ? "ready" : state;
}

export async function startBookCheckout({ userId, verifiedEmail }: BookAccount) {
  const { key, live, origin } = stripeMode();
  const price = priceForCheckout();
  const stripe = stripeClient(key);
  const prior = await inspectBookAccount(stripe, userId, live, price);
  if (prior.state === "ready" || await hasGuestPurchase(stripe, live, verifiedEmail)) return { kind: "owned" as const };
  if (prior.openUrl) return { kind: "checkout" as const, url: prior.openUrl };
  if (prior.state === "pending") return { kind: "pending" as const };

  const session = await createBookSession(stripe, price, live, origin, {
    key: `${userId}:${price}:${origin}:${Math.floor(Date.now()/60000)}`,
    successPath: "/mina-sidor?bok=betalning#bibliotek",
  });
  const binding = { sessionId: session.id, priceId: price, live, expiresAt: new Date(session.expires_at * 1000) };
  const url = stripeCheckoutUrl(session.url);
  await recordBookCheckout(userId, binding);
  return { kind: "checkout" as const, url };
}

async function createBookSession(stripe: Stripe, price: string, live: boolean, origin: string,
  context: { key: string; successPath: string; guestHash?: string }) {
  const configuredPrice = await stripe.prices.retrieve(price);
  if (configuredPrice.id !== price || configuredPrice.livemode !== live || !configuredPrice.active
    || configuredPrice.type !== "one_time" || configuredPrice.currency !== "sek" || configuredPrice.unit_amount !== book.amountOre) {
    throw new Error("Book price mismatch");
  }
  const keyHash = proofHash(context.key);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price, quantity: 1 }],
    metadata: { rv_product: book.product, ...(context.guestHash ? { rv_guest_hash: context.guestHash, rv_book_price: price } : {}) },
    success_url: origin + context.successPath,
    cancel_url: `${origin}${book.path}#kop`,
  }, { idempotencyKey: `overthinking-book-${keyHash}` });
  const binding = { sessionId: session.id, priceId: price, live, expiresAt: new Date(session.expires_at * 1000) };
  if (!matchesBookSession(session, binding) || session.status !== "open"
    || !Number.isFinite(binding.expiresAt.valueOf())) throw new Error("Invalid book checkout session");
  return session;
}

async function inspectGuestPurchase(stripe: Stripe, live: boolean, cookie: string | null) {
  const proof = guestProof(cookie);
  if (!proof || !proof.sessionId.startsWith(live ? "cs_live_" : "cs_test_")) return null;
  const session = await stripe.checkout.sessions.retrieve(proof.sessionId);
  const priceId = session.metadata?.rv_book_price;
  if (!priceId || session.metadata?.rv_guest_hash !== proofHash(proof.secret)) return null;
  const checkout = { sessionId: proof.sessionId, priceId, live, expiresAt: new Date(session.expires_at * 1000) };
  if (!matchesBookSession(session, checkout) || identifyPaymentProduct({ priceIds: [priceId], paymentLinkId: null }) !== book.product) return null;
  return { session, checkout };
}

export async function startGuestBookCheckout(cookie: string | null) {
  const { key, live, origin } = stripeMode();
  const price = priceForCheckout();
  const stripe = stripeClient(key);
  const previous = await inspectGuestPurchase(stripe, live, cookie);
  if (previous) {
    if (previous.session.status === "open" && previous.checkout.expiresAt > new Date()) {
      return { result: { kind: "checkout" as const, url: stripeCheckoutUrl(previous.session.url) } };
    }
    if (await verifiedBookPurchase(stripe, previous.session, previous.checkout) ||
        (previous.session.status === "complete" && previous.session.payment_status === "unpaid" &&
          previous.checkout.expiresAt > new Date())) {
      return { result: { kind: "guest_return" as const } };
    }
  }
  const secret = randomBytes(32).toString("base64url");
  const guestHash = proofHash(secret);
  const session = await createBookSession(stripe, price, live, origin, {
    key: guestHash, guestHash, successPath: book.path + "/tack",
  });
  return { result: { kind: "checkout" as const, url: stripeCheckoutUrl(session.url) }, cookie: `${secret}.${session.id}` };
}

export async function guestBookPurchaseReady(cookie: string | null) {
  if (!guestProof(cookie)) return false;
  const { key, live } = stripeMode();
  const stripe = stripeClient(key);
  const guest = await inspectGuestPurchase(stripe, live, cookie);
  return Boolean(guest && await verifiedBookPurchase(stripe, guest.session, guest.checkout));
}

export async function readOwnedBookPdf(account: BookAccount) {
  if (await bookLibraryState(account) !== "ready") return null;
  return readBookPdf();
}

export async function readGuestBookPdf(cookie: string) {
  if (!await guestBookPurchaseReady(cookie)) return null;
  return readBookPdf();
}

async function readBookPdf() {
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
