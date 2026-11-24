import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { BOOK_CATALOG } from "../_lib/bookCatalog";
import { LITE_AUTISM_BOOK } from "../_lib/liteAutismBook";
import { bookCheckoutEnabled, liteAutismEdition } from "../_lib/overthinkingBook.server";
import styles from "./page.module.css";

const url = "https://www.relationsvarning.se/bocker";
const title = "Böcker om relationer, övertänkande, ADHD och autism";
const description = "Bläddra bland Relationsvarnings svenska e-böcker. Läs om berättelser, guider och arbetsblad och öppna gratis förhandsvisningar. Böckerna kostar 149 kr styck.";

export const metadata: Metadata = {
  title, description, alternates: { canonical: url },
  openGraph: { title, description, url, type: "website" },
};

export default function BookstorePage() {
  const liteAutismForSale = bookCheckoutEnabled(liteAutismEdition);
  return (
    <EditorialSurface>
      <main data-rv="wide-container" className={styles.store}>
        <header className={styles.intro}>
          <h1>Böcker</h1>
          <p>Digitala berättelser och guider för vardagen. Läs om varje bok, titta på förhandsvisningen och välj var du vill börja.</p>
        </header>
        <ul className={styles.grid}>
          {BOOK_CATALOG.filter(book => book.id !== LITE_AUTISM_BOOK.id || liteAutismForSale).map(book => (
            <li key={book.id}>
              <Link href={book.path} className={styles.card}>
                <div className={styles.cover}>
                  <Image src={book.cover} width={book.width} height={book.height} alt=""
                    sizes="(max-width: 539px) 78vw, (max-width: 959px) 41vw, 245px" />
                </div>
                <div className={styles.details}>
                  <p className={styles.author}>{book.author}</p>
                  {book.id === LITE_AUTISM_BOOK.id && <p className="text-sm font-semibold text-[#101b49]">Ny e-bok</p>}
                  <h2>{book.title}</h2>
                  <p className={styles.description}>{book.description}</p>
                  <div className={styles.cardFooter}><span>Läs om boken <span aria-hidden="true">→</span></span><span>{book.price} kr</span></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </EditorialSurface>
  );
}
