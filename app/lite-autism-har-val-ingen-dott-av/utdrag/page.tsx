import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../../_components/EditorialSurface";
import { OverthinkingBuyButton } from "../../_components/OverthinkingBookActions";
import AutismBookPreviewGallery from "../../autism-bok/AutismBookPreviewGallery";
import { LITE_AUTISM_BOOK as book, LITE_AUTISM_SAMPLE } from "../../_lib/liteAutismBook";
import { bookCheckoutEnabled, liteAutismEdition } from "../../_lib/overthinkingBook.server";
import PreviewLink from "../PreviewLink";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: `Gratis utdrag – ${book.title}`,
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.relationsvarning.se" + book.preview },
};

export default function LiteAutismPreviewPage() {
  const enabled = bookCheckoutEnabled(liteAutismEdition);
  return <EditorialSurface>
    <main className={`${styles.page} ${styles.reader}`}>
      <header className={styles.readerHeader}>
        <Link href={book.path}>← Till bokens sida</Link>
        <h1>Gratis utdrag</h1>
        <p className={styles.subtitle}>{book.title}</p>
        <p>Bläddra bland åtta sidor. Tryck på en sida för att läsa i större format.</p>
        <div className={styles.actions}>
          <PreviewLink position="reader_pdf" pdf className={styles.secondary}>Öppna utdraget som PDF ↗</PreviewLink>
          {enabled && <OverthinkingBuyButton enabled direct={false} offer={book} className={styles.primary} label="Köp e-boken · 149 kr" />}
        </div>
      </header>
      <section className={styles.readerPages} aria-labelledby="sample-pages">
        <h2 id="sample-pages" className="sr-only">Sidor ur boken</h2>
        <AutismBookPreviewGallery previews={LITE_AUTISM_SAMPLE} galleryClassName={styles.readerGallery} />
      </section>
      {enabled && <div className={styles.readerEnd}>
        <h2>Läs hela berättelsen</h2>
        <OverthinkingBuyButton enabled direct={false} offer={book} className={styles.primary} label="Köp e-boken · 149 kr" />
      </div>}
    </main>
  </EditorialSurface>;
}
