import Link from "next/link";
import { norwegian } from "../../_content/market";
import { guideLabel, norwegianGuides } from "../../_content/norwegianGuides";
import { norwegianMetadata, site, StructuredData } from "../_components/norwegianSeo";

const title = "AuDHD-test for voksne på norsk";
const description = "Utforsk trekk knyttet til ADHD og autisme i en norsk selvtest med 48 spørsmål og 6 oppfølgingsspørsmål. Få en gratis oppsummering av svarene.";
export const metadata = norwegianMetadata(norwegian.test, title, description);

export default function Page() {
  return <main className="mx-auto max-w-4xl space-y-12 px-5 py-10 text-neutral-900 sm:py-16">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: site + norwegian.test, inLanguage: "nb-NO" }} />
    <section className="space-y-5 rounded-[2rem] border border-neutral-200 bg-[#DDE8E3] p-6 sm:p-10">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">AuDHD-test for voksne</h1>
      <p className="max-w-2xl text-lg leading-8">Hvordan virker oppmerksomhet, sanseinntrykk og behovet for forutsigbarhet sammen i hverdagen din? Denne egenvurderingen hjelper deg med å sortere det du kjenner igjen.</p>
      <Link href={norwegian.questionnaire} className="inline-flex min-h-12 items-center rounded-xl bg-[#202124] px-5 py-3 font-semibold text-white">Start gratis selvtest</Link>
      <p className="text-sm">På bokmål · Uten registrering · Gratis første resultat</p>
    </section>
    <section className="max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold">Slik fungerer testen</h2>
      <p className="leading-7">Svar på 48 spørsmål om hvordan du vanligvis fungerer. Seks oppfølgingsspørsmål om blant annet barndom, ulike miljøer og hverdagsbelastning setter svarene i sammenheng. Du får en gratis oppsummering av det som skiller seg ut.</p>
      <p className="leading-7">Hele rapporten koster {norwegian.reportPrice} NOK som engangsbetaling. Den viser åtte områder, egne ADHD- og autismerelaterte indekser og forslag til neste steg. Du kan lagre den som PDF.</p>
      <p className="leading-7">Testen er en egenvurdering. En diagnose krever utredning. Hvis vanskene påvirker hverdagen din, kan du lese om <Link className="underline" href="/no/audhd-utredning">hvordan fastlegen kan hjelpe deg videre</Link>.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Les mer om AuDHD</h2>
      <ul className="grid gap-3 sm:grid-cols-2">{Object.keys(norwegianGuides).map(slug => <li key={slug}><Link href={`/no/${slug}`} className="block rounded-xl border border-neutral-200 px-4 py-3 underline underline-offset-4">{guideLabel(`/no/${slug}`)}</Link></li>)}</ul>
      <Link href={norwegian.book} className="inline-block py-2 font-semibold underline underline-offset-4">Les et utdrag fra Hjernen i kryssild</Link>
    </section>
  </main>;
}
