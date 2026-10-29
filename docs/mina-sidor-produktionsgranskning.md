# Mina sidor fas 2 – produktionsgranskning

**Senaste lokala teknikleverans:** se `mina-sidor-teknisk-driftberedskap.md` för implementerat externt raderingsregister, generations-/registerbindning, restore-batcher, driftläge, monitorpings och uppdaterad publiceringsordning. Ingen produktionsmigrering har gjorts. Tidigare uppgifter nedan om antal nya tabeller och tidigare tvådagarsmarginal är historik från första granskningen; aktuell lokal migrering är utökad.

Datum: 2026-10-26, Europe/Stockholm. Arbetsrot: `C:\src\relationsvarning`.

**Senare driftkontroll samma datum:** se `docs/mina-sidor-driftbeslut.md`. Där har Vercel-planen nu verifierats som Hobby, befintligt Cron som aktiverat och produktionsvariablernas närvaro kontrollerats utan att värden visats. Kostnadsförslag, extern raderingsjournal och integritetsbeslut återfinns där. Granskningen nedan beskriver läget före denna komplettering där Vercel anges som okontrollerat.

**Publicering är inte godkänd ännu.** Inga migreringar, betalningar, kundrader eller produktionsinställningar har ändrats. Inget har stagats, committats eller pushats.

## 1. Faktiskt produktionsschema

Granskningen gjordes i Supabase Dashboard, organisation **Relationsvarning**, projekt **relationsvarning-production**, projektref `ynrbwfguwjjztdfdpnce`, huvudgren `main` markerad PRODUCTION, region eu-west-1. Projektet använder Free-planen. Projektets URL är `https://ynrbwfguwjjztdfdpnce.supabase.co`.

Metod: tabellernas strukturvyer, RLS-, index- och backupvyer samt rena SELECT-frågor mot PostgreSQL:s systemkataloger. Inga testsvar, Auth-identiteter, betalningsrader eller kunduppgifter lästes. SQL-frågorna innehöll ingen DDL/DML. Dashboardens anslutning är administrativ; detta är inte bevis för en separat roll med enbart SELECT-rättigheter. Alla utförda databasoperationer var läsningar.

### Verifierat i produktion

| Objekt | Faktiskt fynd | Betydelse för fas 2 |
| --- | --- | --- |
| `auth.users.id` | UUID och primärnyckel | Typen matchar den nya ägar-FK:n. |
| `audhd_checkout_attempts` | 20 kolumner, UUID-id, krypteringsfält, browser-secret-hash, session/PaymentIntent, paid/access/expiry/revoked-tider | Alla beroenden för befintlig checkout-restore finns. Tre GA4-kolumner finns också. |
| `audhd_recovery_grants` | 11 kolumner, UUID-id, token-hash, session/PaymentIntent/Price, product, redeemed/revoked/expiry | Beroenden för v2-innehavsbevis finns. |
| `stripe_payments` | 12 kolumner, betalningsmetadata, inget kontoägarskap eller testsvar | Används inte som ensam analysbehörighet. |
| Övriga public-tabeller | `stripe_payment_line_items`, `stripe_webhook_events`, `ga4_purchase_deliveries` | Ska lämnas orörda. Totalt sex public-tabeller. |
| RLS | Aktiverat på samtliga sex public-tabeller, inga policies | Klientroller får inte läsa rader via en RLS-policy. |
| Nya kontotabeller | Inte skapade | Förväntat före migration. |
| Namnkonflikter | Samtliga nio planerade tabell-/indexnamn saknas | Ingen kollision identifierad. Kontrollera igen om andra arbeten driftsätts före oss. |
| Migreringshistorik | `supabase_migrations.schema_migrations` saknas | Dashboardens “No migrations” betyder inte att verksamhetstabellerna saknas. Kör inte alla lokala migrationsfiler blint. |
| Backup | Dashboard: “Free Plan does not include project backups” | Betald backup/PITR eller dokumenterad egen backup måste beslutas och återställning prövas före drift. Ingen plan har ändrats. |

Checkout-tabellen har PK på id, unika index på browser-hash, checkout-reference, session och PaymentIntent samt expiry-index och partiellt access-index för betalda, ej återkallade försök. Recovery har PK på id, unika token-/sessionindex, expiry-index för inlösta aktiva grants och partiellt PaymentIntent-index för ej återkallade grants. Dessa stöder kontokopplingens id-/sessionbaserade läsningar. Inga ytterligare index behövs i de gamla tabellerna för fas 2:s nuvarande frågor.

Systemkatalogens checkvillkor matchar förväntningarna om report-version, produkt, betalningsreferenser och giltighetstider. Inga användardefinierade triggers hittades på public-tabellerna. Standard-ACL för nya tabeller skapade av postgres/supabase_admin ger bred åtkomst till anon/authenticated/service_role. Därför är den nya migreringens uttryckliga REVOKE från PUBLIC/anon/authenticated nödvändig; RLS ensam är inte hela behörighetsmodellen. Den lokala PostgreSQL-testen återskapar nu dessa breda standardgrants och verifierar att de nya tabellerna ändå saknar klienträttigheter, inklusive TRUNCATE.

**Befintlig behörighetsrisk:** katalogen visar breda tabellrättigheter för `anon` och `authenticated` på checkout, recovery och betalningsloggen, inklusive TRUNCATE. RLS utan policies stoppar vanlig radåtkomst; det ersätter inte borttagning av onödiga rättigheter, och TRUNCATE omfattas inte av RLS. Detta är inte bevis för att den publika Data API:n kan köra TRUNCATE. Rekommendation: separat granskad åtstramning för servertabeller, kontroll av RPC/security-definer-funktioner och regressionstest. Ändra inte dessa produktionsgrants utan särskilt godkännande. Nya kontotabeller återkallar klientrollernas rättigheter explicit.

Kompletterande katalogkontroll: anon/authenticated kan inte logga in direkt, är inte superuser, saknar RLS-bypass och saknar CREATE i public. Inga funktioner hittades i public-schemat. Ingen aktuell publik RPC-väg för att utnyttja TRUNCATE-rätten identifierades; rekommendationen gäller minsta privilegium och framtida exponering, inte en påvisad dataläcka. service_role har förväntad RLS-bypass och måste hållas på servern.

### Återstående identitetskontroll av deployment

Bekräfta i Vercel, utan att visa nyckelvärden, att `NEXT_PUBLIC_SUPABASE_URL` pekar på projektet ovan och att serverns `DATABASE_URL` avser samma projekt. Projektets namn och innehåll stämmer, men inga Vercel-secrets har lästs eller hämtats. Miljöblandning mellan Auth och databas får inte godkännas.

Kontrollera även närvaro och format utan att skriva ut värden: Supabase public key för rätt projekt, `AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY` (32 byte base64url), befintliga checkout-/recovery-signaturhemligheter, `STRIPE_SECRET_KEY` med nödvändig läsrätt till Checkout/line items/PaymentIntent/Charge/disputes, `STRIPE_PAYMENT_PRODUCT_MAP_JSON` med kvarvarande historiska AuDHD Price-ID:n, `AUDHD_CHECKOUT_PRICE_ID` och `CRON_SECRET`. Ändra inte befintliga värden för att klara granskningen. Krypteringsnyckeln får inte ha `NEXT_PUBLIC_`-prefix. En ny begränsad läsnyckel för Stripe eller ny CA-konfiguration skulle vara en separat godkänd driftsändring.

## 2. Köp, ägarskap och Stripe

- Supabase `getUser()` verifierar sessionen. Servern kräver bekräftad mejladress och icke-anonym användare; UUID hämtas från serverns session.
- **Samma mejladress räcker inte.** Ingen databasfråga kopplar köp via mejl. Ett verifierat konto behöver dessutom signerad checkout-cookie med browser-secret och aktiv DB-post, alternativt signerad betalningsbunden v2-cookie och aktiv recovery-grant. Legacy v1-cookie ger inte ny kontobehörighet.
- Kunden ser kontots mejladress och måste markera en omarkerad ruta. UI och POST verifierar rätt samtyckesversion och samma betalningsfingerprint.
- Sessionens unika index och transaktionslås gör att ett redan ägt köp inte flyttas till ett annat konto. Ett manipulerat användar-ID eller en mejladress i formuläret ignoreras.
- Stripe kontrolleras vid koppling och varje återöppning: live-mode, complete/paid, payment-mode, rätt AuDHD Price via befintlig katalog inklusive historiska Prices, exakt en produkt/antal ett, SEK och positivt belopp, succeeded PaymentIntent, mottaget belopp samt betalt och captured charge. Delåterbetalning, hel återbetalning och historisk tvist nekar åtkomst. Stripe-fel nekar tillfälligt utan att radera analysen.
- Permanent lokal återkallelse finns på köpposten. Refund/tvist upptäcks vid återöppning och raderar då kontokopian; befintlig webhook skrivs inte om. Köpkortets status kan därför släpa efter tills analysen öppnas. Ingen proaktiv Stripe-synk påstås vara implementerad.
- Den återöppnade analysen kommer från kontots krypterade kopia och kräver inte att ursprunglig sjudagarslagring finns kvar.

**Kvarvarande risk:** en giltig stulen eller delad recovery-länk/cookie är ett innehavsbevis. Den som först kopplar ett ännu oägt köp kan låsa det till sitt verifierade konto. Det är ingen mejlbaserad utlämning, men support måste ha en dokumenterad process för felkoppling utan att rutinmässigt lämna ut analyser. Två konton med samma inkorg kan inte få varandras redan kopplade köp genom adressmatchning.

## 3. Kryptering och lagring

AES-256-GCM återanvänds från gästflödet: slumpmässig 12-byte IV, autentiseringstagg och befintlig AAD. Den nya kontotabellen innehåller krypterat underlag; inga poäng eller profilsvar läggs i köphistoriken. Krypteringen är serverbaserad, inte end-to-end. En operatör som har både databas och nyckel kan dekryptera. Krypteringen binder inte ciphertext till konto-ID som separat AAD; skydd mot en skrivbehörig databasadministratör utlovas inte.

`AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY` måste bevaras säkert under kontokopiornas hela livslängd. Nuvarande format saknar key-id/keyring, så direkt nyckelbyte gör äldre kopior oläsbara. Ingen nyckel har ändrats. Före rotation behövs separat versionshantering, verifierad omkryptering och återställningsprov. Kontots databasanslutning använder nu `ssl: "verify-full"`; staging ska verifiera servercertifikatet med rätt endpoint/CA. Vid certifikatfel stoppas kontofunktionen; sänk inte verifieringen som snabb lösning. Äldre gästmoduler har sin befintliga TLS-konfiguration och ingår inte i denna ändring.

Migreringen sätter sista åtkomst till 12 kalendermånader minus **två dagar** och har CHECK-villkor som förbjuder längre lagring. Tvådagarsmarginalen ersätter den tidigare endagsmarginalen och ger plats för schemaläggningsförskjutning och ingripande vid larm. Återförsök förlänger inte en befintlig kontokopia. En ny aktiv sparning efter radering är en ny lagring med nytt samtyckestillfälle. Ändring av redan publicerad migrationsfil får inte ske senare; denna version är ännu inte publicerad eller tillämpad.

## 4. Rensning och larm

Den separata Cron-routen kör faktisk DELETE av utgångna krypterade analysrader, behåller köphistoriken och skriver en lyckad-körningstid i `account_analysis_cleanup_state` i samma SQL-transaktion. Även en lyckad körning med noll rader registreras. Vid fel returneras 503 och loggen `account_analysis_cleanup_failed`; inga personuppgifter loggas.

`vercel.json` föreslår `0 2 * * *` UTC. Det är kl. 03 svensk vintertid och kl. 04 sommartid. Befintligt gästrensningsjobb behålls separat. Vercels aktuella dokumentation tillåter två dagliga jobb även på Hobby, men faktisk plan, funktionsbudget, deployment och jobblista är inte kontrollerade i Vercel.

Hobby är begränsat till personligt/icke-kommersiellt bruk enligt Vercels villkor. Uppgiften om tekniskt antal Cron-jobb är inte en rekommendation att köra betaltjänsten på Hobby. Bekräfta lämplig kommersiell plan och kostnadsbeslut innan drift; ingen uppgradering görs inom granskningen.

Ny, **läsande** hälsokontroll: `GET /api/cron/account-analysis-cleanup/health` med `Authorization: Bearer <CRON_SECRET>` i header, aldrig URL. Den returnerar 503 om senaste lyckade rensning saknas/är äldre än 26 timmar eller analysunderlag varit utgånget i minst 24 timmar. Den lämnar endast samlad status, senaste lyckade körning och antal försenade rader. Den kör aldrig radering. Båda endpoints är no-store och hemlighetsskyddade.

Spar-API:t kontrollerar samma hälsa och nekar ny kontosparning före första lyckade rensningen eller vid försenad rensning. Detta påverkar inte gästköp, läsning av redan giltiga kontokopior eller användarens radering. Vid lansering måste första godkända rensningsanropet därför göras innan kunder kan spara.

**Måste driftsättas före kundlagring:** oberoende HTTP-monitor var 15:e minut mot health-routen, larm vid 401/403/503/timeout/oväntad redirect, och larm till en namngiven ansvarig vid fel i rensningsjobbet. Godkänn larmkanal och mottagare först; ingen tjänst har konfigurerats och inget meddelande har skickats. Ett larmtest ska visa både larm och återhämtning. Att övervaka endast själva DELETE-routen kan maskera en trasig schemaläggare och är inte acceptabelt. Vercel återförsöker inte automatiskt misslyckade Cron-körningar. Missad körning kräver larm och kontrollerat manuellt återförsök.

Två dagars marginal är inte en garanti vid långa driftavbrott. Incidentrutinen ska tilldela ansvar och rensa innan 12-månadersgränsen passeras; om den garantin inte kan bäras måste kundlöftet och teknisk lagringslösning omprövas innan lansering.

## 5. Backup, radering och GDPR

DELETE tar bort den aktiva raden, inte data i tidigare snapshots/WAL, repliker, exporter eller kundens nedladdade PDF. Projektets Free-plan visar att schemalagda projektbackuper inte ingår. Detta bevisar inte att leverantören saknar alla interna återställningskopior eller att ingen manuell export existerar.

Före publicering behövs beslut om:

1. Backupmetod, lagringsplats, kryptering, åtkomst, ansvarig och verifierad maximal retention för alla kopior.
2. Om löftet “högst 12 månader” gäller alla återställbara kopior måste aktiva kopior rensas tillräckligt tidigt för den verkliga backuphorisonten, eller annan godkänd raderingsmekanism användas. Nuvarande tvådagarsmarginal täcker inte exempelvis sju dagars återställbara backuper. Detta är en blockerande policy-/driftfråga.
3. Ett separat skyddat register över genomförda raderingsbegäranden, med minsta möjliga data och beslutad retention, så att återställda data kan raderas igen. Ett register endast i samma återställda backup är otillräckligt.
4. Återställning i isolerad miljö; återapplicera raderingar och utgång innan trafik öppnas. Rensning av utgångna data ensam återställer inte tidiga manuella raderingar som skett efter backupen.
5. Praktisk hantering av konto-/fullständig raderingsbegäran och registerutdrag, inklusive separata gästkopior och Stripe-poster med annan rättslig grund. Inget automatiskt kontoexportflöde utlovas.

Självskattningssvar och analys kan vara hälsouppgifter. Ansvarig måste bedöma och dokumentera rättslig grund samt tillämpligt undantag för känsliga uppgifter; den lokala explicita samtyckesrutan är inte en juridisk garanti. Bedöm även behov av konsekvensbedömning, minderårigas användning, personuppgiftsbiträden/överföringar, drift- och åtkomstloggar samt incidentrapportering. Köphistorik kan indirekt avslöja intressen; besluta egen retention/ändamål för den. Uppgifter om juridisk person, organisationsnummer, postadress och verifierade leverantörs-/regionuppgifter saknas i detta granskningsunderlag.

### Konkreta textförslag att godkänna

**Samtyckesruta (lokalt implementerad):**

> Jag samtycker uttryckligen till att mina testsvar, som kan innehålla känsliga uppgifter om min hälsa, sparas krypterat på det här kontot för att jag ska kunna öppna min AuDHD-analys igen. Lagringen är frivillig och varar högst 12 månader. Jag kan återkalla samtycket genom att radera den sparade analysen på Mina sidor. Mitt köp kopplas också till kontot.

**Integritetsavsnitt:**

> Om du väljer att spara din AuDHD-analys behandlar vi dina testsvar och uppgifter som behövs för att återskapa analysen. De kan innehålla känsliga uppgifter om din hälsa. Syftet är att du ska kunna öppna analysen från ditt konto, även på en annan enhet. Du behöver inte spara analysen på ett konto för att köpa och använda resultatet.
>
> Underlaget lagras krypterat och separat från köphistoriken. Din sista tillgänglighetsdag visas på Mina sidor. Du kan radera kontots kopia tidigare och därmed återkalla samtycket till den lagringen. Köphistoriken innehåller inte testsvar, poäng eller profil. Gästlagring och lokala webbplatsdata har egna raderingsflöden.
>
> Radering ur den aktiva databasen skriver inte om tidigare säkerhetskopior. Säkerhetskopior omfattas av en separat beslutad lagringstid och åtkomstkontroll. Vid återställning ska tidigare raderingsbegäranden och utgångna lagringstider tillämpas innan uppgifterna används i tjänsten. Du kan kontakta support@relationsvarning.se för frågor om dina uppgifter, radering, registerutdrag och kontot.

Texten behöver kompletteras med **beslutad aktiv lagringstid/backuphorisont, köphistorikens retention, rättsliga grunder, ansvarig juridisk person, leverantörer/överföringar och rättighetsinformation inklusive klagomål till IMY**. Publicera inte enbart denna deltext som en komplett GDPR-policy. Den lokala integritetssidan är ett utkast tills dessa frågor är godkända.

## 6. Recovery-test och avgränsning

HEAD:s recovery-restore-test återställer `console.error` innan sista testfallet men försöker därefter verifiera en ny loggpost. Det är ett testfel, inte ett fel i recovery-routens svar. Arbetskopians redan pågående recovery-arbete innehåller en större annan testversion. Den filen får inte kopieras hel till leveransen.

Den isolerade releasekopian konstruerar testet från HEAD och flyttar endast återställningen av `console.error` till efter sista loggassertionen. Inga recovery-produktionsfiler ändras av denna rättelse. Denna minimala teständring kan senare väljas separat vid staging.

Exakt tillåten filförteckning finns i `scripts/account-phase2-files.json`. `node scripts/prepare-account-phase2.cjs` skapar en ny ignorerad kopia under `.next/`, utgår från fastställd HEAD, kopierar endast de listade filerna, rekonstruerar testfixen från HEAD och sparar SHA-256 per fil. Den staggar, committar, migrerar eller publicerar ingenting. Andra ändringar i recovery, webhook, bokleverans, bok-PDF och sitemaps följer inte med. Inget generellt `git add` eller `supabase db push` ska användas för denna leverans.

## 7. Verifieringsresultat

- Arbetskopian: samtliga 33 testprogram godkända. Efter sista sparspärren kördes HTTP- och PostgreSQL-testerna igen, godkända.
- Isolerad slutkopia från HEAD med endast manifestets 43 filer plus den minimala rekonstruerade recovery-testfixen: **33 av 33 testprogram godkända**. Där används det incheckade recovery-flödet med en timmes v2-cookie; arbetskopians separata ändring till 30 dagar ingår inte.
- Isolerat produktionsbygge efter sista kodändringen: **godkänt**, inklusive TypeScript och generering av 144 sidor. Båda nya rensnings-/health-routes och kontoroutes ingår. Byggvarningen om flera lockfiler beror på den lokala isolerade kopians placering under `.next/`.
- ESLint för leveransens TS/TSX/CJS-filer: noll fel, en befintlig varning för oanvänd `setRecoveryNotice` i gästsidan. Den separata recovery-logiken ändrades inte för att dölja varningen.
- PostgreSQL-testen använder PGlite i minnet med verklig migrering/SQL, produktionsliknande defaultgrants, två ägare, riktig befintlig kryptering, återöppning efter åtta dagar utan gästtabeller, refund/revocation, manuell radering, verklig expiry-DELETE, heartbeat, utebliven rensning och health-spärr. Stripe/Auth är testdubblar.
- Inget test använde skarpa Stripe-betalningar eller kunddata. Produktionsintegration, verklig mobilinloggning, TLS mot det riktiga server-DB-endpointet, larmleverans och backupåterställning har ännu inte testats. Detta är kvarvarande verifieringsvillkor.

## 8. Produktionsordning och godkännanden

1. Slutför läsgranskningen, bekräfta att Vercels Auth-/DB-anslutningar pekar hit och granska namnkonflikter, standardgrants och migrationshistorik. Läsning är redan godkänd.
2. Besluta backup-/raderingshorisont, återställningsrutin, köphistorikens retention, samtyckestext och fullständig integritetsinformation. **Kräver ägarens godkännande.**
3. Granska och besluta separat åtstramning av befintliga servertabellers grants; bekräfta att gäst/recovery använder serveranslutning och att ingen klient/RPC behöver dessa grants. **Produktionsändring kräver godkännande.**
4. Välj separat staging med syntetiska data och godkänd Stripe-teststrategi. Nuvarande verifierare nekar `cs_test`/testmode med avsikt; sänk inte produktionskontroller för att kunna testa. Genomför Auth, TLS, ägarskap på två konton, spara/öppna/radera, refund/tvist och gäst-/recovery-regressioner. **Ny extern miljö/inställningar eller kostnader kräver godkännande.**
5. Fastställ releasekopian och selektiv diff inklusive enbart den minimala recovery-testfixen. Kör alla lokala tester och produktionsbygge i isolerad kopia. Ingen push behövs för detta.
6. Besluta larmtjänst/mottagare, tillgänglig Vercel-budget, Cron-aktivering och säker nyckel-/CA-hantering. Konfigurera oberoende health-monitor och pröva fel/återhämtning i staging. **Produktionsinställningar, extern larmkanal och eventuella kostnader kräver godkännande.**
7. Vid ett separat publiceringsbeslut: kör endast den namngivna granskade migreringen, med kort lock-/statement-timeout och kontrollerad rollback vid fel. Kontrollera tabeller, RLS, borttagna klientgrants, FK och index via metadata. Kör inte övriga opublicerade migreringar. **Produktionsmigrering kräver uttryckligt godkännande.**
8. Selektiv commit/push enligt befintligt main-flöde först efter fastställt innehåll. **Kräver uttryckligt godkännande; inget PR-flöde har införts.** Verifiera att Vercel startar rätt deployment, att rensningsjobbet når endpointen utan redirect och att första körningen uppdaterar heartbeat.
9. Kontrollerat mobilprov med ägarens testkonto och en särskilt godkänd testbetalning: opt-in, återöppning, annat konto nekas, radering behåller köp, gäst/recovery fungerar, statistik skickar inga privata data. **Skarp betalning eller ändring av produktionskunddata kräver separat godkännande.**
10. Övervaka första dagliga rensningen. Vid problem: stoppa nya kontosparningar genom granskad rollback/deploymentåtgärd; behåll tabeller och oberoende rensning för redan sparade analyser. Backa inte genom att släppa tabeller eller återställa en äldre databas över produktionen. **Produktionsåtgärder kräver godkännande.** Vercel Instant Rollback uppdaterar inte automatiskt Cron-scheman, så kontrollera jobb och health-route separat.

## Källor kontrollerade vid granskningen

- [Vercel: hantering av Cron, fel, loggar, precision och rollback](https://vercel.com/docs/cron-jobs/manage-cron-jobs).
- [Vercel: Cron-begränsningar per plan](https://vercel.com/docs/cron-jobs/usage-and-pricing).
- [Vercel: planvillkor och kommersiell användning](https://vercel.com/docs/limits/fair-use-guidelines).
- [Supabase: backups och PITR](https://supabase.com/docs/guides/platform/backups).
- [Supabase: SSL och certifikatverifiering](https://supabase.com/docs/guides/platform/ssl-enforcement).
- [PostgreSQL: RLS omfattar inte TRUNCATE/REFERENCES](https://www.postgresql.org/docs/17/ddl-rowsecurity.html).
- [IMY: när känsliga personuppgifter får behandlas](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/introduktion-till-gdpr/personuppgifter/kansliga-personuppgifter/nar-far-ni-behandla-kansliga-personuppgifter/).
- [IMY: rätt till radering](https://www.imy.se/privatperson/dataskydd/dina-rattigheter/radering/).
