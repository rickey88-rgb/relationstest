"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { captureGa4CheckoutAttribution, trackEvent, trackEventBeforeNavigation } from "../_analytics/analytics";
import { directAuthClient } from "../_lib/testAccounts/directClient";
import { OVERTHINKING_BOOK as book } from "../_lib/overthinkingBook";
import { STEINLER_BOOK } from "../_lib/steinlerBook";
import { LITE_AUTISM_ANALYSIS_PRICE, LITE_AUTISM_BOOK } from "../_lib/liteAutismBook";
import { BOOK_CATALOG, LEGACY_BOOK_LIBRARY_API, THINKING_CATALOG_BOOK, bookFilePath, bookFiles, type BookFile, type CatalogBook } from "../_lib/bookCatalog";

const pendingBookKey = "rv-pending-book-v1";

async function bookRequest(path: string, direct: boolean, method = "GET", signal?: AbortSignal, guestFallback = false, body?: string) {
  const headers = new Headers();
  if (direct) {
    const { data } = await directAuthClient().auth.getSession();
    if (!data.session && !guestFallback) return new Response(null, { status: 401 });
    if (data.session) headers.set("Authorization", "Bearer " + data.session.access_token);
  }
  if (body) headers.set("Content-Type", "application/json");
  return fetch(path, { method, headers, signal, body, cache: "no-store", referrerPolicy: "no-referrer" });
}

export function OverthinkingBuyButton({ enabled, direct, className, label = "Köp e-boken · 149 kr", offer = book, offerType = "standard", onCheckoutClick }: {
  enabled: boolean;
  direct: boolean;
  className: string;
  label?: string;
  offer?: typeof book | typeof STEINLER_BOOK | typeof LITE_AUTISM_BOOK;
  offerType?: "standard" | "analysis";
  onCheckoutClick?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isLiteAutism = offer.product === LITE_AUTISM_BOOK.product;
  const analysisOffer = isLiteAutism && offerType === "analysis";
  const price = analysisOffer ? LITE_AUTISM_ANALYSIS_PRICE : offer.price;
  async function buy() {
    setBusy(true);
    setMessage("");
    onCheckoutClick?.();
    trackEvent("book_checkout_click", {
      product_id: offer.product, product_name: offer.title, price, currency: "SEK", offer_type: analysisOffer ? "analysis" : "standard",
    });

    try {
      const attribution = isLiteAutism ? await captureGa4CheckoutAttribution() : null;
      const checkoutPath = offer.api + (analysisOffer ? "?guest=1&offer=analysis" : "?guest=1");
      const response = await bookRequest(checkoutPath, direct, "POST", undefined, true, attribution ? JSON.stringify(attribution) : undefined);
      if (response.status === 401) {
        try { localStorage.setItem(pendingBookKey, String(Date.now())); } catch { /* The library is still available manually. */ }
        window.location.assign(direct ? "/mina-sidor?bok=kop#bibliotek" : "/logga-in?bok=kop");
        return;
      }
      if (!response.ok) throw new Error("Checkout unavailable");
      const result = await response.json();
      if (result.kind === "checkout" && new URL(result.url).origin === "https://checkout.stripe.com") {
        if (isLiteAutism) {
          trackEventBeforeNavigation("begin_checkout", {
            value: price, currency: "SEK",
            items: [{ item_id: offer.product, item_name: offer.title, price, quantity: 1 }],
          }, () => window.location.assign(result.url));
        } else window.location.assign(result.url);
      } else if (result.kind === "guest_return") {
        window.location.assign(offer.path + "/tack");
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
    <button type="button" data-flow={analysisOffer ? "cta" : undefined} className={className} disabled={!enabled || busy} onClick={() => void buy()}>
      {busy ? "Öppnar kassan…" : label}
    </button>
    {message && <p role="status" className="mt-2 text-sm">{message}</p>}
  </>;
}

function LibraryBookCard({ entry, direct }: { entry: CatalogBook; direct: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [book, ...extras] = bookFiles(entry);

  async function open(file: BookFile) {
    setBusy(true);
    setMessage("");
    let tab: Window | null = null;
    try {
      tab = window.open("", "_blank");
      if (tab) tab.opener = null;
      const response = await bookRequest(bookFilePath(entry, file), direct);
      if (response.status === 401 || response.status === 403) {
        setMessage("Åtkomsten kunde inte verifieras. Logga in med samma mejladress som du använde vid köpet.");
        tab?.close();
        return;
      }
      if (!response.ok) throw new Error("PDF unavailable");
      const contentType = response.headers.get("Content-Type");
      if (contentType?.startsWith("application/json")) {
        const { url } = await response.json();
        const signed = new URL(url);
        if (signed.protocol !== "https:" || signed.username || signed.password) throw new Error("Invalid download");
        if (tab && !tab.closed) tab.location.replace(signed.href);
        else window.location.assign(signed.href);
        return;
      }
      if (contentType !== "application/pdf") throw new Error("PDF unavailable");
      const url = URL.createObjectURL(await response.blob());
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      if (tab && !tab.closed) {
        tab.location.replace(url);
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch {
      tab?.close();
      setMessage("Filen kunde inte öppnas just nu. Försök igen om en stund.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-sm">
      <button
        type="button"
        onClick={() => void open(book)}
        disabled={busy}
        aria-label={`Öppna boken ${entry.title}`}
        className="group block w-full text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#27666A] disabled:cursor-wait"
      >
        <span className="relative block aspect-[4/5] bg-[#f2eee6]">
          <span className="absolute inset-3">
            <Image src={entry.cover} fill alt="" sizes="220px" className="object-contain" />
          </span>
        </span>
        <span className="block p-4">
          <span className="block text-base font-semibold leading-tight">{entry.title}</span>
          <span className="mt-1 block text-sm text-neutral-600">{entry.author}</span>
          <span className="mt-3 inline-block text-sm font-semibold text-[#27666A] group-hover:underline">
            {busy ? "Öppnar PDF…" : "Öppna boken"}
          </span>
        </span>
      </button>
      {extras.length > 0 && (
        <ul className="space-y-1 border-t border-slate-200 px-4 py-2">
          {extras.map(file => (
            <li key={file.id}>
              <button type="button" onClick={() => void open(file)} disabled={busy}
                aria-label={`${file.label} till ${entry.title}`}
                className="min-h-11 text-left text-sm font-semibold underline underline-offset-4 disabled:opacity-60">
                {file.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {message && <p role="status" className="px-4 pb-4 text-sm">{message}</p>}
    </article>
  );
}

type LibraryResult = {
  owned: CatalogBook[];
  pending: boolean;
  unavailable: boolean;
};

export function BookLibrary({ direct, returning = false }: { direct: boolean; returning?: boolean }) {
  const [result, setResult] = useState<LibraryResult | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function read(path: string) {
      try {
        const response = await bookRequest(path, direct, "GET", controller.signal);
        return response.ok ? await response.json() : null;
      } catch {
        return null;
      }
    }
    async function refresh() {
      const [legacy, thinking, steinler, liteAutism] = await Promise.all([
        read(LEGACY_BOOK_LIBRARY_API), read(book.api), read(STEINLER_BOOK.api), read(LITE_AUTISM_BOOK.api),
      ]);
      const legacyIds: readonly unknown[] = Array.isArray(legacy?.owned) ? legacy.owned : [];
      const state = thinking?.state;
      if (!controller.signal.aborted) setResult({
        owned: BOOK_CATALOG.filter(entry => {
          if (entry.id === LITE_AUTISM_BOOK.id) return liteAutism?.state === "ready";
          if (entry.id === STEINLER_BOOK.id) return steinler?.state === "ready";
          if (entry.id === THINKING_CATALOG_BOOK.id) return state === "ready";
          return legacyIds.includes(entry.id);
        }),
        pending: state === "pending",
        unavailable: !Array.isArray(legacy?.owned) || !["none", "pending", "ready"].includes(state) ||
          !["none", "ready"].includes(steinler?.state) || !["none", "ready"].includes(liteAutism?.state),
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
        {owned.map(entry => <LibraryBookCard key={entry.id} entry={entry} direct={direct} />)}
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
