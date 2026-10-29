import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";

function key() {
  const encoded = process.env.TEST_ACCOUNTS_ENCRYPTION_KEY ?? "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(encoded)) throw new Error("Test encryption unavailable");
  const bytes = Buffer.from(encoded, "base64url");
  if (bytes.length !== 32) throw new Error("Test encryption unavailable");
  return bytes;
}
export function seal(value: unknown, context: string) {
  const iv = randomBytes(12), cipher = createCipheriv("aes-256-gcm", key(), iv);
  cipher.setAAD(Buffer.from(context));
  const body = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), body.toString("base64url")].join(".");
}
export function unseal(ciphertext: string, context: string): unknown {
  const [version, iv, tag, body, extra] = ciphertext.split(".");
  if (version !== "v1" || !iv || !tag || !body || extra || ciphertext.length > 8192) throw new Error("Invalid encrypted answers");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
  decipher.setAAD(Buffer.from(context)); decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(body, "base64url")), decipher.final()]).toString("utf8"));
}
export const secretHash = (secret: string) => createHash("sha256").update(secret).digest("hex");
export function matchesSecret(secret: string, digest: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(secret) && /^[a-f0-9]{64}$/.test(digest)
    && timingSafeEqual(Buffer.from(secretHash(secret)), Buffer.from(digest));
}
export function context(row: { product: string; question_version: string; report_version: string }, id: string, owner?: string, purchase?: string) {
  return JSON.stringify(["test-account-v1", row.product, row.question_version, row.report_version, id, owner ?? null, purchase ?? null]);
}
