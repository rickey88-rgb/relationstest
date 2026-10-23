const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "SwishPaymentMark.tsx"), "utf8");
const paywallSource = fs.readFileSync(path.join(__dirname, "PaywallCheckoutCTA.tsx"), "utf8");

assert.match(source, /https:\/\/www\.swish\.nu\/assets\/swish-logotype-C2_aqj3N\.svg/);
assert.match(source, /alt="Swish"/);
assert.doesNotMatch(source, /opacity-|scale-|rotate-|skew-/);
assert.match(paywallSource, /<SwishPaymentMark \/>/);
assert.match(paywallSource, /Betalningsalternativ: Swish, Klarna, Visa och Mastercard/);

for (const landing of ["adhd-test", "angest-test", "audhd-test", "autism-test", "hsp-test", "ptsd-test"]) {
  const landingSource = fs.readFileSync(path.join(__dirname, "..", landing, "page.tsx"), "utf8");
  assert.doesNotMatch(landingSource, /SwishPaymentMark|Betala tryggt med Swish eller kort/);
}

console.log("Swish payment mark checks passed.");
