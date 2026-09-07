import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Love bombing – 10 tecken och skillnaden mot förälskelse",
  description:
    "Vad är love bombing? Läs om 10 tecken, skillnaden mot stark förälskelse och vad du kan göra om uppmärksamheten övergår i press eller kontroll.",
  alternates: {
    canonical: "https://www.relationsvarning.se/love-bombing-relation",
  },
  openGraph: {
    title: "Love bombing – 10 tecken och skillnaden mot förälskelse",
    description:
      "En saklig guide om love bombing: 10 tecken, gränser, stark förälskelse och vad du kan göra om du känner igen mönstret.",
    url: "/love-bombing-relation",
    type: "article",
  },
};

const warningSigns = [
  {"title":"Intensiv kontakt mycket tidigt","text":"Kontakten blir intensiv väldigt snabbt. Personen vill höras hela tiden, ses ofta och skapa en känsla av att ni redan är “självklara”."},
  {"title":"Stora ord och framtidsplaner direkt","text":"Du får ovanligt stora ord tidigt: att du är unik, den enda som förstår personen, att det känns “ödesbestämt” eller att ni är menade för varandra efter mycket kort tid."},
  {"title":"Uppmärksamhet som känns överväldigande","text":"Du blir överöst med uppmärksamhet, komplimanger, gåvor eller löften, samtidigt som du upplever press att ta emot eller återgälda dem."},
  {"title":"Relationen tränger undan ditt eget liv","text":"Personen vill snabbt skapa exklusivitet: mindre tid med vänner, mindre distans, mer tillgänglighet och mer fokus på relationen som centrum."},
  {"title":"Krav på snabb respons och bekräftelse","text":"Det finns en subtil press att svara snabbt, visa lika starkt intresse tillbaka eller bekräfta relationen på samma nivå."},
  {"title":"Gränser möts med skuld eller kyla","text":"När du saktar ner eller sätter gränser blir stämningen märklig: besvikelse, skuld, kyla eller dramatik kan dyka upp nästan direkt."},
  {"title":"Du känner dig smickrad men pressad","text":"Du känner dig både smickrad och lätt överrumplad. Något känns väldigt starkt – men också lite för mycket, lite för fort."},
  {"title":"Ni verkar överens om nästan allt","text":"Personen verkar dela alla dina värderingar och framtidsplaner redan innan ni hunnit lära känna varandra. Likheter i sig är inget varningstecken; lägg märke till om också olikheter får plats."},
  {"title":"Du förväntas bevisa din lojalitet","text":"Det tidiga idealiserandet följs ibland av små test: hur lojal du är, hur snabbt du svarar, hur mycket du prioriterar relationen framför annat."},
  {"title":"Värmen blir mindre förutsägbar","text":"Den intensiva uppmärksamheten kan följas av mindre värme, fler dubbla signaler eller osäkerhet. En lugnare vardag är däremot inte i sig love bombing."},
];

const differences = [
  {
    title: "Trygg förälskelse",
    text:
      "kan vara intensiv, men den tål pauser, respekt för gränser och ett naturligt tempo. Du får utrymme att tänka, känna efter och behålla ditt eget liv.",
  },
  {
    title: "Love bombing",
    text:
      "kan innebära att tempot skapar press att binda dig snabbt, med mindre utrymme för egna vänner, eftertanke och ett nej.",
  },
  {
    title: "Trygg förälskelse",
    text:
      "blir inte kall eller straffande när du behöver bromsa. Den kräver inte att du bevisar närhet genom att ge upp gränser.",
  },
  {
    title: "Love bombing",
    text:
      "kan snabbt följas av skuld, kyla, passiv aggressivitet eller avstånd om du inte ger samma intensitet tillbaka.",
  },
];

const whatToDo = [
  "Titta mindre på orden och mer på mönstret över tid. Vad händer när du säger nej, ber om utrymme eller inte svarar direkt?",
  "Om det känns tryggt, be om ett lugnare tempo. Om du är rädd för reaktionen, sök stöd i stället för att testa personens gränser på egen hand.",
  "Behåll ditt eget liv synligt: vänner, rutiner, träning, sömn, arbete och egna planer. Det gör det lättare att se klart.",
  "Om du kan förvara anteckningar tryggt kan du skriva ner konkreta situationer och se om ett mönster återkommer.",
  "Prata med någon du litar på som kan hjälpa dig att kalibrera. Det är lätt att vänja sig vid förvirring när man är mitt i den.",
  "Ta extra notis om förändringen efter den intensiva början. Inte bara hur fint det var då – utan hur personen beter sig när du blivit känslomässigt investerad.",
];

const faqs = [
  {
    question: "Är love bombing alltid medvetet?",
    answer:
      "Inte nödvändigtvis. I vardagligt språk används begreppet ofta för att beskriva ett mönster där intensiv uppvaktning följs av kontroll, förvirring eller kyla. Det viktiga är inte alltid om beteendet är planerat, utan vilken effekt det får på dig och relationen.",
  },
  {
    question: "Hur vet man om det bara är stark förälskelse?",
    answer:
      "Titta på hur relationen reagerar på gränser, tempo och självständighet. Trygg förälskelse tål att du tar det lugnt. Problematiska mönster blir ofta tydliga när du bromsar.",
  },
  {
    question: "Kan love bombing övergå i något mer allvarligt?",
    answer:
      "Ja, det kan i vissa relationer följas av kontroll, skuld, nedvärdering, gaslighting eller stark förvirring. Det betyder inte att varje intensiv början gör det, men det är klokt att vara uppmärksam på riktningen.",
  },
  {
    question: "Borde jag lämna direkt om jag känner igen tecknen?",
    answer:
      "Det finns inget universellt svar. För vissa räcker det att bromsa och observera. För andra blir mönstret snabbt mer skadligt. Det viktiga är att du tar din egen oro på allvar och tittar på vad som faktiskt händer över tid.",
  },
  {
    question: "Finns det koppling mellan love bombing och andra manipulationsmönster?",
    answer:
      "Ja, begreppet nämns ofta tillsammans med kontroll, stark idealisering, skuld, gaslighting och andra dynamiker där osäkerhet används för att binda personen starkare till relationen.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Love bombing – 10 tecken och skillnaden mot förälskelse",
  description:
    "Love bombing: 10 tecken, skillnaden mot stark förälskelse och råd när intensitet följs av press eller kontroll.",
  author: {
    "@type": "Organization",
    name: "Relationsvarning",
  },
  publisher: {
    "@type": "Organization",
    name: "Relationsvarning",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "/love-bombing-relation",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function LoveBombingRelationPage() {
  return (
    <main className="bg-white text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="border-b border-neutral-200 bg-gradient-to-b from-rose-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          <div className="mb-5 text-sm text-neutral-500">
            <Link href="/" className="hover:text-neutral-800">
              Startsida
            </Link>
            <span className="mx-2">/</span>
            <span>Love bombing i relation</span>
          </div>

          <div className="inline-flex items-center rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-rose-700">
            Varningssignaler i relationer
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
            Love bombing – tecken och skillnaden mot stark förälskelse
          </h1>
          <p id="vad-ar" className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700 md:text-xl">
            Love bombing beskriver ett mönster av överväldigande uppvaktning,
            stora ord och intensiv kontakt som skapar press att snabbt knyta an.
            Uppmärksamheten kan kombineras med krav eller senare följas av skuld,
            kyla och kontroll.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">
            Stark förälskelse och romantiska gester räcker inte för att avgöra om
            det är love bombing. Titta framför allt på om du får behålla ditt eget
            tempo och hur personen reagerar när du säger nej. Begreppet beskriver
            beteenden, inte en diagnos eller en säker slutsats om någons avsikt.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <Link
              href="#vad-ar"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950"
            >
              Vad love bombing är
            </Link>
            <Link
              href="#tecken"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950"
            >
              Tidiga tecken
            </Link>
            <Link
              href="#vad-sen"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950"
            >
              Vad som ofta händer sen
            </Link>
            <Link
              href="#vad-gora"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950"
            >
              Vad du kan göra
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <article className="space-y-14">
          <section id="tecken" className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              10 tecken på love bombing
            </h2>

            <p className="text-[1.05rem] leading-8 text-neutral-700">
              Enstaka tecken bevisar inte love bombing. Se till helheten: skapar
              intensiteten press, och respekteras dina gränser över tid?
            </p>

            <div className="grid gap-4">
              {warningSigns.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="mb-2 text-lg font-semibold text-neutral-950">
                    {index + 1}. {item.title}
                  </h3>
                  <p className="text-[1.02rem] leading-8 text-neutral-700">{item.text}</p>
                </div>
              ))}
            </div>

          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Love bombing eller bara stark förälskelse?
            </h2>

            <p className="text-[1.05rem] leading-8 text-neutral-700">
              Det här är en viktig fråga, eftersom alla intensiva starter inte är
              manipulativa. Ibland klickar två personer snabbt. Ibland känns något
              ovanligt starkt. Det som skiljer är ofta inte känslan i sig, utan hur
              relationen beter sig när verkligheten kommer in: vardag, gränser, eget
              liv, långsammare tempo, olika behov och förmågan att tåla att närhet
              växer stegvis.
            </p>

            <p className="text-[1.05rem] leading-8 text-neutral-700">
              Om du vill förstå dina egna reaktioner på närhet och osäkerhet kan du läsa om <Link href="/anknytning" className="underline underline-offset-4">anknytningsångest och anknytningsundvikande</Link>. En anknytningsprofil avgör däremot inte om partnerns beteende är manipulativt.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {differences.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <h3 className="text-lg font-semibold text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[1.02rem] leading-8 text-neutral-700">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

          </section>

          <section id="vad-sen" className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Hur mönstret kan förändras efter den intensiva början
            </h2>

            <div className="space-y-5 text-[1.05rem] leading-8 text-neutral-700">
              <p>
                Det mest förvirrande med love bombing är ofta inte början – utan
                förändringen som kommer efteråt. När du väl hunnit knyta an, börja
                hoppas, börja investera och kanske anpassa ditt liv efter relationen,
                skiftar dynamiken ibland nästan omärkligt. Värmen blir mindre stabil.
                Bekräftelsen blir mer sporadisk. Det som i början kändes självklart
                börjar nu kännas villkorat.
              </p>

              <p>
                Om värmen ersätts av tystnad som används för att styra dig kan du läsa vidare om{" "}
                <Link href="/silent-treatment-relation" className="underline underline-offset-4">silent treatment i relationer</Link>
                .
              </p>

              <p>
                Personen som nyss ville höra av sig hela tiden kan bli plötsligt svår
                att nå. Personen som nyss såg dig som exceptionell kan börja kritisera,
                jämföra, misstolka eller få dig att känna att du inte längre räcker
                till. Och eftersom din hjärna fortfarande minns den första versionen av
                relationen blir det lätt att tro att det bara är en svacka – att du
                bara behöver nå tillbaka till det ni hade i början.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Varför mönstret blir så svårt att lämna
            </h2>

            <div className="space-y-5 text-[1.05rem] leading-8 text-neutral-700">
              <p>
                När en relation börjar med ovanligt stark bekräftelse påverkar det inte
                bara hur du känner för personen. Det påverkar också vilka förväntningar
                du bygger upp, hur snabbt du investerar och hur mycket mening du hinner
                lägga i relationen. Om samma relation senare blir kyligare, mer
                förvirrande eller mer kontrollerande sitter du inte i ett neutralt läge.
                Du sitter i kontrasten mellan “det där magiska” och “det här som gör ont”.
              </p>

              <p>
                Återkommande växling mellan närhet och kränkningar kan vara relevant för att förstå{" "}
                <Link href="/traumabindning-i-relation" className="underline underline-offset-4">traumabindning och svårigheten att lämna</Link>
                .
                Love bombing innebär inte automatiskt traumabindning.
                Om du känner igen växlingen mellan närhet och smärta kan du också <Link href="/traumabindningtest/test" className="underline underline-offset-4">göra traumabindningstestet</Link> för att reflektera över mönstret i din relation.
              </p>

              <p>
                Många känner dessutom skam. Det kan vara svårt att berätta för andra att
                något började så fint men nu känns så fel. Särskilt när omgivningen
                kanske först såg relationen som intensiv, romantisk och nästan sagolik.
                Ju vackrare fasaden var i början, desto svårare kan det kännas att säga:
                “Det här gör mig inte trygg längre.”
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              När love bombing övergår i kontroll
            </h2>

            <div className="space-y-5 text-[1.05rem] leading-8 text-neutral-700">
              <p>
                När kontrollen blir ett återkommande nedbrytande mönster finns en bredare förklaring i vår{" "}
                <Link href="/psykisk-misshandel-relation" className="underline underline-offset-4">guide om psykisk misshandel i relationer</Link>
                .
              </p>

              <p>
                En del börjar till exempel märka att partnern vill veta mer och mer:
                var du är, vem du träffar, varför du svarade sent, varför du behöver
                egen tid, varför du inte berättade något direkt. Frågorna i sig kan
                låta harmlösa. Men när de blir en del av en större helhet – där du
                blir mer vaksam, mer övervakad eller mer skuldbelagd – blir bilden
                tydligare.
              </p>

              <p>
                I andra relationer märks kontrollen mer genom känslomässiga
                konsekvenser. Du “får” ha ditt liv, men du känner att du betalar för det.
                Du “får” säga emot, men relationen blir kall. Du “får” ta tid, men
                plötsligt blir du den som inte bryr dig tillräckligt. Då är det inte
                längre bara fråga om romantisk intensitet. Då har värmen blivit ett
                verktyg som kan dras tillbaka när du inte rör dig i rätt riktning.
              </p>
            </div>
          </section>

          <section id="vad-gora" className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Vad du kan göra om du känner igen dig
            </h2>

            <p className="text-[1.05rem] leading-8 text-neutral-700">
              Du behöver inte lösa allt på en dag. Men det hjälper att byta fokus från
              personens ord till relationens faktiska mönster. När man har blivit starkt
              bunden genom intensitet är det lätt att hamna i analys av personens avsikter.
              Ofta är det mer hjälpsamt att titta på effekten på dig.
            </p>

            <div className="grid gap-4">
              {whatToDo.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
                >
                  <div className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Steg {index + 1}
                  </div>
                  <p className="text-[1.02rem] leading-8 text-neutral-700">{item}</p>
                </div>
              ))}
            </div>

          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              När du bör ta situationen på större allvar
            </h2>

            <div className="space-y-5 text-[1.05rem] leading-8 text-neutral-700">
              <p>
                Det finns vissa signaler som talar för att du inte bara ser en intensiv
                men rörig relation, utan ett mönster som riskerar att bli mer skadligt.
                Det gäller särskilt om du märker att du blivit rädd för att sätta
                gränser, rädd för att göra personen besviken, mer isolerad från andra
                eller mer benägen att tvivla på ditt eget omdöme.
              </p>

              <p>
                En annan tydlig signal är när relationen gör dig mindre fri. Kanske har
                du formellt fortfarande samma liv som innan, men i praktiken går mycket
                av din energi åt till att undvika konflikt, läsa av stämning och hålla
                ihop något som aldrig känns riktigt stabilt. Då är det värt att stanna
                upp på allvar. Inte senare. Nu.
              </p>

              <p>
                Om du märker att det som började som bekräftelse nu mer liknar
                förvirring, kontroll eller mental utmattning kan det också vara hjälpsamt
                att läsa vidare om{" "}
                <Link
                  href="/manipulativ-partner"
                  className="font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  manipulation i relation
                </Link>{" "}
                och{" "}
                <Link
                  href="/kontrollerande-relation"
                  className="font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  kontrollerande beteenden
                </Link>
                . Ju tidigare man ser helheten, desto lättare är det att skydda sin
                egen verklighetsuppfattning.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-7 md:p-8">
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-rose-700">
              Mitt i relationen kan det vara svårt att se klart
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
              Vill du reflektera över relationens mönster?
            </h2>
            <p className="mt-4 text-[1.02rem] leading-8 text-neutral-700">
              Om du vill få en första överblick över mönster i relationen kan du{" "}
              <Link
                href="/test"
                className="font-medium text-neutral-950 underline decoration-rose-300 underline-offset-4 hover:decoration-rose-600"
              >
                göra det generella relationstestet
              </Link>
              . Det är ett bredare relationstest, inte ett diagnostiskt love bombing-test.
            </p>
          </section>

          <section className="border-t border-neutral-200 pt-14">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Vanliga frågor om love bombing
            </h2>

            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <h3 className="text-lg font-semibold text-neutral-950">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-[1.02rem] leading-8 text-neutral-700">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm leading-7 text-neutral-600">
              <strong>Obs:</strong> Den här texten är informativ och ersätter inte
              professionell rådgivning eller akut hjälp. Fokus här ligger på beteenden,
              mönster och upplevelser i relationer – inte på att ställa diagnos på någon.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}