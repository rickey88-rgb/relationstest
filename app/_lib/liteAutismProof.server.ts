import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const context = "rv/lite-autism-book/v1";
const emailLifetime = 60 * 60 * 24 * 30;
const checkoutId = /^cs_(?:test|live)_[A-Za-z0-9]+$/;
export type BookAttribution = { clientId: string; sessionId: string };

function secret() {
  const key = process.env.BOOK_ACCESS_TOKEN_SECRET?.trim() ?? "";
  if (key.length < 32) throw new Error("Book token signing is unavailable");
  return key;
}

export function parseBookAttribution(value: unknown): BookAttribution | null {
  if (!value || typeof value !== "object") return null;
  const { clientId, sessionId } = value as Partial<BookAttribution>;
  if (typeof clientId !== "string" || !/^[1-9]\d{0,19}\.[1-9]\d{0,19}$/.test(clientId) ||
      typeof sessionId !== "string" || !/^[1-9]\d{0,14}$/.test(sessionId)) return null;
  return { clientId, sessionId };
}

function analyticsKey() {
  return createHash("sha256").update(context + "/analytics:").update(secret()).digest();
}

export function sealBookAttribution(attribution: BookAttribution) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", analyticsKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(attribution)), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function readBookAttribution(value: string | undefined) {
  if (!value || !/^[A-Za-z0-9_-]{40,250}$/.test(value)) return null;
  try {
    const sealed = Buffer.from(value, "base64url");
    const cipher = createDecipheriv("aes-256-gcm", analyticsKey(), sealed.subarray(0, 12));
    cipher.setAuthTag(sealed.subarray(12, 28));
    return parseBookAttribution(JSON.parse(Buffer.concat([cipher.update(sealed.subarray(28)), cipher.final()]).toString()));
  } catch {
    return null;
  }
}

function emailSignature(value: string) {
  return createHmac("sha256", secret()).update(context + "/email:").update(value).digest();
}

export function issueBookEmailLink(sessionId: string, created: number) {
  if (!checkoutId.test(sessionId) || !Number.isSafeInteger(created)) throw new Error("Invalid book checkout");
  const payload = Buffer.from(`${sessionId}:${created + emailLifetime}`).toString("base64url");
  return payload + "." + emailSignature(payload).toString("base64url");
}

export function verifyBookEmailLink(token: string | null, now = Math.floor(Date.now() / 1000)) {
  if (!token || !/^[A-Za-z0-9_-]{20,180}\.[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const [payload, signature] = token.split(".");
  const actual = Buffer.from(signature, "base64url");
  const expected = emailSignature(payload);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  const [sessionId, expiry] = Buffer.from(payload, "base64url").toString().split(":");
  const expiresAt = Number(expiry);
  return checkoutId.test(sessionId) && Number.isSafeInteger(expiresAt) && expiresAt > now ? sessionId : null;
}
