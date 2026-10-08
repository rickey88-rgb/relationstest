import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookPurchaseAnalytics, { BookLandingAnalytics } from "../_components/BookPurchaseAnalytics";
import EditorialSurface from "../_components/EditorialSurface";
import { ADHD_DELUXE_BOOK } from "../_lib/bookProducts.server";
import { getAdhdDeluxeBookOffer, type BookOffer } from "../_lib/bookOffers";
import { ADHD_DELUXE_SALE_ENABLED } from "../_lib/featureFlags";

const pageUrl = "https://www.relationsvarning.se/adhd-deluxe";
const mockupUrl = "https://www.relationsvarning.se/adhd-bok-mockup.png";
const title = "ADHD Deluxe – bok om ADHD i vuxenlivet | Relationsvarning";
const description = "ADHD Deluxe av Elias Voss är en digital bok med konkreta ADHD-strategier för prokrastinering, tid, minne, känslor, relationer och vardag.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: { title, description, url: pageUrl, type: "website", images: [{ url: mockupUrl, width: 1448, height: 1086, alt: "ADHD Deluxe – bok om ADHD av Elias Voss" }] },
  twitter: { card: "summary_large_image", title, description, images: [mockupUrl] },
};

const primaryButton = "inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#27666A] px-6 py-3.5 text-center font-semibold text-white transition hover:bg-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27666A] sm:w-auto";
const sectionHeading = "text-3xl font-semibold tracking-tight text-[#202124] sm:text-4xl";
const highlights = [
  "16 kapitel om ADHD i verkliga vuxenlivet",
  "Praktiska övningar och tydliga ADHD Deluxe-regler",
  "Ett enkelt femfrågesystem för när vardagen fastnar",
  "Personligt, roligt, kompromisslöst och utan superkraftsfloskler",
  "En bok om färre katastrofer — inte om perfektion",
] as const;
const faqs = [
  ["Är det en fysisk bok?", "Nej, ADHD Deluxe är en digital bok i PDF-format."],
  ["När kan jag få boken?", "Du får tillgång till ADHD Deluxe direkt efter betalning."],
  ["Kan jag läsa den i mobilen?", "Ja. PDF-filen kan läsas på mobil, surfplatta och dator."],
  ["Är boken en ersättning för vård eller utredning?", "Nej. Boken är ett vardagsnära stöd och ersätter inte vård, behandling eller professionell utredning."],
] as const;

const structuredData = [
  { "@context": "https://schema.org", "@type": "Book", "@id": `${pageUrl}#book`, name: ADHD_DELUXE_BOOK.name, author: { "@type": "Person", name: ADHD_DELUXE_BOOK.author }, bookFormat: "EBook", inLanguage: "sv", image: mockupUrl, url: pageUrl },
  { "@context": "https://schema.org", "@type": "Product", "@id": `${pageUrl}#product`, name: ADHD_DELUXE_BOOK.name, description, image: mockupUrl, brand: { "@type": "Brand", name: "Relationsvarning" }, ...(ADHD_DELUXE_SALE_ENABLED ? { offers: { "@type": "Offer", url: pageUrl, price: "149", priceCurrency: "SEK", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" } } : {}) },
];

function BuyButton({ offer, children }: { offer: BookOffer; children?: string }) {
  return <BookPurchaseAnalytics productId={ADHD_DELUXE_BOOK.id} productName={ADHD_DELUXE_BOOK.name} price={offer.price} offerType={offer.isAnalysisOffer ? "analysis" : "standard"} paymentLink={offer.paymentLink} className={primaryButton}>{children ?? `Köp boken · ${offer.price} kr`}</BookPurchaseAnalytics>;
}

export default async function AdhdDeluxePage({ searchParams }: { searchParams: Promise<{ offer?: string | string[] }> }) {
  const offer = getAdhdDeluxeBookOffer((await searchParams).offer);
  const offerType = offer.isAnalysisOffer ? "analysis" : "standard";

  return <EditorialSurface>
    <main className="overflow-x-hidden text-[#202124]">
      <BookLandingAnalytics productId={ADHD_DELUXE_BOOK.id} productName={ADHD_DELUXE_BOOK.name} price={offer.price} offerType={offerType} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <section className="mx-auto max-w-6xl px-4 pb-14 pt-7 sm:px-6 sm:pb-20 sm:pt-10">
        <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className="underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-700">Relationsvarning</Link><span aria-hidden="true"> / </span><span aria-current="page">ADHD Deluxe</span></nav>
        <div className="mt-5 grid items-center gap-8 rounded-[32px] border border-[#D6E1DD] bg-[#FFFEFC] px-5 py-8 shadow-sm sm:mt-7 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:py-14">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Ny digital bok</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-tight text-[#202124] sm:text-5xl">ADHD Deluxe</h1>
            <p className="mt-3 text-lg font-medium text-[#364A4B]">Elias Voss</p>
            <p className="mt-5 font-serif text-2xl leading-8 text-[#364A4B] sm:text-[1.7rem] sm:leading-9">En bok om färre katastrofer — inte om perfektion.</p>
            <p className="mt-5 text-lg leading-8 text-neutral-700">ADHD Deluxe är inte en bok som lovar att göra dig normal. Det är en bok som hjälper dig att förstå var det fastnar — och bygga smartare runt det.</p>
            {ADHD_DELUXE_SALE_ENABLED ? <><div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-3">{offer.isAnalysisOffer ? <><p className="text-3xl font-semibold tracking-tight text-[#202124]">Ditt pris: {offer.price} kr</p><p className="pb-1 text-sm font-medium text-neutral-600"><span className="line-through">149 kr</span> · digital bok</p></> : <><p className="text-3xl font-semibold tracking-tight text-[#202124]">149 kr</p><p className="pb-1 text-sm font-medium text-neutral-600">Digital bok · direkt tillgång</p></>}</div><div className="mt-5"><BuyButton offer={offer} /></div><p className="mt-3 text-sm text-neutral-600">Digital bok · Direkt tillgång efter betalning</p></> : <p className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-xl border border-[#27666A] px-6 py-3.5 font-semibold text-[#27666A]">Kommer snart</p>}
          </div>
          <div className="mx-auto w-full max-w-[620px]"><Image src="/adhd-bok-mockup.png" alt="ADHD Deluxe – bok om ADHD av Elias Voss" width={1448} height={1086} priority sizes="(max-width: 1024px) min(100vw - 2.5rem, 620px), 50vw" className="h-auto w-full" /></div>
        </div>
      </section>

      <section className="border-y border-[#D6E1DD] bg-[#EFF5F2]"><div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Vardag före perfektion</p><h2 className={`mt-3 ${sectionHeading}`}>Bygg smartare runt det som faktiskt fastnar.</h2><div className="mt-6 space-y-4 text-lg leading-8 text-neutral-700"><p>I ADHD Deluxe delar Elias Voss med sig av erfarenheter, misstag och konkreta strategier för att göra livet lite lättare att köra: från prokrastinering, minne och tid till pengar, känslor, relationer, skärmar och impulsiva beslut.</p><p>Det här är ingen generisk guide om hur du borde fungera. Det är en bok för vardagen som den faktiskt ser ut.</p></div></div></section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">I boken</p><h2 className={`mt-3 ${sectionHeading}`}>Konkret när det behövs som mest.</h2><p className="mt-5 text-lg leading-8 text-neutral-700">När vardagen fastnar hjälper det sällan med fler abstrakta råd. Här får du ett direkt och personligt sätt att tänka vidare.</p></div><ul className="grid gap-3 sm:grid-cols-2">{highlights.map((highlight) => <li data-rv="card" key={highlight} className="rounded-2xl border border-[#D6E1DD] bg-[#FFFEFC] px-5 py-4 font-medium leading-6 text-[#202124]"><span aria-hidden="true" className="mr-3 text-[#27666A]">✓</span>{highlight}</li>)}</ul></section>

      <section className="bg-[#202124] text-white"><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#DDE8E3]">För vem?</p><h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">För dig som vill förstå din vardag bättre — och göra den lite lättare att köra.</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-100">Boken kan vara relevant för dig som känner igen dig i ADHD-relaterade svårigheter eller vill förstå ämnet bättre. Den diagnostiserar inte och ersätter inte professionell vård eller utredning.</p></div></section>

      <section className="border-y border-[#DDE8E3] bg-[#F2E7E1]"><div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">ADHD Deluxe</p><h2 className="mt-3 font-serif text-4xl leading-tight text-[#202124] sm:text-5xl">Färre katastrofer. Inte perfektion.</h2><p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-neutral-700">En direkt, konkret bok om att förstå var det fastnar och bygga smartare runt det.</p>{ADHD_DELUXE_SALE_ENABLED ? <><p className="mt-2 text-3xl font-semibold text-[#202124]">{offer.isAnalysisOffer ? `Ditt pris: ${offer.price} kr` : "149 kr"}</p><div className="mt-5"><BuyButton offer={offer}>{`Köp ADHD Deluxe · ${offer.price} kr`}</BuyButton></div><p className="mt-3 text-sm text-neutral-600">Digital bok · Direkt tillgång efter betalning</p></> : <p className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-xl border border-[#27666A] px-6 py-3.5 font-semibold text-[#27666A]">Kommer snart</p>}</div></section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Vanliga frågor</p><h2 className={`mt-3 ${sectionHeading}`}>Mer om boken</h2><div className="mt-7 divide-y divide-neutral-200 border-y border-neutral-200">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-semibold text-[#202124] marker:content-none"><span>{question}</span><span aria-hidden="true" className="float-right text-[#27666A] transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl leading-7 text-neutral-700">{answer}</p></details>)}</div></section>
    </main>
  </EditorialSurface>;
}
