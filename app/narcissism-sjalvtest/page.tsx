import type { Metadata } from "next";
import Link from "next/link";
import { GuideSection, textLink } from "../_components/ContentGuide";

const url = "https://www.relationsvarning.se/narcissism-sjalvtest";
export const metadata: Metadata = {
  title: "Narcissist test – självtest för narcissistiska drag | Relationsvarning",
  description: "Gör ett narcissism självtest med 30 frågor. Se dina narcissistiska drag inom sex områden och få en personlig profil av dina relationsmönster.",
  alternates: { canonical: url },
  openGraph: {
    title: "Narcissism självtest – hur starka narcissistiska drag har du?",
    description: "30 frågor ger en personlig profil över bland annat självbild, bekräftelsebehov, empati, kritik och relationsmönster.",
    url, type: "website", locale: "sv_SE", siteName: "Relationsvarning",
  },
};
const areas = [
  ["Grandiositet & självbild", "Hur starkt du upplever dig som särskild, kompetent eller mer insiktsfull än andra."],
  ["Bekräftelsebehov", "Hur mycket din självkänsla påverkas av uppskattning, uppmärksamhet och andras respons."],
  ["Berättigande & kontroll", "Hur starkt du förväntar dig att andra ska ta hänsyn till dina behov eller anpassa sig."],
  ["Empati & ömsesidighet", "Hur lätt du kan väga in andras perspektiv, behov och känslor när de krockar med dina egna."],
  ["Kritikkänslighet & skam", "Hur starkt kritik, avvisande, respektlöshet eller känslan av att bli förminskad påverkar dig."],
  ["Strategiskt inflytande", "Hur mycket du använder exempelvis skuld, charm, information eller kommunikation för att påverka andra."],
];
const faq = [
  ["Är jag narcissist?", "Narcissistiska drag finns på ett spektrum. Självtestet hjälper dig se hur starka olika narcissistiska mönster är hos dig och vilka områden som är mest framträdande."],
  ["Vad är narcissistiska drag?", "Det kan bland annat handla om grandiositet, behov av bekräftelse, berättigande, känslighet för kritik, låg ömsesidighet eller ett starkt behov av inflytande i relationer."],
  ["Vad är sårbar narcissism?", "Sårbara narcissistiska drag kan exempelvis visa sig genom stark känslighet för kritik, skam, avvisande och ett stort behov av andras bekräftelse."],
  ["Vad är grandios narcissism?", "Grandiosa drag är oftare kopplade till stark självbild, känsla av särskildhet, behov av erkännande och förväntningar på särskild behandling."],
  ["Kan man ha narcissistiska drag utan att vara narcissist?", "Ja. Narcissistiska personlighetsdrag förekommer i olika grad och behöver inte innebära ett psykiatriskt tillstånd."],
  ["Hur fungerar narcissism självtestet?", "Du svarar på 30 påståenden. Svaren analyseras inom sex områden och sammanställs till en övergripande nivå och en personlig profil."],
];
const cta = "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-center font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto";
const card = "min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5";
const schema = {
  "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": url + "#webpage", url, name: "Narcissism – självtest", description: metadata.description, inLanguage: "sv-SE", breadcrumb: { "@id": url + "#breadcrumb" } },
    { "@type": "FAQPage", "@id": url + "#faq", url: url + "#faq", mainEntity: faq.map(([name,text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
    { "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Relationsvarning", item: "https://www.relationsvarning.se/" },
      { "@type": "ListItem", position: 2, name: "Tester", item: "https://www.relationsvarning.se/#tests-heading" },
      { "@type": "ListItem", position: 3, name: "Narcissism självtest", item: url },
    ] },
  ],
};
export default function NarcissismSelfTestLanding() {
  return <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-14">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema).replace(/</g,"\\u003c")}} />
    <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><ol className="flex flex-wrap items-center gap-x-2"><li><Link href="/" className={textLink + " inline-flex min-h-11 items-center"}>Relationsvarning</Link></li><li className="flex items-center gap-2"><span aria-hidden="true">/</span><Link href="/#tests-heading" className={textLink + " inline-flex min-h-11 items-center"}>Tester</Link></li><li className="flex items-center gap-2"><span aria-hidden="true">/</span><span aria-current="page">Narcissism självtest</span></li></ol></nav>
    <article>
      <header className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">NARCISSISM – SJÄLVTEST</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Hur starka narcissistiska drag har du?</h1>
        <p className="mt-5 leading-7 text-neutral-700">Narcissistiska drag finns i olika grad hos de flesta människor. Det här självtestet hjälper dig se hur dina egna mönster ser ut inom bland annat självbild, bekräftelsebehov, empati, känslighet för kritik och relationer.</p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600"><li>30 frågor</li><li>ca 5 minuter</li><li>6 personliga delresultat</li></ul>
        <div className="mt-6"><Link href="/narcissism-sjalvtest/test" className={cta}>Starta självtestet</Link><p className="mt-3 text-sm text-neutral-600">Ingen registrering krävs</p></div>
      </header>
      <GuideSection title={'Ett mer nyanserat test än bara “är du narcissist?”'}>
        <p>Narcissism handlar inte om en enda egenskap. Två personer kan få liknande totalresultat men ha helt olika mönster. En person kan främst söka bekräftelse och reagera starkt på kritik, medan en annan visar mer grandiositet, berättigande eller strategiskt inflytande i relationer.</p>
        <div className="grid gap-4 sm:grid-cols-2">{areas.map(([title,text]) => <div key={title} className={card}><h3 className="font-semibold text-neutral-900">{title}</h3><p className="mt-2 text-sm leading-6">{text}</p></div>)}</div>
      </GuideSection>
      <GuideSection title="Narcissistiska drag kan se väldigt olika ut">
        <p>Narcissism förknippas ofta med självsäkerhet, överlägsenhet och behov av beundran. Men narcissistiska mönster kan också vara betydligt mindre uppenbara.</p>
        <p>Hos vissa personer syns de främst genom grandiositet, berättigande och ett starkt behov av status eller erkännande. Hos andra märks de mer genom känslighet för kritik, starkt bekräftelsebehov, skam eller svårigheter att hantera avvisande.</p>
        <p>Därför tittar självtestet inte bara på ett enda totalvärde. Resultatet visar hur olika delar av din profil förhåller sig till varandra.</p>
      </GuideSection>
      <GuideSection title="Två vanliga uttryck">
        <div className="grid gap-4 sm:grid-cols-2"><div className={card}><h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">Mer grandiosa drag</h3><p className="mt-3">Kan bland annat visa sig som:</p><ul className="mt-2 list-disc space-y-2 pl-5"><li>stark tro på den egna förmågan</li><li>behov av erkännande</li><li>känsla av att förtjäna särskild behandling</li><li>svårigheter att acceptera att andra inte anpassar sig</li><li>strategiskt eller kontrollerande beteende</li></ul></div><div className={card}><h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">Mer sårbara drag</h3><p className="mt-3">Kan bland annat visa sig som:</p><ul className="mt-2 list-disc space-y-2 pl-5"><li>stark känslighet för kritik</li><li>mycket grubblande efter avvisande</li><li>beroende av andras bekräftelse</li><li>skam eller ilska när självkänslan hotas</li><li>svårighet att känna sig trygg utan uppskattning</li></ul></div></div>
        <p>Många människor visar en blandning av båda typerna. Ditt resultat analyserar därför kombinationen av dina svar, inte bara totalsumman.</p>
      </GuideSection>
      <GuideSection title="Vad får du efter testet?">
        <div className={card} aria-label="Illustrativt exempel på ett fullständigt resultat"><p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Illustrativt exempel – inte ditt resultat</p><h3 className="mt-3 font-semibold">Din övergripande profil</h3><p>Tydliga narcissistiska drag</p><p className="mt-2 text-3xl font-semibold text-neutral-900">58 %</p><p className="mt-3"><strong>Profiltyp:</strong> Främst sårbar profil</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{[["Grandiositet",42],["Bekräftelsebehov",78],["Berättigande",51],["Empati & ömsesidighet",36],["Kritikkänslighet",84],["Strategiskt inflytande",27]].map(([name,value]) => <div key={name} className="min-w-0"><p className="text-sm">{name} {value} %</p><div className="mt-1 h-2 overflow-hidden rounded bg-neutral-200" aria-hidden="true"><div className="h-full rounded bg-neutral-700" style={{width: `${value}%`}} /></div></div>)}</div></div>
        <p>Det fullständiga resultatet visar vilka områden som ligger högst, hur de samverkar och hur mönstren kan märkas i nära relationer.</p>
      </GuideSection>
      <GuideSection title="Din personliga analys"><dl className="space-y-4">{[
        ["Övergripande nivå","Hur tydliga narcissistiska drag dina svar visar totalt."],
        ["Sex dimensionsresultat","Se exakt vilka områden som sticker ut."],
        ["Grandios eller sårbar profil","Se vilket mönster som är mest framträdande hos dig."],
        ["Relationsanalys","Hur kombinationen kan påverka konflikter, närhet, bekräftelse och ömsesidighet."],
        ["Personlig tolkning","En sammanhängande analys baserad på kombinationen av just dina svar."],
      ].map(([title,text]) => <div key={title}><dt className="font-semibold text-neutral-900">{title}</dt><dd>{text}</dd></div>)}</dl><p className="text-sm">Efter testet visas din övergripande nivå och en kort profilindikation. Den fullständiga analysen kan låsas upp för 79 kr som engångsköp.</p></GuideSection>
      <GuideSection title="Nyfiken på din egen profil?"><p>30 frågor ger dig en detaljerad bild av hur narcissistiska drag kan visa sig hos dig.</p><Link href="/narcissism-sjalvtest/test" className={cta}>Starta narcissism självtest</Link><p className="text-sm">Tar cirka 5 minuter</p><p className="text-sm">Försöker du istället förstå en partners beteende? <Link href="/narcissist-i-en-relation/test" className={textLink}>Gör testet om narcissistiska beteendemönster hos en partner.</Link></p></GuideSection>
      <div id="faq"><GuideSection title="Vanliga frågor">{faq.map(([question,answer]) => <div key={question}><h3 className="text-lg font-semibold text-neutral-900">{question}</h3><p className="mt-2">{answer}</p></div>)}</GuideSection></div>
      <p className="mt-8 text-sm leading-6 text-neutral-600">Självtestet beskriver narcissistiska drag och mönster och ställer inte psykiatriska diagnoser.</p>
    </article>
  </main>;
}
