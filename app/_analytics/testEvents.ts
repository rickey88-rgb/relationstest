import { ATTEMPT_PREFIX, consent, trackEvent, trackEventBeforeNavigation, type EcommerceItem } from "./analytics";
import { ANALYTICS_RELEASE_ID, testConfig, type TestId } from "./config";

type Attempt = { version: 1; updatedAt: number; id: string; startedAt: number | null; completedAt: number | null; started: boolean; milestones: number[]; complete: boolean; teaser?: boolean; paywall: boolean; purchase: boolean };
const memory = new Map<TestId, Attempt>();
let checkoutNavigationInFlight = false;
// Bump a test's value only when its pre-purchase presentation changes. These labels
// contain no answer or result data, and let the standard funnel be compared safely.
const paywallVersion: Partial<Record<TestId, string>> = {
  adhd_test: "personal-finding-v2",
  autism_test: "personal-finding-v2",
  audhd_test: "personal-finding-v2",
};
function fresh(): Attempt {
  return {version:1,updatedAt:Date.now(),id:typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,startedAt:null,completedAt:null,started:false,milestones:[],complete:false,paywall:false,purchase:false};
}
function read(id: TestId): Attempt {
  const candidates: Attempt[] = memory.has(id) ? [memory.get(id)!] : [];
  for (const storage of ["localStorage","sessionStorage"] as const) {
    try { const raw = window[storage].getItem(ATTEMPT_PREFIX+id); const saved = raw ? JSON.parse(raw) : null;
      if (saved?.version === 1 && typeof saved.id === "string" && Array.isArray(saved.milestones)) candidates.push(saved);
    } catch { /* Fall back to other storage or memory. */ }
  }
  return candidates.sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0] ?? fresh();
}
function save(id: TestId, attempt: Attempt) {
  attempt.updatedAt = Date.now();
  memory.set(id,attempt);
  for (const storage of ["localStorage","sessionStorage"] as const) {
    try { window[storage].setItem(ATTEMPT_PREFIX+id,JSON.stringify(attempt)); return; } catch { /* Try next store. */ }
  }
}
const identity = (id: TestId, attempt: Attempt) => ({ test_id:id, test_name:testConfig[id].name, attempt_id:attempt.id, paywall_version:paywallVersion[id] ?? "default", release_id:ANALYTICS_RELEASE_ID });
const commerce = (id: TestId, attempt: Attempt) => ({
  ...identity(id, attempt),
  value: testConfig[id].price,
  currency: testConfig[id].currency,
  items: [{ item_id: id, item_name: testConfig[id].name, price: testConfig[id].price, quantity: 1 }] satisfies EcommerceItem[],
});
// Counts only; answers and result data are deliberately never accepted here.
export function answerEvent(id: TestId, answered: number, currentQuestion: number, total: number) {
  try {
    if (consent() !== "granted" || answered < 1 || total < 1) return;
    const attempt = read(id);
    if (!attempt.started) {
      attempt.startedAt = Date.now();
      attempt.started = trackEvent("test_start",{...identity(id,attempt),page_path:testConfig[id].path});
    }
    for (const milestone of [25,50,75]) {
      if (answered / total * 100 >= milestone && !attempt.milestones.includes(milestone)
        && trackEvent("test_progress",{...identity(id,attempt),progress_percent:milestone,current_question:currentQuestion,total_questions:total})) attempt.milestones.push(milestone);
    }
    if (answered >= total && !attempt.complete) {
      attempt.completedAt = Date.now();
      attempt.complete = trackEvent("test_complete",{...identity(id,attempt),total_questions:total,completion_time_seconds:Math.max(0,Math.round((attempt.completedAt-(attempt.startedAt ?? attempt.completedAt))/1000))});
    }
    save(id,attempt);
  } catch { /* Tracking never changes test behavior. */ }
}
export function paywallEvent(id: TestId) {
  try { if (consent() !== "granted") return; const attempt=read(id); if (attempt.paywall) return;
    attempt.paywall=trackEvent("paywall_view",{...commerce(id,attempt),price:testConfig[id].price}); save(id,attempt);
  } catch { /* Optional measurement. */ }
}
export function teaserEvent(id: TestId) {
  try { if (consent() !== "granted") return; const attempt = read(id); if (attempt.teaser) return;
    attempt.teaser = trackEvent("teaser_view", { ...identity(id,attempt) }); save(id, attempt);
  } catch { /* Optional measurement never changes the result flow. */ }
}
export function diagnosticEvent(id: TestId, name: "analysis_view" | "result_view") {
  try { if (consent() === "granted") { const attempt = read(id); trackEvent(name, identity(id, attempt)); save(id, attempt); } }
  catch { /* Optional diagnostics never change the test flow. */ }
}
export function checkoutEvent(id: TestId, navigate?: () => void) {
  if (checkoutNavigationInFlight) return false;
  checkoutNavigationInFlight = true;
  const finish = () => {
    try { navigate?.(); }
    finally { if (!navigate) checkoutNavigationInFlight = false; }
  };
  try {
    if (consent() !== "granted") { finish(); return false; }
    const attempt=read(id); save(id,attempt);
    const params = commerce(id,attempt);
    if (navigate) return trackEventBeforeNavigation("begin_checkout",params,finish);
    const tracked = trackEvent("begin_checkout",params);
    checkoutNavigationInFlight = false;
    return tracked;
  } catch { finish(); return false; }
}
export function purchaseEvent(id: TestId) {
  try { if (consent() !== "granted") return; const attempt=read(id); if (attempt.purchase) return;
    // This is a paid=true return, not a Stripe-verified transaction. Stripe Dashboard/webhooks
    // remain the source of truth for actual purchases; this stable ID only enables GA4 deduplication.
    attempt.purchase=trackEvent("purchase",{...commerce(id,attempt),transaction_id:`rv-${id}-${attempt.id}`}); save(id,attempt);
  } catch { /* Never affect unlock. */ }
}
export function restartEvents(id: TestId) {
  try { memory.delete(id); for (const storage of ["localStorage","sessionStorage"] as const) { try { window[storage].removeItem(ATTEMPT_PREFIX+id); } catch { /* Optional store. */ } } if (consent() === "granted") save(id,fresh()); } catch { /* Never affect restart. */ }
}
export function clearAttemptMemory() { memory.clear(); checkoutNavigationInFlight = false; }
