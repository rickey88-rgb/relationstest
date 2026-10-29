# Mina sidor, fas 2 – lokal implementation och publiceringskrav

**Senaste leverans:** `docs/mina-sidor-teknisk-driftberedskap.md` beskriver nu implementerat externt raderingsregister, skydd vid återställning och förberedd kostnadsfri larmning. Den aktuella lokala migreringen innehåller även generations-/registerbindning och DELETE-skydd. Äldre avsnitt om rensnings-CTE/tvådagarsmarginal och tidigare testantal nedan beskriver föregående version.

Rot: `C:\src\relationsvarning`. Ingen produktionsmigrering, produktionskonfiguration eller push ingår i denna leverans.

**Aktuell produktionsgranskning:** se `docs/mina-sidor-produktionsgranskning.md` (2026-10-26) och den exakta filförteckningen `scripts/account-phase2-files.json`. Granskningen lägger till två dagars raderingsmarginal, verifierad TLS, rensningsheartbeat/hälsokontroll och en isolerad minimal rättelse av det befintliga recovery-testet. Resultatavsnittet daterat 2026-10-25 nedan beskriver den tidigare körningen.

## Inventering och beslut

- Auth: befintlig Supabase `getUser()` verifierar sessionen. Endast verifierade, icke-anonyma mejlkonton får använda konto-API:t. Användar-ID hämtas alltid på servern.
- Betalningar: `stripe_payments` är en serverbaserad Stripe-logg utan kontoägarskap eller testsvar. Den är inte en behörighet till en känslig analys.
- AuDHD: befintliga `audhd_checkout_attempts` har AES-256-GCM-krypterade svar, en Stripe-session, ett webbläsarbundet hemligt värde och sju dagars lagring. `audhd_recovery_grants` binder v2-recovery till en bestämd betalning. Inget av dessa scheman har användarägarskap.
- Övriga tester har främst lokal webbläsarlagring. De migreras inte i denna fas.
- Böcker: befintlig R2-hämtning använder 60 sekunders signerade länkar. De publicerade bokcookies bevisar produktåtkomst men innehåller inte en unik betalning som kan knytas till ett konto. Pågående, ostagade bokleveransändringar hålls utanför fas 2.
- Produktionsschemat har nu läsgranskats i Supabase Dashboard. Se `docs/mina-sidor-produktionsgranskning.md` för aktuella fynd, behörighetsrisker och publiceringsvillkor. Inga produktionsmigreringar har körts.

## Kontokoppling och återöppning

1. Kunden öppnar sin befintliga betalda analys eller löser in en befintlig v2-recovery-länk.
2. Kunden loggar in och går till `/mina-sidor/koppla`. Servern kontrollerar signerad checkout-cookie + webbläsarhemlighet, alternativt signerad v2-cookie + aktiv inlöst recovery-grant.
3. Samma serverbaserade Stripe-kontroll/allowlist som recovery används. Kontoadaptern kräver även en enda betald produkt, ett betalt charge, frånvaro av återbetalningar och frånvaro av historiska tvister. En mejlmatchning, ett URL-ID eller `localStorage` ger ingen kontoåtkomst.
4. Kunden markerar en uttrycklig, omarkerad kryssruta och sparar. En fingerprint binder formuläret till samma köp som visades i förhandsvisningen; den ersätter aldrig innehavsbeviset.
5. Köpet låses atomiskt till högst ett konto. Upprepade försök flyttar inte ägarskap och förlänger inte lagringstiden.
6. Vid återöppning kontrolleras kontoägarskap innan Stripe och dekryptering. Ägarskap/utgång/radering läses om efter Stripe-kontrollen. Den egna krypterade kontokopian läses utan beroende till de ursprungliga sjudagarstabellerna.

Äldre köp kan kopplas via ett giltigt betalningsbundet v2-åtkomstbevis även om svaren har raderats. Då sparas endast köphistorik, med ett eget aktivt val. En sparad analys kräver dessutom kvarvarande krypterade svar. Redan raderade svar kan inte rekonstrueras från en Stripe-betalning. Gamla v1-cookies utan betalningsbindning godtas inte för att skapa ny kontoåtkomst.

## Lokal migrering

Förslag: `supabase/migrations/202610250001_account_audhd_purchases.sql`.

- `account_purchases`: ägare, produkt, serververifierade betalningsreferenser, köpdatum och status. Ingen profil, poäng eller svar finns här.
- `account_audhd_analyses`: separat krypterat underlag, rapportversion, samtyckesversion, sparningsdatum och sista tillgänglighetsdag.
- `account_analysis_cleanup_state`: lyckad-körningstid utan kunddata för oberoende övervakning.
- FK till `auth.users` raderar kontots poster när kontot raderas. Båda tabellerna har RLS och saknar browser/Data API-rättigheter.
- Tabellen behöver inte kopiera eller ändra Stripe-, gäst- eller recovery-tabellerna. Kopplingen skapas först efter kundens aktiva val.

## Lagring och automatisk radering

Sista tillgänglighetsdag sätts av databasen till 12 kalendermånader minus två dagar från sparningen. Den exakta dagen visas för kunden. Marginalen ger den dagliga fysiska rensningen möjlighet att radera innan taket 12 månader. En hälsokontroll stoppar ny kontosparning före första lyckade rensning eller vid utebliven rensning. Databasens CHECK-villkor förbjuder förlängning utöver denna gräns.

Den nya, separata Vercel-jobbet `/api/cron/account-analysis-cleanup` är föreslaget till `0 2 * * *` UTC och använder befintlig `CRON_SECRET`. Det kör en verklig `DELETE` av utgångna analysrader och markerar köphistorikens status i samma SQL-sats. Jobbet är idempotent. Ett fel ger HTTP 503 och logghändelsen `account_analysis_cleanup_failed`, inte en falsk lyckad rensning. Åtkomst stoppas vid utgång även före fysisk rensning.

Manuell radering kräver verifierad inloggning, samma-origin POST och bekräftelse. Den tar bort kontots analysrad direkt och behåller köpet. Ursprunglig gästlagring och webbläsardata har separata livscykler som förklaras i gränssnittet.

**Driftvillkor före publicering:** kontrollera att Vercel-planen tillåter båda dagliga jobben, att Cron faktiskt anropar rätt deployment med `CRON_SECRET`, och sätt larm på 503/utebliven daglig lyckad körning. En schemalagd radering kan inte garantera ett hårt tidslöfte under obeaktade driftavbrott. Backup-/PITR-kopior omfattas inte av appens DELETE och måste hanteras i en separat, godkänd lagrings- och återställningsrutin.

## Bibliotekets avgränsning

Biblioteket visar inga påhittade böcker och ger inga rättigheter utifrån mejladress eller produktcookie. Kundernas befintliga R2-länkar fungerar fortsatt. En säker, unik koppling mellan bokbetalning och konto återstår innan köpta omslag och kontobaserad nedladdning kan aktiveras. Fas 2:s migrering ger därför endast `audhd_test` rättighet att sparas.

## Säkerhet och integritet före produktionsgodkännande

- Nuvarande krypteringsnyckel återanvänds. Den måste förbli tillgänglig för äldre kontokopior under hela lagringstiden; nyckelrotation behöver en separat plan. Nyckeln ska aldrig vara publik eller ligga i klientkod.
- Betalningsbundet innehavsbevis + verifierat konto används vid första koppling. En stulen, fortfarande giltig recovery-cookie/länk är fortfarande en känslig åtkomsthandling; ingen ägarmatchning bygger enbart på mejl.
- Servern verifierar Stripe vid varje återöppning och nekar åtkomst vid tjänsteavbrott. Återbetalning och tvist raderar kontokopian när den upptäcks vid öppning och återkallar köpposten permanent. Originalwebhooken lämnas orörd. Historisk tvist kontrolleras även efter att gästtabellerna rensats.
- Köphistorik kan indirekt röja känsliga intressen. Dess ändamål, lagringstid och radering behöver också dokumenteras; kopian är inte en fullständig bokföringslösning.
- Informationssidan har ett lokalt textförslag för konto och lagring. Innan publicering behöver ansvarig granska information om ansvarig organisation, rättslig grund för behandling av känsliga uppgifter, samtycke/återkallelse, personuppgiftsbiträden, överföringar, kontoradering, export och backup-radering. Den tekniska kryssrutan avgör inte ensam dessa frågor.
- Kontosidor, autentiseringsvyer och deras händelser undantas från GA4; privata analys-ID:n tas bort ur efterföljande statistikreferenser. Inga testsvar läggs i loggar, mejl, URL-parametrar eller köphistorik.

## Verifiering

`npm run test:account` kör ny lokal PostgreSQL-migrering i PGlite (en tillfällig databas i minnet), riktig SQL med två testägare och befintlig kryptering. Dessutom körs HTTP-säkerhetskontroller, renderade portal-/rapportkomponenter och gäst-/recovery-/bokregressioner. Alla Stripe- och Auth-anrop är testdubblar; inga skarpa köp eller produktionsfrågor görs.

Testerna omfattar: nytt konto utan köp, rätt konto med köp, annat konto/ändrat ID, samtidiga kopplingsförsök, utloggat konto, aktivt val, förfalskade cookies, gammal obunden v1-cookie, återöppning efter åtta dagar utan gästtabeller, delåterbetalning, historisk tvist, otillgänglig Stripe/Auth/DB, tidig radering, utgång, faktisk SQL-radering, bibehållen köphistorik och blockerad browserroll.

Produktionsmigrering, verkliga Supabase-/Stripe-integrationer, schemalagd körning och faktisk mobilinloggning behöver verifieras i godkänd staging/produktion innan publiceringsgodkännande. Ingen push är godkänd för detta arbete.

### Resultat 2026-10-25

- Hela nuvarande arbetskopian: samtliga 32 testprogram godkända. Databastestet omfattar även radering som sker medan Stripe-kontrollen pågår.
- Ren kopia av incheckad HEAD med endast fas 2-filerna: produktionsbygge med webpack och TypeScript godkänt, 144 sidor genererade. Övrigt pågående recovery-/bokarbete ingick inte i bygget.
- Samma rena kopia: 31 av 32 testprogram godkända. Det redan incheckade `app/api/audhd-recovery/restore/route.test.cjs` återställer `console.error` före sin sista loggassertion och läser därför föregående loggpost. Både test och route verifierades identiska med HEAD. Detta befintliga testfel har inte rättats inom fas 2; arbetskopians separata recovery-arbete innehåller redan en annan testversion. Testfelet måste särskiljas vid en framtida selektiv publicering.
- Renderade mobilvyer har granskats vid 390 px med uttryckligen märkta fiktiva testdata. Detta ersätter inte riktig mobilinloggning med Supabase.

## Filer som hör till fas 2

Följande är granskningsunderlag för senare selektiv staging. Inget har stagats, committats eller pushats i denna fas.

- Databas: `supabase/migrations/202610250001_account_audhd_purchases.sql`.
- Server: `app/_lib/accountAnalysis.server.ts`, `accountAudhdPayment.server.ts`, `accountAudhdProof.server.ts`, `accountHttp.server.ts`, `accountPurchasesDb.server.ts`.
- API: `app/api/account/purchases/route.ts`, `app/api/account/purchases/claim/route.ts`, `app/api/account/purchases/[purchaseId]/analysis/delete/route.ts`, `app/api/cron/account-analysis-cleanup/route.ts`.
- Portal: `app/mina-sidor/page.tsx`, `page.module.css`, `layout.tsx`, `SavedAudhdReport.tsx`, `koppla/page.tsx`, `analyser/[purchaseId]/page.tsx`, `analyser/[purchaseId]/radera/page.tsx`.
- Gemensam rapport och frivillig sparlänk: `app/audhd-test/test/ReportView.tsx`, `app/audhd-test/test/page.tsx`, `app/audhd-test/test/print-report.test.cjs`. Betalnings- och recovery-logiken i testsidan ändras inte av fas 2.
- Integritet: `app/_analytics/analytics.ts`, `app/_analytics/AnalyticsProvider.tsx`, `app/integritet/page.tsx`.
- Nya tester: `app/_lib/accountPortal.postgres.test.cjs`, `accountAudhdProof.server.test.cjs`, `accountAudhdPayment.server.test.cjs`, `app/api/account/account-routes.test.cjs`, `app/api/cron/account-analysis-cleanup/route.test.cjs`, `app/mina-sidor/portal-ui.test.cjs`, `app/_analytics/account-privacy.test.cjs`.
- Verktyg och driftförslag: `scripts/test-account-phase2.cjs`, `package.json`, `package-lock.json`, `vercel.json`, `vercel-cron.test.cjs`, detta dokument. PGlite är enbart ett utvecklingsberoende.

Övriga redan pågående ändringar i checkout/recovery, Stripe-webhook, bokleverans, bok-PDF och genererade sitemaps ingår inte i fas 2. De har inte lagts in i den rena byggkopian. Dela inte en framtida commit utifrån hela arbetskopians statuslista.
