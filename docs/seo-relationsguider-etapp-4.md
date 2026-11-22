# SEO Etapp 4 – relationsguider nära topp 3

Lokal kandidat från `e674971406062181cd6de00758c8ea7cea1c85ca` på `codex/seo-relationsguider-etapp-4`, i `C:\src\relationsvarning-seo-release-1`. Ingen push, merge till main eller publicering ingår.

## Fynd och avgränsning

Båda publicerade guider ger HTTP 200, har en H1, egen www-canonical och saknar noindex. Titlar, beskrivningar och H1 möter redan respektive sökintention och behålls. Det finns inget belägg för ett tekniskt indexeringshinder. Förbättringen gäller läsordning och konkretion; topp 3 kan inte garanteras.

Kontrollguidens användbara jämförelse mellan omtanke och kontroll låg efter flera fördjupningsavsnitt. Silent treatment-guiden hade en lång inledning och placerade ett konkret paussamtal först långt ned. Dess tredje varningstecken och ett stycke i pausavsnittet tolkade också motiv starkare än observationerna medger.

## Exakt ändrade avsnitt

### app/kontrollerande-relation/page.tsx

- Flyttar befintliga `Omtanke eller kontroll?` med oförändrade exempel om mobil, umgänge och ekonomi till efter introduktionen, före `Vad innebär kontrollerande beteende?`.
- Ersätter jämförelsens allmänna inledning med konkret skillnad mellan frivillig insyn, att kunna ändra sig, krav och reaktion på nej. Platsdelning beskrivs inte automatiskt som kontroll.
- Lägger till ett kort stycke som utgår från konkreta händelser och visar vägen till befintlig stödsida om läsaren är rädd. Uppmanar inte till att pröva partnerns reaktion.
- Uppdaterar `dateModified` i artikelunderlaget till det lokala ändringsdatumet 22 november 2026. Ursprungligt publiceringsdatum bevaras; detta är inte registrering av en produktionsrelease.
- Bevarar övrigt huvudinnehåll, samtliga rubriker, titel, beskrivning, canonical, bild och testlänkar. Ingen ny artikel eller nytt testmål.

### app/silent-treatment-relation/page.tsx

- Kortar och ersätter de två inledande styckena: definition på svenska först, därefter uttrycklig avgränsning mot stress, överväldigande känslor och återhämtning. Tystnad i sig visar inte avsikten.
- Ersätter den upprepande rutan `Kort sagt` med `Exempel och första steg` och placerar den först i artikelkroppen. Två tydligt illustrativa exempel skiljer ett uttryckligt krav på eftergift från en paus med återupptaget samtal.
- Flyttar befintliga `Ett konkret sätt att föreslå en paus` oförändrat från `Hur kan du bemöta silent treatment?` till den tidiga rutan. Säkerhetsvillkor och båda befintliga stödlänkar bevaras. De sju mer utförliga stegen ligger kvar i fördjupningen.
- Ger det befintliga pausavsnittet ankaret `paus-eller-tystnad` och länkar dit samt till befintliga `vad-gora`. Alla gamla ankare finns kvar.
- Ersätter varningstecken 3 med en observerbar sekvens: kontakt återupptas efter ursäkt/eftergift, sakfrågan förblir olöst. Det ersätter en gissning om vad personen vill åstadkomma.
- Ersätter ett stycke som lade ord i den tysta personens mun med ett förtydligande att svårighet att förklara en paus inte automatiskt är bestraffning. Samtal efteråt och återkommande krav är mer användbara hållpunkter.
- Behåller titel, H1, metabeskrivning, Open Graph, canonical, FAQ/schema, fördjupning, testlänk och övriga interna länkmål. Inga expertmeriter eller klinisk validering har lagts till.

### Dokumentation

- `docs/seo-relationsguider-etapp-4-baseline.json`: fryst föredata, perioder, filter, sidmetadata, query-/sidsiffror och databegränsningar.
- `docs/seo-relationsguider-etapp-4.md`: denna gransknings- och releasebeskrivning.

Endast dessa fyra filer ska ingå. Bygggenererade sitemap-/robotsfiler har återställts till basen; URL-mängden är oförändrad (142).

## Konkurrenter och sakunderlag

Underlaget från 22 november är manuell granskning av Ahrefs offentliga SERP-gränssnitt. Det är cachade tredjepartsobservationer med okänd enhet, inte verifierade aktuella svenska mobilplaceringar. Radnumren inkluderar sökfunktioner och får inte kallas organiska placeringar.

- `kontrollerande partner`: Tjej- och transjouren i Lund, rad 2; Roks, rad 5. Källa cirka en månad gammal. Relationsvarning rad 7 i denna observation.
- `silent treatment svenska`: Kognitiva Teamet, rad 2; Snacka Snyggt, rad 3. Källa 23 dagar gammal. Relationsvarning rad 10 i denna observation.

Landningssidorna lästes på nytt den 22 november. Lunds jour förklarar integritet och ger konkreta telefon-/platsdelningsexempel; Roks har lättöverskådliga varningssignaler. Kognitiva Teamet ger en direkt definition och praktisk vägledning; Snacka Snyggt ger konkreta samtalsexempel. Kandidaten gör befintligt eget material mer tillgängligt och kopierar inte deras text. Konkurrenters bestämda beskrivningar av motiv behandlas inte som bevis för en enskild partners avsikt.

Källor:

- https://www.tjejochtransjourenilund.se/kunskapsbank/kontrollerande-partner
- https://roks.se/om-vald/tidiga-tecken-pa-vald
- https://kognitivateamet.se/artiklar/silent-treatment/
- https://snackasnyggt.se/blog/konsten-att-tackla-silent-treatment/
- https://www.gottman.com/blog/the-four-horsemen-stonewalling/ – kompletterande förstahandsinformation om känslomässig överbelastning och behov av paus. Stonewalling och avsiktlig bestraffning behandlas inte som identiska begrepp.

Ingen ny medicinsk diagnos, prevalensuppgift eller behandlingsutfästelse tillkommer. Ingen klinisk sakkunniggranskning påstås.

## Fryst GSC-baslinje

Insamlad 22 november 18:35:10 UTC. 28 dagar: 24 oktober–20 november. 90 dagar: 23 augusti–20 november. Underlag: befintligt `gsc-expanded.json`; ingen ny API-import eller betaltjänst används.

Tabellen avser sökfråga + avsedd guidesida, alla enheter, 28 dagar:

| Sökfras | Klick | Visningar | CTR | Genomsnittsposition |
| --- | ---: | ---: | ---: | ---: |
| kontrollerande partner | 6 | 116 | 5,17 % | 4,00 |
| kontrollerande beteende | 6 | 48 | 12,50 % | 3,71 |
| silent treatment svenska | 4 | 243 | 1,65 % | 5,73 |
| silent treatment i förhållande | 5 | 59 | 8,47 % | 4,85 |

Sverige/mobil för samma fråga + sida: 3/104/2,88 %/4,05; 4/33/12,12 %/4,24; 4/208/1,92 %/5,81; 5/55/9,09 %/4,65 i samma ordning. 90-dagarsdata, sidtotaler och hela webbplatsens sökfrasstatistik finns separat i JSON-filen.

Siffrorna skiljer sig delvis från uppdragets avrundade värden. Exempelvis har `kontrollerande beteende` position 7,20 i hela webbplatsens sökfrasrapport men 3,71 för den avsedda guidesidan. Flera landningssidor och olika aggregering/filter gör rapporterna olika; tabellerna får inte blandas. GSC-position är ett exponeringsvägt genomsnitt, inte en stabil daglig placering. Saknade rader är inte bevis på noll efterfrågan. Data slutar 20 november och visar ännu ingen effekt av denna opublicerade kandidat.

JYCKEN ska följa klick, visningar, CTR och exponeringsvägd position efter 7/28/90 dagar, både alla enheter och Sverige/mobil, samt query-/URL-fördelning. Åtgärder registreras som planerade lokalt utan publiceringsdatum. Faktisk releasecommit och publiceringstid ska registreras först vid godkänt, verifierat produktionssläpp.

## Verifiering

- Produktionsbuild `npm run build -- --webpack`: godkänd, inklusive TypeScript, 161 genererade sidor och sitemapgenerering. Befintliga länkade beroenden kräver Webpack i arbetskopian. Endast lokala juridiska byggfixturer användes; inga produktionsnycklar.
- ESLint på de två ändrade sidfilerna: godkänd.
- Sju befintliga regressionstestprogram: stage3 parity/flow/http-ui samt stage6 parity/flow/http-ui/safety, avsedda lokala inställningen `ACCOUNT_PORTAL_ENABLED=true`. Kontrollerar bland annat huvudrelationstestet, narcissism- och partnertest, frysta frågor, beräkningar/rapporter samt syntetiska betalnings- och säkerhetsfall. Samtliga godkända.
- Renderad lokal produktionsbuild: båda guider HTTP 200, en H1, oförändrade titlar/beskrivningar/canonical/indexeringsdirektiv. Alla tidigare interna länktexter och mål kvar; 27 unika interna länkmål HTTP 200. Alla lokala ankare finns. Giltig JSON-LD och oförändrad FAQ/schema-paritet.
- Mobil 390x844 och desktop 1440x900: båda guider visuellt granskade; ingen horisontell överströmning. Ny ankarlänk når pausavsnittet i båda storlekarna. Relationstestets CTA öppnar `/test`, fråga 1 av 42, på desktop och mobil. Inga testsvar eller riktiga köp utfördes.
- Inga testfiler, modeller, priser, betalningsflöden, API:er, gemensamma komponenter eller andra SEO-sidor ändrade. Sitemapens URL-mängd bevarad. Diffkontroll godkänd.

Före-/efter-HTML, renderad metadata, länkkontroll, skärmbilder och mer komplett föredata finns i `C:\Users\hamma\Documents\Codex\2026-11-07\referenced-chatgpt-conversation-this-is-an\work\relationsguider-etapp-4`.

## Risker och nästa releasekontroll

Rankinglyft och stabil topp 3 är hypoteser att mäta, inte verifierade resultat. Förändrad disposition kan påverka vilka textutdrag Google visar och hur många som når CTA. Kontrollguidens befintliga CTA kommer längre ned när jämförelsen lyfts upp; följ därför befintliga teststarter tillsammans med trafiken. Ingen ny spårning införs.

Före release: kontrollera aktuell GitHub-main och aktiv Vercel-produktion mot basen. Avbryt för granskning om de ändrats. Kandidaten ska endast omfatta de fyra ovan angivna filerna. Efter separat godkännande kan fast-forward göras om main fortfarande är basen. Verifiera rätt Vercel-commit, båda sidor, metadata/canonical, interna länkar och teststart, och registrera därefter verklig publiceringstid i JYCKEN. Revert av kandidatcommit via normalt flöde kan återställa ändringarna utan force-push. Ingen särskild manuell Search Console-åtgärd behövs för att få befintliga URL att fungera; återcrawl/indexering styrs av Google.
