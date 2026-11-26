import NpfLandingLink from "./NpfLandingLink";
import { calculate as calculateAdhd, areaNames as adhdAreas } from "../adhd-test/test/model";
import { calculate as calculateAutism, areaNames as autismAreas } from "../autism-test/test/model";
import { calculateReport, questions as audhdQuestions } from "../audhd-test/test/model";
import { adhdReportPrice, autismReportPrice } from "../_content/npfPricing";
import { PRICE_SEK as audhdPrice } from "../audhd-test/test/model";
import styles from "./NpfPremium.module.css";

export const npfTests = {
  adhd: {
    name: "ADHD", title: "ADHD-test för vuxna", start: "Starta ADHD-testet", path: "/adhd-test", method: "/adhd-test#metodik",
    timing: "30 frågor · cirka 5 minuter", price: adhdReportPrice,
    headline: "Vi nöjer oss inte med att vara bra. Vi vill bli bäst.",
    intro: "Vi arbetar för att utveckla Sveriges mest träffsäkra och tillförlitliga ADHD-självtest. Din individuella analys visar hur fokus, planering och igångsättning hänger ihop i din vardag.",
    benefits: ["Personlig profil inom sex områden", "Fördjupning om fokus, struktur och vardagspåverkan"],
  },
  autism: {
    name: "Autism", title: "Autismtest för vuxna", start: "Starta autismtestet", path: "/autism-test", method: "/autism-test#metodik",
    timing: "30 frågor · cirka 5 minuter", price: autismReportPrice,
    headline: "Förstå vad som tar energi och vad som hjälper dig.",
    intro: "Vi vill utveckla Sveriges mest träffsäkra och tillförlitliga autismsjälvtest. Få en individuell analys av hur samspel, rutiner, sinnesintryck och intressen framträder i dina svar.",
    benefits: ["Personlig profil inom sex områden", "Fördjupning om sinnesintryck, flexibilitet och återhämtning"],
  },
  audhd: {
    name: "AuDHD", title: "AuDHD-test för vuxna", start: "Starta AuDHD-testet", path: "/audhd-test", method: "/audhd-metodik",
    timing: "48 huvudfrågor + 6 följdfrågor · cirka 8 minuter", price: audhdPrice,
    headline: "En tydligare bild när dina behov drar åt olika håll.",
    intro: "Vi vill utveckla Sveriges mest träffsäkra och tillförlitliga AuDHD-självtest. Se dina ADHD- och autismrelaterade svar sida vid sida och utforska hur de samspelar i vardagen.",
    benefits: ["Två huvudindex och åtta individuella delområden", "Fördjupning om anpassning, behov som krockar och vardagspåverkan"],
  },
} as const;
export type NpfTest = keyof typeof npfTests;
export const npfTestKeys = ["adhd", "autism", "audhd"] as const;

export function isNpfTest(value?: string | string[]): value is NpfTest {
  return value === "adhd" || value === "autism" || value === "audhd";
}

const exampleScores = {
  adhd: [3, 4, 3, 2, 4, 3].flatMap(value => [value, value, value, value - 1, value]),
  autism: [2, 3, 3, 4, 2, 3].flatMap(value => [value, value, value, value - 1, value]),
};

const reportContents = {
  adhd: [
    "Delpoäng och tolkning för alla sex områden, från fokus till igångsättning.",
    "Din profiltyp och vilka kombinationer som sticker ut i dina svar.",
    "En egen tolkning av hur svårigheterna märks i din vardag.",
    "Vilka av dina svar som stärker mönstret och vilka som nyanserar det.",
    "Andra möjliga förklaringar, som stress eller sömnbrist.",
  ],
  autism: [
    "Sex tolkade delresultat om bland annat samspel, rutiner och sinnesintryck.",
    "Din profil och vilka mönster som framträder mest, även om helheten ligger lågt.",
    "Hur mönstren påverkar vardagen och om du känner igen dem över tid.",
    "Vilka av dina svar som ger stöd för mönstret och vad som gör bilden mindre tydlig.",
    "Andra möjliga förklaringar, som social ångest eller långvarig stress.",
  ],
  audhd: [
    "Två separata huvudindex och en karta över alla åtta områden.",
    "En närmare titt på var dina behov krockar, till exempel kring struktur och spontanitet.",
    "En tolkning av dina svar om maskering, kompensation och energin det kan kräva.",
    "Hur mönstren märks i vardagen och om du känner igen dem från tidigare i livet.",
    "Vad som nyanserar din profil och förslag på nästa steg.",
  ],
} satisfies Record<NpfTest, string[]>;

function reportPreview(test: NpfTest) {
  if (test === "adhd") {
    const result = calculateAdhd(exampleScores.adhd);
    return { scores: [["Symptomindex", result.symptomIndex]] as const, areas: (["attention", "organization", "activation"] as const).map(key => [adhdAreas[key], result.scores[key]] as const), detail: "Rapporten jämför dina delområden och sätter svaren i relation till hur vardagen påverkas." };
  }
  if (test === "autism") {
    const result = calculateAutism(exampleScores.autism);
    return { scores: [["Mönsterindex", result.symptomIndex]] as const, areas: (["socialCommunication", "predictabilityFlexibility", "sensory"] as const).map(key => [autismAreas[key], result.scores[key]] as const), detail: "Rapporten lyfter fram höga delområden och väger in vad du beskriver om vardagen och över tid." };
  }
  const result = calculateReport(audhdQuestions.map(({ dimension }) => dimension === "A" || dimension === "G" ? 4 : dimension === "B" ? 1 : 3), [3, 2, 2, 3, 2, 1]);
  return { scores: [["ADHD-relaterat index", result.indices.adhdIndex], ["Autismrelaterat index", result.indices.autismIndex]] as const, areas: [["Rutiner och flexibilitet", result.scores.D], ["Anpassning och kompensation", result.scores.F], ["AuDHD-friktion", result.scores.G]] as const, detail: "Rapporten visar vilka behov du upplever krockar och hur det hänger ihop med svaren om vardagen." };
}

export function NpfReportIntroduction() {
  return <p className={styles.reportIntroduction}>
    <strong>Det här är bara början.</strong>{" "}
    Din fullständiga rapport innehåller betydligt mer än det du ser här. Du får en omfattande, individuell analys som hjälper dig att förstå dina svarsmönster, hur olika områden samspelar och hur de påverkar din vardag.
  </p>;
}

export function NpfReportExample({ test, showIntroduction = true }: { test: NpfTest; showIntroduction?: boolean }) {
  const example = reportPreview(test);
  const Heading = showIntroduction ? "h2" : "h3";
  return <div className={styles.reportSample}>
    <figure className={styles.preview}>
      <figcaption>
        <span className={styles.previewCaption}>Ett utdrag ur den fullständiga rapporten <span aria-hidden="true">✦</span></span>
        <span className={styles.previewDisclaimer}>Illustrativa värden baserade på påhittade svar.</span>
      </figcaption>
      <p className={styles.previewTitle}>Din {npfTests[test].name}-profil</p>
      <dl className={styles.metrics}>{example.scores.map(([label, score]) => <div key={label}><dt>{label}</dt><dd>{Math.round(score)} <span>/ 100</span></dd></div>)}</dl>
      <dl className={styles.areas}>{example.areas.map(([label, score]) => <div key={label}><dt>{label}</dt><dd>{Math.round(score)}</dd><dd className={styles.bar} aria-hidden="true"><span style={{ width: `${score}%` }} /></dd></div>)}</dl>
      <div className={styles.previewNote}><strong>Så läser du profilen</strong><p>{example.detail}</p></div>
      <p className={styles.previewContinues}>Rapporten fortsätter med fler individuella analyser och fördjupningar …</p>
    </figure>
    <div className={styles.reportOverview}>
      {showIntroduction && <NpfReportIntroduction />}
      <Heading>Det här får du i din fullständiga analys</Heading>
      <ul>{reportContents[test].map(content => <li key={content}><span aria-hidden="true">✓</span>{content}</li>)}</ul>
      <p className={styles.reportPrice}><strong>En komplett personlig analys för {npfTests[test].price} kr. En engångsbetalning.</strong></p>
    </div>
  </div>;
}

export const premiumButton = styles.primary;
export const premiumSecondary = styles.secondary;
export const premiumShell = styles.shell;
export const premiumEditorial = styles.editorial;
export const premiumStyles = styles;

export function NpfPremiumHero({ test }: { test: NpfTest }) {
  const data = npfTests[test];
  return <header className={styles.hero}>
    <div className={styles.heroContent}>
      <p className={styles.eyebrow}>Utvecklat för vuxna · Intern COSMIN-baserad metodgranskning</p>
      <h1>{data.title}</h1>
      <p className={styles.headline}>{data.headline}</p>
      <p className={styles.intro}>{data.intro}</p>
      <ul className={styles.benefits}>
        {[...data.benefits, "Systematiskt kvalitetsarbete", "Samma villkor oavsett resultat"].map(benefit => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}
      </ul>
      <div className={styles.offer}><strong>{data.price} kr</strong><div><b>Fullständig individuell analys</b><p>Engångsbetalning. Inget abonnemang.</p></div></div>
      <p className={styles.small}>Gör testet och få din första återkoppling gratis.</p>
      <div className={styles.actions}>
        <NpfLandingLink href={`${data.path}/test`} source={data.path} action="test_start" className={styles.primary}>{data.start} <span aria-hidden="true">→</span></NpfLandingLink>
        <NpfLandingLink href={`/varfor-relationsvarning?test=${test}`} source={data.path} action="why_relationsvarning" className={styles.secondary}>Inte övertygad?</NpfLandingLink>
      </div>
      <p className={styles.small}>{data.timing} · Ingen registrering före teststart</p>
      <div className={styles.promise}><strong>Vi säljer självinsikt. Inte diagnoser.</strong><p>Vi säljer inga kliniska utredningar eller läkemedel. Din analys kostar lika mycket oavsett resultat. Självtestet ersätter inte en klinisk utredning.</p></div>
    </div>
    <div className={styles.heroReport}><NpfReportExample test={test} /></div>
  </header>;
}

const quality = [
  ["↗", "Höga ambitioner", "Vi arbetar för att utveckla Sveriges mest träffsäkra självtester."],
  ["✓", "Metodgranskat", "Intern kvalitetsgranskning med stöd av COSMIN:s internationella metodik."],
  ["=", "Resultatneutralt", "Samma pris oavsett resultat. Vi tjänar inget på kliniska utredningar, diagnoser eller läkemedel."],
  ["+", "Ständig utveckling", "Dina köp bidrar till att vi kan fortsätta utveckla och kvalitetssäkra våra produkter."],
] as const;

export function NpfQualityCards() {
  return <section className={styles.quality} aria-label="Så arbetar vi med kvalitet">
    {quality.map(([icon, title, copy]) => <div key={title}><span className={styles.icon} aria-hidden="true">{icon}</span><h2>{title}</h2><p>{copy}</p></div>)}
  </section>;
}
