import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Jag är rädd att min partner ska slå mig – tecken, risk och vad du kan göra nu
        </h1>
        <p className="mt-4 text-neutral-700 leading-relaxed">
          Att känna rädsla i en relation är inte “drama”. Det är en signal. Ibland är den vag: en klump
          i magen, en känsla av att du väger dina ord, att du ständigt scannar humörsvängningar.
          Ibland är den konkret: hot, aggressiva utbrott, sönderslagna saker, ett grepp som varit för
          hårt, en blick som får dig att stelna. Oavsett var du befinner dig på den skalan är det
          rimligt att ta rädslan på allvar.
        </p>

        <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-800 leading-relaxed">
            <strong>Om du är i akut fara eller känner att det kan bli våld snart:</strong> ring{" "}
            <strong>112</strong>.
          </p>
        </div>
      </header>

      <section className="prose prose-neutral max-w-none">
        <p>
          Den här sidan är skriven för dig som tänker något i stil med: “Jag tror min partner kan slå
          mig”, “Jag är rädd att det ska eskalera”, “Jag vet inte om det jag upplever räknas som
          våld”, eller “Jag vill förstå risk – och vad jag kan göra, steg för steg”.
        </p>

        <p>
          Det här är inte en diagnos av någon. Det är en praktisk och trygg genomgång av beteenden,
          mönster och risk – och hur du kan göra val som skyddar dig.
        </p>

        <h2>Rädsla i en relation är i sig en varningssignal</h2>
        <p>
          Många som lever nära någon med aggressivitet eller kontroll blir skickliga på att
          normalisera. Man börjar tänka: “Det är nog mitt fel, jag provocerade”, “Hen har haft en tuff
          dag”, “Det var bara en gång”, “Det är inte så farligt, jag har ju inte blivit slagen.”
        </p>
        <p>
          Problemet är att rädsla ofta inte uppstår ur tomma intet. Den uppstår ur mönster. Du har
          sett något – kanske smått, kanske stort – som får ditt nervsystem att reagera. En relation
          ska inte kräva att du går på tå för att undvika en explosion.
        </p>

        <div className="not-prose my-6 rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-700 leading-relaxed">
            Relaterat (för mönster som ofta hänger ihop med rädsla):{" "}
            <Link href="/kontrollerande-relation" className="underline underline-offset-4">
              kontrollerande relation
            </Link>
            ,{" "}
            <Link href="/manipulativ-partner" className="underline underline-offset-4">
              manipulativ partner
            </Link>
            ,{" "}
            <Link href="/psykisk-misshandel-relation" className="underline underline-offset-4">
              psykisk misshandel
            </Link>{" "}
            och{" "}
            <Link href="/vald-i-nara-relation" className="underline underline-offset-4">
              våld i nära relation
            </Link>
            .
          </p>
        </div>

        <h2>Tre nivåer: obehag, rädsla, fara</h2>
        <p>
          Ett sätt att få klarhet är att skilja på tre lägen. Det är inte perfekta lådor, men de
          hjälper dig tänka.
        </p>

        <h3>1) Obehag</h3>
        <p>
          Du känner dig nedtryckt, kritiserad, ifrågasatt. Du kanske tappar självkänsla, men du är
          inte direkt rädd för fysisk skada.
        </p>
        <ul>
          <li>ständiga pikar, förlöjligande, hån</li>
          <li>skuldbeläggning (“du gör mig så arg”)</li>
          <li>gaslighting (du börjar tvivla på din upplevelse)</li>
          <li>tystnad som straff</li>
        </ul>
        <p>
          Läs mer om den här typen av mönster i{" "}
          <Link href="/psykisk-misshandel-relation" className="underline underline-offset-4">
            psykisk misshandel
          </Link>
          .
        </p>

        <h3>2) Rädsla</h3>
        <p>
          Du börjar anpassa dig för att undvika reaktioner. Du håller tillbaka saker du vill säga. Du
          känner att “fel ord” kan trigga något.
        </p>
        <ul>
          <li>du väger varje mening</li>
          <li>humörsvängningar styr hela hemmet</li>
          <li>övervakning/kontroll (telefon, vänner, kläder, ekonomi)</li>
          <li>hot om konsekvenser (“du kommer ångra dig”, “du vet vad som händer”)</li>
        </ul>
        <p>
          Läs mer:{" "}
          <Link href="/kontrollerande-relation" className="underline underline-offset-4">
            kontrollerande relation
          </Link>
          .
        </p>

        <h3>3) Fara</h3>
        <p>
          Här finns tydliga tecken på att våld kan ske – eller redan sker. Det kan vara fysiska
          handlingar, hot, eskalation och “test” av gränser.
        </p>
        <ul>
          <li>hen slår sönder saker, kastar föremål, knuffas</li>
          <li>hot om att slå, döda, “krossa”, “förstöra”</li>
          <li>blockerar dörrar, hindrar dig från att gå</li>
          <li>tar tag hårt, skakar, håller fast</li>
          <li>strypgrepp, tryck mot halsen, “lek” som inte är lek</li>
          <li>hot kopplade till barn, husdjur eller ekonomi</li>
        </ul>
        <p>
          Om du känner igen dig i fara-läget: ditt mål är inte att “ha rätt i en diskussion”. Ditt mål
          är säkerhet. Läs mer:{" "}
          <Link href="/vald-i-nara-relation" className="underline underline-offset-4">
            våld i nära relation
          </Link>
          .
        </p>

        <h2>Tecken på att våld kan vara nära (riskmönster)</h2>
        <p>
          Inget enskilt tecken betyder att våld måste ske, men vissa mönster återkommer ofta vid
          eskalation.
        </p>

        <h3>1) “Det är ditt fel att jag blir så här”</h3>
        <p>
          Det här är ett klassiskt sätt att flytta ansvar. Om hen ser sin aggressivitet som en reaktion
          du orsakar, finns en logik där “du förtjänar konsekvens”.
        </p>

        <h3>2) Snabba humörsvängningar + rädsla i rummet</h3>
        <p>
          Alla kan bli irriterade. Men om stämningen i hemmet kan växla från normal till hotfull på
          sekunder, och du känner dig liten eller fångad – ta det på allvar.
        </p>

        <h3>3) Kontroll + isolering</h3>
        <p>
          Kontroll handlar ofta om att minska dina alternativ: vilka du träffar, hur du klär dig, hur
          du spenderar pengar, vad du får säga, var du får vara. Läs mer i{" "}
          <Link href="/kontrollerande-relation" className="underline underline-offset-4">
            kontrollerande relation
          </Link>
          .
        </p>

        <h3>4) “Test” av gränser</h3>
        <p>
          Våld eskalerar ofta gradvis: först ord, sen föremål, sen “liten knuff”, sen mer. Om någon
          redan börjat testa vad som “går” är det ett dåligt tecken.
        </p>

        <h3>5) Svartsjuka + ägandelogik</h3>
        <p>
          Svartsjuka blir farlig när den blir en ideologi: “Du är min.” Där kan kontroll, hot och våld
          bli “rättfärdigat”.
        </p>

        <h3>6) Du känner att du måste vara “perfekt” för att det ska bli lugnt</h3>
        <p>
          Om du känner att trygghet kräver att du gör allt rätt, är du i praktiken inte trygg.
        </p>

        <h2>“Men hen har aldrig slagit mig” – varför rädsla ändå kan vara rationell</h2>
        <p>
          Många väntar på “beviset” – en örfil, ett slag – innan de tillåter sig att reagera. Men ofta
          är det precis så risken byggs: man vänjer sig vid hot, skrik, smällar i dörrar, sönderslagna
          saker. Nervsystemet lär sig: “Det här kan bli farligt.”
        </p>
        <p>
          Du behöver inte vänta på att det ska bli värre för att ta dig själv på allvar.
        </p>

        <h2>Vad du kan göra nu (utan att göra saker farligare)</h2>
        <p>
          Här är principer som brukar vara trygga och realistiska. Fokus är klarhet, stöd och
          säkerhet – inte konfrontation för konfrontationens skull.
        </p>

        <h3>Steg 1: Bygg din egen klarhet</h3>
        <p>
          Skriv ner 5–10 konkreta exempel (för dig själv): Vad hände? Vad sa hen? Hur reagerade du?
          Vad gjorde du för att “lugna”? Vad blev konsekvensen? Det här hjälper både mot
          verklighetsglidning och gaslighting.
        </p>

        <p className="text-sm text-neutral-700">
          Om du vill ha ett mer strukturerat sätt att se mönster kan du även göra{" "}
          <Link href="/test" className="underline underline-offset-4">
            testet
          </Link>{" "}
          – men se det som ett verktyg för klarhet, inte som en dom.
        </p>

        <h3>Steg 2: Berätta för en trygg person</h3>
        <p>
          Rädsla blir farligare i isolering. Du behöver inte “bevisa allt”. Du kan säga: “Jag är rädd i
          min relation. Jag behöver någon som lyssnar och hjälper mig tänka klart.”
        </p>

        <h3>Steg 3: Undvik att hamna ensam i en eskalerande situation</h3>
        <p>
          Om stämningen blir hotfull: välj om möjligt miljöer där du inte är ensam och instängd. Ha en
          enkel plan för att ta dig bort från läget. Om din partner blockerar dig eller blir farlig när
          du försöker lämna, är det en stark varningssignal i sig.
        </p>

        <h3>Steg 4: Små gränstest (och läs reaktionen)</h3>
        <p>
          Det handlar inte om att “prova fram våld”. Det handlar om att se om din partner kan respektera
          ett nej. Exempel: “Jag vill inte diskutera när du höjer rösten”, “Jag går undan nu, vi kan prata
          senare”, “Jag vill träffa min vän i helgen”.
        </p>
        <p>
          Reaktionen säger mycket: respekt – eller straff, hot, skuld och mer kontroll. Läs mer om
          manipulationsmönster i{" "}
          <Link href="/manipulativ-partner" className="underline underline-offset-4">
            manipulativ partner
          </Link>
          .
        </p>

        <h3>Steg 5: Ha koll på riskmarkörer</h3>
        <p>
          Det finns saker som ofta ökar risken för våld: att du pratar om att lämna, att partnern känner
          “förlust av kontroll”, separation, svartsjuka, ekonomisk stress – och alkohol/droger i kombination
          med aggressivitet.
        </p>

        <h2>Om du överväger att lämna: tänk “säkerhet + stegvis” (inte drama)</h2>
        <p>
          Att lämna kan vara en process. Och en sak som ofta missas: vissa människor blir farligare när
          de tappar kontroll. Därför kan det vara smart att fokusera på trygghet och stöd först, och
          konfrontation sen.
        </p>
        <ul>
          <li>Ha minst en person som vet vad som pågår.</li>
          <li>Ta professionellt stöd om du känner risk.</li>
          <li>Om du behöver ett samtal: välj tid/plats där du kan lämna och där det finns folk.</li>
          <li>Om barn är inblandade: rådgör hellre en gång för mycket än en gång för lite.</li>
        </ul>

        <h2>Vanliga tankefällor som håller människor kvar</h2>
        <p>
          Det här är inte “dumhet”. Det är mänsklig psykologi, särskilt i relationer där det också finns
          perioder av värme eller ånger.
        </p>

        <h3>“När det är bra är det så bra”</h3>
        <p>
          Destruktiva relationer är ofta inte konstant dåliga. De pendlar. Det gör att du kan börja
          jaga “den bra versionen”.
        </p>

        <h3>“Hen menar inte så”</h3>
        <p>
          Ibland ångrar någon sig. Men det viktiga är: förändras beteendet över tid, eller upprepas
          samma mönster?
        </p>

        <h3>“Jag vill inte överreagera”</h3>
        <p>
          Att ta rädsla på allvar är inte att överreagera. Det är att skydda sig.
        </p>

        <h3>“Jag kan inte lämna – vi har barn / ekonomi / boende”</h3>
        <p>
          Det är verkliga hinder. Därför finns stödvägar som handlar om praktiska lösningar, inte bara
          känslor.
        </p>

        <h2>När du bör söka hjälp direkt</h2>
        <p>Om du känner igen flera av dessa: ta hjälp.</p>
        <ul>
          <li>hot om våld eller död</li>
          <li>strypgrepp/tryck mot halsen</li>
          <li>partnern hindrar dig från att gå eller tar din telefon</li>
          <li>våld mot husdjur</li>
          <li>eskalation i aggressivitet</li>
          <li>du känner dig övervakad</li>
          <li>du är rädd att säga nej</li>
          <li>du har börjat “planera” för att undvika att det blir farligt</li>
        </ul>

        <div className="not-prose my-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-sm text-neutral-800 leading-relaxed">
            <strong>Akut:</strong> ring <strong>112</strong>. <br />
            <strong>Råd:</strong> ring <strong>1177</strong>. <br />
            <strong>Kvinnofridslinjen:</strong> <strong>116 016</strong> (dygnet runt, anonymt). <br />
            <strong>Brottsofferjouren:</strong> <strong>116 006</strong>.
          </p>
        </div>

        <h2>Svenskt stöd: vart kan du vända dig?</h2>
        <p>
          Du kan välja den väg som känns mest möjlig just idag:
        </p>
        <ul>
          <li>
            <strong>112</strong> – vid akut fara.
          </li>
          <li>
            <strong>1177</strong> – sjukvårdsrådgivning dygnet runt.
          </li>
          <li>
            <strong>Kvinnofridslinjen 116 016</strong> – stöd vid hot och våld (anonymt).
          </li>
          <li>
            <strong>Brottsofferjouren 116 006</strong> – stöd om du utsatts för brott/hot.
          </li>
          <li>
            <strong>Socialjour/socialtjänst</strong> – vid akuta behov (via kommunen).
          </li>
        </ul>

        <h2>En kort del om “psykopatiska drag” (utan att fastna i etiketter)</h2>
        <p>
          Många som är rädda börjar googla “psykopat”, “narcissist”, “sociopat”. Jag fattar varför: man
          söker en förklaring till varför någon kan vara så kall, hotfull eller kontrollerande. Men för
          din säkerhet spelar diagnos ofta mindre roll än beteendemönster.
        </p>

        <div className="not-prose my-6 rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-700 leading-relaxed">
            Om du vill läsa mer:{" "}
            <Link href="/psykopatiska-drag-relation" className="underline underline-offset-4">
              psykopatiska drag i relation
            </Link>
            ,{" "}
            <Link href="/skillnad-psykopat-narcissist" className="underline underline-offset-4">
              skillnad på psykopat och narcissist
            </Link>{" "}
            och{" "}
            <Link href="/tecken-pa-psykopat" className="underline underline-offset-4">
              tecken på att du lever med en psykopat
            </Link>
            .
          </p>
        </div>

        <h2>Om du vill få mer klarhet</h2>
        <p>
          Om du behöver ett mer strukturerat sätt att se mönster (utan att prata med någon just nu) kan
          du göra{" "}
          <Link href="/test" className="underline underline-offset-4">
            testet
          </Link>
          . Det ersätter inte stöd vid fara, men kan hjälpa dig sätta ord på det du redan känner.
        </p>

        <h2>Avslutning: du behöver inte “ha rätt” för att skydda dig</h2>
        <p>
          Du behöver inte kunna bevisa allt för att ta din rädsla på allvar. Om något i dig säger att
          “det här kan bli farligt”, då är det en signal som förtjänar respekt – särskilt om du krymper,
          anpassar dig, tappar dig själv, eller planerar dina ord för att undvika konsekvenser.
        </p>
        <p>
          Om du läser detta med en klump i magen: du är inte ensam. Det finns hjälp, och det finns vägar
          framåt – även när allt känns låst.
        </p>
        <section className="mt-12">
  <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
    Vanliga frågor (FAQ)
  </h2>
  <p className="mt-3 text-neutral-700 leading-relaxed">
    När man är rädd i en relation kommer frågorna ofta i korta, stressade sökningar. Här är svar på
    vanliga funderingar – sakligt, utan att förenkla bort din upplevelse.
  </p>

  <div className="mt-6 space-y-3">
    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Räknas det som våld om min partner inte slagit mig, men jag är rädd?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Rädsla är i sig en viktig signal. Hot, kontroll, att hindra dig från att gå, att skrämmas med
        aggressivitet eller att skapa en stämning där du måste anpassa dig för att “inte trigga något”
        kan vara tecken på en destruktiv och riskfylld situation, även utan synliga slag.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Är det normalt att jag går på tå hemma?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Att anpassa sig ibland är normalt i relationer. Men om du regelbundet går på tå för att undvika
        reaktioner, och om det kostar dig trygghet, självkänsla eller frihet, är det en varningssignal.
        Många beskriver det som att “rummet styrs av den andra personens humör”.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Vad är tidiga tecken på att det kan eskalera till fysiskt våld?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Vanliga riskmönster är hot (även vaga), ökande kontroll/isolering, “test” av gränser (hårda grepp,
        knuffar, blockera dörrar), att slå sönder saker eller kasta föremål, samt att ansvaret läggs på dig
        (“du gör mig så här”). Det är också en röd flagga om du märker att din värld krymper.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Om min partner slår i väggar eller slår sönder saker – är det ett hot?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        För många är det upplevt som ett hot, även om slaget inte träffar dig. Det kan fungera som
        “skrämseltaktik”: budskapet blir att våld finns nära till hands. Om du börjar ändra beteende av rädsla
        är det värt att ta på allvar.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Min partner säger “du kommer ångra dig” – är det ett hot?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Sådana formuleringar kan fungera som hot även om de är vaga. Frågan är: får det dig att känna rädsla,
        tystna eller “lyda” för att slippa konsekvenser? Om ja, är det en röd flagga – särskilt om det ingår i
        ett mönster av kontroll eller aggression.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Är det ett problem att min partner hindrar mig från att lämna ett rum?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Ja, det är en stark varningssignal. Att blockera dörrar, ta nycklar, ta telefonen eller “hålla fast”
        kan vara ett sätt att utöva kontroll och kan innebära risk för eskalation. Om du känner dig fångad är
        det viktigt att prioritera säkerhet och stöd.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Vad räknas som psykisk misshandel?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Psykisk misshandel kan vara återkommande förnedring, hot, kontroll, isolering, ständig kritik,
        skuld/skenlogik (“du tvingar mig”), gaslighting och bestraffning med tystnad. Det handlar ofta om ett
        mönster där du gradvis tappar trygghet, självkänsla och handlingsutrymme.
        Läs mer: <a className="underline underline-offset-4" href="/psykisk-misshandel-relation">psykisk misshandel i relation</a>.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Kan en person vara “snäll ibland” och ändå vara farlig?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Ja. Många destruktiva relationer pendlar mellan värme och obehag. Det kan göra det svårare att lita på
        sin egen magkänsla, eftersom du hela tiden får “bevis” för att det också finns en fin sida. Men det är
        mönstret över tid som avgör, inte enstaka bra dagar.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Jag blir kallsvettig när min partner blir arg – överdriver jag?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Kroppen överdriver sällan utan anledning. Om din kropp reagerar med stress, frysrespons eller panik kan
        det betyda att du lärt dig att situationen kan bli farlig eller nedbrytande. Ta signalen på allvar och
        prata gärna med någon du litar på.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Är svartsjuka ett tecken på risk?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Svartsjuka i sig är vanligt. Den blir riskfylld när den används för kontroll: förhör, anklagelser,
        förbud, övervakning, isolering eller hot. Då handlar det ofta mindre om känslor och mer om makt.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Min partner kontrollerar min mobil – är det normalt?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        I en trygg relation ska du kunna ha integritet. Kontroll av mobil, appar, konton eller vem du skriver
        med är ofta en del av ett större kontrollmönster. Läs mer:{" "}
        <a className="underline underline-offset-4" href="/kontrollerande-relation">kontrollerande relation</a>.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Vad är ekonomiskt våld?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Ekonomiskt våld kan vara att begränsa din tillgång till pengar, skapa skulder i ditt namn, kräva insyn
        i allt du spenderar, hindra dig från att jobba eller göra dig ekonomiskt beroende. Det är ett sätt att
        minska dina alternativ och kan hänga ihop med andra former av kontroll.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Jag vill lämna men är rädd för reaktionen – vad gör jag?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Om du är rädd för reaktionen är det klokt att prioritera stöd och säkerhet först. Börja med att prata
        med en trygg person eller en stödlinje. Många upplever att risken ökar när kontrollen hotas, så ta hjälp
        hellre en gång för mycket än en gång för lite.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Ska jag konfrontera min partner om jag misstänker våld?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Det beror på din riskbild. Om du är rädd, eller om det funnits hot/aggression, kan det vara säkrare att
        söka stöd först och inte ta svåra samtal när ni är ensamma eller när stämningen redan är laddad. Ditt mål
        är trygghet, inte att “vinna” samtalet.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Jag har barn – när ska jag söka hjälp?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Om du känner rädsla, ser hot, kontroll eller våld (även “bara” mot saker) är det rimligt att söka hjälp
        tidigt. Barn påverkas av stämningar och otrygghet även om de inte “ser allt”. Du kan börja med 1177 eller
        en stödlinje för att få vägledning.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Hur vet jag om det “bara är bråk” eller något farligare?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Konflikter finns i många relationer. Det som brukar skilja farligare lägen är rädsla, hot, kontroll,
        bestraffning och att du tappar frihet. Om du känner att du måste anpassa dig för att undvika konsekvenser
        är det mer än “ett vanligt bråk”.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Kan jag få hjälp anonymt i Sverige?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Ja. Kvinnofridslinjen (116 016) ger stöd och vägledning och du kan ofta vara anonym. För vårdråd kan du
        ringa 1177. Vid akut fara ringer du 112.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Jag skäms – är det vanligt?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Ja, väldigt vanligt. Skam är ofta en del av det som håller människor kvar i destruktiva relationer. Men
        skam är inte ett bevis på att du gjort fel – det är ofta ett tecken på att du varit ensam i något svårt.
        Du kan ta hjälp stegvis, utan att berätta allt på en gång.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Jag tror jag blir manipulerad – hur märker man det?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Vanliga tecken är skuldvändning (“det är ditt fel”), att du tvivlar på din upplevelse, att reglerna
        ändras, att du straffas när du sätter gränser och att du känner dig mer förvirrad än tidigare. Läs mer:
        <a className="underline underline-offset-4" href="/manipulativ-partner">hur vet man om någon är manipulativ?</a>
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Om min partner ber om ursäkt efteråt – betyder det att det blir bättre?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        En ursäkt kan vara äkta. Men det som avgör är om det finns långsiktig förändring: tar personen ansvar,
        söker hjälp, och minskar beteendet över tid – eller kommer samma mönster tillbaka? Många fastnar i en
        cykel där ursäkten blir “pausen” innan nästa utbrott.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Jag är rädd men vill inte lämna direkt – är det okej att ta det stegvis?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Ja. Många behöver tid för att förstå, planera och få stöd. Det viktigaste är att du tar din rädsla på
        allvar och bygger en väg som ökar din trygghet, steg för steg.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Jag känner mig kontrollerad – men det är “små saker”. Räknas det?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Kontroll blir ofta större genom små steg. En enskild “liten sak” kan vara svårt att tolka, men om det
        finns ett mönster där din frihet krymper är det relevant. Läs mer:{" "}
        <a className="underline underline-offset-4" href="/kontrollerande-relation">varför känner jag mig kontrollerad?</a>
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Vad ska jag göra om jag är osäker men magkänslan säger att något är fel?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Börja med klarhet: skriv ner konkreta exempel, prata med någon trygg, och jämför din situation med
        beskrivna mönster (kontroll, hot, rädsla, bestraffning). Du behöver inte “vänta på bevis” för att söka stöd.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        Finns det något test eller sätt att få en tydligare riskbild?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Vissa upplever att det hjälper att få struktur på mönster. Du kan göra{" "}
        <a className="underline underline-offset-4" href="/test">testet</a>{" "}
        som ett verktyg för reflektion. Vid akut rädsla eller fara är stödlinjer, vård eller polis det viktigaste.
      </p>
    </details>

    <details className="rounded-xl border border-neutral-200 bg-white p-4">
      <summary className="cursor-pointer font-medium text-neutral-900">
        När ska jag ringa 112, och när ska jag ringa 1177?
      </summary>
      <p className="mt-3 text-neutral-700 leading-relaxed">
        Ring <strong>112</strong> vid akut fara eller om du tror att våld kan ske snart. Ring <strong>1177</strong> för
        vårdråd och vägledning om du behöver hjälp att hitta rätt stöd i vården. Du kan också ringa Kvinnofridslinjen
        (116 016) för stöd och vägledning.
      </p>
    </details>
  </div>
</section>

        <hr />

        <p className="text-sm text-neutral-600">
          <strong>Ansvarsfriskrivning:</strong> Texten är generell information och ersätter inte professionell
          rådgivning, vård eller juridisk bedömning. Vid akut fara: ring <strong>112</strong>.
        </p>
      </section>
    </main>
  );
}