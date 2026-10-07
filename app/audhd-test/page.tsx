import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";
import { GuideSection, textLink } from "../_components/ContentGuide";

const title = "AuDHD-test för vuxna – ADHD och autism samtidigt | Relationsvarning";
const description = "Gör ett omfattande AuDHD-test för vuxna med 48 frågor om ADHD-drag, autismdrag och överlappande mönster. Få ett första resultat direkt.";
export const metadata: Metadata = { title, description, ...getEditorialMetadata({ route: "/audhd-test", title, description, datePublished: "2026-09-26T10:00:00+02:00", dateModified: "2026-09-28T10:00:00+02:00" }) };

const article = getEditorialArticleSchema({ route: "/audhd-test", title, description, datePublished: "2026-09-26T10:00:00+02:00", dateModified: "2026-09-28T10:00:00+02:00" });
const cta = "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#27666A] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27666A] sm:w-auto";

const areas = [
  ["Uppmärksamhet & exekutiv funktion", "Igångsättning, fokus, arbetsminne, tid och att hålla ihop vardagens steg."],
  ["Impulsivitet & rastlöshet", "Stimulansbehov, spontana beslut, väntan och den inre känslan av rastlöshet."],
  ["Social kommunikation", "Sociala förväntningar, samtalsflyt, indirekta budskap och social energi."],
  ["Rutiner & flexibilitet", "Förutsägbarhet, planändringar, omställningar, rutiner och uppslukande intressen."],
  ["Sensorisk känslighet", "Hur ljud, ljus, beröring och många samtidiga intryck kan påverka återhämtning."],
  ["Masking & kompensation", "Förberedelser, inlärda strategier och det aktiva arbete som kan ligga bakom att fungera utåt."],
  ["AuDHD-friktion", "Upplevda krockar mellan behov, till exempel struktur och svårigheten att följa struktur."],
  ["Vardagspåverkan", "Hur svaren relaterar till arbete, studier, relationer, energi och återhämtning."],
] as const;

const relatedGuides = [
  ["/audhd", "Vad är AuDHD?", "Den korta och breda guiden om samtidig ADHD och autism."],
  ["/audhd-symtom-vuxna", "AuDHD hos vuxna", "Vanliga mönster kring fokus, rutiner, sensorik och social energi."],
  ["/audhd-kvinnor", "AuDHD hos kvinnor", "Om variation, anpassning och osynlig belastning."],
  ["/audhd-masking", "AuDHD och masking", "När strategier hjälper utåt men samtidigt kan ta energi."],
  ["/adhd-eller-autism", "ADHD eller autism?", "Skillnader, likheter och överlapp utan enkla slutsatser."],
  ["/adhd-och-autism-samtidigt", "ADHD och autism samtidigt", "Om behov som kan förstärka eller motverka varandra."],
] as const;

const faqs = [
  ["Vad är ett AuDHD-test?", "Det är en självskattning som samlar frågor om ADHD- och autismrelaterade områden och hur svaren kan samspela."],
  ["Kan man testa ADHD och autism samtidigt?", "Ett självtest kan låta dig reflektera över båda områdena samtidigt, men kan inte avgöra om du har ADHD, autism eller båda."],
  ["Är AuDHD en egen diagnos?", "Nej. AuDHD är ett informellt begrepp som används om samtidig ADHD och autism, inte en separat diagnos."],
  ["Kan AuDHD-testet ge en diagnos?", "Nej. Testet beskriver självskattade svarsmönster och ersätter inte en neuropsykiatrisk utredning."],
  ["Hur många frågor innehåller testet?", "Testet innehåller 48 frågor inom åtta områden, följt av några korta frågor som sätter svaren i sammanhang."],
  ["Hur lång tid tar testet?", "För de flesta tar själva frågorna omkring åtta minuter, men tiden kan variera beroende på hur länge du vill tänka på varje svar."],
  ["Vad är skillnaden mellan ett AuDHD-test och ett vanligt ADHD-test?", "Ett ADHD-test fokuserar på ADHD-relaterade drag. AuDHD-testet tar även upp autismrelaterade områden och hur olika behov kan samspela."],
  ["Vem är testet gjort för?", "Testet är skrivet för vuxna som vill strukturera egna observationer kring ADHD- och autismrelaterade drag."],
] as const;

const structuredData = [
  article,
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Relationsvarning", item: "https://www.relationsvarning.se/" }, { "@type": "ListItem", position: 2, name: "AuDHD-test för vuxna", item: "https://www.relationsvarning.se/audhd-test" }] },
];

export default function AudhdLanding() {
  return <EditorialSurface><main data-rv="container" className="mx-auto max-w-4xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-14">
    <EditorialArticleJsonLd data={article} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.slice(1)).replace(/</g, "\\u003c") }} />
    <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className={textLink}>Relationsvarning</Link> / <span aria-current="page">AuDHD-test</span></nav>
    <article>
      <header className="mt-6 rounded-[28px] border border-[#D6E1DD] bg-[#FFFEFC] px-5 py-8 shadow-sm sm:px-9 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Självtest för vuxna</p>
        <h1 className="mt-3 max-w-3xl">AuDHD-test för vuxna</h1>
        <p className="mt-4 text-xl font-semibold leading-8 text-[#364A4B]">Ett av Sveriges första och mest omfattande AuDHD-självtest för vuxna</p>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-700">48 frågor som kartlägger ADHD-relaterade drag, autismrelaterade drag och hur de kan överlappa i vardagen. Testet är utvecklat för vuxna som känner igen sig i båda områdena och vill förstå sitt mönster bättre.</p>
        <div className="mt-7"><Link data-rv="button" href="/audhd-test/test" className={cta}>Starta AuDHD-testet</Link></div>
        <p className="mt-3 text-sm font-semibold text-neutral-700">48 frågor · cirka 8 minuter · första resultatet direkt</p>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-neutral-600">AuDHD är ett informellt begrepp för samtidig ADHD och autism. Självtestet ersätter inte en neuropsykiatrisk utredning.</p>
      </header>

      <GuideSection title="Varför ett kombinerat AuDHD-test?"><div className="max-w-3xl space-y-4"><p>ADHD och autism är separata tillstånd som kan förekomma samtidigt. Ett vanligt ADHD-test fokuserar främst på ADHD-relaterade drag, medan ett autismtest fokuserar på autismrelaterade drag.</p><p>Det här testet låter båda områdena få plats och tittar också på hur svarsmönstret mellan dem kan se ut. <Link href="/audhd" className={textLink}>Läs mer om vad AuDHD innebär</Link>.</p></div></GuideSection>

      <GuideSection title="Vad testet tittar på"><p className="max-w-3xl">Åtta tydligt avgränsade områden ger ett bredare underlag än en enda totalsiffra.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{areas.map(([name, copy], index) => <div data-rv="card" key={name} className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><div className="flex gap-3"><span aria-hidden="true" className="font-serif text-xl text-[#27666A]">{String(index + 1).padStart(2, "0")}</span><div><h3 className="font-semibold text-neutral-950">{name}</h3><p className="mt-2 text-sm leading-6 text-neutral-700">{copy}</p></div></div></div>)}</div></GuideSection>

      <GuideSection title="Mer än bara en totalsiffra"><div className="max-w-3xl space-y-4"><p>Två personer kan känna igen sig i både ADHD- och autismrelaterade drag men ändå ha mycket olika profiler. Därför ser resultatet på hur svaren fördelar sig mellan områden, inte bara på ett enda sammanlagt värde.</p><p>Resultatet skiljer bland annat mellan ADHD- och autismrelaterade områden, och håller masking, upplevd friktion och vardagspåverkan som egna delar av profilen. Det är en självskattning, inte ett diagnostiskt besked.</p></div><div className="mt-6"><Link data-rv="button" href="/audhd-test/test" className={cta}>Starta AuDHD-testet</Link></div></GuideSection>

      <GuideSection title="Byggt kring etablerad kunskap om ADHD och autism"><div className="max-w-3xl space-y-4"><p>Testet använder områden som ofta beskrivs i information om ADHD och autism, till exempel uppmärksamhet, impulsivitet, social kommunikation, rutiner och sensoriska intryck. Masking och kompensation hålls separat i resultatet eftersom de kan vara viktiga erfarenheter utan att i sig bevisa något.</p><p>Relationsvarnings frågor, viktningar och resultatnivåer är en egen modell och inte ett kliniskt validerat instrument. För grundläggande medicinsk information finns <a className={textLink} href="https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/adhd/">1177 om ADHD</a> och <a className={textLink} href="https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/autism/">1177 om autism</a>.</p></div></GuideSection>

      <GuideSection title="Vad betyder AuDHD?"><div className="max-w-3xl space-y-4"><p>AuDHD är ett informellt begrepp för samtidig ADHD och autism. Det är inte en separat diagnos, och en självskattning kan inte avgöra vilken förklaring som passar en enskild person.</p><p><Link href="/audhd" className={textLink}>Läs hela guiden om AuDHD och ADHD + autism samtidigt</Link>.</p></div></GuideSection>
      <GuideSection title="Planering, fokus och igångsättning"><div className="max-w-3xl space-y-4"><p>Svårigheter med vardagens steg behöver inte ha en enda förklaring. <Link href="/exekutiva-funktioner" className={textLink}>Läs om exekutiva funktioner</Link> för en bred förklaring av planering, arbetsminne och självreglering.</p></div></GuideSection>

      <GuideSection title="Fördjupa dig i rätt del av ämnet"><div className="grid gap-3 sm:grid-cols-2">{relatedGuides.map(([href, heading, copy]) => <Link data-rv="card" key={href} href={href} className="block rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition hover:border-neutral-300 hover:bg-white"><h3 className="font-semibold text-neutral-950">{heading} <span aria-hidden="true">→</span></h3><p className="mt-2 text-sm leading-6 text-neutral-700">{copy}</p></Link>)}</div></GuideSection>

      <GuideSection title="Vanliga frågor om AuDHD-testet"><div className="divide-y divide-neutral-200 border-y border-neutral-200">{faqs.map(([question, answer]) => <div key={question} className="py-5"><h3 className="font-semibold text-neutral-950">{question}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-700">{answer}</p></div>)}</div></GuideSection>

      <section data-rv="panel" className="mt-12 rounded-[28px] border border-[#D6E1DD] bg-[#FFFEFC] px-5 py-8 text-center sm:px-9 sm:py-10"><h2 className="text-3xl font-semibold tracking-tight text-neutral-950">Redo att se hur ditt mönster ser ut?</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-neutral-700">Svara på 48 frågor och få ett första resultat direkt i webbläsaren.</p><div className="mt-6"><Link data-rv="button" href="/audhd-test/test" className={cta}>Starta AuDHD-testet</Link></div><p className="mt-3 text-sm font-semibold text-neutral-700">48 frågor · första resultatet direkt</p></section>
    </article>
  </main></EditorialSurface>;
}
