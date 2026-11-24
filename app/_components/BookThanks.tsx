import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { BOOK_LIBRARY_PATH, bookDeliveryCover, bookFilePath, bookFiles, type BookId } from "../_lib/bookCatalog";
import { bookThankState, bookThanksCookie, findDeliveryBook } from "../_lib/bookDelivery.server";
import PostPurchaseRecommendation from "./PostPurchaseRecommendation";
import type { ProductId } from "./crossSellConfig";
import styles from "./BookThanks.module.css";

export const bookThanksMetadata: Metadata = {
  title: "Hämta din e-bok",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const recommendations: Partial<Record<BookId, ProductId>> = {
  "audhd-bok": "audhd_book",
  "autism-bok": "autism_book",
  "adhd-deluxe": "adhd_deluxe",
};

export async function BookThanks({ id }: { id: BookId }) {
  const book = findDeliveryBook(id)!;
  const cover = bookDeliveryCover(book);
  const proof = (await cookies()).get(bookThanksCookie(book))?.value ?? null;
  const state = await bookThankState(book, proof);
  const ready = state === "ready";
  const retry = book.path + ("api" in book ? "/tack" : "/tack/klart");
  const recommendation = recommendations[id];

  return (
    <main className={styles.thanks}>
      <div className={styles.thanksCard}>
        <div className={styles.thanksCover}>
          <Image {...cover} alt="" sizes="(max-width: 480px) 104px, 132px" />
        </div>
        <h1>{ready ? "Tack för ditt köp!" : "Kontrollera ditt bokköp"}</h1>
        <p className={styles.thanksBookTitle}>{book.title}</p>
        <p className={styles.thanksAuthor}>{book.author}</p>
        <div className={styles.thanksStatus}>
          {ready ? (
            <>
              <p>Dina filer är redo att laddas ner.</p>
              {bookFiles(book).map(file => (
                <a key={file.id} className={file.id === "book" ? styles.primary : styles.secondary} href={bookFilePath(book, file, "guest")}>
                  {file.id === "book" ? "Hämta din e-bok (PDF)" : file.label}
                </a>
              ))}
            </>
          ) : (
            <>
              <p>{state === "pending"
                ? "Vi har ännu inte kunnat bekräfta betalningen. Om du precis betalade, vänta ett ögonblick och kontrollera igen."
                : "Vi kan inte bekräfta ett köp i den här webbläsaren."}</p>
              {state === "pending" && <a className={styles.secondary} href={retry}>Kontrollera igen</a>}
            </>
          )}
        </div>
        <div className={styles.thanksDetails}>
          <div>
            <h2>Leveransmejl</h2>
            <p>Vid nya köp skickar vi dina personliga nedladdningslänkar till mejladressen från kassan.</p>
          </div>
          <div>
            <h2><Link href={BOOK_LIBRARY_PATH}>Mitt bibliotek</Link></h2>
            <p>Logga in med mejladressen från köpet för att öppna boken och dina eventuella arbetsblad.</p>
          </div>
        </div>
        <div className={styles.thanksLinks}>
          <Link href={book.path}>Till bokens sida</Link>
          <Link href="/kontakt">Behöver du hjälp?</Link>
        </div>
        {ready && recommendation && <PostPurchaseRecommendation sourceProduct={recommendation} />}
      </div>
    </main>
  );
}
