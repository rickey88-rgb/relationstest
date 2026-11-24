import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { LITE_AUTISM_BOOK as book } from "../../_lib/liteAutismBook";
import { guestBookPurchaseReady, liteAutismEdition } from "../../_lib/overthinkingBook.server";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Hämta din e-bok", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

export default async function LiteAutismThanksPage() {
  const proof = (await cookies()).get(liteAutismEdition.cookie)?.value ?? null;
  const ready = proof ? await guestBookPurchaseReady(proof, liteAutismEdition).catch(() => false) : false;
  return <main className={`${styles.page} ${styles.thanks}`}>
    <h1>{ready ? "Tack för ditt köp" : "Kontrollera ditt bokköp"}</h1>
    <p className={styles.subtitle}>{book.title} av {book.author}</p>
    {ready ? <>
      <p>Din e-bok är redo. Du får också en personlig länk via mejl.</p>
      <a className={styles.primary} href={book.api + "/download?guest=1"}>Hämta din e-bok (PDF)</a>
    </> : <>
      <p>{proof ? "Om du precis betalade kan du vänta ett ögonblick och kontrollera igen." : "Öppna länken i ditt leveransmejl eller gå till Mitt bibliotek."}</p>
      {proof && <a className={styles.secondary} href={book.path + "/tack"}>Kontrollera igen</a>}
    </>}
    <p>Logga in med mejladressen du använde vid köpet för att läsa via <Link href="/mina-sidor?bok=bibliotek#bibliotek">Mitt bibliotek</Link>.</p>
    <Link href={book.path}>Till bokens sida</Link>
  </main>;
}
