/* eslint-disable @typescript-eslint/no-require-imports -- executable client-flow regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../../autism-test/test/test-loader.cjs");

const key = "relationsvarning_audhd_state_v1";
const answers = Array(48).fill(2), contextAnswers = Array(6).fill(2);
const completeState = unlocked => ({ reportVersion: "audhd-v1", answers, contextAnswers, questionIndex: 47, contextIndex: 5, unlocked, report: undefined });
const restored = { restored: true, answers: { reportVersion: "audhd-v1", answers, contextAnswers } };

function environment({ query = "", recoveryUnlocked = false, secureRestore = null, stored = null, checkoutFailure = false, runEffects = true } = {}) {
  const data = new Map(stored ? [[key, stored]] : []), slots = [], pending = [], requests = [];
  let cursor = 0, dirty = true, tree;
  const checkoutNavigations = [];
  const standardTracking = { paywallRef: () => {}, answer: () => {}, checkout: navigate => checkoutNavigations.push(navigate), restart: () => {}, analysisView: () => {}, resultView: () => {}, purchase: () => {} };
  global.localStorage = { getItem: item => data.get(item) ?? null, setItem: (item, value) => data.set(item, value), removeItem: item => data.delete(item) };
  global.window = { location: { href: `https://relationsvarning.se/audhd-test/test${query}`, pathname: "/audhd-test/test", search: query, assign: url => { window.location.href = url; } }, history: { replaceState: (_state, _title, url) => { const next = new URL(url, "https://relationsvarning.se"); window.location.href = next.href; window.location.pathname = next.pathname; window.location.search = next.search; } } };
  global.fetch = async (url, options = {}) => {
    requests.push({ url, options });
    if (url === "/api/audhd-checkout/restore") return secureRestore ? { ok: true, json: async () => secureRestore } : { ok: false, json: async () => ({ restored: false }) };
    if (url === "/api/audhd-recovery/restore") return { ok: false, json: async () => ({ restored: false }) };
    if (url === "/api/audhd-recovery/status") return { ok: true, json: async () => ({ unlocked: recoveryUnlocked }) };
    if (url === "/api/audhd-checkout/prepare") return checkoutFailure ? { ok: false, json: async () => ({}) } : { ok: true, json: async () => ({ attemptId: "5f2c9a20-8c14-4df9-88c6-5bb87197789a" }) };
    if (url === "/api/audhd-checkout/start") return checkoutFailure ? { ok: false, json: async () => ({}) } : { ok: true, json: async () => ({ checkoutUrl: "https://checkout.stripe.com/c/pay/cs_live_secure" }) };
    throw new Error(`Unexpected fetch: ${url}`);
  };
  const react = {
    useState: initial => { const index = cursor++; if (!slots[index]) slots[index] = { value: typeof initial === "function" ? initial() : initial }; return [slots[index].value, value => { const next = typeof value === "function" ? value(slots[index].value) : value; if (!Object.is(next, slots[index].value)) { slots[index].value = next; dirty = true; } }]; },
    useRef: initial => { const index = cursor++; if (!slots[index]) slots[index] = { current: initial }; return slots[index]; },
    useMemo: callback => { cursor += 1; return callback(); },
    useEffect: (callback, deps) => { const index = cursor++; const previous = slots[index]; if (!previous || !deps || deps.some((value, i) => !Object.is(value, previous.deps[i]))) { slots[index] = { deps, cleanup: previous?.cleanup }; pending.push(() => { slots[index].cleanup?.(); slots[index].cleanup = callback(); }); } },
  };
  function PaywallCheckoutCTA() { return null; }
  const load = createLoader({ react, "../../_analytics/useTestAnalytics": { useTestAnalytics: () => standardTracking }, "../../_components/PaywallCheckoutCTA": { default: PaywallCheckoutCTA } });
  const Page = load(path.join(__dirname, "page.tsx")).default;
  function renderOnce() { dirty = false; cursor = 0; tree = Page(); }
  async function flush() { for (let loops = 0; loops < 80; loops += 1) { if (dirty) renderOnce(); pending.splice(0).forEach(callback => callback()); for (let tick = 0; tick < 12; tick += 1) await Promise.resolve(); if (!dirty && !pending.length && loops > 1) return; } throw new Error("render loop"); }
  function nodes(node = tree) { if (!node || typeof node !== "object") return []; if (Array.isArray(node)) return node.flatMap(nodes); return [node, ...nodes(node.props?.children ?? null)]; }
  function text(node) { if (node == null || typeof node === "boolean") return ""; if (typeof node !== "object") return String(node); if (Array.isArray(node)) return node.map(text).join(""); return text(node.props?.children ?? null); }
  renderOnce();
  return { data, requests, PaywallCheckoutCTA, get tree() { return tree; }, flush, nodes, text, async completeCheckout() { for (let i = 0; i < 10 && !checkoutNavigations.length; i += 1) await Promise.resolve(); const navigate = checkoutNavigations.shift(); assert(navigate, "checkout navigation callback"); navigate(); }, runEffects };
}

const complete = JSON.stringify(completeState(false));
const isReportView = test => test.nodes().some(node => node.type?.name === "ReportView");

(async () => {
  async function ready(options) { const test = environment(options); if (test.runEffects) await test.flush(); return test; }

  let test = await ready({ secureRestore: restored });
  assert(isReportView(test));
  assert.equal(test.nodes().some(node => node.type === test.PaywallCheckoutCTA), false);
  assert.equal(JSON.parse(test.data.get(key)).unlocked, false, "local cache is never an entitlement");

  test = await ready({ query: "?paid=true", stored: JSON.stringify(completeState(true)) });
  assert(test.text(test.tree).includes("Betala inte igen"));
  assert.equal(window.location.search, "");
  assert.equal(isReportView(test), false);

  test = await ready({ query: "?checkout=cancelled", stored: complete });
  assert(test.text(test.tree).includes("Betalningen avbröts"));
  assert(test.nodes().some(node => node.type === test.PaywallCheckoutCTA));
  assert.equal(window.location.search, "");

  test = await ready({ stored: complete });
  const cta = test.nodes().find(node => node.type === test.PaywallCheckoutCTA);
  assert(cta);
  cta.props.onClick(); cta.props.onClick();
  await test.completeCheckout();
  const prepare = test.requests.find(request => request.url === "/api/audhd-checkout/prepare");
  const start = test.requests.find(request => request.url === "/api/audhd-checkout/start");
  assert(prepare && start);
  const posted = JSON.parse(prepare.options.body);
  assert.deepEqual(posted.answers, answers); assert.deepEqual(posted.contextAnswers, contextAnswers); assert.equal(posted.reportVersion, "audhd-v1");
  assert.equal(JSON.parse(start.options.body).attemptId, "5f2c9a20-8c14-4df9-88c6-5bb87197789a");
  assert.equal(window.location.href, "https://checkout.stripe.com/c/pay/cs_live_secure");
  assert.equal(test.requests.filter(request => request.url === "/api/audhd-checkout/prepare").length, 1, "double click makes one checkout attempt");

  test = await ready({ stored: complete, checkoutFailure: true });
  test.nodes().find(node => node.type === test.PaywallCheckoutCTA).props.onClick();
  await test.flush();
  assert(test.text(test.tree).includes("du har inte debiterats"));

  test = await ready({ recoveryUnlocked: true });
  assert(test.text(test.tree).includes("Ditt betalda resultat har inte ersatts"), "cleared local storage in another browser context does not become a new blank paid test");
  assert.equal(test.nodes().some(node => node.type === test.PaywallCheckoutCTA), false);

  console.log("PASS: AuDHD client checkout uses prepare/start, restores only server-verified answers, and ignores local or query-string payment bypasses.");
})().catch(error => { console.error(error); process.exitCode = 1; });
