/* eslint-disable @typescript-eslint/no-require-imports -- Node integration harness for the client page. */
const assert = require('node:assert/strict');
const path = require('node:path');
const loadWith = require('../../autism-test/test/test-loader.cjs');

const key = 'psykiskt_vald_test_state_v1';
const data = new Map([[key, JSON.stringify({ index: 29, answers: [...Array(29).fill(2), -1], unlocked: false })]]);
const events = [];
const timers = new Map();
const slots = [];
const pending = [];
let cursor = 0, dirty = true, tree, clock = 0, sequence = 0;
global.localStorage = { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: k => data.delete(k) };
global.window = { location: { search: '', pathname: '/psykisk-misshandel-relation/test' }, scrollTo: () => {}, history: { replaceState: () => {} } };
global.setTimeout = (fn, delay) => { const id = ++sequence; timers.set(id, { at: clock + delay, fn }); return id; };
global.clearTimeout = id => timers.delete(id);
const react = {
  useState: initial => { const i = cursor++; if (!slots[i]) slots[i] = { value: typeof initial === 'function' ? initial() : initial }; return [slots[i].value, value => { const next = typeof value === 'function' ? value(slots[i].value) : value; if (next !== slots[i].value) { slots[i].value = next; dirty = true; } }]; },
  useRef: initial => { const i = cursor++; if (!slots[i]) slots[i] = { current: initial }; return slots[i]; },
  useMemo: fn => fn(),
  useEffect: (fn, deps) => { const i = cursor++; const old = slots[i]; if (!old || !deps || deps.some((value, n) => !Object.is(value, old.deps[n]))) { slots[i] = { deps, cleanup: old?.cleanup }; pending.push(() => { slots[i].cleanup?.(); slots[i].cleanup = fn(); }); } },
};
const tracking = { answer: (...args) => events.push(args), purchase: () => {}, restart: () => {}, checkout: () => {}, paywallRef: () => {} };
const load = loadWith({ react, '../../_analytics/useTestAnalytics': { useTestAnalytics: () => tracking }, '../../_components/usePaymentRecovery': { hasPaidReturn: () => false, usePaymentRecovery: () => ({ checkoutError: null, prepareCheckout: () => true }) }, '../../_components/PostPurchaseRecommendation': { default: () => null }, '../../_components/PaywallCheckoutCTA': { default: () => null } });
const Page = load(path.join(__dirname, 'page.tsx')).default;
function render() { let loops = 0; while (dirty || pending.length) { if (++loops > 20) throw Error('render loop'); if (dirty) { dirty = false; cursor = 0; tree = Page(); } pending.splice(0).forEach(fn => fn()); } }
function nodes(node = tree) { if (!node || typeof node !== 'object') return []; if (Array.isArray(node)) return node.flatMap(nodes); return [node, ...nodes(node.props?.children ?? null)]; }
function text(node) { if (node == null || typeof node === 'boolean') return ''; if (typeof node !== 'object') return String(node); if (Array.isArray(node)) return node.map(text).join(''); return text(node.props?.children ?? null); }
function advance(ms) { clock += ms; for (const [id, timer] of [...timers]) if (timer.at <= clock) { timers.delete(id); timer.fn(); render(); } }
render();
assert(nodes().some(node => text(node).includes('Fråga 30 av 30')));
const answerButton = nodes().find(node => node.type === 'button' && text(node) === 'Ibland');
assert(answerButton);
answerButton.props.onClick();
answerButton.props.onClick();
render();
assert.equal(events.length, 1);
assert.equal(events[0][0], 30);
assert.equal(events[0][1], 30);
assert.deepEqual(JSON.parse(data.get(key)).answers, Array(30).fill(2));
advance(220);
assert(nodes().some(node => text(node).includes('Vi sammanställer din analys')));
assert.equal(events.length, 1);
advance(3000);
assert(nodes().some(node => node.type === 'h3' && text(node) === 'I din fullständiga analys ser du'));
assert.equal(events.length, 1);
