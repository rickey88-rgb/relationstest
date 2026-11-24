import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { LITE_AUTISM_BOOK as book } from "../../_lib/liteAutismBook";
import { guestBookPurchaseReady, liteAutismEdition } from "../../_lib/overthinkingBook.server";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Hämta din e-bok", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

export default async function LiteAutismThanksPage() {
  const proof = (await cookies()).get(liteAutismEdition.cookie)?.value ?? null;
  const ready = proof ? await guestBookPurchaseReady(proof, liteAutismEdition).catch(() => false) : false;

  return (
    <main className={`${styles.page} ${styles.thanks}`}>
      <div className={styles.thanksCard}>
        <div className={styles.thanksCover}>
          <Image src={book.front} alt="" width={1055} height={1491} sizes="(max-width: 480px) 104px, 132px" />
        </div>

        <h1>{ready ? "Tack för ditt köp!" : "Kontrollera ditt bokköp"}</h1>
        <p className={styles.thanksBookTitle}>{book.title}</p>
        <p className={styles.thanksAuthor}>{book.author}</p>

        <div className={styles.thanksStatus}>
          {ready ? (
            <>
              <p>Din e-bok är redo att laddas ner.</p>
              <a className={styles.primary} href={book.api + "/download?guest=1"}>Hämta din e-bok (PDF)</a>
            </>
          ) : (
            <>
              <p>{proof
                ? "Vi har ännu inte kunnat bekräfta betalningen. Om du precis betalade, vänta ett ögonblick och kontrollera igen."
                : "Vi kan inte bekräfta ett köp i den här webbläsaren."}</p>
              {proof && <a className={styles.secondary} href={book.path + "/tack"}>Kontrollera igen</a>}
            </>
          )}
        </div>

        <div className={styles.thanksDetails}>
          <div>
            <h2>Leveransmejl</h2>
            <p>{ready
              ? "Du får också en personlig nedladdningslänk till mejladressen du angav i kassan."
              : "Efter ett bekräftat köp får du en personlig nedladdningslänk via mejl."}</p>
          </div>
          <div>
            <h2><Link href="/mina-sidor?bok=bibliotek#bibliotek">Mitt bibliotek</Link></h2>
            <p>Logga in med mejladressen från köpet för att öppna boken när du vill läsa vidare.</p>
          </div>
        </div>

        <Link className={styles.thanksBack} href={book.path}>Till bokens sida</Link>
      </div>
    </main>
  );
}
