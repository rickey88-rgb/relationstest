import Link from "next/link";

export const metadata = {
  title:
    "Våld i nära relation – tecken, mönster, kontroll och vad du kan göra | Relationsvarning",
  description:
    "En saklig, trygg och ingående guide om våld i nära relation: psykiskt, fysiskt, sexuellt, ekonomiskt och digitalt våld. Tecken, mönster, eftervåld, varför det är svårt att lämna – och stödresurser längst ner.",
};

function TocLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
    >
      {children}
    </a>
  );
}

export default function Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Vad räknas som våld i en nära relation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Våld i nära relation omfattar inte bara fysiskt våld, utan även psykiskt våld, hot, kontroll, isolering, ekonomisk kontroll, sexuellt våld och digitalt våld. Kärnan är att någon använder rädsla, makt och kontroll för att styra den andra.",
        },
      },
      {
        "@type": "Question",
        name: "Kan det vara våld även om personen aldrig slagit mig?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Psykiskt våld, hot, kontroll, isolering och ekonomisk styrning kan vara minst lika skadligt som fysiskt våld. Det som ofta gör det svårt att se är att beteendena kommer gradvis och blandas med perioder av värme eller ånger.",
        },
      },
      {
        "@type": "Question",
        name: "Varför är det så svårt att lämna en destruktiv relation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Det kan handla om rädsla, ekonomiskt beroende, barn, skam, social isolering, hopp om förändring, eller att relationen skiftar mellan hot och närhet. Många beskriver att de gradvis tappat sin egen kompass och blivit osäkra på vad som är normalt.",
        },
      },
      {
        "@type": "Question",
        name: "Vad är eftervåld?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Eftervåld är när kontrollen eller våldet fortsätter efter ett uppbrott, till exempel genom hot, trakasserier, upprepade kontakter, ryktesspridning, ekonomiska påtryckningar eller att använda gemensamma praktiska band för att fortsätta styra.",
        },
      },
      {
        "@type": "Question",
        name: "Är ert test en akut-hjälp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nej. Testet är ett reflektions- och mönsterstöd. Om du är i fara eller akut rädd ska du prioritera att söka hjälp från vård, polis eller stödlinjer (kontaktvägar finns längst ner på sidan).",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-200/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold tracking-tight">
            Relationsvarning
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              Sakligt & tryggt
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Guide</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Våld i nära relation</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Tecken • mönster • kontroll • eftervåld
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Våld i nära relation — tecken, mönster och vad det kan se ut som i
              vardagen.
            </h1>

            <p className="mt-5 text-base leading-relaxed text-neutral-700">
              Våld i en nära relation handlar sällan bara om ett enskilt
              “bråk”. Ofta handlar det om{" "}
              <span className="font-medium text-neutral-900">
                rädsla, kontroll och gradvisa gränsöverträdelser
              </span>{" "}
              som gör att du börjar tvivla på din egen verklighetsuppfattning,
              anpassar dig för att undvika reaktioner, och långsamt tappar det
              som tidigare kändes självklart.
            </p>

            <p className="mt-4 text-base leading-relaxed text-neutral-700">
              Den här sidan är skriven för att vara{" "}
              <span className="font-medium text-neutral-900">
                begriplig, konkret och icke-dömande
              </span>
              . Den försöker sätta ord på sådant som många beskriver som
              “svårt att förklara”, och visar hur våld kan vara psykiskt,
              digitalt eller ekonomiskt — även när det aldrig blir ett slag.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/test"
                className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 sm:w-auto"
              >
                Gör relationstestet
              </Link>
              <div className="text-xs text-neutral-600">
                Testet är ett mönsterstöd — inte en diagnos eller akut-hjälp.
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-200/70 pt-6">
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold text-neutral-900">
                    Ton
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-700">
                    Saklig, trygg, vuxen
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-neutral-900">
                    Fokus
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-700">
                    Beteenden & mönster
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-neutral-900">
                    Syfte
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-700">
                    Klarhet, språk, riktning
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: Quick index */}
          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-neutral-200/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
              <h2 className="text-sm font-semibold tracking-tight">
                Snabbnavigering
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                Om du vill skumma först: börja med “Tecken i vardagen” och
                “Eftervåld”. Många får klarhet när de ser mönstret beskrivet som
                en helhet — inte som isolerade händelser.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                <li>
                  <TocLink href="#vad-ar">Vad är våld i nära relation?</TocLink>
                </li>
                <li>
                  <TocLink href="#former">
                    Olika former av våld (psykiskt, ekonomiskt, digitalt…)
                  </TocLink>
                </li>
                <li>
                  <TocLink href="#tecken">Tecken i vardagen</TocLink>
                </li>
                <li>
                  <TocLink href="#mönster">
                    Mönster över tid (eskalation, ursäkter, förskjutning)
                  </TocLink>
                </li>
                <li>
                  <TocLink href="#svart-att-lamna">
                    Varför det kan vara svårt att lämna
                  </TocLink>
                </li>
                <li>
                  <TocLink href="#eftervald">Eftervåld</TocLink>
                </li>
                <li>
                  <TocLink href="#barn">Barn och våld i hemmet</TocLink>
                </li>
                <li>
                  <TocLink href="#vad-kan-du-gora">Vad du kan göra</TocLink>
                </li>
                <li>
                  <TocLink href="#anhorig">Om du är anhörig</TocLink>
                </li>
                <li>
                  <TocLink href="#faq">Vanliga frågor</TocLink>
                </li>
                <li>
                  <TocLink href="#stod">Stöd och viktiga nummer</TocLink>
                </li>
              </ul>

              <div className="mt-5 rounded-xl bg-neutral-50 p-4">
                <p className="text-sm font-semibold text-neutral-900">
                  Relaterat (SEO-kluster)
                </p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                  Om du vill läsa mer om närliggande mönster:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  <li>
                    <Link
                      href="/psykisk-misshandel-relation"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      Psykisk misshandel i relation — tecken, mönster och
                      konsekvenser
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/kontrollerande-relation"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      Varför känner jag mig kontrollerad i min relation?
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/manipulativ-partner"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      Hur vet man om någon är manipulativ?
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-neutral-500">
              Obs: Den här texten är informativ. Om du känner dig i akut fara
              finns stöd och nummer längst ner på sidan.
            </p>
          </aside>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-5xl px-6 pb-14">
        <article className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            {/* What it is */}
            <div id="vad-ar" className="scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">
                Vad är våld i nära relation?
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                “Våld i nära relation” kan låta som något tydligt och
                dramatiskt. Men i verkligheten beskriver många en process:
                gränser flyttas steg för steg, och det som först känns “lite
                obehagligt” blir efter ett tag en vardag där du{" "}
                <span className="font-medium text-neutral-900">
                  anpassar dig för att undvika reaktioner
                </span>
                . Det kan vara att du väger varje ord, dubbelkollar ditt tonläge,
                undviker vissa ämnen, eller börjar planera dagen utifrån vad som
                minskar risken för konflikt.
              </p>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                I en sund relation kan man bli arg, säga fel, ha svackor och
                konflikt — utan att den ena parten använder rädsla eller
                kontroll för att få sin vilja igenom. När våld finns i
                relationen är det ofta ett mönster där den ena personen tar{" "}
                <span className="font-medium text-neutral-900">
                  makt över den andras frihet
                </span>
                : vad du får säga, göra, träffa, ha på dig, tänka, känna och
                vara.
              </p>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Våld kan vara fysiskt — men det kan också vara psykiskt,
                sexuellt, ekonomiskt eller digitalt. I praktiken är det ofta
                en kombination. Många börjar googla först när de märker att
                de blivit någon de inte känner igen:{" "}
                <span className="font-medium text-neutral-900">
                  mer rädd, mer osäker, mer tyst
                </span>
                .
              </p>

              <div className="mt-6 rounded-2xl border border-neutral-200/70 p-5">
                <p className="text-sm font-semibold tracking-tight">
                  En viktig skiljelinje
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Konflikt handlar om två personer som krockar. Våld handlar om
                  att en person skapar ett system där den andra blir mindre fri.
                  Det kan ske genom hot, nedbrytning, kontroll, bestraffning och
                  “villkorad trygghet”.
                </p>
              </div>
            </div>

            {/* Forms */}
            <div id="former" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">
                Olika former av våld (och hur de kan se ut)
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                För att förstå våld i nära relation kan det hjälpa att se det
                som flera kategorier. Du behöver inte känna igen allt — ibland
                räcker det att känna igen en del. Det viktiga är helheten och
                effekten:{" "}
                <span className="font-medium text-neutral-900">
                  blir du mindre fri, mer rädd, mer kontrollerad?
                </span>
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Psykiskt våld
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Psykiskt våld handlar ofta om att bryta ner din självkänsla och
                din verklighetsuppfattning. Det kan vara att du blir kallad
                känslig, dum, “sjuk i huvudet”, att du ständigt får höra att du
                överdriver, eller att du får bära ansvaret för personens utbrott.
                Det kan också vara hot, skrämsel, att någon slår i väggar,
                kastar saker, eller gör tydliga markeringar för att du ska “lära
                dig”.
              </p>

              <p className="mt-3 text-base leading-relaxed text-neutral-700">
                Om du vill läsa mer om just detta som eget ämne har vi en
                fördjupad sida:{" "}
                <Link
                  href="/psykisk-misshandel-relation"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  Psykisk misshandel i relation
                </Link>
                .
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Fysiskt våld
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Fysiskt våld är inte bara slag. Det kan vara knuffar, fasthållning,
                att någon blockerar dörren, rycker i dig, kastar saker mot dig,
                tar stryptag, eller gör “små” handlingar som ändå säger:{" "}
                <span className="font-medium text-neutral-900">
                  “Jag kan göra dig illa.”
                </span>{" "}
                Många beskriver att tröskeln flyttas: först en knuff, sedan en
                hård fasthållning, sedan något värre — och att allt efteråt
                bagatelliseras.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Sexuellt våld och sexuella gränsöverträdelser
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Sexuellt våld kan vara att pressa, tjata, skuldbelägga eller
                hota för att få sex. Det kan också vara att dina nej inte
                respekteras, att någon blir arg när du inte vill, eller att du
                “går med på det” för att undvika reaktioner. I en trygg relation
                är samtycke frivilligt. I en destruktiv relation kan sex bli ett
                område där kontroll och skuld används som verktyg.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Ekonomiskt våld
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Ekonomiskt våld handlar om pengar som kontrollmedel. Det kan vara
                att du måste redovisa varje inköp, inte får ha eget konto, blir
                “straffad” ekonomiskt, eller hindras från att jobba eller studera.
                Ibland framställs det som “ordning” eller “ansvar” — men effekten
                blir att du blir mindre självständig och får svårare att välja.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Digitalt våld (mobil, sociala medier, övervakning)
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Digitalt våld kan vara att någon kräver lösenord, kontrollerar
                din telefon, blir rasande om du inte svarar direkt, vill ha
                positionsdelning, läser dina meddelanden, eller använder sociala
                medier för att skambelägga, hota eller “hålla koll”. Det kan också
                vara att du konstant måste bevisa var du är och vem du är med.
              </p>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Digitalt våld är ofta nära kopplat till känslan av att vara{" "}
                <Link
                  href="/kontrollerande-relation"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  kontrollerad i relationen
                </Link>
                , eller att du lever med en{" "}
                <Link
                  href="/manipulativ-partner"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  manipulativ partner
                </Link>
                .
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Socialt våld och isolering
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Isolering kan se mjuk ut i början: “Jag saknar dig”, “Varför
                måste du alltid träffa dem?”, “De gillar inte mig”, “Du väljer
                dem framför mig.” Efter ett tag blir det svårare att träffa
                vänner och familj utan att det blir en konflikt. Många beskriver
                att de till slut slutar berätta vad som händer, för att slippa
                frågor, skam eller reaktioner. Och när du står mer ensam blir
                kontrollen lättare att upprätthålla.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Materiellt våld (saker, hemmet, vardagen)
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Att förstöra saker, slå i dörrar, kasta föremål, eller hota med
                att krossa din mobil kan vara ett sätt att skrämma utan att “röra”
                dig. Effekten kan bli densamma: du lär dig att anpassa dig, att
                gå på tå, att inte “trigga”.
              </p>
            </div>

            {/* Signs */}
            <div id="tecken" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">
                Tecken i vardagen (som ofta förklaras bort)
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Många som levt i relationsvåld beskriver att det inte började
                med “våld”. Det började med stämning, tryck, kontroll, kritik.
                Här är vanliga tecken som — särskilt när de upprepas — kan
                signalera att relationen är på väg åt ett farligt håll.
              </p>

              <ul className="mt-6 space-y-3 text-base text-neutral-700">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Du ändrar ditt beteende för att undvika reaktioner (tonläge,
                  ämnen, tider, kläder, kontakter).
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Du börjar tvivla på dig själv: “Är jag känslig?”, “Är det jag
                  som förstör?”, “Kanske minns jag fel?”
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Du känner dig ofta skyldig, i underläge eller som att du
                  behöver “förtjäna” lugn.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Personen kan explodera, och efteråt säger hen att du “tvingade
                  fram det”, eller att det “inte är så farligt”.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Du drar dig för att ta upp problem eftersom det alltid blir
                  ditt fel, eller slutar med att du ber om ursäkt.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Du känner att din frihet krymper: vilka du träffar, vad du
                  gör, hur du spenderar pengar, vad du skriver.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Det finns hot — öppna eller subtila: “Du kommer ångra dig”,
                  “Ingen annan vill ha dig”, “Jag kan göra livet svårt för dig”.
                </li>
              </ul>

              <div className="mt-8 rounded-2xl bg-neutral-50 p-6">
                <p className="text-sm font-semibold tracking-tight text-neutral-900">
                  En fråga som ofta skär igenom dimman
                </p>
                <p className="mt-2 text-base leading-relaxed text-neutral-700">
                  Om du tar bort alla förklaringar och ursäkter:{" "}
                  <span className="font-medium text-neutral-900">
                    blir du mer fri eller mindre fri av den här relationen?
                  </span>{" "}
                  Blir du mer dig själv — eller mindre?
                </p>
              </div>
            </div>

            {/* Patterns */}
            <div id="mönster" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">
                Mönster över tid: hur våld kan byggas som ett “system”
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Det som gör relationsvåld extra svårt att förstå är att det ofta
                inte är konstant. Många beskriver en växling mellan perioder av
                värme och perioder av rädsla. När det är bra tänker man: “Nu är
                vi tillbaka.” När det är dåligt tänker man: “Jag måste bara
                vara smartare, lugnare, mindre provocerande.”
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                1) Eskalation: gränser flyttas gradvis
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                I början kan kontrollen komma som omtanke eller svartsjuka som
                tolkas som kärlek. Sedan blir det regler. Sedan blir det
                konsekvenser. Efter ett tag märker du att vissa saker “inte är
                värda bråket”, och du börjar undvika dem. Det är en farlig
                punkt: när du automatiskt börjar leva enligt någon annans
                reaktionsmönster.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                2) Förskjutning av ansvar: du blir problemet
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Ett vanligt mönster är att den som skadar ändå framstår som den
                som är mest sårad. Du kan bli anklagad för att vara respektlös,
                otacksam, kall, “svår”, dramatisk, eller att du “driver personen
                till det”. Efter ett tag kan du börja internalisera det och
                tro att du faktiskt är orsaken.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                3) Bestraffning och belöning: villkorad trygghet
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                I en sund relation är trygghet grundnivå. I en destruktiv
                relation kan trygghet bli något du “förtjänar” genom att vara
                tillräckligt lugn, lydig, anpassad. Om du gör “fel” kommer kyla,
                tystnad, raseri, hot, anklagelser. Om du gör “rätt” kommer värme.
                Det är så ett system kan byggas där du sakta tappar din egen
                vilja.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                4) Normalisering: det orimliga blir vardag
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                När något händer en gång reagerar du starkt. När det händer
                tio gånger blir du trött. När det händer femtio gånger börjar du
                bygga din personlighet runt att hantera det. Det kan vara där du
                märker att du inte längre känner igen dig själv.
              </p>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Om du vill ha ett mönsterstöd som är mer “quiz-format” kan du
                använda{" "}
                <Link
                  href="/test"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  testet
                </Link>{" "}
                som komplement. Och om du vill förstå gränslandet mellan starkt
                manipulativa beteenden och mer extrema drag kan du läsa{" "}
                <Link
                  href="/psykopatiska-drag-relation"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  psykopatiska drag i relation
                </Link>{" "}
                (tidiga signaler) och{" "}
                <Link
                  href="/skillnad-psykopat-narcissist"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  skillnad på psykopat och narcissist
                </Link>
                . (Obs: våra texter handlar om beteenden och mönster — inte att
                ställa diagnoser.)
              </p>
            </div>

            {/* Why hard to leave */}
            <div id="svart-att-lamna" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">
                Varför det kan vara svårt att lämna (även när du “vet”)
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                En av de vanligaste (och mest orättvisa) reaktionerna utifrån är:
                “Varför går du inte bara?” Den frågan missar att våld ofta
                skapar en verklighet där ditt handlingsutrymme krymper. Att
                lämna kan innebära rädsla, praktiska hinder, eller att du redan
                brutits ner så mycket att du inte längre litar på din egen
                bedömning.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Hopp och minnesbilden av “när det var bra”
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Många håller fast vid den version av partnern som fanns i början,
                eller i perioder. När personen visar värme kan du känna lättnad,
                och lättnaden kan feltolkas som att relationen är trygg. Men
                ofta är det kontrasten som skapar lättnaden — inte att problemet
                försvunnit.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Rädsla för reaktioner
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Om du har lärt dig att din partner reagerar med raseri, hot,
                skam, manipulation eller bestraffning när du sätter gränser, kan
                uppbrottet kännas som den farligaste punkten. Många beskriver att
                de blir kvar just för att “hålla situationen stabil”.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Ekonomi, boende, barn, socialt nät
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Praktiska band kan bli kedjor: gemensam bostad, skulder, barn,
                isolering från vänner, eller att du saknar ett tryggt ställe att
                ta vägen. Ibland har den som kontrollerar också sett till att du
                har mindre resurser — medvetet eller omedvetet — vilket gör att
                du tappar alternativ.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                Skam och tystnad
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Skam är ett kraftfullt vapen. Om du skäms över att du “stannat”
                eller att du “lät det gå så långt”, kan du dra dig för att
                berätta. Och när du inte berättar blir du ensam med tolkningen
                av vad som händer. Ensamhet gör kontrollen starkare.
              </p>

              <div className="mt-8 rounded-2xl border border-neutral-200/70 p-6">
                <p className="text-sm font-semibold tracking-tight">
                  Ett viktigt perspektiv
                </p>
                <p className="mt-2 text-base leading-relaxed text-neutral-700">
                  Det är inte svaghet att ha svårt att lämna. Det kan vara ett
                  tecken på att du redan har blivit{" "}
                  <span className="font-medium text-neutral-900">
                    pressad, styrd eller skrämd
                  </span>{" "}
                  i en miljö där du försöker överleva vardagen så smidigt som
                  möjligt.
                </p>
              </div>
            </div>

            {/* After violence */}
            <div id="eftervald" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">Eftervåld</h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Eftervåld betyder att kontrollen fortsätter även efter att
                relationen “tagit slut” — särskilt om det finns praktiska band
                kvar (barn, ekonomi, boende, sociala sammanhang).
              </p>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Exempel kan vara: upprepade kontakter som inte respekterar gränser,
                hotfulla undertoner, ryktesspridning, ekonomiska påtryckningar,
                att personen använder andra (vänner/familj) för att pressa,
                eller att du ska känna att du aldrig får vara ifred. Ibland kan
                det också vara “snällhet” med krav: gåvor, ursäkter, tårar —
                som i praktiken är ett försök att återta kontroll.
              </p>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Om du känner att du behöver språk för manipulation i allmänhet
                kan du läsa{" "}
                <Link
                  href="/manipulativ-partner"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  Hur vet man om någon är manipulativ?
                </Link>{" "}
                och om kontroll som fenomen{" "}
                <Link
                  href="/kontrollerande-relation"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  Varför känner jag mig kontrollerad i min relation?
                </Link>
                .
              </p>
            </div>

            {/* Children */}
            <div id="barn" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">
                Barn och våld i hemmet
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Våld i nära relation påverkar nästan alltid fler än två personer.
                Barn kan påverkas även om de “inte ser” det, eftersom de ofta
                känner stämningen, hör konflikter, märker förändringar i dig,
                eller lever med en vardag där trygghet skiftar.
              </p>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Barn kan reagera på många sätt: oro, magont, sömnsvårigheter,
                aggressivitet, tillbakadragenhet, koncentrationssvårigheter eller
                överdrivet ansvarstagande. Det är vanligt att barn försöker
                “hjälpa” genom att vara duktiga, tysta eller avleda.
              </p>

              <div className="mt-6 rounded-2xl bg-neutral-50 p-6">
                <p className="text-sm font-semibold tracking-tight text-neutral-900">
                  Om du bär mycket skuld
                </p>
                <p className="mt-2 text-base leading-relaxed text-neutral-700">
                  Många föräldrar som varit utsatta bär en enorm skuld för att
                  barnen varit med om något svårt. Men ansvaret för våld ligger
                  alltid hos den som utövar det. Att du söker språk, stöd och
                  alternativ är i sig en styrka.
                </p>
              </div>
            </div>

            {/* What you can do */}
            <div id="vad-kan-du-gora" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">
                Vad du kan göra (utan att pressa dig själv)
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Om du känner igen dig kan det vara lockande att vilja “lösa allt”
                direkt. Men ofta är första steget mindre dramatiskt och mer
                realistiskt:{" "}
                <span className="font-medium text-neutral-900">
                  skapa lite mer klarhet och lite mer stöd
                </span>
                .
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                1) Sätt ord på mönstret (för dig själv)
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                I många destruktiva relationer blir du övertygad om att varje
                händelse är isolerad, eller att du “förstod fel”. Ett sätt att
                återta verkligheten är att beskriva mönstret: Vad händer före?
                Vad händer efter? Hur förändras du? Hur förändras ditt liv?
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                2) Berätta för en person du litar på (om det känns säkert)
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Ensamhet gör våld starkare. Du behöver inte berätta allt. Det
                räcker ofta med: “Jag tror att något inte är okej. Jag behöver
                bara att du lyssnar.” Om du vill kan du också använda den här
                sidan som stöd och säga: “Det här är ungefär det jag upplever.”
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                3) Sök professionellt stöd tidigt
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Stöd handlar inte bara om “att lämna”. Det kan också handla om
                att få hjälp att förstå, värdera risk, och hitta en väg som
                känns möjlig. Stödlinjer och jourer finns för att prata,
                sortera, och ge dig alternativ. Kontaktvägar finns längst ner.
              </p>

              <h3 className="mt-8 text-base font-semibold tracking-tight">
                4) Om du överväger uppbrott: låt det vara en process
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Att lämna kan vara ett av de största besluten i livet, särskilt
                om du är rädd för reaktioner eller har barn. Många mår bättre av
                att göra det i dialog med stöd (jour, vård, socialt stöd) och att
                stegvis skapa mer trygghet omkring sig.
              </p>

              <div className="mt-8 rounded-2xl border border-neutral-200/70 p-6">
                <p className="text-sm font-semibold tracking-tight">
                  Viktigt: “Det är inte alltid dramatik som är farligast”
                </p>
                <p className="mt-2 text-base leading-relaxed text-neutral-700">
                  Ibland är det farligaste att allt ser lugnt ut utåt, men att du
                  lever med en konstant inre stress: du har blivit expert på att
                  undvika att “trigga”. Den typen av anpassning är också ett
                  tecken på att något kan vara allvarligt fel.
                </p>
              </div>
            </div>

            {/* For relatives */}
            <div id="anhorig" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">
                Om du är anhörig: hur du kan hjälpa utan att göra det värre
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Om du står bredvid kan det vara frustrerande. Men hård press kan
                göra att den utsatta stänger sig eller blir mer isolerad.
                Försök i stället att vara konsekvent: lugn, trygg, tillgänglig.
              </p>

              <ul className="mt-6 space-y-3 text-base text-neutral-700">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Lyssna mer än du argumenterar.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Spegla mönster: “Jag ser att du blir mindre fri.”
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Fråga vad personen behöver just nu: sällskap, praktisk hjälp,
                  någon att ringa.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  Undvik ultimatum. Satsa på kontakt och långsiktig trygghet.
                </li>
              </ul>

              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Du kan också själv ringa en stödlinje för råd kring hur du bäst
                hjälper någon i din närhet. (Se kontaktvägar längst ner.)
              </p>
            </div>

            {/* FAQ */}
            <div id="faq" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">Vanliga frågor</h2>

              <h3 className="mt-6 text-base font-semibold tracking-tight">
                Kan det vara våld även om vi “bara” bråkar?
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Bråk i sig är inte våld. Men om bråken alltid slutar med att du
                blir rädd, tyst, undergiven, isolerad eller ekonomiskt straffad —
                eller om din partner använder hot, skrämsel eller kontroll —
                då handlar det om mer än konflikt.
              </p>

              <h3 className="mt-6 text-base font-semibold tracking-tight">
                Jag får ofta höra att jag är känslig. Är det ett tecken?
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Det kan vara det. Om “du är känslig” används för att avfärda,
                förminska och slippa ta ansvar, blir det ofta en del av ett
                större mönster. Det centrala är effekten: börjar du tvivla på
                dig själv, backa från dina gränser och bli mindre fri?
              </p>

              <h3 className="mt-6 text-base font-semibold tracking-tight">
                Är det här samma sak som att leva med en psykopat?
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Våld i relation kan förekomma oavsett personlighetstyp. I vår
                kunskapsbank pratar vi om mönster, inte diagnoser. Om du vill
                förstå vissa extrema drag och skillnader kan du läsa{" "}
                <Link
                  href="/tecken-pa-psykopat"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  Tecken på att du lever med en psykopat
                </Link>{" "}
                och{" "}
                <Link
                  href="/skillnad-psykopat-narcissist"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                >
                  Skillnad på psykopat och narcissist
                </Link>
                . Men oavsett etikett: om du lever med rädsla och kontroll, är
                det allvarligt.
              </p>

              <h3 className="mt-6 text-base font-semibold tracking-tight">
                Är ert test till för att “bevisa” något?
              </h3>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">
                Nej. Testet är ett reflektionsstöd som hjälper dig se mönster.
                Det kan ge dig språk, tydlighet och en riktning, men det ersätter
                inte professionell bedömning eller akut hjälp.
              </p>

              <div className="mt-10 rounded-2xl bg-neutral-50 p-6">
                <p className="text-sm font-semibold tracking-tight text-neutral-900">
                  Läs mer i samma SEO-kluster
                </p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  <li>
                    <Link
                      href="/psykisk-misshandel-relation"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      Psykisk misshandel i relation — tecken, mönster och konsekvenser
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/manipulativ-partner"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      Hur vet man om någon är manipulativ?
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/kontrollerande-relation"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      Varför känner jag mig kontrollerad i min relation?
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/psykopatiska-drag-relation"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      Psykopatiska drag i relation — tidiga signaler
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* SUPPORT (must be last per your request) */}
            <div id="stod" className="mt-14 scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight">
                Stöd och viktiga nummer (längst ner)
              </h2>

              <div className="mt-5 rounded-2xl border border-neutral-200/70 p-6">
                <p className="text-sm font-semibold tracking-tight text-neutral-900">
                  Akut
                </p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                    <span>
                      Vid akut fara / pågående våld: <strong>ring 112</strong>.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                    <span>
                      Polis (icke-akut): <strong>114 14</strong>.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-2xl bg-neutral-50 p-6">
                <p className="text-sm font-semibold tracking-tight text-neutral-900">
                  Nationella stödlinjer
                </p>
                <ul className="mt-3 space-y-3 text-sm text-neutral-700">
                  <li>
                    <strong>Kvinnofridslinjen:</strong> 116 016 (dygnet runt,
                    gratis, anonymt).{" "}
                    <a
                      href="https://kvinnofridslinjen.se/fa-stod/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      kvinnofridslinjen.se
                    </a>
                  </li>
                  <li>
                    <strong>Brottsofferjouren:</strong> 116 006 (gratis stöd för
                    brottsoffer, vittnen och anhöriga).{" "}
                    <a
                      href="https://www.brottsofferjouren.se/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      brottsofferjouren.se
                    </a>
                  </li>
                  <li>
                    <strong>Stödlinjen för män:</strong> 020-80 80 80 (dygnet
                    runt, anonymt).
                  </li>
                  <li>
                    <strong>Stödlinjen för transpersoner:</strong> 020-55 00 00
                    (dygnet runt, anonymt).
                  </li>
                  <li>
                    <strong>Rätt att välja</strong> (hedersrelaterad kontroll/hot/våld):
                    020-57 70 70 (dygnet runt).
                  </li>
                  <li>
                    <strong>Ungarelationer</strong> (upp till 20 år, även om du är
                    kompis/anhörig):{" "}
                    <a
                      href="https://ungarelationer.se/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      ungarelationer.se
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-2xl border border-neutral-200/70 p-6">
                <p className="text-sm font-semibold tracking-tight text-neutral-900">
                  Kvinnojourer och tjejjourer (hitta lokalt)
                </p>
                <ul className="mt-3 space-y-3 text-sm text-neutral-700">
                  <li>
                    <strong>Unizon</strong> (jourer runt om i Sverige):{" "}
                    <a
                      href="https://www.unizonjourer.se/hitta-stod/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      unizonjourer.se/hitta-stod
                    </a>
                  </li>
                  <li>
                    <strong>Roks</strong> (kvinno- och tjejjourer):{" "}
                    <a
                      href="https://roks.se/fa-stod/hitta-en-jour"
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      roks.se/hitta-en-jour
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-2xl bg-neutral-50 p-6">
                <p className="text-sm font-semibold tracking-tight text-neutral-900">
                  Om du själv använder våld eller känner att du riskerar att göra det
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Att söka hjälp är ett sätt att stoppa skada. Det finns anonymt
                  stöd att få.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  <li>
                    <strong>Välj att sluta:</strong> 020-555 666 (anonymt stöd,
                    vardagar).{" "}
                    <a
                      href="https://valjattsluta.se/om-stodlinjen/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                    >
                      valjattsluta.se
                    </a>
                  </li>
                </ul>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-neutral-500">
                Disclaimer: Den här sidan är generell information och ersätter
                inte vård, juridisk rådgivning eller akut hjälp. Om du är rädd
                för att skadas: prioritera att söka stöd direkt.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-neutral-200/70 p-6">
                <p className="text-sm font-semibold tracking-tight">
                  Snabb check-in
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Om du vill ha en enkel start: svara på testet och använd resultatet
                  som spegel. Du kan också läsa vidare om{" "}
                  <Link
                    href="/psykisk-misshandel-relation"
                    className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                  >
                    psykisk misshandel
                  </Link>{" "}
                  och{" "}
                  <Link
                    href="/manipulativ-partner"
                    className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
                  >
                    manipulation
                  </Link>{" "}
                  om det är det som känns mest igen.
                </p>

                <div className="mt-4">
                  <Link
                    href="/test"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
                  >
                    Påbörja testet
                  </Link>
                </div>

                <p className="mt-3 text-xs text-neutral-600">
                  Snabbt, anonymt, fokus på beteenden.
                </p>
              </div>

              
            </div>
          </div>
        </article>
      </section>

      {/* JSON-LD FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-200/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Relationsvarning</span>
          <span>Integritet först • Inga konton • Inga spårningsfält</span>
        </div>
      </footer>
    </main>
  );
}