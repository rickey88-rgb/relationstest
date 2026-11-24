import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { BOOK_ACCESS_COOKIE, ADHD_DELUXE_BOOK_ACCESS_COOKIE, AUTISM_BOOK_ACCESS_COOKIE, bookAccessCookieOptions, verifyBookAccessToken } from "./bookAccess.server";
import { BOOK_CATALOG, BOOK_LIBRARY_PATH, bookFiles, type BookId, type CatalogBook, type LegacyBookId } from "./bookCatalog";
import { isLiveBookSession, issueBookDeliveryToken, readBookDeliveryToken } from "./bookDeliveryToken.server";
import { legacyCheckoutState, ownedLegacyBooks, signedLegacyBookDownload } from "./legacyBookLibrary.server";
import { verifyBookEmailLink } from "./liteAutismProof.server";
import {
  bookAccount, bookLibraryState, guestBookCookieFrom, guestBookPurchaseReady, guestEditionOwned,
  liteAutismEdition, overthinkingEdition, readBookPdf, signLiteAutismDownload, steinlerEdition,
  verifiedBookPurchase,
} from "./overthinkingBook.server";

const editions = [liteAutismEdition, overthinkingEdition, steinlerEdition];
const cookieNames: Record<LegacyBookId, string> = {
  "audhd-bok": BOOK_ACCESS_COOKIE,
  "autism-bok": AUTISM_BOOK_ACCESS_COOKIE,
  "adhd-deluxe": ADHD_DELUXE_BOOK_ACCESS_COOKIE,
};

export const bookDeliveryHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

export function findDeliveryBook(id: string) {
  return BOOK_CATALOG.find(book => book.id === id);
}

function editionFor(book: CatalogBook) {
  return editions.find(edition => edition.book.path === book.path);
}

function deliveryStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || !/^(sk|rk)_live_/.test(key)) throw new Error("Book delivery Stripe is unavailable");
  return new Stripe(key, { timeout: 10000, maxNetworkRetries: 1 });
}

export async function verifiedDeliveryOrder(stripe: Stripe, session: Stripe.Checkout.Session, book: CatalogBook) {
  const edition = editionFor(book);
  return edition
    ? verifiedBookPurchase(stripe, session, { sessionId: session.id, live: true, priceId: session.metadata?.rv_book_price }, edition)
    : await legacyCheckoutState(stripe, session, book.id as LegacyBookId) === "ready";
}

async function legacyState(book: LegacyBookId, sessionId: string) {
  const stripe = deliveryStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.id === sessionId ? legacyCheckoutState(stripe, session, book) : "none";
}

export async function legacyBookReturn(request: NextRequest, book: LegacyBookId) {
  const entry = findDeliveryBook(book)!;
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const redirect = (path: string) => NextResponse.redirect(new URL(entry.path + path, request.url), {
    status: 303, headers: bookDeliveryHeaders,
  });
  if (!isLiveBookSession(sessionId)) return redirect("/tack/fel");
  try {
    if (await legacyState(book, sessionId) !== "none") {
      const response = redirect("/tack/klart");
      const options = bookAccessCookieOptions();
      const expires = Math.floor(Date.now() / 1000) + options.maxAge;
      response.cookies.set(cookieNames[book], issueBookDeliveryToken(book, "browser", sessionId, expires), options);
      return response;
    }
  } catch {
    // The customer can still recover a verified purchase from Mitt bibliotek.
  }
  return redirect("/tack/fel");
}

export type BookThankState = "ready" | "pending" | "none";

export function bookThanksCookie(book: CatalogBook) {
  return editionFor(book)?.cookie ?? cookieNames[book.id as LegacyBookId];
}

export async function bookThankState(book: CatalogBook, proof: string | null): Promise<BookThankState> {
  if (!proof) return "none";
  const edition = editionFor(book);
  if (edition) return await guestBookPurchaseReady(proof, edition).catch(() => false) ? "ready" : "pending";
  try {
    const sessionId = readBookDeliveryToken(book.id, "browser", proof);
    return sessionId ? await legacyState(book.id as LegacyBookId, sessionId) : "none";
  } catch {
    return "pending";
  }
}

function responseStatus(status: number) {
  return new Response(null, { status, headers: bookDeliveryHeaders });
}

function requestCookie(request: Request, name: string) {
  return request.headers.get("cookie")?.split(";").map(value => value.trim())
    .find(value => value.startsWith(name + "="))?.slice(name.length + 1) ?? null;
}

export async function bookPackageDownload(request: Request, bookId: string, legacyFile?: string) {
  const book = findDeliveryBook(bookId);
  const params = new URL(request.url).searchParams;
  const file = book && bookFiles(book).find(asset => asset.id === (legacyFile ?? params.get("file") ?? "book"));
  if (!book || !file) return responseStatus(404);
  const edition = editionFor(book);
  const emailAccess = legacyFile === undefined && params.has("email");
  const guestAccess = legacyFile !== undefined || params.get("guest") === "1";
  try {
    if (emailAccess) {
      const token = params.get("email");
      const sessionId = readBookDeliveryToken(book.id, "email", token) ??
        (edition === liteAutismEdition ? verifyBookEmailLink(token) : null);
      if (!isLiveBookSession(sessionId)) return responseStatus(403);
      const stripe = deliveryStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.id !== sessionId || !await verifiedDeliveryOrder(stripe, session, book)) return responseStatus(403);
    } else if (guestAccess) {
      const proof = edition ? guestBookCookieFrom(request, edition) : requestCookie(request, bookThanksCookie(book));
      if (!proof) return responseStatus(legacyFile === undefined ? 401 : 403);
      if (legacyFile !== undefined && verifyBookAccessToken(proof, book.id as LegacyBookId)) {
        return new Response(null, { status: 303, headers: { ...bookDeliveryHeaders, Location: BOOK_LIBRARY_PATH } });
      }
      if (await bookThankState(book, proof) !== "ready") return responseStatus(403);
    } else {
      const account = await bookAccount(request);
      if (!account) return responseStatus(401);
      const owned = edition === overthinkingEdition ? await bookLibraryState(account) === "ready" :
        edition ? await guestEditionOwned(account, edition) :
        (await ownedLegacyBooks(account.verifiedEmail, book.id as LegacyBookId)).has(book.id as LegacyBookId);
      if (!owned) return responseStatus(403);
    }

    if (!edition || edition === liteAutismEdition) {
      const url = edition ? await signLiteAutismDownload() :
        await signedLegacyBookDownload(book.id as LegacyBookId, file.id, emailAccess || guestAccess);
      return emailAccess || guestAccess
        ? new Response(null, { status: legacyFile !== undefined ? 302 : 303, headers: { ...bookDeliveryHeaders, Location: url } })
        : Response.json({ url }, { headers: bookDeliveryHeaders });
    }
    const bytes = await readBookPdf(edition);
    return new Response(bytes, { headers: {
      ...bookDeliveryHeaders, "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${file.filename}"`, "Content-Length": String(bytes.byteLength),
    } });
  } catch {
    return responseStatus(503);
  }
}

export function deliveryBookForProduct(product: string) {
  const edition = editions.find(entry => entry.book.product === product);
  if (edition) return BOOK_CATALOG.find(book => book.path === edition.book.path);
  const legacy = { audhd_bok: "audhd-bok", autism_bok: "autism-bok", adhd_deluxe: "adhd-deluxe" } as const;
  const id: BookId | undefined = legacy[product as keyof typeof legacy];
  return id ? findDeliveryBook(id) : undefined;
}
