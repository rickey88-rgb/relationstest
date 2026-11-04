"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, trackEvent } from "../_analytics/analytics";
import { NEWSLETTER_CONSENT_TEXT, NEWSLETTER_CONSENT_VERSION, type NewsletterSource } from "../_lib/newsletter";

export type NewsletterEvent = "newsletter_form_view" | "newsletter_signup_submit" | "newsletter_signup_success" | "newsletter_signup_confirmed";
export function newsletterEvent(event: NewsletterEvent, source: NewsletterSource) {
  // Fixed event names and a coarse placement only. No email, URL, token or test name.
  return trackEvent(event, { position: source });
}
let capability: Promise<boolean> | undefined;
function enabled() {
  return capability ??= fetch("/api/newsletter", { cache: "no-store", referrerPolicy: "no-referrer" }).then(r => r.ok ? r.json() : null).then(v => v?.enabled === true).catch(() => false);
}

export default function NewsletterSignup({ source, compact = false }: { source: NewsletterSource; compact?: boolean }) {
  const id = useId(), root = useRef<HTMLElement>(null), viewed = useRef(false);
  const [available, setAvailable] = useState(false), [busy, setBusy] = useState(false), [success, setSuccess] = useState(false), [error, setError] = useState("");
  useEffect(() => { let mounted = true; void enabled().then(value => { if (mounted) setAvailable(value); }); return () => { mounted = false; }; }, []);
  useEffect(() => {
    if (!available || !root.current || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    const record = () => { if (visible && !viewed.current) viewed.current = newsletterEvent("newsletter_form_view", source); };
    const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); record(); });
    observer.observe(root.current);
    window.addEventListener(CONSENT_EVENT, record);
    return () => { observer.disconnect(); window.removeEventListener(CONSENT_EVENT, record); };
  }, [available, source]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget, data = new FormData(form);
    setBusy(true); setError(""); newsletterEvent("newsletter_signup_submit", source);
    try {
      const response = await fetch("/api/newsletter", { method: "POST", referrerPolicy: "no-referrer", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), source, consent: data.get("consent") === "yes", version: NEWSLETTER_CONSENT_VERSION, website: data.get("website") }) });
      if (!response.ok) throw new Error("Unavailable");
      setSuccess(true); form.reset(); newsletterEvent("newsletter_signup_success", source);
    } catch { setError("Det gick inte att registrera just nu. Kontrollera adressen eller försök igen om en stund."); }
    finally { setBusy(false); }
  }
  if (!available) return null;
  return <aside ref={root} data-newsletter-placement={source} aria-labelledby={`${id}-heading`} className={`my-10 rounded-2xl border border-[#D6E1DD] bg-[#EFF5F2] text-[#202124] print:hidden ${compact ? "p-5 sm:p-6" : "p-6 sm:p-9"}`}>
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#27666A]">BLI EN DEL AV RESAN</p>
    <h2 id={`${id}-heading`} className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Vill du följa med på vår resa?</h2>
    {compact ? <p className="mt-4 leading-7 text-neutral-700">Få våra bästa guider, nya tester, böcker och utvalda erbjudanden direkt i din inkorg.</p> : <div className="mt-4 space-y-3 leading-7 text-neutral-700"><p>Vi bygger Relationsvarning.se med en stor ambition: att bli Sveriges bästa portal för NPF, självinsikt och relationer.</p><p>Och vi har bara börjat.</p><p>Följ med från början och få våra bästa guider, nya tester, böcker och utvalda erbjudanden direkt i din inkorg.</p></div>}
    {success ? <div role="status" className="mt-6 rounded-xl bg-white p-4 leading-7"><p className="font-semibold">Tack för att du vill följa med!</p><p>Om adressen behöver bekräftas får du ett mejl med en länk. Titta gärna i skräpposten också. Du blir prenumerant först när du bekräftar. Har du redan bekräftat behöver du inte göra något mer.</p><p className="mt-2 text-sm">Kom inget mejl? Vänta 15 minuter och försök igen via <Link href="/nyhetsbrev" className="underline underline-offset-4">registreringssidan</Link>.</p></div> : <form onSubmit={submit} className="mt-6 space-y-4" aria-busy={busy}>
      <div><label htmlFor={`${id}-email`} className="mb-2 block text-sm font-semibold">Din e-postadress</label><div className="flex flex-col gap-3 sm:flex-row"><input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Din e-postadress" className="min-h-12 min-w-0 flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none focus:border-[#27666A] focus:ring-2 focus:ring-[#27666A]/25" /><button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#27666A] px-5 py-3 text-center font-semibold text-white hover:bg-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27666A] disabled:opacity-60">{busy ? "Skickar…" : "Ja, jag vill följa med!"}</button></div></div>
      <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" name="consent" value="yes" required className="mt-1 size-5 shrink-0 accent-[#27666A]" /><span>{NEWSLETTER_CONSENT_TEXT}</span></label>
      <div className="hidden" aria-hidden="true"><label>Webbplats<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="text-sm leading-6 text-neutral-600">Gratis och helt frivilligt. Avsluta när du vill. <Link href="/nyhetsbrev/integritet" className="underline underline-offset-4">Så hanterar vi din e-postadress</Link>.</p>
      {error && <p role="alert" className="text-sm font-medium text-red-800">{error}</p>}
    </form>}
  </aside>;
}

export function NewsletterAfterResult({ children }: { children?: ReactNode }) {
  return <>{children}<NewsletterSignup source="result" compact /></>;
}

export function NewsletterArticleSignup() {
  const pathname = usePathname();
  if (/test|metodik|integritet|villkor|kontakt|bok|adhd-deluxe/.test(pathname)) return null;
  return <NewsletterSignup source="article" />;
}

export function NewsletterFooterSignup() {
  const pathname = usePathname();
  const [elsewhere, setElsewhere] = useState(false);
  useEffect(() => {
    const update = () => setElsewhere(Boolean(document.querySelector('[data-newsletter-placement]:not([data-newsletter-placement="footer"])')));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);
  if (elsewhere || /(^\/test$|\/test(?:\/|$)|\/tack(?:\/|$)|^\/(api|mina-sidor|auth|logga-in|logga-ut|nyhetsbrev)(?:\/|$))/.test(pathname)) return null;
  return <NewsletterSignup source="footer" compact />;
}
