/* eslint-disable @typescript-eslint/no-require-imports -- local synthetic schema, cipher and report parity checks. */
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { randomBytes, createHash } = require("node:crypto");
const load = require("../../autism-test/test/test-loader.cjs")();
const { adapter, flags, assertFlag } = load(path.join(__dirname, "adapter.ts"));
const crypto = load(path.join(__dirname, "crypto.server.ts"));
const model = load(path.join(__dirname, "../../adhd-test/test/model.ts"));
const { renderToStaticMarkup } = require("react-dom/server");
const { createElement } = require("react");
const Report = load(path.join(__dirname, "../../adhd-test/test/AdhdReport.tsx")).default;
const a = adapter("adhd_test"), input = answers => ({ answers, questionVersion: a.questionVersion, reportVersion: a.reportVersion });
// Pin the material behind version 1. A future edit must deliberately preserve the old adapter/version.
for (const [name, expected] of Object.entries({
  "model.ts": "b66ba5fd17805d6335fd0c3289368d0d2814cdb2b9f53b09a3321f77ec71604b",
  "questions.ts": "6380200e5d4a0b88dba0703dbf6b2ea8a121d8a9439ceca2ce218fca2e4a5c4b",
  "interpretation.ts": "354bc727c0c5fef7f1f9feb2d10d0a73a3f18cd1322fac25e8327a70c2c08953",
  "copy.ts": "d13531b0b1fbb934eff813bfb145b89c2e0acc29e56ec11e97f161070f739e2f",
})) assert.equal(createHash("sha256").update(fs.readFileSync(path.join(__dirname, "../../adhd-test/test", name), "utf8").replace(/\r\n/g, "\n")).digest("hex"), expected, `Versioned ADHD material changed: ${name}`);
process.env.TEST_ACCOUNTS_ENCRYPTION_KEY = randomBytes(32).toString("base64url");
assert.equal(adapter("audhd_test").amount, 7900);
assert.throws(() => adapter("unregistered_test"), /Unsupported/);
assert.deepEqual(flags("adhd_test"), { checkout: false, save: false, read: false, legacyImport: false });
assert.throws(() => assertFlag("adhd_test", "checkout"));
process.env.TEST_ACCOUNTS_ADHD_SAVE_ENABLED = "true";
assert.equal(flags("adhd_test").save, true); assert.equal(flags("adhd_test").checkout, false);
for (const bad of [null, [], input(Array(29).fill(0)), input(Array(30).fill(-1)), input(Array(30).fill(5)), input(Array(30).fill("2")), input(Array(30).fill(1.5)), { ...input(Array(30).fill(0)), paid: true }, { ...input(Array(30).fill(0)), questionVersion: "unknown" }]) assert.throws(() => a.parse(bad));
for (let i = 0; i < 100; i++) {
  const answers = Array.from({ length: 30 }, (_, j) => (i * 7 + j * j + Math.floor(i / 5)) % 5);
  const value = input(answers), cipher = crypto.seal(value, "bound-attempt");
  assert.deepEqual(crypto.unseal(cipher, "bound-attempt"), value);
  assert.throws(() => crypto.unseal(cipher, "other-attempt"));
  const parts = cipher.split("."); parts[3] = (parts[3][0] === "A" ? "B" : "A") + parts[3].slice(1);
  assert.throws(() => crypto.unseal(parts.join("."), "bound-attempt"));
  const result = a.calculate(a.parse(crypto.unseal(cipher, "bound-attempt")));
  assert.deepEqual(result, model.calculate(answers));
  assert.equal(renderToStaticMarkup(createElement(Report, { result })), renderToStaticMarkup(createElement(Report, { result: model.calculate(answers) })));
}
const secret = randomBytes(32).toString("base64url");
assert(crypto.matchesSecret(secret, crypto.secretHash(secret)));
assert(!crypto.matchesSecret(randomBytes(32).toString("base64url"), crypto.secretHash(secret)));
assert(!crypto.matchesSecret("paid=true", crypto.secretHash(secret)));
console.log("PASS: flags off by default, strict schema/versioning, 100 encrypted report round trips and matching shared report markup; wrong context/tampering rejected.");
