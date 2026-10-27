# AuDHD-klustret – avgränsad innehållsrelease 2026-10-27

## Underlag och omfattning

Underlag: `audhd-klusteranalys-2026-10-27.md`, Work-analys av Search Console för 25 juli–24 oktober 2026. Analysens trafikuppgifter är en historisk baslinje, inte nya mätningar i denna implementation.

| Prioritet | Ny URL | Egen huvudsaklig fråga |
| --- | --- | --- |
| P0 | `/audhd-utredning-vuxna` | Vårdväg, utredning och egna förberedelser |
| P0 | `/audhd-i-vardagen` | Genomförbara rutiner och övergångar |
| P0 | `/audhd-och-relationer` | Överenskommelser, kommunikation och ansvar |
| P1 | `/audhd-pa-jobbet` | Uppdrag, prioritering, avbrott och arbetsmiljö |
| P1 | `/audhd-sensorisk-kanslighet` | Beskriva sinnesintryck och situationsbelastning |
| P1 | `/audhd-och-somn` | Kvällsövergång, sömnobservationer och vårdkontakt |
| P2 | `/audhd-och-exekutiva-funktioner` | Från plan till handling, minnesstöd och avslut |
| P2 | `/audhd-och-aterhamtning` | Pauser och belastning före, under och efter krav |

Alla åtta är byggda enligt den aktuella beställningen. Det innebär inte att analysens rekommendation om stegvis produktionspublicering och GSC-uppföljning är uppfylld. En separat feature branch möjliggör granskning innan produktionsbeslut.

Inga befintliga artiklar, testflöden, slugs, redirects, betalningar eller kontofunktioner ändras. Artikelmallen `InformationGuide` och dess metadata-/schemalogik återanvänds utan ändringar. Varje ny artikel har egen title, description, self-canonical, OG-URL, index/follow, synlig FAQ med motsvarande schema, källor och kontextuella länkar. Primär CTA går till `/audhd-test/test`; `/audhd-test` används som informationslänk. Nya sidor länkar till hubben och relevanta syskonartiklar. Befintliga rankande sidor får inga nya länkar i denna release.

## Källkontroll och redaktionella gränser

Källor öppnade och kontrollerade 2026-10-27:

- [1177: Neuropsykiatrisk utredning](https://www.1177.se/undersokning-behandling/undersokningar-och-provtagning/psykiatriska-utredningar/neuropsykiatrisk-utredning/) – vårdkontakt, varierande omfattning, livshistoria och stöd efter bedömning.
- [Nationella vård- och insatsprogram: Adhd och autism](https://www.vardochinsats.se/adhd/om-tillstaandet/adhd-och-autism/) – samtidig förekomst och behov av individuellt stöd.
- [Socialstyrelsens riktlinjer](https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/nationella-riktlinjer/riktlinjer-och-utvarderingar/adhd-och-autism/) och [patientinformation](https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/nationella-riktlinjer/riktlinjer-och-utvarderingar/adhd-och-autism/om-riktlinjerna-for-patienter-och-brukare/) – tidiga insatser och stödvägar.
- [1177: Autism](https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/autism/) – variation och sinnesintryck.
- [1177: Hjälpmedel för kognitivt stöd](https://www.1177.se/undersokning-behandling/hjalpmedel/hjalpmedel-for-kognition-och-kommunikation/hjalpmedel-for-kognitivt-stod/) – tid, planering och arbetsterapeut.
- [Socialstyrelsens kunskapsunderlag, Bv47a](https://www.socialstyrelsen.se/contentassets/9477556cf0ce4c9e9ee8310a5f52b642/2024-3-8958-bilaga-kunskapsunderlag.pdf) – rekommendationen om kognitivt stöd för vuxna med ADHD och dess uttryckliga evidensbegränsning.
- [1177: Sömnsvårigheter](https://www.1177.se/liv--halsa/stresshantering-och-somn/somnsvarigheter/) och [Stress](https://www.1177.se/liv--halsa/stresshantering-och-somn/stress/) – sömn, belastning och när vård kan behövas.

Praktiska exempel är egen redaktionell tillämpning, inte medicinska behandlingsprogram. Inga prevalenstal, diagnoslöften, läkemedelsdoser, priser, väntetider eller arbetsrättsliga garantier anges. Ingen namngiven klinisk sakkunnig har granskat texterna; detta framgår på varje sida. Organisationsförfattare används enligt befintlig mall, utan påhittade meriter.

## Teknisk kontroll

Livekontroll med HEAD och följda redirects 2026-10-27:

- `https://relationsvarning.se/autism-test`: 308 direkt till www, därefter 200.
- `https://relationsvarning.se/adhd-test`: 308 direkt till www, därefter 200.
- `https://relationsvarning.se/audhd-test`: 308 direkt till www, därefter 200.
- `https://www.relationsvarning.se/audhd`: 200.

Detta reproducerar ingen loop i de kontrollerade exemplen. Det bevisar inte att samtliga 19 historiska GSC-fel är lösta. Deras exakta URL-lista och de 33 upptäckta men inte indexerade sidorna har inte granskats på nytt i Search Console här. Ingen redirect- eller robots-konfiguration ändras.

## Verifiering och produktionsuppföljning

Kör `npm run build` (inklusive projektets `next-sitemap`), därefter `node --test scripts/audhd-cluster.test.cjs`. Testet läser de verkliga prerenderade artiklarna och kontrollerar metadata, canonical, H1, indexering, synliga källor, fungerande interna länkmål, faktisk teststart, FAQ/schema och sitemap. Relevanta befintliga regressionskontroller: `node proxy.test.cjs`, `node proxy.auth.test.cjs` och `node --test app/audhd-test/test/model.test.cjs`. Kör ESLint för tillagda filer samt `git diff --check`.

Resultat 2026-10-27: produktionsbygge inklusive TypeScript och sitemap godkänt (152 genererade sidor); 9/9 klusterkontroller och samtliga tre ovanstående befintliga regressionskontroller godkända; ESLint och diffkontroll utan fel. Lokal HTTP-kontroll gav 200 utan redirect för alla åtta nya sidor samt `/audhd`, `/audhd-test`, `/audhd-kvinnor` och `/audhd-test/test`. Utredningsartikeln granskades visuellt i webbläsaren och dess CTA öppnade fråga 1 av 48 på `/audhd-test/test`.

Sitemap-diffen innehåller endast de åtta nya artikeladresserna, utan borttagna befintliga adresser. Byggverktyget lade även till den redan befintliga `/audhd-metodik`, som saknades i den incheckade sitemap-versionen; den separata ändringen togs inte med i denna commit. Ursprunglig arbetsyta på `C:/src/relationsvarning` har inte ändrats; arbetet gjordes i en separat kopia från samma incheckade `main`-version.

Före produktion: välj publiceringstakt med hänsyn till analysens GSC-kö och kontrollera eventuell preview. Efter publicering: följ indexering och sökfrågor för nya URL:er samt `/audhd-test` och `/audhd` efter 7 och 21 dagar. Denna release skickar inga indexeringsbegäranden och gör ingen produktionsdeploy.
