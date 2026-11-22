# Anknytningsklustret – lokal kandidat 2026-11-22

Gren: `codex/seo-anknytning-etapp-1`. Utgångspunkt: `d9524f9cee8af4c9579ffcf3270347bd7f9ab6a7`, samma commit som fjärrgrenens main vid kontrollen. Befintlig separat arbetskopia: `C:\src\relationsvarning-seo-release-1`. Ingen publicering eller push har gjorts.

## Underlag och verifierade fynd

Underlaget är JYCKENs inventering och URL-inspektioner från 22 november, kompletterat med en ny hämtning av den publicerade HTML-koden för klustrets sju URL:er, robots och sitemap. Tidigare GSC-inspektioner är historiska observationer; ingen ny indexeringsbegäran har skickats.

- Alla sju URL:er svarade HTTP 200. Huvudguide, testlandning och fyra stödguider hade egen canonical utan noindex.
- Huvudguiden länkade redan till alla fyra stödguider med vanliga serverrenderade HTML-länkar. Stödguiderna länkade tillbaka till huvudguiden. Därför har inget fel med JavaScript-beroende upptäckt kunnat styrkas.
- De sex indexerbara URL:erna finns i sitemap och är tillåtna i robots. Testflödet undantas redan av sitemapkonfigurationen.
- Ett konkret strukturproblem var att testlandningens titel och H1 beskrev en allmän faktaguide, liksom huvudguiden. Huvudguiden och stödguiderna saknade länkar till testlandningen; deras testknappar gick direkt till testflödet. Testlandningen saknade länkar till stödguiderna.
- Ingen verifierad teknisk grundorsak till de tre stödguidernas uteblivna indexering har hittats. Indexeringsstatus ensam styrker inte att innehåll behöver skrivas om. Befintligt guideinnehåll och källor har bevarats.

Viktigt befintligt förhållande: `/anknytningstest/test` har redan i publicerad HTML `noindex, follow` och canonical till `/anknytningstest`. Den äldre GSC-observationen om ett indexerat testflöde, med senaste crawl i september, motsvarar alltså inte dagens HTML-direktiv. Flödets layout, metadata, URL och funktion har lämnats oförändrade. När Google behandlar befintliga direktiv kan trafik till flödes-URL:en påverkas även utan denna kandidat.

## Exakt ändringsomfång

1. `app/anknytningstest/page.tsx`: titel, beskrivning, H1 och introduktion förtydligar testintentionen. Metodpanelen förklarar 30 frågor och de två befintliga dimensionerna. Fyra kontextuella länkar till stödguiderna tillkommer. Uppgifter om frågor, valfri registrering, gratis indikation och full analys för 39 kr har kontrollerats mot befintlig testkod. Pristext och begränsningar om klinisk validering har bevarats.
2. `app/anknytning/page.tsx`: första testknappen länkar till testlandningen med texten ”Läs om anknytningstestet”. Direkt teststart längst ned finns kvar.
3. `app/anknytning/angslig-anknytning/page.tsx`: samma avgränsade ändring av första testknappen.
4. `app/anknytning/undvikande-anknytning/page.tsx`: samma avgränsade ändring av första testknappen.
5. `app/anknytning/desorganiserad-anknytning/page.tsx`: samma avgränsade ändring av första testknappen.
6. `app/anknytning/trygg-anknytning/page.tsx`: samma avgränsade ändring av första testknappen.

Inga nya medicinska effektpåståenden, meriter, sidor eller omdirigeringar. Ingen ändring av testfrågor, poäng, betalningar, Stripe eller andra testflöden. Genererade sitemapfiler ingår inte i kandidaten.

## Genomförd verifiering

- `npm run build -- --webpack`: godkänd, inklusive TypeScript och generering av 160 sidor. Bygget använde lokala fixturvärden för obligatoriska juridiska miljöfält, inga produktionsnycklar. Webpack används eftersom arbetskopians befintliga beroendekatalog är en länk till en annan lokal katalog.
- `npx eslint app/anknytning app/anknytningstest/page.tsx`: godkänd.
- `ACCOUNT_PORTAL_ENABLED=true node --test app/_lib/testAccounts/stage5-parity.test.cjs app/_lib/testAccounts/stage5-flow.test.cjs app/_lib/testAccounts/stage5-http-ui.test.cjs`: tre godkända testprogram. Bland annat 50 838 poäng-/profilkombinationer och 2 263 rapporter för anknytning, medberoende och gaslighting samt syntetiska köp-/återöppningskontroller. Första försöket utan testinställningen avvisades av projektets befintliga kontospärr; omkörning med avsedd lokal inställning godkändes.
- Renderad lokal HTML: sju sidor och 20 unika interna länkmål verifierade. HTTP 200, canonical, robots, beskrivning och en H1 per sida kontrollerade. Samtliga tidigare interna länkmål finns kvar. Rubrikstrukturen i huvud- och stödguiderna är bevarad. Den nya testlandningen länkar till alla fyra stödguider.
- Webbläsare: testlandning på mobil (390 px) och desktop (1440 px), huvudguide på desktop och ängslig stödguide på mobil visuellt granskade. Ingen horisontell överströmning observerades i de kontrollerade vyerna. Navigation stödguide → testlandning → teststart kontrollerad; fråga 1 av 30 visas. Ingen betalning genomfördes.

Före-HTML, metadata och länkar samt efterkontroll finns i den lokala granskningsmappen `C:\Users\hamma\Documents\Codex\2026-11-07\referenced-chatgpt-conversation-this-is-an\work\anknytning-etapp-1` (`before-live.json`, sju HTML-filer, `after-local.json`).

## Risk, uppföljning och manuellt arbete

Indexering eller rankingförbättring kan inte garanteras. Den första testknappen innebär ett extra steg via landningen; följ teststarter och konvertering efter eventuell publicering. Direktstart längst ned och befintliga externa ingångar till flödet finns kvar. Mät klustrets sammanlagda trafik samt landning och flöde separat för att fånga effekten av flödets befintliga indexeringsdirektiv.

Efter godkänd publicering: verifiera liveversionerna i GSC för ängslig, undvikande och desorganiserad guide och begär indexering en gång per URL. Befintlig korrekt sitemap behöver inte ersättas. Kontrollera vald canonical och indexeringsstatus efter 7–14 dagar och följ klick, exponeringar, CTR och position efter 28 dagar. Fortsatt utebliven indexering kräver färska GSC-observationer innan fler åtgärder mot innehåll eller teknik föreslås.

Ändringen kan återställas genom att återställa kandidatens commit i ett framtida godkänt släpp. Den lokala kandidaten innehåller sex sidfiler och denna rapport.
