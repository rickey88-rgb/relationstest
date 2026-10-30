# Rensning i maintenance utan kundöppning

Lokal avgränsad uppföljning av 5133c7a. Inga nya scheman, migreringar, tjänster, hemligheter eller produktflaggor ingår.

## Behörighet

När ACCOUNT_PORTAL_ENABLED är av är kundsidor, inloggning, konto-API, nya checkouts, sparande och manuella admin-POST-rutter fortsatt spärrade.

Endast exakta GET-anrop till de två rensningsrutterna och AuDHD-jobbets läsande hälsorutt kan göra undantag. De kräver befintlig CRON_SECRET och ett operativt lagringsläge (maintenance eller active). Gemensamma testmotorn kräver detta även för TEST_ACCOUNTS_STORAGE_MODE. disabled tillåter inget undantag.

Efter kontrollen skapas en kortlivad intern AsyncLocalStorage-kontext för det aktuella jobbet. Bara dess egen kontodatabasklient får användas inom denna kontext. Maintenance som inställning, kundcookie, fel token, annan rutt eller POST ger ingen sådan åtkomst. Kontexten följer asynkrona anrop men läcker inte mellan jobb eller efter avslut.

Kundskapande använder fortsatt de befintliga portal- och active-kontrollerna, även om anropet skulle göras inifrån en operatörskontext. Det här är ingen generell databasförbikoppling och ger ingen ny rätt att spara analyser. Befintliga raderings-, journal-, kvitto- och monitorfunktioner återanvänds.

Vid öppen portal bevaras befintligt beteende och respektive handlers egna auktoriseringskontroller. Ingen read-only-hälsotoken behöver införas för två Healthchecks-pushmonitorer. CRON_SECRET ska aldrig lämnas till Healthchecks eller läggas i en URL.

## Separat godkänd driftsättning

1. Bekräfta båda monitorernas fel-, återhämtnings- och utebliven-körning-larm. Konfigurera de sex befintliga journalvärdena och två privata pingadresserna med separat tillstånd.
2. Publicera den granskade driftkompletteringen utan nya schemaposter. Portalflaggan förblir false/frånvarande, båda lagringslägena maintenance och alla produktflaggor av.
3. Registrera de två schemana först efter separat godkännande: 0 2 UTC och 30 3 UTC. Bevara gästens 15 3 UTC-jobb. Återuppta monitorerna när jobben kopplas in; håll dem pausade dessförinnan så att väntade uteblivna körningar inte ger missvisande larm.
4. Verifiera de första behöriga körningarna med noll kundrader: verkliga tidsstämplar, privata monitorpings och stängda kundvägar. Befintlig CRON_SECRET används av Vercel. Om manuellt prov inte kan göras säkert med befintlig behörighet, invänta schemakörningarna före kundpilot. Läs inte tillbaka hemligheten och inför ingen ny provnyckel. Inga syntetiska kundposter behöver skrivas i produktion.
5. Kundpilot kräver ett eget aktiveringsbeslut. Behåll övriga tester avstängda vid en första begränsad pilot.

De två redan genomförda produktionsmigreringarna ska inte köras igen. Lokala PGlite-prov skapar enbart separata syntetiska testtabeller i minnet.

## Kontrollerad driftstatus 2026-10-30

Ägaren har bekräftat felsignal, återhämtningssignal och båda mejlen för Test accounts cleanup. För AuDHD är båda signalerna och felmejlet bekräftade; återhämtningsmejlet är inte uttryckligen bekräftat. Utebliven-körning-larm och monitorernas pausläge återstår att verifiera. Dessa uppgifter är ägarens manuella bekräftelser, inte en inloggad dashboardgranskning.

Vercels Production-metadata visar att följande befintliga journalvärden saknas: ACCOUNT_ERASURE_R2_ENDPOINT, ACCOUNT_ERASURE_R2_BUCKET, ACCOUNT_ERASURE_R2_ACCESS_KEY_ID, ACCOUNT_ERASURE_R2_SECRET_ACCESS_KEY, ACCOUNT_ERASURE_SIGNING_KEY och ACCOUNT_ERASURE_REGISTRY_ID. Även ACCOUNT_CLEANUP_HEALTHCHECKS_URL och TEST_ACCOUNTS_HEALTHCHECKS_URL saknas. Värdena ska överföras skyddat efter godkännande, med samma befintliga journalidentitet och nycklar. Inga hemliga värden finns i denna dokumentation.

DATABASE_URL och CRON_SECRET finns redan. Portalflagga och lagringslägen saknas och är därmed stängda/disabled. Före driftprovet sätts portalflaggan fortsatt false och båda lagringslägena maintenance, med separat godkännande. Produktflaggor förblir av. TEST_ACCOUNTS_ENCRYPTION_KEY saknas och behövs innan sparande i den gemensamma motorn, men inte för nollradsrensningen. ACCOUNT_MAINTENANCE_SECRET behövs för senare manuella administrativa återställnings-/raderingsrutiner, inte schemarensning. Ingen separat hälsotoken behövs för pushmonitorerna.

Kundpilot kräver också fastställd integritetsinformation/samtycke, vald testprodukt och dess verifierade pris-/funktionskonfiguration samt kontroll av spara, återöppna, återkalla och radera. De tidigare juridiska besluten återanvänds; detta driftarbete ändrar inga juridiska texter.
