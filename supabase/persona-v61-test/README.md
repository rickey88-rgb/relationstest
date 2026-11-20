# PERSONA V6.1 – beständig PostgreSQL/Supabase-lagring, etapp 3

Status: isolerad implementation och lokal verifiering. Ingen kundaktivering, molnanslutning, molnresurs, produktionsmigration, commit, push eller deployment.

## Miljöinventering

Projektrot C:/src/relationsvarning-github, branch codex/persona-stage1.

Lokal inventering av .env.local och processmiljön gjordes utan att skriva ut värden. Ingen relevant Supabase-/databasanslutning eller separat testprojektkonfiguration hittades. Supabase-, Docker- och psql-kommandon var inte tillgängliga via PATH.

supabase/config.toml anger project_id=relationsvarning-local och inställning för customer-tests-funktionen. Detta är inte bevis på en startad lokal Supabase eller ett tillgängligt molntestprojekt.

Slutsats: ingen separat Supabase-testmiljö kunde bekräftas här. Inga URL:er provades, inga riktiga Auth-anrop eller databasanslutningar gjordes mot molnet. Arbetet stannade vid implementation och helt lokala tester.

Befintliga mönster granskades:
- app/_lib/testAccounts/store.server.ts: parametriserad PostgreSQL, krypterad ciphertext och explicita ägarvillkor.
- app/_lib/testAccounts/directAuth.server.ts: serververifiering med Supabase Auth getUser; klientangivet användar-ID är inte identitet.
- app/_lib/accountDatabaseTls.server.ts: befintlig CA och verifiering av certifikatkedja/hostname.
- supabase/migrations/202610260001_test_accounts.sql: RLS och återkallade klienträttigheter.
- Etapp 1:s V6.1-format/frysta beräkning och etapp 2:s revisionskontroll.

Ingen av dessa befintliga filer ändrades.

## Implementerad lösning

### Serveradapter

app/_lib/testAccounts/personaV61Postgres.server.ts:
- Privat adapter med create, read och update.
- Verifierar identitet på servern vid varje operation.
- Använder samma versionsbundna V6.1-kuvert och AES-256-GCM som etapp 1.
- Binder även owner_id till krypteringens autentiserade kontext, utöver produkt, version och post-ID.
- Validerar schema, versioner, sparad kvalitet och rapportkontrollsumma vid läsning.
- Alla SQL-värden är parametriserade; ägarvillkor finns både i SQL och RLS.
- CAS med id, owner_id, förväntad revision och versionsidentiteter. Gamla revisioner får conflict.
- Saknad/främmande post, förlorad session och manipulerad data avvisas utan råa databasfel eller svar i felmeddelanden.

Adapterfunktionen skapar ingen anslutning, migration, HTTP-väg eller registrering. Den får en privat, serverstyrd transaktionsport och en serververifierare för identitet.

### Explicit Supabase-testkoppling

app/_lib/testAccounts/personaV61SupabaseTest.server.ts:
- Ingen URL hämtas från DATABASE_URL, SUPABASE_URL eller annan aktiv produktkonfiguration.
- connectApprovedPersonaTest kräver en explicit ApprovedPersonaTest-konfiguration.
- NODE_ENV=production avvisas; PERSONA_V61_ALLOW_REMOTE_TEST=1 krävs.
- Godkänt testprojekt måste ha explicit referens, skilja sig från en icke-tom lista över produktionsreferenser och matcha både Auth-URL och direktdatabasens hostname.
- Endast direkt db.<testref>.supabase.co på port 5432 och dedikerad SQL-inloggning persona_v61_runtime tillåts. Pooler-URL:er och generisk postgres-inloggning avvisas.
- URL-parametrar som kan ändra TLS-läge tillåts inte. Befintlig verifierande TLS-konfiguration återanvänds.
- Separat servernyckel och förväntat SHA-256-fingeravtryck måste stämma.
- getUser validerar varje token hos testprojektets Auth. Ogiltiga, återkallade, anonyma och obekräftade sessioner nekas.
- SQL kör SET LOCAL ROLE persona_v61_backend och transaktionslokal owner_id från den verifierade identiteten.
- Roll och ägarkontext återställs vid commit/rollback och läcker inte till nästa poolanrop.

Detta är en anslutningsfabrik för ett framtida, uttryckligen godkänt testprojekt. Den har bara provats med testdubblar för SDK/anslutning i detta arbete. Inget riktigt Supabase-projekt kontaktades.

## SQL-struktur och rättigheter

001_persistent_results.sql ligger AVSIKTLIGT UTANFÖR supabase/migrations. Vanlig migrations-/deploykörning ska därför inte automatiskt plocka upp den.

Den är avsedd för granskad, manuell tillämpning i ett separat godkänt testprojekt och har endast körts mot lokala PGlite-databaser här. Kör den inte mot produktion.

Schema: persona_v61_test.
Tabell: results.
Kolumner:
- id UUID, primärnyckel.
- owner_id UUID med FK till auth.users(id), ON DELETE CASCADE.
- revision >= 1.
- product, question_version och report_version med CHECK för den frysta V6.1-releasen.
- ciphertext, 1–8192 tecken.
- created_at och updated_at med tidsordningsvillkor.
Index: owner_id, updated_at DESC, id.

Inga okrypterade grundsvar, kompletteringar, kvalitetsobjekt eller rapporttexter ligger i SQL-kolumner. Ägar-ID, revision, versioner och tider är metadata. Rapporten byggs från den frysta releasekopian efter avkryptering.

Roll: persona_v61_backend, NOLOGIN, NOINHERIT, NOSUPERUSER, NOBYPASSRLS.
Rättigheter: USAGE på privat schema samt SELECT/INSERT/UPDATE på tabellen. Ingen klientroll får rollen. Ingen DELETE-behörighet ges till denna adapter.

RLS är ENABLED och FORCED. Policyn gäller bara backendrollen och kräver att owner_id motsvarar serverns transaktionslokala persona_v61_test.owner_id, både för läsning och WITH CHECK för skrivning.

PUBLIC, anon, authenticated och service_role får inga schema-/tabellrättigheter. Det finns inga klient-RPC:er eller SECURITY DEFINER-funktioner som öppnar en bakväg. Testet kontrollerar även att en klientroll inte kan SET ROLE till backendrollen.

En webbläsarklient kan inte sätta serverns SQL-transaktionskontext. Ett klientangivet owner_id i datapaketet avvisas. Den anpassade GUC:en är inte ett självständigt autentiseringsbevis: bara den privata serverinloggningen får använda backendrollen och endast serververifierad identitet matas till den.

Databasadministratörer kan naturligtvis ändra roller och policyer; RLS är inte ett skydd mot en databasadministratör. Manipulerad owner_id/ciphertext upptäcks även av AES-GCM-bindningen. En service_role med BYPASSRLS saknar fortfarande rättigheter till det privata schemat och tabellen.

## Lokala tester och beständighet

Tester använder den befintliga PGlite-dependencyn och riktig lokal PostgreSQL-exekvering, inte simulerad SQL eller simulerad RLS:
- Vanliga SQL-/RLS-tester kör i isolerade minnesinstanser.
- Återstartstestet använder en ny katalog i OS temp som beständig lokal databas.
- Schema, roller, syntetiska auth.users och krypterat resultat skrivs till disk.
- Första instansen stängs.
- En ny Node-process öppnar samma databas utan att köra migrationen igen.
- Samma separat slumpade testnyckel förs till den nya processen enbart via dess isolerade miljö.
- Rapportkontrollsumma, revision och kvalitetsstatus jämförs. Kontrollsumman omfattar även kompletteringar och analysunderlag.
- Nyckel och okrypterade svar skrivs inte till testdatabasen eller loggas.

Den beständiga testkatalogen lämnas i OS temp för eventuell granskning. Ingen rekursiv radering eller ändring i andra arbetskataloger görs.

PGlite köar transaktioner i samma lokala instans. Två parallella adapteranrop testas och ger en vinnare och en konflikt. Två oberoende riktiga PostgreSQL-anslutningar över nätverk har inte testats; det kräver den separata miljön. SQL-satsen innehåller självständigt den atomiska revisionskontrollen.

PGlites SET SESSION AUTHORIZATION/RESET-beteende skiljer sig i den inbäddade testmiljön. Därför använder klientrolltesten separata instanser per klientroll. De faktiska behörighets-/RLS-kontrollerna är inte bortmockade eller avstängda.

## Vad som behövs för riktig Supabase-testanslutning

1. En befintlig separat testmiljö eller uttryckligt godkännande att skapa en. Detta arbete skapar ingen molnresurs.
2. Verifierad testprojektreferens och kända produktionsreferenser för spärrlistan, granskade oberoende av testanslutningssträngen.
3. Manuell granskning och tillämpning av SQL-filen endast i det godkända testprojektet. Den ändrar inte de gamla tabellerna.
4. Separat dedikerad inloggning persona_v61_runtime, med LOGIN, NOINHERIT, NOSUPERUSER och NOBYPASSRLS; medlemskap i persona_v61_backend. Ge INTE detta medlemskap till anon, authenticated, service_role eller authenticator. Lösenord skapas och hanteras som en serverhemlighet, aldrig i denna SQL-fil.
5. Direkt testdatabas-URL med den inloggningen. Ingen produktions-URL eller produktionsservice-nyckel får återanvändas.
6. Testprojektets HTTPS Auth-URL och publicerbara testnyckel samt bekräftade syntetiska testkonton.
7. Stabil separat AES-nyckel för testmiljön och matchande fingeravtryck. Nyckeln måste bevaras över serveromstarter för att krypterade poster ska gå att läsa.
8. En isolerad Node-testprocess med PERSONA_V61_ALLOW_REMOTE_TEST=1. Byt aldrig global krypteringsnyckel i en körande kundprocess.
9. Explicit ApprovedPersonaTest-objekt till connectApprovedPersonaTest:
   environment, approvedProjectRef, productionProjectRefs, databaseUrl, supabaseUrl, publishableKey, encryptionKeyFingerprint.
10. Verifiera verklig Auth, certifikat/hostname, grants/RLS, två samtidiga databasanslutningar och återöppning efter omstart innan vidare integration.

Ingen konfiguration hämtas automatiskt från generiska produktionsvariabler. Hemligheter ska inte klistras in i chatten eller skrivas till logg, URL eller versionshanterad fil.

## Kompatibilitet och runtime

V5, aktiva versionsregistret, betalväggen, Stripe, kundsessioner och befintliga kontoläsare är oförändrade. V5 kan fortfarande öppnas via sin gamla registry-post. En V5-payload avvisas av den nya V6.1-parsern och SQL-identiteten.

Etapp 2:s lokala demonstrationsväg förblir en separat minnesdatabas; den har inte tyst bytts till beständig eller molnbaserad lagring. Nya adaptern har ingen publik route.

AES-format och V6.1-kuvert återanvänds. Den beständiga adaptern lägger ägaren till den autentiserade kryptokontexten. Gamla lokala ciphertextposter kopieras därför inte direkt in i den nya tabellen; eventuell framtida överföring måste avkryptera genom rätt auktoriserad läsare och kryptera om under rätt ägare. Ingen sådan migrering sker här.

Node.js är runtime-gränsen för denna adapter: node:crypto och befintlig PostgreSQL-klient med verifierad TLS. Ingen Edge-kompatibilitet utlovas och ingen säkerhetskontroll sänks för Deno/Edge. Supabase används här som databas/Auth, inte som en ny publicerad Edge-funktion.

Före kundintegration återstår dessutom riktiga konto-/samtyckes-/gallrings- och nyckelrotationsrutiner samt separat beslut om radering/retention. Denna adapter aktiverar inga köp eller rapportbehörigheter.

## Exakta nya filer

- app/_lib/testAccounts/personaV61Postgres.server.ts
- app/_lib/testAccounts/personaV61SupabaseTest.server.ts
- supabase/persona-v61-test/001_persistent_results.sql
- supabase/persona-v61-test/README.md
- tests/persona/persistent-v61-fixture.cjs
- tests/persona/persistent-v61.test.cjs
- tests/persona/supabase-test-v61.test.cjs

Inga befintliga applikationsfiler ändras i detta steg. Två äldre testfiler, tests/persona/database-v61.test.cjs och tests/persona/storage-v61.test.cjs, får en avgränsad korrigering: korta teckenföljder kan slumpmässigt förekomma i Base64-ciphertext. Kontrollerna verifierar nu krypteringsformat och avsaknad av verkliga okrypterade JSON-svarsfält i stället. Säkerhetskraven och kryptokoden är oförändrade.

## Slutlig verifiering

262/262 tester passerar: 244 PERSONA-tester samt 18 äldre domäntester. Etapp 3 tillför 18 tester (13 beständighets-/SQL-/RLS-tester och 5 testkonfigurations-/SDK-gränstester). Alla 24 profiler passerar SQL-roundtrip. Ett diskbaserat resultat med kompletteringar återöppnades i en ny Node-process efter stängd första databasinstans med samma kontrollsumma, revision och kvalitet.

TypeScript och PERSONA-ESLint inklusive båda nya servermodulerna passerar. Fullständigt Next.js-bygge godkänt med 160/160 statiska sidor, i separat kopia utan .env eller leverantörsnycklar. Befintlig Node DEP0205-varning förekom.

Ingen riktig Supabase Auth, moln-TLS, nätverkspool eller två separata fjärranslutningar testades. SDK-/anslutningsfabriken verifierades med testdubblar och opt-in-/projekt-/TLS-/nyckelkontroller. Lokal SQL och RLS kördes i verklig PostgreSQL/WASM.

SHA256-jämförelse av 917 befintliga filer visar endast två avsiktliga ändringar i tests/persona/database-v61.test.cjs och tests/persona/storage-v61.test.cjs. Sju nya filer tillkom. Alla befintliga applikations-, V5-, Stripe-, betalväggs- och kundflödesfiler är oförändrade. Ingen commit, push, deployment, molnresurs eller produktionsmigration.
