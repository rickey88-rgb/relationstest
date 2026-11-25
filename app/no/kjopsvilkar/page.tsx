import Link from "next/link";
import { getLegalIdentity } from "../../_content/legalIdentity";
import { norwegian } from "../../_content/market";
import { norwegianMetadata } from "../_components/norwegianSeo";

export const metadata = norwegianMetadata("/no/kjopsvilkar", "Kjøpsvilkår", "Pris, betaling, levering og angrerett for den norske AuDHD-rapporten og e-boka.", { private: true });

export default function Page() {
  const identity = process.env.LEGAL_RESPONSIBLE_NAME?.trim() && process.env.LEGAL_BUSINESS_ADDRESS?.trim() ? getLegalIdentity() : null;
  return <main className="mx-auto max-w-3xl space-y-7 px-5 py-12 leading-7">
    <h1 className="text-4xl font-semibold">Kjøpsvilkår</h1>
    <p>Du handler hos svenske Relationsvarning. {identity && <>{identity.name}, {identity.postalAddress}. </>}Kundestøtte hjelper deg på <a className="underline" href="mailto:support@relationsvarning.se">support@relationsvarning.se</a>.</p>
    <section className="space-y-3"><h2 className="text-2xl font-semibold">Pris og betaling</h2>
      <p>Full AuDHD-rapport koster {norwegian.reportPrice} NOK. E-boka <em>Hjernen i kryssild</em> koster {norwegian.bookPrice} NOK, eller {norwegian.bookOffer} NOK med et gyldig rapporttilbud. Prisen du ser i betalingsvinduet er totalprisen, inkludert eventuell merverdiavgift. Du betaler én gang via Stripe.</p>
    </section>
    <section className="space-y-3"><h2 className="text-2xl font-semibold">Levering og tilgang</h2>
      <p>Rapporten åpnes i nettleseren når betalingen er bekreftet. Du kan lagre rapporten som PDF. Vi sender en lenke til gjenåpning som er gyldig i 72 timer og kan brukes én gang. E-boka leveres som PDF med nedlasting etter betaling og en nedlastingslenke på e-post. E-postlenken til boka er gyldig i 30 dager. En oppdatert nettleser og vanlig PDF-leser er tilstrekkelig.</p>
    </section>
    <section className="space-y-3"><h2 className="text-2xl font-semibold">Angrerett og reklamasjon</h2>
      <p>Du kan angre kjøpet innen 14 dager fra avtaledagen, også om du åpner rapporten eller laster ned e-boka. Send en tydelig beskjed til <a className="underline" href="mailto:support@relationsvarning.se">support@relationsvarning.se</a>. Oppgi gjerne e-postadressen du betalte med, produktet og kjøpsdatoen for å hjelpe oss å finne betalingen. Vi tilbakebetaler med samme betalingsmiddel innen 14 dager etter at vi mottar beskjeden.</p>
      <p>Du kan bruke <a className="underline" href={norwegian.withdrawalForm}>det offentlige angrerettskjemaet</a>.</p>
      <p>Kontakt oss hvis leveransen mangler eller har en feil. Dine lovfestede rettigheter ved kjøp av digitale ytelser gjelder. Unngå å legge ved testsvar eller selve rapporten når du skriver til oss.</p>
    </section>
    <Link href="/no/personvern" className="underline">Personvernerklæring</Link>
  </main>;
}
