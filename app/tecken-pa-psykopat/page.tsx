import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tecken på att du lever med en psykopat | Relationsvarning",
  description:
    "Vanliga varningssignaler på manipulativa och kontrollerande mönster i en nära relation. Sakligt, tryggt och utan diagnoser. Gör testet anonymt.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Topbar */}
      <header className="border-b border-neutral-200/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Relationsvarning
          </Link>
          <div className="hidden sm:flex items-center gap-3 text-xs text-neutral-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              Resurs
            </span>
            <span>•</span>
            <span>Varningssignaler</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Main */}
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Relationer • mönster • beteenden
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Tecken på att du lever med en psykopat
            </h1>

            <p className="mt-5 text-base leading-relaxed text-neutral-700">
              Många som söker på fraser som{" "}
              <span className="font-medium text-neutral-900">
                “lever jag med en psykopat?”
              </span>{" "}
              eller{" "}
              <span className="font-medium text-neutral-900">
                “tecken på psykopat i relation”
              </span>{" "}
              gör det av en enkel anledning: något skaver. Inte alltid ett stort
              svek – utan små återkommande situationer som lämnar dig förvirrad,
              spänd eller osäker på dig själv.
            </p>

            <p className="mt-4 text-base leading-relaxed text-neutral-700">
              Den här sidan är inte en diagnos. Den hjälper dig att känna igen{" "}
              <span className="font-medium text-neutral-900">
                typiska mönster av manipulation, kontroll och emotionell press
              </span>{" "}
              som kan förekomma i destruktiva relationer. Ju fler punkter som
              stämmer och ju mer konsekvent det varit över tid, desto större
              anledning att ta din magkänsla på allvar.
            </p>

            {/* Quick CTA */}
            <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-neutral-200/70 bg-neutral-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  Vill du få en strukturerad indikation?
                </p>
                <p className="mt-1 text-sm text-neutral-700">
                  Gör testet anonymt och svara utifrån den andra personens beteenden.
                </p>
              </div>
              <Link
                href="/test"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                Påbörja testet
              </Link>
            </div>

            {/* Signs */}
            <h2 className="mt-10 text-xl font-semibold tracking-tight">
              9 vanliga varningssignaler i en relation
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              Alla relationer har konflikter. Skillnaden ligger ofta i{" "}
              <span className="font-medium text-neutral-900">mönstret</span>:
              upprepning, obalans och hur du mår efteråt.
            </p>

            <div className="mt-6 space-y-7">
              <section>
                <h3 className="text-base font-semibold tracking-tight">
                  1) Du börjar tvivla på din egen upplevelse
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Du säger vad som hände, men får höra att du överdriver, missförstår
                  eller “hittar på”. Till slut blir du mer upptagen av att formulera
                  dig perfekt än av att lita på din magkänsla. Det här kan likna{" "}
                  <span className="font-medium text-neutral-900">gaslighting</span>{" "}
                  (att få någon att ifrågasätta sitt omdöme).
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold tracking-tight">
                  2) Regeln är alltid deras – konsekvenserna alltid dina
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  De kan göra saker som du inte får göra. De kan höja rösten, men
                  du får inte “bli känslig”. De kan dra sig undan, men du förväntas
                  alltid reparera. Obalansen blir en normalitet.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold tracking-tight">
                  3) Charm utåt, kyla hemma
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Utåt kan personen vara social, trevlig och övertygande. Men i
                  det privata finns en annan sida: kritik, kyla, passiv aggression
                  eller ett “straffande” tystnadsläge när du inte gör som de vill.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold tracking-tight">
                  4) Du går på tå – för att undvika reaktioner
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Du börjar anpassa ord, ton och timing. Inte för att relationer
                  kräver hänsyn, utan för att du försöker undvika explosioner,
                  avstängning eller att “det blir en grej”.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold tracking-tight">
                  5) Små hot, antydningar eller skuld som styr dig
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Det kan vara subtilt: “Jag vet inte vad jag gör om du lämnar…”,
                  “Du förstör allt”, “Ingen annan kommer stå ut med dig”.
                  Kontrollen sker inte alltid med skrik – ibland med skuld, oro
                  och antydningar.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold tracking-tight">
                  6) De tar aldrig ansvar – men är snabba att peka på dina fel
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  När något går snett blir det din personlighet, ditt humör, din
                  tajming. När något går bra är det deras förtjänst. Enstaka
                  konflikter kan alla ha – men här känns det som att skuld alltid
                  landar på samma ställe.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold tracking-tight">
                  7) Du isoleras gradvis – ofta utan att det märks
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Du träffar vänner mindre. Du undviker att berätta saker “för att
                  slippa frågor”. Ibland kommer det som kritik mot din familj,
                  dina vänner eller ditt omdöme. Isolering kan vara en bieffekt av
                  att du hela tiden hanterar relationen – eller ett medvetet mönster.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold tracking-tight">
                  8) Intensiv början – sedan förskjutna gränser
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  I början kan allt vara snabbt, nära, intensivt. Sen kommer
                  gränsförskjutningar: vad som var okej blir plötsligt fel, du
                  får mer ansvar, mer skuld, mer krav. Och du jagar den där tidiga
                  känslan av värme.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold tracking-tight">
                  9) Du känner dig mindre som dig själv
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Det kanske tydligaste tecknet är effekten: du blir mindre
                  spontan, mer spänd, mer osäker. Du kan känna skam, rädsla eller
                  ett konstant behov av att “ställa allt till rätta”.
                </p>
              </section>
            </div>

            {/* What to do */}
            <h2 className="mt-10 text-xl font-semibold tracking-tight">
              Om du känner igen flera punkter
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              Det betyder inte automatiskt att personen är “X eller Y”. Men det kan
              betyda att relationen innehåller{" "}
              <span className="font-medium text-neutral-900">
                osunda makt- och kontrollmönster
              </span>
              . Ett bra nästa steg är att få en mer strukturerad överblick:
              hur ofta saker händer, hur det påverkar dig, och vilka situationer som
              triggar det mest.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/test"
                className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 sm:w-auto"
              >
                Gör testet anonymt
              </Link>
              <p className="text-xs text-neutral-600">
                5–7 minuter • Ingen registrering • Fokus på beteenden, inte diagnoser
              </p>
            </div>

            {/* Related */}
            <div className="mt-10 border-t border-neutral-200/70 pt-6">
              <h2 className="text-sm font-semibold tracking-tight">
                Relaterade sidor
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
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
                    href="/skillnad-psykopat-narcissist"
                    className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                  >
                    Skillnad på psykopat och narcissist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <p className="mt-8 text-xs leading-relaxed text-neutral-500">
              Den här texten är ett reflektionsstöd och allmän information. Den
              ersätter inte professionell hjälp, medicinsk bedömning eller juridisk
              rådgivning. Om du känner dig hotad eller i akut fara: ring 112.
            </p>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-neutral-200/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
              <h2 className="text-sm font-semibold tracking-tight">
                Snabb check
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                Om du svarar “ja” på flera av dessa kan det vara värt att få en
                mer strukturerad bild.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Du känner dig ofta spänd eller vaksam hemma
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Du “förklarar bort” saker för att få vardagen att fungera
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Konflikter slutar sällan med förståelse – bara med tystnad
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Du tar mer ansvar ju mer fel det känns
                </li>
              </ul>

              <div className="mt-6 rounded-xl bg-neutral-50 p-4">
                <p className="text-sm font-semibold text-neutral-900">
                  Gör testet
                </p>
                <p className="mt-1 text-sm text-neutral-700">
                  Få en indikation baserad på dina svar – anonymt.
                </p>
                <Link
                  href="/test"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
                >
                  Påbörja testet
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200/70 p-6">
              <h2 className="text-sm font-semibold tracking-tight">
                Viktigt att komma ihåg
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                En relation kan vara skadlig utan att personen passar in i någon
                etikett. Det du ska lyssna på är mönster, konsekvens och hur du
                påverkas över tid.
              </p>
              <p className="mt-3 text-xs text-neutral-500">
                Om du är osäker kan det hjälpa att skriva ner konkreta situationer
                och hur de slutade.
              </p>
            </div>
          </aside>
        </div>
      </article>

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