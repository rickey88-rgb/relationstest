/* eslint-disable @typescript-eslint/no-require-imports -- server-rendered purchase and sale-gate checks. */
const assert = require("node:assert/strict");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const createLoader = require("../autism-test/test/test-loader.cjs");
const image = props => React.createElement("img", { src: props.src, alt: props.alt });
const link = props => React.createElement("a", { href: props.href }, props.children);
function loadPage(sale) {
  return createLoader({
    "./page.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
    "next/image": { default: image }, "next/link": { default: link },
    "../_lib/featureFlags": { AUTISM_BOOK_SALE_ENABLED: sale },
    "./AutismBookPreviewGallery": { default: ({ previews }) => React.createElement("div", { "data-count": previews.length }, previews.map(preview => React.createElement("button", { key: preview.page }, preview.title))) },
    "./AutismBookStickyCta": { default: () => null },
  })(path.join(__dirname, "page.tsx")).default;
}
(async () => {
  process.env.NODE_ENV = "production";
  process.env.AUTISM_BOOK_LOCAL_PREVIEW = "1";
  const paused = loadPage(false);
  for (const offer of [undefined, "analysis"]) {
    const html = renderToStaticMarkup(await paused({ searchParams: Promise.resolve({ offer }) }));
    assert(html.includes("Kommer snart")); assert(!html.includes('href="https://buy.stripe.com/'));
    assert(!html.includes('"availability":"https://schema.org/InStock"'));
    assert(html.includes('data-count="6"')); assert(!html.includes("På mitt sätt"));
  }
  const enabled = loadPage(true);
  for (const [offer, price, url] of [[undefined, "149 kr", "5kQ28q0ut5Adb4H5MI0gw0v"], ["analysis", "99 kr", "9B600i0utaUx7Sv5MI0gw0w"]]) {
    const html = renderToStaticMarkup(await enabled({ searchParams: Promise.resolve({ offer }) }));
    assert(html.includes(price)); assert(html.includes(`href="https://buy.stripe.com/${url}"`));
    assert(html.includes("72 ifyllbara fält")); assert(html.includes('"numberOfPages":52'));
    assert(!/href="[^"]+\.pdf/.test(html));
  }
  const config = createLoader({ "../_lib/featureFlags": { AUTISM_BOOK_SALE_ENABLED: true, ADHD_DELUXE_SALE_ENABLED: false } })(path.resolve(__dirname, "../_components/crossSellConfig.ts"));
  const recommendations = config.resolveCrossSellOffers("autism_test", { hasTestAccess: () => false });
  assert.equal(recommendations[0].productId, "autism_book"); assert.equal(recommendations[0].product.price, 99); assert.equal(recommendations[0].product.path, "/autism-bok?offer=analysis"); assert.equal(recommendations[0].product.name, "AUTISM ALL INCLUSIVE");
  console.log("PASS: two rendered offers, six previews, no public PDFs, production preview bypass blocked, recommendation ready behind sale gate.");
})().catch(error => { console.error(error); process.exitCode = 1; });
