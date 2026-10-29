import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export type ErasureReason = "user_deleted" | "expired" | "revoked";
type Receipt = { v: 1; registryId: string; generationHash: string; reason: ErasureReason; deletedAt: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function accountStorageMode() { return process.env.ACCOUNT_STORAGE_MODE ?? "disabled"; }
export function assertAccountStorageActive() {
  if (accountStorageMode() !== "active") throw new Error("Account storage disabled");
}
function config() {
  const required = (name: string) => { const value = process.env[name]?.trim(); if (!value) throw new Error("Erasure journal unavailable"); return value; };
  const endpoint = new URL(required("ACCOUNT_ERASURE_R2_ENDPOINT"));
  if (endpoint.protocol !== "https:" || !endpoint.hostname.endsWith(".r2.cloudflarestorage.com") || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || endpoint.pathname !== "/") throw new Error("Invalid journal endpoint");
  const bucket = required("ACCOUNT_ERASURE_R2_BUCKET");
  if (bucket === process.env.R2_BUCKET_NAME?.trim()) throw new Error("Journal must use a separate private bucket");
  const key = required("ACCOUNT_ERASURE_SIGNING_KEY");
  const registryId = required("ACCOUNT_ERASURE_REGISTRY_ID");
  if (!/^[A-Za-z0-9_-]{43}$/.test(key) || Buffer.from(key, "base64url").length !== 32 || !uuid.test(registryId)) throw new Error("Invalid journal identity");
  const client = new S3Client({ endpoint: endpoint.origin, region: "auto", forcePathStyle: true, maxAttempts: 2,
    credentials: { accessKeyId: required("ACCOUNT_ERASURE_R2_ACCESS_KEY_ID"), secretAccessKey: required("ACCOUNT_ERASURE_R2_SECRET_ACCESS_KEY") } });
  return { client, endpoint: endpoint.origin, bucket, registryId, key: Buffer.from(key, "base64url") };
}
/** Bind every stored generation to this exact bucket, registry and signing key.
 * An empty staging registry or a newly rotated key must never appear as a clean
 * production journal for a restored old generation.
 */
export function accountErasureIdentity() {
  const c = config();
  const fingerprint = createHash("sha256").update(c.endpoint + "/" + c.bucket + ":").update(c.key).digest("hex");
  return c.registryId + ":" + fingerprint;
}
function sign(key: Buffer, value: unknown) { return createHmac("sha256", key).update(JSON.stringify(value)).digest("base64url"); }
function verified(key: Buffer, body: unknown, signature: unknown) {
  if (typeof signature !== "string") return false;
  const expected = Buffer.from(sign(key, body)), actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
async function readObject(c: ReturnType<typeof config>, objectKey: string) {
  try {
    const response = await c.client.send(new GetObjectCommand({ Bucket: c.bucket, Key: objectKey }), { abortSignal: AbortSignal.timeout(5000) });
    if (!response.Body || (response.ContentLength ?? 0) > 4096) throw new Error("Invalid journal object");
    const text = await response.Body.transformToString();
    if (Buffer.byteLength(text) > 4096) throw new Error("Invalid journal object");
    return JSON.parse(text) as { body: Record<string, unknown>; signature: string };
  } catch (error) {
    // Only a genuine missing object is absence. Bucket errors/403/network fail closed.
    if ((error as { name?: string }).name === "NoSuchKey") return null;
    throw new Error("Erasure journal unavailable");
  }
}
async function registry(c: ReturnType<typeof config>) {
  const value = await readObject(c, "v1/registry.json");
  const expected = { v: 1, kind: "account-erasure-registry", registryId: c.registryId };
  if (!value || JSON.stringify(value.body) !== JSON.stringify(expected) || !verified(c.key, value.body, value.signature)) throw new Error("Journal identity unavailable");
}
export async function assertErasureJournalAvailable() { await registry(config()); }
function generationHash(c: ReturnType<typeof config>, generationId: string) {
  if (!uuid.test(generationId)) throw new Error("Invalid analysis generation");
  return createHmac("sha256", c.key).update(`account-generation-v1:${c.registryId}:${generationId}`).digest("hex");
}
export async function readAnalysisErasure(generationId: string): Promise<Receipt | null> {
  const c = config(); await registry(c);
  const hash = generationHash(c, generationId);
  const value = await readObject(c, `v1/analyses/${hash}.json`);
  if (!value) return null;
  const body = value.body;
  if (!verified(c.key, body, value.signature) || body.v !== 1 || body.registryId !== c.registryId || body.generationHash !== hash
    || !["user_deleted", "expired", "revoked"].includes(String(body.reason)) || !Number.isFinite(Date.parse(String(body.deletedAt)))) throw new Error("Invalid erasure receipt");
  return body as Receipt;
}
export async function writeAnalysisErasure(generationId: string, reason: ErasureReason) {
  const c = config(); await registry(c);
  const hash = generationHash(c, generationId);
  const existing = await readAnalysisErasure(generationId);
  if (existing) return;
  const body: Receipt = { v: 1, registryId: c.registryId, generationHash: hash, reason, deletedAt: new Date().toISOString() };
  try {
    await c.client.send(new PutObjectCommand({ Bucket: c.bucket, Key: `v1/analyses/${hash}.json`, IfNoneMatch: "*",
      Body: JSON.stringify({ body, signature: sign(c.key, body) }), ContentType: "application/json", CacheControl: "no-store" }), { abortSignal: AbortSignal.timeout(5000) });
  } catch (error) {
    if ((error as { name?: string }).name !== "PreconditionFailed") throw new Error("Erasure receipt unavailable");
  }
  // Acknowledged writes are read back before SQL can delete or acknowledge success.
  if (!await readAnalysisErasure(generationId)) throw new Error("Erasure receipt not durable");
}
