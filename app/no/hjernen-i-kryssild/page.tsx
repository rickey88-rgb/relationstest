import Image from "next/image";
import Link from "next/link";
import { norwegian } from "../../_content/market";
import { NORWEGIAN_BOOK as book } from "../../_lib/norwegianBook";
import { bookCheckoutEnabled, norwegianBookEdition } from "../../_lib/overthinkingBook.server";
import { norwegianMetadata, site, StructuredData } from "../_components/norwegianSeo";
import BookCheckout from "./BookCheckout";

export const metadata = norwegianMetadata(book.path, book.title + " – en e-bok om AuDHD", book.description, { image: book.cover });

export default async function Page({ searchParams }: { searchParams: Promise<{ tilbud?: string }> }) {
  const { tilbud } = await searchParams;
  return <main className="mx-auto max-w-5xl space-y-10 px-5 py-10 text-neutral-900 sm:py-16">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "Book", name: book.title, alternateName: book.subtitle, description: book.description, bookFormat: "https://schema.org/EBook", inLanguage: "nb-NO", numberOfPages: 93, author: { "@type": "Person", name: book.author }, publisher: { "@type": "Organization", name: "Relationsvarning" }, url: site + book.path, image: site + book.cover }} />
    <section className="grid items-center gap-8 rounded-[2rem] border border-neutral-200 bg-[#DDE8E3] p-6 sm:grid-cols-[minmax(200px,1fr)_1.6fr] sm:p-10">
      <Image src={book.cover} width={book.width} height={book.height} alt="Omslaget til Hjernen i kryssild" className="mx-auto h-auto w-full max-w-[255px] rounded-md shadow-lg" preload />
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{book.title}</h1>
        <p className="text-xl">{book.subtitle}</p>
        <p>Av {book.author} · Digital utgave · Bokmål</p>
        <p className="leading-7">Hva gjør du når du både trenger rutiner og blir rastløs av dem? Boka tar utgangspunkt i slike situasjoner og hjelper deg å lete etter rammer som fungerer i din hverdag.</p>
        <Link href={book.excerpt} className="inline-flex min-h-12 items-center rounded-xl border border-neutral-500 px-5 py-3 font-semibold">Les gratis utdrag (PDF)</Link>
        <div id="kjop" className="space-y-2">
          <BookCheckout offer={tilbud === "1"} enabled={bookCheckoutEnabled(norwegianBookEdition)} />
          <p className="text-sm">Engangsbetaling. PDF tilgjengelig etter fullført betaling. Se <Link href="/no/kjopsvilkar" className="underline">kjøpsvilkårene</Link>.</p>
        </div>
      </div>
    </section>
    <section className="max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold">Dette finner du i boka</h2>
      <ul className="list-disc space-y-2 pl-6 leading-7">
        <li>Forklaringer på hvordan ADHD og autisme kan prege den samme hverdagen, med eksempler på planendringer, motivasjon og sanseinntrykk.</li>
        <li>Øvelser som Maskeregnskapet, Minimumsdagen og Startmotoren for å planlegge rundt energien du faktisk har.</li>
        <li>Forslag til tydeligere kommunikasjon og tilrettelegging på jobb, samt en oversikt over hjelp og støtte i Norge.</li>
      </ul>
      <p className="leading-7">Sander Vik er et forfatterpseudonym. Relationsvarning er utgiver.</p>
      <p className="leading-7">Les videre om <Link className="underline" href="/no/audhd-maskering">maskering</Link> og <Link className="underline" href="/no/audhd-voksne">AuDHD i voksenlivet</Link>, eller <Link className="underline" href={norwegian.test}>utforsk de åtte områdene i selvtesten</Link>.</p>
    </section>
  </main>;
}
