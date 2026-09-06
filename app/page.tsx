import Link from "next/link";

const tests = [
  {
    href: "/test",
    title: "Generellt relationstest",
    category: "Bred överblick",
    description:
      "Få en första överblick över varningssignaler och destruktiva mönster i din relation.",
  },
  {
    href: "/psykisk-misshandel-relation/test",
    title: "Psykisk misshandel / psykiskt våld",
    category: "Fördjupningstest",
    description:
      "Undersök återkommande mönster av kontroll, hot, förnedring och psykisk nedbrytning.",
  },
  {
    href: "/narcissist-i-en-relation/test",
    title: "Lever du med en narcissist?",
    category: "Fördjupningstest",
    description:
      "Undersök narcissistiska relationsmönster som manipulation, empatibrist, nedvärdering och starka reaktioner på kritik.",
  },
  {
    href: "/anknytningstest/test",
    title: "Anknytningstest",
    category: "Fördjupningstest",
    description:
      "Utforska hur du reagerar på närhet, osäkerhet och känslomässigt avstånd i romantiska relationer.",
  },
   {
    href: "/medberoendetest/test",
    title: "Medberoendetest",
    category: "Fördjupningstest",
    description:
      "Undersök mönster av självuppoffring, överansvar, svårigheter med gränser och starkt fokus på partnerns behov.",
  },
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
            <span className="hidden sm:inline">5–7 minuter</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">30 frågor</span>
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
              När skuld, förvirring och återkommande obehag blir vardag kan det
              vara svårt att se helheten. Våra anonyma tester hjälper dig att
              reflektera över beteenden och mönster i din relation.
            </p>


          </div>

          <section aria-labelledby="tests-heading" className="order-2 min-w-0 lg:col-span-12">
            <h2 id="tests-heading" className="text-2xl font-semibold tracking-tight">
              Våra relationstester
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base">
              Börja med det generella testet för en bred överblick, eller välj
              ett fördjupningstest som passar det du vill förstå bättre.
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {tests.map((test) => (
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
                      aria-label={`Starta testet: ${test.title}`}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                    >
                      Starta testet
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Right: Minimal, serious “frame” */}
          <aside className="order-3 min-w-0 max-w-3xl lg:col-span-12">
            <div className="rounded-2xl border border-neutral-200/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
              <h2 className="text-sm font-semibold tracking-tight">
                Vad testet är — och inte är
              </h2>

              <div className="mt-4 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Testet är
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      Ett stöd för att se mönster tydligare
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      Byggt på vanliga beteendemarkörer i relationer
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      Anonymt och snabbt att genomföra
                    </li>
                  </ul>
                </div>

                <div className="border-t border-neutral-200/70 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Testet är inte
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
                      En diagnos eller medicinsk bedömning
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
                      Juridisk rådgivning
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
                      Ett facit över vad du ska göra
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-sm font-semibold text-neutral-900">
                    Efter testet
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                    Du får en sammanfattning och en indikation baserad på dina
                    svar. Och en möjlighet till en mer fördjupad analys.
                  </p>
                  <p className="mt-3 text-xs text-neutral-600">
                    Fördjupning:{" "}
                    <span className="font-semibold">
                      Kan fås baserat på dina svar
                    </span>
                  </p>
                </div>
              </div>
            </div>

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

      {/* Read more (SEO, minimal) */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="border-t border-neutral-200/70 pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Läs mer
          </h3>

          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
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
          </ul>
        </div>
      </section>

    </main>
  );
}