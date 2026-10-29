/* eslint-disable @typescript-eslint/no-require-imports -- check real three-file confirmation and denied views. */
const assert = require("node:assert/strict");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");
process.env.BOOK_ACCESS_TOKEN_SECRET = "isolated-adhd-confirmation-test-secret-over-32-characters";
let token;
const load = createLoader({
  "next/headers": { cookies: async () => ({ get: () => ({ value: token }) }) },
  "next/link": { default: ({ href, children }) => React.createElement("a", { href }, children) },
  "../../../_components/EditorialSurface": { default: ({ children }) => React.createElement("div", null, children) },
  "../../../_components/PostPurchaseRecommendation": { default: () => null },
});
const access = load(path.resolve(__dirname, "../../../_lib/bookAccess.server.ts"));
const page = load(path.join(__dirname, "page.tsx")).default;
(async () => {
  token = access.issueBookAccessToken("adhd-deluxe");
  const html = renderToStaticMarkup(await page());
  for (const suffix of ["", "?file=worksheets", "?file=print"]) assert(html.includes(`href="/api/books/adhd-deluxe/download${suffix}"`));
  assert(html.includes("120 sidor")); assert(html.includes("10 A4-sidor")); assert(html.includes("tre separata PDF-filer"));
  for (const invalid of [undefined, "forged", access.issueBookAccessToken("autism-bok"), access.issueBookAccessToken("audhd-bok")]) {
    token = invalid;
    const denied = renderToStaticMarkup(await page());
    assert(!denied.includes('href="/api/books/')); assert(denied.includes("Vi kunde inte bekräfta bokåtkomsten"));
  }
  console.log("PASS: actual confirmation offers exactly the three new files only to an authorized ADHD book reader.");
})().catch(error => { console.error(error); process.exitCode = 1; });
