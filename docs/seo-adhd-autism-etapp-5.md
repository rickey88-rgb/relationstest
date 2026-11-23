# SEO Etapp 5 – ADHD och autism

Lokal releasekandidat på `codex/seo-adhd-autism-etapp-5` från `e75772803cf71f0183b132276d557813fc3f7146`, arbetskopia `C:\src\relationsvarning-seo-release-1`. Ingen push eller publicering. Analys och lokala kontroller utförda 23 november 2026.

## Verifierade fynd

Landningarna är redan vuxeninriktade, har tydliga startknappar, 30 frågor, kostnadsfri första återkoppling och valfri analys för 39 kr. De redovisar redan att modellerna inte är kliniskt validerade. Titlar, H1 och beskrivningar möter testintentionen och behålls. Det finns inget verifierat skäl att skriva om hela sidorna.

Den konkreta innehållsluckan är att läsaren inte får den faktiska poängprincipen förklarad, och att egna frågor/modeller inte uttryckligen skiljs från ASRS respektive AQ/RAADS-14. Att bara visa en nivå eller hänvisa till en allmän metodiksida ger sämre underlag för att förstå vad man väljer att genomföra.

Båda landningar ger HTTP 200, egen www-canonical och indexering tillåten. GSC-inspektionerna i underlaget från 22 november anger dem som indexerade. Frågeflödena har avsiktligt noindex och canonical till respektive landning. De är inga indexeringsfel och ändras inte. Sitemap innehåller båda landningarna och utesluter frågeflödena. Ingen ny liveinspektion eller begäran om indexering utfördes.

Inventeringen från 22 november visar 20 sidor med HTML-länk till ADHD-landningen och 15 till autism-landningen. Bland dem finns ämnesguider, startsidan, ADD-/Asperger-guider och överlappsguider. Landningarna länkar redan till metodik, vuxenguider, frågor om igenkänning och relevanta fördjupningar. Det motiverar att bevara länkarna, inte lägga till fler enbart för antalets skull. En inventering bevisar inte att länkarnas styrka eller externa auktoritet räcker.

## Konkurrentjämförelse och databegränsning

Daterade svenska observationer från 22 november: manuell läsning av Ahrefs offentliga SERP-gränssnitt, utan Google-skrapning. För `adhd test` noterades Nova på rad 2, Svea KBT på rad 3 och Althea på rad 5; för `autism test` Nova på rad 1, Svea KBT på rad 2, Familjepsykiatri på rad 3 och Mindler på rad 4. Källans ålder angavs då till cirka en timme, enhet okänd. Radnumren inkluderar sökfunktioner och är inte verifierade organiska mobilplaceringar.

Den 23 november öppnades samma kostnadsfria källa med Sverige/ADHD-test och Check SERP, men ingen resultatlista visades. Inga nya svenska Googleplaceringar eller toppresultat för de fyra övriga sökfraserna påstås därför. Innehållet på fem relevanta landningar granskades via webbkällan den 23 november; cache kan förekomma. Detta är en begränsning i aktuell konkurrensdata, inte skäl att hitta på placeringar.

| Konkurrent och landning | Observerat innehåll och användarväg | Slutsats för vår kandidat |
| --- | --- | --- |
| [Nova ADHD](https://www.novapsykiatri.se/adhd-test) | Anger ASRS, 18 vuxenfrågor, tidsåtgång, begränsningar och nästa vårdkontakt. Visar källor och hänvisningar till verksamheten. | Namngiven metod och tydliga begränsningar hjälper besökaren. Vårt eget test får inte låna instrumentets forskningsstöd. |
| [Svea KBT ADHD](https://www.sveakbt.se/sjalvtest/adhd-test-vuxen) | Tydlig vuxenmålgrupp, tid och gratisresultat; anger 10 frågor som bygger på ASRS-v1.1. | Ett påstående om grundinstrument är inte bevis för att en anpassad webbversion har samma validering. Vi påstår ingen sådan överensstämmelse. |
| [Nova autism](https://www.novapsykiatri.se/autism-test) | Namnger RAADS-14, redovisar vuxen-/barnspår, begränsningar och vidare kontakt. | Vår 30-frågorsmodell är ett annat verktyg. Skillnaden ska framgå före användning. |
| [Svea KBT autism](https://www.sveakbt.se/sjalvtest/autism-test) | Hänvisar till RAADS-14 och AQ samt beskriver att självskattningen inte är en diagnos. | Vi behöver förklara egen metod utan att antyda likvärdig diagnostisk precision. |
| [Familjepsykiatri autism](https://www.familjepsykiatri.se/test/autism-test) | 20 frågor, vuxenmålgrupp, tid, vilka områden frågorna berör och väg till konsultation. | Tydlig förhandsinformation är användbar; de allmänna hänvisningarna till etablerade metoder är inte en oberoende validering av webbtestet. |

Klinikernas webbplatser visar vårdtjänster, kontaktvägar och uppgifter om psykologer. Det är observerbara förtroendesignaler. Enskilda yrkeslegitimationer, metodföljsamhet, omdömen och fullständig vetenskaplig validering av deras webbimplementationer har inte oberoende verifierats här. Relationsvarning har inte tilldelats sådana meriter i text eller strukturerad data.

## Överlappande sökintention

I 28-dagarsrapporten syns `adhd test` på ADHD-landningen (252 visningar, position 33,67) och AuDHD-testet (105 visningar, 32,83). Det är observerad överlappning. Det visar inte att AuDHD-sidan orsakar ADHD-sidans låga ranking. Query-/URL-visningar kan överlappa; dessa tal ska inte summeras till marknadsandelar.

För `autism test vuxen` syns autism-landningen (42 visningar, 32,95), Asperger-guiden (11, 69,18) och AuDHD-testet (8, 68,25). För breda `autism test` har autism-landningen 106 visningar och position 62,89 i detta underlag. ADD-/Asperger-sidorna är begreppsguider; `har-jag`-sidorna förklarar igenkänning. Alla länkar vidare till relevant självtest och har separata texter/rubriker. Inga omdirigeringar, canonicaländringar eller ingrepp i AuDHD görs på detta begränsade underlag.

## Exakta ändrade filer och avsnitt

1. `app/adhd-test/page.tsx`: utökar slutet av `Så fungerar självskattningen` med egen modell, avsaknad av klinisk validering och skillnad mot ASRS, med länk till SKR:s formulärbeskrivning. Befintlig metodiklänk bevaras. Nytt kort avsnitt `Vad betyder poängen?` förklarar 0–4 poäng per svar, fem frågor per område, normalisering till 0–100 och medelvärdet av de första fem områdena. Vardagspåverkan redovisas separat och påverkar tolkningen, inte indexet. Förklarar att exempelvis 60 av 100 varken är diagnossannolikhet eller befolkningspercentil. Artikelns ändringsdatum uppdateras till 23 november, ursprungligt publiceringsdatum bevaras.
2. `app/autism-test/page.tsx`: motsvarande begränsad utökning i metodavsnittet, med tydlig skillnad mot AQ och RAADS-14 samt primärkällor. Samma grundläggande poängförklaring men korrekt avgränsning av området vardagspåverkan/långvarighet. Den redan befintliga korta uppgiften om fem områden/separat påverkan flyttas till den samlade förklaringen för att undvika upprepning. Ändringsdatum uppdateras; publiceringsdatum bevaras.
3. `docs/seo-adhd-autism-etapp-5-baseline.json`: fryst föredata för sex efterfrågade fraser, båda sidtotalerna, query-/URL-fördelning och fyra datavyer.
4. `docs/seo-adhd-autism-etapp-5.md`: denna analys och releaseplan.

Inga andra produktfiler ska ingå. Rubrikerna H1, söktitlar, beskrivningar, canonical, konverteringsheader, startknappar, bilder, FAQ, priser, gratisåterkoppling, rapporter, frågor, modeller, API:er, Stripe och betalflöden är oförändrade. Bygggenererade sitemap-/robotsfiler återställdes till basens identiska URL-mängd; inga nya artiklar eller system infördes.

## Metod- och källkontroll

Beskrivningen kontrollerades mot `app/adhd-test/test/model.ts`, `questions.ts` och motsvarande autismfiler. Båda har 30 frågor, sex grupper om fem, svar 0–4, områden 0–100 och index som medelvärde för de fem första grupperna. Kontextområdet påverkar tolkningsreglerna. Ingen befolkningsnormering, sannolikhetsmodell eller klinisk validering framgår av dessa modeller. Rapporternas befintliga profilnamn och nivågränser är produktregler och ändras inte.

Externa källor beskriver andra instrument eller klinisk bedömning; de validerar inte Relationsvarnings modeller:

- [SKR: ASRS för vuxna](https://patientenkat.se/nationellpatientenkat/nationellformularsamling/sokformularbeskrivningar/asrs6manaderadhdvuxna.87063.html).
- [Autism Research Centre: AQ Adult](https://www.autismresearchcentre.com/tests/autism-spectrum-quotient-aq-adult/).
- [Eriksson med flera, RAADS-14 Screen, originalstudie 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC3907126/). Studien avser ett annat instrument i en specificerad vuxenpsykiatrisk population; ingen diagnostisk träffsäkerhet överförs till vårt test.
- Befintliga medicinska hänvisningar till [1177 ADHD](https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/adhd/) och [1177 autism](https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/autism/) kontrollerades. NICE:s direktsidor gav 403 i webbläsningsverktyget; inget nytt medicinskt påstående baseras på otillgänglig text. Befintliga källhänvisningar bevaras.

Ingen klinisk sakkunniggranskning, ny validering eller överlägsenhet över etablerade instrument påstås.

## GSC-baslinje och uppföljning i JYCKEN

Använder uppdragets befintliga export insamlad 22 november kl. 18:35:10 UTC, med sista datadag 20 november. Ingen ny API-import behövdes för denna avgränsade ändring dagen efter analysen. 28 dagar: 24 oktober–20 november; 90 dagar: 23 augusti–20 november. Alla enheter och Sverige/mobil sparade separat. Saknad rad är inte noll efterfrågan; låg synlighet bevisar inte låg sökvolym.

Hela webbplatsens exakta sökfraser, alla enheter, 28 dagar:

| Fras | Klick | Visningar | CTR | Genomsnittsposition |
| --- | ---: | ---: | ---: | ---: |
| adhd test | 0 | 289 | 0 % | 32,56 |
| adhd test vuxen | 0 | 131 | 0 % | 33,33 |
| adhd självtest | 0 | 38 | 0 % | 56,66 |
| autism test | 0 | 106 | 0 % | 62,89 |
| autism test vuxen | 0 | 46 | 0 % | 35,09 |
| autism självtest | 0 | 2 | 0 % | 25,00 |

Sidfiltrerade värden skiljer sig delvis från webbplatstotalerna; båda finns i JSON. Exempelvis är `adhd test` 33,67 för ADHD-landningen. Två exponeringar för `autism självtest` ger mycket osäkert lägesunderlag. GSC-genomsnittsposition är inte en fast Googleplacering och exporten är ingen uppskattning av total svensk sökvolym.

Två planerade åtgärder registrerade i JYCKENs separata lokala databas, utan publiceringsdatum, med bas, relevanta query-/sidvärden och hänvisning till fryst 28-/90-dagarsbaslinje. Äldre importer och publicerade åtgärder bevarades. Publiceringscommit och faktisk tid ska läggas till först vid ett godkänt släpp.

Efter publicering: följ alla sex fraser, landningssida, klick, visningar, CTR och exponeringsvägd position i alla enheter respektive Sverige/mobil. Dag 7: crawl, indexering och tidiga signaler; dag 28 och 90: utveckling och stabilitet, med AuDHD-/Asperger-fördelning separat. Bedöm först om topp 20 nås över flera veckor, därefter topp 10. För två exponeringar behövs mer underlag innan slutsatser. Befintlig daglig GSC-insamling används; ingen ny automation eller betaltjänst skapas i detta arbete.

## Verifiering

- Produktionsbuild `npm run build -- --webpack`: godkänd, TypeScript inkluderad, 161 statiska sidor. Befintlig länkad beroendekatalog kräver Webpack i arbetskopian. Endast lokala juridiska byggfixturer; inga produktionsnycklar.
- ESLint för båda ändrade sidfilerna: godkänd.
- 13 befintliga testprogram godkända: ADHD `model`, `paywall`, `personalFinding`; autism `model`, `flow`, `recovery-analytics`; testAccounts `core`, `payment`, `http`, `guest-restore`, `stage4-parity`, `stage4-flow`, `stage4-http-ui`. De omfattar bland annat 15 625 poängkombinationer för varje modell, 931 frysta autismrapporter och syntetiska betalnings-/återställningsfall. Testmiljön använder avsedd inställning `ACCOUNT_PORTAL_ENABLED=true` där det krävs.
- Lokal renderad produktionsbuild: åtta sidor HTTP 200. Båda ändrade landningar har en H1, oförändrad titel/beskrivning/canonical/indexering, giltig JSON-LD och samtliga tidigare internlänkar. De två frågeflödena samt ADD-, Asperger- och båda `har-jag`-sidorna har oförändrad analyserad HTML/metadata. Testflödenas noindex och canonical bevarade.
- 25 unika interna länkmål från landningarna HTTP 200. Sitemap fortsatt 142 adresser, båda landningar inkluderade och frågeflödena uteslutna.
- Konverteringsheadern är identisk i renderad HTML före/efter. Pris 39 kr och befintlig gratisterminologi kvar. Ingen faktisk betalning genomfördes.
- Mobil 390x844 och desktop 1440x900: båda landningar och metodtexter granskade, ingen observerad horisontell överströmning. Båda startknapparna öppnar respektive test och visar fråga 1 av 30 i båda storlekarna. Inga svar skickades i webbläsaren.
- Diffkontroll godkänd. Inga kvarstående testfel. Webbkällans nya SERP-lista kunde däremot inte verifieras; se begränsningen ovan.

Evidens med före-/efter-HTML, metadata, baslinje, lokalkontroller, skärmbilder och kvitto på JYCKEN-registrering: `C:\Users\hamma\Documents\Codex\2026-11-07\referenced-chatgpt-conversation-this-is-an\work\adhd-autism-etapp-5`.

## Förväntad nytta, risker och publiceringsplan

Detta fyller en verifierad informationslucka och gör produktens begränsningar mer begripliga. Det kan hjälpa besökaren välja och tolka självtestet och ge en bättre grund för förtroende. Rankingeffekten är en hypotes. Några metodstycken kan inte ersätta kliniskt underlag, oberoende sakkunniggranskning eller etablerad auktoritet. Ingen verifierad ensam grundorsak till position 33/63 har identifierats. Ingen trovärdig klickprognos eller garanti om topp 20/10/3 kan räknas fram från detta underlag.

Risker: mer metodtext före den andra CTA:n kan påverka läsning och konvertering, även om första CTA:n och alla produktflöden bevaras. Överlappande sökfraser kan fortsatt få andra URL än avsett. Källänkar kan ändras. Framtida klinisk granskning måste vara verklig och dokumenterad; inga meriter får läggas till i förväg.

Publicera först efter uttryckligt godkännande av kandidatcommit. Kontrollera då GitHubs main och aktiv Vercel-produktion mot basen `e75772803cf71f0183b132276d557813fc3f7146`; avbryt för granskning om de har ändrats. Vid oförändrad bas: fast-forward till kandidaten och vanlig push. Verifiera Vercels exakta commit, båda landningar, metadata/canonical, metodavsnitt, internlänkar, mobil/desktop och båda teststarter. Registrera därefter verklig publiceringstid/commit i de planerade JYCKEN-åtgärderna. Ingen begäran om indexering behövs för att sidorna tekniskt ska fungera; Google avgör återcrawl och indexering. Återställ vid behov med revert via vanligt flöde, inte reset/force-push.
