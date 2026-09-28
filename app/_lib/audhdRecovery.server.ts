import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_VERSION = 1;
const PRODUCT = "audhd";
const SUPPORT_TOKEN_KIND = "support-recovery";
const BROWSER_TOKEN_KIND = "browser-unlock";
const BROWSER_UNLOCK_SECONDS = 60 * 60 * 24 * 365;

type TokenPayload = { v: number; product: string; kind: string; exp: number; nonce: string };

function secret() {
  const value = process.env.AUDHD_RECOVERY_TOKEN_SECRET ?? "";
  return value.length >= 32 ? value : "";
}
function encode(value: string) { return Buffer.from(value).toString("base64url"); }
function decode(value: string) { return Buffer.from(value, "base64url").toString("utf8"); }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }

function verify(token: string | null, kind: string): TokenPayload | null {
  if (!token || !secret()) return null;
  const [encodedPayload, signature, ...rest] = token.split(".");
  if (!encodedPayload || !signature || rest.length) return null;
  const expected = sign(encodedPayload);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length || !timingSafeEqual(receivedBuffer, expectedBuffer)) return null;
  try {
    const payload = JSON.parse(decode(encodedPayload)) as TokenPayload;
    if (payload.v !== TOKEN_VERSION || payload.product !== PRODUCT || payload.kind !== kind || !Number.isInteger(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000) || typeof payload.nonce !== "string" || payload.nonce.length < 16) return null;
    return payload;
  } catch { return null; }
}

function issue(kind: string, expiresInSeconds: number) {
  if (!secret()) throw new Error("AUDHD_RECOVERY_TOKEN_SECRET is not configured");
  const payload: TokenPayload = { v: TOKEN_VERSION, product: PRODUCT, kind, exp: Math.floor(Date.now() / 1000) + expiresInSeconds, nonce: randomBytes(18).toString("base64url") };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export const AUDHD_RECOVERY_COOKIE = "rv_audhd_recovery";
export const audhdBrowserUnlockMaxAge = BROWSER_UNLOCK_SECONDS;
export function verifyAudhdSupportRecoveryToken(token: string | null) { return verify(token, SUPPORT_TOKEN_KIND); }
export function issueAudhdBrowserUnlockToken() { return issue(BROWSER_TOKEN_KIND, BROWSER_UNLOCK_SECONDS); }
export function verifyAudhdBrowserUnlockToken(token: string | null) { return verify(token, BROWSER_TOKEN_KIND); }
