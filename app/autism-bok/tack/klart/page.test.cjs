/* eslint-disable @typescript-eslint/no-require-imports -- render the actual two-download confirmation. */
const assert = require("node:assert/strict");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");
process.env.BOOK_ACCESS_TOKEN_SECRET = "local-thank-you-page-test-only-32-character-secret";
let token = null;
const load = createLoader({
  "next/headers": { cookies: async () => ({ get: () => ({ value: token }) }) },
  "next/link": { default: ({ href, children }) => React.createElement("a", { href }, children) },
  "../../../_components/EditorialSurface": { default: ({ children }) => React.createElement("div", null, children) },
  "../../../_components/PostPurchaseRecommendation": { default: () => null },
});
const access = load(path.resolve(__dirname, "../../../_lib/bookAccess.server.ts"));
const page = load(path.join(__dirname, "page.tsx")).default;
(async () => {
  token = access.issueBookAccessToken("autism-bok");
  const html = renderToStaticMarkup(await page());
  assert(html.includes('href="/api/books/autism-bok/download"'));
  assert(html.includes('href="/api/books/autism-bok/worksheets"'));
  assert(html.includes("52 sidor")); assert(html.includes("12 A4-sidor")); assert(html.includes("AUTISM ALL INCLUSIVE"));
  for (const invalid of [null, "forged", access.issueBookAccessToken("audhd-bok")]) {
    token = invalid;
    const denied = renderToStaticMarkup(await page());
    assert(!denied.includes('href="/api/books/'));
    assert(denied.includes("Vi kunde inte bekräfta bokåtkomsten"));
  }
  console.log("PASS: actual confirmation renders both correct files only for a valid autism-book cookie.");
})().catch(error => { console.error(error); process.exitCode = 1; });
