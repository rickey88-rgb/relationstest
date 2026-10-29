import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accountIdentity } from "../../_lib/accountHttp.server";
import { accountStorageReady } from "../../_lib/accountPurchasesDb.server";
import { resolveAccountAudhdProof } from "../../_lib/accountAudhdProof.server";
import { accountStorageMode } from "../../_lib/accountErasureJournal.server";
import styles from "../page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const messages: Record<string, string> = {
  unavailable: "Köpet kan inte kopplas just nu. Försök igen om en stund. Din befintliga åtkomst påverkas inte.",
  "proof-required": "Öppna först din betalda AuDHD-analys eller din personliga recovery-länk i den här webbläsaren och försök sedan igen.",
  "not-linked": "Köpet kunde inte kopplas till det här kontot. Kontakta support om du behöver hjälp.",
};

export default async function LinkAccountPurchase({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const identity = await accountIdentity();
  if (identity.kind !== "authenticated") redirect(identity.kind === "anonymous" ? "/logga-in" : "/logga-in?status=unavailable");
  let ready = false;
  try { ready = accountStorageMode() === "active" && await accountStorageReady(); } catch { /* Display availability, never invent a purchase. */ }
  const cookieStore = await cookies();
  const proofs = ready ? await Promise.all([resolveAccountAudhdProof("checkout", cookieStore), resolveAccountAudhdProof("recovery", cookieStore)]) : [];
  const seen = new Set<string>();
  const verified = proofs.filter(proof => {
    if (proof.kind !== "verified" || seen.has(proof.fingerprint)) return false;
    seen.add(proof.fingerprint); return true;
  }).filter(proof => proof.kind === "verified");
  const { status } = await searchParams;
  const notice = status ? messages[status] : null;
  const transient = !ready || proofs.some(proof => proof.kind === "unavailable");

  return <main className={styles.page}><div className={styles.content}>
    <Link href="/mina-sidor" className={styles.textLink}>← Till Mina sidor</Link>
    <h1 className={styles.subpageTitle}>Koppla ditt AuDHD-köp</h1>
    <p className={styles.finePrint}>Du är inloggad som <strong>{identity.email}</strong>. Köpet kopplas till det här kontot när du bekräftar nedan.</p>
    <p className={styles.subpageIntro}>Du väljer själv om analysen ska sparas på ditt konto. Vi kontrollerar både din inloggning, betalningen och din personliga åtkomst till resultatet.</p>
    {notice && <p className={styles.notice} role="status">{notice}</p>}
    {transient && <p className={styles.notice} role="status">Kontokopplingen är tillfälligt otillgänglig. Försök igen om en stund.</p>}
    {verified.map(proof => <section key={proof.fingerprint} className={styles.claimCard}>
      <p className={styles.eyebrow}>VERIFIERAD PREMIUMANALYS</p><h2>AuDHD – din personliga analys</h2>
      <p>Köpt {proof.payment.purchasedAt.toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" })} · {new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(proof.payment.amountTotalOre / 100)}</p>
      {!proof.encrypted && <p className={styles.notice}>Vi kan verifiera köpet, men analysens underlag finns inte längre kvar. Du kan spara köphistoriken; dina tidigare svar och din analys kan inte återskapas från betalningen.</p>}
      <form action="/api/account/purchases/claim" method="post" className={styles.claimForm}>
        <input type="hidden" name="source" value={proof.source} /><input type="hidden" name="fingerprint" value={proof.fingerprint} />
        <label className={styles.consentLabel}><input type="checkbox" required name="consent" value={proof.encrypted ? "account-analysis-v1" : "account-purchase-v1"} /><span>{proof.encrypted ? "Jag samtycker uttryckligen till att mina testsvar, som kan innehålla känsliga uppgifter om min hälsa, sparas krypterat på det här kontot för att jag ska kunna öppna min AuDHD-analys igen. Lagringen är frivillig och varar högst 12 månader. Jag kan återkalla samtycket genom att radera den sparade analysen på Mina sidor. Mitt köp kopplas också till kontot." : "Jag vill koppla det här verifierade köpet till mitt konto. Ingen analys sparas eftersom underlaget har raderats."}</span></label>
        <p className={styles.finePrint}>Köphistoriken finns kvar när underlaget raderas. Den ursprungliga gästlagringen och dina befintliga recovery-länkar följer sina egna giltighetstider. Dina svar används inte för reklam eller statistik.</p>
        <button type="submit" className={styles.primaryButton}>{proof.encrypted ? "Spara på mitt konto" : "Koppla mitt köp"} →</button>
      </form>
    </section>)}
    {!verified.length && !transient && <section className={styles.emptyCard}><div className={styles.emptyCopy}><h2>Öppna din analys först</h2><p>Öppna din betalda AuDHD-analys eller din personliga recovery-länk i den här webbläsaren. Gå sedan tillbaka hit för att spara den på ditt konto.</p><p>Äldre köp kan bara ge en sparad analys om dess krypterade underlag fortfarande finns kvar. Om underlaget redan har raderats kan vi inte återskapa dina tidigare svar från betalningen.</p><a href="mailto:support@relationsvarning.se" className={styles.textLink}>Få hjälp med ett tidigare köp →</a></div></section>}
    <p className={styles.finePrint}>För mer information om lagring och dina rättigheter, <Link href="/integritet">läs vår integritetssida</Link>.</p>
  </div></main>;
}
