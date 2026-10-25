import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Brand from "../_components/Brand";
import { authenticatedUser } from "../_lib/authSession.server";
import { LOGIN_PATH } from "../_lib/authConfig.server";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

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

export default async function MyPages() {
  let user = null;
  try {
    user = await authenticatedUser();
  } catch {
    redirect(`${LOGIN_PATH}?status=unavailable`);
  }
  if (!user) redirect(LOGIN_PATH);

  const email = user.email ?? "Ditt konto";

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
        <section className={styles.welcome} aria-labelledby="welcome-title">
          <div className={styles.welcomeCopy}>
            <SectionLabel>DIN PERSONLIGA PLATS</SectionLabel>
            <h1 id="welcome-title">Välkommen till Mina sidor</h1>
            <p>Här samlar vi dina analyser, böcker och nästa steg. Du kan utforska innehållet redan nu; köpt material visas här när kontokopplingen är klar.</p>
            <a className={styles.primaryButton} href="#utforska">Utforska innehållet <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.welcomeArt} aria-hidden="true">
            <span className={styles.orbitOne} />
            <span className={styles.orbitTwo} />
            <span className={styles.artHeart}>♡</span>
            <span className={styles.artDot} />
          </div>
        </section>

        <nav className={styles.sectionNav} aria-label="Mina sidor">
          <a href="#analyser">Analyser</a>
          <a href="#bibliotek">Mitt bibliotek</a>
          <a href="#utforska">Utforska</a>
          <a href="#medlemskap">Medlemskap</a>
        </nav>

        <section id="analyser" className={styles.section} aria-labelledby="analyses-title">
          <div className={styles.sectionHeading}>
            <div><SectionLabel>DIN UTVECKLING</SectionLabel><h2 id="analyses-title">Mina analyser</h2></div>
            <span className={styles.countBadge}>Samlas här</span>
          </div>
          <div className={styles.emptyCard}>
            <div className={`${styles.emptyIcon} ${styles.iconRose}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 4.75h9.5L19 9.2v10.05H5V4.75Z"/><path d="M14 5v4.5h4.5M8.5 13h7M8.5 16.5h5"/></svg></div>
            <div className={styles.emptyCopy}>
              <h3>Dina personliga resultat samlas här</h3>
              <p>När dina köp har kopplats säkert till kontot kan du öppna analyserna igen, även från en annan enhet.</p>
            </div>
            <span className={styles.comingBadge}>Kopplas snart</span>
          </div>
        </section>

        <section id="bibliotek" className={styles.section} aria-labelledby="library-title">
          <div className={styles.sectionHeading}>
            <div><SectionLabel>ATT ÅTERVÄNDA TILL</SectionLabel><h2 id="library-title">Mitt bibliotek</h2></div>
          </div>
          <div className={styles.emptyCard}>
            <div className={`${styles.emptyIcon} ${styles.iconSage}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4.75 5.25h5.5A2.75 2.75 0 0 1 13 8v11a2.75 2.75 0 0 0-2.75-2.75h-5.5v-11ZM19.25 5.25h-3.5A2.75 2.75 0 0 0 13 8v11a2.75 2.75 0 0 1 2.75-2.75h3.5v-11Z"/></svg></div>
            <div className={styles.emptyCopy}>
              <h3>Dina böcker får en egen plats</h3>
              <p>Köpta e-böcker kommer att visas här med en säker länk tillbaka till ditt bibliotek.</p>
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
