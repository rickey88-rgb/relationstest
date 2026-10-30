"use client";
import { useEffect, useRef, useState } from "react";
import { directCustomerEnabled } from "../_lib/testAccounts/directPublic";
import { directRequest, startDirectCheckout } from "../_lib/testAccounts/directClient";
/** Same transition contract as ADHD: flags off use the existing Payment Link;
 * once selected, a checkout error never falls through to a different purchase flow.
 */
export function useTestAccountCheckout(slug: "audhd" | "iq" | "adhd" | "hsp" | "angest" | "ptsd" | "narcissism-sjalvtest" | "screening" | "autism" | "anknytningstest" | "medberoendetest" | "gaslightingtest" | "narcissist-i-en-relation" | "traumabindningtest" | "psykisk-misshandel-relation", answers: number[], onError: () => void,
  versions?: { questionVersion: string; reportVersion: string }, onCapabilities?: (enabled: boolean) => void) {
  const [enabled, setEnabled] = useState(false);
  const busy = useRef(false);
  const [directModel, setDirectModel] = useState<{ product: string; questionVersion: string; reportVersion: string; checkout: boolean } | null>(null);
  useEffect(() => {
    let mounted = true;
    if (directCustomerEnabled()) {
      directRequest({ action: "capabilities" }).then(value => {
        if (mounted) { const model = value.tests?.find((item: { slug: string }) => item.slug === slug); setDirectModel(model ?? null); setEnabled(model?.checkout === true); onCapabilities?.(model?.checkout === true); }
      }).catch(() => { if (mounted) onCapabilities?.(false); });
      return () => { mounted = false; };
    }
    if (slug === "audhd") return;
    fetch(`/api/test-accounts/${slug}/capabilities`, { cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then(value => { if (mounted) { const active = value?.checkout === true; setEnabled(active); onCapabilities?.(active); } }).catch(() => {});
    return () => { mounted = false; };
  }, [slug, onCapabilities]);
  return () => {
    if (directCustomerEnabled()) {
      if (busy.current) return true;
      if (!directModel?.checkout) { onError(); return true; } // never fall through to an unsavable legacy purchase
      if (!window.confirm("För att leverera din betalda analys behandlar vi dina testsvar och gör dem tillgängliga krypterat via Supabase i högst sju dagar. Därefter spärras åtkomsten och underlaget gallras dagligen. Säkerhetskopior kan finnas kvar en begränsad tid enligt integritetsinformationen. Uppgifterna kan röra din hälsa. Kontosparning i högst tolv månader är ett separat, frivilligt val efter köpet. Genom att trycka OK samtycker du uttryckligen till behandlingen för gästleveransen. Läs integritetsinformationen före köpet.")) return true;
      busy.current = true;
      void startDirectCheckout(directModel.product, { answers, questionVersion: directModel.questionVersion, reportVersion: directModel.reportVersion })
        .catch(() => { busy.current = false; onError(); });
      return true;
    }
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
