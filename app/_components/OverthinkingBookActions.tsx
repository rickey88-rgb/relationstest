"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "../_analytics/analytics";
import { directAuthClient } from "../_lib/testAccounts/directClient";
import { OVERTHINKING_BOOK as book } from "../_lib/overthinkingBook";

const pendingBookKey = "rv-pending-book-v1";

async function bookRequest(path: string, direct: boolean, method = "GET", signal?: AbortSignal) {
  const headers = new Headers();
  if (direct) {
    const { data } = await directAuthClient().auth.getSession();
    if (!data.session) return new Response(null, { status: 401 });
    headers.set("Authorization", "Bearer " + data.session.access_token);
  }
  return fetch(path, { method, headers, signal, cache: "no-store", referrerPolicy: "no-referrer" });
}

export function OverthinkingBuyButton({ enabled, direct, className, library = false }: {
  enabled: boolean;
  direct: boolean;
  className: string;
  library?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function buy() {
    setBusy(true);
    setMessage("");
    if (!library) trackEvent("book_checkout_click", {
      product_id: book.product, product_name: book.title, price: book.price, currency: "SEK", offer_type: "standard",
    });

    try {
      const response = await bookRequest(book.api, direct, "POST");
      if (response.status === 401) {
        if (library) setMessage("Logga in igen för att fortsätta.");
        else {
          try { localStorage.setItem(pendingBookKey, String(Date.now())); } catch { /* The library is still available manually. */ }
          window.location.assign(direct ? "/mina-sidor?bok=kop#bibliotek" : "/logga-in?bok=kop");
        }
        return;
      }
      if (!response.ok) throw new Error("Checkout unavailable");
      const result = await response.json();
      if (result.kind === "checkout" && new URL(result.url).origin === "https://checkout.stripe.com") {
        window.location.assign(result.url);
      } else if (result.kind === "owned" || result.kind === "pending") {
        if (library) setMessage(result.kind === "owned" ? "Boken finns redan i ditt bibliotek. Uppdatera sidan för att hämta den." : "Du har redan en betalning som behandlas.");
        else window.location.assign("/mina-sidor?bok=betalning#bibliotek");
      } else throw new Error("Unexpected checkout response");
    } catch {
      setMessage("Kassan kunde inte öppnas. Försök igen om en stund.");
    } finally {
      setBusy(false);
    }
  }
  return <>
    <button type="button" className={className} disabled={!enabled || busy} onClick={() => void buy()}>
      {busy ? "Öppnar kassan…" : "Köp e-boken · 149 kr"}
    </button>
    {message && <p role="status" className="mt-2 text-sm">{message}</p>}
  </>;
}

type LibraryState = "loading" | "ready" | "none" | "pending" | "unavailable";

export function OverthinkingLibrary({ direct, buyEnabled, returning = false }: {
  direct: boolean;
  buyEnabled: boolean;
  returning?: boolean;
}) {
  const [state, setState] = useState<LibraryState>("loading");
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      try {
        const response = await bookRequest(book.api, direct, "GET", controller.signal);
        if (!response.ok) throw new Error("Library unavailable");
        const { state } = await response.json();
        if (state !== "ready" && state !== "none" && state !== "pending") throw new Error("Invalid library response");
        if (!controller.signal.aborted) setState(state);
      } catch {
        if (!controller.signal.aborted) setState("unavailable");
      }
    }
    void refresh();
    return () => controller.abort();
  }, [direct, revision]);

  useEffect(() => {
    let resume = returning || new URLSearchParams(window.location.search).get("bok") === "kop";
    try {
      const timestamp = Number(localStorage.getItem(pendingBookKey));
      localStorage.removeItem(pendingBookKey);
      resume ||= timestamp > Date.now() - 60 * 60 * 1000 && timestamp <= Date.now();
    } catch { /* The library link works when browser storage is blocked. */ }
    if (resume) document.getElementById("bibliotek")?.scrollIntoView({ block: "start" });
  }, [returning]);

  async function download() {
    setBusy(true);
    setMessage("");
    try {
      const response = await bookRequest(book.api + "/download", direct);
      if (response.status === 401 || response.status === 403) {
        setMessage("Åtkomsten kunde inte verifieras. Kontrollera att du är inloggad på kontot som köpte boken.");
        return;
      }
      if (!response.ok || response.headers.get("Content-Type") !== "application/pdf") throw new Error("PDF unavailable");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = book.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      setMessage("Boken kunde inte hämtas just nu. Försök igen om en stund.");
    } finally {
      setBusy(false);
    }
  }

  const button = "inline-flex min-h-11 items-center rounded-xl bg-[#27666A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60";
  return <article className="rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 sm:p-6">
    <h3 className="text-xl font-semibold">{book.title}</h3>
    <p className="mb-4 mt-1 text-sm text-neutral-600">{book.author} · PDF · 120 sidor</p>
    {state === "ready" && <button type="button" onClick={() => void download()} className={button} disabled={busy}>
      {busy ? "Hämtar PDF…" : "Hämta din e-bok"}
    </button>}
    {state === "loading" && <p role="status">Kontrollerar bokköp…</p>}
    {state === "pending" && <>
      <p role="status">Betalningen är ännu inte bekräftad. Uppdatera när du är klar i kassan.</p>
      {buyEnabled && !returning && <div className="mt-3"><OverthinkingBuyButton enabled direct={direct} className={button} library /></div>}
    </>}
    {state === "none" && <>
      {returning && <p role="status" className="mb-3">Vi hittar ännu inget verifierat köp på det här kontot. Kontrollera betalningen och kontot du använde.</p>}
      {buyEnabled && !returning && <OverthinkingBuyButton enabled direct={direct} className={button} library />}
    </>}
    {state === "unavailable" && <p role="status">Biblioteket kan inte hämtas just nu.</p>}
    {(state === "pending" || state === "unavailable" || (state === "none" && returning)) &&
      <button type="button" onClick={() => { setState("loading"); setRevision(current => current + 1); }} className="mt-3 block min-h-11 underline underline-offset-4">Kontrollera igen</button>}
    {message && <p role="status" className="mt-3 text-sm">{message}</p>}
  </article>;
}
