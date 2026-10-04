import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_VERSION = 1;
const TOKEN_KIND = "book-access";

// Long enough to be useful in this deliberately database-free first version.
// A customer who changes browser or clears cookies still needs manual support.
export const bookAccessMaxAge = 60 * 60 * 24 * 180;
export const BOOK_ACCESS_COOKIE = "rv_book_access";

export type BookProductId = "audhd-bok";
type BookAccessPayload = {
  v: number;
  product: BookProductId;
  kind: string;
  exp: number;
  nonce: string;
};

function secret() {
  const value = process.env.BOOK_ACCESS_TOKEN_SECRET ?? "";
  return value.length >= 32 ? value : "";
}

function encode(value: string) { return Buffer.from(value).toString("base64url"); }
function decode(value: string) { return Buffer.from(value, "base64url").toString("utf8"); }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }

export function issueBookAccessToken(product: BookProductId) {
  if (!secret()) throw new Error("BOOK_ACCESS_TOKEN_SECRET is not configured");
  const payload: BookAccessPayload = {
    v: TOKEN_VERSION,
    product,
    kind: TOKEN_KIND,
    exp: Math.floor(Date.now() / 1000) + bookAccessMaxAge,
    nonce: randomBytes(18).toString("base64url"),
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyBookAccessToken(token: string | null, product: BookProductId): BookAccessPayload | null {
  if (!token || !secret()) return null;
  const [encodedPayload, signature, ...rest] = token.split(".");
  if (!encodedPayload || !signature || rest.length) return null;

  const expected = Buffer.from(sign(encodedPayload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const payload = JSON.parse(decode(encodedPayload)) as BookAccessPayload;
    if (
      payload.v !== TOKEN_VERSION ||
      payload.product !== product ||
      payload.kind !== TOKEN_KIND ||
      !Number.isInteger(payload.exp) ||
      payload.exp <= Math.floor(Date.now() / 1000) ||
      typeof payload.nonce !== "string" ||
      payload.nonce.length < 16
    ) return null;
    return payload;
  } catch {
    return null;
  }
}

export function bookAccessCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: bookAccessMaxAge,
  };
}
