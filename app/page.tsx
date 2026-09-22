import type { Metadata } from "next";
import Link from "next/link";
import styles from "./home.module.css";
import adhdGuides from "../content/adhd-guides.json";
import autismGuides from "../content/autism-guides.json";
import HomeGuideDirectory, { type HomeGuide } from "./_components/HomeGuideDirectory";

export const metadata: Metadata = {
  title: "Relationsvarning – tester för destruktiva relationer",
  description:
    "Forskningsbaserade relationstester om kontroll, manipulation, psykiskt våld, gaslighting och destruktiva relationsmönster. Anonymt och utan registrering.",
  alternates: {
    canonical: "https://www.relationsvarning.se/",
  },
};

const selfTests = [
  {
    href: "/autism-test",
    title: "Autismtest för vuxna",
    category: "Självtest för vuxna",
    description: "Utforska socialt samspel, kommunikation, sensorik, förutsägbarhet, intressen och vardagspåverkan med 30 frågor.",
    cta: "Gör självtestet",
  },
  {
    href: "/adhd-test",
    title: "ADHD-test för vuxna",
    category: "Självtest för vuxna",
    description: "Utforska uppmärksamhet, organisation, impulsivitet, inre rastlöshet, tid och vardagspåverkan med 30 frågor.",
    cta: "Gör självtestet",
  },
  {
    href: "/narcissism-sjalvtest",
    title: "Narcissism – självtest",
    category: "Självtest om egna drag",
    description: "Utforska dina egna narcissistiska drag och få en personlig profil inom sex områden.",
    cta: "Gör självtestet",
  },
];

const relationTests = [
  {
    href: "/psykisk-misshandel-relation/test",
    title: "Psykisk misshandel / psykiskt våld",
    category: "Fördjupningstest",
    description:
      "Undersök återkommande mönster av kontroll, hot, förnedring och psykisk nedbrytning.",
  },
  {
    href: "/narcissist-i-en-relation",
    title: "Lever du med en narcissist?",
    category: "Fördjupningstest",
    description:
      "Undersök narcissistiska relationsmönster som manipulation, empatibrist, nedvärdering och starka reaktioner på kritik.",
  },
  {
    href: "/anknytningstest",
    title: "Anknytningstest",
    category: "Fördjupningstest",
    description:
      "Utforska hur du reagerar på närhet, osäkerhet och känslomässigt avstånd i romantiska relationer.",
  },
   {
    href: "/medberoendetest",
    title: "Medberoendetest",
    category: "Fördjupningstest",
    description:
      "Undersök mönster av självuppoffring, överansvar, svårigheter med gränser och starkt fokus på partnerns behov.",
  },
  {
  href: "/gaslightingtest/test",
  title: "Gaslightingtest",
  category: "Fördjupningstest",
  description:
    "Undersök återkommande mönster av förnekande, skuldvändning och ifrågasättande som kan få dig att tvivla på din egen upplevelse.",
},
  {
    href: "/traumabindningtest/test",
    title: "Traumabindningstest",
    category: "Fördjupningstest",
    description:
      "Utforska starka känsloband trots smärta, hopp om förändring och svårigheter att skapa avstånd i en relation.",
  },
];

const homeGuides: HomeGuide[] = [
  ...autismGuides.map((guide) => ({ href: `/${guide.slug}`, label: guide.label, group: "NPF & självtest" })),
  ...adhdGuides.map((guide) => ({ href: `/${guide.slug}`, label: guide.label, group: "NPF & självtest" })),
  { href: "/anknytning", label: "Anknytning i relationer", group: "Relationer & mönster" },
  { href: "/medberoende", label: "Medberoende – överansvar och gränser", group: "Relationer & mönster" },
  { href: "/psykisk-misshandel", label: "Psykisk misshandel — tecken, exempel och hjälp", group: "Psykiskt våld & stöd" },
  { href: "/psykiskt-vald", label: "Psykiskt våld — guide till beteenden, lagen och stöd", group: "Psykiskt våld & stöd" },
  { href: "/tecken-pa-psykopat", label: "Tecken på att du lever med en psykopat", group: "Relationer & mönster" },
  { href: "/gaslighting-relation", label: "Gaslighting i relationer — tecken, exempel och vad du kan göra", group: "Manipulation & påverkan" },
  { href: "/narcissist-i-en-relation", label: "Narcissist i en relation — tecken, beteenden och varningssignaler", group: "Relationer & mönster" },
  { href: "/manipulativ-partner", label: "Hur vet man om någon är manipulativ?", group: "Manipulation & påverkan" },
  { href: "/kontrollerande-relation", label: "Varför känner jag mig kontrollerad i min relation?", group: "Relationer & mönster" },
  { href: "/psykopatiska-drag-relation", label: "Psykopatiska drag i relation — tidiga signaler", group: "Relationer & mönster" },
  { href: "/silent-treatment-relation", label: "Silent treatment i relation — när tystnad blir makt", group: "Manipulation & påverkan" },
  { href: "/love-bombing-relation", label: "Love bombing i relation — när intensitet blir manipulation", group: "Manipulation & påverkan" },
  { href: "/destruktivt-forhallande", label: "Destruktivt förhållande — tecken och mönster", group: "Relationer & mönster" },
  { href: "/skillnad-psykopat-narcissist", label: "Skillnad på psykopat och narcissist", group: "Relationer & mönster" },
  { href: "/psykisk-misshandel-relation", label: "Psykisk misshandel i relation — tecken, mönster och konsekvenser", group: "Psykiskt våld & stöd" },
  { href: "/vald-i-nara-relation", label: "Våld i nära relation — tecken och var du kan få hjälp", group: "Psykiskt våld & stöd" },
  { href: "/jag-ar-radd-att-min-partner-ska-sla-mig", label: "Jag är rädd att min partner ska slå mig — vad kan jag göra?", group: "Psykiskt våld & stöd" },
  { href: "/traumabindning-i-relation", label: "Traumabindning i en relation — tecken och varför det är svårt att lämna", group: "Manipulation & påverkan" },
  { href: "/svartsjuk-partner", label: "Svartsjuk partner — när oro blir kontroll", group: "Relationer & mönster" },
  { href: "/stanna-eller-ga", label: "Stanna eller gå — strukturera dina frågor", group: "Relationer & mönster" },
  { href: "/granser-i-relation", label: "Gränser i relationer", group: "Relationer & mönster" },
  { href: "/stonewalling-relation", label: "Stonewalling och känslomässig nedstängning", group: "Manipulation & påverkan" },
  { href: "/adhd-och-relationer", label: "ADHD och relationer", group: "NPF & självtest" },
];

export default function Landing() {
  return (
    <main className={styles.home}>
      {/* Topbar */}
      <header className={styles.header}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className={styles.brand}>
            Relationsvarning
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              Anonymt
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Ingen registrering</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Direkt resultat</span>
          </div>
        </div>
      </header>

      {/* Home-only editorial hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          {/* Left: Editorial copy */}
          <div className={styles.heroCopy}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Självreflektion • beteenden • mönster
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              När relationen känns fel — men du kan inte sätta fingret på varför.
            </h1>

            <p className="mt-5 text-base leading-relaxed text-neutral-700">
              Om du undrar om ditt förhållande har blivit destruktivt kan det
              generella testet hjälpa dig att sortera återkommande relationsproblem:
              kontroll, manipulation, psykisk misshandel och andra varningssignaler.
              Frågorna har bakgrund i forskning och etablerad kunskap och hjälper
              dig att reflektera över beteendemönster – inte att ställa en diagnos.
            </p>
            <Link href="/test" className={styles.primary}>Gör screeningtestet <span aria-hidden="true">↗</span></Link>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-neutral-600">
              <Link href="/metodik" className="inline-flex min-h-11 items-center underline underline-offset-4">Forskning och metodik</Link>
              <span aria-hidden="true">•</span><span>Anonymt</span>
              <span aria-hidden="true">•</span><span>Ingen registrering</span>
            </p>

          </div>

          <div className={styles.heroArt} aria-hidden="true">
            <span className={styles.artLabel}>Relationsvarning / Självreflektion</span>
            <svg viewBox="0 0 400 330" fill="none">
              <ellipse cx="206" cy="292" rx="135" ry="13" fill="#24312B" opacity=".05" />
              <path d="M69 268V160C69 88 110 47 169 47s96 42 96 113v108Z" fill="#D7E0D6" />
              <path d="M177 281V188c0-60 34-99 86-99s86 39 86 99v93Z" fill="#E9D1CF" />
              <path d="M132 268V163c0-46 19-69 43-69 35 0 55 34 55 71v60c0 28 10 43 29 43 24 0 36-28 36-58 0-33-13-53-31-53-19 0-34 21-34 55" stroke="#68796A" strokeWidth="2" strokeLinecap="round" />
              <path d="M281 61v26m-13-13h26" stroke="#9D5663" strokeWidth="1.5" />
              <circle cx="102" cy="214" r="7" fill="#FFFDFB" />
            </svg>
            <p>Ett stöd för att se<br /><em>mönster tydligare.</em></p>
            <span className={styles.artLabel}>Beteenden. Upplevelser. Förståelse.</span>
          </div>
          <div className={styles.trust}>
            <p><span aria-hidden="true">01</span> Strukturerade frågor</p>
            <p><span aria-hidden="true">02</span> Direkt resultat</p>
            <p><span aria-hidden="true">03</span> Ingen registrering</p>
          </div>
          <section className={styles.feature}>
            <div className={styles.featureInner}>
              <p className={styles.eyebrow}>En första överblick</p><h2 className="text-2xl font-semibold tracking-tight">Vet du inte riktigt vad som är fel?</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-neutral-700">Om något känns fel i relationen men du har svårt att sätta fingret på vad, börja med screeningtestet. Det går igenom flera typer av destruktiva beteenden och hjälper dig att identifiera vilka områden som kan vara relevanta att titta närmare på.</p>
              <Link href="/test" className={styles.primary}>Gör screeningtestet</Link>
            </div>
          </section>

          {/* Short safety note after the main test */}
          <aside className={styles.safety}>
            <p className="text-xs leading-relaxed text-neutral-500">
              Om du känner dig akut hotad eller i fara, ring 112 eller kontakta någon du litar på.
            </p>
          </aside>
        </div>
      </section>

      <section aria-labelledby="tests-heading" className={styles.section}>
        <h2 id="tests-heading" className="text-2xl font-semibold tracking-tight">Relationstester</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-neutral-700">
          Vill du undersöka ett specifikt mönster i relationen? Välj ett fördjupat test nedan.
        </p>
        <TestCards items={relationTests} />
      </section>

      <section aria-labelledby="self-tests-heading" className={styles.section}>
        <div className="border-t border-neutral-200/70 pt-10 sm:pt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Fokus på dig själv
          </p>
          <h2 id="self-tests-heading" className="mt-3 text-2xl font-semibold tracking-tight">Självtester</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-neutral-700">
            Självtesterna handlar om dina egna drag, upplevelser och mönster,
            snarare än om en partner eller relation.
          </p>
          <TestCards items={selfTests} />
        </div>
      </section>

      <section aria-labelledby="about-tests-heading" className={`${styles.section} ${styles.about}`}>
        <div className="max-w-3xl">
            <div className="rounded-2xl border border-neutral-200/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
              <h2 id="about-tests-heading" className="text-sm font-semibold tracking-tight">
                Vad våra tester är — och inte är
              </h2>

              <div className="mt-4 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Testerna är
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      Ett stöd för att se mönster tydligare
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      Byggda kring strukturerade frågor om beteenden, upplevelser eller drag
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      Anonyma och enkla att genomföra
                    </li>
                  </ul>
                </div>

                <div className="border-t border-neutral-200/70 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Testerna är inte
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
                      Diagnoser eller medicinska bedömningar
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
                      Juridisk rådgivning
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
                      Ett facit över vad du måste göra
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-sm font-semibold text-neutral-900">
                    Efter testet
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                    Du får en sammanställning baserad på dina svar. Beroende på
                    test kan du också få en fördjupad analys av de mönster
                    som framträder.
                  </p>
                  <p className="mt-3 text-xs text-neutral-600">
                    Fördjupning:{" "}
                    <span className="font-semibold">
                      Kan finnas beroende på test och dina svar
                    </span>
                  </p>
                </div>
              </div>
            </div>

        </div>
      </section>

      {/* Read more (SEO, minimal) */}
      <section className={styles.section}>
        <div className="border-t border-neutral-200/70 pt-6">
          <p className={styles.eyebrow}>Kunskap & perspektiv</p><h2>Läs mer</h2>

          <div className="text-sm text-neutral-700">
            <HomeGuideDirectory guides={homeGuides} />
          </div>

        </div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-heading">
        <p className={styles.eyebrow}>Ett stöd för självreflektion</p>
        <h2 id="closing-heading">Vill du förstå dina<br />relationsmönster bättre?</h2>
        <Link href="/test" className={styles.primary}>Gör screeningtestet <span aria-hidden="true">↗</span></Link>
        <p className={styles.closingMeta}>Anonymt · Ingen registrering</p>
      </section>
    </main>
  );
}

function TestCards({
  items,
}: {
  items: { href: string; title: string; category: string; description: string; cta?: string }[];
}) {
  return (
    <ul className={styles.cards}>
      {items.map((test, index) => (
        <li key={test.href} className={styles.card}>
          <svg className={styles.symbol} viewBox="0 0 48 48" fill="none" aria-hidden="true">
            {index % 3 === 0 ? <><path d="M13 33V22a11 11 0 0 1 22 0v11" /><path d="M20 33V23a4 4 0 0 1 8 0v10" /></> : index % 3 === 1 ? <><circle cx="19" cy="24" r="10" /><circle cx="29" cy="24" r="10" /></> : <path d="M24 37V14m0 15c-10 0-14-6-14-14 9 0 14 5 14 14Zm0-5c9 0 13-6 13-13-8 0-13 5-13 13Z" />}
          </svg>
          <p className={styles.eyebrow}>
            {test.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-neutral-900">
            {test.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            {test.description}
          </p>
          <div className="mt-auto pt-4">
            <Link
              href={test.href}
              aria-label={`${test.cta ?? "Starta testet"}: ${test.title}`}
              className={styles.cardLink}
            >
              {test.cta ?? "Starta testet"}<span aria-hidden="true">↗</span>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
