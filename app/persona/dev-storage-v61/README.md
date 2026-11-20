# PERSONA V6.1 – isolerad databas och sessionsåterställning

Etapp 2 på codex/persona-stage1. Ingen kundaktivering, produktionsdatabas, commit, push eller deployment.

## Databas och nycklar

PGlite (@electric-sql/pglite, redan installerat) kör en riktig PostgreSQL/WASM-instans helt i minnet i en separat lokal Node-process. Den öppnar ingen nätverksanslutning och använder ingen DATABASE_URL, Supabase-klient eller produktionsdatabas.

Den isolerade startprocessen kopierar projektfiler till en ny tillfällig katalog utan .env-filer. Endast uttryckligen tillåtna grundvariabler används. En separat slumpad 256-bitars testnyckel skapas för just processen; inga produktionsnycklar läses eller återanvänds. Nyckeln skrivs inte till fil eller logg.

Runtime kräver:
- NODE_ENV=development.
- Befintligt strikt opt-in/loopback-skydd för lokal PERSONA-förhandsgranskning.
- PERSONA_V61_LOCAL_DB=pglite-memory.
- En separat TEST_ACCOUNTS_ENCRYPTION_KEY med korrekt format och matchande PERSONA_V61_LOCAL_KEY_ID (SHA-256).
- Ingen DATABASE_URL, SUPABASE_DB_URL, SUPABASE_URL, NEXT_PUBLIC_SUPABASE_URL, STRIPE_SECRET_KEY eller RESEND_API_KEY.

Om konfiguration/nyckel saknas eller en blandad miljö upptäcks avvisas API-anropet innan databasen skapas. Det finns ingen produktionsfallback. Teststartaren skapar den separata nyckeln; du behöver inte ange någon riktig tjänstenyckel.

Databasen och nyckeln är avsiktligt tillfälliga. Serveromstart avslutar denna testsession och dess data. Detta är inte en hållbar produktionslagring eller kontobaserad återställningstjänst.

## Lokala tabeller

persona_v61_local_results:
- id, owner_id och revision.
- product, question_version och report_version med CHECK-villkor som bara tillåter den frysta V6.1-releasen.
- ciphertext: hela versionsbundna paketet från etapp 1, krypterat med befintlig AES-256-GCM.
- updated_at för auktoriserad serveråterställning av senaste egna resultatreferens.

Inga okrypterade grundsvar, S-svar, kvalitetsobjekt, rapporttexter eller resume-objekt lagras i SQL-kolumner. De ligger inuti ciphertext. Produkt/version/ägare/revision/tid är metadata.

persona_v61_local_sessions:
- token_hash (SHA-256), serverutfärdad owner_id och expires_at.
- Ingen användbar sessionshemlighet sparas i databasen.

Tabellerna skapas enbart i den nya lokala PGlite-instansen. Ingen migrationsfil läggs till för kunddatabasen.

## Auktorisering

Ny session skapas med ett POST-anrop som måste vara same-origin och loopback. Servern skapar en opak, kryptografiskt slumpad sessionshemlighet och en separat syntetisk ägaridentitet.

Hemligheten skickas endast som HttpOnly-cookie med SameSite=Strict, sökväg /persona/dev-storage-v61 och en timmes giltighet. Secure=false behövs endast på denna utvecklingsvägs loopback-HTTP; produktionsvägen är alltid 404. Inga befintliga kundcookies eller säkerhetspolicyer ändras.

Varje läsning och sparning:
1. Validerar sessionshemlighetens format.
2. Slår upp dess hash och giltighet på servern.
3. Hämtar owner_id från sessionstabellen, aldrig från klienten.
4. Avgränsar resultatfrågan med både id och owner_id.
5. Avkrypterar och verifierar schema, versionsmanifest, kvalitet och rapportkontrollsumma med den frysta releasekopian.

Resultat-ID i URL eller formulär är bara en opak referens. Det ger ingen åtkomst utan rätt session. En annan giltig sessionsägare får samma 404 som för ett saknat resultat. Borttagen/utgången/felaktig session ger 401.

Avsluta session tar bort serverns tokenhash och tömmer cookien. Ett känt resultat-ID kan inte återställa behörighet efter det.

Detta är syntetiska lokala sessioner, inte Supabase Auth-konton eller köprättigheter. Autentisering/auktorisering i det riktiga kundflödet är oförändrad.

## Samtidiga uppdateringar

Ny post får revision=1. Klienten måste skicka exakt den revision den senast läste.

Sparningen validerar tidigare paket och ny indata och använder en enda atomisk SQL-sats:
UPDATE ... SET ciphertext=..., revision=revision+1
WHERE id=... AND owner_id=... AND revision=förväntad_revision
AND question_version=... AND report_version=...
RETURNING revision

Bara en av två samtidiga uppdateringar av revision N kan skriva N+1. Den andra får 409/conflict. Nyare data ersätts inte av en äldre session. Klienten visar konflikten och kräver återöppning i stället för automatisk överskrivning eller återförsök med ny revision.

En korrupt eller främmande version skrivs inte över av ett nytt tomt tillstånd. Saknade poster, otillåtna paket och integritetsfel hanteras uttryckligt.

## Isolerad testväg

Aktuell adress:
http://127.0.0.1:64834/persona/dev-storage-v61

1. Klicka Ny testsession.
2. Välj en av de 24 syntetiska profilerna.
3. Välj simulerade kompletteringar/prioritering och återställningsläge.
4. Spara nytt testresultat.
5. Uppdatera sidan: profil, kompletteringar, revision och läge återställs.
6. Ändra läge till Resultat och spara ändring.
7. Öppna samma adress i en ny flik: servern kan återställa senaste egna resultatreferens även om fliken saknar sessionStorage.
8. Avsluta session och försök öppna samma ID: åtkomst nekas.
9. Skapa en ny testsession och försök öppna föregående ägares ID: åtkomst nekas.

Webbläsaren sparar bara en opak resultatreferens i sessionStorage. Svaret innehåller syntetisk profil, kompletteringar, kvalitet, läge, revision och kontrollsumma först efter serverauktorisering. Inga svar eller sessionshemligheter läggs i URL, loggar eller sessionslagring i webbläsaren.

API:t accepterar bara syntetiska profil-ID:n och uttryckligen tillåtna fält. Klientangiven ägare, inloggningsidentitet eller köpflagga godtas inte. JSON-kroppar begränsas till 8192 byte och feldata avvisas. Svar har private/no-store och no-referrer.

## Runtime-gräns

Både sida och API anger runtime=nodejs. Krypteringen använder node:crypto. PGlite använder Node/WASM och är inte en Edge-komponent.

next.config.ts innehåller serverExternalPackages för enbart @electric-sql/pglite. Det är Nexts normala stöd för att läsa paketets egna Node/WASM-filer. Det ändrar inte Stripe, kundprodukter eller övriga paket. Ingen säkerhetskontroll har stängts av för att få ett Edge-bygge att fungera.

Den faktiska Next.js Node-servern har provats med riktiga HTTP-anrop: databasstart, cookies, krypterad lagring, återöppning, konkurrerande sparningar och avslag fungerar. Inga TypeScript-testladdare eller mockade SQL-anrop används i den HTTP-verifieringen.

Produktionsbyggen ska returnera 404 för sida samt API GET/POST före databasskapande, oavsett utvecklingsflaggor. Supabase/Deno Edge-paketering är inte ansluten eller godkänd av detta steg.

## Exakta projektfiler

Ny:
- app/_lib/testAccounts/personaV61LocalDatabase.server.ts
- app/persona/dev-storage-v61/runtime.server.ts
- app/persona/dev-storage-v61/fixtures.server.ts
- app/persona/dev-storage-v61/api/route.ts
- app/persona/dev-storage-v61/page.tsx
- app/persona/dev-storage-v61/LocalStorageLab.tsx
- app/persona/dev-storage-v61/README.md
- tests/persona/database-v61.test.cjs
- tests/persona/database-route-v61.test.cjs

Ändrad:
- next.config.ts: avgränsad serverExternalPackages-inställning för PGlite.

Etapp 1:s kryptering/releasekopia och alla aktiva PERSONA-, konto- och betalningsfiler är oförändrade. V5 läses fortfarande via sitt befintliga versionsregister och kan inte skrivas in i V6.1-testtabellen.

## Tester och kvarstående blockerare

De nya automatiska testerna omfattar:
- Alla 24 profiler genom riktig lokal SQL och krypterad återöppning.
- Kompletteringar, siduppdaterings-/återöppningsmodell och återställningsläge.
- Serveråterställning av egen resultatreferens.
- Två samtidiga uppdateringar: exakt en lyckas.
- Gammal revision, versionkonflikt, otillåtna paket och manipulerad ciphertext.
- Saknat resultat, förlorad/utgången session och annan sessionsägare.
- V5-kompatibilitet.
- Endast hashade sessionshemligheter i SQL.
- Produktions-/loopback-skydd före databasstart.
- HttpOnly-cookie och förbud mot klientangiven ägare.

Före riktig kundintegration återstår separat hållbar databas, verklig serveridentitet/besittningskontroll, samtycke/gallring, återställningspolicy och säker nyckelhantering enligt integrationsplanen. Den lokala minnesdatabasen får inte bytas mot en produktionsanslutning. Inga köp eller betalda rapporter aktiveras här.

## Slutlig verifiering i etapp 2

244/244 tester passerar: 226 PERSONA-tester samt 18 äldre domäntester. De 20 nya testerna består av 13 databas-/auktoriseringstester och 7 HTTP-gränstester. TypeScript, PERSONA-ESLint inklusive ny databasmodul och Next-konfiguration samt fullständigt Next.js-bygge passerar. Bygget genererade 160/160 statiska sidor i separat kopia utan .env eller produktionsnycklar. Befintlig Node DEP0205-varning förekom.

Verkliga HTTP-anrop mot den slutliga utvecklingsservern verifierade sessionscookie, SQL-sparning, kompletteringar, återöppning, exakt ett lyckat parallellt skrivförsök (200/409), gammal revision, annan ägare, känt ID utan session, avslutad session och främmande ursprung.

Webbläsare: ny session, syntetisk F24, krypterad sparning, riktig siduppdatering, bevarad profil/komplettering, sparat resultatläge, avslutad session och nekad annan ägare verifierades. Efter slutlig serverstart verifierades även syntetisk F23 och återupptagning i en helt ny flik via serverns egen resultatreferens.

Den slutliga produktionsservern svarade 404 på testsida/API GET/API POST även med testflaggor och separat syntetisk nyckel konfigurerade. Inga cookies utfärdades. Befintliga /persona, /persona/test, /adhd-test/test och /autism-test/test svarade 200.

SHA256-jämförelse: av 908 befintliga filer ändrades endast next.config.ts med den avgränsade PGlite-inställningen. Nio nya filer tillkom. Allt tidigare arbete och alla aktiva produkt-/betalningsfiler är bevarade. Ingen commit, push eller deployment.

För omstart i denna arbetsmiljö: kör node med isolated-run.cjs i outputs/PERSONA-database-v61 och argumentet dev. Startaren gör en ny isolerad kopia och skriver ut en ny port. Den tidigare minnesdatabasen återanvänds inte. Aktuell server ligger kvar på port 64834.
