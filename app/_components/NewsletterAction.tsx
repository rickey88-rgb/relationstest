"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { newsletterEvent } from "./NewsletterSignup";
import { newsletterSource } from "../_lib/newsletter";

export default function NewsletterAction({ action }: { action: "confirm" | "unsubscribe" }) {
  const initialized = useRef(false);
  const [token, setToken] = useState(""), [busy, setBusy] = useState(false), [status, setStatus] = useState<"ready" | "done" | "invalid" | "error">("ready");
  const [unsubscribeUrl, setUnsubscribeUrl] = useState("");
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Fragments never reach HTTP access logs, referrers or the server page request.
    const value = new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    setToken(value); if (!value) setStatus("invalid");
    window.history.replaceState(null, "", window.location.pathname);
  }, []);
  async function submit() {
    if (busy || !token) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/newsletter/${action}`, { method: "POST", referrerPolicy: "no-referrer", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      if (response.status === 410) { setStatus("invalid"); return; }
      if (!response.ok) throw new Error("Unavailable");
      const body = await response.json();
      setStatus("done"); setToken("");
      if (action === "confirm" && typeof body.unsubscribeUrl === "string" && body.unsubscribeUrl.startsWith("https://www.relationsvarning.se/nyhetsbrev/avsluta#token=")) setUnsubscribeUrl(body.unsubscribeUrl);
      const source = newsletterSource(body.source);
      if (action === "confirm" && source) newsletterEvent("newsletter_signup_confirmed", source);
    } catch { setStatus("error"); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto max-w-xl px-5 py-16 text-neutral-900"><section className="rounded-2xl border border-[#D6E1DD] bg-[#EFF5F2] p-6 sm:p-9">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#27666A]">RELATIONSVARNING.SE</p>
    <h1 className="mt-4 text-3xl font-semibold tracking-tight">{status === "done" ? action === "confirm" ? "Välkommen med på resan!" : "Du har avslutat nyhetsbrevet" : action === "confirm" ? "Bekräfta din prenumeration" : "Vill du avsluta nyhetsbrevet?"}</h1>
    <div role="status" className="mt-5 leading-7">{status === "done" ? <p>{action === "confirm" ? "Din prenumeration är nu aktiv. Du får våra guider, produktnyheter och utvalda erbjudanden via e-post." : "Du får inga fler nyhetsbrev från oss. Dina köp, konton, kvitton och produktleveranser påverkas inte."}</p> : status === "invalid" ? <p>Länken är ogiltig, har redan använts eller har gått ut. {action === "confirm" ? <Link href="/nyhetsbrev" className="underline underline-offset-4">Registrera dig igen för en ny bekräftelselänk.</Link> : <>För hjälp att avsluta, kontakta <a href="mailto:support@relationsvarning.se" className="underline">support@relationsvarning.se</a>.</>}</p> : <p>{action === "confirm" ? "Tryck på knappen för att bekräfta att du vill få våra mejl. Du kan avsluta när du vill." : "Tryck på knappen för att avsluta dina nyhetsbrev. Det påverkar inte något du har köpt."}</p>}</div>
    {status === "error" && <p role="alert" className="mt-4 text-red-800">Tjänsten kunde inte nås. Försök igen om en stund.</p>}
    {(status === "ready" || status === "error") && <button disabled={!token || busy} onClick={submit} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#27666A] px-5 py-3 font-semibold text-white hover:bg-[#1F5357] disabled:opacity-60">{busy ? "Vänta…" : action === "confirm" ? "Bekräfta min prenumeration" : "Avsluta nyhetsbrevet"}</button>}
    {status === "done" && action === "confirm" && unsubscribeUrl && <p className="mt-6 text-sm"><a href={unsubscribeUrl} referrerPolicy="no-referrer" className="inline-flex min-h-11 items-center rounded-sm underline underline-offset-4">Avsluta prenumerationen</a></p>}
    <p className="mt-6 text-sm"><Link href="/" className="underline underline-offset-4">Till Relationsvarning.se</Link></p>
  </section></main>;
}
