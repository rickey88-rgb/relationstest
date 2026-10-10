import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookPurchaseAnalytics, { BookLandingAnalytics } from "../_components/BookPurchaseAnalytics";
import EditorialSurface from "../_components/EditorialSurface";
import { AUDHD_BOOK } from "../_lib/bookProducts.server";
import { getAudhdBookOffer, type BookOffer } from "../_lib/bookOffers";
import AudhdBookStickyCta from "./AudhdBookStickyCta";
import AudhdBookPreviewGallery, { type AudhdBookPreview } from "./AudhdBookPreviewGallery";
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

const strategies = [
  ["Min AuDHD-karta", "Kartlägg när vardagen fungerar, när den skaver och vad du behöver – utan att döma dig själv."],
  ["Startknappen", "Sänk tröskeln med ett löjligt litet första steg, mer tydlighet och stöd som hjälper dig igång."],
  ["Flexsystemet", "Gör en minimum-, normal- och bonusversion av planen, så att den fungerar även när dagen förändras."],
  ["Externa hjärnan", "Fånga uppgifter utanför huvudet och lägg dem på en plats där du kan hitta dem när det är dags."],
  ["Fokusreglaget", "Testa dig fram till lagom stimulans, miljö och stöd för uppgifter som kräver fokus."],
  ["Stimulansprofilen", "Upptäck vilka ljud, ljus, intryck och sociala situationer som tar eller ger energi – och skapa mer stöd omkring dig."],
  ["Bromsen", "Skapa en liten paus mellan impuls och handling, så att du får bättre förutsättningar att välja medvetet."],
  ["Energibudgeten", "Se vad olika saker kostar och ger, förutse återhämtningsbehov och planera med din energi i åtanke."],
  ["Kommunikationskartan", "Förstå hur du kommunicerar, läser av andra och kan göra dina behov och gränser tydligare."],
  ["Återstartsprotokollet", "En mjuk steg-för-steg-modell för att landa och börja igen när allt känns överväldigande."],
] as const;

const previews = [
  { src: "/audhd-book-previews/audhd-book-preview-introduction.jpg", fullSrc: "/audhd-book-previews/highres/audhd-book-preview-introduction.jpg", alt: "Introduktionssida ur Världens bästa bok om AuDHD", caption: "En introduktion till bokens praktiska stöd och tio system." },
  { src: "/audhd-book-previews/audhd-book-preview-startknappen.jpg", fullSrc: "/audhd-book-previews/highres/audhd-book-preview-startknappen.jpg", alt: "Utdraget Startknappen ur Världens bästa bok om AuDHD", caption: "Ett konkret system för att komma igång när allt känns jobbigt." },
  { src: "/audhd-book-previews/audhd-book-preview-flexsystemet.jpg", fullSrc: "/audhd-book-previews/highres/audhd-book-preview-flexsystemet.jpg", alt: "Utdraget Flexsystemet ur Världens bästa bok om AuDHD", caption: "Planering i minimum-, normal- och bonusversion." },
  { src: "/audhd-book-previews/audhd-book-preview-worksheet.jpg", fullSrc: "/audhd-book-previews/highres/audhd-book-preview-worksheet.jpg", alt: "Arbetsbladet Min AuDHD-karta ur Världens bästa bok om AuDHD", caption: "Ett av bokens ifyllbara arbetsblad." },
] as const satisfies readonly AudhdBookPreview[];

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
  { "@context": "https://schema.org", "@type": "Book", "@id": `${pageUrl}#book`, name: AUDHD_BOOK.name, author: { "@type": "Person", name: AUDHD_BOOK.author }, bookFormat: "EBook", inLanguage: "sv", numberOfPages: 38, image: mockupUrl, url: pageUrl },
  { "@context": "https://schema.org", "@type": "Product", "@id": `${pageUrl}#product`, name: AUDHD_BOOK.name, description, image: mockupUrl, brand: { "@type": "Brand", name: "Relationsvarning" }, offers: { "@type": "Offer", url: pageUrl, price: "149", priceCurrency: "SEK", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" } },
];

function BuyButton({ offer, children }: { offer: BookOffer; children?: string }) {
  return <BookPurchaseAnalytics productId={AUDHD_BOOK.id} productName={AUDHD_BOOK.name} price={offer.price} offerType={offer.isAnalysisOffer ? "analysis" : "standard"} paymentLink={offer.paymentLink} className={primaryButton}>{children ?? `Köp boken · ${offer.price} kr`}</BookPurchaseAnalytics>;
}

export default async function AudhdBookPage({ searchParams }: { searchParams: Promise<{ offer?: string | string[] }> }) {
  const offer = getAudhdBookOffer((await searchParams).offer);
  const offerType = offer.isAnalysisOffer ? "analysis" : "standard";
  const priceLabel = offer.isAnalysisOffer ? `Ditt pris: ${offer.price} kr` : `${offer.price} kr`;

  return (
    <EditorialSurface>
      <main className="overflow-x-hidden pb-20 text-neutral-900 md:pb-0">
        <BookLandingAnalytics productId={AUDHD_BOOK.id} productName={AUDHD_BOOK.name} price={offer.price} offerType={offerType} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

        <section id="audhd-book-hero" className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6 sm:pb-20 sm:pt-8">
          <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className="underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-700">Relationsvarning</Link><span aria-hidden="true"> / </span><span aria-current="page">AuDHD-bok</span></nav>
          <div className="mt-5 grid items-center gap-6 rounded-[28px] border border-[#D6E1DD] bg-[#FFFEFC] px-5 py-6 shadow-sm sm:mt-7 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-10 lg:px-12 lg:py-14">
            <div className="max-w-xl">
              {offer.isAnalysisOffer && <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Specialpris efter testet</p>}
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Digital bok om AuDHD</p>
              <h1 className="mt-3 text-3xl font-semibold leading-[1.04] tracking-tight text-neutral-950 sm:text-5xl">Världens bästa bok om AuDHD</h1>
              <p className="mt-3 font-serif text-lg leading-6 text-[#364A4B] sm:mt-5 sm:text-[1.7rem] sm:leading-9">10 konkreta strategier för en vardag där ADHD och autism ibland drar åt olika håll.</p>
              <p className="mt-3 text-sm leading-6 text-neutral-700 sm:mt-4 sm:text-lg sm:leading-8">För dig som vill bygga system som går att använda även när veckan inte blev som planerat.</p>
              <div className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-2"><p className="text-3xl font-semibold tracking-tight text-neutral-950">{priceLabel}</p><p className="pb-1 text-sm font-medium text-neutral-600">38 illustrerade A5-sidor · praktiska arbetsblad</p></div>
              {offer.isAnalysisOffer && <p className="mt-1 text-sm text-neutral-600"><span className="line-through">149 kr</span> · specialpris efter testet</p>}
              <div className="mt-5"><BuyButton offer={offer} /></div>
              <p className="mt-3 text-sm text-neutral-600">Digital PDF · Direkt tillgång efter betalning · Läs på mobil, surfplatta och dator</p>
            </div>
            <div className="mx-auto w-full max-w-[580px]"><Image src="/audhd-bok-mockup.png" alt="3D-mockup av Världens bästa bok om AuDHD av Elias Voss" width={1312} height={1199} priority sizes="(max-width: 1024px) min(100vw - 2.5rem, 580px), 55vw" className="h-auto w-full" /></div>
          </div>
        </section>

        <section className="border-y border-[#D6E1DD] bg-[#F2E7E1]"><div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Känner du igen det här?</p><h2 className={`mt-3 max-w-3xl ${sectionHeading}`}>Du behöver struktur – men kan känna dig låst av den.</h2><ul className="mt-6 space-y-3 text-lg leading-8 text-neutral-700"><li>Du behöver stimulans – men kan bli överväldigad av för mycket.</li><li>Du vet vad som behöver göras – men startknappen fungerar inte alltid.</li><li>Du vill ha en plan – men vardagen följer inte alltid den.</li></ul><p className="mt-6 text-lg leading-8 text-neutral-700">Boken handlar inte om att passa in i ett enda sätt att fungera. Den hjälper dig hitta system som fungerar för dig.</p><p className="mt-5 text-neutral-700">Vill du först få en bild av hur dina ADHD- och autismdrag fördelar sig? Gör vårt <Link href="/audhd-test" className="font-medium underline underline-offset-4 decoration-[#27666A]/60 hover:decoration-[#27666A]">AuDHD-test för vuxna</Link>.</p></div></section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Titta i boken</p><h2 className={`mt-3 ${sectionHeading}`}>Verkliga uppslag, inte återskapad marknadsgrafik</h2><p className="mt-5 text-lg leading-8 text-neutral-700">Här är fyra utdrag från den digitala boken: introduktionen, två av systemen och ett arbetsblad. Välj en bild för att förstora och läsa.</p></div><AudhdBookPreviewGallery previews={previews} /><div className="mt-7"><BuyButton offer={offer}>{`Jag vill läsa boken · ${offer.price} kr`}</BuyButton></div></section>

        <section className="border-y border-[#D6E1DD] bg-[#EFF5F2]"><div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">I boken</p><h2 className={`mt-3 ${sectionHeading}`}>10 system för vardagen när behoven drar åt olika håll</h2><p className="mt-5 text-lg leading-8 text-neutral-700">Varje system förklaras och följs av praktiska sätt att testa det i vardagen.</p></div><ol className="mt-8 grid gap-3 md:grid-cols-2">{strategies.map(([name, detail], index) => <li key={name} className="rounded-2xl border border-[#D6E1DD] bg-white p-5"><p className="font-serif text-[#27666A]">{String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 text-lg font-semibold text-neutral-950">{name}</h3><p className="mt-2 leading-7 text-neutral-700">{detail}</p></li>)}</ol></div></section>

        <section className={`bg-[#202124] text-white ${styles.onDark}`}><div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#DDE8E3]">Praktiska arbetsblad</p><h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Läs mindre. Använd mer.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-neutral-100">Arbetsbladen hjälper dig att omsätta systemen i din egen vardag – på ett sätt som går att återvända till när veckan inte blev som du tänkt.</p><div className="mt-6"><BuyButton offer={offer}>{`Få boken och arbetsbladen · ${offer.price} kr`}</BuyButton></div></div><figure className="mx-auto max-w-[430px] overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-2 shadow-2xl"><Image src="/audhd-book-previews/audhd-book-preview-worksheet.jpg" alt="Arbetsbladet Min AuDHD-karta i boken" width={700} height={993} sizes="(max-width: 1024px) min(100vw - 3rem, 430px), 40vw" className="h-auto w-full rounded-xl"/><figcaption className="p-3 text-sm leading-6 text-neutral-100">Ett arbetsblad för att se mönster, behov och nästa lilla handling.</figcaption></figure></div></section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Testläsare</p><h2 className={`mt-3 ${sectionHeading}`}>Vad testläsarna säger</h2></div><div className="mt-8 grid gap-4 lg:grid-cols-2">{readers.slice(0, 2).map((reader) => <figure key={reader.name} className="rounded-[28px] border border-[#D6E1DD] bg-[#fff3ed] p-6 sm:p-8"><blockquote className="font-serif text-xl leading-8 text-[#364A4B] sm:text-2xl sm:leading-9">“{reader.quote}”</blockquote><figcaption className="mt-6 font-semibold text-neutral-800">— {reader.name} · testläsare</figcaption></figure>)}</div><details className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><summary className="cursor-pointer font-semibold text-neutral-950">Visa fler testläsarcitat</summary><div className="mt-5 grid gap-4 sm:grid-cols-2">{readers.slice(2).map((reader) => <figure key={reader.name}><blockquote className="whitespace-pre-line leading-7 text-neutral-700">“{reader.quote}”</blockquote><figcaption className="mt-4 text-sm font-semibold text-neutral-800">— {reader.name} · testläsare</figcaption></figure>)}</div></details></section>

        <section className="border-y border-[#DDE8E3] bg-[#EFF5F2]"><div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[.9fr_1.1fr]"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">För vem och av vem?</p><h2 className={`mt-3 ${sectionHeading}`}>Praktiska system med vardagen i centrum.</h2><p className="mt-5 text-lg leading-8 text-neutral-700">Elias Voss skriver ur egen erfarenhet av ADHD, autism och AuDHD – med fokus på vardagsnära strategier snarare än på att passa in i ett enda sätt att fungera.</p></div><div className="space-y-3"><p className="rounded-xl border border-[#D6E1DD] bg-white px-5 py-4 font-medium leading-6 text-neutral-800">För dig med AuDHD eller som känner igen kombinationen ADHD och autism.</p><p className="rounded-xl border border-[#D6E1DD] bg-white px-5 py-4 font-medium leading-6 text-neutral-800">För dig som vill ha praktiska system snarare än allmänna råd.</p><p className="rounded-xl border border-[#D6E1DD] bg-white px-5 py-4 font-medium leading-6 text-neutral-800">För närstående som vill förstå ämnet bättre.</p><p className="pt-2 text-sm leading-6 text-neutral-600">Boken ger allmän information och praktiskt stöd. Den ersätter inte vård, behandling eller professionell utredning.</p></div></div></section>

        <section className={`bg-[#27666A] text-white ${styles.onRose}`}><div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20"><h2 className="font-serif text-4xl leading-tight sm:text-5xl">Ett litet system kan vara en bra början.</h2><ul className="mx-auto mt-6 max-w-lg space-y-2 text-left leading-7 text-white/90"><li>38 illustrerade A5-sidor</li><li>10 konkreta strategier och praktiska arbetsblad</li><li>Digital PDF med direkt tillgång efter betalning</li></ul>{offer.isAnalysisOffer && <p className="mt-7 text-sm font-semibold uppercase tracking-[.16em] text-white/85">Specialpris efter testet</p>}<p className="mt-5 text-3xl font-semibold">{priceLabel}</p><div className="mt-5"><BuyButton offer={offer}>{`Köp boken · ${offer.price} kr`}</BuyButton></div></div></section>

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Vanliga frågor</p><h2 className={`mt-3 ${sectionHeading}`}>Innan du köper</h2><div className="mt-7 divide-y divide-neutral-200 border-y border-neutral-200">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-semibold text-neutral-950 marker:content-none"><span>{question}</span><span aria-hidden="true" className="float-right text-[#27666A] transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl leading-7 text-neutral-700">{answer}</p></details>)}</div></section>
      </main>
      <AudhdBookStickyCta paymentLink={offer.paymentLink} price={offer.price} offerType={offerType} />
    </EditorialSurface>
  );
}
