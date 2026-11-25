import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { BookLandingAnalytics } from "../_components/BookPurchaseAnalytics";
import { OverthinkingBuyButton } from "../_components/OverthinkingBookActions";
import { LITE_AUTISM_BOOK as book, LITE_AUTISM_SAMPLE } from "../_lib/liteAutismBook";
import { bookCheckoutEnabled, liteAutismEdition } from "../_lib/overthinkingBook.server";
import PreviewLink from "./PreviewLink";
import styles from "./page.module.css";

const origin = "https://www.relationsvarning.se";
const url = origin + book.path;
const title = `${book.title} – illustrerad e-bok`;
const seoDescription = "En illustrerad e-bok om att leva med autism. Följ fiktiva Ellie genom maskering, vänskap och vardagskaos. Av Ellie Lind. Läs ett gratis utdrag.";

const chapters = [
  ["Att passa in", "Det inövade småpratet, de lånade ansiktsuttrycken och tystnaden på bussen hem."],
  ["När planen får fnatt", "En inställd loppis, en skrikande kundvagn och tryggheten i precis samma pasta."],
  ["Att vilja vara nära", "En första kyss under en läckande markis. En öppen hand mellan två täcken."],
  ["När orken tar slut", "Allt det svåra som pågår bakom en vänlig min i lånedisken."],
];

const faq = [
  ["Hur får jag boken?", "Efter bekräftad betalning kan du hämta PDF-filen direkt. Du får också en personlig nedladdningslänk till mejladressen du anger i kassan."],
  ["Behöver jag skapa ett konto?", "Gästköp fungerar direkt. Om du vill öppna boken senare i Mitt bibliotek på Mina sidor loggar du in med mejladressen från köpet."],
  ["Kan jag läsa i mobilen?", "Ja. Boken öppnas i en vanlig PDF-läsare och har markerbar text, bokmärken och klickbar innehållsförteckning."],
  ["Behöver jag ha en diagnos för att läsa?", "Boken vänder sig till både den som själv känner igen sig och den som vill förstå någon nära. Ellie är bokens fiktiva huvudperson."],
];

export function generateMetadata(): Metadata {
  const forSale = bookCheckoutEnabled(liteAutismEdition);
  const image = { url: book.social, width: 1200, height: 630, alt: `Omslag till ${book.title}` };
  return {
    title: { absolute: title }, description: seoDescription,
    alternates: { canonical: url }, robots: { index: forSale, follow: true },
    openGraph: { title, description: seoDescription, type: "book", url, locale: "sv_SE", images: [image] },
    twitter: { card: "summary_large_image", title, description: seoDescription, images: [book.social] },
  };
}

function Buy({ enabled }: { enabled: boolean }) {
  return <OverthinkingBuyButton enabled={enabled} direct={false} offer={book} className={styles.primary}
    label={`Köp e-boken · ${book.price} kr`} />;
}

export default function LiteAutismBookPage() {
  const enabled = bookCheckoutEnabled(liteAutismEdition);
  const cover = origin + book.front;
  const description = book.description;
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Book", "@id": url + "#book", name: book.title, alternativeHeadline: book.subtitle, url, description,
        image: cover, author: { "@type": "Person", name: book.author }, publisher: { "@type": "Organization", name: book.publisher },
        bookFormat: "https://schema.org/EBook", inLanguage: "sv", numberOfPages: book.pages, datePublished: "2026" },
      { "@type": "Product", "@id": url + "#product", name: book.title, sku: book.product, url, description, image: cover,
        brand: { "@type": "Brand", name: book.publisher },
        ...(enabled ? { offers: { "@type": "Offer", url, price: book.price, priceCurrency: "SEK", availability: "https://schema.org/InStock" } } : {}) },
    ],
  };
  const thumbnails = LITE_AUTISM_SAMPLE.filter(page => [10, 15, 24].includes(page.page));
  return <EditorialSurface>
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
      {enabled && <BookLandingAnalytics productId={book.product} productName={book.title} price={book.price} offerType="standard" waitForConsent />}
      <section className={styles.hero} aria-labelledby="book-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.byline}>{book.author} <span aria-hidden="true">·</span> Illustrerad e-bok</p>
            <h1 id="book-title">Lite autism har väl <em>ingen dött av</em></h1>
            <p className={styles.subtitle}>{book.subtitle}</p>
            <p className={styles.heroLead}>För dig som får det att se lätt ut och behöver hela nästa dag för att återhämta dig.</p>
            <div className={styles.actions} id="kop">
              <Buy enabled={enabled} />
              <PreviewLink position="hero" className={styles.secondary}>Läs gratis utdrag <span aria-hidden="true">↗</span></PreviewLink>
            </div>
            <p className={styles.purchaseNote}>{enabled ? "PDF · Direkt efter köp · Inget konto krävs" : "Gratisutdraget går att läsa redan nu."}</p>
          </div>
          <div className={styles.heroArt}>
            <Image {...book.productMockup} alt={`Bokomslag till ${book.title}, med Relationsvarnings spöke`}
              preload sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 510px" />
          </div>
        </div>
      </section>
      <dl className={styles.specs} aria-label="Bokinformation">
        <div><dt>Omfång</dt><dd>{book.pages} sidor</dd></div>
        <div><dt>Berättelse</dt><dd>{book.chapters} kapitel</dd></div>
        <div><dt>Bildvärld</dt><dd>{book.illustrations} illustrationer</dd></div>
        <div><dt>Pris</dt><dd>{book.price} kr</dd></div>
      </dl>
      <section className={styles.story} aria-labelledby="story-title">
        <div>
          <h2 id="story-title">Möt Ellie</h2>
          <p>Hon är tjugofem, jobbar på bibliotek och kan mer om gamla busslinjer än om hur man avslutar ett telefonsamtal. När hon erbjuder sig att ordna en födelsedagsmiddag åt sin vän Maja låter det nästan enkelt.</p>
          <p>Sedan ska det svaras på ett sms om efterrätt. Någon ändrar en plan. Och mitt i allt försöker Ellie hålla reda på vilka människor hon faktiskt vill ha nära.</p>
          <p>En varm, självironisk och fiktiv vardagsskildring om livet med autism som vuxen kvinna. Den kretsar kring vad det kan kosta att verka som vem som helst och vad som händer när man börjar säga hur man egentligen har det.</p>
        </div>
        <figure className={styles.quote}>
          <blockquote>”Det enda telefonsamtal jag har inlett utan förberedelse i vuxen ålder var ett feltryck.”</blockquote>
          <figcaption>Ur kapitel 3</figcaption>
        </figure>
      </section>
      <section className={styles.preview} aria-labelledby="preview-title">
        <div className={styles.previewInner}>
          <div className={styles.previewIntro}>
            <div><h2 id="preview-title">Bläddra i boken</h2><p>Åtta riktiga boksidor. Läs om maskering, jobbtelefonen och en lördag som plötsligt tar en annan väg.</p></div>
            <PreviewLink position="preview_section" className={styles.secondary}>Läs gratis utdrag <span aria-hidden="true">↗</span></PreviewLink>
          </div>
          <div className={styles.spreads}>
            {thumbnails.map(page => <figure key={page.page}>
              <Image src={page.src} alt={`Illustrerad originalsida ${page.page}. ${page.title}`} width={page.width} height={page.height} sizes="(max-width: 540px) 59vw, 29vw" />
              <figcaption>{page.caption}</figcaption>
            </figure>)}
          </div>
        </div>
      </section>
      <section className={styles.chapters} aria-labelledby="chapters-title">
        <h2 id="chapters-title">Sådant Ellie sällan berättar</h2>
        <div className={styles.chapterGrid}>{chapters.map(([heading, copy]) =>
          <div key={heading}><h3>{heading}</h3><p>{copy}</p></div>)}</div>
      </section>
      <section className={styles.end} aria-labelledby="purchase-title">
        <div className={styles.endInner}>
          <figure><blockquote>”Jag är väldigt väluppfostrad i de lägen där det hjälper mig minst.”</blockquote><figcaption>Ur kapitel 3</figcaption></figure>
          <div><h2 id="purchase-title">Läs vidare i din egen takt</h2>
            <p><strong>{book.title}</strong><br />{book.author} · {book.publisher}</p>
            <p>En engångsbetalning på {book.price} kr inklusive moms.</p>
            <Buy enabled={enabled} />
          </div>
        </div>
      </section>
      <section className={styles.faq} aria-labelledby="faq-title">
        <h2 id="faq-title">Frågor om boken och köpet</h2>
        {faq.map(([heading, copy]) => <details key={heading}><summary>{heading}</summary><p>{copy}</p></details>)}
        <p>Vill du läsa om vad maskering kan innebära i vardagen? Se guiden om <Link href="/maskering-autism" className="underline underline-offset-4">maskering vid autism</Link> eller läs om <Link href="/autism-kvinnor" className="underline underline-offset-4">autism hos kvinnor</Link>.</p>
        <p>För vardagsövningar och ifyllbara arbetsblad finns kunskapsboken <Link href="/autism-bok" className="underline underline-offset-4">AUTISM ALL INCLUSIVE</Link> av Elias Voss.</p>
        <p className={styles.back}><Link href="/bocker">Se alla böcker från Relationsvarning</Link></p>
      </section>
    </main>
  </EditorialSurface>;
}
