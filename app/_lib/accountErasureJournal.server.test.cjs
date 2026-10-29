/* eslint-disable @typescript-eslint/no-require-imports -- synthetic S3 journal tests; no network. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { randomBytes, createHmac } = require("node:crypto");
const load = require("../autism-test/test/test-loader.cjs");
const key = randomBytes(32);
const registryId = "11111111-1111-4111-8111-111111111111", generation = "22222222-2222-4222-8222-222222222222";
Object.assign(process.env, { ACCOUNT_ERASURE_R2_ENDPOINT: "https://synthetic.r2.cloudflarestorage.com",
  ACCOUNT_ERASURE_R2_BUCKET: "synthetic-private-journal", R2_BUCKET_NAME: "synthetic-books", ACCOUNT_ERASURE_SIGNING_KEY: key.toString("base64url"),
  ACCOUNT_ERASURE_REGISTRY_ID: registryId, ACCOUNT_ERASURE_R2_ACCESS_KEY_ID: "synthetic-id", ACCOUNT_ERASURE_R2_SECRET_ACCESS_KEY: "synthetic-secret" });
const objects = new Map(); let offline = false, putFailure = false, lostPutResponse = false, puts = 0;
class Get { constructor(input) { this.input = input; } }
class Put { constructor(input) { this.input = input; } }
class S3 { async send(command) {
  if (offline) throw Object.assign(new Error("private transport failure"), { name: "AccessDenied" });
  if (command instanceof Put) {
    if (putFailure) throw new Error("write failed");
    if (command.input.IfNoneMatch === "*" && objects.has(command.input.Key)) throw Object.assign(new Error("exists"), { name: "PreconditionFailed" });
    puts++; objects.set(command.input.Key, command.input.Body);
    if (lostPutResponse) throw new Error("response lost after remote commit");
    return {};
  }
  if (!objects.has(command.input.Key)) throw Object.assign(new Error("missing"), { name: "NoSuchKey" });
  return { Body: { transformToString: async () => objects.get(command.input.Key) } };
} }
const journal = load({ "@aws-sdk/client-s3": { S3Client: S3, GetObjectCommand: Get, PutObjectCommand: Put } })(path.join(__dirname, "accountErasureJournal.server.ts"));
function provision() {
  const body = { v: 1, kind: "account-erasure-registry", registryId };
  objects.set("v1/registry.json", JSON.stringify({ body, signature: createHmac("sha256", key).update(JSON.stringify(body)).digest("base64url") }));
}
(async () => {
  delete process.env.ACCOUNT_STORAGE_MODE;
  assert.throws(journal.assertAccountStorageActive);
  await assert.rejects(journal.assertErasureJournalAvailable, /identity/);
  provision(); await journal.assertErasureJournalAvailable();
  assert.equal(await journal.readAnalysisErasure(generation), null);
  putFailure = true; await assert.rejects(journal.writeAnalysisErasure(generation, "user_deleted")); putFailure = false;
  await journal.writeAnalysisErasure(generation, "user_deleted");
  assert.equal((await journal.readAnalysisErasure(generation)).reason, "user_deleted");
  await journal.writeAnalysisErasure(generation, "expired"); assert.equal(puts, 1, "receipt retries do not overwrite deletion evidence");
  const concurrentGeneration = "33333333-3333-4333-8333-333333333333";
  await Promise.all([journal.writeAnalysisErasure(concurrentGeneration, "user_deleted"), journal.writeAnalysisErasure(concurrentGeneration, "user_deleted")]);
  assert.equal(puts, 2, "conditional concurrent writes keep one immutable receipt");
  const uncertainGeneration = "44444444-4444-4444-8444-444444444444";
  lostPutResponse = true; await assert.rejects(journal.writeAnalysisErasure(uncertainGeneration, "user_deleted")); lostPutResponse = false;
  assert(await journal.readAnalysisErasure(uncertainGeneration), "a lost PUT response never removes already committed deletion evidence");
  assert(!JSON.stringify([...objects]).includes(generation), "raw generation ids are not stored in R2 keys or objects");
  const objectKey = [...objects.keys()].find(k => k.includes("analyses/"));
  const tampered = JSON.parse(objects.get(objectKey)); tampered.body.reason = "revoked"; objects.set(objectKey, JSON.stringify(tampered));
  await assert.rejects(journal.readAnalysisErasure(generation), /Invalid/);
  offline = true; await assert.rejects(journal.readAnalysisErasure(generation)); offline = false;
  process.env.ACCOUNT_ERASURE_R2_BUCKET = "synthetic-books"; await assert.rejects(journal.assertErasureJournalAvailable, /separate/);
  process.env.ACCOUNT_ERASURE_R2_BUCKET = "synthetic-private-journal";
  process.env.ACCOUNT_ERASURE_REGISTRY_ID = generation; await assert.rejects(journal.assertErasureJournalAvailable, /identity/);
  console.log("PASS: journal requires signed bucket identity, fails closed on outages/tampering and stores only opaque generation receipts.");
})().catch(error => { console.error(error); process.exitCode = 1; });
