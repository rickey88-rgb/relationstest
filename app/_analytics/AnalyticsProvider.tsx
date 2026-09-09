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
    {open && <aside aria-label="Statistikinställningar" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-4 text-neutral-900 shadow-lg sm:p-5">
      <h2 className="text-base font-semibold">Valfri statistik</h2>
      <p className="mt-2 text-sm leading-6">Vi använder Google Analytics för statistik om besök och hur tester och köpflöden används. Inga testsvar eller resultat skickas. Du kan avvisa statistik och använda hela sajten ändå. Ändra ditt val via Statistikinställningar längst ner på sidan.</p>
      <div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={() => choose("granted")} className="min-h-11 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2">Godkänn statistik</button><button type="button" onClick={() => choose("denied")} className="min-h-11 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2">Avvisa statistik</button>{choice !== "unknown" && <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-3 py-2 text-sm underline underline-offset-4">Stäng</button>}</div>
    </aside>}
  </>;
}
export function AnalyticsSettings() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))} className="inline-flex min-h-11 items-center rounded-sm underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">Statistikinställningar</button>;
}
