/* eslint-disable @typescript-eslint/no-require-imports -- executable client-flow regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../../autism-test/test/test-loader.cjs");

const key = "relationsvarning_audhd_state_v1";
const completeState = unlocked => ({ reportVersion: "audhd-v1", answers: Array(48).fill(2), contextAnswers: Array(6).fill(2), questionIndex: 47, contextIndex: 5, unlocked, report: undefined });

function environment({ paid = false, paidMarker = false, stored = null, runEffects = true } = {}) {
  const data = new Map(stored ? [[key, stored]] : []);
  const slots = [], pending = [];
  let cursor = 0, dirty = true, tree;
  const tracking = { purchaseCount: 0, result: () => {}, analysis: () => {}, paywall: () => {}, progress: () => {}, start: () => {}, complete: () => {}, cta: () => {}, checkout: () => {}, purchase() { this.purchaseCount += 1; } };
  if (paidMarker) data.set(key + ":paid", "true");
  global.localStorage = { getItem: item => data.get(item) ?? null, setItem: (item, value) => data.set(item, value), removeItem: item => data.delete(item) };
  global.window = {
    location: { href: `https://relationsvarning.se/audhd-test/test${paid ? "?paid=true" : ""}`, pathname: "/audhd-test/test", search: paid ? "?paid=true" : "" },
    history: { replaceState: (_state, _title, url) => { const next = new URL(url, "https://relationsvarning.se"); window.location.href = next.href; window.location.pathname = next.pathname; window.location.search = next.search; } },
  };
  const react = {
    useState: initial => { const index = cursor++; if (!slots[index]) slots[index] = { value: typeof initial === "function" ? initial() : initial }; return [slots[index].value, value => { const next = typeof value === "function" ? value(slots[index].value) : value; if (!Object.is(next, slots[index].value)) { slots[index].value = next; dirty = true; } }]; },
    useRef: initial => { const index = cursor++; if (!slots[index]) slots[index] = { current: initial }; return slots[index]; },
    useMemo: callback => { cursor += 1; return callback(); },
    useEffect: (callback, deps) => { const index = cursor++; const previous = slots[index]; if (!previous || !deps || deps.some((value, dependencyIndex) => !Object.is(value, previous.deps[dependencyIndex]))) { slots[index] = { deps, cleanup: previous?.cleanup }; pending.push(() => { slots[index].cleanup?.(); slots[index].cleanup = callback(); }); } },
  };
  function PaywallCheckoutCTA() { return null; }
  const load = createLoader({ react, "./analytics": { useAudhdAnalytics: () => tracking }, "../../_components/PaywallCheckoutCTA": { default: PaywallCheckoutCTA } });
  const Page = load(path.join(__dirname, "page.tsx")).default;
  function renderOnce() { dirty = false; cursor = 0; tree = Page(); }
  function flush() { let loops = 0; while (dirty || pending.length) { if (++loops > 30) throw new Error("render loop"); if (dirty) renderOnce(); pending.splice(0).forEach(callback => callback()); } }
  function nodes(node = tree) { if (!node || typeof node !== "object") return []; if (Array.isArray(node)) return node.flatMap(nodes); return [node, ...nodes(node.props?.children ?? null)]; }
  function text(node) { if (node == null || typeof node === "boolean") return ""; if (typeof node !== "object") return String(node); if (Array.isArray(node)) return node.map(text).join(""); return text(node.props?.children ?? null); }
  renderOnce(); if (runEffects) flush();
  return { data, tracking, PaywallCheckoutCTA, get tree() { return tree; }, flush, nodes, text };
}

const incomplete = JSON.stringify({ ...completeState(false), answers: Array(48).fill(-1) });
const complete = JSON.stringify(completeState(false));
const legacy = JSON.stringify({ answers: Array(54).fill(2), index: 47, unlocked: false, version: 1 });
const isReportView = environment => environment.tree?.type?.name === "ReportView";

// A: checkout persists the exact AuDHD shape before it leaves the test.
let checkout = environment({ stored: complete });
const checkoutCta = checkout.nodes().find(node => node.type === checkout.PaywallCheckoutCTA);
assert(checkoutCta);
checkoutCta.props.onClick();
assert(window.location.href.startsWith("https://buy.stripe.com/"));
let saved = JSON.parse(checkout.data.get(key));
assert.equal(saved.unlocked, false); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);

// D: paid return restores exactly the saved 48 + 6 answers before it unlocks.
let e = environment({ paid: true, stored: checkout.data.get(key) });
assert(isReportView(e));
saved = JSON.parse(e.data.get(key));
assert.equal(saved.unlocked, true); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);
assert.equal(window.location.search, ""); assert.equal(e.tracking.purchaseCount, 1);

// B + C + G: refresh, a new tab and repeated reloads keep the already-unlocked full report.
e = environment({ stored: e.data.get(key) });
assert(isReportView(e));
e = environment({ stored: e.data.get(key) });
assert(isReportView(e));
saved = JSON.parse(e.data.get(key)); assert.equal(saved.unlocked, true); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);

// E: a paid return without complete state stays on a visible recovery screen and retains the query.
e = environment({ paid: true });
assert(e.nodes().some(node => e.text(node).includes("Vi kan inte öppna rapporten ännu")));
assert.equal(window.location.search, "?paid=true"); assert.equal(e.data.has(key), false);

// F: before the first storage effect runs, the page remains in hydration rather than rendering a blank test.
e = environment({ paid: true, stored: complete, runEffects: false });
assert(e.nodes().some(node => e.text(node).includes("Laddar testet")));
e.flush(); assert(isReportView(e));

// Invalid/incomplete state cannot be upgraded by paid=true.
e = environment({ paid: true, stored: incomplete });
assert(e.nodes().some(node => e.text(node).includes("Vi kan inte öppna rapporten ännu")));
assert.equal(window.location.search, "?paid=true");

// Exact legacy generic state is migrated only when all four historic fields match.
e = environment({ stored: legacy, paidMarker: true });
assert(isReportView(e));
saved = JSON.parse(e.data.get(key));
assert.equal(saved.unlocked, true); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);
e = environment({ stored: legacy });
saved = JSON.parse(e.data.get(key));
assert.equal(saved.unlocked, false); assert.equal(saved.answers.length, 48); assert.equal(saved.contextAnswers.length, 6);

// The already-paid but empty state left by the old flow cannot be reconstructed and must show recovery.
e = environment({ stored: JSON.stringify({ ...completeState(true), answers: Array(48).fill(-1), contextAnswers: Array(6).fill(-1) }) });
assert(e.nodes().some(node => e.text(node).includes("Vi kan inte öppna rapporten ännu")));

console.log("PASS: AuDHD paid return restores complete state deterministically; refresh/new tab/reload persist unlock; exact 54-answer legacy state migrates; unrecoverable paid state shows recovery without stripping paid=true.");
