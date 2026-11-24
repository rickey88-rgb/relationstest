/* eslint-disable @typescript-eslint/no-require-imports -- render the actual shared confirmation from this route. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const createLoader = require("../../../autism-test/test/test-loader.cjs");

let proof = null;
const load = createLoader({
  "next/headers": { cookies: async () => ({ get: () => ({ value: proof }) }) },
  "next/image": { default: props => createElement("img", props) },
  "next/link": { default: props => createElement("a", props) },
  "./BookThanks.module.css": { default: {} },
  "./PostPurchaseRecommendation": { default: () => null },
  "../_lib/bookDelivery.server": {
    findDeliveryBook: id => load(path.resolve(__dirname, "../../../_lib/bookCatalog.ts")).BOOK_CATALOG.find(book => book.id === id),
    bookThanksCookie: () => "fixture",
    bookThankState: async (_, proof) => proof === "paid" ? "ready" : proof === "pending" ? "pending" : "none",
  },
});
const page = load(path.join(__dirname, "page.tsx")).default;
const render = async () => {
  const element = page();
  return renderToStaticMarkup(await element.type(element.props));
};

(async () => {
  proof = "paid";
  const confirmed = await render();
  assert(confirmed.includes("<img"));
  assert(confirmed.includes("AUTISM ALL INCLUSIVE"));
  assert(confirmed.includes("Tack för ditt köp!"));
  for (const file of ["book","worksheets"]) assert(confirmed.includes("/api/books/delivery/autism-bok?file=" + file + "&amp;guest=1"));
  for (const invalid of [null, "forged", "pending"]) {
    proof = invalid;
    const denied = await render();
    assert(!denied.includes('href="/api/books/delivery/'));
    assert(!denied.includes("Tack för ditt köp!"));
    assert.equal(denied.includes("Kontrollera igen"), invalid === "pending");
    assert(denied.includes("Mitt bibliotek"));
  }
  console.log("PASS: AUTISM ALL INCLUSIVE renders the full package only after verification.");
})().catch(error => { console.error(error); process.exitCode = 1; });
