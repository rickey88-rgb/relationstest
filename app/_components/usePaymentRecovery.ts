"use client";

import { useEffect, useRef, useState } from "react";

// Retains the existing paid=true trust model; this is not server-side Stripe verification.
export function hasPaidReturn(key: string) {
  try { return localStorage.getItem(key + ":paid") === "true" || JSON.parse(localStorage.getItem(key) || "null")?.unlocked === true; }
  catch { return false; }
}

export function usePaymentRecovery(key: string, unlocked: boolean, setUnlocked: (value: boolean) => void) {
  const returnedPaid = useRef(typeof window !== "undefined" && new URLSearchParams(window.location.search).get("paid") === "true");
  const checkoutPending = useRef(false);
  const [checkoutError, setCheckoutError] = useState("");
  useEffect(() => {
    const reconcile = () => {
      checkoutPending.current = false;
      if (!returnedPaid.current && !hasPaidReturn(key)) return;
      setUnlocked(true);
      try { localStorage.setItem(key + ":paid", "true"); }
      catch {
        // Keep recovery possible on refresh if this browser blocks persistent storage.
        const url = new URL(window.location.href);
        url.searchParams.set("paid", "true");
        window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      }
    };
    const onStorage = (event: StorageEvent) => { if (event.key === key + ":paid" || event.key === key) reconcile(); };
    reconcile();
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", reconcile);
    window.addEventListener("focus", reconcile);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("pageshow", reconcile); window.removeEventListener("focus", reconcile); };
  }, [key, setUnlocked]);

  function prepareCheckout(state: { answers: number[]; index: number; unlocked: boolean; version?: number }) {
    if (unlocked || returnedPaid.current || hasPaidReturn(key)) { setUnlocked(true); return false; }
    if (checkoutPending.current) return false;
    try {
      if (!state.answers.length || state.answers.some(answer => !Number.isInteger(answer) || answer < 0 || answer > 4)) throw new Error("Incomplete answers");
      const serialized = JSON.stringify(state);
      localStorage.setItem(key, serialized);
      if (localStorage.getItem(key) !== serialized) throw new Error("Storage unavailable");
    } catch {
      setCheckoutError("Köp har inte startats eftersom dina svar inte kunde sparas säkert. Öppna testet i din vanliga webbläsare och tillåt webbplatsdata innan du betalar.");
      return false;
    }
    setCheckoutError("");
    checkoutPending.current = true;
    return true;
  }
  return { prepareCheckout, checkoutError };
}
