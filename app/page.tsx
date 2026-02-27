import Link from "next/link";

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
      <section className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Editorial copy */}
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Självreflektion • beteenden • mönster
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              När relationen känns fel — men du kan inte sätta fingret på varför.
            </h1>

            <p className="mt-5 text-base leading-relaxed text-neutral-700">
              Det här testet hjälper dig att få klarhet i{" "}
              <span className="font-medium text-neutral-900">
                kontrollerande, manipulativa och emotionellt pressande beteenden
              </span>{" "}
              i en nära relation. Du svarar utifrån den andra personens beteenden
              i vardagen — inte diagnoser och etiketter.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/test"
                className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 sm:w-auto"
              >
                Påbörja testet
              </Link>

              <div className="text-xs text-neutral-600">
                Efter testet får du en indikation. Och kanske svar du länge sökt.
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-200/70 pt-6">
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold text-neutral-900">
                    Ton
                  </dt>
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
          </div>

          {/* Right: Minimal, serious “frame” */}
          <aside className="lg:col-span-5">
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
                href="/tecken-pa-psykopat"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
              >
                Tecken på att du lever med en psykopat
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
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Relationsvarning</span>
          <span>Integritet först • Inga konton • Inga spårningsfält</span>
        </div>
      </footer>
    </main>
  );
}