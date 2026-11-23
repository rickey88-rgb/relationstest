# SEO Etapp 6 – resterande relationsguider

Lokal kandidat från `9f68db845d45db5e26853a0945bc7f0bf1c82e32`, gren `codex/seo-relationsguider-etapp-6`, arbetskopia `C:\src\relationsvarning-seo-release-1`. Granskning 23 november 2026. Ingen push eller publicering.

## Beslut per sida

| Sida | Verifierat behov | Beslut |
| --- | --- | --- |
| `/manipulativ-partner` | Inledningen beskrev känslan av förvirring före en direkt begreppsförklaring. Starkaste rapporterade frasen är det breda `manipulativ`. Ett tystnadsexempel tillskrev avsikt, och rådet att prova en gräns saknade ett lokalt säkerhetsvillkor. | Byt två inledande stycken mot definition och konkret illustration, behåll partnerperspektivet. Nyansera tystnad och säkra två råd. |
| `/gaslighting-relation` | Definitionen var redan tydlig men konkreta exempel kom efter bild, testpanel och känsloavsnitt. `gaslighting exempel` har observerad synlighet runt position 12. | Lägg ett kort exempel direkt under definitionen, med ankarlänk till oförändrad fördjupning och extern stödkälla. Lägg säkerhetsvillkor till anteckningsrådet. |
| `/traumabindning-i-relation` | En lång känslobeskrivning föregick definitionen. Två nervsystemsförklaringar saknade sidanknutet forskningsunderlag och kunde läsas som en individuell mekanism. | Definiera direkt, avgränsa mot vanlig saknad och ersätt nervsystemsförklaringar med upplevelser/illustrationer. Lägg forskningshänvisning med begränsning. Nyansera igenkänning och anteckningar. |
| `/love-bombing-relation` | Har redan svensk definition, stavningsvarianter, tidiga exempel, skillnad mot förälskelse och tydligt förbehåll om avsikt. Några smala fraser ligger redan högt. | Oförändrad. Inget konkret behov motiverar en omskrivning eller titeländring. |
| `/medberoende` | Har definition, nyansering av diagnosbegreppet, exempel på omsorg/överansvar, säkerhet vid hot, källhänvisningar och tydlig testväg. `medberoende destruktiv relation` har relevant synlighet, medan breda `medberoende` ligger betydligt lägre. | Oförändrad. Behåll befintlig fördjupning och ansvarsfördelning; låg ranking ensam motiverar inte mer text. |

## Exakta ändringar och filer

1. `app/manipulativ-partner/page.tsx`: endast två introduktionsstycken, slutet av listpunkten `Tystnad som straff` samt två råd under vägledningen. Definitionen skiljer press genom skuld/förskjutet ansvar från ett öppet önskemål med utrymme för nej. Exemplet är ett brutet löfte där samtalet återkommande fastnar i tonen. En enstaka reaktion är inte en personbedömning. Behov av paus är inte automatiskt bestraffning; anteckningar förutsätter trygg förvaring och gränssättning förutsätter att situationen känns trygg.
2. `app/gaslighting-relation/page.tsx`: två korta stycken tillagda i `Vad betyder gaslighting?`: ett illustrativt exempel och länk till Rokstjejjourers förklaring/stöd. En ensam replik räcker inte för slutsatsen gaslighting. Befintliga `Exempel på gaslighting i en relation` får id `exempel`; all fördjupning behålls. Anteckningsrådet förtydligar trygg förvaring och att dokumentation inte krävs för stöd. Ändringsdatum i artikelunderlaget uppdateras till 23 november, publiceringsdatum bevaras.
3. `app/traumabindning-i-relation/page.tsx`: första introduktionsstycket blir en definition med avgränsning mot saknad. Ett stycke i `Vad betyder traumabindning?` blir ett uttryckligen illustrativt exempel på lättnad efter en ursäkt. Ett annat stycke i teckenavsnittet ersätter nervsystemstolkningen med möjliga samtidiga känslor och praktiska hinder. En kort källhänvisning efter definitionsavsnittet anger forskningens begränsning. Två meningar i `Vad kan hjälpa om du känner igen dig?` gör tydligt att igenkänning inte fastställer orsak och att anteckningar ska kunna förvaras tryggt. Ändringsdatum uppdateras, publiceringsdatum bevaras.
4. `docs/seo-relationsguider-etapp-6-baseline.json`: fryst 28-/90-dagarsdata för alla fem guider, utvalda generiska sökfraser, sidmetadata och filter.
5. `docs/seo-relationsguider-etapp-6.md`: denna granskning och releaseplan.

Ingen ny artikel, sidvariant, komponent, testfråga, poängmodell, rapport, pris-, betalnings- eller API-ändring. Titlar, H1, metabeskrivningar, canonical, alla befintliga rubriker, interna länktexter/mål och testvägar bevaras. Inga ändringar alls i love bombing- eller medberoendefilen. Bygggenererade robots-/sitemapfiler återställda till basen; URL-mängden är oförändrad.

## GSC: prioritering och baslinje

Befintligt analysunderlag insamlat 22 november 18:35:10 UTC, data t.o.m. 20 november. 28 dagar: 24 oktober–20 november; 90 dagar: 23 augusti–20 november. Ingen ny import krävdes för denna avgränsade etapp. Alla enheter och Sverige/mobil finns separat i JSON, liksom sidtotaler och skillnaden mellan webbplatsens queryrapport och fråga+sida.

| Fras och avsedd guide | Klick 28 dagar | Visningar | CTR | Genomsnittsposition |
| --- | ---: | ---: | ---: | ---: |
| manipulativ | 2 | 306 | 0,65 % | 8,34 |
| traumabindning | 1 | 168 | 0,60 % | 8,48 |
| lovebombing | 1 | 166 | 0,60 % | 10,30 |
| vad är love bombing | 2 | 77 | 2,60 % | 5,99 |
| love bombing svenska | 1 | 75 | 1,33 % | 6,23 |
| love bombing | 0 | 69 | 0 % | 10,48 |
| medberoende destruktiv relation | 0 | 50 | 0 % | 8,40 |
| gaslighting exempel | 1 | 49 | 2,04 % | 12,45 |

Smala fraser med få exponeringar: `love bombing tecken` 2 klick/10 visningar, position 3,20; `tecken på lovebombing` 1/26, position 1,69; `manipulativ partner test` 1/18, position 4,44. Dessa är genomsnitt, inte bevis för stabil topp 3. Bredare `medberoende` har 0/20, position 59,80, medan `medberoende betyder` har 0/8, position 17,25. Svag synlighet är inte bevis för låg total sökvolym.

Sverige/mobil för de viktigaste fem fraserna: `manipulativ` 2/254, position 8,29; `traumabindning` 1/134, 8,54; `love bombing svenska` 1/68, 6,25; `gaslighting exempel` 1/47, 11,15; `medberoende destruktiv relation` 0/32, 8,56. Underlaget är tunt för säkra CTR-slutsatser. Personliga långa sökfrågor har inte tagits med i denna dokumentationsbaslinje.

Tre planerade åtgärder registrerade i JYCKENs separata lokala utvecklingsdatabas med bas, relevanta query-/sidmått och hänvisning till den frysta baslinjen. Inga publiceringsdatum satta och inga äldre importer/åtgärder överskrivna. Oförändrade sidor har inget nytt publiceringspåstående. Efter eventuellt släpp: följ klick, visningar, CTR, exponeringsvägd position, landningssida och tillgängliga samtyckesbaserade teststarter efter 7/28/90 dagar, både alla och Sverige/mobil.

## Konkurrenter: verifierat och okänt

Det finns ingen här verifierad aktuell svensk organisk förstaplats eller komplett topp 3 för dessa fraser. Gränssnittets tidigare manuella Ahrefs-observationer från 22 november är cachade, har okänd enhet och radnummer som inkluderar sökfunktioner. De får inte presenteras som dagens organiska placeringar. Ingen Google-skrapning eller betaltjänst användes.

Underlagets radnummer: `love bombing` engelska Wikipedia 2 och Kognitiva Teamet 3 (källa 13 dagar gammal); `gaslighting` svenska Wikipedia 2, Aftonbladet 4 och Rokstjejjourer 5 (en dag); `manipulativ partner` MåBra 1, Varningstecken 3, Karlstads kvinnojour 5 och Relationsvarning 6 (cirka en månad); `medberoende` Ljung & Sjöberg 2, Mindler 4 och Svea KBT 5 (cirka 14 timmar). Traumabindning saknas i denna SERP-källa. Det är belagda historiska konkurrentobservationer, inte belagd organisk förstaplats. Ingen jämförelse med en påstådd vinnare används som ensam grund för ändringarna.

Följande innehåll granskades via offentliga webbkällor 23 november; sidcache kan förekomma:

- [Kognitiva Teamet, love bombing](https://kognitivateamet.se/artiklar/vad-ar-love-bombing/): definition, tecken och hjälpväg med namngiven yrkesroll på sidan. Vår sida har redan motsvarande kärninformation och en tydligare tidig avgränsning av avsikt, varför mer text inte motiveras.
- [MåBra, emotionell manipulation](https://www.mabra.com/psykologi/checklistan-avslojar-om-du-blir-emotionellt-manipulerad/10268619): känslomässig återbetalningsskyldighet och checklistintention syns i tillgänglig inledning. Hela eventuell låst text och all sakkunniggranskning kunde inte verifieras. Vår konkreta förändring är en direkt begreppsförklaring, inte fler listpunkter.
- [Rokstjejjourer, gaslighting](https://rokstjejjourer.se/om-vald/vad-ar-vald/psykiskt-vald/gaslighting): kort förklaring, exempel och stöd. Det ger ett relevant jämförelseunderlag för tidigare praktisk information och en naturlig extern stödlänk. Karlstads kvinnojours manipulationssida svarade inte i hämtningen; dess innehåll bedöms inte som verifierat här.
- [Ljung & Sjöberg](https://ljungsjoberg.se/nyheter/ar-jag-medberoende/), [Mindler](https://mindler.se/vad-innebar-det-att-vara-medberoende/) och [Svea KBT](https://www.sveakbt.se/medberoende): definitioner, ansvar/anpassning, tecken och behandlings-/kontaktvägar. Vår befintliga sida skiljer redan överansvar från legitim omsorg och anpassning till hot. Den lämnas oförändrad.
- [Gävleborgs Psykoterapi, traumabindning](https://gavleborgspsykoterapi-akademi.se/blogs/kunskapsbank/traumabindning-vad-betyder-det): tydlig avgränsning av begreppet och praktiska hinder. Hittad via vanlig webbsökning; svensk Googleplacering är inte verifierad. Det är ett innehållsexempel och inte belagd topp 3. Vår förbättring knyts till den egna sidans konkreta överdrift i nervsystemsspråket.

Namn på författare, yrkesroller, kontaktvägar och källor är synliga signaler på konkurrenternas sidor. Yrkeslegitimationer, trafikestimat och medicinsk granskning har inte oberoende kontrollerats. Inga sådana meriter tillskrivs Relationsvarning.

## Psykologisk korrekthet och osäkerhet

De nya exemplen är illustrationer, inte diagnostiska kriterier eller bevis för motiv. Enstaka repliker, tystnad eller saknad räcker inte för person- eller orsaksbedömningar. Ingen neurobiologisk mekanism eller diagnostisk precision tillkommer. Anteckningsråd förutsätter säker förvaring; rädsla ska inte mötas av en uppmaning att prova gränser ensam.

[Dutton och Painter 1993](https://pubmed.ncbi.nlm.nih.gov/8193053/) används som forskningsbakgrund till samband mellan maktobalans, återkommande utsatthet och känslomässiga band. Indexerad originalsammanfattning och uppgifter i den tillgängliga författarpublicerade artikeln användes; ingen ny systematisk forskningsöversikt utfördes. Studien ger inte en nervsystemsdiagnos eller en universell förklaring till varför en viss person stannar. Inga effektstorlekar används i sidtexten. Praktiska hinder beskrivs utan att reducera ansvar för våld till den utsattas reaktioner.

Medberoendesidans tidigare forskningshänvisning till 2026 års översikt gav inte full artikelinformation vid direkt PubMed-hämtning denna gång. Ingen ny slutsats dras från den och ingen ny validering påstås. Att lämna sidan oförändrad innebär inte en ny klinisk sakkunniggranskning av hela forskningsfältet. Ingen expertgranskning eller produktvalidering har hittats på.

## Verifiering

- Slutlig produktionsbuild `npm run build -- --webpack`: godkänd inklusive TypeScript, 161 statiska sidor. Lokala juridiska byggfixturer, inga produktionsnycklar. Befintliga länkade beroenden kräver Webpack.
- ESLint på alla tre ändrade sidfiler: godkänd efter slutliga textändringar.
- Tio befintliga regressionstestprogram godkända: stage3 parity/flow/http-ui, stage5 parity/flow/http-ui samt stage6 parity/flow/http-ui/safety. De omfattar huvudrelationstestet, gaslighting, medberoende och traumabindning, frysta frågor/rapporter, poänggränser, syntetiska betalningar, återställning och säkerhetsfall. Inga produktflöden ändrades.
- Nio lokala sidor ger HTTP 200: fem guider och fyra frågeflöden. Titlar, beskrivningar, canonical, indexeringsdirektiv, samtliga H1–H3 och tidigare internlänkar är identiska med föredata. Ny gaslighting-ankarlänk leder till befintlig fördjupning. Giltig JSON-LD, oförändrad FAQ/schema.
- Love bombing, medberoende och de fyra frågeflödena har oförändrad renderad huvud-HTML efter normalisering av enbart Vercels automatiska dpl-bildparameter. 36 unika interna länkmål HTTP 200. Sitemap fortsatt 142 adresser, samtliga fem guider kvar.
- Mobil 390x844 och desktop 1440x900: samtliga fem guider granskade, ingen observerad horisontell överströmning. Tio teststarter verifierade via guidernas egna länkar: relationstestet fråga 1 av 42 från love bombing/manipulation samt gaslighting-, traumabindnings- och medberoendetest fråga 1 av 30, i båda storlekarna. Inga svar eller riktiga köp genomfördes. Samtyckesrutan är befintlig och oförändrad.
- Diffkontroll godkänd. Endast tre sidfiler och två dokumentationsfiler ska ingå. Inga kvarstående testfel.

Evidens: `C:\Users\hamma\Documents\Codex\2026-11-07\referenced-chatgpt-conversation-this-is-an\work\relationsguider-etapp-6`, med före-/efter-HTML, baslinje, metadata, länkkontroll, skärmbilder och JYCKEN-kvitto.

## Risker och releaseplan

Förväntad användarnytta är tydligare svar och mindre risk för övertolkning, inte bevisat rankinglyft. Ändrade inledningar kan påverka Googles textutdrag och CTR; mer tidig text kan påverka hur många som når testlänkar. Små GSC-tal ger stor variation och motiverar inga säkra klickprognoser. Aktuell organisk förstaplats/topp 3 återstår att verifiera med tillåten källa innan mer långtgående konkurrensslutsatser dras.

Publicera först efter uttryckligt godkännande av kandidatcommit. Kontrollera då GitHubs main och aktiv Vercel-produktion mot bas `9f68db845d45db5e26853a0945bc7f0bf1c82e32`; avbryt och granska om de har ändrats. Vid oförändrad bas: fast-forward, vanlig push, verifiera exakt Vercel-commit och upprepa produktionskontroller av de tre ändrade guiderna, bevarade guider och testvägar. Registrera faktisk publiceringstid/commit i de tre planerade JYCKEN-åtgärderna först efter verifierat släpp. Återställ vid behov med revert via vanligt flöde, med senare kod bevarad. Ingen automatisk publicering eller ytterligare schemaläggning har införts.
