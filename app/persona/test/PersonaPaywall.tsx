"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Submission } from "../_domain/types";
import { PRICE_SEK } from "../_domain/versions";
import { directCustomerEnabled } from "../../_lib/testAccounts/directPublic";
import { directRequest, pendingPurchases, startDirectCheckout } from "../../_lib/testAccounts/directClient";
import styles from "../persona.module.css";

function subscribePurchases(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function hasPersonaPurchase() {
  try { return pendingPurchases().some(item => item.product === "persona_test"); } catch { return false; }
}
export default function PersonaPaywall({ submission, eligible, description, buttonLabel }: { submission: Submission | null; eligible: boolean; description?: string; buttonLabel?: string }) {
  const [available, setAvailable] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const hasPurchase = useSyncExternalStore(subscribePurchases, hasPersonaPurchase, () => false);
  const lock = useRef(false);
  useEffect(() => {
    let active = true;
    if (directCustomerEnabled()) void directRequest({ action: "capabilities" }).then(value => {
      const model = value.tests?.find((item: { product: string }) => item.product === "persona_test");
      if (active) setAvailable(model?.checkout === true && (!model.checkoutReportVersions || model.checkoutReportVersions.includes(submission?.reportVersion)) && model.questionVersion === submission?.questionVersion && (model.reportVersion === submission?.reportVersion || model.additionalReportVersions?.includes(submission?.reportVersion)));
    }).catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, [submission?.questionVersion, submission?.reportVersion]);
  async function checkout() {
    if (lock.current || !available || !eligible || !consent || !submission) return;
    lock.current = true; setBusy(true); setError("");
    try { await startDirectCheckout("persona_test", submission); }
    catch { lock.current = false; setBusy(false); setError("Köpet kunde inte startas. Dina svar finns kvar. Försök igen eller öppna Mina sidor om du redan har betalat."); }
  }
  return <form className={styles.paywall} onSubmit={event => { event.preventDefault(); void checkout(); }}>
    <p className={styles.finePrint}>{description ?? `Personligt porträtt, dimensionskarta, råd och utskrift/PDF. ${PRICE_SEK} kr totalt, som engångsbetalning.`}</p>
    <label className={styles.processingConsent}><input type="checkbox" required checked={consent} disabled={busy || !eligible} onChange={event => setConsent(event.target.checked)} /><span>Jag samtycker till att mina svar behandlas och lagras krypterat för att leverera rapporten. Gäståtkomst i högst sju dagar. Kontosparning är frivillig och väljs separat efter köpet. <Link href="/mina-sidor/tester/integritet">Så hanteras mina svar</Link>.</span></label>
    <button type="submit" className={styles.purchaseButton} disabled={!available || !eligible || !consent || busy}>{busy ? "Öppnar säker betalning…" : buttonLabel ?? `Lås upp mitt porträtt – ${PRICE_SEK} kr`} <span aria-hidden="true">→</span></button>
    <p className={styles.finePrint}>Betala säkert med Stripe Checkout. Ingen registrering krävs. Du kan avbryta och återvända med svaren kvar. <Link href="/villkor">Köpvillkor</Link>.</p>
    {!eligible && <p className={styles.finePrint}>Förhandsvisningen behöver vara klar och underlaget tillräckligt innan du kan köpa rapporten.</p>}
    {eligible && !available && <p className={styles.finePrint}>Köp är inte öppet just nu. Dina svar finns kvar i den här webbläsaren.</p>}
    {error && <p className={styles.notice} role="alert">{error}</p>}
    {hasPurchase && <p className={styles.finePrint}>Har du redan påbörjat eller gjort ett köp? <Link href="/mina-sidor">Kontrollera och öppna ditt köp på Mina sidor</Link> innan du betalar igen.</p>}
  </form>;
}
