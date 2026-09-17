import type { Metadata } from "next";
import Link from "next/link";
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
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Topbar */}
      <header className="border-b border-neutral-200/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold tracking-tight">
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

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Editorial copy */}
          <div className="min-w-0 max-w-3xl lg:col-span-12">
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
            <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-neutral-600">
              <Link href="/metodik" className="inline-flex min-h-11 items-center underline underline-offset-4">Forskning och metodik</Link>
              <span aria-hidden="true">•</span><span>Anonymt</span>
              <span aria-hidden="true">•</span><span>Ingen registrering</span>
            </p>

          </div>

          <section className="order-2 min-w-0 lg:col-span-12">
            <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold tracking-tight">Vet du inte riktigt vad som är fel?</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-neutral-700">Om något känns fel i relationen men du har svårt att sätta fingret på vad, börja med screeningtestet. Det går igenom flera typer av destruktiva beteenden och hjälper dig att identifiera vilka områden som kan vara relevanta att titta närmare på.</p>
              <Link href="/test" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#7A1F1F] px-5 py-3 text-center font-semibold text-white hover:bg-[#5C1717] focus-visible:bg-[#5C1717] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5C1717] sm:w-auto">Gör screeningtestet</Link>
            </div>
          </section>

          {/* Safety note and site context beside the main test */}
          <aside className="order-3 min-w-0 max-w-3xl lg:col-span-12">
            <p className="mt-4 text-xs leading-relaxed text-neutral-500">
              Om du känner dig akut hotad eller i fara: ring 112 eller kontakta
              någon du litar på. Det här testet är ett reflektionsstöd.
            </p>
            <div className="mt-8 border-t border-neutral-200/70 pt-6">
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold text-neutral-900">Ton</dt>
                  <dd className="mt-1 text-sm text-neutral-700">
                    Saklig, trygg, vuxen
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-neutral-900">
                    Fokus
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-700">
                    Beteenden & mönster
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-neutral-900">
                    Integritet
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-700">
                    Ingen registrering krävs
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="tests-heading" className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <h2 id="tests-heading" className="text-2xl font-semibold tracking-tight">Relationstester</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-neutral-700">
          Vill du undersöka ett mer specifikt mönster i relationen? Välj ett av
          våra fördjupade tester. Om du är osäker på var du ska börja finns det
          generella screeningtestet ovan.
        </p>
        <TestCards items={relationTests} />
      </section>

      <section aria-labelledby="self-tests-heading" className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
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

      <section aria-labelledby="about-tests-heading" className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
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
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="border-t border-neutral-200/70 pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Läs mer
          </h3>

          <div className="text-sm text-neutral-700">
            <HomeGuideDirectory guides={homeGuides} />
          </div>
          {/*
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {autismGuides.map((guide) => <li key={guide.slug}><Link href={`/${guide.slug}`} className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700">{guide.label}</Link></li>)}
            {adhdGuides.map((guide) => <li key={guide.slug}><Link href={`/${guide.slug}`} className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700">{guide.label}</Link></li>)}
            <li>
              <Link href="/anknytning" className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700">
                Anknytning i relationer
              </Link>
            </li>
            <li>
              <Link href="/medberoende" className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700">
                Medberoende – överansvar och gränser
              </Link>
            </li>
            <li>
              <Link
                href="/psykisk-misshandel"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Psykisk misshandel — tecken, exempel och hjälp
              </Link>
            </li>
            <li>
              <Link
                href="/psykiskt-vald"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Psykiskt våld — guide till beteenden, lagen och stöd
              </Link>
            </li>
            <li>
              <Link
                href="/tecken-pa-psykopat"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Tecken på att du lever med en psykopat
              </Link>
            </li>

            <li>
              <Link
                href="/gaslighting-relation"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Gaslighting i relationer — tecken, exempel och vad du kan göra
              </Link>
            </li>

            <li>
  <Link
    href="/narcissist-i-en-relation"
    className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
  >
    Narcissist i en relation — tecken, beteenden och varningssignaler
  </Link>
</li>

            <li>
              <Link
                href="/manipulativ-partner"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Hur vet man om någon är manipulativ?
              </Link>
            </li>

            <li>
              <Link
                href="/kontrollerande-relation"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Varför känner jag mig kontrollerad i min relation?
              </Link>
            </li>

            <li>
              <Link
                href="/psykopatiska-drag-relation"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Psykopatiska drag i relation — tidiga signaler
              </Link>
            </li>
            <li>
  <Link
    href="/silent-treatment-relation"
    className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
  >
    Silent treatment i relation — när tystnad blir makt
  </Link>
</li>

<li>
  <Link
    href="/love-bombing-relation"
    className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
  >
    Love bombing i relation — när intensitet blir manipulation
  </Link>
</li>

            <li>
              <Link
                href="/skillnad-psykopat-narcissist"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Skillnad på psykopat och narcissist
              </Link>
            </li>

            <li>
              <Link
                href="/psykisk-misshandel-relation"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Psykisk misshandel i relation — tecken, mönster och konsekvenser
              </Link>
            </li>

            <li>
              <Link
                href="/vald-i-nara-relation"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Våld i nära relation — tecken och var du kan få hjälp
              </Link>
            </li>

            <li>
              <Link
                href="/jag-ar-radd-att-min-partner-ska-sla-mig"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Jag är rädd att min partner ska slå mig — vad kan jag göra?
              </Link>
            </li>

            <li>
              <Link
                href="/traumabindning-i-relation"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Traumabindning i en relation — tecken, varför det händer och
                varför det är så svårt att lämna
              </Link>
            </li>
          </ul> */}
        </div>
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
    <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
      {items.map((test) => (
        <li key={test.href} className="flex min-w-0 flex-col rounded-2xl border border-neutral-200/70 bg-neutral-50 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
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
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              {test.cta ?? "Starta testet"}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
