import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookPurchaseAnalytics, { BookLandingAnalytics } from "../_components/BookPurchaseAnalytics";
import { AUTISM_BOOK } from "../_lib/bookProducts.server";
import { getAutismBookOffer, type BookOffer } from "../_lib/bookOffers";
import { AUTISM_BOOK_SALE_ENABLED } from "../_lib/featureFlags";
import AutismBookPreviewGallery from "./AutismBookPreviewGallery";
import AutismBookStickyCta from "./AutismBookStickyCta";
import styles from "./page.module.css";

const pageUrl = "https://www.relationsvarning.se/autism-bok";
const mockupUrl = "https://www.relationsvarning.se/autism-all-inclusive-mockup.png";
const title = "AUTISM ALL INCLUSIVE – bok och ifyllbara arbetsblad | Relationsvarning";
const description = "En färgstark guide till en lättare vardag med autism. 52 sidor, 10 kapitel och 12 A4-sidor med digitalt ifyllbara arbetsblad. Av Elias Voss.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: pageUrl },
  openGraph: { title, description, url: pageUrl, type: "website", images: [{ url: mockupUrl, width: 1205, height: 1305, alt: AUTISM_BOOK.name }] },
  twitter: { card: "summary_large_image", title, description, images: [mockupUrl] },
};
const chapters = [
  ["Din egen bruksanvisning", "Se vad som fungerar, vad som kostar kraft och vilket stöd du vill prova."],
  ["När världen skruvar upp volymen", "Undersök sinnesintrycken i en situation och prova en ändring i miljön."],
  ["Batteriet som ingen annan ser", "Ge resor, omställningar och återhämtning plats i din planering."],
  ["När det blir för mycket", "Sätt ord på tidiga signaler och gör en plan när du har utrymme."],
  ["Startknappen som gömde sig", "Hitta hindret och gör den första handlingen mindre och tydligare."],
  ["En plan som tål verkligheten", "Skapa enkla ankare och en reservväg när något förändras."],
  ["Tydlighet är en omtanke", "Be om konkreta besked, betänketid eller ett sätt att kommunicera som fungerar."],
  ["Du får ta plats som du", "Utforska trygghet, relationer och det du vill ha mer plats för."],
  ["Kroppen vill också vara med", "Uppmärksamma grundläggande behov och förbered en anteckning inför vården."],
  ["Du ska inte bära allt själv", "Beskriv ett behov och ett konkret önskemål om stöd i skolan, på jobbet eller hemma."],
] as const;
const previews = [
  { page: 5, slug: "sa-anvander-du-boken", title: "Ta det som hjälper dig", caption: "Läs, prova och spara. Du väljer var du börjar." },
  { page: 11, slug: "sinnesintryck", title: "När världen skruvar upp volymen", caption: "Ljud, ljus och allt annat som tar plats i en vanlig dag." },
  { page: 15, slug: "energi", title: "Batteriet som ingen annan ser", caption: "Det som kostar kraft syns inte alltid i kalendern." },
  { page: 25, slug: "forsta-steget", title: "Från moln till första steg", caption: "Ett vardagsexempel och en övning för att komma igång." },
  { page: 31, slug: "tydlighet", title: "Tydlighet är en omtanke", caption: "Du får be om information som går att använda." },
  { page: 10, slug: "vardagsprofil", title: "Min vardagsprofil", caption: "Utsnitt ur ett arbetsblad. De första två frågorna visas.", cropped: true },
].map(item => ({ ...item, src: `/autism-book-previews/${item.slug}.webp`, fullSrc: `/autism-book-previews/read/${item.slug}.webp` }));
const faqs = [
  ["Är det en fysisk bok?", "Du köper en digital bok. Mockupen visar omslaget, men ingen tryckt bok skickas. Du får två separata PDF-filer."],
  ["Vad ingår i köpet?", "Hela boken på 52 sidor med tio kapitel, övningar och arbetsblad. Dessutom ett separat häfte med 12 A4-sidor och 72 digitalt ifyllbara formulärfält. Båda filerna ingår i samma engångsköp."],
  ["Hur får jag filerna?", "Efter betalningen kontrolleras köpet och du kommer till en sida med två nedladdningsknappar. Spara båda filerna på din enhet. Du behöver inget konto."],
  ["Kan jag fylla i arbetsbladen i mobilen?", "A4-häftet kan fyllas i i en PDF-läsare som stöder formulär, även på mobil och surfplatta. Spara en egen kopia och kontrollera att svaren finns kvar när du öppnar den igen. PDF-läsarnas stöd varierar. Du kan också skriva ut bladen."],
  ["Behöver jag en autismdiagnos?", "Nej. Boken vänder sig till ungdomar och vuxna som har autism eller känner igen sig i erfarenheterna, och till närstående som vill förstå. Den ger allmän kunskap och reflektionsverktyg och ersätter inte utredning, vård eller behandling."],
  ["Kan jag hämta filerna igen?", "I samma webbläsare kan du återvända till nedladdningssidan så länge din bokåtkomst gäller. Byter du webbläsare eller rensar cookies kan support hjälpa dig manuellt. Spara därför gärna filerna direkt efter köpet."],
] as const;
function Purchase({ offer, enabled, label }: { offer: BookOffer; enabled: boolean; label?: string }) {
  return <div className={styles.purchase}><p className={styles.price}>{offer.price} kr {offer.isAnalysisOffer && <span>Ordinarie 149 kr</span>}</p>{enabled ? <BookPurchaseAnalytics productId={AUTISM_BOOK.id} productName={AUTISM_BOOK.name} price={offer.price} offerType={offer.isAnalysisOffer ? "analysis" : "standard"} paymentLink={offer.paymentLink} className={styles.buy}>{label ?? "Köp boken + arbetsbladen"}</BookPurchaseAnalytics> : <span className={styles.paused}>Kommer snart</span>}<p className={styles.purchaseNote}>Engångsköp · Två PDF-filer · Ingen prenumeration</p></div>;
}
export default async function AutismBookPage({ searchParams }: { searchParams: Promise<{ offer?: string | string[] }> }) {
  const offer = getAutismBookOffer((await searchParams).offer);
  // Local development preview only: neither a query string nor a production env can enable this bypass.
  const enabled = AUTISM_BOOK_SALE_ENABLED || (process.env.NODE_ENV === "development" && process.env.AUTISM_BOOK_LOCAL_PREVIEW === "1");
  const structuredData = [
    { "@context": "https://schema.org", "@type": "Book", "@id": `${pageUrl}#book`, name: AUTISM_BOOK.name, author: { "@type": "Person", name: AUTISM_BOOK.author }, bookFormat: "EBook", inLanguage: "sv", numberOfPages: 52, image: mockupUrl, url: pageUrl },
    { "@context": "https://schema.org", "@type": "Product", name: `${AUTISM_BOOK.name} – bok och arbetsblad`, description, image: mockupUrl, url: pageUrl, brand: { "@type": "Brand", name: "Relationsvarning" }, ...(AUTISM_BOOK_SALE_ENABLED ? { offers: { "@type": "Offer", url: pageUrl, price: "149", priceCurrency: "SEK", availability: "https://schema.org/InStock" } } : {}) },
  ];
  return <main className={styles.page}>
    <BookLandingAnalytics productId={AUTISM_BOOK.id} productName={AUTISM_BOOK.name} price={offer.price} offerType={offer.isAnalysisOffer ? "analysis" : "standard"} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <header className={styles.header}><Link href="/" className={styles.brand}>Relationsvarning<span>Kunskap för din vardag</span></Link><a href="#titta-i-boken" className={styles.headerLink}>Titta i boken <span aria-hidden="true">↗</span></a></header>
    <section id="autism-book-hero" className={styles.hero}><div className={styles.heroCopy}>
      <p className={styles.eyebrow}>En digital guide av Elias Voss</p>{offer.isAnalysisOffer && <p className={styles.offerBadge}>Ditt erbjudande efter autismtestet · 99 kr</p>}
      <h1>AUTISM<br /><span>ALL</span><br />INCLUSIVE</h1><p className={styles.subtitle}>En färgstark guide till en lättare vardag.</p><p className={styles.heroDescription}>För dig som lägger mycket kraft på sådant som andra knappt märker. Förstå dina behov, prova något konkret och ge vardagen lite mer utrymme.</p>
      <Purchase offer={offer} enabled={enabled} /><a href="#titta-i-boken" className={styles.heroLink}>Bläddra bland riktiga sidor ↓</a>
    </div><div className={styles.heroVisual}><span className={styles.visualLabel}>BOKEN + ARBETSBLADEN</span><Image src="/autism-all-inclusive-mockup.png" alt="Omslaget till AUTISM ALL INCLUSIVE av Elias Voss, illustrerat som en bok. Produkten levereras digitalt." width={1205} height={1305} priority sizes="(max-width: 760px) 92vw, 48vw" className={styles.mockup} /><p>Digital utgåva. Ingen fysisk bok skickas.</p></div></section>
    <div className={styles.facts}><span><strong>52</strong> sidor i boken</span><span><strong>10</strong> kapitel att använda</span><span><strong>12</strong> A4-sidor med arbetsblad</span><span><strong>Din takt.</strong> Du väljer starten.</span></div>
    <section className={`${styles.section} ${styles.recognition}`}><div><p className={styles.eyebrow}>Det osynliga får ta plats</p><h2>En vanlig dag kan vara<br />ett ganska stort jobb.</h2></div><div><p>Resan dit. Ljuden i rummet. Den otydliga instruktionen. Planen som plötsligt ändras. Och allt du gör för att det inte ska märkas hur mycket det kostar.</p><p>Här får du undersöka vad som faktiskt hjälper dig. Varje kapitel går från igenkänning till ett exempel, en övning och ett arbetsblad. Du behöver inte göra hela boken till ännu en uppgift.</p><p className={styles.pullquote}>Ta en sak. Prova i din vardag.<br />Behåll det som fungerar.</p></div></section>
    <section id="titta-i-boken" className={`${styles.section} ${styles.previewSection}`}><div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Titta innan du bestämmer dig</p><h2>Så här ser boken ut.<br /><em>På riktigt.</em></h2></div><p>Sex utdrag direkt ur PDF-filen. Se formen, läs ett vardagsexempel och kika på ett arbetsblad. Tryck på en sida för att förstora.</p></div><AutismBookPreviewGallery previews={previews} /><p className={styles.smallNote}>Bilderna visar enskilda sidor ur boken. Arbetsbladet är ett märkt utsnitt.</p></section>
    <section className={`${styles.section} ${styles.chapters}`}><div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Tio ingångar till din vardag</p><h2>Börja där<br />det skaver mest.</h2></div><p>Läs i ordning eller välj det kapitel du behöver just nu. Boken innehåller också en sjudagarsplan och en kort bruksanvisning där du samlar det som hjälper.</p></div><ol className={styles.chapterGrid}>{chapters.map(([name, detail], index) => <li key={name}><span className={styles.chapterNumber}>{String(index + 1).padStart(2, "0")}</span><div><h3>{name}</h3><p>{detail}</p></div></li>)}</ol></section>
    <section className={`${styles.section} ${styles.worksheets}`}><div><p className={styles.eyebrow}>Från igenkänning till något att prova</p><h2>Gör plats för<br />dina egna svar.</h2><p>Arbetsbladen finns redan i huvudboken. Du får dessutom ett separat A4-häfte, gjort för att skrivas ut eller fyllas i digitalt.</p><ul><li><strong>12 A4-sidor</strong> med gott om plats för dina anteckningar.</li><li><strong>72 ifyllbara fält</strong> i PDF-läsare som stöder formulär.</li><li><strong>Två separata filer</strong> att hämta och spara efter ett och samma köp.</li></ul><p className={styles.worksheetNote}>Skriv, rita eller ta hjälp av någon som antecknar. Spara en egen kopia efter digital ifyllnad. Huvudbokens arbetsblad är till för utskrift.</p><Purchase offer={offer} enabled={enabled} label="Få boken + arbetsbladen" /></div><figure className={styles.worksheetFigure}><span className={styles.paperTab}>ETT AV BOKENS ARBETSBLAD</span><Image src="/autism-book-previews/read/vardagsprofil.webp" alt="Utsnitt ur Min vardagsprofil, med arbetsbladets första två frågor" width={1200} height={1040} sizes="(max-width: 760px) 85vw, 40vw" /><figcaption>Min vardagsprofil · utdrag från sida 10 i huvudboken. Hela bladet ingår i köpet.</figcaption></figure></section>
    <section className={`${styles.section} ${styles.audience}`}><div><p className={styles.eyebrow}>För dig. Och den som vill förstå dig.</p><h2>Du behöver ingen<br />perfekt utgångspunkt.</h2><p>Boken är skriven för ungdomar och vuxna med autism, för dig som känner igen dig i erfarenheterna och för närstående som vill förstå mer.</p><p className={styles.smallNote}>Den ger allmän kunskap och egna reflektionsverktyg. Den ställer ingen diagnos och ersätter inte individuell vård eller behandling.</p></div><aside><span className={styles.authorMark}>EV</span><p className={styles.eyebrow}>Om författaren</p><h3>Elias Voss</h3><p>Författare till AUTISM ALL INCLUSIVE, utgiven av Relationsvarning.se. Guiden samlar vardagsexempel, förklaringar och övningar i tio kapitel. Faktahänvisningar och vidare läsning finns i bokens källförteckning.</p></aside></section>
    <section className={`${styles.section} ${styles.finalOffer}`}><p className={styles.eyebrow}>En färgstark guide. Ett litet nästa steg.</p><h2>Du får bygga en vardag<br />med mer plats för dig.</h2><p>Hela boken på 52 sidor + 12 A4-sidor med ifyllbara arbetsblad.<br />Läs på mobil, surfplatta eller dator. Spara filerna och återvänd när du vill.</p><Purchase offer={offer} enabled={enabled} /></section>
    <section className={`${styles.section} ${styles.faq}`}><div><p className={styles.eyebrow}>Bra att veta</p><h2>Innan du köper.</h2><p>Undrar du något mer?<br /><a href="mailto:support@relationsvarning.se">Kontakta oss</a>, så hjälper vi dig.</p></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
    {enabled && <AutismBookStickyCta price={offer.price} paymentLink={offer.paymentLink} offerType={offer.isAnalysisOffer ? "analysis" : "standard"} />}
  </main>;
}
