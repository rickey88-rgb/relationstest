import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { REPORT_VERSION } from "../audhd-test/test/model";
import { contextQuestions, questions } from "../audhd-test/test/questions";

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const ENCRYPTION_AAD = Buffer.from("relationsvarning:audhd-checkout-attempt:v1", "utf8");
const BROWSER_SECRET_BYTES = 32;
const ENCRYPTION_NONCE_BYTES = 12;

/** Browser possession stays bound to this host for the full encrypted-attempt lifetime. */
export const AUDHD_CHECKOUT_ATTEMPT_COOKIE = "rv_audhd_checkout_attempt";
export const AUDHD_CHECKOUT_ACCESS_COOKIE = "rv_audhd_checkout_access";
/** Encrypted answers are intentionally short-lived, even if an abandoned draft remains. */
export const AUDHD_CHECKOUT_ATTEMPT_RETENTION_SECONDS = 60 * 60 * 24 * 7;
export const audhdCheckoutAttemptCookieMaxAge = AUDHD_CHECKOUT_ATTEMPT_RETENTION_SECONDS;
export const audhdCheckoutAccessMaxAge = AUDHD_CHECKOUT_ATTEMPT_RETENTION_SECONDS;

type AccessTokenPayload = { v: 1; kind: "audhd-checkout-access"; attemptId: string; exp: number; nonce: string };

export type AudhdCheckoutAnswers = {
  reportVersion: typeof REPORT_VERSION;
  answers: number[];
  contextAnswers: number[];
};

export type EncryptedAudhdCheckoutAnswers = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

function encryptionKey() {
  const encoded = process.env.AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(encoded)) throw new Error("AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY must be a 32-byte base64url value");
  const key = Buffer.from(encoded, "base64url");
  if (key.length !== 32) throw new Error("AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY must decode to 32 bytes");
  return key;
}

function accessTokenSecret() {
  const value = process.env.AUDHD_CHECKOUT_ACCESS_TOKEN_SECRET ?? "";
  return value.length >= 32 ? value : "";
}

function signAccessToken(value: string) { return createHmac("sha256", accessTokenSecret()).update(value).digest("base64url"); }
function validAttemptId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function validAnswers(value: unknown, expectedLength: number): value is number[] {
  return Array.isArray(value)
    && value.length === expectedLength
    && value.every(answer => Number.isInteger(answer) && answer >= 0 && answer <= 4);
}

/** Rejects incomplete, reshaped, or future-version client payloads before any persistence. */
export function parseAudhdCheckoutAnswers(value: unknown): AudhdCheckoutAnswers | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.reportVersion !== REPORT_VERSION
    || !validAnswers(candidate.answers, questions.length)
    || !validAnswers(candidate.contextAnswers, contextQuestions.length)) return null;
  return { reportVersion: REPORT_VERSION, answers: [...candidate.answers], contextAnswers: [...candidate.contextAnswers] };
}

export function issueAudhdCheckoutBrowserSecret() {
  return randomBytes(BROWSER_SECRET_BYTES).toString("base64url");
}

/** The raw browser secret is sent only in an HttpOnly cookie, never to Postgres. */
export function hashAudhdCheckoutBrowserSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

/** The access cookie is signed, short-lived, and still requires the browser secret plus database state. */
export function issueAudhdCheckoutAccessToken(attemptId: string, expiresAt: Date) {
  if (!accessTokenSecret() || !validAttemptId(attemptId) || expiresAt.getTime() <= Date.now()) throw new Error("AuDHD checkout access token cannot be issued");
  const payload: AccessTokenPayload = { v: 1, kind: "audhd-checkout-access", attemptId, exp: Math.floor(expiresAt.getTime() / 1000), nonce: randomBytes(18).toString("base64url") };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signAccessToken(encoded)}`;
}

export function verifyAudhdCheckoutAccessToken(token: string | null) {
  if (!token || !accessTokenSecret()) return null;
  const [encoded, signature, ...rest] = token.split(".");
  if (!encoded || !signature || rest.length) return null;
  const expected = Buffer.from(signAccessToken(encoded));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AccessTokenPayload;
    if (payload.v !== 1 || payload.kind !== "audhd-checkout-access" || !validAttemptId(payload.attemptId) || !Number.isInteger(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000) || typeof payload.nonce !== "string" || payload.nonce.length < 16) return null;
    return payload;
  } catch { return null; }
}

export function encryptAudhdCheckoutAnswers(answers: AudhdCheckoutAnswers): EncryptedAudhdCheckoutAnswers {
  const iv = randomBytes(ENCRYPTION_NONCE_BYTES);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey(), iv);
  cipher.setAAD(ENCRYPTION_AAD);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(answers), "utf8"), cipher.final()]);
  return { ciphertext: ciphertext.toString("base64url"), iv: iv.toString("base64url"), authTag: cipher.getAuthTag().toString("base64url") };
}

/** Used by the later verified-return route only; malformed or tampered rows never restore. */
export function decryptAudhdCheckoutAnswers(value: EncryptedAudhdCheckoutAnswers): AudhdCheckoutAnswers | null {
  try {
    const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey(), Buffer.from(value.iv, "base64url"));
    decipher.setAAD(ENCRYPTION_AAD);
    decipher.setAuthTag(Buffer.from(value.authTag, "base64url"));
    const plaintext = Buffer.concat([decipher.update(Buffer.from(value.ciphertext, "base64url")), decipher.final()]).toString("utf8");
    return parseAudhdCheckoutAnswers(JSON.parse(plaintext));
  } catch {
    return null;
  }
}
