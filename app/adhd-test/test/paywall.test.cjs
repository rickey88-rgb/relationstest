/* eslint-disable @typescript-eslint/no-require-imports -- source-level paywall regression guard. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "page.tsx"), "utf8");
const analyticsSource = fs.readFileSync(path.join(__dirname, "../../_analytics/testEvents.ts"), "utf8");
const paywallStyles = fs.readFileSync(path.join(__dirname, "../../_components/TestShell.module.css"), "utf8");
const start = source.indexOf('{!unlocked ? <section data-flow="paywall"');
const end = source.indexOf('</section> : <>', start);
assert(start >= 0 && end > start, "The locked ADHD result section must be identifiable.");
const paywall = source.slice(start, end);

assert(paywall.includes("data-adhd-paywall"));
assert(paywall.includes("DITT PERSONLIGA FYND"));
assert(paywall.includes("freeResult.sentences"));
assert(paywall.includes("Dina svar är analyserade. Nu återstår den viktigaste frågan."));
assert(paywall.includes("Din samlade ADHD-profil"));
assert(paywall.includes("Visa min fullständiga analys"));
assert(paywall.includes("data-adhd-cta-price"), "The CTA price needs its own element so it can remain intact on narrow screens.");
assert(paywall.includes("{PRICE_SEK}&nbsp;kr"), "The CTA must keep the price and currency together when it wraps.");
assert(paywall.includes("Engångsbetalning · Ingen prenumeration."));
assert(paywallStyles.includes("[data-adhd-cta-copy], [data-adhd-cta-price]"), "The ADHD CTA text needs an explicit product-scoped contrast rule.");
assert(paywallStyles.includes("color: #101827 !important;"), "The gold ADHD CTA must retain dark text.");
assert(paywallStyles.includes("button[data-adhd-restart]"), "The ADHD restart link needs a product-scoped contrast rule.");
assert(paywallStyles.includes("color: #E5E7EB !important;"), "The ADHD restart link must remain readable on the dark paywall.");
assert(!paywall.includes("{result.level}"), "Overall level must remain locked.");
assert(!paywall.includes("levelTexts[result.level]"), "Overall level explanation must remain locked.");
assert(!paywall.includes("result.symptomIndex"), "Index must remain locked.");
assert(!paywall.includes("result.profileType"), "Profile type must remain locked.");
assert(analyticsSource.includes('adhd_test: "personal-finding-v3"'), "ADHD analytics must identify the Paywall 3.0 presentation.");

console.log("PASS: ADHD Paywall 3.0 keeps a bounded personal finding and locks the full assessment.");
