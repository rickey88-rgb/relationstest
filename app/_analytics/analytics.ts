import { GA_MEASUREMENT_ID } from "./config";

export const CONSENT_KEY = "rv_analytics_consent_v1";
export const CONSENT_EVENT = "rv:analytics-consent";
export const SETTINGS_EVENT = "rv:analytics-settings";
export const ATTEMPT_PREFIX = "rv_analytics_attempt_v1:";
export type Consent = "granted" | "denied" | "unknown";
export type EventName = "page_view" | "test_start" | "test_progress" | "test_complete" | "paywall_view" | "checkout_start" | "purchase";
export type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
let memoryConsent: Consent | undefined;
const pending: { name: EventName; params: EventParams }[] = [];
let initialized = false;
// Captured before any test effect removes paid=true/other query parameters.
const initialUrl = typeof window === "undefined" ? "" : window.location.href;
const initialReferrer = typeof document === "undefined" ? "" : document.referrer;
let lastPage = "";
const allowedParams = new Set(["test_id", "test_name", "page_path", "progress_percent", "current_question", "total_questions", "completion_time_seconds", "price", "value", "currency", "transaction_id", "page_location", "page_referrer", "page_title"]);
const campaignKeys = ["gclid", "dclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id"];

export function consent(): Consent {
  if (typeof window === "undefined") return "unknown";
  if (memoryConsent) return memoryConsent;
  try { const saved = localStorage.getItem(CONSENT_KEY); return saved === "granted" || saved === "denied" ? saved : "unknown"; } catch { return "unknown"; }
}
export function safeLocation(raw: string) {
  try { const url = new URL(raw); const query = new URLSearchParams(); for (const key of campaignKeys) { const value = url.searchParams.get(key); if (value) query.set(key,value); } return url.origin + url.pathname + (query.size ? "?" + query.toString() : ""); } catch { return ""; }
}
function referrer(raw: string) { try { const url = new URL(raw); return url.origin + url.pathname; } catch { return ""; } }
export function trackEvent(name: EventName, params: EventParams = {}): boolean {
  try {
    if (typeof window === "undefined" || consent() !== "granted") return false;
    // Never accept answers, test scores, profile types, question text or arbitrary parameters.
    const safe = Object.fromEntries(Object.entries(params).filter(([key,value]) => allowedParams.has(key) && value !== undefined && (typeof value !== "number" || Number.isFinite(value))));
    if (typeof window.gtag !== "function" || !initialized) {
      if (pending.length >= 100) return false;
      pending.push({name,params:safe});
    } else window.gtag("event", name, { ...safe, send_to: GA_MEASUREMENT_ID, transport_type: "beacon" });
    if (process.env.NODE_ENV === "development") console.debug("[GA4]",name,safe);
    return true;
  } catch { return false; }
}
export function initializeAnalytics() {
  try {
  if (typeof window === "undefined" || consent() !== "granted") return;
  (window as unknown as Record<string,unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  if (initialized) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer?.push(arguments); };
  window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: safeLocation(initialUrl), page_referrer: referrer(initialReferrer), cookie_flags: "SameSite=Lax;Secure" });
  initialized = true;
  } catch { /* Analytics must never break rendering, even when scripts are blocked. */ }
}
export function flushEvents() {
  if (!initialized || consent() !== "granted" || typeof window.gtag !== "function") return;
  for (const item of pending.splice(0)) trackEvent(item.name,item.params);
}
export function pageView(pathname: string) {
  if (typeof window === "undefined" || consent() !== "granted") return;
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === lastPage) return;
  const initialPath = initialUrl ? new URL(initialUrl).pathname.replace(/\/$/, "") || "/" : "";
  const location = !lastPage && initialPath === normalized ? safeLocation(initialUrl) : safeLocation(window.location.href);
  try { window.gtag?.("set", { page_location: location, page_title: document.title }); } catch { /* Optional analytics. */ }
  if (trackEvent("page_view", { page_path: normalized, page_location: location, page_title: document.title, page_referrer: lastPage ? window.location.origin + lastPage : referrer(initialReferrer) })) lastPage = normalized;
}
export function setConsent(value: "granted" | "denied") {
  memoryConsent = value;
  try { localStorage.setItem(CONSENT_KEY,value); } catch { /* Choice still works for this page. */ }
  if (value === "denied") {
    (window as unknown as Record<string,unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
    pending.length = 0;
    lastPage = "";
    try { window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }); } catch { /* Never affect the site. */ }
    for (const storage of ["localStorage", "sessionStorage"] as const) {
      try { const target = window[storage]; for (let i=target.length-1;i>=0;i--) { const key = target.key(i); if (key?.startsWith(ATTEMPT_PREFIX)) target.removeItem(key); } } catch { /* Blocked storage. */ }
    }
    const host = window.location.hostname;
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ["",host,"."+host,"."+host.split(".").slice(-2).join(".")]) document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""}`;
    }
  } else if (initialized) {
    (window as unknown as Record<string,unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
    try { window.gtag?.("consent", "update", { analytics_storage: "granted" }); } catch { /* Optional analytics. */ }
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
