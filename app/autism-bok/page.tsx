import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { AUTISM_BOOK } from "../_lib/bookProducts.server";

const stripePaymentLink = "https://buy.stripe.com/5kQ28q0ut5Adb4H5MI0gw0v";
const pageUrl = "https://www.relationsvarning.se/autism-bok";
const title = "På mitt sätt – bok om autism och vardag | Relationsvarning";
const description = "På mitt sätt är en konkret bok om autism, vardag och praktiska verktyg för vuxna som vill förstå sina behov och få vardagen att fungera på sitt sätt.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: { title, description, url: pageUrl, type: "website" },
  twitter: { card: "summary", title, description },
};

const sectionHeading = "text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl";
const primaryButton = "inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#576f60] px-6 py-3.5 text-center font-semibold text-white transition hover:bg-[#455b4c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#576f60] sm:w-auto";
const structuredData = [
  { "@context": "https://schema.org", "@type": "Book", "@id": `${pageUrl}#book`, name: AUTISM_BOOK.name, author: { "@type": "Person", name: AUTISM_BOOK.author }, bookFormat: "EBook", inLanguage: "sv", numberOfPages: 48, url: pageUrl },
  { "@context": "https://schema.org", "@type": "Product", "@id": `${pageUrl}#product`, name: AUTISM_BOOK.name, description, brand: { "@type": "Brand", name: "Relationsvarning" }, offers: { "@type": "Offer", url: pageUrl, price: "149", priceCurrency: "SEK", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" } },
];

function BuyButton({ children = "Köp boken · 149 kr" }: { children?: string }) {
  return <a data-rv="button" href={stripePaymentLink} className={primaryButton}>{children}</a>;
}

export default function AutismBookPage() {
  return (
    <EditorialSurface>
      <main className="overflow-x-hidden text-neutral-900">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

        <section className="mx-auto max-w-6xl px-4 pb-14 pt-7 sm:px-6 sm:pb-20 sm:pt-10">
          <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className="underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-700">Relationsvarning</Link><span aria-hidden="true"> / </span><span aria-current="page">Autism-bok</span></nav>
          <div className="mt-5 grid gap-8 rounded-[32px] border border-[#d7e0d6] bg-[#f7fbf6] px-5 py-8 shadow-sm sm:mt-7 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,.85fr)] lg:items-center lg:gap-12 lg:px-12 lg:py-14">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#576f60]">Ny digital bok</p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-tight text-neutral-950 sm:text-5xl">På mitt sätt</h1>
              <p className="mt-5 font-serif text-2xl leading-8 text-[#405045] sm:text-[1.7rem] sm:leading-9">En konkret bok om autism och att få vardagen att fungera på ditt sätt.</p>
              <p className="mt-5 text-lg leading-8 text-neutral-700">För dig som vill förstå dina behov bättre och skapa vardagsverktyg som faktiskt går att använda — utan att försöka passa in i någon annans system.</p>
              <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-3"><p className="text-3xl font-semibold tracking-tight text-neutral-950">149 kr</p><p className="pb-1 text-sm font-medium text-neutral-600">48 sidor · praktiska arbetsblad</p></div>
              <div className="mt-5"><BuyButton /></div><p className="mt-3 text-sm text-neutral-600">Digital bok (PDF) · Direkt tillgång efter betalning</p>
            </div>
            <div className="space-y-5">
              <div className="mx-auto w-full max-w-[640px]"><Image src="/autism-bok-mockup.png" alt="På mitt sätt – bok om autism av Elias Voss" width={1312} height={1199} priority sizes="(max-width: 1024px) min(100vw - 2.5rem, 640px), 55vw" className="h-auto w-full" /></div>
              <aside className="rounded-[28px] border border-[#c7d3c7] bg-white p-6 sm:p-8" aria-label="Bokens innehåll">
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#576f60]">I boken</p>
                <p className="mt-4 font-serif text-3xl leading-tight text-[#405045]">48 sidor för vardagen på ditt sätt.</p>
                <ul className="mt-6 space-y-3 leading-7 text-neutral-700"><li>10 konkreta system och områden</li><li>Praktiska arbetsblad och övningar</li><li>Vardagsnära förståelse för behov, energi och återhämtning</li></ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d7e0d6] bg-[#f3f7f2]"><div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#576f60]">Vardag före perfektion</p><h2 className={`mt-3 max-w-3xl ${sectionHeading}`}>Det handlar inte om att fungera som alla andra.</h2><div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-neutral-700"><p>Vardag med autism kan innebära att intryck, sociala situationer, förändringar och återhämtning tar mer plats än omgivningen ser. Då räcker det sällan med fler allmänna råd.</p><p>På mitt sätt är byggd kring praktisk förståelse och konkreta verktyg som hjälper dig att utgå från dina egna behov.</p></div></div></section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#576f60]">I boken</p><h2 className={`mt-3 ${sectionHeading}`}>Konkreta system för en mer fungerande vardag</h2><p className="mt-5 text-lg leading-8 text-neutral-700">Boken samlar tio områden med reflektioner, arbetsblad och övningar som hjälper dig att förstå vad som fungerar, vad som skaver och vad du kan förändra i små steg.</p></div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{["Förstå dina egna behov", "Göra plats för återhämtning", "Hantera intryck och överbelastning", "Skapa tydlighet kring planer och förändringar", "Hitta vardagsverktyg som går att återvända till", "Bygga ett sätt att fungera som passar dig"].map((item, index) => <div data-rv="card" key={item} className="min-w-0 rounded-2xl border border-[#d7e0d6] bg-[#f7fbf6] p-5"><span aria-hidden="true" className="font-serif text-lg text-[#576f60]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-5 text-lg font-semibold leading-6 text-neutral-950">{item}</h3></div>)}</div></section>

        <section className="border-y border-[#d7e0d6] bg-[#24312b] text-white"><div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#d7e0d6]">Arbetsblad och övningar</p><h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Läs, reflektera och använd.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-neutral-100">Arbetsbladen hjälper dig att omsätta förståelsen i din egen vardag — i din takt och på ett sätt som går att återvända till.</p></div><ul className="grid gap-3 sm:grid-cols-2">{["Se vilka situationer som tar eller ger energi", "Sätta ord på behov som annars är svåra att förklara", "Göra plats för återhämtning utan skuld", "Välja ett nästa steg som faktiskt går att prova"].map((item) => <li key={item} className="rounded-xl border border-white/15 bg-white/5 px-4 py-4 leading-6 text-[#24312b]"><span aria-hidden="true" className="mr-2 text-[#576f60]">•</span>{item}</li>)}</ul></div></section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#576f60]">Läsarreaktioner</p><h2 className={`mt-3 ${sectionHeading}`}>Vad läsarna säger</h2></div><div className="mt-8 grid gap-4 lg:grid-cols-2"><figure className="flex min-h-[220px] flex-col justify-between rounded-[28px] border border-[#d7e0d6] bg-[#f3f7f2] p-6 sm:p-8"><blockquote className="font-serif text-2xl leading-9 text-[#405045] sm:text-[1.75rem] sm:leading-10">“Jag köpte boken till min 15-åriga dotter och hon älskar den. Hon säger att hon förstår sig själv bättre nu.”</blockquote><figcaption className="mt-7 font-semibold text-neutral-800">— Anna-Lena</figcaption></figure><figure className="flex min-h-[220px] flex-col justify-between rounded-[28px] border border-[#d7e0d6] bg-[#f3f7f2] p-6 sm:p-8"><blockquote className="font-serif text-2xl leading-9 text-[#405045] sm:text-[1.75rem] sm:leading-10">“Väldigt bra bok som verkligen förstår hur man lär sig att fungera med autism.”</blockquote><figcaption className="mt-7 font-semibold text-neutral-800">— Elvira, provläsare</figcaption></figure></div></section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-start"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#576f60]">För vem?</p><h2 className={`mt-3 ${sectionHeading}`}>För dig som vill förstå dig själv bättre — på ditt sätt.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-neutral-700">Boken är inte behandling, diagnostik eller en ersättning för professionell vård. Den är ett vardagsnära stöd för reflektion och praktiska verktyg.</p></div><div className="space-y-3">{["Dig som har autism", "Dig som känner igen dig i autismrelaterade behov och erfarenheter", "Dig som vill förstå intryck, återhämtning och vardagsstruktur bättre", "Dig som vill ha konkreta arbetsblad snarare än fler allmänna råd", "Någon som vill förstå en närstående bättre"].map((item) => <p key={item} className="rounded-xl border border-[#d7e0d6] bg-[#f7fbf6] px-5 py-4 font-medium leading-6 text-neutral-800"><span aria-hidden="true" className="mr-3 text-[#576f60]">✓</span>{item}</p>)}</div></section>

        <section className="bg-[#576f60] text-white"><div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20"><h2 className="font-serif text-4xl leading-tight sm:text-5xl">Du får skapa en vardag som fungerar för dig.</h2><p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/90">Börja med ett konkret verktyg, ett behov och ett litet nästa steg.</p><p className="mt-7 text-3xl font-semibold">149 kr</p><div className="mt-5"><BuyButton>Köp På mitt sätt</BuyButton></div><p className="mt-3 text-sm text-white/85">Digital bok (PDF) · Direkt tillgång efter betalning</p></div></section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#576f60]">Vanliga frågor</p><h2 className={`mt-3 ${sectionHeading}`}>Innan du köper</h2><div className="mt-7 divide-y divide-neutral-200 border-y border-neutral-200">{[["Är det en fysisk bok?", "Nej, det är en digital bok i PDF-format."], ["Hur får jag boken?", "Efter genomförd betalning verifieras köpet och du får direkt tillgång till nedladdningen."], ["Behöver jag ha en autismdiagnos?", "Nej. Boken är för personer som vill förstå autism och vardag bättre. Den ersätter inte professionell utredning eller vård."], ["Kan jag läsa den i mobilen?", "Ja. PDF-filen kan läsas på mobil, surfplatta och dator."], ["Finns det arbetsblad?", "Ja, boken innehåller praktiska arbetsblad och övningar kopplade till de tio områdena."]].map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-semibold text-neutral-950 marker:content-none"><span>{question}</span><span aria-hidden="true" className="float-right text-[#576f60] transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl leading-7 text-neutral-700">{answer}</p></details>)}</div></section>
      </main>
    </EditorialSurface>
  );
}
