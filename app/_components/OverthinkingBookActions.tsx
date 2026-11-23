"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { trackEvent } from "../_analytics/analytics";
import { directAuthClient } from "../_lib/testAccounts/directClient";
import { OVERTHINKING_BOOK as book } from "../_lib/overthinkingBook";

const pendingBookKey = "rv-pending-book-v1";

async function bookRequest(path: string, direct: boolean, method = "GET", signal?: AbortSignal, guestFallback = false) {
  const headers = new Headers();
  if (direct) {
    const { data } = await directAuthClient().auth.getSession();
    if (!data.session && !guestFallback) return new Response(null, { status: 401 });
    if (data.session) headers.set("Authorization", "Bearer " + data.session.access_token);
  }
  return fetch(path, { method, headers, signal, cache: "no-store", referrerPolicy: "no-referrer" });
}

export function OverthinkingBuyButton({ enabled, direct, className }: {
  enabled: boolean;
  direct: boolean;
  className: string;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function buy() {
    setBusy(true);
    setMessage("");
    trackEvent("book_checkout_click", {
      product_id: book.product, product_name: book.title, price: book.price, currency: "SEK", offer_type: "standard",
    });

    try {
      const response = await bookRequest(book.api + "?guest=1", direct, "POST", undefined, true);
      if (response.status === 401) {
        try { localStorage.setItem(pendingBookKey, String(Date.now())); } catch { /* The library is still available manually. */ }
        window.location.assign(direct ? "/mina-sidor?bok=kop#bibliotek" : "/logga-in?bok=kop");
        return;
      }
      if (!response.ok) throw new Error("Checkout unavailable");
      const result = await response.json();
      if (result.kind === "checkout" && new URL(result.url).origin === "https://checkout.stripe.com") {
        window.location.assign(result.url);
      } else if (result.kind === "guest_return") {
        window.location.assign(book.path + "/tack");
      } else if (result.kind === "owned" || result.kind === "pending") {
        window.location.assign("/mina-sidor?bok=betalning#bibliotek");
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

type LibraryBook = {
  api: string;
  cover: string;
  title: string;
  author: string;
  filename: string;
};

const libraryBooks: readonly LibraryBook[] = [book];

function LibraryBookCard({ entry, direct }: { entry: LibraryBook; direct: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function open() {
    setBusy(true);
    setMessage("");
    let tab: Window | null = null;
    try {
      tab = window.open("", "_blank");
      if (tab) tab.opener = null;
      const response = await bookRequest(entry.api + "/download", direct);
      if (response.status === 401 || response.status === 403) {
        setMessage("Åtkomsten kunde inte verifieras. Logga in med samma mejladress som du använde vid köpet.");
        tab?.close();
        return;
      }
      if (!response.ok || response.headers.get("Content-Type") !== "application/pdf") throw new Error("PDF unavailable");
      const url = URL.createObjectURL(await response.blob());
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      if (tab && !tab.closed) {
        tab.location.replace(url);
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = entry.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch {
      tab?.close();
      setMessage("Boken kunde inte öppnas just nu. Försök igen om en stund.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-sm">
      <button
        type="button"
        onClick={() => void open()}
        disabled={busy}
        aria-label={`Öppna boken ${entry.title}`}
        className="group block w-full text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#27666A] disabled:cursor-wait"
      >
        <Image src={entry.cover} width={640} height={960} alt=""
          sizes="(max-width: 480px) 85vw, 220px" className="h-auto w-full" />
        <span className="block p-4">
          <span className="block text-base font-semibold leading-tight">{entry.title}</span>
          <span className="mt-1 block text-sm text-neutral-600">{entry.author}</span>
          <span className="mt-3 inline-block text-sm font-semibold text-[#27666A] group-hover:underline">
            {busy ? "Öppnar PDF…" : "Öppna boken"}
          </span>
        </span>
      </button>
      {message && <p role="status" className="px-4 pb-4 text-sm">{message}</p>}
    </article>
  );
}

type LibraryResult = {
  owned: LibraryBook[];
  pending: boolean;
  unavailable: boolean;
};

export function BookLibrary({ direct, returning = false }: { direct: boolean; returning?: boolean }) {
  const [result, setResult] = useState<LibraryResult | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      const books = await Promise.all(libraryBooks.map(async entry => {
        try {
          const response = await bookRequest(entry.api, direct, "GET", controller.signal);
          if (!response.ok) return { entry, state: "unavailable" };
          const { state } = await response.json();
          return { entry, state: state === "ready" || state === "pending" || state === "none" ? state : "unavailable" };
        } catch {
          return { entry, state: "unavailable" };
        }
      }));
      if (!controller.signal.aborted) setResult({
        owned: books.filter(item => item.state === "ready").map(item => item.entry),
        pending: books.some(item => item.state === "pending"),
        unavailable: books.some(item => item.state === "unavailable"),
      });
    }
    void refresh();
    return () => controller.abort();
  }, [direct, revision]);

  useEffect(() => {
    const intent = new URLSearchParams(window.location.search).get("bok");
    let resume = returning || intent === "kop" || intent === "bibliotek";
    try {
      const timestamp = Number(localStorage.getItem(pendingBookKey));
      localStorage.removeItem(pendingBookKey);
      resume ||= timestamp > Date.now() - 60 * 60 * 1000 && timestamp <= Date.now();
    } catch { /* The library link works when browser storage is blocked. */ }
    if (resume) document.getElementById("bibliotek")?.scrollIntoView({ block: "start" });
  }, [returning]);

  if (!result) return <p role="status" className="text-sm text-neutral-600">Hämtar dina böcker…</p>;
  const { owned, pending, unavailable } = result;
  return (
    <div>
      {owned.length > 0 && <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,10rem),13rem))] gap-4 sm:gap-6">
        {owned.map(entry => <LibraryBookCard key={entry.api} entry={entry} direct={direct} />)}
      </div>}
      {!owned.length && !pending && !unavailable &&
        <p className="text-sm text-neutral-600">Här visas dina köpta böcker. Har du redan köpt en bok? Logga in med samma mejladress som vid betalningen.</p>}
      {pending && <p role="status" className="mt-3 text-sm">Betalningen är ännu inte bekräftad.</p>}
      {unavailable && <p role="status" className="mt-3 text-sm">Alla bokköp kunde inte kontrolleras just nu.</p>}
      {(pending || unavailable || (returning && !owned.length)) &&
        <button type="button" onClick={() => { setResult(null); setRevision(current => current + 1); }}
          className="mt-2 min-h-11 text-sm font-semibold underline underline-offset-4">Kontrollera igen</button>}
    </div>
  );
}
