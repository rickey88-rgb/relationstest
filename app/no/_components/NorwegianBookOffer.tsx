"use client";

import Link from "next/link";
import { norwegian } from "../../_content/market";

export default function NorwegianBookOffer() {
  return <aside className="mt-8 rounded-3xl border border-neutral-200 bg-[#DDE8E3] p-6">
    <h2 className="text-xl font-semibold">Ta med innsikten inn i hverdagen</h2>
    <p className="mt-2">I <em>Hjernen i kryssild</em> finner du øvelser for struktur, sanseinntrykk og restitusjon. Etter kjøpet av rapporten kan du få e-boka for {norwegian.bookOffer} NOK.</p>
    <Link href={norwegian.book + "?tilbud=1#kjop"} className="mt-3 inline-block py-2 font-semibold underline underline-offset-4">Se boka og les et utdrag</Link>
  </aside>;
}
