# SEO etapp 3 – narcissism, lokal releasekandidat

Granskad 22 november 2026. Gren: `codex/seo-narcissism-etapp-3`, från produktionsbasen `4786159bc7773e9c56dba5f83b4f703265cc0d0b`. GitHubs main kontrollerades vid start och efter verifiering och låg kvar på basen. Arbetskopia: `C:\src\relationsvarning-seo-release-1`. Ingen push, publicering, indexeringsbegäran eller ändring av produktionsdatabas har gjorts.

## Fynd och baslinje

JYCKENs insamling från 22 november används. Senaste 28 dagar: 24 oktober–20 november. Senaste 90 dagar: 23 augusti–20 november. Sidmåtten nedan avser alla enheter och länder.

| Sida | Klick 28 d | Exponeringar 28 d | CTR | Position | Klick 90 d | Exponeringar 90 d | Position 90 d |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/narcissism-sjalvtest` | 3 | 74 | 4,05 % | 14,57 | 5 | 99 | 17,71 |
| `/narcissist-i-en-relation` | 18 | 1 822 | 0,99 % | 8,07 | 20 | 1 943 | 9,11 |
| `/narcissist-i-en-relation/test` | 27 | 308 | 8,77 % | 9,57 | 38 | 436 | 13,53 |

Den exakta frågan `lever jag med en narcissist test` gav testflödet 16 klick på 135 exponeringar, CTR 11,85 % och position 5,85 på 28 dagar. Sverige/mobil: 15 klick, 118 exponeringar och position 5,90. Detta är befintlig trafik som ska skyddas.

För generiska `narcissist test` och `narcissism test` finns synlighet främst på partnerflödet, trots att självtestet handlar om den svarandes egna drag. Underlaget är glest och bevisar inte att sidorna aktivt tränger undan varandra. Det motiverar tydligare perspektiv. Frånvaro av rapporterade rader för vissa fraser, exempelvis generell `narcissism`, är inte ett mått på total sökvolym.

Konkreta brister:

- `/narcissism` gav HTTP 404; generell kunskapsintention saknade ett eget nav.
- Partnerflödets söktitel började med generiska ”Narcissist test”. Partnerguidens startknappar använde också den generiska benämningen.
- Självtestets titel antydde självtest men H1 och inledning förklarade inte lika tydligt skillnaden mot ett partnertest eller gränsen mot klinisk bedömning. FAQ-svaret på ”Är jag narcissist?” behövde en uttrycklig diagnostisk avgränsning.
- Relevanta guider saknade den nya huvudguiden som begreppsförklaring. Befintliga läs- och testvägar skulle samtidigt bevaras.

## Avsedd fördelning av sökintention

| URL | Primärt ärende | Signaler i kandidaten |
| --- | --- | --- |
| `/narcissism` | Förstå narcissism, drag, självbild, sårbarhet och diagnos | Kunskapstitel, förklarande H1, källor och hjälpvägar. Två tydligt märkta testvägar längre ned. |
| `/narcissism-sjalvtest` | Utforska mina egna narcissistiska drag | Titel ”Narcissist test – självtest om dina egna narcissistiska drag”; H1 ”Narcissismtest om dina egna drag”; inledning, FAQ och länktexter om mig själv. |
| `/narcissist-i-en-relation` | Förstå en partners beteenden och hitta partnertestet | Befintlig relationstitel och H1 behålls. Första stycket beskriver partnerperspektivet; båda testknapparna heter ”Starta partnertestet”. |
| `/narcissist-i-en-relation/test` | Genomföra det befintliga partnertestet | Titel ”Lever jag med en narcissist? Test med 30 frågor”. Befintlig H1 ”Lever du med en narcissist?” och hela frågeflödet bevaras. |

Fördelningen är en avsiktlig sidstruktur, inte ett löfte om Googles framtida val av URL. Inga omdirigeringar, nya noindex-direktiv eller canonicalbyten används för att tvinga fördelningen. Det redan indexerbara partnerflödet har fortsatt egen canonical och ligger kvar i sitemap. Självtestets flöde har fortsatt noindex och canonical till sin landning.

## Den färdiga huvudguiden och faktakontroll

Den nya sidan behandlar narcissism som drag, skillnaden mot narcissistiskt personlighetssyndrom, möjliga uttryck, självbild och bekräftelse, grandiositet/sårbarhet, det löst använda begreppet ”dold narcissism”, relationsperspektiv, vanliga missförstånd och när vårdkontakt kan vara relevant. Den skiljer narcissism från gaslighting och psykisk misshandel och visar vägen till stöd utan krav på test eller diagnos.

Källor som lästs och används i texten:

- [MSD Manual Professional: Narcissistic Personality Disorder](https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/narcissistic-personality-disorder-npd), uppdaterad januari 2026: klinisk avgränsning, självbild och beskrivna uttryck.
- [MedlinePlus: Narcissistic personality disorder](https://medlineplus.gov/ency/article/000934.htm): professionell bedömning och symtomens varaktighet/svårighetsgrad.
- [Krizan och Herlache, The Narcissism Spectrum Model, 2018](https://journals.sagepub.com/doi/10.1177/1088868316685018): begreppsmodell och variation i narcissistiska drag. Publicerat abstract har använts; inga nya egna forskningsresultat tillskrivs artikeln.
- [Pincus och Lukowitsky, 2010](https://www.annualreviews.org/content/journals/10.1146/annurev.clinpsy.121208.131215): publicerat abstract om grandiositet, sårbarhet och problemet med att behandla öppet/dolt som separata typer.
- [1177: Söka vård för psykiska besvär](https://www.1177.se/liv--halsa/psykisk-halsa/att-soka-stod-och-hjalp/soka-psykiatrisk-vard/): svenska kontaktvägar.

Källorna validerar inte sajtens egna tester. Klinisk sakkunniggranskning har inte utförts eller påståtts. Vardagsexemplet med kollegans beröm är uttryckligen en illustration, inte diagnostik. Formuleringarna om att testet inte kan avgöra diagnos, avsikt eller personlighet begränsar tolkningen av både själv- och partnerresultat. Testernas frågor, 30-frågorsomfattning, gratis återkoppling och valfri analys för 39 kr har kontrollerats mot befintlig kod.

## Exakta ändrade filer

1. `app/narcissism/page.tsx` – ny huvudguide, egen canonical, indexering tillåten, Open Graph och WebPage-JSON-LD. Ingen påhittad publiceringshistorik, expertmerit eller medicinsk validering i schema.
2. `app/narcissism-sjalvtest/page.tsx` – titel, beskrivning/Open Graph, H1, introduktion, två FAQ-svar, begrepps-/partnerlänkar och förklaring av procentnivåer. FAQ-schema och synlig text använder samma data. Befintliga startknappar och prisuppgifter bevaras.
3. `app/narcissist-i-en-relation/page.tsx` – beskrivning, första stycke, två knapptexter, en länk till huvudguiden och faktiskt ändringsdatum. Befintlig titel, H1, URL, startmål, generella relationstestlänkar och övrig långtext bevaras.
4. `app/narcissist-i-en-relation/test/layout.tsx` – endast söktitel, beskrivning och inledande text förtydligas. H1, canonical, indexerbarhet, navigation, styling och barnkomponenterna är oförändrade.
5. `app/manipulativ-partner/page.tsx` – en kontextuell huvudguidelänk i avsnittet om personlighetsbegrepp.
6. `app/gaslighting-relation/page.tsx` – en huvudguidelänk där skillnaden mellan beteende och diagnos redan förklaras.
7. `app/kontrollerande-relation/page.tsx` – en huvudguidelänk i avsnittet om kontroll och diagnos.
8. `app/love-bombing-relation/page.tsx` – en huvudguidelänk vid avgränsningen mellan uppvaktning, beteende och personlighet.
9. `app/psykisk-misshandel/page.tsx` – en huvudguidelänk i begreppsavsnittet som skiljer beteenden från medicinska diagnoser.
10. `app/skillnad-psykopat-narcissist/page.tsx` – en huvudguidelänk vid definitionen av narcissistiska drag; befintlig länk till partnerguiden bevaras.
11. `public/sitemap-0.xml` – den nya huvudguiden läggs till och artefakten stäms av mot faktisk produktion enligt nedan.
12. `docs/seo-narcissism-etapp-3.md` – denna rapport.

Sex relevanta äldre guider får vardera en kontextuell länk till navet. Självtestets och partnerguidens landningar länkar också tillbaka. Alla tidigare interna länkmål finns kvar.

## Sitemap: versionsfil kontra verklig produktion

Bascommitens versionshanterade sitemap hade 137 URL:er, medan den faktiskt publicerade sitemapen hade 141. Vercels senaste bygglogg bekräftar att `postbuild` kör `next-sitemap`. Fyra redan publicerade adresser saknades alltså i den versionshanterade artefakten: `/audhd-metodik`, `/logga-in`, `/nyhetsbrev/integritet` och `/nyhetsbrev`.

Kandidatens genererade sitemap har 142 URL:er. Jämförelsen mot dagens produktions-XML visar exakt en ny adress, `/narcissism`, och inga borttagningar. De fyra äldre adresserna tillkommer i Git-diffen för att bevara den redan publicerade uppsättningen. Ingen kod eller metadata för dem ändras. Sitemapkonfiguration och robotsfil ändras inte. `sitemap-comparison.json` sparar kontrollen.

## Testresultat

- Produktionsbuild `npm run build -- --webpack`: godkänd, inklusive TypeScript och 161 genererade sidor. Webpack behövs för arbetskopians befintliga länkade beroendekatalog. Juridiska byggfält fick lokala fixturvärden; inga produktionsnycklar användes.
- ESLint för de tio nya/ändrade sid- och layoutfilerna: godkänd.
- Sju befintliga regressionstestprogram: `stage3-{parity,flow,http-ui}.test.cjs` och `stage6-{parity,flow,http-ui,safety}.test.cjs`, samtliga under `app/_lib/testAccounts`, godkända med avsedd lokal inställning `ACCOUNT_PORTAL_ENABLED=true`. De omfattar bland annat 15 625 narcissismberäkningar, 511 fullständiga självtestrapporter samt frysta partnerfrågor/rapporter, syntetiska betalningar, samtycke, återöppning och säkerhetsfall. De gemensamma testerna kontrollerar även flera andra tester. Inga riktiga köp gjordes.
- Renderad lokal produktionsbuild: elva sidor och 43 unika interna länkmål med HTTP 200. En H1 per sida, canonical, robots, bevarade länkmål, giltig JSON-LD, synlig FAQ/schema-paritet, 39 kr och avsedd titelstruktur verifierade.
- Självtestets frågeflöde har oförändrad analyserad HTML mot livebaslinjen. Partnerflödets H1/rubriker, egen canonical och indexeringsdirektiv är bevarade.
- Huvudguiden ger samma analyserade metadata, innehåll och HTML-länkar med vanlig webbläsaridentitet och Googlebot Smartphone-identitet. Detta är ingen kontroll från Googles verkliga IP-adresser.
- Mobil 390 px och desktop 1440 px: huvudguide och båda landningar granskade. Båda testerna startar och visar fråga 1 av 30 i båda storlekarna. Ingen horisontell överströmning observerades. Inga testfrågor besvarades i webbläsaren och ingen betalning genomfördes.
- Diffkontroll bekräftar att frågor, modeller, rapporter, betalningar, API:er, analyskod och tidigare SEO-etapper är oförändrade. Partnerlayoutens begränsade text-/metadataändring är uttryckligen det enda ändrade testrelaterade kodomslaget.

Inga kvarstående testfel finns. Baslinje, före-/efter-HTML, 28-/90-dagarsdata, länkkontroll och skärmbilder ligger i `C:\Users\hamma\Documents\Codex\2026-11-07\referenced-chatgpt-conversation-this-is-an\work\narcissism-etapp-3`.

## Risker och releasevillkor

Partnerflödets titeländring kan påverka CTR och ranking även när adress och H1 bevaras. Följ i första hand `lever jag med en narcissist test` separat för detta flöde. Ny huvudguide och tydligare länktexter kan ändra vilken URL Google väljer för breda fraser; det behöver observeras, inte förutsättas vara löst i förväg. Innehållet ersätter ingen klinisk bedömning och testerna har fortfarande sina befintliga begränsningar.

Före eventuell release: kontrollera aktuell main och aktiv Vercel-produktion mot basen. Nyare produktionskod ska granskas och bevaras. Efter godkänd publicering ska exakt commit, nya sidans HTTP 200, indexerbarhet, samtliga canonical, båda teststarter och sitemapens URL-mängd verifieras. Begär därefter vid behov indexering av den nya huvudguiden, följ indexering/vald canonical efter sju dagar och trafikfördelning, CTR samt teststarter efter 28 och 90 dagar. Registrera faktiskt publiceringsdatum med den sparade baslinjen först när släppet är verifierat.

Återställning kan ske genom revert av kandidatens commit via vanligt GitHub/Vercel-flöde, med senare ändringar bevarade. Ingen push eller publicering före användarens uttryckliga godkännande.
