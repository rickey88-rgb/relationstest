/* eslint-disable @typescript-eslint/no-require-imports -- rendered newsletter consent and placement tests. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const createLoader = require("../autism-test/test/test-loader.cjs");
let pathname = "/", sent = [];
function loadForms(available = true) {
  let index = 0;
  return createLoader({
    react: { ...React, useEffect: () => {}, useRef: value => ({ current: value }), useId: () => "test", useState: initial => [index++ === 0 ? available : initial, () => {}] },
    "next/navigation": { usePathname: () => pathname },
    "next/link": { default: ({ children, ...props }) => React.createElement("a", props, children) },
    "../_analytics/analytics": { CONSENT_EVENT: "test-consent", trackEvent: (name, params) => { sent.push({ name, params }); return true; } },
  })(path.join(__dirname, "NewsletterSignup.tsx"));
}
for (const source of ["home", "article", "footer", "result"]) {
  const forms = loadForms();
  const html = renderToStaticMarkup(React.createElement(forms.default, { source, compact: source === "footer" || source === "result" }));
  assert(html.includes('type="email"'));
  assert(html.includes('type="checkbox"'));
  assert(!html.includes("checked="), "marketing consent must never be preselected");
  assert(html.includes("Gratis och helt frivilligt. Avsluta när du vill."));
  assert(html.includes("nyhetsbrev/integritet"));
  assert(html.includes("Ja, jag vill följa med!"));
  assert(!html.includes('value="buyer'), "no customer address is prefilled");
  forms.newsletterEvent("newsletter_signup_submit", source);
}
assert(sent.every(event => Object.keys(event.params).join() === "position"));
assert.equal(renderToStaticMarkup(React.createElement(loadForms(false).default, { source: "home" })), "");
for (pathname of ["/adhd-test/test", "/test", "/mina-sidor", "/audhd-bok/tack", "/auth/confirm", "/nyhetsbrev/bekrafta"]) {
  assert.equal(renderToStaticMarkup(React.createElement(loadForms().NewsletterFooterSignup)), "", `no signup during protected flow: ${pathname}`);
}
const files = ["adhd-test/test", "autism-test/test", "audhd-test/test", "hsp-test/test", "ptsd-test/test", "test", "anknytningstest/test", "medberoendetest/test", "gaslightingtest/test", "narcissist-i-en-relation/test", "traumabindningtest/test", "psykisk-misshandel-relation/test", "iq-test/test", "angest-test/test", "narcissism-sjalvtest/test"];
for (const file of files) {
  const code = fs.readFileSync(path.join(__dirname, "..", file, "page.tsx"), "utf8");
  assert.equal((code.match(/<NewsletterAfterResult>/g) || []).length, 1, `exactly one result placement: ${file}`);
}
console.log("PASS: four placements, explicit unchecked consent, exact approved copy, disabled UI, sensitive-flow footer exclusion and no PII in newsletter analytics.");
module.exports = { loadForms };
