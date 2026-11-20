import Link from "next/link";
import Fingerprint from "./_components/Fingerprint";
import { CHAPTERS, PRICE_SEK } from "./_domain/versions";
import styles from "./persona.module.css";

const chapterDescriptions = [
  "Hur du brukar tänka, känna och agera i vardagen.",
  "Hur du tar kontakt, visar hänsyn och gör det du föresatt dig.",
  "Fler perspektiv på samma fem personlighetsdimensioner.",
  "Vad som motiverar dig, hur du vill bli bemött och vad som hjälper dig.",
];
export default function PersonaLanding() {
  return <>
    <section className={styles.hero} aria-labelledby="persona-title">
      <div className={styles.heroEmblem}><span /><Fingerprint className={styles.fingerprint} /><span /></div>
      <p className={styles.eyebrow}>Ett personlighetstest i fyra kapitel</p>
      <h1 id="persona-title" className={styles.heroTitle}><span>PERSONA</span><span className={styles.srOnly}> – </span><em>Vem är du egentligen?</em></h1>
      <p className={styles.heroLead}>Du har fler sidor än du tänker på till vardags.</p>
      <p className={styles.heroDescription}>Svara på 40 korta påståenden om vanor, relationer och det som hjälper dig i vardagen. Se vilka mönster som tar form i dina svar.</p>
      <Link href="/persona/test" className={styles.primary}>Upptäck din personlighet <span aria-hidden="true">↗</span></Link>
      <p className={styles.trust}>40 frågor <span>·</span> Ingen registrering <span>·</span> En gratis personlig insikt</p>
      <a href="#resan" className={styles.explore}>Lär känna resan <span aria-hidden="true">↓</span></a>
    </section>
    <section className={styles.introduction} aria-labelledby="choice-title">
      <p className={styles.eyebrow}>Så svarar du</p>
      <h2 id="choice-title" className={styles.editorialTitle}>”Jag brukar inleda samtal.”</h2>
      <p>Välj hur väl påståendet stämmer in på dig, från ”Stämmer inte alls” till ”Stämmer helt”. Tänk på hur du brukar vara just nu.</p>
      <div className={styles.pullquote}>Samma fem svar genom hela testet.</div>
      <p className={styles.muted}>De första 30 påståendena ger fem dimensionsvärden. De sista tio ger plats åt det du själv säger om stöd, drivkrafter och förändring.</p>
    </section>
    <section id="resan" className={styles.journey} aria-labelledby="journey-title">
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Från det synliga till det personliga</p><h2 id="journey-title" className={styles.editorialTitle}>Fyra kapitel. Ett porträtt<br />med plats för nyanser.</h2></div>
      <ol className={styles.chapterList}>{CHAPTERS.map((chapter, i) => <li key={chapter.id}>
        <span className={styles.chapterNumber}>0{chapter.id}</span>
        <div><h3>{chapter.title}</h3><p>{chapterDescriptions[i]}</p></div>
        <span className={styles.chapterCount}>{chapter.count} frågor</span>
      </li>)}</ol>
    </section>
    <section className={styles.closing} aria-labelledby="begin-title">
      <Fingerprint className={styles.smallFingerprint} />
      <p className={styles.eyebrow}>Börja med nyfikenhet</p>
      <h2 id="begin-title" className={styles.editorialTitle}>Du behöver inte ha<br />en färdig bild av dig själv.</h2>
      <p>Genomför testet utan kostnad och få en insikt grundad i dina svar. Välj sedan om du vill låsa upp hela ditt porträtt med personlighetskarta, råd och utskrift för {PRICE_SEK} kr som engångsbetalning.</p>
      <Link href="/persona/test" className={styles.primary}>Upptäck din personlighet <span aria-hidden="true">↗</span></Link>
      <p className={styles.finePrint}>Grundfrågorna är bearbetade från öppna IPIP-källor. PERSONA:s svenska urval är en självskattning för reflektion och har inte validerats.</p>
    </section>
  </>;
}
