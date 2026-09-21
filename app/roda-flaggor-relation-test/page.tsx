import type { Metadata } from "next";
import Link from "next/link";
import Quickcheck from "./Quickcheck";

export const metadata: Metadata = {
  title: "Röda flaggor i relation – gratis snabbcheck | Relationsvarning",
  description: "Gör en kostnadsfri snabbcheck med 12 frågor om återkommande beteenden i din relation. Se vilka mönster som sticker ut och vad du kan läsa vidare om.",
  alternates: { canonical: "https://www.relationsvarning.se/roda-flaggor-relation-test" },
  openGraph: {
    title: "Röda flaggor i relation – gratis snabbcheck",
    description: "12 frågor om återkommande beteenden i en relation. Se vilka områden som framträder och få relevanta nästa steg.",
    url: "https://www.relationsvarning.se/roda-flaggor-relation-test",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Relationsvarning", item: "https://www.relationsvarning.se/" },
    { "@type": "ListItem", position: 2, name: "Röda flaggor i relation – snabbcheck", item: "https://www.relationsvarning.se/roda-flaggor-relation-test" },
  ],
};

export default function RedFlagsQuickcheckPage() {
  return (
    <main className="bg-neutral-50 text-neutral-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Brödsmulor" className="mb-7 text-sm text-neutral-500"><Link href="/" className="underline underline-offset-4">Start</Link><span aria-hidden="true"> / </span><span aria-current="page">Röda flaggor i relation</span></nav>
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Gratis snabbcheck · 12 frågor · cirka 2 minuter</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Röda flaggor i relation – snabbcheck</h1>
          <p className="mt-5 text-lg leading-8 text-neutral-700">När något känns fel kan det vara svårt att avgöra vilket mönster man faktiskt reagerar på. Den här kostnadsfria snabbchecken hjälper dig att sortera återkommande beteenden inom kontroll, gaslighting, nedvärdering, gränser, instabilitet och otrygghet.</p>
          <p className="mt-4 leading-7 text-neutral-700">Du får hela resultatet direkt utan registrering eller betalning. Resultatet är ett orienterande reflektionsstöd och ersätter inte professionell, medicinsk eller juridisk bedömning.</p>
        </header>

        <section className="mt-9 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-semibold">Vad menas med röda flaggor?</h2>
          <p className="mt-3 leading-7 text-neutral-700">Röda flaggor är beteenden som kan signalera att trygghet, respekt eller frihet håller på att minska. En enstaka konflikt säger sällan allt. Det är upprepningen, utvecklingen över tid och hur beteendet påverkar dig som är viktigt.</p>
          <p className="mt-3 leading-7 text-neutral-700">Om du känner dig akut hotad eller är i fara, ring 112 eller kontakta någon du litar på. Använd inte ett test som ersättning för att söka hjälp.</p>
        </section>

        <Quickcheck />

        <section className="mt-12 space-y-8 border-t border-neutral-200 pt-10">
          <div>
            <h2 className="text-2xl font-semibold">Hur ska resultatet tolkas?</h2>
            <p className="mt-3 leading-7 text-neutral-700">Snabbchecken jämför sex områden med två frågor vardera. Den visar vilka områden som fått högst poäng, men fastställer inte varför ett beteende förekommer eller vad du måste göra. Låga poäng betyder att svaren inte visar ett tydligt genomgående mönster i just dessa frågor.</p>
            <p className="mt-3 leading-7 text-neutral-700">Om ett område ligger tydligt högre än de andra lyfts det primärt. Om flera områden ligger högt visas högst tre. Små skillnader presenteras försiktigt så att resultatet inte gör en dramatisk slutsats av enstaka svar.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Vanliga frågor</h2>
            <div className="mt-5 space-y-6">
              <div><h3 className="font-semibold">Är detta ett gratis relationstest?</h3><p className="mt-2 leading-7 text-neutral-700">Ja. Snabbchecken är gratis, kräver ingen registrering och visar hela resultatet direkt. De rekommenderade fördjupningstesterna är separata produkter med egna villkor.</p></div>
              <div><h3 className="font-semibold">Betyder ett högt resultat att relationen är destruktiv?</h3><p className="mt-2 leading-7 text-neutral-700">Nej. Ett högt delresultat betyder att du ofta känner igen beteenden inom det området. Sammanhang, varaktighet, säkerhet och konsekvenser behöver fortfarande vägas in.</p></div>
              <div><h3 className="font-semibold">Vad gör jag om flera varningssignaler känns bekanta?</h3><p className="mt-2 leading-7 text-neutral-700">Börja med att sätta ord på konkreta händelser och prata med någon du litar på. Du kan också läsa om <Link href="/destruktivt-forhallande" className="font-medium underline underline-offset-4">destruktiva relationsmönster</Link>, <Link href="/gaslighting-relation" className="font-medium underline underline-offset-4">gaslighting</Link> eller <Link href="/psykisk-misshandel-relation" className="font-medium underline underline-offset-4">psykisk misshandel i relationer</Link>.</p></div>
              <div><h3 className="font-semibold">Sparas mina svar?</h3><p className="mt-2 leading-7 text-neutral-700">Svaren sparas lokalt i din webbläsare så att en uppdatering inte raderar testet. De används inte för att ställa diagnos och snabbchecken delar inte svarstext eller poäng med analytics.</p></div>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
