import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { accountIdentity } from "../../../_lib/accountHttp.server";
import { openOwnedAccountAnalysis } from "../../../_lib/accountAnalysis.server";
import SavedAudhdReport from "../../SavedAudhdReport";
import styles from "../../page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountAnalysisPage({ params }: { params: Promise<{ purchaseId: string }> }) {
  const identity = await accountIdentity();
  if (identity.kind !== "authenticated") redirect(identity.kind === "anonymous" ? "/logga-in" : "/logga-in?status=unavailable");
  const { purchaseId } = await params;
  const analysis = await openOwnedAccountAnalysis(identity.userId, purchaseId);
  if (analysis.kind === "not_found") notFound();
  return <main className={styles.page}><div className={styles.content}>
    <Link href="/mina-sidor#analyser" className={styles.textLink}>← Till Mina sidor</Link>
    <h1 className={styles.subpageTitle}>Din AuDHD-analys</h1>
    {analysis.kind === "unavailable" ? <section className={styles.emptyCard} role="alert"><div className={styles.emptyCopy}><h2>Analysen kan inte öppnas just nu</h2><p>Försök igen om en stund. Du behöver inte betala igen.</p><Link href={`/mina-sidor/analyser/${purchaseId}`} className={styles.textLink}>Försök igen →</Link></div></section>
      : <><p className={styles.subpageIntro}>Din sparade analys är tillgänglig till {analysis.expiresAt.toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" })}. Du kan radera den tidigare från Mina sidor.</p><SavedAudhdReport report={analysis.report} /></>}
  </div></main>;
}
