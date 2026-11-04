/* eslint-disable @typescript-eslint/no-require-imports -- executable rendered cross-sell regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const createLoader = require("../autism-test/test/test-loader.cjs");

const loadCatalog = () => createLoader({ "../_lib/featureFlags": { AUTISM_BOOK_SALE_ENABLED: true, ADHD_DELUXE_SALE_ENABLED: true } })(path.join(__dirname, "crossSellConfig.ts"));
function render(sourceProduct, options = {}) {
  const catalog = loadCatalog();
  const offers = catalog.resolveCrossSellOffers(sourceProduct, options);
  const Component = createLoader({
    react: { ...React, useState: () => [offers, () => {}], useEffect: () => {}, useMemo: fn => fn(), useRef: value => ({ current: value }) },
    "next/link": { default: ({ children, ...props }) => React.createElement("a", props, children) },
    "next/image": { default: props => React.createElement("img", props) },
    "../_analytics/analytics": { trackEvent: () => false },
    "./usePaymentRecovery": { hasPaidReturn: () => false },
    "./crossSellConfig": catalog,
  })(path.join(__dirname, "PostPurchaseRecommendation.tsx")).default;
  return { html: renderToStaticMarkup(React.createElement(Component, { sourceProduct })), offers };
}
for (const source of ["adhd_test", "autism_test", "audhd_test"]) {
  const { html, offers } = render(source);
  assert.equal((html.match(/<article/g) || []).length, 2, source);
  assert.equal((html.match(/data-flow="cta"/g) || []).length, 2);
  assert(html.includes("Rekommenderat nästa test"));
  assert(html.includes("Fördjupa dig med en bok"));
  assert(html.includes("md:grid-cols-2"), "two columns only from desktop width; stacked mobile cards");
  for (const offer of offers) {
    const href = offer.product.purchasePath ?? offer.path ?? offer.product.path;
    assert(html.includes(`href="${href.replaceAll("&", "&amp;")}"`));
    assert(html.includes(`${offer.product.price} kr`));
  }
  assert(html.includes("Fullständig analys"));
  assert(html.includes("Köp boken"));
}
const single = render("gaslighting_test");
assert.equal((single.html.match(/<article/g) || []).length, 1);
assert(!single.html.includes("md:grid-cols-2"));
assert.equal(render("iq_test").html, "");
const purchased = render("audhd_test", { hasTestAccess: () => true });
assert.equal((purchased.html.match(/<article/g) || []).length, 1);
assert(!purchased.html.includes("Rekommenderat nästa test"));
assert(purchased.html.includes("Köp boken"));
console.log("PASS: rendered ADHD, autism and AuDHD cards have both correct CTAs, shared prices, mobile structure and safe empty/single offers.");
module.exports = { render };
