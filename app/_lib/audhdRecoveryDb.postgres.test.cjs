/* eslint-disable @typescript-eslint/no-require-imports -- PostgreSQL integration regression test. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const postgres = require("postgres");

// Use a dedicated test database with the application schema, never DATABASE_URL.
const connection = process.env.AUDHD_TEST_DATABASE_URL;
if (!connection) {
  console.error("PostgreSQL test not run: AUDHD_TEST_DATABASE_URL is not configured.");
  process.exit(1);
}

const source = fs.readFileSync(path.join(__dirname, "audhdRecoveryDb.server.ts"), "utf8");
const functionSource = source.split("export async function loadAudhdRecoveryRestoreRecord(")[1];
assert(functionSource, "recovery query function exists");
const match = functionSource.match(/database\(\)<[^`]+>`([\s\S]*?)`/);
assert(match, "extract the actual recovery SQL template");
const placeholders = match[1].match(/\$\{grantId\}/g) || [];
assert.equal(placeholders.length, 1, "the recovery query contains exactly one grant parameter");
const query = match[1].replace("${grantId}", "$1");
const sql = postgres(connection, { max: 1, prepare: false, connect_timeout: 10 });

(async () => {
  try {
    // EXPLAIN parses and plans the exact application query without reading rows.
    await sql.unsafe(`EXPLAIN ${query}`, ["11111111-1111-4111-8111-111111111111"]);
    console.log("PASS: PostgreSQL parses and plans the recovery query.");
  } finally {
    await sql.end();
  }
})().catch(() => {
  // Database errors can contain connection details; do not print them.
  console.error("PostgreSQL recovery-query integration test failed.");
  process.exitCode = 1;
});
