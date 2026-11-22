# SEO etapp 2 – IQ-testet, lokal releasekandidat

Granskad 22 november 2026. Gren: `codex/seo-iq-etapp-2`, baserad på `a0c1ea22a2306dc15411f86cfada669f57700588`. Fjärrgrenens main kontrollerades vid start och efter verifiering och låg kvar på denna commit. Arbetskopia: `C:\src\relationsvarning-seo-release-1`. Ingen push eller publicering ingår.

## Underlag och observerad efterfrågan

JYCKENs analys och insamling från 22 november används. Den senaste 28-dagarsperioden är 24 oktober–20 november; 90-dagarsperioden är 23 augusti–20 november. Tabellen visar exakta sökfrågor i Sverige/mobil. Exponeringar är observerad synlighet och ska inte tolkas som total sökvolym.

| Sökfråga | Klick, 28 dagar | Exponeringar | CTR | Genomsnittsposition |
| --- | ---: | ---: | ---: | ---: |
| iq test | 5 | 1 710 | 0,29 % | 9,64 |
| iq test gratis | 12 | 623 | 1,93 % | 8,61 |
| iq-test | 0 | 16 | 0 % | 9,50 |
| iq test svenska | 0 | 15 | 0 % | 11,93 |

På 90 dagar har `iq test` 5 klick, 1 718 exponeringar och position 9,65 i samma segment; `iq test gratis` har 14 klick, 636 exponeringar och position 8,95. Det mesta av den observerade synligheten ligger därmed i den senaste 28-dagarsperioden. Detta är en baslinje, inte ett bevis på effekten av någon enskild tidigare ändring.

## Konkurrentgranskning och motivering

De sparade SERP-observationerna den 22 november kommer från Ahrefs publika gränssnitt för Sverige. Enhet saknades och raderna inkluderade sökfunktioner. De används för att identifiera konkurrenter, inte som verifierade aktuella svenska mobilplaceringar. Ingen Google-skrapning har gjorts.

- [Mensa Sveriges provtest](https://mensa.se/intelligenstest/provtest/) förklarar uppgiftstyp, antal uppgifter, tidsgräns och begränsningar redan före start. Namngiven organisation och förklaringen av relationen till det övervakade provet ger ett tydligt sammanhang för resultatet. Vi kan förbättra transparensen om vårt eget test utan att antyda motsvarande normering eller anknytning till Mensa.
- [JobCannons IQ-sida](https://jobcannon.io/sv/tests/iq-test) förklarar sin egen poängskala, avsaknad av normtabeller och skillnaden mot kliniska test. Sidan kopplar också till andra problemlösningstester. Dess egna uppgifter om användarantal, effekter och tillförlitlighet har inte verifierats och används inte som förebild för sakpåståenden.
- Illustrerad Vetenskaps testsida ingår i det äldre konkurrentunderlaget. Den aktuella hämtningen gav HTTP 451. Ingen ny innehållsbedömning av den sidan görs och ingen åtkomstbegränsning har kringgåtts.
- [Pearsons information om WAIS-5](https://www.pearsonclinical.se/wais-5-faq) används som primär bakgrundskälla för normering och standardiserad testning, inte som konkurrentplacering eller validering av vår modell.

## Faktiska brister och avgränsningar

Den publicerade IQ-sidan hade redan relevant titel, H1, introduktion, exempeluppgift, tre startknappar och tydlig uppdelning mellan gratisestimat och valfri analys för 79 kr. Dessa delar har bevarats.

Metodtexten sade däremot bara att en viktad prestation översätts till ett avrundat estimat. Den förklarade inte viktning, maxpoäng, omräkning, skalans gränser eller vad avsaknad av normdata betyder för tolkningen. På metodiksidan gick IQ-länken direkt till testflödet. Guiden om exekutiva funktioner hade redan en IQ-länk bland relaterade sidor, men ingen kontextuell förklaring och länk i brödtexten.

Ingen aktuell teknisk indexeringsspärr hittades för landningssidan: publicerad HTTP 200, egen www-canonical, indexering tillåten och adress i sitemap. Testflödet har redan noindex och canonical till landningen; detta bevaras.

## Exakta ändrade filer och beteende

1. `app/iq-test/page.tsx`: det korta avsnittet om estimatets innebörd ersätts med ett metodavsnitt med ankaret `sa-beraknas-iq-estimatet`. Det beskriver 1/1,25/1,5 poäng per rätt svar, 0 för fel, max 50, omräkningen `75 + (poäng / 50) × 55`, avrundning till femtal och intervallet 75–130. Exemplet 30 poäng → 108 → 110 är verifierat mot modellen. Avsaknad av normgrupp och åldersjustering, svarstidernas avsaknad av påverkan samt begränsningar i percentiler och klinisk tolkning förklaras. Källänk till Pearson och internlänk till metodik tillkommer. Artikelns ändringsdatum sätts till den faktiska redigeringsdagen, utan att ändra publiceringsdatum.
2. `app/metodik/page.tsx`: endast IQ-posten ändras. Länken går nu till landningens metodavsnitt och den korta beskrivningen anger modellens faktiska viktning och skala. Övriga testposter är oförändrade.
3. `app/exekutiva-funktioner/page.tsx`: ett kort avsnitt skiljer testets problemlösningsuppgifter från vardagens planering. Där finns en kontextuell länk till IQ-landningen. Den befintliga relateratlänken och guidens övriga innehåll bevaras. Artikelns ändringsdatum uppdateras till redigeringsdagen.
4. `docs/seo-iq-etapp-2.md`: denna gransknings- och releasebeskrivning.

Ingen ändring av testfrågor, modell, resultatrapport, svarslagring, analyspris, Stripe, analysköp eller andra testflöden. Inga nya artiklar, tjänster eller API-kostnader. Inga påståenden om sakkunniggranskning eller validering har lagts till.

## Verifiering

- Produktionsbuild: `npm run build -- --webpack`, godkänd inklusive TypeScript och generering av 160 sidor. Arbetskopians befintliga beroendelänk kräver Webpack. Obligatoriska juridiska byggfält fick lokala fixturvärden; inga produktionsnycklar användes.
- Lint: `npx eslint app/iq-test/page.tsx app/metodik/page.tsx app/exekutiva-funktioner/page.tsx`, godkänd.
- Fem befintliga testprogram, samtliga godkända: `app/iq-test/test/model.test.cjs` samt `app/_lib/testAccounts/stage7-{parity,flow,http-ui,safety}.test.cjs`. Kördes med lokal `ACCOUNT_PORTAL_ENABLED=true` enligt projektets testkonfiguration. Testerna gör bland annat 72 938 beräknings-/profiljämförelser och 1 089 exakta jämförelser av fullständiga rapporter. De kontrollerar fryst modell, frågor, pris, gamla flödeseffekter, syntetiska betalningsfall och integritet. Inga verkliga köp gjordes.
- Renderad lokal produktionsbuild: fyra sidor och 31 unika interna länkmål kontrollerade med HTTP 200. Titlar, beskrivningar, H1, canonical och indexeringsdirektiv jämförda mot livebaslinjen. Ankaret från metodik, schema, exempelberäkning och sitemap/robots verifierade.
- IQ-sidans inledande HTML, prisuppgifter och samtliga tre testknappar är identiska med baslinjen. FAQ-data och FAQ-schema är oförändrade. Genererade sitemap-/robotsfiler ingår inte i ändringen.
- Webbläsare: IQ-landning, metodavsnitt, navigering och teststart kontrollerade på mobil 390 px och desktop 1440 px. Den kontextuella länken från exekutivguiden fungerar i båda storlekarna. Ingen horisontell överströmning observerades. Metodikankaret placerar metodavsnittet nära överkanten. Fråga 1 av 40 visas vid teststart.
- Ett automatiskt mobilklick missade först en radbruten länk genom att träffa mellanrummet mellan textraderna. Kontroll av klickytan och klick på den synliga texten visade korrekt navigering. Det var inget verifierat webbplatsfel och motiverade ingen kodändring. Inga kvarstående testfel finns.

Baslinje, renderad HTML, länkresultat och bilder finns lokalt i `C:\Users\hamma\Documents\Codex\2026-11-07\referenced-chatgpt-conversation-this-is-an\work\iq-etapp-2`. `before-live.json` innehåller också de sparade 28-/90-dagarsvärdena från JYCKEN. `after-local.json` och `browser-checks.json` dokumenterar kontrollerna.

## Risk och plan inför en eventuell release

Ändringarna förbättrar insyn i metoden och kopplingen mellan befintliga sidor. De tillför inte normering eller vetenskaplig validering av IQ-estimatet. Konkurrenternas auktoritet och externa länkar påverkas inte av denna etapp. Topp 3 kan inte utlovas och det finns inget försvarbart numeriskt trafikestimat för just denna lilla ändring.

Den utförligare metodförklaringen kan påverka hur besökare bedömer testet och den valfria analysen. Följ både relevanta organiska klick och befintliga samtyckesbaserade händelser för `landing_view`, `test_start`, `test_complete` och `begin_checkout`; tolka inte små stickprov som säkra effekter. Första startknappen och dess placering har bevarats.

Före eventuell publicering ska main jämföras igen med bascommiten. Om produktionen har flyttat krävs en ny kompatibilitetskontroll, inte återställning av nyare kod. Efter godkänd release verifieras exakt commit på Vercel, HTTP 200, canonical, pris, startknappar och metodiklänk i produktion. Kontrollera indexering och vald canonical efter sju dagar och sökfrågornas klick/CTR/position samt teststarter efter 28 och 90 dagar. Sökresultaten kan förändras av andra orsaker, så uppföljningen blir observation och inte ett rent experiment.

Återställning kan göras med revert av kandidatens commit genom det vanliga GitHub/Vercel-flödet. Ingen publicering eller push får göras innan användaren godkänt kandidaten.
