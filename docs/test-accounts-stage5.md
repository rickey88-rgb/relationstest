# Kontointegration etapp 5 – anknytning, medberoende och gaslighting

Endast lokalt arbete i `C:\src\relationsvarning`. Ingen produktionsmigrering, skarp betalning, kunddataändring, push eller publicering. Inga nya abonnemang eller externa tjänster.

## Genomförd separation och integration

Samtliga tre tester hade frågor, poängberäkning i useMemo, tolkningar och premiumrapport direkt i sina klientkomponenter. De använder varsin Payment Link, localStorage för index/svar och den gemensamma äldre betalnings-/återställningshooken. Inget av dem behöver en annan kontoarkitektur.

| Test | Produktnyckel | Slug / testadress | Flaggprefix | Fråge-/rapportversion | Pris |
|---|---|---|---|---|---|
| Anknytning | attachment_test | anknytningstest / /anknytningstest/test | TEST_ACCOUNTS_ATTACHMENT | anknytningstest-questions-v1 / anknytningstest-report-v1 | 39 SEK |
| Medberoende | codependency_test | medberoendetest / /medberoendetest/test | TEST_ACCOUNTS_CODEPENDENCY | medberoendetest-questions-v1 / medberoendetest-report-v1 | 39 SEK |
| Gaslighting | gaslighting_test | gaslightingtest / /gaslightingtest/test | TEST_ACCOUNTS_GASLIGHTING | gaslightingtest-questions-v1 / gaslightingtest-report-v1 | 39 SEK |

Frågor, konstanter och rena textfunktioner har flyttats utan innehållsändring till respektive `model.ts`. De ursprungliga useMemo-kropparna används direkt i `calculateScores` och `sortScores`; en tunn `calculate` samlar rapportens resultat. Klienten och serveradaptern använder samma funktioner. Befintlig tolerans för ofullständiga gästsvar under pågående test bevaras. Konto-adaptrarna kräver däremot exakt 30 fullständiga heltal 0–4, endast answers/questionVersion/reportVersion och exakta versionsvärden. Saknade, glesa, null-, sträng- och bråktalssvar nekas för kontosparning.

Anknytning behåller två avrundade dimensioner, sex delskalor, 50-gränsen för de fyra profilerna, nivåerna 25/50/75 och stöd för eventuell omvänd poängsättning. Medberoende behåller sitt sammanvägda index med en decimal; rapportens visade heltalsvärde och tolkningar använder fortfarande exakt originalets regler. Gaslighting behåller sitt separat avrundade heltalsindex. Dessa skillnader har inte standardiserats bort.

Separata adaptrar återanvänder den befintliga serverkärnan för testförsök, exakt Stripe-produkt/pris/betalningsstatus/återbetalning, browsersecret, bekräftad Auth, aktivt lagringssamtycke, kryptering med produkt-/versions-/ägar-/köpbindning, separat köphistorik, återöppning, radering och extern raderingsjournal. Samma tidsgränser, cron, hälsostatus, larm och restore-reconcile gäller. Inga parallella tabeller, betalningssystem eller nya migrationsfiler införs.

Alla nya checkout/save/read/import-flaggor är av som standard och oberoende per test. Tidigare gästköp, Payment Links, localStorage, betalningsåterkomst, omstart och återställningshook bevaras. Ingen historikimport, koppling med enbart mejladress eller lokal paid-flagga införs. Kontorapporter visas i samma Mina tester-bibliotek som tidigare produkter.

## Separat redovisning av tekniskt nödvändiga kontrolländringar

Premiumsektionerna har extraherats till delade rena `ReportView`-komponenter. Alla rapporttexter, delskalor, indikatorer, länkar, inline-stilar och innehållsordning behålls. Den ursprungliga gästsidan skickar sin befintliga restart-funktion, så dess knapp fungerar exakt som tidigare.

I de nya servervisade gäst-/kontorapporterna kan samma klientfunktion inte skickas från servern. Där är **endast kontrollen ”Gör om testet” en länk till det ursprungliga testet**, med samma text och stil. Den skriver inte över den sparade analysen. Ingen befintlig gästsidas användarupplevelse ändras av detta. Jämförelsetestet kräver exakt originalmarkup för den ursprungliga gästsidan och tillåter endast denna dokumenterade kontrollskillnad i de nya servervyerna.

En avgränsad feltext visas om den nya checkout-grenen misslyckas; tidigare checkout används fortsatt när flaggan är av, och ett fel i vald ny checkout leder aldrig tyst till en annan betalväg. paywallRef destruktureras på samma sätt som i övriga tester för att undvika ESLints ref-falsklarm; ref och spårningsfunktioner är desamma. Frågestilar, svarstiming, navigation och tidigare storage-/betalningseffekter är bevarade.

De befintliga effekternas avsiktliga synkronisering med extern localStorage och betalretur efter hydrering har ett riktat lintundantag, enligt samma mönster som autismtestet. Effektkropparna ändras inte för att tillfredsställa lintregeln; testerna kräver att de är identiska med originalet.

## Jämförelser och regressionsunderlag

Frysta originalfrågor, textfunktioner, useMemo-kroppar och premiumsektioner finns som separata testreferenser i `stage5-fixtures`. Version 1-material och ursprungliga funktioner/effekter kontrolleras mot dessa. Ingen riktig kunddata används.

- 15 625 delskalekombinationer per test, ytterligare 3 721 kombinationer av anknytningens två dimensioner samt samtliga 121 möjliga totalråpoäng för medberoende och gaslighting: totalt 50 838 poäng-/profil-/gränskombinationer.
- 743 kompletta anknytningsrapporter, 760 medberoenderapporter och 760 gaslightingrapporter: 2 263 fullständiga jämförelser av original, klient, server och kontovy.
- Täcker noll/max, blandade/extrema profiler, stabil rangordning vid lika poäng, delskalornas råpoäng 0–20, 25/50/75-nivåer, anknytningsgränser runt 50 och olika avrundning av sammanvägda index. Partiella gästsvar räknas likadant som tidigare medan serveradaptern nekar dem.
- Faktisk lokal SQL med simulerad Stripe/R2 återanvänds för köp, produktbindning, fel ägare, samtycke, återöppning utan ursprunglig gästkopia, återbetalning, utgång, radering, kvarvarande köphistorik och gammal-backupskydd.
- Den faktiska bibliotekskomponenten och gäst-/kontorapportvägarna testas för korrekta produktnamn, pris, adresser, aktivt samtycke, ägarkontroll och separata flaggor. Alla tidigare 60 testprogram ingår också; total leveranssvit 63 program.

Förbered en ren tillåten verifieringskopia med `node scripts/prepare-test-accounts-stage5.cjs`. Kör där `node scripts/test-test-accounts-stage5.cjs`, separat TypeScript med --noEmit --incremental false och `npm run build -- --webpack`. Inga riktiga betalningar eller externa Stripe/R2-anrop görs. Tidigare dokumenterade begränsningar kring PGlites advisory locks och verkliga produktionsanslutningar kvarstår.

## Isolering och filer

Exakt filförteckning och ursprungliga hashvärden finns i `scripts/test-accounts-stage5-files.json`. Förberedelseskriptet bygger HEAD + tidigare uttryckliga leveransmanifest + etapp 5:s allowlist och kontrollerar frysta beroenden. Andra pågående arbeten följer inte med. Arbetsstartens hashlista och verifieringsunderlag finns lokalt i ignorerade `.artifacts/test-accounts-stage5/`.

AuDHD-specifik implementation, tidigare testmodeller, recovery-serverkod, Stripe-webhook, verkliga miljöfiler, migrationsfiler, Vercel-konfiguration, package-filer och rotens sitemaps ändras inte. Den befintliga generella modellen, kryptot och lagringen byggs inte om.

## Återstående produktionsberoenden – kräver godkännande

1. Tidigare konto-/driftleveranser och den generella migreringen behöver vara godkända och på plats. Ingen ny migration, cronpost, monitor, krypteringsnyckel eller lagringsbucket behövs för denna etapp.
2. Verifiera tre korrekta aktiva engångspriser på 39 SEK (3900 öre), live mode. Lägg respektive Price ID i befintliga `attachment_test`, `codependency_test` och `gaslighting_test` i STRIPE_PAYMENT_PRODUCT_MAP_JSON och ange adaptervariablerna i env-exemplet. Bevara alla gamla produktmappningar och Payment Links.
3. Godkänn utökad integritetsinformation och frivilligt uttryckligt lagringssamtycke samt information om gäståtkomst före köp. Tidigare rättsliga/driftmässiga beslut kvarstår; relationstester kan innehålla känsliga uppgifter även om andra personer. Ingen juridisk garanti lämnas.
4. Verifiera verkliga tjänsteanslutningar, rätt betal-/returadresser, rensning/larm, ägarskap och mobil innan aktivering. Befintlig verifierare accepterar live mode; ingen skarp provbetalning eller extern testmodeadapter har införts här.
5. Aktivera en produkt åt gången: READ, SAVE och sist CHECKOUT efter godkänt prov. Import förblir avstängd. Vid problem stäng den produktens nya köp/sparningar men behåll fungerande läsning, radering, rensning, övervakning och tidigare kunders flöden. Återställ aldrig gamla data för att backa enbart kod utan föreskriven journal-reconcile.

## Resultat för lokal leverans

- Samtliga 63 testprogram passerade, inklusive de tidigare 60.
- Inga avvikelser i poäng, resultatnivåer, delskalor eller rapporttexter: 50 838 poäng-/profil-/gränskombinationer och 2 263 kompletta rapportfall. Endast den ovan redovisade omstartskontrollen skiljer i de nya servervyerna.
- Separat TypeScript-kontroll utan fel, liksom byggets typkontroll. Produktionsbygge med webpack och postbuild godkänt, 144 statiska sidor.
- ESLint för leveransens runtime-/test-/skriptkod: 0 fel, tre befintliga varningar för tracking-beroendet i de gamla engångseffekterna för betalningsåterkomst.
- 33 leveransfiler: 24 nya och 9 ändrade från arbetsstarten. Inga andra då befintliga filer ändrade, inget staged, ingen commit eller push och inga produktionsändringar.
- Lokala filhashar och verifieringsbevis sparas under ignorerade `.artifacts/test-accounts-stage5/`. Den tillfälliga verifieringskopian städas efter kontroll.
