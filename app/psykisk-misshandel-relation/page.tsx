import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Psykisk misshandel – test, tecken & lagen om psykiskt våld",
  description:
    "Misstänker du psykisk misshandel i din relation? Läs om vanliga tecken, vad lagen om psykiskt våld innebär och gör ett anonymt test.",
  alternates: {
    canonical: "/psykisk-misshandel-relation",
  },
};

export default function PsykiskMisshandelRelationPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-3xl px-6 py-14">

        {/* H1 */}
        <h1 className="mb-6 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Psykisk misshandel i relation – tecken, mönster och konsekvenser
        </h1>

        {/* Intro */}
        <p className="mb-5 leading-relaxed text-neutral-700">
          Psykisk misshandel är inte alltid högljudd. Den syns sällan utåt och
          lämnar inga blåmärken. Men den kan gradvis bryta ner självkänsla,
          verklighetsuppfattning och trygghet.
        </p>

        <p className="mb-8 leading-relaxed text-neutral-700">
          Många beskriver känslan så här:{" "}
          <em>
            “Jag vet att något är fel – men jag kan inte riktigt sätta fingret
            på vad.”
          </em>
        </p>

        {/* Testbox */}
        <div className="mb-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Anonymt test
          </p>

          <h2 className="mb-3 text-2xl font-semibold">
            Utsätts du för psykisk misshandel?
          </h2>

          <p className="mb-6 leading-relaxed text-neutral-700">
            Testet hjälper dig att identifiera återkommande mönster som
            kontroll, nedvärdering, hot, övervakning och andra former av
            psykiskt destruktivt beteende.
          </p>

          <Link
            href="/psykisk-misshandel-relation/test"
            className="inline-block rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Gör testet anonymt
          </Link>
        </div>

        {/* Befintligt innehåll */}
        <h2 className="mt-12 mb-4 text-2xl font-semibold">
          Vad är psykisk misshandel?
        </h2>

        <p className="mb-5 leading-relaxed text-neutral-700">
          Psykisk misshandel handlar om ett <strong>upprepat mönster</strong>{" "}
          av beteenden som syftar till att kontrollera, manipulera eller bryta
          ner en annan person emotionellt.
        </p>

        <p className="mb-8 leading-relaxed text-neutral-700">
          Det är skillnad på en konflikt och systematisk nedbrytning. I en sund
          relation finns respekt och ansvar. I en destruktiv relation förskjuts
          maktbalansen över tid.
        </p>

        {/* Lagsektion */}
        <div className="my-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Ny lag från 1 juli 2026
          </p>

          <h2 className="mb-4 text-2xl font-semibold">
            Psykiskt våld är ett särskilt brott
          </h2>

          <p className="mb-4 leading-relaxed text-neutral-700">
            Sedan den 1 juli 2026 finns brottet <strong>psykiskt våld</strong>{" "}
            i 4 kap. 7 b § brottsbalken.
          </p>

          <p className="mb-4 leading-relaxed text-neutral-700">
            Bestämmelsen omfattar upprepade kränkningar i form av exempelvis
            beskyllningar, nedsättande uttalanden, förödmjukande beteenden,
            otillbörliga hot, otillbörligt tvång eller otillbörlig övervakning.
          </p>

          <p className="mb-4 leading-relaxed text-neutral-700">
            För straffansvar krävs att kränkningarna sammantaget varit ägnade
            att allvarligt skada personens självkänsla. Även varaktig
            otillbörlig övervakning kan omfattas av bestämmelsen.
          </p>

          <p className="leading-relaxed text-neutral-700">
            Det betyder inte att varje konflikt, hårt ord eller osunt beteende
            automatiskt är ett brott. Bedömningen handlar bland annat om
            beteendets karaktär, upprepning och helheten.
          </p>
        </div>

        {/* SEO / konkret laginnehåll */}
        <h2 className="mt-12 mb-4 text-2xl font-semibold">
          Vad räknas som psykiskt våld?
        </h2>

        <p className="mb-5 leading-relaxed text-neutral-700">
          Psykiskt våld kan se väldigt olika ut. Det är ofta inte en enskild
          händelse som gör situationen destruktiv, utan ett återkommande mönster
          där den ena personen gradvis får mindre trygghet och handlingsutrymme.
        </p>

        <ul className="mb-8 list-disc space-y-3 pl-6 text-neutral-700">
          <li>Återkommande förolämpningar och nedvärderande kommentarer</li>
          <li>Beskyllningar och ständig skuldbeläggning</li>
          <li>Förödmjukelser inför andra eller i hemmet</li>
          <li>Hot som används för att styra ditt beteende</li>
          <li>Tvång eller krav som begränsar dina egna val</li>
          <li>Kontroll av vem du träffar eller pratar med</li>
          <li>Övervakning av mobil, konton, plats eller kommunikation</li>
        </ul>

        <p className="mb-8 leading-relaxed text-neutral-700">
          Kontroll kan också ske digitalt eller ekonomiskt, exempelvis genom
          att en partner försöker styra tillgången till pengar, telefon,
          konton eller kommunikation.
        </p>

        {/* Befintliga tecken */}
        <h2 className="mt-12 mb-4 text-2xl font-semibold">
          Vanliga tecken på psykisk misshandel
        </h2>

        <h3 className="mt-8 mb-3 text-xl font-semibold">
          Förminskning och nedvärdering
        </h3>

        <p className="mb-6 leading-relaxed text-neutral-700">
          Kommentarer som “du är för känslig” eller “du överdriver alltid” kan
          verka små – men upprepade över tid påverkar de hur du ser på dig
          själv.
        </p>

        <h3 className="mt-8 mb-3 text-xl font-semibold">
          Gaslighting
        </h3>

        <p className="mb-6 leading-relaxed text-neutral-700">
          När din upplevelse förnekas: “Det där har jag aldrig sagt.” “Du minns
          fel.” Till slut börjar du tvivla på din egen verklighetsuppfattning.
        </p>

        <p className="mb-6 leading-relaxed text-neutral-700">
          Läs mer om{" "}
          <Link href="/gaslighting-relation" className="underline">
            gaslighting i en relation
          </Link>
          .
        </p>

        <h3 className="mt-8 mb-3 text-xl font-semibold">
          Skuld- och ansvarsförskjutning
        </h3>

        <p className="mb-6 leading-relaxed text-neutral-700">
          I konflikter hamnar ansvaret nästan alltid hos dig. Det är vanligt i
          relationer med en{" "}
          <Link href="/manipulativ-partner" className="underline">
            manipulativ partner
          </Link>
          .
        </p>

        <h3 className="mt-8 mb-3 text-xl font-semibold">
          Kontroll och begränsningar
        </h3>

        <p className="mb-8 leading-relaxed text-neutral-700">
          Om du känner dig övervakad eller begränsad kan det vara tecken på en{" "}
          <Link href="/kontrollerande-relation" className="underline">
            kontrollerande relation
          </Link>
          .
        </p>

        {/* Konsekvenser */}
        <h2 className="mt-12 mb-4 text-2xl font-semibold">
          Hur påverkas du över tid?
        </h2>

        <p className="mb-5 leading-relaxed text-neutral-700">
          Psykisk nedbrytning sker gradvis. Många märker först i efterhand hur
          mycket deras självkänsla har förändrats.
        </p>

        <ul className="mb-10 list-disc space-y-2 pl-6 text-neutral-700">
          <li>Ökat självtvivel</li>
          <li>Emotionell utmattning</li>
          <li>Rädsla för att uttrycka egna behov</li>
          <li>Förändrad självbild</li>
        </ul>

        {/* Varför svårt att lämna */}
        <h2 className="mt-12 mb-4 text-2xl font-semibold">
          Varför är det svårt att lämna?
        </h2>

        <p className="mb-8 leading-relaxed text-neutral-700">
          Normalisering, hopp om förändring och rädsla för reaktioner gör att
          många stannar längre än de egentligen vill.
        </p>

        {/* FAQ */}
        <div className="mt-14 border-t border-neutral-200 pt-10">
          <h2 className="mb-8 text-2xl font-semibold">
            Vanliga frågor om psykisk misshandel och psykiskt våld
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Är psykisk misshandel olagligt?
              </h3>
              <p className="leading-relaxed text-neutral-700">
                Sedan den 1 juli 2026 finns en särskild straffbestämmelse om
                psykiskt våld. Alla osunda eller sårande beteenden är inte
                automatiskt brottsliga, men upprepade allvarliga kränkningar kan
                omfattas av lagen.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Måste det förekomma fysiskt våld?
              </h3>
              <p className="leading-relaxed text-neutral-700">
                Nej. Psykiskt våld är en egen form av våld och kan förekomma
                även om personen aldrig har slagit eller fysiskt skadat dig.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Kan kontroll av mobilen räknas som psykiskt våld?
              </h3>
              <p className="leading-relaxed text-neutral-700">
                Otillbörlig övervakning omfattas av den nya bestämmelsen.
                Bedömningen beror på hur övervakningen sker, hur omfattande den
                är och situationen som helhet.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Kan ett test avgöra om ett brott har begåtts?
              </h3>
              <p className="leading-relaxed text-neutral-700">
                Nej. Ett test kan hjälpa dig att identifiera mönster och
                beteenden i relationen, men det kan inte göra en juridisk
                bedömning av om någon har begått ett brott.
              </p>
            </div>
          </div>
        </div>

        {/* Slut-CTA */}
        <div className="mt-14 rounded-2xl bg-neutral-900 p-6 text-white sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Känner du igen flera av de här mönstren?
          </h2>

          <p className="mb-6 leading-relaxed text-neutral-300">
            Gör en strukturerad genomgång av relationen och se vilka typer av
            psykiskt destruktiva beteenden som återkommer.
          </p>

          <Link
            href="/psykisk-misshandel-relation/test"
            className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
          >
            Starta testet
          </Link>
        </div>

      </section>
    </main>
  );
}