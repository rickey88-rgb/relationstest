import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { ContentGuide, GuideSection, textLink } from "../_components/ContentGuide";

const url = "https://www.relationsvarning.se/narcissism";
const title = "Narcissism – narcissistiska drag, självbild och relationer";
const description = "Vad är narcissism? Läs om narcissistiska drag, grandios och sårbar narcissism, skillnaden mot personlighetssyndrom och när professionell bedömning kan hjälpa.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: url },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title, description, url, type: "website", locale: "sv_SE", siteName: "Relationsvarning" },
};
const sources = {
  spectrum: "https://journals.sagepub.com/doi/10.1177/1088868316685018",
  clinical: "https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/narcissistic-personality-disorder-npd",
  assessment: "https://medlineplus.gov/ency/article/000934.htm",
  vulnerability: "https://www.annualreviews.org/content/journals/10.1146/annurev.clinpsy.121208.131215",
  care: "https://www.1177.se/liv--halsa/psykisk-halsa/att-soka-stod-och-hjalp/soka-psykiatrisk-vard/",
};
const schema = {
  "@context": "https://schema.org", "@type": "WebPage", "@id": url,
  url, name: title, description, inLanguage: "sv-SE",
};

export default function NarcissismGuide() {
  return <EditorialSurface><ContentGuide
    title="Narcissism – förstå dragen utan att fastna i etiketten"
    intro="Narcissism handlar om mönster i självbild, behov av bekräftelse och förhållandet till andra. Ordet används både om personlighetsdrag och om ett psykiatriskt tillstånd. Skillnaden spelar roll, särskilt när du försöker förstå dig själv eller en nära relation."
  >
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <GuideSection title="Vad är narcissism?">
      <p>I personlighetsforskning används narcissism bland annat för att beskriva en upplevelse av egen särskildhet och berättigande: hur viktig den egna positionen känns och vad man förväntar sig av andra. Dragen kan finnas i olika grad och ta olika uttryck. Det är mer nyanserat än en uppdelning mellan människor som ”är narcissister” och alla andra.</p>
      <p>Att vara stolt över en prestation, vilja bli uppskattad eller reagera på orättvis kritik räcker inte för att beskriva någon som narcissistisk. När du läser om dragen är det hjälpsamt att fråga hur återkommande och låsta mönstren är och vilket utrymme andras behov får.</p>
      <p className="text-sm">Forskningsbakgrund: <a href={sources.spectrum} className={textLink}>Krizan och Herlaches modell av narcissism som ett spektrum</a>.</p>
    </GuideSection>
    <GuideSection title="Narcissistiska drag och narcissistisk personlighetsstörning">
      <p>Narcissistisk personlighetsstörning, även kallat narcissistiskt personlighetssyndrom och förkortat NPD på engelska, är en klinisk diagnos. En bedömning behöver väga in hur långvariga och omfattande svårigheterna är och hur de påverkar personens fungerande. Enstaka själviska handlingar eller igenkänning i en lista är inte samma sak.</p>
      <p>Ett självtest kan inte göra den bedömningen. Ett partnertest beskriver dessutom dina observationer av relationen, inte en undersökning av partnern. Höga testpoäng kan därför inte översättas till en sannolikhet för diagnos.</p>
      <p className="text-sm">Om klinisk bedömning: <a href={sources.assessment} className={textLink}>MedlinePlus om narcissistiskt personlighetssyndrom</a>.</p>
    </GuideSection>
    <GuideSection title="Hur kan narcissistiska drag märkas?">
      <p>Beskrivningar av narcissistiska drag tar ofta upp självbild, berättigande, bekräftelse och ömsesidighet. Möjliga uttryck är att:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>lägga stor vikt vid att framstå som särskild, framgångsrik eller överlägsen,</li>
        <li>förvänta sig undantag eller särskild hänsyn utan motsvarande utrymme för andra,</li>
        <li>ha svårt att ta in andras perspektiv när den egna självbilden utmanas,</li>
        <li>reagera med stark skam, ilska eller nedvärdering vid kritik.</li>
      </ul>
      <p>Listan är inte ett diagnostiskt verktyg. Fråga hellre vad som faktiskt händer i konkreta situationer än hur många punkter du kan bocka av. Att någon är dålig på ett visst samtal visar inte i sig vad beteendet beror på.</p>
      <p className="text-sm">Klinisk bakgrund till beskrivningarna: <a href={sources.clinical} className={textLink}>MSD Manuals genomgång av narcissistiskt personlighetssyndrom</a>.</p>
    </GuideSection>
    <GuideSection title="Självbild och behovet av bekräftelse">
      <p>En självsäker framtoning behöver inte betyda att självkänslan är stabil. Vid narcissistiska svårigheter kan andras beundran få stor betydelse för känslan av eget värde, medan kritik eller misslyckanden upplevs som starka hot mot självbilden.</p>
      <p>Som vardagsexempel kan du tänka på två sätt att reagera när en kollega får beröm. Du kan känna avund men ändå gratulera och återgå till ditt eget arbete. Ett annat svar är att behöva förminska kollegans prestation för att själv känna sig värdefull. Skillnaden att undersöka är hur du hanterar känslan och bemöter den andra personen, inte om känslan någonsin uppstår.</p>
      <p>Exemplet illustrerar en reflektionsfråga. Det är inte ett sätt att dra slutsatser om en kollegas personlighet utifrån ett möte.</p>
    </GuideSection>
    <GuideSection title="Grandios, sårbar och så kallad dold narcissism">
      <p>Grandiositet och sårbarhet är två viktiga teman i forskningen. Grandiosa uttryck kan handla om överlägsenhet och anspråk på särskild behandling. Sårbara uttryck kan innehålla skam, känslighet för avvisande och en självkänsla som är starkt beroende av andras respons. Hos en person kan uttrycken också överlappa.</p>
      <p>”Dold narcissism” används ofta löst i vardagstexter. Det är inte en separat diagnos och inte ett exakt annat ord för sårbar narcissism. Synligt eller dolt handlar om hur något uttrycks; grandiositet och sårbarhet handlar om innehållet i mönstret. Blyghet, låg självkänsla eller skam räcker därför inte för att kalla någon en dold narcissist.</p>
      <p className="text-sm">Om begreppens gränser: <a href={sources.vulnerability} className={textLink}>Pincus och Lukowitskys forskningsöversikt om patologisk narcissism</a>.</p>
    </GuideSection>
    <GuideSection title="Narcissism i relationer: börja med det du kan beskriva">
      <p>Om du försöker förstå en relation kan det vara lättare att börja med en händelse än med en etikett. Vad hände när du sa nej? Kunde du ta upp något som gjorde ont? Fanns utrymme för bådas behov efteråt? Skriv gärna ned konkreta ord och handlingar, och skilj dem från din tolkning av personens avsikt.</p>
      <p>Den som vill förstå återkommande situationer med en partner kan läsa vår guide om <Link href="/narcissist-i-en-relation" className={textLink}>narcissistiska mönster i en relation</Link>. Den har ett annat fokus än ett självtest om dina egna drag.</p>
      <p>Gaslighting, kontroll och psykisk misshandel är beteenden som behöver tas på allvar oavsett vilken personlighet eller diagnos någon har. Narcissism och skadliga relationsbeteenden är inte utbytbara begrepp. Läs om <Link href="/gaslighting-relation" className={textLink}>gaslighting</Link> eller <Link href="/psykisk-misshandel" className={textLink}>psykisk misshandel</Link> om det är sådana händelser du behöver förstå. Vid rädsla, hot eller våld finns <Link href="/psykiskt-vald/hjalp" className={textLink}>vägar till stöd och hjälp</Link>; du behöver inte först avgöra om personen är narcissist.</p>
    </GuideSection>
    <GuideSection title="Vanliga missförstånd om narcissism">
      <dl className="space-y-5">
        <div><dt className="font-semibold text-neutral-950">”Den som frågar om sina egna drag kan inte ha dem.”</dt><dd className="mt-1">Att vilja förstå sig själv avgör inte om man har ett visst drag eller en diagnos. Försök använda frågan till att undersöka konkreta mönster, inte som ett bevis åt något håll.</dd></div>
        <div><dt className="font-semibold text-neutral-950">”Ett högt testresultat är en diagnos.”</dt><dd className="mt-1">Våra testresultat bygger på egna beräkningsregler och de svar som lämnas. De kan inte ersätta en professionell bedömning eller fastställa vem någon är.</dd></div>
        <div><dt className="font-semibold text-neutral-950">”Jag måste förstå orsaken innan jag får sätta en gräns.”</dt><dd className="mt-1">Du kan beskriva vad du inte accepterar och söka stöd även om förklaringen är osäker. En psykologisk etikett behövs inte för att ta hot eller kränkningar på allvar.</dd></div>
      </dl>
    </GuideSection>
    <GuideSection title="När kan professionell bedömning vara relevant?">
      <p>Om återkommande konflikter, skam, svårigheter i nära relationer eller starka reaktioner på kritik orsakar lidande kan du söka hjälp utan att redan veta en diagnos. Berätta vad som händer och hur vardagen påverkas. En psykologisk bedömning kan undersöka både personlighetsmönster och andra möjliga förklaringar.</p>
      <p>En vårdcentral kan vara en första kontakt när psykiska besvär påverkar vardagen och hjälpa dig vidare vid behov. På <a href={sources.care} className={textLink}>1177 finns information om att söka vård för psykiska besvär</a>. Om oron främst gäller en närstående kan du också söka stöd för din egen situation.</p>
    </GuideSection>
    <GuideSection title="Välj test efter vad du vill förstå">
      <p>Relationsvarning har två olika test med 30 frågor vardera. Båda ger en kort återkoppling gratis; en fullständig analys är valfri och kostar 39 kr per test. De har olika perspektiv och ställer inga diagnoser.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div data-rv="card" className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><h3 className="text-lg font-semibold text-neutral-950">Frågan gäller mig själv</h3><p className="mt-3">Självtestet utgår från hur du själv brukar tänka, känna och agera inom bland annat självbild, bekräftelsebehov och ömsesidighet.</p><Link href="/narcissism-sjalvtest" className={`mt-4 inline-flex min-h-12 items-center ${textLink}`}>Självtest om dina egna narcissistiska drag</Link></div>
        <div data-rv="card" className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><h3 className="text-lg font-semibold text-neutral-950">Frågan gäller min partner</h3><p className="mt-3">Partnerguiden och partnertestet utgår från de beteenden du upplever i din relation. De undersöker inte partnern kliniskt.</p><Link href="/narcissist-i-en-relation/test" className={`mt-4 inline-flex min-h-12 items-center ${textLink}`}>Lever jag med en narcissist? Till partnertestet</Link></div>
      </div>
    </GuideSection>
    <GuideSection title="Källor och läsanvisning">
      <p>Den kliniska avgränsningen bygger på MSD Manual och MedlinePlus. Forskningsöversikterna ger bakgrund till variationen i narcissistiska drag och till begreppen grandiositet och sårbarhet. Källorna validerar inte Relationsvarnings egna tester. Vardagsexemplen ovan är illustrationer, inte diagnostiska kriterier.</p>
      <ul className="list-disc space-y-3 pl-5">
        <li><a href={sources.clinical} className={textLink}>MSD Manual Professional: Narcissistic Personality Disorder</a> – kliniska begrepp, självbild och kriterier.</li>
        <li><a href={sources.assessment} className={textLink}>MedlinePlus: Narcissistic personality disorder</a> – bedömning och kontakt med vården.</li>
        <li><a href={sources.spectrum} className={textLink}>Krizan och Herlache: The Narcissism Spectrum Model (2018)</a> – personlighetsdrag och variation.</li>
        <li><a href={sources.vulnerability} className={textLink}>Pincus och Lukowitsky: Pathological Narcissism and Narcissistic Personality Disorder (2010)</a> – grandiositet, sårbarhet och terminologi.</li>
        <li><a href={sources.care} className={textLink}>1177: Söka vård för psykiska besvär</a> – svenska kontaktvägar.</li>
      </ul>
    </GuideSection>
  </ContentGuide></EditorialSurface>;
}
