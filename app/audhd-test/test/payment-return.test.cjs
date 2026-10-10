/* eslint-disable @typescript-eslint/no-require-imports -- executable client-flow regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../../autism-test/test/test-loader.cjs");

const key = "relationsvarning_audhd_state_v1";
const completeState = unlocked => ({ reportVersion: "audhd-v1", answers: Array(48).fill(2), contextAnswers: Array(6).fill(2), questionIndex: 47, contextIndex: 5, unlocked, report: undefined });

function environment({ paid = false, paidMarker = false, recovery = null, recoveryUnlocked = false, stored = null, runEffects = true } = {}) {
  const data = new Map(stored ? [[key, stored]] : []);
  const slots = [], pending = [];
  let cursor = 0, dirty = true, tree;
  const checkoutNavigations = [];
  const standardTracking = { purchaseCount: 0, paywallRef: () => {}, answer: () => {}, checkout: navigate => checkoutNavigations.push(navigate), restart: () => {}, analysisView: () => {}, resultView: () => {}, purchase() { this.purchaseCount += 1; } };
  if (paidMarker) data.set(key + ":paid", "true");
  global.localStorage = { getItem: item => data.get(item) ?? null, setItem: (item, value) => data.set(item, value), removeItem: item => data.delete(item) };
  const query = paid ? "?paid=true" : recovery ? `?recovery=${recovery}` : "";
  global.window = {
    location: { href: `https://relationsvarning.se/audhd-test/test${query}`, pathname: "/audhd-test/test", search: query },
    history: { replaceState: (_state, _title, url) => { const next = new URL(url, "https://relationsvarning.se"); window.location.href = next.href; window.location.pathname = next.pathname; window.location.search = next.search; } },
  };
  global.fetch = async url => {
    assert.equal(url, "/api/audhd-recovery/status");
    return { ok: true, json: async () => ({ unlocked: recoveryUnlocked }) };
  };
  const react = {
    useState: initial => { const index = cursor++; if (!slots[index]) slots[index] = { value: typeof initial === "function" ? initial() : initial }; return [slots[index].value, value => { const next = typeof value === "function" ? value(slots[index].value) : value; if (!Object.is(next, slots[index].value)) { slots[index].value = next; dirty = true; } }]; },
    useRef: initial => { const index = cursor++; if (!slots[index]) slots[index] = { current: initial }; return slots[index]; },
    useMemo: callback => { cursor += 1; return callback(); },
    useEffect: (callback, deps) => { const index = cursor++; const previous = slots[index]; if (!previous || !deps || deps.some((value, dependencyIndex) => !Object.is(value, previous.deps[dependencyIndex]))) { slots[index] = { deps, cleanup: previous?.cleanup }; pending.push(() => { slots[index].cleanup?.(); slots[index].cleanup = callback(); }); } },
  };
  function PaywallCheckoutCTA() { return null; }
  const load = createLoader({ react, "../../_analytics/useTestAnalytics": { useTestAnalytics: (id, total) => { assert.equal(id, "audhd_test"); assert.equal(total, 54); return standardTracking; } }, "../../_components/PaywallCheckoutCTA": { default: PaywallCheckoutCTA } });
  const Page = load(path.join(__dirname, "page.tsx")).default;
  function renderOnce() { dirty = false; cursor = 0; tree = Page(); }
  async function flush() {
    for (let loops = 0; loops < 60; loops += 1) {
      if (dirty) renderOnce();
      pending.splice(0).forEach(callback => callback());
      await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
      if (!dirty && !pending.length) return;
    }
    throw new Error("render loop");
  }
  function nodes(node = tree) { if (!node || typeof node !== "object") return []; if (Array.isArray(node)) return node.flatMap(nodes); return [node, ...nodes(node.props?.children ?? null)]; }
  function text(node) { if (node == null || typeof node === "boolean") return ""; if (typeof node !== "object") return String(node); if (Array.isArray(node)) return node.map(text).join(""); return text(node.props?.children ?? null); }
  renderOnce();
  function completeCheckout() { const navigate = checkoutNavigations.shift(); assert(navigate, "checkout navigation callback"); navigate(); }
  return { data, standardTracking, PaywallCheckoutCTA, get tree() { return tree; }, flush, nodes, text, completeCheckout, runEffects };
}

const incomplete = JSON.stringify({ ...completeState(false), answers: Array(48).fill(-1) });
const complete = JSON.stringify(completeState(false));
const legacy = JSON.stringify({ answers: Array(54).fill(2), index: 47, unlocked: false, version: 1 });
const isReportView = environment => environment.nodes().some(node => node.type?.name === "ReportView");

(async () => {
  async function ready(options) { const test = environment(options); if (test.runEffects) await test.flush(); return test; }

  // A: checkout persists the exact AuDHD shape before it leaves the test.
  let checkout = await ready({ stored: complete });
  const checkoutCta = checkout.nodes().find(node => node.type === checkout.PaywallCheckoutCTA);
  assert(checkoutCta);
  const paywallText = checkout.text(checkout.tree);
  assert(paywallText.includes("Ett första fynd"));
  assert(paywallText.includes("Din låsta AuDHD-analys innehåller"));
  assert(!paywallText.includes("Ditt huvudresultat"));
  assert(!paywallText.includes("4 av 8 områden"));
  assert(!paywallText.includes("Din huvudprofil"));
  assert.equal(checkout.text(checkoutCta.props.label), "Lås upp min AuDHD-profil · 79 kr");
  assert.equal(checkoutCta.props.trustText, "Engångsbetalning · Ingen prenumeration.");
  checkoutCta.props.onClick();
  assert(!window.location.href.startsWith("https://buy.stripe.com/"), "GA callback may defer Stripe navigation");
  checkout.completeCheckout();
  assert(window.location.href.startsWith("https://buy.stripe.com/"));
  let saved = JSON.parse(checkout.data.get(key));
  assert.equal(saved.unlocked, false); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);

  // D: paid return restores exactly the saved 48 + 6 answers before it unlocks.
  let e = await ready({ paid: true, stored: checkout.data.get(key) });
  assert(isReportView(e));
  saved = JSON.parse(e.data.get(key));
  assert.equal(saved.unlocked, true); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);
  assert.equal(window.location.search, ""); assert.equal(e.standardTracking.purchaseCount, 1);

  // B + C + G: refresh, a new tab and repeated reloads keep the already-unlocked full report.
  e = await ready({ stored: e.data.get(key) });
  assert(isReportView(e));
  e = await ready({ stored: e.data.get(key) });
  assert(isReportView(e));
  saved = JSON.parse(e.data.get(key)); assert.equal(saved.unlocked, true); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);

  // E: a paid return without complete state stays on a visible recovery screen and retains the query.
  e = await ready({ paid: true });
  assert(e.nodes().some(node => e.text(node).includes("Vi kan inte öppna rapporten ännu")));
  assert.equal(window.location.search, "?paid=true"); assert.equal(e.data.has(key), false);

  // F: before the first storage effect runs, the page remains in hydration rather than rendering a blank test.
  e = await ready({ paid: true, stored: complete, runEffects: false });
  assert(e.nodes().some(node => e.text(node).includes("Laddar testet")));
  await e.flush(); assert(isReportView(e));

  // Invalid/incomplete state cannot be upgraded by paid=true.
  e = await ready({ paid: true, stored: incomplete });
  assert(e.nodes().some(node => e.text(node).includes("Vi kan inte öppna rapporten ännu")));
  assert.equal(window.location.search, "?paid=true");

  // Exact legacy generic state is migrated only when all four historic fields match.
  e = await ready({ stored: legacy, paidMarker: true });
  assert(isReportView(e));
  saved = JSON.parse(e.data.get(key));
  assert.equal(saved.unlocked, true); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);
  e = await ready({ stored: legacy });
  saved = JSON.parse(e.data.get(key));
  assert.equal(saved.unlocked, false); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);

  // The already-paid but empty state left by the old flow cannot be reconstructed and must show recovery.
  e = await ready({ stored: JSON.stringify({ ...completeState(true), answers: Array(48).fill(-1), contextAnswers: Array(6).fill(-1) }) });
  assert(e.nodes().some(node => e.text(node).includes("Vi kan inte öppna rapporten ännu")));

  // A valid server-verified recovery starts a fresh unlocked test, then the completed
  // test remains a full report in a new tab without a checkout CTA.
  e = await ready({ recovery: "success", recoveryUnlocked: true });
  saved = JSON.parse(e.data.get(key));
  assert.equal(saved.unlocked, true); assert(saved.answers.every(answer => answer === -1)); assert(saved.contextAnswers.every(answer => answer === -1));
  assert(e.nodes().some(node => e.text(node).includes("Ditt test är redan upplåst")));
  assert.equal(e.nodes().some(node => node.type === e.PaywallCheckoutCTA), false);
  e = await ready({ stored: JSON.stringify(completeState(true)), recoveryUnlocked: true });
  assert(isReportView(e)); assert.equal(e.nodes().some(node => node.type === e.PaywallCheckoutCTA), false);

  // A forged or expired recovery return has no browser unlock effect.
  e = await ready({ recovery: "success", recoveryUnlocked: false });
  assert(e.nodes().some(node => e.text(node).includes("Recovery-länken är ogiltig")));
  saved = JSON.parse(e.data.get(key)); assert.equal(saved.unlocked, false);

  console.log("PASS: AuDHD paid returns restore complete state deterministically; legacy state migrates narrowly; a server-verified recovery starts an unlocked retest with no checkout; invalid recovery cannot unlock.");
})().catch(error => { console.error(error); process.exitCode = 1; });
