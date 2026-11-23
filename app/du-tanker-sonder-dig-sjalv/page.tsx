import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookLandingAnalytics } from "../_components/BookPurchaseAnalytics";
import { OverthinkingBuyButton } from "../_components/OverthinkingBookActions";
import { OVERTHINKING_BOOK as book } from "../_lib/overthinkingBook";
import { bookCheckoutEnabled } from "../_lib/overthinkingBook.server";
import { directPortalEnabled } from "../_lib/testAccounts/directPublic";
import styles from "./page.module.css";

const title = `${book.title} | E-bok om övertänkande`;
const description = "En svensk fackbok av Adrian Falk om oro, ältande och övertänkande. Sju verktyg, åtta ifyllningsbara skrivblad och en fjortondagarsplan. PDF, 149 kr.";

export function generateMetadata(): Metadata {
  return {
    title, description, alternates: { canonical: book.path },
    robots: { index: bookCheckoutEnabled(), follow: true },
    openGraph: { type: "book", title, description, url: book.path, locale: "sv_SE",
      images: [{ url: book.cover, width: 640, height: 960, alt: `Omslag till ${book.title} av ${book.author}` }] },
    twitter: { card: "summary", title, description, images: [book.cover] },
  };
}

const tools = [
  ["Tankeloop-kartan", "Få syn på vad som sätter igång tankarna och vad du gör när de tar fart."],
  ["Problemet eller grubblandet?", "Avgör om det finns något att göra, vilken information du behöver och när din del är klar."],
  ["Osäkerhetstrappan", "Prova att lämna ett litet frågetecken öppet och jämför vad som hände med det du befarade."],
  ["Uppmärksamhetsväxeln", "Flytta fokus tillbaka till en uppgift även medan tanken dröjer sig kvar."],
  ["Beslutsregeln", "Välj nästa steg och bestäm i förväg vad som faktiskt skulle få dig att öppna beslutet igen."],
  ["Sluta kontrollera", "Gör den kontroll som behövs. Pröva att låta den extra vänta när det är tryggt."],
  ["Fjortondagarsplanen", "Följ en vardagsvana och prova ett litet steg i taget."],
];

const questions = [
  ["Vad ingår?", "En digital bok i PDF-format med 120 sidor, fjorton kapitel och åtta ifyllningsbara skrivblad. Innehållsförteckningen är klickbar."],
  ["Hur får jag boken efter köpet?", "När betalningen har bekräftats kan du ladda ner PDF-filen direkt. Du kan köpa som gäst. Vill du kunna hämta boken från Mitt bibliotek på andra enheter, logga in före köpet."],
  ["Kan jag fylla i skrivbladen på mobilen?", "Ja, med en PDF-läsare som stöder ifyllningsbara fält. Spara en kopia för varje försök, skriv ut sidorna eller använd frågorna i en egen anteckning."],
  ["Vad betyder fjorton dagar?", "Du får en stegvis plan för att observera en vana, prova små förändringar och se vad som går att använda i din vardag. Du kan upprepa en dag, pausa eller flytta ett försök."],
  ["Behöver jag ha en diagnos?", "Boken vänder sig till vuxna som känner igen oro, ältande eller övertänkande. Den ger allmän kunskap och vardagsövningar och beskriver när professionell bedömning kan behövas."],
];

export default function OverthinkingBookPage() {
  const enabled = bookCheckoutEnabled();
  const direct = directPortalEnabled();
  const url = `https://www.relationsvarning.se${book.path}`;
  const structuredData = {
    "@context": "https://schema.org", "@type": "Book", name: book.title, description, url,
    author: { "@type": "Person", name: book.author },
    publisher: { "@type": "Organization", name: "Relationsvarning.se" },
    bookFormat: "https://schema.org/EBook", inLanguage: "sv", numberOfPages: 120,
    image: `https://www.relationsvarning.se${book.cover}`,
    ...(enabled ? { offers: { "@type": "Offer", price: book.price, priceCurrency: "SEK", availability: "https://schema.org/InStock", url } } : {}),
  };

  return <main className={styles.page} data-overthinking-book>
    {enabled && <BookLandingAnalytics productId={book.product} productName={book.title} price={book.price} offerType="standard" waitForConsent />}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\u005cu003c") }} />
    <section className={styles.hero} aria-labelledby="book-title">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Adrian Falk <span>·</span> Digital fackbok</p>
          <h1 id="book-title">Du tänker <em>sönder</em> dig själv</h1>
          <p className={styles.subtitle}>{book.subtitle}</p>
          <p className={styles.heroLead}>Du har läst om meddelandet fyra gånger. Det står fortfarande samma sak. Nu återstår frågan om vad du vill lägga resten av kvällen på.</p>
          <a className={styles.primary} href="#kop">Se erbjudandet · 149 kr</a>
          <p className={styles.spec}>PDF · 120 sidor · 8 ifyllningsbara skrivblad</p>
        </div>
        <div className={styles.heroArt}>
          <Image src={book.mockup} width={900} height={833} sizes="(max-width: 760px) 90vw, 48vw"
            alt={`Bokomslaget till ${book.title} av ${book.author}`} preload className={styles.mockup} />
        </div>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="recognition">
      <div>
        <p className={styles.eyebrow}>När tankarna tar över</p>
        <h2 id="recognition">Torsdagen är redan löst.</h2>
      </div>
      <div>
        <blockquote className={styles.message}>”Visst.”</blockquote>
        <p>Ni har bestämt när ni ska ses. Ändå har den där punkten fått en kväll av ditt liv. I boken får du syn på vad som händer när en rimlig fråga blir ett försök att få ett besked ingen kan ge dig.</p>
        <p>Du följer grubblandet från natten till inkorgen, relationen och jobbet. Du lär dig skilja ett problem som går att påverka från en tankeloop. I relationer får du också hjälp att skilja en tolkning från faktiska beteenden som behöver tas på allvar.</p>
      </div>
    </section>

    <section className={styles.dark} aria-labelledby="tools">
      <div className={styles.toolsInner}>
        <div>
          <p className={styles.eyebrow}>Sju praktiska verktyg</p>
          <h2 id="tools">Vad gör du när huvudet vill ta ett varv till?</h2>
          <p>Välj ett verktyg som passar en situation du redan känner igen.</p>
        </div>
        <dl className={styles.toolList}>
          {tools.map(([name, detail]) => <div key={name}><dt>{name}</dt><dd>{detail}</dd></div>)}
        </dl>
      </div>
    </section>

    <section className={`${styles.section} ${styles.practice}`} aria-labelledby="practice">
      <div>
        <p className={styles.eyebrow}>Fjorton dagar i din egen takt</p>
        <h2 id="practice">Prova på en helt vanlig måndag.</h2>
        <p>Välj en vardagsvana med låg risk. Lägg märke till vad som händer, gör ett litet försök och ta reda på vad som blev möjligt.</p>
        <div className={styles.week}>
          <h3>Vecka 1 · Lägg märke till loopen</h3>
          <p>Fånga ett återkommande tillfälle. Skriv vad oron försöker lösa och pröva en liten förändring.</p>
        </div>
        <div className={styles.week}>
          <h3>Vecka 2 · Prova ett annat svar</h3>
          <p>Låt en extrakontroll vänta, gör ett avgränsat val och spara det som gick att använda.</p>
        </div>
      </div>
      <figure className={styles.sheet}>
        <Image src={book.worksheet} width={620} height={1158} alt="Skrivbladet Tankeloop-kartan med sex ifyllningsbara fält" sizes="(max-width: 760px) 80vw, 300px" />
        <figcaption>Tankeloop-kartan, ett av åtta skrivblad i PDF-filen.</figcaption>
      </figure>
    </section>

    <section className={styles.offer} id="kop" aria-labelledby="offer">
      <div className={styles.offerInner}>
        <Image src={book.cover} width={640} height={960} alt={`Framsidan till ${book.title}`} sizes="(max-width: 600px) 128px, 190px" />
        <div>
          <h2 id="offer">{book.title}</h2>
          <p className={styles.offerByline}>{book.author} · Relationsvarning.se</p>
          <p>120 sidor med sju verktyg, åtta ifyllningsbara skrivblad och en fjortondagarsplan. Ett engångsköp med PDF direkt efter betalning.</p>
          <div className={styles.checkout}>
            <OverthinkingBuyButton enabled={enabled} direct={direct} className={styles.primary} />
          </div>
          <p className={styles.spec}>{enabled ? "Du kan köpa utan konto. Betalningen sker via Stripe." : "Kassan öppnar när boken lanseras."}</p>
          {enabled && <p className={styles.spec}><Link href="/mina-sidor?bok=kop#bibliotek">Logga in före köpet</Link> om du vill spara boken i Mitt bibliotek.</p>}
        </div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.faq}`} aria-labelledby="faq">
      <h2 id="faq">Vanliga frågor</h2>
      <div>{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>
  </main>;
}
