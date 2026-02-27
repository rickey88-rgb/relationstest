import Link from "next/link";

export default function PsykiskMisshandelRelationPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <section className="mx-auto max-w-3xl px-6 py-14">
        
        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight mb-6">
          Psykisk misshandel i relation – tecken, mönster och konsekvenser
        </h1>

        {/* Intro */}
        <p className="mb-5 leading-relaxed text-neutral-700">
          Psykisk misshandel är inte alltid högljudd. Den syns sällan utåt och lämnar inga blåmärken.
          Men den kan gradvis bryta ner självkänsla, verklighetsuppfattning och trygghet.
        </p>

        <p className="mb-10 leading-relaxed text-neutral-700">
          Många beskriver känslan så här: <em>“Jag vet att något är fel – men jag kan inte riktigt sätta fingret på vad.”</em>
        </p>

        {/* H2 */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">
          Vad är psykisk misshandel?
        </h2>

        <p className="mb-5 leading-relaxed text-neutral-700">
          Psykisk misshandel handlar om ett <strong>upprepat mönster</strong> av beteenden
          som syftar till att kontrollera, manipulera eller bryta ner en annan person emotionellt.
        </p>

        <p className="mb-8 leading-relaxed text-neutral-700">
          Det är skillnad på en konflikt och systematisk nedbrytning.
          I en sund relation finns respekt och ansvar. I en destruktiv relation
          förskjuts maktbalansen över tid.
        </p>

        {/* H2 */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">
          Vanliga tecken på psykisk misshandel
        </h2>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Förminskning och nedvärdering
        </h3>

        <p className="mb-6 leading-relaxed text-neutral-700">
          Kommentarer som “du är för känslig” eller “du överdriver alltid”
          kan verka små – men upprepade över tid påverkar de hur du ser på dig själv.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Gaslighting
        </h3>

        <p className="mb-6 leading-relaxed text-neutral-700">
          När din upplevelse förnekas: “Det där har jag aldrig sagt.”
          “Du minns fel.” Till slut börjar du tvivla på din egen verklighetsuppfattning.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Skuld- och ansvarsförskjutning
        </h3>

        <p className="mb-6 leading-relaxed text-neutral-700">
          I konflikter hamnar ansvaret nästan alltid hos dig.
          Det är vanligt i relationer med en{" "}
          <Link href="/manipulativ-partner" className="underline">
            manipulativ partner
          </Link>.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Kontroll och begränsningar
        </h3>

        <p className="mb-8 leading-relaxed text-neutral-700">
          Om du känner dig övervakad eller begränsad kan det vara tecken på en{" "}
          <Link href="/kontrollerande-relation" className="underline">
            kontrollerande relation
          </Link>.
        </p>

        {/* H2 */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">
          Hur påverkas du över tid?
        </h2>

        <p className="mb-5 leading-relaxed text-neutral-700">
          Psykisk nedbrytning sker gradvis. Många märker först i efterhand hur
          mycket deras självkänsla har förändrats.
        </p>

        <ul className="list-disc pl-6 mb-10 text-neutral-700 space-y-2">
          <li>Ökat självtvivel</li>
          <li>Emotionell utmattning</li>
          <li>Rädsla för att uttrycka egna behov</li>
          <li>Förändrad självbild</li>
        </ul>

        {/* H2 */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">
          Varför är det svårt att lämna?
        </h2>

        <p className="mb-8 leading-relaxed text-neutral-700">
          Normalisering, hopp om förändring och rädsla för reaktioner gör att
          många stannar längre än de egentligen vill.
        </p>

        {/* CTA */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">
          Om du känner igen mönstren
        </h2>

        <p className="mb-6 leading-relaxed text-neutral-700">
          Det kan vara värdefullt att få en strukturerad genomgång av relationens
          beteendemönster.
        </p>

        <Link
          href="/test"
          className="inline-block rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Påbörja testet
        </Link>

      </section>
    </main>
  );
}