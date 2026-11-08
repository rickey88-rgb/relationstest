import { captureGa4CheckoutAttribution, consent, privateAnalyticsPath, trackEventBeforeNavigation, type EventParams } from "./analytics";

const KEY = "rv_measurement_key";
const WITHDRAWAL = "rv_measurement_withdrawal";
const ENTRY = "rv_measurement_entry";
const LAST_ENTRY = "rv_measurement_last_entry";
let remembered = false;
const CONSENT_VERSION = "checkout-statistics-v1";
let inFlightWithdrawal: Promise<void> | undefined;

type Landing = { path: string; referrer: string | null; campaign: Record<string, string> };

function landing(): Landing {
  const url = new URL(window.location.href);
  let referrer = null;
  try { referrer = new URL(document.referrer).origin; } catch { /* Direct visit. */ }
  const campaign: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_id"]) {
    const value = url.searchParams.get(key);
    if (value && /^[A-Za-z0-9_-]{1,64}$/.test(value)) campaign[key] = value;
  }
  return { path: url.pathname, referrer, campaign };
}

export function rememberCheckoutLanding() {
  try {
    if (remembered || consent() !== "granted" || privateAnalyticsPath(window.location.pathname)) return;
    const entry = JSON.stringify(landing());
    if (!sessionStorage.getItem(ENTRY)) sessionStorage.setItem(ENTRY, entry);
    sessionStorage.setItem(LAST_ENTRY, entry);
    remembered = true;
  } catch { /* Optional attribution. */ }
}

async function measurementRequest(body: Record<string, unknown>, keepalive = false) {
  return fetch("/api/checkout-measurement", {
    method: "POST", credentials: "same-origin", cache: "no-store", keepalive,
    signal: AbortSignal.timeout(900),
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
}

export function withdrawCheckoutMeasurement() {
  if (inFlightWithdrawal) return inFlightWithdrawal;
  inFlightWithdrawal = (async () => {
    try {
      if (consent() === "denied") {
        sessionStorage.removeItem(ENTRY);
        sessionStorage.removeItem(LAST_ENTRY);
        remembered = false;
      }
      const key = localStorage.getItem(KEY);
      const pending: string[] = JSON.parse(localStorage.getItem(WITHDRAWAL) ?? "[]");
      if (key && consent() === "denied") {
        if (!pending.includes(key)) pending.push(key);
        localStorage.setItem(WITHDRAWAL, JSON.stringify(pending));
        localStorage.removeItem(KEY);
      }
      for (const browserKey of pending) {
        const result = await measurementRequest({ action: "withdraw", browserKey }, true);
        if (result.ok) {
          const saved: string[] = JSON.parse(localStorage.getItem(WITHDRAWAL) ?? "[]");
          const remaining = saved.filter(value => value !== browserKey);
          if (remaining.length) localStorage.setItem(WITHDRAWAL, JSON.stringify(remaining));
          else localStorage.removeItem(WITHDRAWAL);
        }
      }
    } catch { /* Retry on a subsequent page visit. */ }
  })().finally(() => { inFlightWithdrawal = undefined; });
  return inFlightWithdrawal;
}

export async function captureCheckoutReference(product: string) {
  try {
    if (consent() !== "granted" || privateAnalyticsPath(window.location.pathname)) return null;
    let browserKey = localStorage.getItem(KEY);
    if (!browserKey) {
      browserKey = crypto.randomUUID().replaceAll("-", "");
      localStorage.setItem(KEY, browserKey);
    }
    const identifiers = await captureGa4CheckoutAttribution();
    if (!identifiers || consent() !== "granted" || localStorage.getItem(KEY) !== browserKey) return null;
    const last = JSON.parse(sessionStorage.getItem(LAST_ENTRY) ?? "null") as Landing | null ?? landing();
    const first = JSON.parse(sessionStorage.getItem(ENTRY) ?? "null") as Landing | null;
    const response = await measurementRequest({
      action: "capture", consentVersion: CONSENT_VERSION, product, browserKey, ...identifiers,
      firstLanding: first?.path ?? last.path, lastLanding: last.path,
      firstReferrer: first ? first.referrer : last.referrer, lastReferrer: last.referrer,
      campaign: { ...first?.campaign, ...last.campaign },
    });
    if (!response.ok || consent() !== "granted" || localStorage.getItem(KEY) !== browserKey) return null;
    const value = await response.json();
    return typeof value.reference === "string" && /^rv_[a-f0-9]{32}$/.test(value.reference) ? value.reference : null;
  } catch { return null; }
}

export async function paymentLinkWithMeasurement(link: string, product: string) {
  try {
    const url = new URL(link);
    if (url.origin !== "https://buy.stripe.com" || url.searchParams.has("client_reference_id")) return link;
    const reference = await captureCheckoutReference(product);
    if (reference) url.searchParams.set("client_reference_id", reference);
    return reference ? url.href : link;
  } catch { return link; }
}


export function bookPaymentProduct(id: string) {
  switch (id) {
    case "adhd-deluxe": return "adhd_deluxe";
    case "autism-bok": return "autism_bok";
    case "audhd-bok": return "audhd_bok";
    default: return null;
  }
}

let openingPaymentLink = false;
if (typeof window !== "undefined") window.addEventListener?.("pageshow", () => { openingPaymentLink = false; });

export function openMeasuredPaymentLink(event: {
  defaultPrevented: boolean; button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean;
  preventDefault: () => void;
}, link: string, product: string | null, params: EventParams) {
  if (!product || consent() !== "granted" || privateAnalyticsPath(window.location.pathname) || event.defaultPrevented ||
    event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (openingPaymentLink) return;
  openingPaymentLink = true;
  void paymentLinkWithMeasurement(link, product).then(url => {
    trackEventBeforeNavigation("begin_checkout", params, () => {
      try { window.location.assign(url); } finally { openingPaymentLink = false; }
    });
  });
}
