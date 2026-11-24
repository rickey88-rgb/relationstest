import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { STEINLER_BOOK as book } from "../../_lib/steinlerBook";
import { guestBookPurchaseReady, steinlerEdition } from "../../_lib/overthinkingBook.server";

export const metadata: Metadata = {
  title: "Hämta din e-bok",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export const dynamic = "force-dynamic";

export default async function BookThanksPage() {
  const cookie = (await cookies()).get(steinlerEdition.cookie)?.value ?? null;
  const ready = cookie ? await guestBookPurchaseReady(cookie, steinlerEdition).catch(() => false) : false;
  const button = "mt-6 inline-flex min-h-12 items-center rounded-lg bg-[#27666A] px-5 py-3 font-semibold text-white";
  return (
    <main className="mx-auto min-h-[50vh] max-w-2xl px-5 py-16">
      <h1 className="text-3xl font-semibold">{ready ? "Tack för ditt köp" : "Kontrollera ditt bokköp"}</h1>
      <p className="mt-4 text-lg">{book.title} av {book.author}</p>
      {ready ? (
        <>
          <p className="mt-5 text-sm text-neutral-600">
            Du kan också komma åt din bok när som helst via <Link href="/mina-sidor?bok=bibliotek#bibliotek" className="underline">Mina sidor</Link> → Mitt bibliotek.
            Logga in med samma mejladress som vid köpet.
          </p>
          <a className={button} href={book.api + "/download?guest=1"}>Hämta din e-bok (PDF)</a>
        </>
      ) : cookie ? (
        <>
          <p className="mt-4">Vi kunde ännu inte bekräfta betalningen. Om du redan har betalat, vänta ett ögonblick och kontrollera igen.</p>
          <a className={button} href={book.path + "/tack"}>Kontrollera igen</a>
        </>
      ) : (
        <p className="mt-4">Öppna den här sidan i webbläsaren där du betalade för att hämta boken.</p>
      )}
      <p className="mt-6"><Link className="underline" href={book.path}>Till bokens sida</Link></p>
    </main>
  );
}
