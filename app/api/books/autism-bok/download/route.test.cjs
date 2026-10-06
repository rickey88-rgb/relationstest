/* eslint-disable @typescript-eslint/no-require-imports -- executable protected-download regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../../../autism-test/test/test-loader.cjs");

process.env.BOOK_ACCESS_TOKEN_SECRET = "test-book-secret-that-is-longer-than-thirty-two-characters";
const route = createLoader()(path.join(__dirname, "route.ts"));

(async () => {
  const response = await route.GET(new NextRequest("https://www.relationsvarning.se/api/books/autism-bok/download"));
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  console.log("PASS: the protected autism-book download rejects requests without a valid book cookie.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
