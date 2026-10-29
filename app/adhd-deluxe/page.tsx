import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookPurchaseAnalytics, { BookLandingAnalytics } from "../_components/BookPurchaseAnalytics";
import { ADHD_DELUXE_BOOK } from "../_lib/bookProducts.server";
import { getAdhdDeluxeBookOffer, type BookOffer } from "../_lib/bookOffers";
import { ADHD_DELUXE_SALE_ENABLED } from "../_lib/featureFlags";
import AdhdDeluxePreviewGallery from "./AdhdDeluxePreviewGallery";
import styles from "./page.module.css";

const pageUrl = "https://www.relationsvarning.se/adhd-deluxe";
const mockupUrl = "https://www.relationsvarning.se/adhd-deluxe/mockup.png";
const title = "ADHD DELUXE – Jobba smartare. Inte hårdare. | Relationsvarning";
const description = "120 sidor om vardagen med ADHD. 14 kapitel, 28 praktiska verktyg och 10 arbetsblad av Elias Voss. Digital bok på svenska, med direkt nedladdning efter betalning.";

export const metadata: Metadata = {
  title, description, alternates: { canonical: pageUrl },
  openGraph: { title, description, url: pageUrl, type: "website", images: [{ url: mockupUrl, width: 1064, height: 1479, alt: "ADHD DELUXE av Elias Voss – Jobba smartare. Inte hårdare." }] },
  twitter: { card: "summary_large_image", title, description, images: [mockupUrl] },
};

const chapters = [
  "Varför du inte kommer igång", "Sluta vänta på motivation", "Tid som faktiskt går att förstå",
  "Ett hem som håller när rutinen spricker", "Pengar utan panik", "Fånga saker innan de försvinner",
  "När uppmärksamheten drar åt olika håll", "Hyperfokus med en väg ut", "Sömn, energi och överbelastning",
  "När känslorna går snabbare än tankarna", "Relationer med tydligare överenskommelser",
  "Arbete, studier och stora ambitioner", "När allting rasar", "Ditt personliga ADHD-system",
] as const;
const tools = [
  ["01", "Startknappen", "Gör den första handlingen så tydlig att du kan se dig själv göra den."],
  ["08", "Gålarmet", "Låt signalen berätta när du behöver avsluta och gå, inte bara när du ska vara framme."],
  ["13", "Inkorgen", "Fånga uppgifter på en plats. Bestäm nästa steg vid ett eget genomgångstillfälle."],
  ["16", "Distraktionsparkeringen", "Ge sådant som dyker upp en plats att vänta medan du gör en annan sak."],
  ["23", "Ägaravtalet", "Gör ansvar, förväntningar och nästa avstämning tydligare tillsammans."],
  ["27", "Återstartsplanen", "Börja med ett grundbehov och något brådskande när planen har fallit isär."],
] as const;
const previews = [
  { src: "/adhd-deluxe/previews/start.webp", fullSrc: "/adhd-deluxe/previews/full/start.webp", alt: "Kapitelöppning: Varför du inte kommer igång", caption: "Sida 8. En vardag att känna igen sig i." },
  { src: "/adhd-deluxe/previews/startknappen.webp", fullSrc: "/adhd-deluxe/previews/full/startknappen.webp", alt: "Verktyg T01: Startknappen", caption: "Sida 10. Ett konkret verktyg med en miniversion." },
  { src: "/adhd-deluxe/previews/minne.webp", fullSrc: "/adhd-deluxe/previews/full/minne.webp", alt: "Verktyg T13: Inkorgen", caption: "Sida 43. Fånga uppgiften, planera sedan." },
  { src: "/adhd-deluxe/previews/arbetsblad.webp", fullSrc: "/adhd-deluxe/previews/full/arbetsblad.webp", alt: "Arbetsblad A01: Min personliga startplan", caption: "Ett av tio separata A4-arbetsblad som ingår." },
] as const;
const faqs = [
  ["Vad får jag när jag köper?", "Den färdiga boken som PDF, 120 sidor på svenska. Dessutom får du tio separata A4-arbetsblad i en samlad ifyllbar PDF och en samlad utskriftsvänlig PDF. Allt ingår i samma köp."],
  ["Hur får jag filerna?", "Efter betalningen hos Stripe kommer du till en skyddad nedladdningssida. Där kan du spara boken och båda arbetsbladsversionerna på din enhet. Åtkomsten bekräftas i den webbläsare du använder vid köpet."],
  ["Kan jag läsa på mobilen?", "Ja, PDF-filerna går att läsa på mobil, surfplatta och dator. Boken har ett fast sidformat, så på en liten skärm behöver du normalt zooma. Det är en digital bok; ingen fysisk bok skickas."],
  ["Hur använder jag arbetsbladen?", "Fyll i dem i en PDF-läsare med formulärstöd och spara en egen kopia, eller skriv ut versionen med skrivlinjer. Bladen gör inga automatiska beräkningar. Du behöver bara börja med det blad som hjälper dig just nu."],
  ["Behöver jag läsa från början till slut?", "Nej. Använd innehållsförteckningen, problemindexet och verktygsregistret för att hitta en situation. Välj ett verktyg och prova dess miniversion. Du kan återvända när du behöver."],
  ["Är boken en behandling eller ett diagnostiskt test?", "Nej. Det är praktiskt vardagsstöd, inte individuell vård, behandling eller utredning. Verktygen är förslag att pröva och har inte effektprövats som ett behandlingsprogram. Källor och begränsningar redovisas i boken."],
  ["Vad händer om jag byter webbläsare?", "Spara filerna på din enhet efter köpet. Om du byter webbläsare eller rensar cookies och behöver hämta dem igen kan support hjälpa dig med betalningsbekräftelsen som underlag."],
] as const;

function BuyButton({ offer, label }: { offer: BookOffer; label?: string }) {
  const localPreview = process.env.NODE_ENV === "development" && process.env.ADHD_DELUXE_LOCAL_PREVIEW === "1";
  if (!ADHD_DELUXE_SALE_ENABLED && !localPreview) return <span className={styles.paused}>Försäljningen öppnar snart</span>;
  return <BookPurchaseAnalytics productId={ADHD_DELUXE_BOOK.id} productName={ADHD_DELUXE_BOOK.name} price={offer.price} offerType={offer.isAnalysisOffer ? "analysis" : "standard"} paymentLink={offer.paymentLink} className={styles.buy}>{label ?? `Köp ADHD DELUXE · ${offer.price} kr`}</BookPurchaseAnalytics>;
}

// Direct book release only. Shared cross-sell switches stay unchanged so test
// results, other books and the Mina sidor candidate keep their existing behavior.
export default async function AdhdDeluxePage({ searchParams }: { searchParams: Promise<{ offer?: string | string[] }> }) {
  const offer = getAdhdDeluxeBookOffer((await searchParams).offer);
  const structuredData = [
    { "@context": "https://schema.org", "@type": "Book", name: ADHD_DELUXE_BOOK.name, alternateName: "Jobba smartare. Inte hårdare.", author: { "@type": "Person", name: ADHD_DELUXE_BOOK.author }, bookFormat: "EBook", inLanguage: "sv", numberOfPages: 120, bookEdition: "1.1", image: mockupUrl, url: pageUrl },
    { "@context": "https://schema.org", "@type": "Product", name: ADHD_DELUXE_BOOK.name, description, image: mockupUrl, brand: { "@type": "Brand", name: "Relationsvarning" }, ...(ADHD_DELUXE_SALE_ENABLED ? { offers: { "@type": "Offer", url: pageUrl, price: "149", priceCurrency: "SEK", availability: "https://schema.org/InStock" } } : {}) },
  ];
  return <main className={styles.page}>
    <BookLandingAnalytics productId={ADHD_DELUXE_BOOK.id} productName={ADHD_DELUXE_BOOK.name} price={offer.price} offerType={offer.isAnalysisOffer ? "analysis" : "standard"} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <nav className={styles.nav} aria-label="Brödsmulor"><Link href="/">Relationsvarning<span aria-hidden="true"> ↗</span></Link><span>/ ADHD DELUXE</span><a href="#utdrag">Bläddra i boken ↓</a></nav>

    <section className={styles.hero} aria-labelledby="book-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.dot} /> En praktisk handbok för vuxna</p>
        <h1 id="book-title">ADHD<br /><span>DELUXE</span></h1>
        <p className={styles.tagline}>Jobba smartare.<br />Inte hårdare.</p>
        <p className={styles.lead}>När du vet vad du behöver göra, men ändå inte kommer igång. När tiden försvinner och en liten uppgift blir ett helt projekt.</p>
        <p className={styles.intro}>Här får du konkreta sätt att göra vardagen lättare att börja med, hålla i och återvända till. Ett verktyg i taget.</p>
        <div className={styles.purchase}>
          {offer.isAnalysisOffer && <p className={styles.offer}>Ditt analyserbjudande: <s>149 kr</s> <strong>99 kr</strong></p>}
          <BuyButton offer={offer} />
          <p className={styles.trust}>Engångsbetalning · PDF på svenska · Arbetsbladen ingår</p>
        </div>
        <p className={styles.byline}>Av <strong>Elias Voss</strong> · Relationsvarning.se</p>
      </div>
      <div className={styles.heroVisual}><div className={styles.bookHalo} aria-hidden="true" /><Image src="/adhd-deluxe/mockup.png" alt="ADHD DELUXE – Jobba smartare. Inte hårdare. Av Elias Voss. Produkten levereras som PDF." width={1064} height={1479} priority sizes="(max-width: 700px) 80vw, (max-width: 1100px) 45vw, 480px" className={styles.mockup} /><span className={styles.format}>Digital bok<br /><strong>Utgåva 1.1</strong></span></div>
    </section>

    <div className={styles.stats} aria-label="Det här ingår"><p><strong>120</strong><span>formgivna boksidor</span></p><p><strong>14</strong><span>kapitel om vardagen</span></p><p><strong>28</strong><span>praktiska verktyg</span></p><p><strong>10</strong><span>separata A4-arbetsblad</span></p></div>

    <section className={styles.section} aria-labelledby="recognition-heading">
      <p className={styles.eyebrow}>Känner du igen dig?</p><h2 id="recognition-heading">Du behöver något som går<br className={styles.desktopBreak} /> att använda en vanlig tisdag.</h2>
      <div className={styles.cards}>
        <article><span className={styles.cardMark}>↗</span><h3>Starten blir för stor</h3><p>Du försöker ta tag i hela uppgiften samtidigt. Boken hjälper dig att se den första handlingen och vad som faktiskt hindrar den.</p></article>
        <article><span className={styles.cardMark}>◷</span><h3>Planen tappar vardagen</h3><p>Tid, övergångar och avbrott behöver också få plats. Här finns verktyg för att planera med det som händer mellan punkterna.</p></article>
        <article><span className={styles.cardMark}>↻</span><h3>En dålig dag blir en omstart</h3><p>När rutinen spricker behöver du en väg tillbaka. Miniversioner och återstartsplaner gör nästa försök mindre att bära.</p></article>
      </div>
    </section>

    <section className={styles.toolsSection} aria-labelledby="tools-heading"><div className={styles.section}>
      <div className={styles.sectionTop}><div><p className={styles.eyebrow}>Små steg, tydliga instruktioner</p><h2 id="tools-heading">Verktyg som börjar<br />där du är.</h2></div><p>Varje verktyg har ett exempel, en miniversion och vägledning om när du kan behöva välja ett annat sätt. Här är sex av de 28.</p></div>
      <div className={styles.toolGrid}>{tools.map(([number, name, text]) => <article key={number}><span>T{number}</span><h3>{name}</h3><p>{text}</p></article>)}</div>
    </div></section>

    <section className={styles.section} id="utdrag" aria-labelledby="preview-heading"><p className={styles.eyebrow}>Se vad du får</p><h2 id="preview-heading">Bläddra innan<br />du bestämmer dig.</h2><p className={styles.sectionLead}>Fyra riktiga utdrag ur den nya utgåvan och arbetsbladen. Tryck för att förstora och välj Läs större för att komma närmare texten. Du kan också använda piltangenterna och stänga med Escape.</p><div className={styles.gallery}><AdhdDeluxePreviewGallery previews={previews} /></div></section>

    <section className={styles.worksheetSection} aria-labelledby="sheets-heading"><div className={styles.worksheetInner}>
      <div className={styles.sheetVisual}><Image src="/adhd-deluxe/previews/full/arbetsblad.webp" alt="Arbetsbladet Min personliga startplan med fem tydliga svarsrubriker" width={1280} height={1810} sizes="(max-width: 700px) 80vw, 350px" className={styles.sheetImage} /><span className={styles.sheetLabel}>Fyll i digitalt<br />eller skriv ut</span></div>
      <div><p className={styles.eyebrow}>Från läsning till ett eget försök</p><h2 id="sheets-heading">Tio arbetsblad.<br />Börja med ett.</h2><p className={styles.sectionLead}>Gör verktygen till dina egna med separata A4-blad för bland annat start, tid, pengar, energi, relationer och återhämtning efter en svår dag.</p><ul className={styles.checklist}><li>Ifyllbar PDF med fem svarsfält per blad.</li><li>En egen version med skrivlinjer för utskrift.</li><li>Alla tio blad ingår i båda versionerna.</li><li>Du väljer vad du vill fylla i och sparar dina svar själv.</li></ul><p className={styles.note}>Boken och arbetsbladen laddas ner som tre separata PDF-filer. Ingen prenumeration eller app behövs.</p></div>
    </div></section>

    <section className={`${styles.section} ${styles.contents}`} aria-labelledby="contents-heading"><div><p className={styles.eyebrow}>Hela innehållet</p><h2 id="contents-heading">Från första steget<br />till ditt eget system.</h2><p className={styles.sectionLead}>Läs i ordning eller slå upp det du behöver. Klickbart problemindex, innehållsförteckning och verktygsregister hjälper dig att hitta tillbaka.</p></div><details className={styles.chapterList}><summary>Se alla 14 kapitel <span aria-hidden="true">+</span></summary><ol>{chapters.map((chapter, index) => <li key={chapter}><span>{String(index + 1).padStart(2, "0")}</span>{chapter}</li>)}</ol></details></section>

    <section className={styles.readerSection} aria-labelledby="reader-heading"><div className={styles.section}><p className={styles.eyebrow}>För dig och din vardag</p><h2 id="reader-heading">Du får välja det<br />som hjälper dig.</h2><div className={styles.readerColumns}><p>Boken vänder sig till vuxna med ADHD och dig som känner igen svårigheter med start, tid, minne, fokus eller överbelastning. Den kan också ge en närstående ett tydligare språk för vardagen.</p><p>Du behöver inte införa 28 nya rutiner. Välj en situation, prova ett verktyg och behåll det som gör nytta. Exemplen är konstruerade för att visa hur ett försök kan se ut.</p></div><p className={styles.readerNote}>Praktiskt stöd med redovisade källor. Ingen diagnos, behandling eller garanti om effekt. Boken ersätter inte individuell vård eller professionell utredning.</p></div></section>

    <section className={`${styles.section} ${styles.faq}`} aria-labelledby="faq-heading"><p className={styles.eyebrow}>Bra att veta före köp</p><h2 id="faq-heading">Vanliga frågor</h2><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className={styles.finalCta} aria-labelledby="buy-heading"><p className={styles.eyebrow}>ADHD DELUXE · Elias Voss</p><h2 id="buy-heading">En lättare väg in<br />i det du behöver göra.</h2><p>120 sidor, 28 verktyg och tio arbetsblad.<br />Börja där det fastnar idag.</p><BuyButton offer={offer} /><p className={styles.trust}>{offer.isAnalysisOffer ? "Ditt analyserbjudande · Ordinarie pris 149 kr" : "149 kr · Engångsbetalning"}<br />Digital leverans efter betalning · Alla arbetsblad ingår</p><Link href="/">Till Relationsvarning</Link></section>
  </main>;
}
