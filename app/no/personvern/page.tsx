import Link from "next/link";
import { getLegalIdentity } from "../../_content/legalIdentity";
import { norwegianMetadata } from "../_components/norwegianSeo";

export const metadata = norwegianMetadata("/no/personvern", "Personvern", "Hvordan Relationsvarning behandler opplysninger i den norske selvtesten og bokhandelen.", { private: true });

export default function Page() {
  const identity = process.env.LEGAL_RESPONSIBLE_NAME?.trim() && process.env.LEGAL_BUSINESS_ADDRESS?.trim() ? getLegalIdentity() : null;
  return <main className="mx-auto max-w-3xl space-y-7 px-5 py-12 leading-7">
    <h1 className="text-4xl font-semibold">Personvern</h1>
    <p>Relationsvarning drives fra Sverige. {identity && <>{identity.name}, {identity.postalAddress}, er behandlingsansvarlig. </>}Du kan kontakte oss på <a className="underline" href="mailto:support@relationsvarning.se">support@relationsvarning.se</a>.</p>
    <section className="space-y-3"><h2 className="text-2xl font-semibold">Selvtesten og rapporten</h2>
      <p>Nettleseren lagrer svarene lokalt slik at du kan fortsette senere. Når du velger å kjøpe rapporten og samtykker uttrykkelig til behandlingen, sender nettleseren svarene til oss for å gjøre rapporten tilgjengelig. Svarene kan inneholde helseopplysninger. De lagres kryptert i et midlertidig kjøpsutkast i opptil sju dager. Nettleseren bruker nødvendige informasjonskapsler for å åpne riktig rapport etter betaling.</p>
      <p>Du kan trekke samtykket til behandling av testsvar tilbake ved å kontakte oss. Da kan det bli umulig å åpne rapporten på nytt. Du kan selv slette den lokale kopien via nettleserens innstillinger.</p>
    </section>
    <section className="space-y-3"><h2 className="text-2xl font-semibold">Betaling og levering</h2>
      <p>Stripe håndterer betalingen og betalingsopplysningene. Vi behandler kjøpsreferanse, pris og betalingsstatus for å levere kjøpet, gi kundestøtte og oppfylle regnskapsplikten. Resend leverer e-post med lenker til kjøpet. Vi bruker Vercel til nettstedet og Supabase til databasen og privat lagring av e-boka. Leverandører kan bruke underleverandører utenfor EØS. Kontakt oss for opplysninger om overføringsgrunnlag.</p>
    </section>
    <section className="space-y-3"><h2 className="text-2xl font-semibold">Valgfri statistikk</h2>
      <p>Hvis du godtar statistikk, bruker vi Google Analytics til å måle besøk, fremdrift og kjøp. Statistikken inneholder ingen testsvar, poeng, rapporttekst eller e-postadresse. Du kan endre valget med Statistikkinnstillinger nederst på siden.</p>
    </section>
    <section className="space-y-3"><h2 className="text-2xl font-semibold">Dine rettigheter</h2>
      <p>Du kan be om innsyn, retting, sletting eller begrensning, og om å få utlevert opplysninger der reglene gir deg rett til det. Du kan klage til en tilsynsmyndighet, for eksempel Datatilsynet i Norge eller Integritetsskyddsmyndigheten i Sverige. Opplysninger vi må beholde etter loven kan lagres videre.</p>
    </section>
    <Link href="/no/kjopsvilkar" className="underline">Kjøpsvilkår</Link>
  </main>;
}
