"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GA_MEASUREMENT_ID } from "./config";
import { consent, CONSENT_EVENT, CONSENT_KEY, flushEvents, initializeAnalytics, pageView, setConsent, SETTINGS_EVENT, type Consent } from "./analytics";
import { clearAttemptMemory } from "./testEvents";

export default function Analytics() {
  const pathname = usePathname();
  const [choice,setChoice] = useState<Consent>("unknown");
  const [open,setOpen] = useState(false);
  useEffect(() => {
    const update = () => { const value=consent(); setChoice(value); if (value === "denied") clearAttemptMemory(); };
    update(); setOpen(consent() === "unknown");
    const show = () => setOpen(true);
    const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY && (event.newValue === "granted" || event.newValue === "denied")) setConsent(event.newValue); };
    window.addEventListener(CONSENT_EVENT,update); window.addEventListener(SETTINGS_EVENT,show); window.addEventListener("storage",storage);
    return () => { window.removeEventListener(CONSENT_EVENT,update); window.removeEventListener(SETTINGS_EVENT,show); window.removeEventListener("storage",storage); };
  },[]);
  useEffect(() => { if (choice === "granted") { initializeAnalytics(); pageView(pathname); flushEvents(); } },[choice,pathname]);
  function choose(value: "granted" | "denied") { setConsent(value); setOpen(false); }
  return <>
    {choice === "granted" && <Script id="relationsvarning-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" onReady={flushEvents} />}
    {open && <aside aria-label="Statistikinställningar" className="fixed inset-x-2 bottom-2 z-50 mx-auto max-w-[340px] rounded-xl border border-neutral-300 bg-white p-3 text-neutral-900 shadow-lg">
      <h2 className="text-sm font-semibold">Anonym statistik</h2>
      <p className="mt-1 text-xs leading-5">Hjälp oss förbättra testen.</p>
      <div className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={() => choose("granted")} className="min-h-11 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2">Godkänn</button><button type="button" onClick={() => choose("denied")} className="min-h-11 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2">Avvisa</button>{choice !== "unknown" && <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-2 py-2 text-xs underline underline-offset-4">Stäng</button>}</div>
    </aside>}
  </>;
}
export function AnalyticsSettings() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))} className="inline-flex min-h-11 items-center rounded-sm underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">Statistikinställningar</button>;
}
