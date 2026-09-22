import EditorialSurface from "../_components/EditorialSurface";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideLinks, GuideSection, textLink } from "../_components/ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";
import adhdGuides from "../../content/adhd-guides.json";
const title = "ADHD-test för vuxna – självtest med 30 frågor | Relationsvarning";
const description = "ADHD-test för vuxna med 30 frågor om fokus, organisation, impulsivitet, inre rastlöshet, tid och vardagspåverkan. Utforska hur dina svar hänger ihop.";
export const metadata: Metadata = {
  title,
  description,
  ...getEditorialMetadata({ route: "/adhd-test", title, description, datePublished: "2026-09-14T19:17:23+02:00", dateModified: "2026-09-14T23:13:54+02:00" }),
};
const articleJsonLd = getEditorialArticleSchema({ route: "/adhd-test", title, description, datePublished: "2026-09-14T19:17:23+02:00", dateModified: "2026-09-14T23:13:54+02:00" });
const sections = [
  {
    "title": "Ett ADHD-test ska inte försöka övertyga dig om att du har ADHD",
    "paragraphs": [
      "Många självtester finns hos verksamheter som också erbjuder ADHD-utredningar, behandling eller andra tjänster efteråt.",
      "Relationsvarning säljer ingen ADHD-utredning, ingen medicin och ingen behandling.",
      "Testets poängsättning ska därför inte styra resultatet mot en viss slutsats.",
      "Din analys kan visa ett tydligt ADHD-relaterat mönster.",
      "Men den kan också visa att dina svar inte passar särskilt tydligt in i ett sådant mönster.",
      "Det tycker vi att ett seriöst självtest måste kunna säga."
    ]
  },
  {
    "title": "Vi behöver inte 'hitta ADHD' hos dig",
    "paragraphs": [
      "Om du redan misstänker ADHD är det lätt att känna igen sig i enskilda symptom.",
      "Problemet är att många av dem också kan förekomma av helt andra skäl.",
      "Att ibland skjuta upp saker, tappa fokus eller känna sig rastlös betyder inte automatiskt ADHD.",
      "Därför tittar testet på hur flera områden samspelar, hur ofta svårigheterna förekommer och hur mycket de faktiskt påverkar ditt fungerande i vardagen.",
      "Målet är inte att bekräfta det du redan tror.",
      "Målet är att ge en mer nyanserad bild av vad dina svar faktiskt visar."
    ]
  },
  {
    "title": "Du är inte en procentsats",
    "paragraphs": [
      "Två personer kan få ungefär samma totalpoäng och ändå fungera helt olika.",
      "Den ena kan framför allt känna igen sig i distraherbarhet och svårigheter att komma igång.",
      "Den andra kan beskriva stark rastlöshet, impulsivitet och behov av ständig stimulans.",
      "En totalsiffra missar den skillnaden.",
      "Därför analyseras testets sex områden separat innan de vägs samman till en helhetsbild."
    ]
  },
  {
    "title": "Ett självtest är inte en diagnos",
    "paragraphs": [
      "ADHD kan inte diagnostiseras med ett enskilt webbtest.",
      "En klinisk bedömning behöver bland annat ta hänsyn till hur länge problemen funnits, hur de påverkar olika delar av livet och om andra förklaringar kan passa bättre.",
      "Det här testet är därför utformat för något annat:",
      "att hjälpa dig se vilka mönster som faktiskt finns i dina egna svar och hur tydliga de är."
    ]
  }
];
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
    "Nej. Ett självtest kan inte ställa diagnos. Det kan däremot visa om dina svar bildar mönster som ofta förknippas med ADHD och vilka områden som framträder mest."
  ],
  [
    "Kan resultatet visa att mina svar inte verkar särskilt typiska för ADHD?",
    "Ja. Testet är inte byggt för att alltid landa i ett ADHD-liknande resultat."
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
      <p className="mt-5 text-lg leading-8 text-neutral-700">30 frågor som kartlägger sex områden som ofta är relevanta vid ADHD – och visar hur dina svar faktiskt hänger ihop.</p>
      <p className="mt-4 leading-7 text-neutral-700">Inte bara koncentration. Testet tittar även på organisation, impulsivitet, inre rastlöshet, tidsuppfattning och hur svårigheterna påverkar vardagen.</p>
      <div className="mt-6"><Link data-rv="button" href="/adhd-test/test" className={cta}>Starta ADHD-testet</Link></div><p className="mt-3 text-sm text-neutral-600">Tar cirka 5 minuter · För vuxna · Ingen registrering</p>
    </header>
    {sections.slice(0,2).map((s,i) => <GuideSection key={s.title} title={s.title}>{s.paragraphs.map(p => <p key={p}>{p}</p>)}{i===1 && <Link data-rv="button" href="/adhd-test/test" className={cta}>Gör ADHD-testet</Link>}</GuideSection>)}
    <GuideSection title="Mer än ett koncentrationstest"><div className="grid gap-3 sm:grid-cols-2">{cards.map(([name,description]) => <div data-rv="card" key={name} className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><h3 className="font-semibold text-neutral-900">{name}</h3><p className="mt-2">{description}</p></div>)}</div></GuideSection>
    <GuideSection title={sections[2].title}>{sections[2].paragraphs.map(p => <p key={p}>{p}</p>)}</GuideSection>
    <GuideSection title="Hur vet man om man kan ha ADHD som vuxen?">
      <p>Frågan ”har jag ADHD?” blir mer meningsfull när den kopplas till återkommande mönster än till en enskild svår dag. ADHD-symtom hos vuxna kan handla om att tappa koncentrationen, få svårt att organisera uppgifter eller komma igång trots att man vill. Tidsuppfattning, impulsiva handlingar och en inre rastlöshet kan också vara relevanta delar av bilden.</p>
      <p>I en bedömning är det viktigt hur länge svårigheterna funnits och om de påverkar flera delar av livet, till exempel arbete, studier, hem och relationer. En klinisk utredning undersöker också barndomen. Sista frågan i självtestet ger en återblick, men fastställer inte när svårigheterna började.</p>
      <p>Ett ADHD-självtest kan hjälpa dig strukturera dina observationer. Det kan inte avgöra om ADHD är orsaken. Liknande problem kan också förekomma vid stress, sömnbrist, ångest, depression eller annan belastning. Läs mer om symtom och att söka stöd hos <a href="https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/adhd/" className={textLink}>1177</a>.</p>
    </GuideSection>
    <GuideSection title="ADHD hos kvinnor upptäcks inte alltid på samma sätt">
      <p>ADHD behöver inte innebära att någon synligt går på högvarv. Svårigheterna kan också märkas som inre rastlöshet, glömska, överbelastning eller mycket arbete med att hålla struktur. Det gäller kvinnor såväl som andra vuxna.</p>
      <p>ADHD kan missas hos flickor och kvinnor, vilket också uppmärksammas i <a href="https://www.nice.org.uk/guidance/ng87/chapter/Recommendations" className={textLink}>NICE:s riktlinjer</a>. Testet bygger därför inte hela bilden kring synlig hyperaktivitet, och resultatet bedöms inte olika beroende på kön.</p>
      <p>Fördjupa dig i <Link href="/adhd-kvinnor" className={textLink}>guiden om ADHD hos kvinnor</Link>.</p>
    </GuideSection>
    <GuideSection title={sections[3].title}>{sections[3].paragraphs.map(p => <p key={p}>{p}</p>)}<p>Det är Relationsvarnings egen självskattningsmodell, inte ett kliniskt validerat instrument. Produktprofilerna är inte officiella ADHD-subtyper.</p></GuideSection>
    <GuideSection title="Vanliga frågor om ADHD-testet">{faq.map(([question,answer]) => <div key={question} className="space-y-2 border-t border-neutral-200 pt-4"><h3 className="text-lg font-semibold text-neutral-900">{question}</h3><p>{answer}</p></div>)}</GuideSection>
    <GuideSection title="Nyfiken på vad dina egna svar visar?"><p>30 frågor. Sex områden. En samlad analys av ditt svarsmönster.</p><Link data-rv="button" href="/adhd-test/test" className={cta}>Starta ADHD-testet</Link></GuideSection>
    <GuideSection title="Läs mer om ADHD"><p>Utforska symtom, olika uttryck och situationer i vuxenlivet.</p><GuideLinks links={adhdGuides.map((guide) => ({ href: `/${guide.slug}`, label: guide.label }))} /></GuideSection>
    </article>
  </main></EditorialSurface>;
}
