"use client";

import { useState } from "react";
import { norwegian } from "../../_content/market";
import { captureGa4CheckoutAttribution, trackEvent } from "../../_analytics/analytics";

export default function BookCheckout({ offer, enabled }: { offer: boolean; enabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function checkout(useOffer: boolean) {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const analytics = await captureGa4CheckoutAttribution();
      const response = await fetch("/api/books/hjernen-i-kryssild", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer: useOffer, analytics }),
      });
      const body = await response.json();
      if (response.status === 403 && body.error === "offer") {
        setMessage("Åpne den kjøpte AuDHD-rapporten i denne nettleseren for å bruke tilbudet. Du kan også kjøpe boka til ordinær pris.");
        return;
      }
      if (!response.ok) throw new Error("Checkout unavailable");
      if (body.kind === "guest_return") {
        window.location.assign(norwegian.book + "/takk");
        return;
      }
      const checkoutUrl = new URL(body.url);
      if (checkoutUrl.origin !== "https://checkout.stripe.com") throw new Error("Invalid checkout URL");
      trackEvent("begin_checkout", { product_id: "hjernen_i_kryssild", currency: "NOK", value: useOffer ? norwegian.bookOffer : norwegian.bookPrice, page_path: norwegian.book });
      window.location.assign(checkoutUrl);
    } catch {
      setMessage("Betalingen kunne ikke startes akkurat nå. Prøv igjen om litt.");
    } finally { setBusy(false); }
  }

  return <div className="space-y-3">
    {!enabled ? <p className="text-sm">Boksalget åpner snart. Leseprøven er tilgjengelig.</p> : <>
      {offer && <button type="button" disabled={busy} onClick={() => void checkout(true)} className="min-h-12 rounded-xl bg-[#202124] px-5 py-3 font-semibold text-white">Kjøp med rapporttilbud · {norwegian.bookOffer} NOK</button>}
      <button type="button" disabled={busy} onClick={() => void checkout(false)} className={`block min-h-12 rounded-xl px-5 py-3 font-semibold ${offer ? "border border-neutral-400" : "bg-[#202124] text-white"}`}>Kjøp e-boka · {norwegian.bookPrice} NOK</button>
    </>}
    {busy && <p role="status">Åpner betaling…</p>}
    {message && <p role="alert">{message}</p>}
  </div>;
}
