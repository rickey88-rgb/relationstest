/* eslint-disable @typescript-eslint/no-require-imports -- synthetic strict TLS regression. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { X509Certificate, createHash } = require("node:crypto");
const { checkServerIdentity } = require("node:tls");
const postgres = require("postgres");
const load = require("../autism-test/test/test-loader.cjs")();
const options = load(path.join(__dirname, "accountDatabaseTls.server.ts")).accountDatabaseTls();
assert.equal(options.rejectUnauthorized, true);
assert.equal(options.checkServerIdentity, checkServerIdentity);
assert(new X509Certificate(options.ca).ca);
assert.equal(createHash("sha256").update(options.ca).digest("hex"), "700723581420dd1ac98fd7e9ac529f0ef210eadcaf87fc868a3ad7d114c2f3b7");
assert.equal(options.checkServerIdentity("wrong.example.invalid", { subjectaltname: "DNS:expected.example.invalid" }).code, "ERR_TLS_CERT_ALTNAME_INVALID");
assert.equal(options.checkServerIdentity("expected.example.invalid", { subjectaltname: "DNS:expected.example.invalid" }), undefined);
const sql = postgres("postgres://synthetic@127.0.0.1/unused?sslmode=disable", { ssl: options });
assert.equal(sql.options.ssl, options, "A URL must never override strict TLS options");
sql.end().then(() => console.log("PASS: official CA is pinned, certificate verification required and wrong hostnames rejected; no network connection opened."));
