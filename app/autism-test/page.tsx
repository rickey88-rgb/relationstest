import EditorialSurface from "../_components/EditorialSurface";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GuideLinks, GuideSection, textLink } from "../_components/ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";
import guides from "../../content/autism-guides.json";
import { areaNames, areas } from "./test/model";

const title = "Autismtest för vuxna – självtest med 30 frågor | Relationsvarning";
const description = "Gör ett autismtest för vuxna med 30 frågor om vardag, samspel, rutiner och sinnesintryck. Få en första återkoppling gratis. Testet kan inte ställa diagnos.";

export const metadata: Metadata = {
  title,
  description,
  ...getEditorialMetadata({ route: "/autism-test", title, description, datePublished: "2026-09-15T19:27:30+02:00", dateModified: "2026-10-08T00:00:00+02:00" }),
};
const articleJsonLd = getEditorialArticleSchema({ route: "/autism-test", title, description, datePublished: "2026-09-15T19:27:30+02:00", dateModified: "2026-10-08T00:00:00+02:00" });
const cta = "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-center font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto";
const descriptions = [
  "Aktiv analys av sociala situationer, förväntningar och samspelet i samtal.",
  "Indirekta budskap, antydningar och hur du tolkar och uttrycker dig i samtal.",
  "Behov av tydliga planer, rutiner och tid för att hantera förändringar.",
  "Hur ljud, ljus, material och andra intryck påverkar dig och din återhämtning.",
  "Fördjupning, återkommande intressen och hur det fungerar att avbryta fokus.",
  "Påverkan i olika miljöer, återhämtning, anpassning och erfarenheter över tid.",
];
const faq = [
  ["Hur lång tid tar autismtestet?", "Cirka fem minuter. Testet består av 30 frågor, fem inom varje område."],
  ["Är testet för vuxna?", "Ja, frågorna utgår från vuxnas erfarenheter. Du ombeds också reflektera över om liknande mönster funnits tidigare i livet."],
  ["Kan testet diagnostisera autism?", "Nej. Det är Relationsvarnings egen strukturerade självskattning, inte ett kliniskt validerat diagnosinstrument."],
  ["Vad är skillnaden mellan autism och Aspergers syndrom?", "Aspergers syndrom är äldre diagnostisk terminologi. I modern diagnostik ingår sådana presentationsformer inom autismspektrumet. Personer med en tidigare Aspergerdiagnos kan ha olika erfarenheter och stödbehov; benämningen gör dem inte identiska."],
  ["Är detta test relevant om jag söker på ASD eller AST?", "Ja. ASD är den engelska förkortningen för Autism Spectrum Disorder och AST används ofta för autismspektrumtillstånd. Det här självtestet för vuxna är gjort för egen reflektion. Det kan varken bekräfta eller utesluta autism."],
  ["Kan ADHD och autism förekomma samtidigt?", "Ja. Vissa upplevelser kan överlappa, men det är olika tillstånd som också kan förekomma tillsammans. Ett webbaserat självtest kan inte avgöra diagnos."],
];
export default function AutismLanding() {
  return <EditorialSurface><main data-rv="container" className="mx-auto max-w-3xl px-4 py-10 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-14">
    <EditorialArticleJsonLd data={articleJsonLd} />
    <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className={textLink + " inline-flex min-h-11 items-center"}>Relationsvarning</Link><span aria-hidden="true"> / </span><span aria-current="page">Autismtest</span></nav>
    <article><header className="mt-5"><h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Autismtest för vuxna</h1>
      <p className="mt-5 text-lg leading-8 text-neutral-700">30 frågor om samspel, rutiner och sinnesintryck. Räkna med ungefär fem minuter.</p>
      <div className="mt-6"><Link data-rv="button" href="/autism-test/test" className={cta}>Starta autismtestet</Link></div><p className="mt-3 text-sm text-neutral-600">Ingen registrering krävs för att starta. Självtestet kan varken bekräfta eller utesluta autism.</p>
    </header>
    <figure className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
      <Image src="/seo-images/autism-test-discover.png" alt="Illustration för autismtest för vuxna" width={1672} height={941} sizes="(max-width: 768px) calc(100vw - 2rem), 768px" className="h-auto w-full" />
    </figure>
    <GuideSection title="Så fungerar självskattningen">
      <p>Du svarar på fem frågor inom vart och ett av sex områden. Återkopplingen utgår från hur du beskriver din vardag. Den fullständiga analysen visar vad som framträder i dina svar inom de olika områdena.</p>
      <p><strong>Exempel på återkoppling</strong><br />Om sinnesintryck sticker ut i dina svar kan återkopplingen handla om hur du upplever ljud, ljus eller andra intryck. Den beskriver dina svar och kan inte avgöra vad upplevelsen beror på.</p>
      <p>Testet är utvecklat av Relationsvarning. Läs om <Link href="/metodik" className={textLink}>hur vi utformar våra självtester</Link>.</p>
    </GuideSection>
    <GuideSection title="Vad frågorna handlar om"><div className="grid gap-3 sm:grid-cols-2">{areas.map((area, i) => <div data-rv="card" key={area} className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><h3 className="font-semibold text-neutral-900">{areaNames[area]}</h3><p className="mt-2">{descriptions[i]}</p></div>)}</div><p>Olika personer kan ha mycket olika profiler även när totalsumman liknar varandra. Testets index bygger på fem områden. Vardagspåverkan och erfarenheter över tid visas separat.</p></GuideSection>

    <GuideSection title="Hur kan autism märkas i vuxenlivet?"><p>Sociala situationer kan kräva mycket aktiv analys, särskilt när förväntningar eller signaler inte sägs rakt ut. Behov av förutsägbarhet, obehag vid plötsliga förändringar och sensorisk överbelastning kan också vara delar av bilden.</p><p>Vissa beskriver starkt fokus på intressen, behov av återhämtning efter social belastning eller mycket arbete med att kompensera för sådant som andra verkar göra automatiskt. Varje punkt kan även ha andra förklaringar. Det är ett långvarigt mönster och dess betydelse för vardagen som behöver undersökas.</p><p>Läs mer om <Link href="/autism-vuxna" className={textLink}>autism i vuxenlivet</Link> eller frågan <Link href="/har-jag-autism" className={textLink}>hur man kan känna igen ett sammanhängande mönster</Link>.</p></GuideSection>
    <GuideSection title="Autism upptäcks inte alltid på samma sätt hos alla"><p>I en <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5509825/" className={textLink}>studie om maskering</a> beskrev vuxna med autism strategier som att öva på samtal eller dölja vissa beteenden. Upplevelserna varierade mellan deltagarna.</p><p>Läs om <Link href="/autism-kvinnor" className={textLink}>autism hos kvinnor</Link> och <Link href="/maskering-autism" className={textLink}>maskering och social anpassning</Link>.</p></GuideSection>
    <GuideSection title="Ett självtest kan inte ställa en autismdiagnos"><p>En professionell bedömning behöver väga in utvecklingshistoria, mönster över tid, funktion i flera miljöer och alternativa förklaringar. Syftet här är att ge en strukturerad bild av dina egna svar.</p><p>Relationsvarnings modell är inte kliniskt validerad. Produktprofilerna är inte diagnostiska subtyper, och ett resultat kan inte bekräfta eller utesluta autism.</p><p>Om något påverkar din vardag kan du ta med konkreta exempel till en vårdkontakt. Läs om hur en <a href="https://www.1177.se/stockholm/undersokning-behandling/undersokningar-och-provtagning/psykiatriska-utredningar/neuropsykiatrisk-utredning/" className={textLink}>neuropsykiatrisk utredning går till hos 1177</a>. För mer bakgrund, se <a href="https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/autism/" className={textLink}>1177 om autism</a>. Läs också <a href="https://www.nimh.nih.gov/health/publications/autism-spectrum-disorder" className={textLink}>NIMH:s översikt om autism och bedömning</a>.</p></GuideSection>
    <GuideSection title="Vanliga frågor om autismtestet">{faq.map(([question, answer]) => <div key={question} className="space-y-2 border-t border-neutral-200 pt-4"><h3 className="text-lg font-semibold text-neutral-900">{question}</h3><p>{answer}</p></div>)}<div className="space-y-2 border-t border-neutral-200 pt-4"><h3 className="text-lg font-semibold text-neutral-900">Vad kostar testet?</h3><p>Testet är gratis att genomföra och du får ett första fynd från dina svar utan kostnad. Den fullständiga personliga analysen kostar 39 kr.</p></div><p>Om du känner igen både ADHD- och autismdrag kan du läsa om <Link href="/audhd-test" className={textLink}>självtestet för kombinerade drag</Link>.</p><p>Du kan också <Link href="/hsp-test" className={textLink}>reflektera separat över känslighet och återhämtning</Link>. Det självtestet är inte en bedömning av autism.</p><p>Fördjupning: <Link href="/asperger-test" className={textLink}>Asperger-begreppet och självskattning</Link> samt <Link href="/adhd-autism" className={textLink}>skillnader och överlapp mellan ADHD och autism</Link>.</p></GuideSection>
    <GuideSection title="Nyfiken på vad dina egna svar visar?"><p>30 frågor. Flera områden. En samlad analys av ditt svarsmönster.</p><Link data-rv="button" href="/autism-test/test" className={cta}>Starta autismtestet</Link></GuideSection>
    <GuideSection title="Läs mer om autism"><GuideLinks links={guides.map(guide => ({ href: `/${guide.slug}`, label: guide.label }))} /></GuideSection>
    </article>
  </main></EditorialSurface>;
}
