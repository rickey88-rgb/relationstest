import Link from "next/link";

export const metadata = {
  title: "Kontrollerande relation – tecken, mönster och varningssignaler",
  description:
    "Tecken på en kontrollerande relation. Saklig genomgång av kontrollbeteenden, isolering, gränsförskjutning och hur friheten kan minska steg för steg.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="space-y-6">
        <h1 className="text-3xl font-semibold">
          Kontrollerande relation: tecken, mönster och hur friheten kan minska steg för steg
        </h1>

        <p>
          En kontrollerande relation börjar sällan med tydliga förbud eller hot.
          Ofta sker förändringen gradvis. Små kommentarer, små krav, små justeringar –
          tills du märker att ditt handlingsutrymme blivit mindre än tidigare.
        </p>

        <p>
          Den här sidan beskriver vanliga kontrollmönster i relationer. Fokus ligger
          på beteenden och dynamik – inte diagnoser.
        </p>

        <p>
          Vill du få en strukturerad överblick av din situation kan du{" "}
          <Link href="/test" className="underline">
            göra vårt test här
          </Link>
          .
        </p>

        <h2 className="text-2xl font-semibold">
          Vad är en kontrollerande relation?
        </h2>

        <p>
          Kontroll handlar om makt över beslut, kontakter, ekonomi, tid eller känslor.
          Det kan vara subtilt eller öppet. Det avgörande är inte en enskild händelse,
          utan ett återkommande mönster där den ena parten får mer inflytande och den
          andra mindre frihet.
        </p>

        <h2 className="text-2xl font-semibold">
          Vanliga tecken på kontroll
        </h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>Du behöver förklara eller försvara vardagliga beslut.</li>
          <li>Din partner vill veta var du är, med vem och varför.</li>
          <li>Vänner eller familj ifrågasätts eller kritiseras regelbundet.</li>
          <li>Svartsjuka används för att begränsa din frihet.</li>
          <li>Ekonomiska beslut centraliseras till en person.</li>
          <li>Din telefon, sociala medier eller meddelanden kontrolleras.</li>
          <li>Du anpassar ditt beteende för att undvika konflikt.</li>
        </ul>

        <h2 className="text-2xl font-semibold">
          Gradvis gränsförskjutning
        </h2>

        <p>
          Kontroll sker ofta stegvis. Något som först presenteras som omtanke kan
          senare bli krav. Det som en gång var frivilligt kan bli förväntat.
        </p>

        <p>
          När gränser flyttas lite i taget kan det vara svårt att se förändringen
          förrän du tittar bakåt.
        </p>

        <h2 className="text-2xl font-semibold">
          Skillnaden mellan omsorg och kontroll
        </h2>

        <p>
          Omsorg respekterar ditt självbestämmande. Kontroll begränsar det.
          I en trygg relation kan man uttrycka oro utan att inskränka den andres
          frihet.
        </p>

        <h2 className="text-2xl font-semibold">
          När kontroll kombineras med manipulation
        </h2>

        <p>
          Kontroll och manipulation överlappar ofta. Du kan läsa mer om
          psykologiska mönster i{" "}
          <Link href="/manipulativ-partner" className="underline">
            manipulativ partner
          </Link>{" "}
          samt bredare varningssignaler i{" "}
          <Link href="/psykopatiska-drag-relation" className="underline">
            psykopatiska drag i relation
          </Link>
          .
        </p>

        <p>
          För begreppsförståelse kan du även läsa{" "}
          <Link href="/skillnad-psykopat-narcissist" className="underline">
            skillnaden mellan psykopat och narcissist
          </Link>
          .
        </p>

        <hr className="my-8" />

        <p className="text-sm text-neutral-600">
          <strong>Disclaimer:</strong> Den här texten beskriver vanliga
          beteendemönster i destruktiva relationer och är inte en diagnos eller
          professionell rådgivning. Om du känner dig otrygg eller utsatt, sök
          stöd hos vården eller en stödlinje. Vid akut fara, ring 112.
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