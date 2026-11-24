import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { BookLandingAnalytics } from "../_components/BookPurchaseAnalytics";
import { OverthinkingBuyButton } from "../_components/OverthinkingBookActions";
import { STEINLER_BOOK as book } from "../_lib/steinlerBook";
import { bookCheckoutEnabled, steinlerEdition } from "../_lib/overthinkingBook.server";
import styles from "./page.module.css";

const title = `${book.title} | E-bok av My Steinler`;
const description = "En e-bok om manipulation i nära relationer med 15 kommenterade samtal och 10 ifyllningsbara skrivblad. Köp PDF-boken av My Steinler för 149 kr.";
const dialogue = [
  ["Alex", "Kan du föra tillbaka det som gick från räkningskontot? Det saknas till hyran."],
  ["Sam", "Fyrhundra spänn? Jag trodde det fanns mer där."],
  ["Alex", "Det gör det inte. Jag såg det nu."],
  ["Sam", "Måste du stå och prata med mig som om jag vore dum?"],
];
const questions = [
  ["Vad ingår?", "En svensk PDF på 102 sidor med 16 kapitel, 15 kommenterade samtal, 10 ifyllningsbara skrivblad, klickbar innehållsförteckning och källor."],
  ["Hur får jag boken?", "Du kan hämta PDF-filen direkt i samma webbläsare när Stripe har bekräftat betalningen. Det kostar 149 kr vid ett tillfälle."],
  ["Behöver jag ett konto?", "Nej. Gästköp och direktnedladdning fungerar utan inloggning. Vill du öppna boken via Mitt bibliotek senare kan du logga in med samma mejladress som vid betalningen."],
  ["Går det att fylla i på mobilen?", "Ja, i en PDF-läsare som stöder formulär. Du kan också använda frågorna utan att spara dina svar. Skriv eller spara bara där det känns tryggt."],
];

export function generateMetadata(): Metadata {
  const enabled = bookCheckoutEnabled(steinlerEdition);
  const image = { url: book.cover, width: book.width, height: book.height, alt: `Omslag till ${book.title} av ${book.author}` };
  return {
    title, description, alternates: { canonical: book.path }, robots: { index: enabled, follow: true },
    openGraph: { title, description, type: "book", url: book.path, locale: "sv_SE", images: [image] },
    twitter: { card: "summary", title, description, images: [book.cover] },
  };
}

function Buy({ enabled }: { enabled: boolean }) {
  return <div className={styles.buyBlock}>
    <OverthinkingBuyButton enabled={enabled} direct={false} offer={book} className={styles.cta} label="Köp boken – 149 kr" />
    <p>{enabled ? "Engångsköp · Direktnedladdning · Inget konto krävs" : "Kassan öppnar när den säkra leveransen är verifierad."}</p>
  </div>;
}

export default function SteinlerBookPage() {
  const enabled = bookCheckoutEnabled(steinlerEdition);
  const url = `https://www.relationsvarning.se${book.path}`;
  const schema = {
    "@context": "https://schema.org", "@type": "Book", name: book.title, url, description,
    author: { "@type": "Person", name: book.author }, publisher: { "@type": "Organization", name: "Relationsvarning.se" },
    bookFormat: "https://schema.org/EBook", inLanguage: "sv", numberOfPages: 102,
    image: `https://www.relationsvarning.se${book.cover}`,
    ...(enabled ? { offers: { "@type": "Offer", price: 149, priceCurrency: "SEK", availability: "https://schema.org/InStock", url } } : {}),
  };
  return <EditorialSurface>
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      {enabled && <BookLandingAnalytics productId={book.product} productName={book.title} price={book.price} offerType="standard" waitForConsent />}
      <section className={styles.hero} aria-labelledby="book-title">
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.byline}>My Steinler <span aria-hidden="true">·</span> E-bok</p>
            <h1 id="book-title">När du börjar <em>tvivla</em> på dig själv</h1>
            <p className={styles.subtitle}>{book.subtitle}.</p>
            <p className={styles.lead}>Du tog upp en obetald räkning. Tio minuter senare bad du om ursäkt. Räkningen var fortfarande obetald.</p>
            <Buy enabled={enabled} />
          </div>
          <Image src={book.mockup} width={740} height={984} sizes="(max-width: 720px) 66vw, 37vw"
            alt={`Bokomslaget till ${book.title} av My Steinler`} preload className={styles.heroBook} />
        </div>
      </section>

      <section className={styles.twoColumn} id="forhandsvisning" aria-labelledby="preview-title">
        <div>
          <h2 id="preview-title">Vad hände med frågan om hyran?</h2>
          <p>Ett gräl kan börja illa och ändå hitta tillbaka till det som behöver lösas. I det här samtalet byter ämnet plats. Följ vad som händer innan du bestämmer vad det betyder.</p>
          <p>I boken följs varje dialog av det som faktiskt går att observera, vad som fortfarande är osäkert och vilka alternativ som finns om mönstret återkommer.</p>
          <a className={styles.previewLink} href={book.path + "/samtal-ur-boken.webp"} target="_blank" rel="noreferrer">Läs hela boksidan med samtalet <span aria-hidden="true">↗</span></a>
        </div>
        <figure className={styles.dialogue}>
          <figcaption>Ur kapitel 1 · Fyrahundraåttio kronor</figcaption>
          <dl>{dialogue.map(([speaker, line]) => <div key={line}><dt>{speaker}</dt><dd>{line}</dd></div>)}</dl>
        </figure>
      </section>

      <section className={styles.tools} aria-labelledby="tools-title">
        <div className={styles.toolsInner}>
          <h2 id="tools-title">Det här får du arbeta med</h2>
          <div className={styles.cards}>
            <div><h3>15 kommenterade samtal</h3><p>Om att börja ifrågasätta sitt minne, bli ansvarig för någon annans handlingar och märka när en vanlig konflikt går att reparera.</p></div>
            <div><h3>10 ifyllningsbara skrivblad</h3><p>Sortera händelse, reaktion, tolkning och öppen fråga. Följ återkommande mönster eller fundera på var du kan få stöd.</p></div>
            <div><h3>Nästa steg i din vardag</h3><p>Väg alternativ när en gräns behöver få praktisk betydelse, ett cirkelsamtal ska avslutas eller någon utifrån behöver få höra vad som hänt.</p></div>
          </div>
          <a className={styles.previewLink} href={book.path + "/skrivblad-ur-boken.webp"} target="_blank" rel="noreferrer">Se skrivbladet Händelse, upplevelse och tolkning <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className={styles.twoColumn} aria-labelledby="purchase-title">
        <div>
          <h2 id="purchase-title">Läs i din egen takt</h2>
          <p>En svensk fackbok av My Steinler, utgiven av Relationsvarning.se. PDF med klickbar innehållsförteckning, 102 sidor.</p>
          <Buy enabled={enabled} />
        </div>
        <div className={styles.faq}>
          <h3>Vanliga frågor</h3>
          {questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
      </section>

      <aside className={styles.guideLinks} aria-label="Vidare läsning och stöd">
        <p>Läs de öppna guiderna om <Link href="/manipulativ-partner">manipulativa beteenden i relationer</Link> och <Link href="/gaslighting-relation">gaslighting och verklighetsförskjutning</Link>.</p>
        <p>Vid hot, våld eller kontroll finns <Link href="/psykiskt-vald/hjalp">kostnadsfria vägar till stöd</Link>. Vid akut fara, ring 112.</p>
        <Link href="/bocker">Alla böcker</Link>
      </aside>
    </main>
  </EditorialSurface>;
}
