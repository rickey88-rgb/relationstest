import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { accountPortalEnabled } from "./accountGate.server";
import { applicationOrigin, validLoginEmail } from "./authConfig.server";
import { authenticatedUser } from "./authSession.server";
import { configuredPriceIdsForProduct, identifyPaymentProduct } from "./paymentProductCatalog.server";
import { directIdentity } from "./testAccounts/directAuth.server";
import { directPortalEnabled } from "./testAccounts/directPublic";
import { OVERTHINKING_BOOK } from "./overthinkingBook";
import { STEINLER_BOOK } from "./steinlerBook";
import { LITE_AUTISM_BOOK } from "./liteAutismBook";
import { sealBookAttribution, type BookAttribution } from "./liteAutismProof.server";
import { ownedBookCheckouts, recordBookCheckout, type BookCheckout } from "./overthinkingBookStore.server";
import { capturedBookPayment, stripeObjectId as idOf } from "./bookPayment.server";

import { NORWEGIAN_BOOK, norwegianBookAmount } from "./norwegianBook";
import { norwayStripeEnvironment } from "./norwayLaunch.server";

const bucket = "overthinking-book-private";
export const guestBookCookie = "rv_overthinking_book_guest";

export const overthinkingEdition = {
  book: OVERTHINKING_BOOK,
  priceEnv: "OVERTHINKING_BOOK_PRICE_ID",
  enabledEnv: "OVERTHINKING_BOOK_CHECKOUT_ENABLED",
  cookie: guestBookCookie,
  checkoutKey: "overthinking-book",
  pdfSize: 2924829,
  pdfSha256: "30e800dc56139fd2485354010cef2db79e01c598cde086ffaadea08ac1509738",
};

export const steinlerEdition = {
  book: STEINLER_BOOK,
  priceEnv: "STEINLER_BOOK_PRICE_ID",
  enabledEnv: "STEINLER_BOOK_CHECKOUT_ENABLED",
  cookie: "rv_steinler_book_guest",
  checkoutKey: "steinler-book",
  pdfSize: 2665227,
  pdfSha256: "fc23bfd59287773f441bb25a7b992f337228d42863cfefae1fd656910ede0c0f",
};

export const liteAutismEdition = {
  book: LITE_AUTISM_BOOK,
  priceEnv: "LITE_AUTISM_BOOK_PRICE_ID",
  enabledEnv: "LITE_AUTISM_BOOK_CHECKOUT_ENABLED",
  cookie: "rv_lite_autism_book_guest",
  checkoutKey: "lite-autism-book",
  pdfSize: 12165871,
  pdfSha256: "2657448a984eb48f7d1ccb6001232de748b25b704ebc85cffeb1e8282935af3c",
};

export const norwegianBookEdition = {
  book: NORWEGIAN_BOOK,
  priceEnv: "NORWAY_BOOK_PRICE_ID",
  enabledEnv: "NORWAY_BOOK_CHECKOUT_ENABLED",
  cookie: "rv_hjernen_i_kryssild_guest",
  checkoutKey: "hjernen-i-kryssild",
  pdfSize: 413902,
  pdfSha256: "26d02a8375d47ee697db6cff10e1f4d637f5fe3fc3a3c9418d376433802eea79",
};

function editionCurrency(edition: Edition) {
  return edition === norwegianBookEdition ? "nok" : "sek";
}

function editionAmount(edition: Edition, priceId?: string) {
  return edition === norwegianBookEdition ? norwegianBookAmount(priceId) : edition.book.amountOre;
}

export type Edition = typeof norwegianBookEdition | typeof overthinkingEdition | typeof steinlerEdition | typeof liteAutismEdition;
const book = OVERTHINKING_BOOK;

function guestProof(value: string | null) {
  const match = value?.match(/^([A-Za-z0-9_-]{43})\.(cs_(?:live|test)_[A-Za-z0-9]+)$/);
  return match ? { secret: match[1], sessionId: match[2] } : null;
}

export function guestBookCookieFrom(request: Request, edition: Edition = overthinkingEdition) {
  return request.headers.get("cookie")?.split(";").map(value => value.trim())
    .find(value => value.startsWith(edition.cookie + "="))?.slice(edition.cookie.length + 1) ?? null;
}

function proofHash(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

function stripeMode(edition: Edition = overthinkingEdition) {
  if (edition === norwegianBookEdition) return norwayStripeEnvironment();
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

function priceForCheckout({ book, priceEnv }: Edition = overthinkingEdition, overridePrice?: string) {
  const price = overridePrice ?? process.env[priceEnv]?.trim() ?? "";
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

export function guestEditionAvailable(edition: Edition) {
  try {
    stripeMode(edition);
    storageConfig();
    return edition === norwegianBookEdition ? Boolean(priceForCheckout(edition)) : configuredPriceIdsForProduct(edition.book.product).length > 0;
  } catch {
    return false;
  }
}

export function bookCheckoutEnabled(edition: Edition = overthinkingEdition) {
  const available = edition === overthinkingEdition ? bookLibraryEnabled() : guestEditionAvailable(edition);
  if (process.env[edition.enabledEnv] !== "true" || !available) return false;
  try {
    if (edition === liteAutismEdition && (
      !/^prod_[A-Za-z0-9]+$/.test(process.env.LITE_AUTISM_BOOK_PRODUCT_ID?.trim() ?? "") ||
      !process.env.RESEND_API_KEY?.trim() || !process.env.AUDHD_RECOVERY_EMAIL_FROM?.trim() ||
      (process.env.BOOK_ACCESS_TOKEN_SECRET?.trim().length ?? 0) < 32
    )) return false;
    if (edition === norwegianBookEdition && (!/^prod_[A-Za-z0-9]+$/.test(process.env.NORWAY_BOOK_PRODUCT_ID?.trim() ?? "") ||
        !process.env.RESEND_API_KEY?.trim() || !process.env.AUDHD_RECOVERY_EMAIL_FROM?.trim() ||
        (process.env.BOOK_ACCESS_TOKEN_SECRET?.trim().length ?? 0) < 32)) return false;
    return Boolean(priceForCheckout(edition));
  } catch { return false; }
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

type ExpectedBookPurchase = Pick<BookCheckout, "sessionId" | "live"> & { priceId?: string };

function matchesBookSession(session: Stripe.Checkout.Session, checkout: ExpectedBookPurchase, edition: Edition = overthinkingEdition) {
  return session.id === checkout.sessionId && session.livemode === checkout.live &&
    session.mode === "payment" && session.metadata?.rv_product === edition.book.product &&
    session.payment_link === null && session.amount_total === editionAmount(edition, checkout.priceId) && session.currency === editionCurrency(edition);
}

/** The verified account's DB binding is required before this Stripe check. */
export async function verifiedBookPurchase(stripe: Stripe, session: Stripe.Checkout.Session, checkout: ExpectedBookPurchase, edition: Edition = overthinkingEdition) {
  const { book } = edition;
  if (!matchesBookSession(session, checkout, edition) || session.status !== "complete" || session.payment_status !== "paid") return false;

  const currency = editionCurrency(edition);
  const amount = editionAmount(edition, checkout.priceId);
  if (amount === null) return false;
  const intentId = idOf(session.payment_intent);
  if (!intentId) return false;
  const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 2 });
  const item = items.data[0];
  if (items.has_more || items.data.length !== 1 || item.quantity !== 1 ||
    !item.price?.id || (checkout.priceId !== undefined && item.price.id !== checkout.priceId) ||
    item.amount_total !== amount || item.currency !== currency ||
    identifyPaymentProduct({ priceIds: [item.price.id], paymentLinkId: null }) !== book.product) return false;
  if (edition === liteAutismEdition && (!item.price || !idOf(item.price.product) ||
      idOf(item.price.product) !== process.env.LITE_AUTISM_BOOK_PRODUCT_ID?.trim())) return false;

  if (edition === norwegianBookEdition && idOf(item.price?.product) !== process.env.NORWAY_BOOK_PRODUCT_ID?.trim()) return false;
  return capturedBookPayment(stripe, intentId, checkout.live, amount, currency);
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

async function hasGuestPurchase(stripe: Stripe, live: boolean, verifiedEmail: string | null, edition: Edition = overthinkingEdition) {
  const email = validLoginEmail(verifiedEmail);
  if (!email) return false;

  // Existing guest Checkout Sessions already carry the book metadata and the
  // email collected by Stripe. Only Supabase's verified address scopes this lookup.
  const sessions = stripe.checkout.sessions.list({ customer_details: { email }, status: "complete", limit: 100 });
  for await (const session of sessions) {
    const priceId = session.metadata?.rv_book_price;
    if (session.metadata?.rv_product !== edition.book.product || !priceId || !session.metadata.rv_guest_hash ||
        session.customer_details?.email?.trim().toLowerCase() !== email.toLowerCase()) continue;
    const checkout = { sessionId: session.id, priceId, live, expiresAt: new Date(session.expires_at * 1000) };
    if (await verifiedBookPurchase(stripe, session, checkout, edition)) return true;
  }
  return false;
}

export async function guestEditionOwned(account: BookAccount, edition: Edition) {
  const { key, live } = stripeMode();
  return hasGuestPurchase(stripeClient(key), live, account.verifiedEmail, edition);
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
  context: { key: string; successPath: string; guestHash?: string; attribution?: BookAttribution | null }, edition: Edition = overthinkingEdition) {
  const { book } = edition;
  const configuredPrice = await stripe.prices.retrieve(price);
  const norwegianBook = edition === norwegianBookEdition;
  if (configuredPrice.id !== price || configuredPrice.livemode !== live || !configuredPrice.active
    || configuredPrice.type !== "one_time" || configuredPrice.currency !== editionCurrency(edition) || configuredPrice.unit_amount !== editionAmount(edition, price)) {
    throw new Error("Book price mismatch");
  }
  const liteAutism = edition === liteAutismEdition;
  const manualTaxRate = process.env.LITE_AUTISM_BOOK_TAX_RATE_ID?.trim();
  if (liteAutism && (idOf(configuredPrice.product) !== process.env.LITE_AUTISM_BOOK_PRODUCT_ID?.trim() ||
      configuredPrice.tax_behavior !== "inclusive" || (manualTaxRate && !/^txr_[A-Za-z0-9]+$/.test(manualTaxRate)))) {
    throw new Error("Book product or tax mismatch");
  }
  if (norwegianBook && (idOf(configuredPrice.product) !== process.env.NORWAY_BOOK_PRODUCT_ID?.trim() ||
      (live && configuredPrice.tax_behavior !== "inclusive"))) throw new Error("Norwegian book product or tax mismatch");
  const cancelPath = norwegianBook
    ? book.path + (price === process.env.NORWAY_BOOK_OFFER_PRICE_ID?.trim() ? "?tilbud=1#kjop" : "#kjop")
    : book.path + "#kop";
  const keyHash = proofHash(context.key);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    ...(norwegianBook ? { locale: "nb", billing_address_collection: "required", adaptive_pricing: { enabled: false } } : {}),
    line_items: [{ price, quantity: 1, ...(liteAutism && manualTaxRate ? { tax_rates: [manualTaxRate] } : {}) }],
    ...(liteAutism && !manualTaxRate ? { automatic_tax: { enabled: true } } : {}),
    metadata: {
      rv_product: book.product,
      ...(context.guestHash ? { rv_guest_hash: context.guestHash, rv_book_price: price } : {}),
      ...((liteAutism || norwegianBook) && context.attribution ? { rv_book_ga4: sealBookAttribution(context.attribution) } : {}),
    },
    success_url: origin + context.successPath,
    cancel_url: origin + cancelPath,
  }, { idempotencyKey: `${edition.checkoutKey}-${keyHash}` });
  const binding = { sessionId: session.id, priceId: price, live, expiresAt: new Date(session.expires_at * 1000) };
  if (!matchesBookSession(session, binding, edition) || session.status !== "open"
    || !Number.isFinite(binding.expiresAt.valueOf())) throw new Error("Invalid book checkout session");
  return session;
}

async function inspectGuestPurchase(stripe: Stripe, live: boolean, cookie: string | null, edition: Edition) {
  const proof = guestProof(cookie);
  if (!proof || !proof.sessionId.startsWith(live ? "cs_live_" : "cs_test_")) return null;
  const session = await stripe.checkout.sessions.retrieve(proof.sessionId);
  const priceId = session.metadata?.rv_book_price;
  if (!priceId || session.metadata?.rv_guest_hash !== proofHash(proof.secret)) return null;
  const checkout = { sessionId: proof.sessionId, priceId, live, expiresAt: new Date(session.expires_at * 1000) };
  if (!matchesBookSession(session, checkout, edition) || identifyPaymentProduct({ priceIds: [priceId], paymentLinkId: null }) !== edition.book.product) return null;
  return { session, checkout };
}

export async function startGuestBookCheckout(cookie: string | null, edition: Edition = overthinkingEdition, attribution?: BookAttribution | null, overridePrice?: string) {
  const { book } = edition;
  const { key, live, origin } = stripeMode(edition);
  const price = priceForCheckout(edition, overridePrice);
  const stripe = stripeClient(key);
  const previous = await inspectGuestPurchase(stripe, live, cookie, edition);
  if (previous) {
    if (previous.session.status === "open" && previous.checkout.expiresAt > new Date()) {
      if (previous.checkout.priceId === price || edition !== norwegianBookEdition) {
        return { result: { kind: "checkout" as const, url: stripeCheckoutUrl(previous.session.url) } };
      }
      await stripe.checkout.sessions.expire(previous.session.id);
    }
    if (await verifiedBookPurchase(stripe, previous.session, previous.checkout, edition) ||
        (previous.session.status === "complete" && previous.session.payment_status === "unpaid" &&
          previous.checkout.expiresAt > new Date())) {
      return { result: { kind: "guest_return" as const } };
    }
  }
  const secret = randomBytes(32).toString("base64url");
  const guestHash = proofHash(secret);
  const session = await createBookSession(stripe, price, live, origin, {
    key: guestHash, guestHash, successPath: book.path + (edition === norwegianBookEdition ? "/takk" : "/tack"), attribution,
  }, edition);
  return { result: { kind: "checkout" as const, url: stripeCheckoutUrl(session.url) }, cookie: `${secret}.${session.id}` };
}

export async function guestBookPurchaseReady(cookie: string | null, edition: Edition = overthinkingEdition) {
  if (!guestProof(cookie)) return false;
  const { key, live } = stripeMode(edition);
  const stripe = stripeClient(key);
  const guest = await inspectGuestPurchase(stripe, live, cookie, edition);
  return Boolean(guest && await verifiedBookPurchase(stripe, guest.session, guest.checkout, edition));
}

export async function readOwnedBookPdf(account: BookAccount) {
  if (await bookLibraryState(account) !== "ready") return null;
  return readBookPdf();
}

export async function readGuestBookPdf(cookie: string, edition: Edition = overthinkingEdition) {
  if (!await guestBookPurchaseReady(cookie, edition)) return null;
  return readBookPdf(edition);
}

export async function readOwnedGuestEditionPdf(account: BookAccount, edition: Edition) {
  if (!await guestEditionOwned(account, edition)) return null;
  return readBookPdf(edition);
}

export const liteAutismStorage = { bucket, path: `v1/${LITE_AUTISM_BOOK.filename}` };

export async function verifiedLiteAutismSession(stripe: Stripe, session: Stripe.Checkout.Session, live: boolean) {
  const priceId = session.metadata?.rv_book_price;
  if (!priceId || !/^[a-f0-9]{64}$/.test(session.metadata?.rv_guest_hash ?? "")) return false;
  const checkout = { sessionId: session.id, priceId, live, expiresAt: new Date(session.expires_at * 1000) };
  return verifiedBookPurchase(stripe, session, checkout, liteAutismEdition);
}

export async function liteAutismEmailPurchaseReady(sessionId: string) {
  const { key, live } = stripeMode();
  const stripe = stripeClient(key);
  return verifiedLiteAutismSession(stripe, await stripe.checkout.sessions.retrieve(sessionId), live);
}

// Return a short Storage URL because the approved PDF exceeds Vercel's response-size limit.
export async function signLiteAutismDownload() {
  const { url, key } = storageConfig();
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const storage = supabase.storage.from(liteAutismStorage.bucket);
  const { data: file, error: fileError } = await storage.info(liteAutismStorage.path);
  if (fileError || !file || file.size !== liteAutismEdition.pdfSize || file.contentType !== "application/pdf") {
    throw new Error("Book PDF unavailable");
  }
  const { data, error } = await storage.createSignedUrl(liteAutismStorage.path, 180, { download: LITE_AUTISM_BOOK.filename });
  if (error || !data?.signedUrl) throw new Error("Book download unavailable");
  const target = new URL(data.signedUrl);
  if (target.origin !== url || !target.pathname.startsWith("/storage/v1/object/sign/") || !target.searchParams.get("token")) {
    throw new Error("Invalid book download URL");
  }
  return target.href;
}

export async function readBookPdf({ book, pdfSize, pdfSha256 }: Edition = overthinkingEdition) {
  const { url, key } = storageConfig();
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data, error } = await supabase.storage.from(bucket).download(`v1/${book.filename}`);
  if (error || !data || data.size !== pdfSize) throw new Error("Book PDF unavailable");
  const bytes = await data.arrayBuffer();
  if (createHash("sha256").update(new Uint8Array(bytes)).digest("hex") !== pdfSha256) {
    throw new Error("Book PDF failed integrity check");
  }
  return bytes;
}
