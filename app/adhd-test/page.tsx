import EditorialSurface from "../_components/EditorialSurface";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GuideLinks, GuideSection, textLink } from "../_components/ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";
import adhdGuides from "../../content/adhd-guides.json";
const title = "ADHD-test för vuxna – självtest med 30 frågor | Relationsvarning";
const description = "Gör ett ADHD-test för vuxna på cirka fem minuter. Svara på 30 frågor och få en första återkoppling gratis. Självskattningen kan inte ställa diagnos.";
export const metadata: Metadata = {
  title,
  description,
  ...getEditorialMetadata({ route: "/adhd-test", title, description, datePublished: "2026-09-14T19:17:23+02:00", dateModified: "2026-09-14T23:13:54+02:00" }),
};
const articleJsonLd = getEditorialArticleSchema({ route: "/adhd-test", title, description, datePublished: "2026-09-14T19:17:23+02:00", dateModified: "2026-09-14T23:13:54+02:00" });
const cards = [
  [
    "Uppmärksamhet",
    "Hur lätt fokus tappas, hur ofta tankarna glider iväg och hur känslig du är för distraktioner."
  ],
  [
    "Organisation",
    "Planering, struktur, att hålla ordning och förmågan att få uppgifter hela vägen i mål."
  ],
  [
    "Impulsivitet",
    "Snabba beslut, avbrott och handlingar som sker innan eftertanken hunnit ikapp."
  ],
  [
    "Inre rastlöshet",
    "Behov av stimulans, aktivitet och svårigheten att verkligen komma ner i varv."
  ],
  [
    "Tid och igångsättning",
    "Tidsuppfattning, prokrastinering, motivation och svårigheter att komma igång trots att man vill."
  ],
  [
    "Påverkan i vardagen",
    "Hur mycket mönstren faktiskt påverkar arbete, studier, relationer och vardagsfungerande."
  ]
];
const faq = [
  [
    "Hur lång tid tar ADHD-testet?",
    "Cirka fem minuter. Testet består av 30 frågor."
  ],
  [
    "Är testet gjort för vuxna?",
    "Ja. Frågorna och tolkningen är utformade med vuxnas vardag i fokus."
  ],
  [
    "Kan testet säga om jag har ADHD?",
    "Nej. Återkopplingen beskriver vad du själv uppgett inom olika områden. Samma upplevelse kan ha flera förklaringar."
  ],
  [
    "Vad är skillnaden mellan ADD och ADHD?",
    "ADD används fortfarande ofta i vardagligt språk, men motsvarar vanligtvis det som idag kallas ADHD med huvudsakligen ouppmärksam presentation."
  ],
  [
    "Varför mäter testet flera områden?",
    "För att ADHD-relaterade svårigheter kan se väldigt olika ut mellan personer. En enda totalsiffra säger betydligt mindre än hur olika delar av profilen faktiskt fördelar sig."
  ]
];
const cta = "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-center font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto";
export default function ADHDLanding() {
  return <EditorialSurface><main data-rv="container" className="mx-auto max-w-3xl px-4 py-10 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-14">
    <EditorialArticleJsonLd data={articleJsonLd} />
    <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className={textLink + " inline-flex min-h-11 items-center"}>Relationsvarning</Link><span aria-hidden="true"> / </span><span aria-current="page">ADHD-test</span></nav>
    <article><header className="mt-5"><h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">ADHD-test för vuxna</h1>
      <p className="mt-5 text-lg leading-8 text-neutral-700">30 frågor om fokus, planering, rastlöshet och vardag. Räkna med ungefär fem minuter.</p>
      <p className="mt-4 leading-7 text-neutral-700">Du får ett personligt fynd gratis. Den fullständiga analysen är valfri och kostar 39 kr.</p>
      <div className="mt-6"><Link data-rv="button" href="/adhd-test/test" className={cta}>Starta ADHD-testet</Link></div><p className="mt-3 text-sm text-neutral-600">Ingen registrering krävs för att starta. Självtestet kan varken bekräfta eller utesluta ADHD.</p>
    </header>
    <figure className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
      <Image src="/seo-images/adhd-test-discover.png" alt="Illustration för ADHD-test för vuxna" width={1672} height={941} sizes="(max-width: 768px) calc(100vw - 2rem), 768px" className="h-auto w-full" />
    </figure>
    <GuideSection title="Så fungerar självskattningen">
      <p>Du beskriver hur ofta du känner igen olika situationer. Testet sammanfattar svaren inom sex områden och tar upp vardagspåverkan. Den första återkopplingen bygger på dina svar. Den fullständiga analysen jämför områdena med varandra.</p>
      <p><strong>Exempel på återkoppling</strong><br />Om uppmärksamhet sticker ut i dina svar kan återkopplingen handla om fokus och distraktion. Den beskriver dina svar och kan inte avgöra varför du har svårt att hålla fokus.</p>
      <p>Testet är utvecklat av Relationsvarning. Läs om <Link href="/metodik" className={textLink}>hur vi utformar våra självtester</Link>.</p>
    </GuideSection>
    <GuideSection title="Vad frågorna handlar om"><div className="grid gap-3 sm:grid-cols-2">{cards.map(([name,description]) => <div data-rv="card" key={name} className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><h3 className="font-semibold text-neutral-900">{name}</h3><p className="mt-2">{description}</p></div>)}</div><Link data-rv="button" href="/adhd-test/test" className={cta}>Gör ADHD-testet</Link></GuideSection>
    <GuideSection title="När det är svårt att komma igång"><p>Att ofta skjuta upp något eller ha svårt att starta kan ha flera förklaringar. <Link href="/prokrastinering" className={textLink}>Läs om prokrastinering</Link> och om hur undvikande, känslor och igångsättning kan hänga ihop.</p><p>Du kan också läsa om <Link href="/exekutiva-funktioner" className={textLink}>exekutiva funktioner</Link>, som är ett bredare begrepp för bland annat planering, arbetsminne och självreglering.</p></GuideSection>

    <GuideSection title="Hur vet man om man kan ha ADHD som vuxen?">
      <p>Frågan ”har jag ADHD?” blir mer meningsfull när den kopplas till återkommande mönster än till en enskild svår dag. ADHD-symtom hos vuxna kan handla om att tappa koncentrationen, få svårt att organisera uppgifter eller komma igång trots att man vill. Tidsuppfattning, impulsiva handlingar och en inre rastlöshet kan också vara relevanta delar av bilden.</p>
      <p>I en bedömning är det viktigt hur länge svårigheterna funnits och om de påverkar flera delar av livet, till exempel arbete, studier, hem och relationer. En klinisk utredning undersöker också barndomen. Sista frågan i självtestet ger en återblick, men fastställer inte när svårigheterna började.</p>
      <p>Ett ADHD-självtest kan hjälpa dig strukturera dina observationer. Det kan inte avgöra om ADHD är orsaken. Liknande problem kan också förekomma vid stress, sömnbrist, ångest, depression eller annan belastning. Läs mer om symtom och att söka stöd hos <a href="https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/adhd/" className={textLink}>1177</a>.</p>
    </GuideSection>
    <GuideSection title="ADHD hos kvinnor upptäcks inte alltid på samma sätt">
      <p>ADHD behöver inte innebära att någon synligt går på högvarv. Svårigheterna kan också märkas som inre rastlöshet, glömska, överbelastning eller mycket arbete med att hålla struktur. Det gäller kvinnor såväl som andra vuxna.</p>
      <p>ADHD kan missas hos flickor och kvinnor, vilket också uppmärksammas i <a href="https://www.nice.org.uk/guidance/ng87/chapter/recommendations" className={textLink}>NICE:s riktlinjer</a>. Frågorna handlar om flera områden, däribland uppmärksamhet. Poängsättningen använder inte kön.</p>
      <p>Fördjupa dig i <Link href="/adhd-kvinnor" className={textLink}>guiden om ADHD hos kvinnor</Link>.</p>
    </GuideSection>
    <GuideSection title="Om du funderar på att söka stöd">
      <p>Om svårigheterna påverkar din vardag kan du skriva ner konkreta exempel från hemmet, arbetet eller studierna och ta med dem till en vårdkontakt. Läs hos <a href="https://www.1177.se/stockholm/undersokning-behandling/undersokningar-och-provtagning/psykiatriska-utredningar/neuropsykiatrisk-utredning/" className={textLink}>1177 om hur en neuropsykiatrisk utredning går till</a>.</p>
      <p>Relationsvarnings självskattning är ett stöd för egen reflektion. Resultatet kommer från vår egen modell, som saknar klinisk validering. Profilnamnen i rapporten är Relationsvarnings egna.</p>
      <p>Funderar du på både ADHD och autism? Läs om <Link href="/adhd-autism" className={textLink}>skillnader och överlapp mellan ADHD och autism</Link> eller om <Link href="/audhd-test" className={textLink}>självtestet för kombinerade drag</Link>.</p>
      <p>Läs också om <Link href="/hogkanslig-eller-adhd" className={textLink}>högkänslighet och ADHD</Link> om du undrar vad starka intryck kan betyda i olika sammanhang.</p>
    </GuideSection>
    <GuideSection title="Vanliga frågor om ADHD-testet">{faq.map(([question,answer]) => <div key={question} className="space-y-2 border-t border-neutral-200 pt-4"><h3 className="text-lg font-semibold text-neutral-900">{question}</h3><p>{answer}</p></div>)}<div className="space-y-2 border-t border-neutral-200 pt-4"><h3 className="text-lg font-semibold text-neutral-900">Vad kostar testet?</h3><p>Testet är gratis att genomföra och du får ett personligt fynd från dina svar utan kostnad. Den fullständiga personliga analysen kostar 39 kr.</p></div></GuideSection>
    <GuideSection title="Nyfiken på vad dina egna svar visar?"><p>30 frågor. Sex områden. En samlad analys av ditt svarsmönster.</p><Link data-rv="button" href="/adhd-test/test" className={cta}>Starta ADHD-testet</Link></GuideSection>
    <GuideSection title="Läs mer om ADHD"><p>Utforska symtom, olika uttryck och situationer i vuxenlivet.</p><GuideLinks links={adhdGuides.map((guide) => ({ href: `/${guide.slug}`, label: guide.label }))} /></GuideSection>
    </article>
  </main></EditorialSurface>;
}
