import EditorialSurface from "../_components/EditorialSurface";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentGuide, GuideSection, GuideLinks, textLink } from "../_components/ContentGuide";

type MethodTest = {
  href: string;
  title: string;
  description: string;
};

const testMethodGroups: { title: string; description: string; tests: MethodTest[] }[] = [
  {
    title: "NPF och neurodiversitet",
    description: "Flera områden vägs samman till en profil som visar både mönster och variation.",
    tests: [
      { href: "/adhd-test/test", title: "ADHD-test", description: "Sex områden räknas om till jämförbara nivåer. Fasta regler jämför exekutiva, ouppmärksamma och rastlösa/impulsiva mönster, medan vardagspåverkan läses som kontext." },
      { href: "/autism-test/test", title: "Autismtest", description: "Sex områden räknas om till jämförbara nivåer. Fasta regler läser socialt samspel, kommunikation, flexibilitet, sensorik, intressen och vardag som en samlad profil." },
      { href: "/audhd-test/test", title: "AuDHD-test", description: "Åtta områden analyseras i två sammansatta index för ADHD- och autismrelaterade drag, med viktning för de delar som ingår i respektive index." },
      { href: "/hsp-test/test", title: "HSP-test", description: "Sex lika stora områden jämförs för att visa om känslighet, återhämtning och bearbetning är jämna, tydliga eller kontrasterande." },
      { href: "/iq-test/test", title: "IQ-test", description: "Fem kognitiva områden och tre svårighetsnivåer ger ett orienterande estimat och en profil av relativa styrkor och svagheter." },
    ],
  },
  {
    title: "Relationer och beteendemönster",
    description: "Svar delas upp i konkreta beteenden och relationella mönster, så att viktiga områden inte försvinner i en totalsiffra.",
    tests: [
      { href: "/test", title: "Relationstest – varningssignaler", description: "Åtta områden jämförs, och svar om hot eller stark rädsla lyfts separat från den övriga områdesprofilen." },
      { href: "/psykisk-misshandel-relation/test", title: "Psykisk misshandel", description: "Åtta områden normaliseras och vägs samman, med större betydelse för bland annat upprepning, påverkan och hot." },
      { href: "/narcissist-i-en-relation/test", title: "Narcissistiska relationsmönster", description: "Åtta områden jämförs och viktas för att synliggöra exempelvis exploatering, empati, kritikreaktioner och påverkan." },
      { href: "/anknytningstest/test", title: "Anknytningstest", description: "Två direktpoängsatta dimensioner – anknytningsångest och anknytningsundvikande – räknas om till sex delskalor och en förenklad profil." },
      { href: "/medberoendetest/test", title: "Medberoendetest", description: "Sex områden om bland annat överansvar, gränser och självuppoffring jämförs och sammanfattas i ett helhetsindex." },
      { href: "/gaslightingtest/test", title: "Gaslightingtest", description: "Helhet och sex områden räknas var för sig så att det går att se vilka mönster – som förnekande eller skuldvändning – som framträder mest." },
      { href: "/traumabindningtest/test", title: "Traumabindningstest", description: "Sex områden jämförs för att skilja stark anknytning från möjliga återkommande mönster av smärta, hopp och svårigheter att skapa avstånd." },
    ],
  },
  {
    title: "Psykisk hälsa och självkännedom",
    description: "Områdesprofiler visar var belastning eller återkommande drag är mest framträdande i just dina svar.",
    tests: [
      { href: "/angest-test/test", title: "Ångesttest", description: "Sex områden om oro, spänning, sömn, koncentration och vardagspåverkan jämförs tillsammans med stödjande och nyanserande signaler." },
      { href: "/ptsd-test/test", title: "PTSD-test", description: "Fem områden om återupplevande, undvikande, tankar och känslor, vaksamhet och vardagspåverkan analyseras tillsammans." },
      { href: "/narcissism-sjalvtest/test", title: "Narcissism – självtest", description: "Sex områden bildar två beskrivande index för grandiosa och sårbara drag; empatifrågorna poängsätts i omvänd riktning." },
    ],
  },
];

export const metadata: Metadata = {
  title: "Metodik – så bygger Relationsvarning sina tester",
  description: "Så fungerar Relationsvarnings frågor, poäng och automatiska resultat. Läs om kunskapsbakgrund, källor och gränserna för självreflektionstesterna.",
  alternates: { canonical: "https://www.relationsvarning.se/metodik" },
};

export default function MethodologyPage() {
  return <EditorialSurface><ContentGuide title="Så bygger vi våra tester" intro="Relationsvarning är en informationstjänst med tester för strukturerad självreflektion. Här förklarar vi vad frågorna och resultaten kan hjälpa dig med, vilken kunskap innehållet anknyter till och vilka begränsningar som är viktiga att känna till.">
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
      <p>Testerna använder fasta frågor, svarsalternativ och beräkningsregler. Svaren grupperas i delområden, delskalor eller domäner. När områden innehåller olika många frågor räknas de om till jämförbara nivåer, ofta på en skala från 0 till 100.</p>
      <p>Varje modell har förutbestämda regler för hur områden, kombinationer och tydliga kontraster ska läsas. Vissa modeller använder också uttryckliga områdesvikter i sina sammansatta index; andra jämför områden utan viktning. Resultattexter väljs automatiskt utifrån dessa regler och dina svar.</p>
      <p>Ingen individuell bedömning av en yrkesperson sker genom testet. Ett värde på 70 av 100 betyder inte 70 procents sannolikhet för en diagnos, ett brott eller framtida våld.</p>
    </GuideSection>
    <GuideSection title="Så arbetar de 15 huvudtesterna">
      <p>Här är den korta, konkreta beskrivningen av vad som analyseras i varje test.</p>
      <div className="space-y-9">
        {testMethodGroups.map((group) => (
          <section key={group.title} aria-labelledby={`${group.title.replaceAll(" ", "-").toLowerCase()}-heading`}>
            <h3 id={`${group.title.replaceAll(" ", "-").toLowerCase()}-heading`} className="text-xl font-semibold tracking-tight text-neutral-900">{group.title}</h3>
            <p className="mt-2">{group.description}</p>
            <ul className="mt-4 space-y-4">
              {group.tests.map((test) => (
                <li key={test.href}><Link href={test.href} className={textLink}><strong>{test.title}</strong></Link> – {test.description}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="border-t border-neutral-200 pt-7" aria-labelledby="quick-checks-heading">
        <h3 id="quick-checks-heading" className="text-xl font-semibold tracking-tight text-neutral-900">Kostnadsfria snabbtester</h3>
        <ul className="mt-4 space-y-4">
          <li><Link href="/ar-min-relation-sund" className={textLink}><strong>Är min relation sund?</strong></Link> – tittar på trygghet, respekt, kommunikation, autonomi, ömsesidighet och stabilitet.</li>
          <li><Link href="/roda-flaggor-relation-test" className={textLink}><strong>Röda flaggor i relation – snabbcheck</strong></Link> – lyfter de mest framträdande områdena inom kontroll, gaslighting, nedvärdering, gränser, instabilitet och otrygghet.</li>
        </ul>
      </section>
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
  </ContentGuide></EditorialSurface>;
}
