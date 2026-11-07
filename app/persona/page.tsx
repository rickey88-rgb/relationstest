import Link from "next/link";
import Fingerprint from "./_components/Fingerprint";
import { CHAPTERS, PRICE_SEK } from "./_domain/versions";
import styles from "./persona.module.css";

const chapterDescriptions = [
  "Hur du tar plats, blir sedd och möter andras bild av dig.",
  "Vad du väljer när lojalitet, möjligheter och ansvar drar åt olika håll.",
  "Vad du behöver, skyddar och kanske inte alltid har ord för.",
  "Sex följdfrågor som fördjupar just dina tidigare val.",
];
export default function PersonaLanding() {
  return <>
    <section className={styles.hero} aria-labelledby="persona-title">
      <div className={styles.heroEmblem}><span /><Fingerprint className={styles.fingerprint} /><span /></div>
      <p className={styles.eyebrow}>Ett personlighetstest i fyra kapitel</p>
      <h1 id="persona-title" className={styles.heroTitle}><span>PERSONA</span><span className={styles.srOnly}> – </span><em>Vem är du egentligen?</em></h1>
      <p className={styles.heroLead}>Vissa sidor visar du för alla.<br />Andra märks först när något står på spel.</p>
      <p className={styles.heroDescription}>Kliv in i verklighetsnära dilemman om framgång, närhet och förtroende. Upptäck vad du väljer att värna när du inte kan få allt.</p>
      <Link href="/persona/test" className={styles.primary}>Upptäck din personlighet <span aria-hidden="true">↗</span></Link>
      <p className={styles.trust}>40 frågor <span>·</span> Ingen registrering <span>·</span> En gratis personlig insikt</p>
      <a href="#resan" className={styles.explore}>Lär känna resan <span aria-hidden="true">↓</span></a>
    </section>
    <section className={styles.introduction} aria-labelledby="choice-title">
      <p className={styles.eyebrow}>Mellan två rimliga val</p>
      <h2 id="choice-title" className={styles.editorialTitle}>Du och en nära vän<br />vill ha samma möjlighet.</h2>
      <p>Ingen har lovat den andra något. Ni har båda en chans. Söker du öppet, håller du förberedelserna för dig själv, eller undersöker du en annan väg?</p>
      <div className={styles.pullquote}>Det intressanta är vad som får väga tyngst för dig.</div>
      <p className={styles.muted}>PERSONA undersöker avvägningar. Här finns inga poäng för att vara en bättre människa, och inga givna svar på vem du borde vara.</p>
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
      <p>Genomför testet utan kostnad och få en insikt grundad i dina svar. En fullständig premiumrapport är planerad för {PRICE_SEK} kr som engångsbetalning. Köp är inte tillgängligt ännu.</p>
      <Link href="/persona/test" className={styles.primary}>Upptäck din personlighet <span aria-hidden="true">↗</span></Link>
      <p className={styles.finePrint}>Egna frågor med personlighetspsykologi som orienteringsram. PERSONA är inte en validerad frågeskala.</p>
    </section>
  </>;
}
