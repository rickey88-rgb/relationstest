import type { Metadata } from "next";
import Link from "next/link";
import { GuideSection, textLink } from "../_components/ContentGuide";
import EditorialSurface from "../_components/EditorialSurface";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";

const route = "/uppdrag-granskning-adhd";
const title = "Uppdrag granskning avslöjar brister i ADHD-vården – hur vet du om ett ADHD-test är seriöst?";
const description = "Vad visar SVT:s ADHD-granskning? Läs om skillnaden mellan självtest och utredning, hur du bedömer ett ADHD-test och vilka frågor du kan ställa till vården.";
const datePublished = "2026-11-25";
const editor = "Relationsvarning";

const sources = {
  svt: "https://www.svt.se/nyheter/granskning/ug/har-avslojas-natlakarna-inga-risker-med-adhd-medicin",
  series: "https://www.svt.se/nyheter/om/uppdrag-granskning-du-har-adhd",
  patientStory: "https://www.svt.se/nyheter/granskning/ug/fick-maxdos-av-adhd-medicin-ett-ar-senare-planerade-hon-sjalvmord",
  medication: "https://www.lakemedelsverket.se/sv/behandling-och-forskrivning/behandlingsrekommendationer/sok-behandlingsrekommendationer/lakemedel-vid-adhd--behandlingsrekommendation",
  ivo: "https://www.ivo.se/globalassets/dokument/publikationer/rapporter/rapporter-2026/tillsyn-av-privat-finansierad-neuropsykiatrisk-vard.pdf",
  guidelines: "https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/nationella-riktlinjer/riktlinjer-och-utvarderingar/adhd-och-autism/",
  diagnostic: "https://www.socialstyrelsen.se/aktuellt/vad-ar-sant-om-adhd/",
  asrs: "https://doi.org/10.1017/S0033291704002892",
  assessment: "https://www.1177.se/stockholm/undersokning-behandling/undersokningar-och-provtagning/psykiatriska-utredningar/neuropsykiatrisk-utredning/",
} as const;

const article = { route, title, description, datePublished, dateModified: datePublished } as const;

export const metadata: Metadata = {
  title: "Uppdrag granskning om ADHD – så bedömer du ett ADHD-test",
  description,
  ...getEditorialMetadata(article),
  authors: [{ name: editor, url: "/juridisk-information" }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

const schema = {
  ...getEditorialArticleSchema(article),
  inLanguage: "sv-SE",
  citation: Object.values(sources),
};

export default function Page() {
  return <EditorialSurface>
    <main data-rv="container" className="mx-auto max-w-3xl px-4 py-10 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-14">
      <EditorialArticleJsonLd data={schema} />
      <nav aria-label="Brödsmulor" className="text-sm text-neutral-600">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li><Link href="/" className={textLink}>Startsida</Link></li>
          <li className="flex items-center gap-2"><span aria-hidden="true">/</span><Link href="/adhd-vuxna" className={textLink}>ADHD hos vuxna</Link></li>
          <li className="flex items-center gap-2"><span aria-hidden="true">/</span><span aria-current="page">Uppdrag granskning om ADHD</span></li>
        </ol>
      </nav>
      <article aria-labelledby="article-title">
        <header className="mt-5">
          <h1 id="article-title" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 text-sm text-neutral-600">Av <Link href="/juridisk-information" className={textLink}>{editor}</Link> · <time dateTime={datePublished}>25 november 2026</time></p>
          <p className="mt-5 text-lg leading-8 text-neutral-700">När ett gratis bedömningssamtal mynnar ut i ett erbjudande om en betald ADHD-utredning kan det vara svårt att veta vad som faktiskt har bedömts. I serien <em>Du har ADHD</em>, publicerad den 25 november 2026, undersöker SVT hur några privata mottagningar talar med möjliga patienter om utredning, diagnos och medicinering. Granskningen väcker en fråga som också gäller ADHD-test på nätet. Hur kan du avgöra vad ett resultat är värt och vilken information du bör få innan du betalar? <a href={sources.series} className={textLink}>SVT:s samlade granskning</a>.</p>
        </header>

        <GuideSection title="Vad visar SVT:s granskning?">
          <p>Uppdrag gransknings reporter, som enligt SVT inte har ADHD, deltog i tio kostnadsfria bedömningssamtal. Samtliga tio mottagningar bedömde att det fanns skäl för en utredning. I sex av samtalen fick reportern höra att mottagningen trodde att en utredning skulle leda till en ADHD-diagnos. Två mottagningar beskrev läkemedlen som riskfria när reportern frågade om biverkningar. En av dem svarade senare att samtalet hade ett annat syfte än att gå igenom läkemedelsrisker, att informationen ses över och att mottagningen använder samma diagnoskriterier som offentlig psykiatri. <a href={sources.svt} className={textLink}>SVT:s reportage om bedömningssamtalen</a>.</p>
          <p>Samtalen gällde en och samma person och ägde rum före en fullständig utredning. En rekommendation att utreda vidare kan vara befogad när en bild behöver klarläggas. Granskningen belyser hur rekommendationen och riskinformationen gavs i just de samtalen. Underlaget räcker inte för att bedöma hur vanligt det här är i ADHD-vården eller vilka slutsatser en fullständig utredning hade landat i.</p>
          <p>I ett annat reportage berättar en patient om allvarliga besvär under behandlingen. En sådan berättelse ger skäl att ställa frågor om information och uppföljning, men den anger ingen generell risknivå. ADHD-läkemedel kan hjälpa många. Läkemedelsverket rekommenderar individuellt anpassad behandling med regelbunden uppföljning av både effekt och biverkningar. Om du har frågor om din egen behandling eller upplever biverkningar kan du vända dig till den som förskrivit läkemedlet. <a href={sources.patientStory} className={textLink}>SVT:s patientreportage</a> · <a href={sources.medication} className={textLink}>Läkemedelsverkets behandlingsrekommendation</a>.</p>
        </GuideSection>

        <GuideSection title="Vem tjänar på att du går vidare?">
          <p>En privat mottagning kan ge ett alternativ när väntetiden är lång. När samma företag både gör den första bedömningen och tar betalt för nästa steg finns också ett ekonomiskt incitament att fler går vidare. Motiven bakom en enskild rekommendation går inte att läsa ut från affärsmodellen. Fråga i stället vem som fattar beslutet och om mottagningen kan rekommendera stöd eller hänvisa vidare på andra sätt.</p>
          <p>Prissättningen kan också påverka vilka delar av vården den enskilde tar del av. I en separat tillsyn av tio privata vårdgivare för barn fann Inspektionen för vård och omsorg exempel på familjer som avstod från delar av den vård de betalade själva. Tillsynen gällde barnverksamheter. En praktisk fråga även inför en vuxenutredning är vad grundpriset täcker och vilka besök eller insatser som kostar extra. <a href={sources.ivo} className={textLink}>IVO:s tillsyn av privatfinansierad neuropsykiatrisk vård</a>.</p>
        </GuideSection>

        <GuideSection title="Självskattning, screening och klinisk diagnostik">
          <ul className="list-disc space-y-3 pl-5">
            <li><strong>Självskattning.</strong> Du beskriver hur ofta du känner igen vissa svårigheter och hur de påverkar vardagen. Ett formulär kan hjälpa dig att upptäcka återkommande situationer och formulera exempel. Värdet ligger i att sortera egna iakttagelser.</li>
            <li><strong>Screening.</strong> Ett verktyg används som ett första urval för att uppmärksamma personer som kan behöva bedömas närmare. Screeningen kan bygga på självskattning. Både missade och felaktigt flaggade fall förekommer. Det spelar roll vilken grupp verktyget har prövats i och hur resultatet används.</li>
            <li><strong>Klinisk diagnostik.</strong> Vårdpersonal väger samman hur besvären har utvecklats från barndomen, hur vardagen fungerar i olika miljöer och vilka andra förklaringar eller samtidiga tillstånd som är möjliga. Samtal, formulär och annan relevant information kan bidra till bedömningen. Diagnosen ställs efter en helhetsbedömning.</li>
          </ul>
          <p>Fokusproblem kan till exempel vara starkast under en period av sömnbrist eller ha påverkat både studier och vardag under många år. Den skillnaden går ofta förlorad i en ensam totalsiffra. <a href={sources.diagnostic} className={textLink}>Socialstyrelsen om ADHD-test och utredning</a> · <a href={sources.guidelines} className={textLink}>Nationella riktlinjer för ADHD och autism</a>.</p>
        </GuideSection>

        <GuideSection title="Så bedömer du kvaliteten på ett ADHD-test">
          <p>Börja med att läsa vad tjänsten utlovar innan du svarar. Ett test för självreflektion har andra kvalitetskrav än ett instrument som påstår sig kunna identifiera personer med misstänkt ADHD. De här frågorna hjälper dig att bedöma båda.</p>
          <ul className="list-disc space-y-3 pl-5">
            <li><strong>Framgår det vad frågorna mäter?</strong> Leta efter en tydlig målgrupp och tidsperiod. Frågor om hur ofta och i vilka situationer något händer ger dig mer att reflektera över än en fråga om du ”brukar vara glömsk”.</li>
            <li><strong>Går resultatet att förstå?</strong> Tjänsten bör förklara hur svaren räknas samman och vad olika nivåer betyder. Om den påstår att poängen motsvarar en sannolikhet för ADHD bör du kunna se vilket underlag som stöder det och för vilka användare.</li>
            <li><strong>Är återkopplingen balanserad?</strong> Ett användbart resultat fångar sådant som sticker ut, sådant som fungerar bra och sådant som är osäkert. Lägg märke till om återkopplingen kan nyansera ett blandat svarsmönster eller om varje väg leder till samma köpbudskap.</li>
            <li><strong>Vad vet du före köp?</strong> Avsändare, pris, vad du får efter betalning och hur dina svar hanteras bör vara lätta att hitta. Om tjänsten hänvisar till en studie, ta reda på om studien faktiskt gäller den testversion du använder.</li>
          </ul>
        </GuideSection>

        <GuideSection title="Varför antalet frågor säger så lite om kvaliteten">
          <p>Många nästan likadana frågor kan ge samma uppgift flera gånger. Ett kort formulär kan räcka för ett smalt syfte om frågorna valts med omsorg och verktyget prövats för just det syftet. I den ursprungliga studien av ASRS för vuxna fångade den oviktade sexfrågeversionen fler av dem som bedömdes ha ADHD och gav färre felaktigt positiva utslag än den oviktade artonfrågeversionen. De resultaten gäller det undersökta urvalet och de två versionerna. <a href={sources.asrs} className={textLink}>Kessler med flera om utvecklingen av ASRS</a>.</p>
          <p>För en bred självskattning kan fler frågor ge mer plats för olika livssituationer och nyanser. Fråga vad varje område tillför och om det går att följa hur slutsatserna hänger ihop med svaren. Att kalla ett verktyg forskningsbaserat är en svag upplysning om det saknas en förklaring av vad som faktiskt undersökts.</p>
        </GuideSection>

        <GuideSection title="Vårt eget ekonomiska intresse">
          <p><strong>Vi säljer självinsikt. Inte diagnoser.</strong></p>
          <p>Relationsvarning säljer fördjupade resultat. Du kan göra vårt <Link href="/adhd-test" className={textLink}>ADHD-test för vuxna</Link> och få en första återkoppling gratis. Vi tjänar pengar om du sedan köper den fullständiga analysen. Därför har vi ett intresse av att fler går vidare till köp. Den här artikeln publiceras av samma verksamhet.</p>
          <p>Vår ambition är att du före ett köp ska kunna se vad frågorna handlar om, hur vi beräknar poängen och vilka slutsatser underlaget medger. Våra egna frågor och beräkningsregler saknar klinisk validering. Poängen beskriver hur du har svarat i vår modell. Den kan varken bekräfta eller utesluta ADHD. En betald analys ger mer förklaring av samma svar. Så beskriver vi arbetssättet i <Link href="/metodik" className={textLink}>vår metodbeskrivning</Link>.</p>
        </GuideSection>

        <GuideSection title="Checklista om du överväger en ADHD-utredning">
          <ol className="list-decimal space-y-3 pl-5">
            <li><strong>Skriv ner vardagsexempel.</strong> Vad händer, hur ofta och vad får det för följder hemma, på jobbet eller i studierna? Ta gärna med exempel från tidigare i livet och beskriv vad som brukar hjälpa.</li>
            <li><strong>Fråga vem som bedömer dig.</strong> Be om namn och yrkesroller för ansvariga behandlare. Fråga hur läkare och psykolog medverkar och vem som håller ihop bedömningen.</li>
            <li><strong>Be om utredningens upplägg.</strong> Hur hämtas uppgifter om barndomen? Hur undersöker mottagningen andra möjliga förklaringar och tillstånd som kan förekomma samtidigt?</li>
            <li><strong>Be om ett totalpris och villkor i förväg.</strong> Ingår återgivning, ett skriftligt utlåtande och extra besök om underlaget behöver kompletteras? Fråga också vad du får med dig om utredningen inte leder till en ADHD-diagnos.</li>
            <li><strong>Fråga vem som följer upp.</strong> Om behandling blir aktuell, vem ansvarar för den och hur följer mottagningen upp nyttan och möjliga biverkningar? Be att få veta vad uppföljningen kostar och vem du kan kontakta mellan besöken.</li>
            <li><strong>Ta reda på vilka vägar till stöd som finns.</strong> Vårdcentralen kan vara en första kontakt. Stöd och anpassningar kan bli aktuella redan medan du väntar på en bedömning. <a href={sources.assessment} className={textLink}>1177 om stöd och neuropsykiatrisk utredning</a>.</li>
          </ol>
          <p>Om du vill förbereda vad du ska ta upp kan du läsa vidare om <Link href="/adhd-symtom-vuxna" className={textLink}>ADHD-symtom hos vuxna</Link> och <Link href="/har-jag-adhd" className={textLink}>hur mönster i vardagen kan beskrivas</Link>. Dina egna exempel räcker för att börja ett samtal med vården.</p>
        </GuideSection>
      </article>
    </main>
  </EditorialSurface>;
}
