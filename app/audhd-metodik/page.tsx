import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { ContentGuide, GuideSection, textLink } from "../_components/ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";

const title = "AuDHD-testets metodik och källor | Relationsvarning";
const description = "Så fungerar Relationsvarnings AuDHD-test: frågor, åtta områden, resultatprofil, begränsningar och källor. Testet är en självskattning för vuxna och inte diagnostik.";
const datePublished = "2026-10-24T12:00:00+02:00";
const article = getEditorialArticleSchema({ route: "/audhd-metodik", title, description, datePublished, dateModified: datePublished });

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  ...getEditorialMetadata({ route: "/audhd-metodik", title, description, datePublished, dateModified: datePublished }),
};

const areas = [
  "Uppmärksamhet och exekutiv funktion",
  "Impulsivitet och rastlöshet",
  "Social kommunikation",
  "Rutiner och flexibilitet",
  "Sensorisk känslighet",
  "Masking och kompensation",
  "AuDHD-friktion",
  "Vardagspåverkan",
];

export default function AudhdMethodologyPage() {
  const supplementalSchema = [{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Relationsvarning", item: "https://www.relationsvarning.se/" },
      { "@type": "ListItem", position: 2, name: "Metodik och källor för AuDHD-testet", item: "https://www.relationsvarning.se/audhd-metodik" },
    ],
  }];

  return <EditorialSurface><ContentGuide title="Metodik och källor för AuDHD-testet" intro="Här förklarar vi vad Relationsvarnings AuDHD-test undersöker, hur svaren sammanställs och vilka begränsningar som är viktiga att känna till.">
    <EditorialArticleJsonLd data={article} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(supplementalSchema).replace(/</g, "\\u003c") }} />

    <GuideSection title="Syfte och avgränsning">
      <p>AuDHD-testet har utvecklats av Relationsvarning.se för att ge vuxna en mer nyanserad självskattning av ADHD- och autismrelaterade drag och hur dessa kan samspela i vardagen.</p>
      <p>AuDHD är ett informellt begrepp för samtidig ADHD och autism, inte en egen diagnos. Testet kan hjälpa dig att strukturera egna observationer, men kan inte avgöra om du har ADHD, autism eller båda.</p>
    </GuideSection>

    <GuideSection title="Frågor och svarsskala">
      <p>Testet innehåller 48 huvudfrågor. Du svarar på en femgradig skala utifrån hur du brukar fungera över längre tid.</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Aldrig</li>
        <li>Sällan</li>
        <li>Ibland</li>
        <li>Ofta</li>
        <li>Nästan alltid</li>
      </ul>
      <p>Frågorna kommer i blandad ordning i stället för områdesvis. Det ska minska risken att ett synligt frågeblock styr hur man svarar, men är inte ett mått på testets kliniska träffsäkerhet.</p>
    </GuideSection>

    <GuideSection title="Sex frågor som sätter svaren i sammanhang">
      <p>Efter huvudfrågorna följer sex kompletterande frågor. De handlar om barndom, om liknande mönster märks i flera delar av livet, påverkan på arbete eller studier, relationer och socialt liv, energi som går åt till strategier samt om svårigheterna främst har blivit tydliga under senare år.</p>
      <p>De kompletterande svaren används för att nyansera resultatet om vardagspåverkan och utvecklingskontext. De ändrar inte testets ADHD-relaterade eller autismrelaterade index.</p>
    </GuideSection>

    <GuideSection title="Åtta kartläggningsområden">
      <p>Huvudfrågorna är fördelade över följande områden:</p>
      <ul className="list-disc space-y-2 pl-6">{areas.map((area) => <li key={area}>{area}</li>)}</ul>
      <p>Områdena redovisas var för sig så att viktiga skillnader inte försvinner i en enda totalsiffra.</p>
    </GuideSection>

    <GuideSection title="ADHD- och autismrelaterade svar hålls isär">
      <p>Två sammansatta index beskriver ADHD-relaterade respektive autismrelaterade svar. De hålls isär eftersom områden kan överlappa, men också skilja sig åt. Det gör det möjligt att visa en mer ojämn eller blandad profil utan att behandla alla svar som samma sak.</p>
      <p>Det ligger i linje med kunskapsunderlag som beskriver både överlapp och skillnader mellan ADHD och autism. <a className={textLink} href="https://www.vardochinsats.se/adhd/om-tillstaandet/adhd-och-autism/">Nationella vård- och insatsprogram om ADHD och autism</a> och <a className={textLink} href="https://pubmed.ncbi.nlm.nih.gov/38387375/">Waldren m.fl. (2024)</a> ger bakgrund till den allmänna informationen, men validerar inte Relationsvarnings modell.</p>
    </GuideSection>

    <GuideSection title="Masking, friktion och vardagspåverkan">
      <p>Masking och kompensation handlar här om egna upplevelser av exempelvis förberedelser, inlärda strategier, aktiv anpassning och återhämtning. De redovisas separat och används inte som bevis för ADHD, autism eller AuDHD.</p>
      <p>AuDHD-friktion beskriver upplevda krockar mellan behov, till exempel att vilja ha struktur men samtidigt ha svårt att följa den. Det är Relationsvarnings eget beskrivande område, inte ett etablerat diagnostiskt mått.</p>
      <p>Vardagspåverkan sätter svaren i relation till bland annat arbete, studier, relationer, energi och återhämtning. Forskning om camouflaging ger bakgrund till begreppet masking, men inte ett diagnostiskt facit för en enskild person. <a className={textLink} href="https://pubmed.ncbi.nlm.nih.gov/34563942/">Cook m.fl. (2021)</a></p>
    </GuideSection>

    <GuideSection title="Så ska 0–100-skalan förstås">
      <p>Svaren inom varje område räknas om till en jämförbar intern skala från 0 till 100. Skalan visar hur svaren fördelar sig inom just detta test.</p>
      <p>Ett värde på skalan är inte en procentsannolikhet för diagnos, ett kliniskt gränsvärde eller ett mått på hur väl någon fungerar i allmänhet.</p>
    </GuideSection>

    <GuideSection title="Den regelstyrda resultatprofilen">
      <p>Resultattexterna följer förutbestämda regler i Relationsvarnings egen modell. Profilen sammanställer de två huvudindexen, de åtta områdena, relativa toppar och kontraster samt uppgifter om masking, friktion, vardagspåverkan och utvecklingskontext.</p>
      <p>Resultatet lyfter också sådant som gör bilden mindre självklar. Det kan till exempel handla om att aktuella svar och uppgifter om tid eller vardagspåverkan inte pekar åt samma håll. En sådan nyansering är inte en differentialdiagnos och ersätter inte professionell bedömning.</p>
    </GuideSection>

    <GuideSection title="Vad resultatet kan och inte kan säga">
      <p>Resultatet kan hjälpa dig att strukturera egna observationer, se vilka områden som framträder mest i dina svar och formulera frågor för fortsatt reflektion eller ett samtal om stöd.</p>
      <p>Resultatet kan inte fastställa eller utesluta ADHD, autism eller AuDHD. Det kan inte heller avgöra vilken vård, behandling eller anpassning som passar en enskild person. Långvarig stress, sömnproblem, ångest, depression, trauma och andra förhållanden kan påverka liknande områden.</p>
      <p>En neuropsykiatrisk utredning är bredare och kan väga in utvecklingshistoria, vardagspåverkan, andra möjliga förklaringar och professionell bedömning. <a className={textLink} href="https://www.1177.se/stockholm/undersokning-behandling/undersokningar-och-provtagning/psykiatriska-utredningar/neuropsykiatrisk-utredning/">1177 om neuropsykiatrisk utredning</a> · <a className={textLink} href="https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/nationella-riktlinjer/riktlinjer-och-utvarderingar/adhd-och-autism/">Socialstyrelsens nationella riktlinjer för ADHD och autism</a></p>
    </GuideSection>

    <GuideSection title="Forskningsbakgrund och källor">
      <p>Källorna nedan används som bakgrund till den allmänna informationen om ADHD, autism, överlapp, masking och utredning. De validerar inte Relationsvarnings frågor, viktningar, resultatnivåer eller träffsäkerhet.</p>
      <ul className="space-y-3 text-sm">
        <li><a className={`inline-flex min-h-11 items-center ${textLink}`} href="https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/nationella-riktlinjer/riktlinjer-och-utvarderingar/adhd-och-autism/">Socialstyrelsen: Nationella riktlinjer för ADHD och autism</a> – bakgrund om vård, stöd och utredning.</li>
        <li><a className={`inline-flex min-h-11 items-center ${textLink}`} href="https://www.1177.se/stockholm/undersokning-behandling/undersokningar-och-provtagning/psykiatriska-utredningar/neuropsykiatrisk-utredning/">1177: Neuropsykiatrisk utredning</a> – information om vad en utredning kan omfatta.</li>
        <li><a className={`inline-flex min-h-11 items-center ${textLink}`} href="https://www.vardochinsats.se/adhd/om-tillstaandet/adhd-och-autism/">Nationella vård- och insatsprogram: ADHD och autism</a> – bakgrund om överlapp och skillnader mellan ADHD och autism.</li>
        <li><a className={`inline-flex min-h-11 items-center ${textLink}`} href="https://pubmed.ncbi.nlm.nih.gov/38387375/">Waldren m.fl. (2024): Unpacking the overlap between Autism and ADHD in adults</a> – vuxenforskning om överlapp och särskiljbara drag.</li>
        <li><a className={`inline-flex min-h-11 items-center ${textLink}`} href="https://pubmed.ncbi.nlm.nih.gov/34563942/">Cook m.fl. (2021): Camouflaging in autism: A systematic review</a> – forskningsöversikt om camouflaging och masking.</li>
      </ul>
    </GuideSection>

    <GuideSection title="Utveckling och innehållsansvar">
      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[max-content_1fr]">
        <dt className="font-semibold text-neutral-900">Utvecklat av</dt><dd>Relationsvarning.se</dd>
        <dt className="font-semibold text-neutral-900">Ansvarig utgivare</dt><dd>Relationsvarning.se</dd>
        <dt className="font-semibold text-neutral-900">Modellversion</dt><dd>audhd-v1</dd>
        <dt className="font-semibold text-neutral-900">Publicerad</dt><dd>24 oktober 2026</dd>
      </dl>
      <p>Framtida ändringar som påverkar frågorna, områdena eller hur resultatet beskrivs ska dokumenteras här med datum och en kort ändringsbeskrivning.</p>
      <p><Link href="/audhd-test" className={textLink}>Läs om och gör AuDHD-testet →</Link></p>
    </GuideSection>
  </ContentGuide></EditorialSurface>;
}
