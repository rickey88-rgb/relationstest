import type { Metadata } from "next";
import Link from "next/link";
import { ContentGuide, GuideSection, GuideLinks, textLink } from "../_components/ContentGuide";

export const metadata: Metadata = {
  title: "Metodik – så bygger Relationsvarning sina tester",
  description: "Så fungerar Relationsvarnings frågor, poäng och automatiska resultat. Läs om kunskapsbakgrund, källor och gränserna för självreflektionstesterna.",
  alternates: { canonical: "https://www.relationsvarning.se/metodik" },
};

export default function MethodologyPage() {
  return <ContentGuide title="Så bygger vi våra tester" intro="Relationsvarning är en informationstjänst med tester för strukturerad självreflektion. Här förklarar vi vad frågorna och resultaten kan hjälpa dig med, vilken kunskap innehållet anknyter till och vilka begränsningar som är viktiga att känna till.">
    <GuideSection title="Syftet: sätta ord på återkommande mönster">
      <p>Frågorna tar upp upplevelser och beteenden i relationer, till exempel kontroll, skuldvändning, bemötande av gränser och reaktioner på närhet. Svaren kan hjälpa dig att sortera erfarenheter och hitta relevant fördjupning. De beskriver din egen rapportering, inte en oberoende observation av partnern.</p>
      <p>Återkommande mönster kan säga mer än en isolerad konflikt. Samtidigt ska ett allvarligt hot eller en farlig situation tas på allvar även om det bara hänt en gång.</p>
    </GuideSection>
    <GuideSection title="Kunskapsbakgrund är inte samma sak som validering">
      <p>Ämnena anknyter till forskning om relationer och anknytning samt myndigheters kunskap om kontroll och psykiskt våld. Artiklarna innehåller källor för relevanta sakfrågor. Gaslighting och manipulation beskrivs som beteendemönster; en enstaka oenighet visar inte vad någon avser eller vilken diagnos personen har.</p>
      <p>Anknytningsinnehållet använder begreppen anknytningsångest och anknytningsundvikande. Medberoende används för att diskutera bland annat överansvar, självuppoffring och gränser. Det är inte en formell psykiatrisk diagnos, och begreppet definieras olika i litteraturen.</p>
      <p>Relationsvarnings egna frågeformuleringar, viktningar och resultatnivåer ska inte likställas med ett publicerat, validerat instrument. Det finns ingen redovisad klinisk validering av dessa tester eller fullständig källkoppling för varje enskild fråga. Forskningsbakgrunden visar vilka ämnen vi anknyter till, inte att testernas träffsäkerhet har bevisats.</p>
    </GuideSection>
    <GuideSection title="Så sammanställs svaren">
      <p>Testerna använder fasta frågor, svarsalternativ och beräkningsregler. Frågorna grupperas efter ämne. Beräkningen skiljer sig mellan testerna:</p>
      <ul className="list-disc space-y-3 pl-5">
        <li><strong>Generella relationstestet:</strong> svarspoäng summeras inom sex områden och viktas till en totalpoäng.</li>
        <li><strong>Psykisk misshandel och narcissistiska relationsmönster:</strong> områdespoäng räknas om till en skala 0–100 och vägs samman med olika områdesvikter.</li>
        <li><strong>Gaslighting och traumabindning:</strong> svarssumman jämförs med högsta möjliga poäng för både helheten och delområdena.</li>
        <li><strong>Medberoende:</strong> helhetsindexet är ett medelvärde av delområdenas poäng på skalan 0–100.</li>
        <li><strong>Anknytning:</strong> ångest och undvikande redovisas separat tillsammans med delskalor. Vissa frågor poängsätts i omvänd riktning. Kombinationen av dimensionerna används för en förenklad profil.</li>
      </ul>
      <p>Resultattexter väljs automatiskt utifrån poäng, områden och förinställda nivåer. Ingen individuell bedömning av en yrkesperson sker genom testet. Ett värde på 70 av 100 betyder inte 70 procents sannolikhet för en diagnos, ett brott eller framtida våld.</p>
    </GuideSection>
    <GuideSection title="Vad resultatet inte kan avgöra">
      <p>Poäng, profiler och benämningar som ”förhöjd” eller ”hög risk” är testets egna orienteringsverktyg. Nivågränserna är inte redovisade som kliniskt validerade gränsvärden. Resultat mellan olika tester ska därför inte jämföras som om de mätte samma sak.</p>
      <p>Testerna ger inte en medicinsk eller psykologisk bedömning, en diagnos på dig eller partnern, en juridisk slutsats eller bevis på att ett brott har begåtts. De kan inte känna till sådant som inte fångas av frågorna, kontrollera uppgifterna eller bedöma en akut situation. Även en mer utförlig betald resultattext har dessa begränsningar.</p>
      <p>Ett lågt resultat är ingen garanti för trygghet. Sök stöd om du är rädd, oavsett poäng. Vid akut fara, ring 112. Du hittar <Link href="/psykiskt-vald/hjalp" className={textLink}>information om stöd och hjälp</Link> utan att göra ett test eller köpa något.</p>
    </GuideSection>
    <GuideSection title="Källor och fördjupning">
      <p>Följande källor finns också i sajtens ämnesmaterial. De ger bakgrund till begrepp och stödvägar, inte ett godkännande av Relationsvarnings egna tester.</p>
      <ul className="space-y-4">
        <li><a className={textLink} href="https://www.1177.se/liv--halsa/vald-overgrepp-och-sexuella-trakasserier/att-bli-utsatt-for-vald-i-nara-relationer/">1177: Att bli utsatt för våld i nära relationer</a> – information om våldsutsatthet och stöd.</li>
        <li><a className={textLink} href="https://jamstalldhetsmyndigheten.se/mans-vald-mot-kvinnor/information-om-valdsutsatthet/digitala-dimensioner-av-vald/">Jämställdhetsmyndigheten: Digitala dimensioner av våld</a> – kunskapsbakgrund om teknik och kontroll.</li>
        <li><a className={textLink} href="https://labs.psychology.illinois.edu/~rcfraley/attachment.htm">R. Chris Fraley: Översikt över vuxen anknytning</a> – forskning om anknytning och dimensionerna ångest och undvikande.</li>
        <li><a className={textLink} href="https://pubmed.ncbi.nlm.nih.gov/16818359/">Kritisk forskningsöversikt om medberoende</a> – bakgrund till begreppets varierande definitioner och begränsningar.</li>
      </ul>
    </GuideSection>
    <GuideSection title="Uppdateringar och återkoppling">
      <p>Frågor och innehåll kan behöva ändras när kunskapsläget, myndighetsråd eller svensk lag förändras. Vi utlovar ingen fast granskningsfrekvens. För juridiska frågor behöver aktuell lagtext och relevant myndighetsinformation kontrolleras; ett automatiskt testresultat ersätter inte det.</p>
      <p>Om du upptäcker ett sakfel eller vill fråga om innehållet kan du <Link href="/kontakt" className={textLink}>kontakta Relationsvarning</Link>. För information om uppgifter och lokal lagring, läs <Link href="/integritet" className={textLink}>integritetspolicyn</Link>.</p>
    </GuideSection>
    <GuideSection title="Välj en väg vidare"><GuideLinks links={[{ href: "/", label: "Alla relationstester på startsidan" }, { href: "/test", label: "Generellt relationstest" }, { href: "/anknytning", label: "Läs om anknytning i relationer" }, { href: "/medberoende", label: "Läs om medberoende och gränser" }]} /></GuideSection>
  </ContentGuide>;
}
