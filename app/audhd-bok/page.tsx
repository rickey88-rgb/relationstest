import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { AUDHD_BOOK } from "../_lib/bookProducts.server";

const stripePaymentLink = "https://buy.stripe.com/8x2aEWgtr2o1gp13EA0gw0t";

export const metadata: Metadata = {
  title: "Världens bästa bok om AuDHD | Relationsvarning",
  description: "En digital bok av Elias Voss om hur ADHD och autism kan samspela i vardagen.",
  alternates: { canonical: "https://www.relationsvarning.se/audhd-bok" },
};

const primaryButton = "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#9d5663] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#844451] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#576f60] sm:w-auto";

export default function AudhdBookPage() {
  return (
    <EditorialSurface>
      <main data-rv="container" className="mx-auto max-w-3xl px-4 py-10 text-neutral-900 sm:px-6 sm:py-14">
        <nav aria-label="Brödsmulor" className="text-sm text-neutral-600">
          <Link href="/" className="underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-700">Relationsvarning</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">AuDHD-bok</span>
        </nav>
        <article>
          <header className="mt-6 rounded-[28px] border border-[#e6d9d7] bg-[#fffaf8] px-5 py-8 shadow-sm sm:px-9 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#9d5663]">Digital bok · PDF</p>
            <h1 className="mt-3 max-w-2xl">{AUDHD_BOOK.name}</h1>
            <p className="mt-4 text-lg leading-8 text-neutral-700">En bok av {AUDHD_BOOK.author} om hur ADHD och autism kan samspela, krocka och märkas i vardagen.</p>
            <p className="mt-5 max-w-2xl leading-7 text-neutral-700">En reflekterande läsning för dig som vill förstå fler nyanser av AuDHD än en enskild etikett eller totalsiffra kan fånga.</p>
            <div className="mt-7">
              <a data-rv="button" href={stripePaymentLink} className={primaryButton}>Köp boken · 149 kr</a>
            </div>
            <p className="mt-3 text-sm text-neutral-600">Engångsbetalning · PDF att ladda ner direkt efter köp</p>
          </header>
          <section className="mt-10 space-y-4 leading-7 text-neutral-700">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">En bok för det som inte alltid syns utåt</h2>
            <p>AuDHD är ett informellt begrepp för samtidig ADHD och autism. Upplevelser kan se olika ut från person till person, och boken är inte en diagnos eller ersättning för vård.</p>
            <p>Efter betalning verifieras köpet säkert och boken öppnas för nedladdning i den här webbläsaren.</p>
          </section>
        </article>
      </main>
    </EditorialSurface>
  );
}
