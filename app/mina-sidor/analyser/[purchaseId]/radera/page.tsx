import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { accountIdentity } from "../../../../_lib/accountHttp.server";
import { hasOwnedAccountPurchase } from "../../../../_lib/accountPurchasesDb.server";
import styles from "../../../page.module.css";

export const dynamic = "force-dynamic";

export default async function DeleteAccountAnalysis({ params }: { params: Promise<{ purchaseId: string }> }) {
  const identity = await accountIdentity();
  if (identity.kind !== "authenticated") redirect(identity.kind === "anonymous" ? "/logga-in" : "/logga-in?status=unavailable");
  const { purchaseId } = await params;
  let owned: boolean;
  try { owned = await hasOwnedAccountPurchase(identity.userId, purchaseId); }
  catch { return <main className={styles.page}><div className={styles.content}><Link href="/mina-sidor" className={styles.textLink}>← Till Mina sidor</Link><p className={styles.notice} role="alert">Vi kan inte nå din sparade analys just nu. Försök igen om en stund.</p></div></main>; }
  if (!owned) notFound();
  return <main className={styles.page}><div className={styles.content}>
    <Link href="/mina-sidor#analyser" className={styles.textLink}>← Till Mina sidor</Link><h1 className={styles.subpageTitle}>Radera din sparade analys?</h1>
    <section className={styles.claimCard}><h2>Din AuDHD-analys på kontot</h2><p>Analysen och dess krypterade underlag raderas från ditt konto. Köphistoriken finns kvar. Raderingen påverkar inte det ursprungliga gästunderlaget eller befintliga recovery-länkar, som följer sina egna giltighetstider.</p>
      <form action={`/api/account/purchases/${purchaseId}/analysis/delete`} method="post" className={styles.claimForm}><input type="hidden" name="confirm" value="delete-analysis" /><button type="submit" className={styles.primaryButton}>Ja, radera den sparade analysen</button></form>
      <Link href="/mina-sidor#analyser" className={styles.deleteLink}>Behåll analysen</Link>
    </section>
  </div></main>;
}
