import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_VERSION = 2;
const PRODUCT = "audhd_test";
const BROWSER_TOKEN_KIND = "browser-unlock";
const LEGACY_TOKEN_VERSION = 1;
const LEGACY_PRODUCT = "audhd";
const LEGACY_SUPPORT_TOKEN_KIND = "support-recovery";
const LEGACY_BROWSER_TOKEN_KIND = "browser-unlock";
export const AUDHD_RECOVERY_TOKEN_SECONDS = 60 * 60 * 72;
const BROWSER_UNLOCK_SECONDS = 60 * 60;

type BrowserTokenPayload = { v: number; product: string; kind: string; exp: number; grantId: string; nonce: string };
type LegacyTokenPayload = { v: number; product: string; kind: string; exp: number; nonce: string };

function secret() {
  const value = process.env.AUDHD_RECOVERY_TOKEN_SECRET ?? "";
  return value.length >= 32 ? value : "";
}
function encode(value: string) { return Buffer.from(value).toString("base64url"); }
function decode(value: string) { return Buffer.from(value, "base64url").toString("utf8"); }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }

function verifiedPayload(token: string | null): Record<string, unknown> | null {
  if (!token || !secret()) return null;
  const [encodedPayload, signature, ...rest] = token.split(".");
  if (!encodedPayload || !signature || rest.length) return null;
  const expected = sign(encodedPayload);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length || !timingSafeEqual(receivedBuffer, expectedBuffer)) return null;
  try {
    const payload: unknown = JSON.parse(decode(encodedPayload));
    return payload && typeof payload === "object" && !Array.isArray(payload) ? payload as Record<string, unknown> : null;
  } catch { return null; }
}

function verifyBrowserToken(token: string | null): BrowserTokenPayload | null {
  const payload = verifiedPayload(token) as Partial<BrowserTokenPayload> | null;
  const expiresAt = payload?.exp;
  if (!payload || payload.v !== TOKEN_VERSION || payload.product !== PRODUCT || payload.kind !== BROWSER_TOKEN_KIND || typeof expiresAt !== "number" || !Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || typeof payload.grantId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.grantId) || typeof payload.nonce !== "string" || payload.nonce.length < 16) return null;
  return payload as BrowserTokenPayload;
}

function verifyLegacyToken(token: string | null, kind: string): LegacyTokenPayload | null {
  const payload = verifiedPayload(token) as Partial<LegacyTokenPayload> | null;
  const expiresAt = payload?.exp;
  if (!payload || payload.v !== LEGACY_TOKEN_VERSION || payload.product !== LEGACY_PRODUCT || payload.kind !== kind || typeof expiresAt !== "number" || !Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || typeof payload.nonce !== "string" || payload.nonce.length < 16) return null;
  return payload as LegacyTokenPayload;
}

function issueBrowserToken(grantId: string) {
  if (!secret()) throw new Error("AUDHD_RECOVERY_TOKEN_SECRET is not configured");
  const payload: BrowserTokenPayload = { v: TOKEN_VERSION, product: PRODUCT, kind: BROWSER_TOKEN_KIND, exp: Math.floor(Date.now() / 1000) + BROWSER_UNLOCK_SECONDS, grantId, nonce: randomBytes(18).toString("base64url") };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

function issueLegacyBrowserToken(expiresAt: number) {
  if (!secret()) throw new Error("AUDHD_RECOVERY_TOKEN_SECRET is not configured");
  const payload: LegacyTokenPayload = { v: LEGACY_TOKEN_VERSION, product: LEGACY_PRODUCT, kind: LEGACY_BROWSER_TOKEN_KIND, exp: expiresAt, nonce: randomBytes(18).toString("base64url") };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

// v1 keeps its published name. v2 has its own name, preventing a v2 redemption
// from overwriting a valid v1 browser entitlement.
export const AUDHD_LEGACY_RECOVERY_COOKIE = "rv_audhd_recovery";
export const AUDHD_RECOVERY_COOKIE = "rv_audhd_recovery_v2";
export const audhdBrowserUnlockMaxAge = BROWSER_UNLOCK_SECONDS;
export function issueAudhdRecoveryToken() { return randomBytes(32).toString("base64url"); }
export function isAudhdRecoveryToken(token: string | null): token is string { return typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token); }
export function hashAudhdRecoveryToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function issueAudhdBrowserUnlockToken(grantId: string) { return issueBrowserToken(grantId); }
export function verifyAudhdBrowserUnlockToken(token: string | null) { return verifyBrowserToken(token); }

// Compatibility only: no route issues new v1 support links after the v2 release.
export function verifyAudhdLegacySupportRecoveryToken(token: string | null) { return verifyLegacyToken(token, LEGACY_SUPPORT_TOKEN_KIND); }
export function issueAudhdLegacyBrowserUnlockToken(expiresAt: number) { return issueLegacyBrowserToken(expiresAt); }
export function verifyAudhdLegacyBrowserUnlockToken(token: string | null) { return verifyLegacyToken(token, LEGACY_BROWSER_TOKEN_KIND); }
