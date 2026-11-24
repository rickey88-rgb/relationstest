import { createHmac, timingSafeEqual } from "node:crypto";
import type { BookId } from "./bookCatalog";

export const bookEmailLifetime = 30 * 24 * 60 * 60;
type Purpose = "email" | "browser";
const sessionPattern = /^cs_live_[A-Za-z0-9]+$/;

export function isLiveBookSession(value: string | null): value is string {
  return Boolean(value && sessionPattern.test(value));
}

function signature(payload: string, book: BookId, purpose: Purpose) {
  const secret = process.env.BOOK_ACCESS_TOKEN_SECRET?.trim();
  if (!secret || secret.length < 32) throw new Error("Book delivery signing is unavailable");
  return createHmac("sha256", secret).update(`rv/book-delivery/v1/${purpose}/${book}:`).update(payload).digest();
}

export function issueBookDeliveryToken(book: BookId, purpose: Purpose, session: string, expires: number) {
  if (!isLiveBookSession(session) || !Number.isSafeInteger(expires)) throw new Error("Invalid book delivery");
  const payload = Buffer.from(`${session}:${expires}`).toString("base64url");
  return payload + "." + signature(payload, book, purpose).toString("base64url");
}

export function readBookDeliveryToken(book: BookId, purpose: Purpose, token: string | null, now = Math.floor(Date.now() / 1000)) {
  if (!token || !/^[A-Za-z0-9_-]{20,180}\.[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const [payload, encodedSignature] = token.split(".");
  const actual = Buffer.from(encodedSignature, "base64url");
  const expected = signature(payload, book, purpose);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  const [session, expiration] = Buffer.from(payload, "base64url").toString().split(":");
  const expires = Number(expiration);
  return isLiveBookSession(session) && Number.isSafeInteger(expires) && expires > now ? session : null;
}
