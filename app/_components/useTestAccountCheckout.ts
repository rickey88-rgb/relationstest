"use client";
import { useEffect, useRef, useState } from "react";
/** Same transition contract as ADHD: flags off use the existing Payment Link;
 * once selected, a checkout error never falls through to a different purchase flow.
 */
export function useTestAccountCheckout(slug: "iq" | "adhd" | "hsp" | "angest" | "ptsd" | "narcissism-sjalvtest" | "screening" | "autism" | "anknytningstest" | "medberoendetest" | "gaslightingtest" | "narcissist-i-en-relation" | "traumabindningtest" | "psykisk-misshandel-relation", answers: number[], onError: () => void,
  versions?: { questionVersion: string; reportVersion: string }, onCapabilities?: (enabled: boolean) => void) {
  const [enabled, setEnabled] = useState(false);
  const busy = useRef(false);
  useEffect(() => {
    let mounted = true;
    fetch(`/api/test-accounts/${slug}/capabilities`, { cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then(value => { if (mounted) { const active = value?.checkout === true; setEnabled(active); onCapabilities?.(active); } }).catch(() => {});
    return () => { mounted = false; };
  }, [slug, onCapabilities]);
  return () => {
    if (!enabled) return false;
    if (busy.current) return true;
    busy.current = true;
    const body = new URLSearchParams({ payload: JSON.stringify({ answers, questionVersion: versions?.questionVersion ?? `${slug}-questions-v1`, reportVersion: versions?.reportVersion ?? `${slug}-report-v1` }) });
    fetch(`/api/test-accounts/${slug}/checkout`, { method: "POST", body, credentials: "same-origin", cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Unavailable");
        const value = await response.json();
        if (typeof value.url !== "string" || new URL(value.url).origin !== "https://checkout.stripe.com") throw new Error("Unavailable");
        window.location.assign(value.url);
      }).catch(() => { busy.current = false; onError(); });
    return true;
  };
}
