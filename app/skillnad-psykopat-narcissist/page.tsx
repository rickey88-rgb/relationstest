import Link from "next/link";

export const metadata = {
  title: "Skillnad mellan psykopat och narcissist – begrepp, överlapp och missförstånd",
  description:
    "Vad är skillnaden mellan psykopat och narcissist? Saklig genomgång av begreppen, överlapp, beteendemönster och hur de kan visa sig i relationer.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="space-y-6">
        <h1 className="text-3xl font-semibold">
          Skillnad mellan psykopat och narcissist: begrepp, överlapp och vanliga missförstånd
        </h1>

        <p>
          Många använder orden “psykopat” och “narcissist” som om de betyder samma sak.
          I vardagligt språk kan de ibland överlappa, men det finns viktiga skillnader
          i hur begreppen brukar beskrivas – särskilt när man talar om beteendemönster
          i relationer.
        </p>

        <p>
          Den här sidan fokuserar på mönster och dynamik, inte på att ställa diagnoser.
        </p>

        <p>
          Om du vill få en strukturerad bild av din situation kan du också{" "}
          <Link href="/test" className="underline">
            göra vårt test här
          </Link>
          .
        </p>

        <h2 className="text-2xl font-semibold">
          Vad menas med narcissistiska drag?
        </h2>

        <p>
          Narcissistiska drag kopplas ofta till ett starkt behov av bekräftelse,
          uppmärksamhet och beundran. Personen kan vara känslig för kritik,
          reagera defensivt och ha svårt att erkänna fel.
        </p>

        <p>
          I relationer kan det visa sig genom att:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Fokus ofta hamnar på den andras behov av bekräftelse.</li>
          <li>Kritik tas mycket personligt.</li>
          <li>Ansvar för konflikter förskjuts.</li>
          <li>Relationen kretsar kring status, image eller yttre framgång.</li>
        </ul>

        <h2 className="text-2xl font-semibold">
          Vad menas med psykopatiska drag?
        </h2>

        <p>
          Psykopatiska drag förknippas oftare med låg empati, brist på skuld,
          ytlig charm och ett mer instrumentellt sätt att använda andra människor.
        </p>

        <p>
          I relationer kan det visa sig genom:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Snabb och intensiv inledning (stark charm).</li>
          <li>Svårigheter att känna eller visa genuin ånger.</li>
          <li>Gränsöverskridanden utan tydlig skuld.</li>
          <li>Manipulation som medveten strategi.</li>
        </ul>

        <h2 className="text-2xl font-semibold">
          Överlapp mellan begreppen
        </h2>

        <p>
          Det finns gemensamma drag, som bristande ansvarstagande,
          förminskning av andra och svårigheter med empati. Därför upplever
          många att skillnaden är otydlig i praktiken.
        </p>

        <p>
          I vardagligt tal används orden ofta för att beskriva någon som
          orsakar stark otrygghet eller emotionell skada i en relation.
        </p>

        <h2 className="text-2xl font-semibold">
          Det viktigaste är inte etiketten
        </h2>

        <p>
          För den som befinner sig i relationen är det ofta mindre viktigt
          vad beteendet kallas – och mer viktigt hur det påverkar trygghet,
          frihet och psykiskt mående över tid.
        </p>

        <p>
          Om du känner igen manipulativa mönster kan du läsa mer om{" "}
          <Link href="/manipulativ-partner" className="underline">
            manipulativ partner
          </Link>
          .
        </p>

        <p>
          Om du märker kontroll eller isolering kan du läsa om{" "}
          <Link href="/kontrollerande-relation" className="underline">
            kontrollerande relation
          </Link>
          .
        </p>

        <p>
          För en bredare genomgång av riskindikatorer kan du även läsa{" "}
          <Link href="/psykopatiska-drag-relation" className="underline">
            psykopatiska drag i relation
          </Link>{" "}
          samt{" "}
          <Link href="/tecken-pa-psykopat" className="underline">
            tecken på att du lever med en psykopat
          </Link>
          .
        </p>

        <hr className="my-8" />

        <p className="text-sm text-neutral-600">
          <strong>Disclaimer:</strong> Den här texten beskriver vanliga
          beteendemönster i relationer och är inte en diagnos eller
          professionell rådgivning. Om du känner dig otrygg eller utsatt,
          sök stöd hos vården eller en stödlinje. Vid akut fara, ring 112.
        </p>

        <p className="text-sm">
          <Link href="/test" className="underline">
            Gör testet
          </Link>
        </p>
      </article>
    </main>
  );
}