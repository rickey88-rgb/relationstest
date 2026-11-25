import Image from "next/image";
import Link from "next/link";
import { norwegian } from "../../_content/market";
import { norwegianGuides } from "../../_content/norwegianGuides";
import { NORWEGIAN_BOOK as book } from "../../_lib/norwegianBook";
import { norwegianMetadata, site, StructuredData } from "../_components/norwegianSeo";
import styles from "./page.module.css";

const title = "AuDHD-test for voksne på norsk";
const description = "Utforsk trekk knyttet til ADHD og autisme i en norsk selvtest med 48 spørsmål og 6 oppfølgingsspørsmål. Få en gratis oppsummering av svarene.";
export const metadata = norwegianMetadata(norwegian.test, title, description);

const overview = [
  ["Spørsmål", "48 hovedspørsmål og 6 oppfølgingsspørsmål"],
  ["Før kjøp", "Gratis oppsummering av svarene dine"],
  ["Full rapport", "Åtte områder og forslag til neste steg"],
  ["Etter kjøp", "Lenke på e-post og mulighet til å lagre som PDF"],
] as const;

const reportContents = [
  ["Dine tydeligste mønstre", "En samlet oppsummering av hva som skiller seg ut i svarene dine, og hva som nyanserer bildet."],
  ["ADHD-relaterte trekk", "Se hvordan svarene dine om fokus, igangsetting, impulser og uro henger sammen."],
  ["Autismerelaterte trekk", "Få en egen oversikt over svarene om sosial kommunikasjon, sanseinntrykk og behov for rutiner."],
  ["Når behov trekker i ulike retninger", "Utforsk hvordan trekk kan virke sammen, for eksempel når du trenger faste rutiner og samtidig blir rastløs av dem."],
  ["Et kart over åtte områder", "Se områdene side om side, med forklaringer på blant annet maskering og hvordan mønstrene påvirker hverdagen."],
  ["Forslag til neste steg", "Få forslag til hva du kan legge merke til videre. Du kan lagre rapporten som PDF og lese den igjen i ditt eget tempo."],
] as const;

const steps = [
  ["48 hovedspørsmål om hverdagen", "Spørsmålene handler om blant annet fokus, struktur, sanseinntrykk, sosialt samspill og behov for forutsigbarhet."],
  ["6 oppfølgingsspørsmål", "Svar om barndom, ulike miljøer og belastning i hverdagen setter det du har fortalt i sammenheng."],
  ["Gratis oppsummering først", `Se hva som skiller seg ut i svarene dine. Deretter kan du velge å kjøpe full rapport for ${norwegian.reportPrice} NOK.`],
] as const;

const audience = [
  "Du kjenner deg igjen i trekk knyttet til både ADHD og autisme.",
  "Du vil forstå hvorfor noen situasjoner fungerer godt, mens andre krever mye energi.",
  "Du vil sette ord på egne mønstre og på hva som gjør hverdagen lettere.",
  "Du vil sortere erfaringene dine før en eventuell samtale med fastlegen.",
] as const;

export default function Page() {
  return <main className={styles.page} lang="nb-NO">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: site + norwegian.test, inLanguage: "nb-NO" }} />

    <section className={styles.hero} aria-labelledby="test-title">
      <div className={`${styles.container} ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <h1 id="test-title">AuDHD-test for voksne</h1>
          <p className={styles.intro}>Hvordan henger fokus, sanseinntrykk og behovet for forutsigbarhet sammen i din hverdag? Denne egenvurderingen hjelper deg å sortere erfaringer som kan være knyttet til både ADHD og autisme.</p>
          <div className={styles.actions}>
            <Link href={norwegian.questionnaire} className={styles.primary}>Start gratis selvtest <span aria-hidden="true">→</span></Link>
            <a href="#rapport" className={styles.textLink}>Se hva rapporten inneholder</a>
          </div>
          <p className={styles.trust}>På bokmål · Uten registrering<br />Gratis oppsummering. Full rapport kan kjøpes for <strong>{norwegian.reportPrice}&nbsp;NOK</strong>.</p>
        </div>
        <div className={styles.overview}>
          <h2>Kort om selvtesten</h2>
          <dl>{overview.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </div>
      </div>
    </section>

    <section id="rapport" className={`${styles.container} ${styles.section}`} aria-labelledby="report-title">
      <div className={styles.reportIntro}>
        <div className={styles.sectionIntro}>
          <h2 id="report-title">Dette får du i full rapport</h2>
          <p>Den gratis oppsummeringen viser hva som skiller seg ut. I full rapport får du se hvordan svarene henger sammen på tvers av områdene, og hva du kan utforske videre.</p>
        </div>
        <div className={styles.price}>
          <strong>{norwegian.reportPrice} <span>NOK</span></strong>
          <p>Én betaling for hele rapporten</p>
        </div>
      </div>
      <ul className={styles.reportGrid}>{reportContents.map(([heading, copy]) => <li key={heading} className={styles.reportCard}>
        <h3>{heading}</h3><p>{copy}</p>
      </li>)}</ul>
    </section>

    <section className={styles.process} aria-labelledby="process-title">
      <div className={`${styles.container} ${styles.section} ${styles.processInner}`}>
        <div className={styles.sectionIntro}>
          <h2 id="process-title">Slik er testen bygget opp</h2>
          <p>Ta utgangspunkt i det du vanligvis opplever, heller enn én spesielt god eller krevende dag. Svarene dine danner grunnlaget for oppsummeringen.</p>
        </div>
        <ol className={styles.steps}>{steps.map(([heading, copy]) => <li key={heading}>
          <h3>{heading}</h3><p>{copy}</p>
        </li>)}</ol>
      </div>
    </section>

    <div className={`${styles.container} ${styles.section} ${styles.audienceGrid}`}>
      <section aria-labelledby="audience-title" className={styles.audience}>
        <h2 id="audience-title">Hvem passer testen for?</h2>
        <ul>{audience.map(item => <li key={item}>{item}</li>)}</ul>
        <Link href={norwegian.questionnaire} className={styles.primary}>Start gratis selvtest <span aria-hidden="true">→</span></Link>
      </section>
      <section aria-labelledby="important-title" className={styles.important}>
        <h2 id="important-title">Viktig å vite</h2>
        <p><strong>Selvtesten er en egenvurdering, ikke en diagnose.</strong> Rapporten er laget for innsikt og refleksjon. Den bygger på dine egne svar og erstatter ikke en faglig utredning.</p>
        <p>Hvis vanskene påvirker hverdagen din, kan du ta opp konkrete eksempler med fastlegen.</p>
        <Link href="/no/audhd-utredning" className={styles.textLink}>Slik kan fastlegen hjelpe deg videre <span aria-hidden="true">→</span></Link>
      </section>
    </div>

    <section className={`${styles.container} ${styles.section} ${styles.guides}`} aria-labelledby="guides-title">
      <div className={styles.sectionIntro}>
        <h2 id="guides-title">Guider om AuDHD</h2>
        <p>Les om hvordan ADHD og autisme kan prege samme hverdag, fra maskering og energibruk til hva du kan ta opp med fastlegen.</p>
      </div>
      <ul className={styles.guideGrid}>{Object.entries(norwegianGuides).map(([slug, guide]) => <li key={slug}>
        <Link className={styles.guideCard} href={`/no/${slug}`}>
          <div><h3>{guide.h1}</h3><p>{guide.description}</p></div>
          <span className={styles.guideArrow} aria-hidden="true">→</span>
        </Link>
      </li>)}</ul>
    </section>

    <div className={`${styles.container} ${styles.bookArea}`}>
      <section className={styles.book} aria-labelledby="book-title">
        <div className={styles.bookCover}>
          <Image src={book.cover} width={book.width} height={book.height} sizes="(max-width: 599px) 170px, 210px" alt={`Omslaget til ${book.title}`} />
        </div>
        <div className={styles.bookCopy}>
          <p className={styles.bookByline}>E-bok på bokmål · {book.author}</p>
          <h2 id="book-title">{book.title}</h2>
          <p>Hva gjør du når du trenger en tydelig plan, men blir rastløs når alt er forutsigbart? Boka tar utgangspunkt i slike situasjoner og gir deg øvelser for å finne rutiner, håndtere sanseinntrykk og gi deg selv tid til å hente deg inn.</p>
          <div className={styles.actions}>
            <Link href={book.path} className={styles.primary}>Se boka <span aria-hidden="true">→</span></Link>
            <Link href={book.excerpt} className={styles.outline}>Åpne leseprøven (PDF)</Link>
          </div>
        </div>
      </section>
    </div>
  </main>;
}
