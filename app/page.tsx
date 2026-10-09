import Brand from "./_components/Brand";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import adhdGuides from "../content/adhd-guides.json";
import autismGuides from "../content/autism-guides.json";
import HomeGuideDirectory, { type HomeGuide } from "./_components/HomeGuideDirectory";
import HomeScrollLink from "./_components/HomeScrollLink";

export const metadata: Metadata = {
  title: "Relationsvarning – tester för destruktiva relationer",
  description:
    "Forskningsbaserade relationstester om kontroll, manipulation, psykiskt våld, gaslighting och destruktiva relationsmönster. Anonymt och utan registrering.",
  alternates: {
    canonical: "https://www.relationsvarning.se/",
  },
};

type Test = {
  href: string;
  title: string;
  description: string;
  label?: string;
};

const neurodiversityTests: Test[] = [
  { href: "/adhd-test", title: "ADHD-test för vuxna", description: "Utforska uppmärksamhet, organisation, impulsivitet, inre rastlöshet, tid och vardagspåverkan med 30 frågor." },
  { href: "/autism-test", title: "Autismtest för vuxna", description: "Utforska socialt samspel, kommunikation, sensorik, förutsägbarhet, intressen och vardagspåverkan med 30 frågor." },
  { href: "/audhd-test", title: "AuDHD-test", label: "ADHD och autism samtidigt", description: "Utforska hur ADHD- och autismrelaterade drag samspelar hos dig – och om olika behov förstärker eller motverkar varandra." },
];

const relationshipTests: Test[] = [
  { href: "/test", title: "Relationstest – varningssignaler", description: "42 frågor om kontroll, manipulation, psykisk misshandel och andra återkommande mönster i en relation." },
  { href: "/psykisk-misshandel-relation/test", title: "Psykisk misshandel-test", description: "Undersök återkommande mönster av kontroll, hot, förnedring och psykisk nedbrytning." },
  { href: "/narcissist-i-en-relation", title: "Narcissist i en relation", description: "Undersök relationsmönster som manipulation, empatibrist, nedvärdering och starka reaktioner på kritik." },
  { href: "/anknytningstest", title: "Anknytningstest", description: "Utforska hur du reagerar på närhet, osäkerhet och känslomässigt avstånd i romantiska relationer." },
  { href: "/medberoendetest", title: "Medberoendetest", description: "Undersök mönster av självuppoffring, överansvar, svårigheter med gränser och fokus på partnerns behov." },
  { href: "/gaslightingtest/test", title: "Gaslightingtest", description: "Undersök mönster av förnekande, skuldvändning och ifrågasättande som kan få dig att tvivla på din upplevelse." },
  { href: "/traumabindningtest/test", title: "Traumabindningstest", description: "Utforska starka känsloband trots smärta, hopp om förändring och svårigheter att skapa avstånd i en relation." },
];

const wellbeingTests: Test[] = [
  { href: "/angest-test", title: "Ångesttest för vuxna", description: "Utforska ständig oro, kroppslig spänning, sömn, koncentration och vardagspåverkan med 30 frågor." },
  { href: "/ptsd-test", title: "PTSD-test", description: "30 frågor om återupplevande, undvikande, vaksamhet och andra reaktioner efter svåra upplevelser." },
  { href: "/hsp-test", title: "HSP-test", description: "Utforska överstimulering, sinnesintryck, känslor och återhämtning med 30 frågor om högkänslighet." },
  { href: "/iq-test", title: "IQ-test", label: "Kognitivt självtest", description: "40 frågor inom fem kognitiva områden. Få ett orienterande IQ-estimat och se din kognitiva profil." },
  { href: "/narcissism-sjalvtest", title: "Narcissism – självtest", label: "Självtest om egna drag", description: "Utforska egna narcissistiska drag och få en personlig profil inom sex områden." },
];

const testGroups = [
  { id: "npf-tests", eyebrow: "NPF och neurodiversitet", title: "ADHD, autism och AuDHD", description: "Utforska återkommande drag och behov kring fokus, vardag, socialt samspel och återhämtning.", tests: neurodiversityTests },
  { id: "relationship-tests", eyebrow: "Relationer och beteenden", title: "Mönster i nära relationer", description: "Få hjälp att sätta ord på det som känns otydligt, svårt eller återkommer i en relation.", tests: relationshipTests },
  { id: "wellbeing-tests", eyebrow: "Psykisk hälsa och självkännedom", title: "Vardag, mående och återhämtning", description: "Självtester om upplevelser, belastning och hur du fungerar i vardagen.", tests: wellbeingTests },
];

const homeGuides: HomeGuide[] = [
  { href: "/audhd", label: "Vad är AuDHD? ADHD och autism samtidigt", group: "NPF och neurodiversitet" },
  ...autismGuides.map((guide) => ({ href: `/${guide.slug}`, label: guide.label, group: "NPF och neurodiversitet" })),
  ...adhdGuides.map((guide) => ({ href: `/${guide.slug}`, label: guide.label, group: "NPF och neurodiversitet" })),
  { href: "/dissociation", label: "Dissociation – vad det är och hur det kan kännas", group: "Psykisk hälsa och välmående" },
  { href: "/prokrastinering", label: "Prokrastinering – varför vi skjuter upp", group: "Psykisk hälsa och välmående" },
  { href: "/exekutiva-funktioner", label: "Exekutiva funktioner – planering, arbetsminne och självreglering", group: "Psykisk hälsa och välmående" },
  { href: "/anknytning", label: "Anknytning i relationer", group: "Relationer och mönster" },
  { href: "/medberoende", label: "Medberoende – överansvar och gränser", group: "Relationer och mönster" },
  { href: "/psykisk-misshandel", label: "Psykisk misshandel — tecken, exempel och hjälp", group: "Psykiskt våld och stöd" },
  { href: "/psykiskt-vald", label: "Psykiskt våld — guide till beteenden, lagen och stöd", group: "Psykiskt våld och stöd" },
  { href: "/tecken-pa-psykopat", label: "Tecken på att du lever med en psykopat", group: "Relationer och mönster" },
  { href: "/gaslighting-relation", label: "Gaslighting i relationer — tecken, exempel och vad du kan göra", group: "Manipulation och påverkan" },
  { href: "/narcissist-i-en-relation", label: "Narcissist i en relation — tecken, beteenden och varningssignaler", group: "Relationer och mönster" },
  { href: "/manipulativ-partner", label: "Hur vet man om någon är manipulativ?", group: "Manipulation och påverkan" },
  { href: "/kontrollerande-relation", label: "Varför känner jag mig kontrollerad i min relation?", group: "Relationer och mönster" },
  { href: "/psykopatiska-drag-relation", label: "Psykopatiska drag i relation — tidiga signaler", group: "Relationer och mönster" },
  { href: "/silent-treatment-relation", label: "Silent treatment i relation — när tystnad blir makt", group: "Manipulation och påverkan" },
  { href: "/love-bombing-relation", label: "Love bombing i relation — när intensitet blir manipulation", group: "Manipulation och påverkan" },
  { href: "/destruktivt-forhallande", label: "Destruktivt förhållande — tecken och mönster", group: "Relationer och mönster" },
  { href: "/skillnad-psykopat-narcissist", label: "Skillnad på psykopat och narcissist", group: "Relationer och mönster" },
  { href: "/psykisk-misshandel-relation", label: "Psykisk misshandel i relation — tecken, mönster och konsekvenser", group: "Psykiskt våld och stöd" },
  { href: "/vald-i-nara-relation", label: "Våld i nära relation — tecken och var du kan få hjälp", group: "Psykiskt våld och stöd" },
  { href: "/jag-ar-radd-att-min-partner-ska-sla-mig", label: "Jag är rädd att min partner ska slå mig — vad kan jag göra?", group: "Psykiskt våld och stöd" },
  { href: "/traumabindning-i-relation", label: "Traumabindning i en relation — tecken och varför det är svårt att lämna", group: "Manipulation och påverkan" },
  { href: "/svartsjuk-partner", label: "Svartsjuk partner — när oro blir kontroll", group: "Relationer och mönster" },
  { href: "/stanna-eller-ga", label: "Stanna eller gå — strukturera dina frågor", group: "Relationer och mönster" },
  { href: "/granser-i-relation", label: "Gränser i relationer", group: "Relationer och mönster" },
  { href: "/stonewalling-relation", label: "Stonewalling och känslomässig nedstängning", group: "Manipulation och påverkan" },
  { href: "/adhd-och-relationer", label: "ADHD och relationer", group: "NPF och neurodiversitet" },
];

export default function Landing() {
  return (
    <main className={styles.home}>
      <header className={styles.header}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Brand className={styles.brand} markClassName={styles.brandMark} />
          <div className="flex items-center gap-3 text-xs text-neutral-600">
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />Anonymt</span>
            <span className="hidden sm:inline">•</span><span className="hidden sm:inline">Ingen registrering</span>
            <span className="hidden sm:inline">•</span><span className="hidden sm:inline">Direkt resultat</span>
          </div>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="home-heading">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>Självtester, guider och verktyg</p>
            <h1 id="home-heading">Förstå dig själv. Förstå dina relationer.</h1>
            <p className={styles.heroIntro}>Självtester och guider som hjälper dig att förstå mönster i vardagen, i nära relationer och i hur du fungerar.</p>

            <nav className={styles.quickStart} aria-label="Hitta rätt test direkt">
              <p>Hitta rätt direkt</p>
              <div>
                <QuickLink href="/adhd-test" label="ADHD-test" />
                <QuickLink href="/autism-test" label="Autismtest" />
                <QuickLink href="/audhd-test" label="AuDHD-test" />
                <HomeScrollLink targetId="relationship-tests" className={styles.quickLink}>
                  Relationstester <span className={styles.quickArrow} aria-hidden="true">→</span>
                </HomeScrollLink>
              </div>
            </nav>
            <HomeScrollLink targetId="relationship-tests" className={styles.allTestsLink}>Utforska fler tester <span aria-hidden="true">→</span></HomeScrollLink>
          </div>

          <div className={styles.heroArt} aria-hidden="true">
            <span className={styles.artLabel}>Relationsvarning / Självreflektion</span>
            <svg viewBox="0 0 400 330" fill="none" focusable="false">
              <ellipse cx="200" cy="290" rx="145" ry="12" fill="#17263D" opacity=".05" />
              <path d="M52 278c0-50 25-75 66-85v-24c-19-10-29-28-29-53 0-31 19-54 46-54 26 0 43 20 43 47l13 22-16 7v21c0 15-13 23-28 23v15c34 12 55 39 55 81Z" fill="#DCE6EF" />
              <path d="M348 278c0-44-24-65-62-77v-25c18-10 28-28 28-52 0-30-18-52-44-52-25 0-42 19-42 46l-13 21 16 7v20c0 15 12 23 27 23v15c-32 12-52 35-52 74Z" fill="#F0E4D1" />
              <path d="M145 85c18 5 26 17 26 34l12 16-15 6v17c0 12-11 17-24 17m112-80c-16 5-22 18-22 31l-12 16 15 6v16c0 11 10 17 23 17" stroke="#526075" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M155 124h6m80 8h6" stroke="#17263D" strokeWidth="2" strokeLinecap="round" />
              <circle cx="200" cy="231" r="43" fill="#FFFDFB" fillOpacity=".85" stroke="#B8B9AA" />
              <path d="m200 250-19-19c-13-13 4-28 19-13 15-15 32 0 19 13Z" stroke="#C69B60" strokeWidth="2" strokeLinejoin="round" />
              <path d="M108 244c22 20 40 18 59 5m126 0c-20 16-41 14-59 0" stroke="#526075" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M200 63v12m-6-6h12" stroke="#C69B60" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p>Ett stöd för att se<br /><em>mönster tydligare.</em></p>
            <span className={styles.artLabel}>Beteenden. Upplevelser. Förståelse.</span>
          </div>
        </div>
      </section>

      <section id="test-directory" aria-labelledby="tests-heading" className={`${styles.section} ${styles.testDirectory} scroll-mt-24`}>
        <p className={styles.eyebrow}>Utforska testerna</p>
        <h2 id="tests-heading">Välj det du vill förstå bättre</h2>
        <p className={styles.sectionIntro}>Alla tester är anonyma och leder direkt till en egen testlandning. Välj ett område som känns relevant för dig just nu.</p>
        <div className={styles.testGroups}>
          {testGroups.map((group) => (
            <section key={group.id} id={group.id} className={styles.testGroup} aria-labelledby={`${group.id}-heading`}>
              <p className={styles.eyebrow}>{group.eyebrow}</p>
              <h3 id={`${group.id}-heading`}>{group.title}</h3>
              <p>{group.description}</p>
              <TestLinks tests={group.tests} />
            </section>
          ))}
        </div>
      </section>

      <section id="bocker" aria-labelledby="books-heading" className={`${styles.section} ${styles.books}`}>
        <div className={styles.booksHeading}>
          <p className={styles.eyebrow}>Böcker och verktyg</p>
          <h2 id="books-heading">För dig som vill använda det du lärt dig</h2>
          <p>Konkreta och lättlästa böcker för vardagen, när du vill förstå mer och pröva verktyg i din egen takt.</p>
        </div>
        <div className={styles.bookGrid}>
          <article className={styles.bookCard}>
            <Image src="/audhd-bok-mockup.png" alt="Världens bästa bok om AuDHD av Elias Voss" width={1312} height={1199} sizes="(max-width: 700px) min(100vw - 5rem, 250px), 280px" className={styles.bookMockup} />
            <p className={styles.eyebrow}>Digital bok · 149 kr</p><h3>Världens bästa bok om AuDHD</h3><p>10 konkreta sätt att få livet att fungera när ADHD och autism drar åt varsitt håll.</p>
            <Link href="/audhd-bok" className={styles.bookLink}>Läs mer om boken <span aria-hidden="true">→</span></Link>
          </article>
          <article className={styles.bookCard}>
            <Image src="/adhd-bok-mockup.png" alt="ADHD Deluxe – bok om ADHD av Elias Voss" width={1448} height={1086} sizes="(max-width: 700px) min(100vw - 5rem, 250px), 280px" className={styles.bookMockup} />
            <p className={styles.eyebrow}>Digital bok</p><h3>ADHD Deluxe</h3><p>En personlig och praktisk bok om ADHD i verkliga livet.</p>
            <span className={styles.comingSoon}>Kommer snart</span>
          </article>
          <article className={styles.bookCard}>
            <Image src="/autism-bok-mockup.png" alt="På mitt sätt – bok om autism av Elias Voss" width={1312} height={1199} sizes="(max-width: 700px) min(100vw - 5rem, 250px), 280px" className={styles.bookMockup} />
            <p className={styles.eyebrow}>Digital bok</p><h3>På mitt sätt</h3><p>En varm och praktisk bok om autism, behov och vardag på egna villkor.</p>
            <span className={styles.comingSoon}>Kommer snart</span>
          </article>
        </div>
      </section>

      <section aria-labelledby="method-heading" className={`${styles.section} ${styles.method}`}>
        <div className={styles.methodPanel}>
          <div className={styles.methodIntro}>
            <p className={styles.eyebrow}>Metodik och kunskapsbas</p>
            <h2 id="method-heading">Mer än bara en poängsumma.</h2>
            <p>Våra tester bygger på etablerad kunskap och strukturerade analysmodeller. Dina svar analyseras inom flera områden och vägs samman för att identifiera personliga mönster, styrkor och svårigheter.</p>
            <Link href="/metodik" className={styles.textLink}>Så bygger vi våra tester <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="guides-heading" className={`${styles.section} ${styles.guides}`}>
        <p className={styles.eyebrow}>Guider och kunskap</p>
        <h2 id="guides-heading">Läs vidare i din egen takt</h2>
        <p className={styles.sectionIntro}>Fördjupa dig i NPF, relationer och psykisk hälsa med guider som ger sammanhang, begrepp och nästa steg.</p>
        <HomeGuideDirectory guides={homeGuides} />
      </section>

      <section className={styles.closing} aria-labelledby="closing-heading">
        <p className={styles.eyebrow}>Ett stöd för självreflektion</p><h2 id="closing-heading">Börja där det känns mest relevant för dig.</h2><p>Välj ett test, läs en guide eller ta ett steg i taget.</p>
        <HomeScrollLink targetId="test-directory" className={styles.primary}>Se alla tester <span aria-hidden="true">→</span></HomeScrollLink>
        <p className={styles.closingMeta}>Anonymt · Ingen registrering · Direkt resultat</p>
      </section>
    </main>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className={styles.quickLink}>{label}<span className={styles.quickArrow} aria-hidden="true">→</span></Link>;
}

function TestLinks({ tests }: { tests: Test[] }) {
  return <ul className={styles.testLinks}>{tests.map((test) => (
    <li key={test.href}><Link href={test.href} className={styles.testLink}>
      <span>{test.label && <span className={styles.testLabel}>{test.label}</span>}<strong>{test.title}</strong><span className={styles.testDescription}>{test.description}</span></span>
      <span className={styles.testArrow} aria-hidden="true">→</span>
    </Link></li>
  ))}</ul>;
}
