import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Brand from "../_components/Brand";
import { authenticatedUser } from "../_lib/authSession.server";
import { LOGIN_PATH } from "../_lib/authConfig.server";
import { accountStorageReady, listAccountPurchases, type AccountPurchaseSummary } from "../_lib/accountPurchasesDb.server";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import TestAccountEntry from "./TestAccountEntry";
import DirectAccountPortal from "./DirectAccountPortal";
import { directPortalEnabled } from "../_lib/testAccounts/directPublic";

export const metadata: Metadata = {
  title: "Mina sidor | Relationsvarning",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const exploreLinks = [
  { title: "Relation och trygghet", description: "Utforska gränser, anknytning och återkommande relationsmönster.", href: "/test", label: "Börja med relationstestet", tone: "rose" },
  { title: "ADHD och autism", description: "Självskattningar som hjälper dig att strukturera egna erfarenheter.", href: "/adhd-test", label: "Se tester inom området", tone: "sage" },
  { title: "Stress och mående", description: "Läs mer om oro, återhämtning och traumarelaterade reaktioner.", href: "/angest-test", label: "Utforska tester", tone: "sand" },
] as const;

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}

const purchaseStatus: Record<AccountPurchaseSummary["status"], string> = {
  available: "Analys sparad", expired: "Analysens lagringstid har gått ut", user_deleted: "Analysen raderad",
  revoked: "Åtkomst återkallad", missing: "Ingen sparad analys",
};
const date = (value: Date) => value.toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });

export default async function MyPages({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (directPortalEnabled()) return <DirectAccountPortal />;
  let user = null;
  try {
    user = await authenticatedUser();
  } catch {
    redirect(`${LOGIN_PATH}?status=unavailable`);
  }
  if (!user) redirect(LOGIN_PATH);

  const email = user.email ?? "Ditt konto";
  let purchases: AccountPurchaseSummary[] = [];
  let purchasesUnavailable = false;
  try {
    if (!user.email_confirmed_at || user.is_anonymous || !await accountStorageReady()) purchasesUnavailable = true;
    else purchases = await listAccountPurchases(user.id);
  } catch { purchasesUnavailable = true; }
  const { status } = await searchParams;
  const analyses = purchases.filter(purchase => purchase.status === "available");

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" aria-label="Relationsvarning – startsidan" className={styles.brandLink}><Brand className={styles.brand} markClassName={styles.brandMark} /></Link>
        <div className={styles.accountActions}>
          <span className={styles.accountEmail} title={email}>{email}</span>
          <form action="/logga-ut" method="post">
            <button className={styles.logout} type="submit">Logga ut</button>
          </form>
        </div>
      </header>

      <div className={styles.content}>
        <p className={styles.signedInAs}>Inloggad som {email}</p>
        <TestAccountEntry />
        <section className={styles.welcome} aria-labelledby="welcome-title">
          <div className={styles.welcomeCopy}>
            <SectionLabel>DIN PERSONLIGA PLATS</SectionLabel>
            <h1 id="welcome-title">Välkommen till Mina sidor</h1>
            <p>Samla dina köp och personliga analyser, och hitta nästa steg i din egen takt. Du väljer själv vilka analyser du vill spara på kontot.</p>
            <Link className={styles.primaryButton} href="/mina-sidor/koppla">Koppla ett AuDHD-köp <span aria-hidden="true">→</span></Link>
          </div>
          <div className={styles.welcomeArt} aria-hidden="true">
            <span className={styles.orbitOne} />
            <span className={styles.orbitTwo} />
            <span className={styles.artHeart}>♡</span>
            <span className={styles.artDot} />
          </div>
        </section>

        <nav className={styles.sectionNav} aria-label="Mina sidor">
          <a href="#kop">Mina köp</a>
          <a href="#analyser">Analyser</a>
          <a href="#bibliotek">Mitt bibliotek</a>
          <a href="#utforska">Utforska</a>
          <a href="#medlemskap">Medlemskap</a>
        </nav>

        {status === "saved" && <p role="status" className={styles.notice}>Din AuDHD-analys har sparats på kontot. Du kan öppna den igen här.</p>}
        {status === "purchase-linked" && <p role="status" className={styles.notice}>Köpet har kopplats till kontot. Analysens tidigare underlag finns inte längre kvar, så endast köphistoriken har sparats.</p>}
        {status === "deleted" && <p role="status" className={styles.notice}>Den sparade analysen och dess underlag har raderats från kontot. Köphistoriken finns kvar.</p>}
        {purchasesUnavailable && <p role="status" className={styles.notice}>Dina kopplade köp kan inte hämtas just nu. Försök igen om en stund. Dina befintliga köp- och återställningslänkar går fortfarande att använda enligt sina vanliga villkor.</p>}

        <section id="kop" className={styles.section} aria-labelledby="purchases-title">
          <div className={styles.sectionHeading}><div><SectionLabel>DITT INNEHÅLL</SectionLabel><h2 id="purchases-title">Mina köp</h2></div><Link href="/mina-sidor/koppla" className={styles.textLink}>Koppla ett köp →</Link></div>
          {purchases.length ? <div className={styles.purchaseList}>{purchases.map(purchase => <article key={purchase.id} className={styles.purchaseRow}>
            <div><span className={styles.productType}>PREMIUMANALYS</span><h3>AuDHD – din personliga analys</h3><p>Köpt {date(purchase.purchasedAt)} · {new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(purchase.amountTotalOre / 100)}</p></div>
            <div className={styles.purchaseActions}><span className={styles.comingBadge}>{purchaseStatus[purchase.status]}</span>{purchase.status === "available" && <Link href={`/mina-sidor/analyser/${purchase.id}`} className={styles.textLink}>Öppna analys →</Link>}</div>
          </article>)}</div> : !purchasesUnavailable && <div className={styles.emptyCard}><div className={styles.emptyCopy}><h3>Välkommen till din samling</h3><p>Här visas de köp du har kopplat till kontot. Har du redan köpt en AuDHD-analys? Öppna den eller din personliga recovery-länk i samma webbläsare och välj sedan att spara den här.</p></div></div>}
          {purchases.length === 50 && <p className={styles.finePrint}>Dina senaste 50 kopplade köp visas.</p>}
        </section>

        <section id="analyser" className={styles.section} aria-labelledby="analyses-title">
          <div className={styles.sectionHeading}>
            <div><SectionLabel>DIN UTVECKLING</SectionLabel><h2 id="analyses-title">Mina analyser</h2></div>
            <span className={styles.countBadge}>{purchasesUnavailable ? "Kan inte hämtas" : `${analyses.length} ${analyses.length === 1 ? "sparad" : "sparade"}`}</span>
          </div>
          {analyses.length ? <div className={styles.analysisGrid}>{analyses.map(purchase => <article className={styles.analysisCard} key={purchase.id}>
            <p className={styles.eyebrow}>PERSONLIG PREMIUMANALYS</p><h3>Din AuDHD-profil</h3><p>Köpt {date(purchase.purchasedAt)}</p><p className={styles.finePrint}>Sparad till {date(purchase.analysisExpiresAt!)}. Betalningen kontrolleras när du öppnar analysen.</p>
            <Link className={styles.primaryButton} href={`/mina-sidor/analyser/${purchase.id}`}>Öppna min analys →</Link>
            <Link className={styles.deleteLink} href={`/mina-sidor/analyser/${purchase.id}/radera`}>Radera sparad analys</Link>
          </article>)}</div> : !purchasesUnavailable && <div className={styles.emptyCard}>
            <div className={`${styles.emptyIcon} ${styles.iconRose}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 4.75h9.5L19 9.2v10.05H5V4.75Z"/><path d="M14 5v4.5h4.5M8.5 13h7M8.5 16.5h5"/></svg></div>
            <div className={styles.emptyCopy}>
              <h3>Dina personliga resultat samlas här</h3>
              <p>När du väljer att spara en verifierad AuDHD-analys kan du öppna den igen från kontot, även på en annan enhet. Ingen analys sparas här automatiskt.</p>
            </div>
          </div>}
        </section>

        <section id="bibliotek" className={styles.section} aria-labelledby="library-title">
          <div className={styles.sectionHeading}>
            <div><SectionLabel>ATT ÅTERVÄNDA TILL</SectionLabel><h2 id="library-title">Mitt bibliotek</h2></div>
          </div>
          <div className={styles.emptyCard}>
            <div className={`${styles.emptyIcon} ${styles.iconSage}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4.75 5.25h5.5A2.75 2.75 0 0 1 13 8v11a2.75 2.75 0 0 0-2.75-2.75h-5.5v-11ZM19.25 5.25h-3.5A2.75 2.75 0 0 0 13 8v11a2.75 2.75 0 0 1 2.75-2.75h3.5v-11Z"/></svg></div>
            <div className={styles.emptyCopy}>
              <h3>Säker kontokoppling för e-böcker kommer härnäst</h3>
              <p>Använd dina befintliga bok- och nedladdningslänkar tills dina bokköp kan kopplas säkert till biblioteket. Inga böcker läggs till enbart utifrån din mejladress.</p>
            </div>
            <span className={styles.comingBadge}>Kopplas snart</span>
          </div>
        </section>

        <section id="utforska" className={styles.section} aria-labelledby="explore-title">
          <div className={styles.sectionHeading}>
            <div><SectionLabel>TA NÄSTA STEG I DIN TAKT</SectionLabel><h2 id="explore-title">Utforska innehållet</h2></div>
            <p className={styles.headingAside}>Fristående tester och guider finns tillgängliga även utan konto.</p>
          </div>
          <div className={styles.exploreGrid}>
            {exploreLinks.map((item) => (
              <article className={styles.exploreCard} key={item.title}>
                <div className={`${styles.exploreMark} ${styles[item.tone]}`} aria-hidden="true"><span /></div>
                <div className={styles.exploreText}><h3>{item.title}</h3><p>{item.description}</p></div>
                <Link href={item.href} className={styles.textLink}>{item.label}<span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </section>

        <section id="medlemskap" className={styles.membership} aria-labelledby="membership-title">
          <div className={styles.membershipMain}>
            <SectionLabel>MER STÖD ÖVER TID</SectionLabel>
            <h2 id="membership-title">Ett medlemskap att växa med</h2>
            <p>Vi planerar ett medlemskap med tillgång till utvalda tester, e-böcker och nytt innehåll. Vi berättar exakt vad som ingår innan det går att teckna.</p>
            <span className={styles.plannedBadge}>Planeras · ännu inte tillgängligt</span>
          </div>
          <div className={styles.membershipPrice}>
            <span className={styles.priceLabel}>Planerat pris</span>
            <p><strong>79</strong><span>kr / månad</span></p>
            <span className={styles.noCharge}>Du debiteras inte här</span>
          </div>
        </section>

        <aside className={styles.privacyNote}>
          <span className={styles.privacyIcon} aria-hidden="true">♡</span>
          <p><strong>Dina svar är personliga.</strong> Testköp och resultat visas bara när åtkomst har verifierats och kopplats säkert till ditt konto.</p>
          <Link href="/integritet">Läs om integritet <span aria-hidden="true">→</span></Link>
        </aside>

        <footer className={styles.footer}>
          <p>Behöver du hjälp med ditt konto eller ett tidigare köp?</p>
          <a href="mailto:support@relationsvarning.se">Kontakta support <span aria-hidden="true">→</span></a>
        </footer>
      </div>
    </main>
  );
}
