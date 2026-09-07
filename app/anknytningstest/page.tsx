import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anknytning i relationer – profiler, närhet och anknytningstest",
  description:
    "Lär dig om trygg, ängslig och undvikande anknytning i romantiska relationer. Förstå anknytningsångest och anknytningsundvikande och gör vårt anknytningstest.",
  alternates: {
    canonical: "https://relationsvarning.se/anknytningstest",
  },
};

export default function AnknytningPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900 sm:px-6 sm:py-14">
      <article>
        <header>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Närhet, trygghet och relationsmönster
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Anknytning i romantiska relationer – vilken profil känner du igen?
          </h1>
          <p className="mt-5 leading-7 text-neutral-700">
            Vad händer i dig när någon kommer nära, när ett svar dröjer eller när
            ni blir oense? Anknytning handlar om hur du söker och upplever trygghet
            i nära relationer. Begreppen kan hjälpa dig att sätta ord på dina
            reaktioner, utan att låsa fast dig i en viss typ.
          </p>
          <p className="mt-4 leading-7 text-neutral-700">
            Vill du först fördjupa dig i begreppen? I vår <Link href="/anknytning" className="underline underline-offset-4">huvudguide om anknytning i relationer</Link> finns utförligare förklaringar och separata guider till de olika mönstren.
          </p>
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
            <h2 className="text-xl font-semibold">Utforska din anknytningsprofil</h2>
            <p className="mt-3 leading-7 text-neutral-700">
              Våra 30 frågor handlar om dina reaktioner på närhet, osäkerhet och
              känslomässigt avstånd i romantiska relationer.
            </p>
            <Link
              href="/anknytningstest/test"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto"
            >
              Gör anknytningstestet
            </Link>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Testet är ett självreflektionsverktyg, inte en klinisk diagnos.
            </p>
          </div>
        </header>

        <section className="mt-10 space-y-4 leading-7 text-neutral-700">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Vad innebär anknytning i vuxna relationer?
          </h2>
          <p>
            En partner kan vara någon du vänder dig till för stöd och närhet.
            Anknytningsmönster beskriver bland annat hur bekväm du är med att
            förlita dig på den personen och hur du reagerar när tillgängligheten
            känns osäker. I forskning om romantisk anknytning används ofta två
            dimensioner: anknytningsångest och anknytningsundvikande.
          </p>
          <h3 className="text-xl font-semibold text-neutral-900">Anknytningsångest</h3>
          <p>
            Anknytningsångest handlar om oro för att bli avvisad, övergiven eller
            mindre viktig för partnern. Högre nivåer kan märkas som ett starkt
            behov av försäkran och vaksamhet på förändringar i kontakten. Ordet
            beskriver en dimension av anknytning, inte i sig en ångestdiagnos.
          </p>
          <p>
            Om oron också gör att du återkommande sätter egna behov åt sidan kan du läsa om <Link href="/medberoende" className="underline underline-offset-4">medberoende, självuppoffring och gränser</Link>. Det beskriver andra relationsmönster än anknytningsångest och är inte samma sak.
          </p>
          <h3 className="text-xl font-semibold text-neutral-900">Anknytningsundvikande</h3>
          <p>
            Anknytningsundvikande handlar om obehag inför beroende och känslomässig
            närhet. Högre nivåer kan innebära att det känns svårt att visa behov,
            ta emot stöd eller vara sårbar. Att uppskatta egentid är däremot inte
            ensamt ett tecken på undvikande anknytning.
          </p>
          <p className="text-sm leading-6 text-neutral-600">
            Forskningsbakgrund: en översikt om{" "}
            <a href="https://www.nature.com/articles/s44159-021-00011-1" className="underline underline-offset-4">
              anknytningsångest och undvikande i parrelationer
            </a>.
          </p>
        </section>

        <section className="mt-10 space-y-4 leading-7 text-neutral-700">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Fyra vanliga beskrivningar av anknytningsprofiler
          </h2>
          <p>
            Profilerna sammanfattar olika kombinationer av de två dimensionerna.
            De är beskrivningar av mönster, inte facit över vem du är.
          </p>
          <h3 className="text-xl font-semibold text-neutral-900">Trygg anknytning</h3>
          <p>
            Relativt låg ångest och lågt undvikande. Närhet och självständighet
            kan oftast rymmas samtidigt, och det brukar kännas möjligt att söka
            stöd. Trygg anknytning innebär inte att du aldrig blir orolig.
          </p>
          <h3 className="text-xl font-semibold text-neutral-900">Ängslig/ambivalent anknytning</h3>
          <p>
            Högre ångest och lägre undvikande. Du kan längta efter närhet samtidigt
            som osäker kontakt väcker stark oro och ett behov av bekräftelse.
          </p>
          <h3 className="text-xl font-semibold text-neutral-900">Undvikande anknytning</h3>
          <p>
            Högre undvikande och lägre ångest. Självständighet kan kännas lättare
            än att vara beroende av någon, och känslomässiga krav kan väcka en
            önskan att dra sig undan.
          </p>
          <h3 className="text-xl font-semibold text-neutral-900">
            Blandad/rädd-undvikande anknytningsprofil
          </h3>
          <p>
            Högre nivåer av både ångest och undvikande. Närhet kan vara starkt
            efterlängtad men samtidigt svår att känna sig trygg i. Det kan finnas
            både oro för avvisande och en impuls att skapa avstånd.
          </p>
          <p className="text-sm leading-6 text-neutral-600">
            Fördjupning om dimensionerna och profilerna: R. Chris Fraleys{" "}
            <a href="https://labs.psychology.illinois.edu/~rcfraley/attachment.htm" className="underline underline-offset-4">
              forskningsöversikt om vuxen anknytning
            </a>.
          </p>
        </section>

        <section className="mt-10 space-y-4 leading-7 text-neutral-700">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Dimensioner ger en mer nyanserad bild än fasta typer
          </h2>
          <p>
            Du behöver inte passa helt i en profil. Två personer med samma
            profilnamn kan ha olika grad av oro och undvikande. Små skillnader
            runt en kategorigräns gör inte människor till helt olika typer.
            Använd därför resultatet som utgångspunkt för reflektion över dina
            svar, inte som en permanent etikett på dig eller din partner.
          </p>
          <p className="text-sm leading-6 text-neutral-600">
            Läs mer om{" "}
            <a href="https://labs.psychology.illinois.edu/~rcfraley/measures/measures.html" className="underline underline-offset-4">
              varför anknytning kan beskrivas med dimensioner
            </a>.
          </p>
        </section>

        <section className="mt-10 space-y-4 leading-7 text-neutral-700">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Relationsmiljön spelar också roll
          </h2>
          <p>
            Hur trygg du känner dig handlar inte bara om dina egna mönster.
            Partnerns tillgänglighet, hur konflikter hanteras och hur ni bemöter
            varandras behov spelar också roll. Trygghet kan skilja sig mellan
            relationer. Ett svar om oro behöver förstås i sitt sammanhang: möts
            du av pålitlig kontakt eller av återkommande osäkerhet?
          </p>
          <p className="text-sm leading-6 text-neutral-600">
            Forskningsbakgrund: en översikt om{" "}
            <a href="https://pubmed.ncbi.nlm.nih.gov/12395567/" className="underline underline-offset-4">
              anknytningstrygghet i parrelationer
            </a>.
          </p>
          <p>
            Att vara otrygg i en relation innebär inte att du orsakar partnerns
            skadliga beteenden. Förnekanden som får dig att tvivla på din
            upplevelse behandlas i guiden om{" "}
            <Link href="/gaslighting-relation" className="underline underline-offset-4">gaslighting</Link>.
            Återkommande kontroll och nedbrytning beskrivs i guiden om{" "}
            <Link href="/psykisk-misshandel-relation" className="underline underline-offset-4">psykisk misshandel i relationer</Link>.
          </p>
          <p>
            Anknytning är inte heller samma sak som{" "}
            <Link href="/traumabindning-i-relation" className="underline underline-offset-4">traumabindning</Link>,
            som används för att beskriva starka band i skadliga relationsmönster.
            Ett anknytningstest kan inte avgöra om relationen är trygg eller
            om någon utsätter dig för övergrepp.
          </p>
        </section>

        <section className="mt-10 space-y-4 leading-7 text-neutral-700">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Vad kan Relationsvarnings anknytningstest säga?
          </h2>
          <p>
            Testet sammanställer dina svar på 30 frågor till en bild av
            anknytningsångest och anknytningsundvikande, med en förenklad
            profilbeskrivning. Svaren speglar hur du uppfattar dina reaktioner
            när du gör testet. Resultatet är inte en klinisk diagnos och ersätter
            inte en individuell bedömning av en psykolog eller annan vårdpersonal.
          </p>
          <p>
            Forskningsbegreppen ovan ska inte tolkas som att Relationsvarnings
            eget test är ett kliniskt validerat instrument. Använd resultatet
            för att fundera över vilka situationer som väcker oro eller avstånd,
            vilka behov du har och vad som faktiskt händer mellan er.
          </p>
          <Link
            href="/anknytningstest/test"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto"
          >
            Starta anknytningstestet
          </Link>
        </section>
      </article>
    </main>
  );
}
