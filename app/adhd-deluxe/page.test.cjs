/* eslint-disable @typescript-eslint/no-require-imports -- actual server rendering and guarded local preview. */
const assert = require("node:assert/strict");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const createLoader = require("../autism-test/test/test-loader.cjs");
function page(sale) {
  return createLoader({
    "./page.module.css": { default: new Proxy({}, { get: (_, key) => key }) },
    "next/image": { default: props => React.createElement("img", { src: props.src, alt: props.alt }) },
    "next/link": { default: props => React.createElement("a", { href: props.href }, props.children) },
    "../_lib/featureFlags": { ADHD_DELUXE_SALE_ENABLED: sale },
    "./AdhdDeluxePreviewGallery": { default: ({ previews }) => React.createElement("div", { "data-count": previews.length }) },
  })(path.join(__dirname, "page.tsx")).default;
}
(async () => {
  process.env.NODE_ENV = "production";
  process.env.ADHD_DELUXE_LOCAL_PREVIEW = "1";
  const paused = renderToStaticMarkup(await page(false)({ searchParams: Promise.resolve({}) }));
  assert(paused.includes("Försäljningen öppnar snart")); assert(!paused.includes('href="https://buy.stripe.com/'));
  assert(!paused.includes('"availability":"https://schema.org/InStock"'));
  for (const [offer, price, url] of [[undefined, "149 kr", "9B614melj8Mp5Kngrm0gw0x"], ["analysis", "99 kr", "6oU28q3GF3s5fkXa2Y0gw0y"], [["analysis"], "149 kr", "9B614melj8Mp5Kngrm0gw0x"]]) {
    const html = renderToStaticMarkup(await page(true)({ searchParams: Promise.resolve({ offer }) }));
    assert(html.includes(price)); assert(html.includes(`href="https://buy.stripe.com/${url}"`));
    assert(html.includes('data-count="4"')); assert(html.includes('"numberOfPages":120'));
    assert(html.includes("28")); assert(html.includes("14"));
    assert(!/På mitt sätt|16 kapitel|femfrågesystem|färre katastrofer/i.test(html));
    assert(!/href="[^"]+\.pdf/.test(html));
  }
  process.env.NODE_ENV = "development";
  const preview = renderToStaticMarkup(await page(false)({ searchParams: Promise.resolve({}) }));
  assert(preview.includes('href="https://buy.stripe.com/9B614melj8Mp5Kngrm0gw0x"'));
  console.log("PASS: 149/99 offers, malformed-offer fallback, four excerpts, current edition, no public PDFs, and development-only preview with production sales still paused.");
})().catch(error => { console.error(error); process.exitCode = 1; });
