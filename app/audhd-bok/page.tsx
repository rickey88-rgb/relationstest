import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { AUDHD_BOOK } from "../_lib/bookProducts.server";
import { getAudhdBookOffer, type BookOffer } from "../_lib/bookOffers";
import styles from "./page.module.css";

const pageUrl = "https://www.relationsvarning.se/audhd-bok";
const mockupUrl = "https://www.relationsvarning.se/audhd-bok-mockup.png";
const title = "Världens bästa bok om AuDHD – ADHD och autism i vardagen | Relationsvarning";
const description = "En digital AuDHD-bok med 10 konkreta system och praktiska arbetsblad för vardagen när ADHD och autism drar åt olika håll.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: { title, description, url: pageUrl, type: "website", images: [{ url: mockupUrl, width: 1312, height: 1199, alt: "Världens bästa bok om AuDHD av Elias Voss" }] },
  twitter: { card: "summary_large_image", title, description, images: [mockupUrl] },
};

const systems = ["Min AuDHD-karta", "Startknappen", "Flexsystemet", "Externa hjärnan", "Fokusreglaget", "Stimulansprofilen", "Bromsen", "Energibudgeten", "Kommunikationskartan", "Återstartsprotokollet"] as const;
const worksheets = ["Kartlägga vad som fungerar och skaver", "Skapa en egen startplan", "Minimum-, normal- och bonusplanering", "Bygga en extern hjärna", "Fokus, stimulans och impulskontroll", "Energibudget, kommunikation och återstart"] as const;
const readers = [
  { name: "Melissa", quote: "Jag har aldrig känt mig så förstådd av en bok. Det känns som att någon varit inne i min hjärna, sett kaoset och äntligen förklarat hur jag kan göra livet lite lättare." },
  { name: "Liam", quote: "Det här är första gången jag läst en bok om AuDHD och känt att författaren faktiskt förstår hur min hjärna fungerar. Inte bara varför vardagen blir svår – utan vad jag faktiskt kan göra åt det." },
  { name: "Joakim, 22", quote: "Väldigt konkret och faktiskt inspirerande. Kunskapen om AuDHD känns väldigt djup.\n\n9/10 monster 👾" },
  { name: "Jeanette, 32", quote: "Äntligen en bok som förstår mig. Tack." },
] as const;
const faqs = [
  ["Är det en fysisk bok?", "Nej, det är en digital bok i PDF-format."],
  ["Hur får jag boken?", "Efter genomförd betalning verifieras köpet och du får direkt tillgång till nedladdningen."],
  ["Behöver jag ha en AuDHD-diagnos?", "Nej. Boken kan läsas av personer som känner igen sig i kombinationen ADHD och autism eller vill förstå ämnet bättre. Den ersätter inte professionell utredning."],
  ["Kan jag läsa den i mobilen?", "Ja. PDF-filen kan läsas på mobil, surfplatta och dator."],
  ["Finns det arbetsblad?", "Ja, boken innehåller praktiska arbetsblad kopplade till de tio systemen."],
] as const;

const primaryButton = "inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#27666A] px-6 py-3.5 text-center font-semibold text-white transition hover:bg-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27666A] sm:w-auto";
const sectionHeading = "text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl";
const structuredData = [
  { "@context": "https://schema.org", "@type": "Book", "@id": `${pageUrl}#book`, name: AUDHD_BOOK.name, author: { "@type": "Person", name: AUDHD_BOOK.author }, bookFormat: "EBook", inLanguage: "sv", numberOfPages: 37, image: mockupUrl, url: pageUrl },
  { "@context": "https://schema.org", "@type": "Product", "@id": `${pageUrl}#product`, name: AUDHD_BOOK.name, description, image: mockupUrl, brand: { "@type": "Brand", name: "Relationsvarning" }, offers: { "@type": "Offer", url: pageUrl, price: "149", priceCurrency: "SEK", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" } },
];

function BuyButton({ offer, children }: { offer: BookOffer; children?: string }) {
  return <a data-rv="button" href={offer.paymentLink} className={primaryButton}>{children ?? `Köp boken · ${offer.price} kr`}</a>;
}

export default async function AudhdBookPage({ searchParams }: { searchParams: Promise<{ offer?: string | string[] }> }) {
  const offer = getAudhdBookOffer((await searchParams).offer);
  return (
    <EditorialSurface>
      <main className="overflow-x-hidden text-neutral-900">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

        <section className="mx-auto max-w-6xl px-4 pb-14 pt-7 sm:px-6 sm:pb-20 sm:pt-10">
          <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className="underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-700">Relationsvarning</Link><span aria-hidden="true"> / </span><span aria-current="page">AuDHD-bok</span></nav>
          <div className="mt-5 grid items-center gap-8 rounded-[32px] border border-[#D6E1DD] bg-[#FFFEFC] px-5 py-8 shadow-sm sm:mt-7 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,.88fr)_minmax(0,1.12fr)] lg:gap-10 lg:px-12 lg:py-14">
            <div className="max-w-xl">
              {offer.isAnalysisOffer && <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Specialpris efter testet</p>}
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Ny digital bok</p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-tight text-neutral-950 sm:text-5xl">Världens bästa bok om AuDHD</h1>
              <p className="mt-5 font-serif text-2xl leading-8 text-[#364A4B] sm:text-[1.7rem] sm:leading-9">10 konkreta sätt att få livet att fungera när ADHD och autism drar åt varsitt håll.</p>
              <p className="mt-5 text-lg leading-8 text-neutral-700">För dig som är trött på allmänna råd och vill skapa vardagssystem som går att använda när behoven drar åt olika håll.</p>
              <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-3">{offer.isAnalysisOffer ? <><p className="text-3xl font-semibold tracking-tight text-neutral-950">Ditt pris: {offer.price} kr</p><p className="pb-1 text-sm font-medium text-neutral-600"><span className="line-through">149 kr</span> · 37 sidor · praktiska arbetsblad</p></> : <><p className="text-3xl font-semibold tracking-tight text-neutral-950">{offer.price} kr</p><p className="pb-1 text-sm font-medium text-neutral-600">37 sidor · praktiska arbetsblad</p></>}</div>
              <div className="mt-5"><BuyButton offer={offer} /></div><p className="mt-3 text-sm text-neutral-600">Digital bok · Direkt tillgång efter betalning</p>
            </div>
            <div className="mx-auto w-full max-w-[640px]"><Image src="/audhd-bok-mockup.png" alt="3D-mockup av Världens bästa bok om AuDHD av Elias Voss" width={1312} height={1199} priority sizes="(max-width: 1024px) min(100vw - 2.5rem, 640px), 55vw" className="h-auto w-full" /></div>
          </div>
        </section>

        <section className="border-y border-[#D6E1DD] bg-[#F2E7E1]"><div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Vardag före perfektion</p><h2 className={`mt-3 max-w-3xl ${sectionHeading}`}>Det här är inte ännu en bok som säger åt dig att skaffa en kalender.</h2><div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-neutral-700"><p>AuDHD kan innebära att olika behov drar åt olika håll. Du kan behöva struktur men samtidigt ha svårt att följa den. Behöva stimulans men också bli överväldigad. Vilja komma igång men fastna trots att du vet exakt vad som behöver göras.</p><p>Vill du först få en bild av hur dina ADHD- och autismdrag fördelar sig? Gör vårt <Link href="/audhd-test" className="font-medium underline underline-offset-4 decoration-[#27666A]/60 hover:decoration-[#27666A]">AuDHD-test för vuxna</Link>.</p><p>Boken är byggd kring konkreta system för vardagen, snarare än fler allmänna råd om hur du borde fungera.</p></div></div></section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">I boken</p><h2 className={`mt-3 ${sectionHeading}`}>Det här får du</h2><p className="mt-5 text-lg leading-8 text-neutral-700">Det handlar inte bara om att förstå varför vardagen blir svår, utan om konkreta sätt att göra något åt det.</p></div><ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{systems.map((system, index) => <li data-rv="card" key={system} className="min-w-0 rounded-2xl border border-[#D6E1DD] bg-[#FFFEFC] p-5"><span aria-hidden="true" className="font-serif text-lg text-[#27666A]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-5 text-lg font-semibold leading-6 text-neutral-950">{system}</h3></li>)}</ol></section>

        <section className={`bg-[#202124] text-white ${styles.onDark}`}><div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#DDE8E3]">Praktiska arbetsblad</p><h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Läs mindre. Använd mer.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-neutral-100">Arbetsbladen hjälper dig att omsätta systemen i din egen vardag – på ett sätt som går att återvända till när veckan inte blev som du tänkt.</p></div><ul className="grid gap-3 sm:grid-cols-2">{worksheets.map((item) => <li key={item} className="rounded-xl border border-white/15 bg-white/5 px-4 py-4 leading-6 text-white"><span aria-hidden="true" className="mr-2 text-[#DDE8E3]">•</span>{item}</li>)}</ul></div></section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Testläsare</p><h2 className={`mt-3 ${sectionHeading}`}>Vad testläsarna säger</h2></div><div className="mt-8 grid gap-4 lg:grid-cols-2"><figure className="rounded-[28px] border border-[#D6E1DD] bg-[#fff3ed] p-6 sm:p-8 lg:row-span-2 lg:flex lg:flex-col lg:justify-between"><blockquote className="font-serif text-2xl leading-9 text-[#364A4B] sm:text-[1.75rem] sm:leading-10">“{readers[0].quote}”</blockquote><figcaption className="mt-7 font-semibold text-neutral-800">— {readers[0].name} · testläsare</figcaption></figure>{readers.slice(1).map((reader) => <figure key={reader.name} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6"><blockquote className="whitespace-pre-line leading-7 text-neutral-700">“{reader.quote}”</blockquote><figcaption className="mt-5 text-sm font-semibold text-neutral-800">— {reader.name} · testläsare</figcaption></figure>)}</div></section>

        <section className="border-y border-[#DDE8E3] bg-[#EFF5F2]"><div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[.9fr_1.1fr]"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">För vem?</p><h2 className={`mt-3 ${sectionHeading}`}>Boken är för dig som vill få vardagen att hänga ihop på ditt sätt.</h2></div><div className="space-y-3">{["Dig som har AuDHD", "Dig som känner igen dig i kombinationen ADHD + autism", "Dig som försöker förstå varför vanliga produktivitetsråd inte alltid fungerar", "Dig som vill ha konkreta vardagsverktyg", "Någon som vill förstå en närstående bättre"].map((item) => <p key={item} className="rounded-xl border border-[#DDE8E3] bg-white px-5 py-4 font-medium leading-6 text-neutral-800"><span aria-hidden="true" className="mr-3 text-[#27666A]">✓</span>{item}</p>)}<p className="pt-2 text-sm leading-6 text-neutral-600">Boken ersätter inte vård, behandling eller en professionell utredning.</p></div></div></section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-start"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Om författaren</p><h2 className={`mt-3 ${sectionHeading}`}>Elias Voss</h2><p className="mt-5 max-w-xl text-lg leading-8 text-neutral-700">Boken är skriven ur egen erfarenhet av ADHD, autism och AuDHD – med fokus på vardagsnära, praktiska strategier snarare än på att passa in i ett enda sätt att fungera.</p></div><div className="rounded-[28px] border border-[#D6E1DD] bg-[#FFFEFC] p-6 sm:p-8"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Digital leverans</p><h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">Allt du behöver veta</h2><ul className="mt-5 space-y-3 leading-7 text-neutral-700"><li>Digital bok i PDF-format</li><li>37 sidor med praktiska arbetsblad</li><li>Direkt tillgång efter genomförd betalning</li><li>Kan läsas på mobil, surfplatta och dator</li><li className="font-semibold text-neutral-950">{offer.isAnalysisOffer ? `Ditt pris: ${offer.price} kr` : `Pris: ${offer.price} kr`}</li></ul></div></section>

        <section className={`bg-[#27666A] text-white ${styles.onRose}`}><div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20"><h2 className="font-serif text-4xl leading-tight sm:text-5xl">Du behöver inte göra om hela ditt liv.</h2><p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/90">Börja med ett system som faktiskt fungerar för din hjärna.</p>{offer.isAnalysisOffer && <p className="mt-7 text-sm font-semibold uppercase tracking-[.16em] text-white/85">Specialpris efter testet</p>}<p className="mt-2 text-3xl font-semibold">{offer.isAnalysisOffer ? `Ditt pris: ${offer.price} kr` : `${offer.price} kr`}</p><div className="mt-5"><BuyButton offer={offer}>{`Köp Världens bästa bok om AuDHD · ${offer.price} kr`}</BuyButton></div><p className="mt-3 text-sm text-white/85">Digital bok · Direkt tillgång efter betalning</p></div></section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Vanliga frågor</p><h2 className={`mt-3 ${sectionHeading}`}>Innan du köper</h2><div className="mt-7 divide-y divide-neutral-200 border-y border-neutral-200">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-semibold text-neutral-950 marker:content-none"><span>{question}</span><span aria-hidden="true" className="float-right text-[#27666A] transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl leading-7 text-neutral-700">{answer}</p></details>)}</div></section>
      </main>
    </EditorialSurface>
  );
}
