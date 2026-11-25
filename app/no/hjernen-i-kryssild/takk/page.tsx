import Link from "next/link";
import { cookies } from "next/headers";
import { bookFilePath, bookFiles } from "../../../_lib/bookCatalog";
import { bookThanksCookie, bookThankState } from "../../../_lib/bookDelivery.server";
import { NORWEGIAN_BOOK as book } from "../../../_lib/norwegianBook";
import { norwegianMetadata } from "../../_components/norwegianSeo";

export const metadata = norwegianMetadata(book.path, "Last ned e-boka", "Hent e-boka etter betaling.", { private: true });

export default async function Page() {
  const proof = (await cookies()).get(bookThanksCookie(book))?.value ?? null;
  const state = await bookThankState(book, proof);
  return <main className="mx-auto max-w-3xl space-y-5 px-5 py-12">
    <h1 className="text-3xl font-semibold">{state === "ready" ? "Takk for kjøpet!" : "Hent e-boka di"}</h1>
    {state === "ready" ? <>
      <p>Du kan nå laste ned <em>{book.title}</em>.</p>
      <a className="inline-flex min-h-12 items-center rounded-xl bg-[#202124] px-5 py-3 font-semibold text-white" href={bookFilePath(book, bookFiles(book)[0], "guest")}>Last ned e-boka (PDF)</a>
    </> : state === "pending" ? <>
      <p>Vi sjekker betalingen. Vent litt og last siden på nytt.</p>
      <a className="underline" href={book.path + "/takk"}>Sjekk betalingen igjen</a>
    </> : <p>Åpne lenken i e-posten du fikk etter kjøpet, eller åpne denne siden i nettleseren du betalte med.</p>}
    <p>Trenger du hjelp? Kontakt <a className="underline" href="mailto:support@relationsvarning.se">kundestøtte</a>.</p>
    <Link className="underline" href={book.path}>Tilbake til boka</Link>
  </main>;
}
