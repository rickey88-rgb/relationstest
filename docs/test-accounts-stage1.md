# Gemensam kontointegration, etapp 1 – lokal leverans

Ingen produktionsmigrering, betalning, publicering, abonnemangsändring, commit eller push ingår.

## Omfattning och avgränsning

ADHD är den enda registrerade nya adaptern. AuDHD:s specifika datamodell, krypteringsformat, checkout/recovery och driftkod ändras inte. Gemensamma befintliga Auth-, HTTP-, cron-autentiserings- och externa raderingsregisterfunktioner anropas som beroenden. Den tidigare AuDHD-leveransen måste därför finnas i samma verifierade release eller redan vara publicerad.

Motorn innehåller generella försök, kryptering, betalningsbindning, ägarskap, kontosparning, återöppning, radering och återställningskontroll. Adapterregistret innehåller fråge-/rapportversion, strikt validering, serverberäkning, pris och flaggprefix. Ytterligare **13 betaltest** kan använda samma betal-/lagringsmotor efter egna adaptrar och rapportvyer. De två gratistesterna kan återanvända lagring/ägarskap men behöver en separat beslutad behörighetspolicy utan Stripe. AuDHD migreras inte till denna motor.

ADHD använder befintliga 30 frågor (heltal 0–4), beräkningsmodell och rapporttexter. Frågeversion `adhd-questions-v1`, rapportversion `adhd-report-v1`. Endast kompletta svar och exakt kända fält/versioner accepteras. Den gamla och nya rapporten använder samma `AdhdReport`-komponent; klientens resultatobjekt eller upplåsningsflagga tas aldrig emot som bevis. Vid framtida modell-/textändringar måste versionen höjas och gamla adaptrar/texter behållas för befintliga analyser.

## Säkerhetskedja

1. Alla flaggor är av som standard. Den gamla ADHD-sidan sparar och låser upp via sitt befintliga Payment Link-/webbläsarflöde. Enda checkout-tillägget är en avgränsad avgrening till en ny hook. Fel efter att det nya flödet valts ger ingen tyst övergång till ett annat köpflöde.
2. Nya checkout-köp kräver ett krypterat serverförsök före Stripe. AES-256-GCM med slumpad IV och autentiserad kontext binder produkt, fråge-/rapportversion och försök. Browsersecret har 256 bitars entropi, lagras endast som hash i DB och som HttpOnly/SameSite=Lax/host-only-cookie i webbläsaren. Samma webbläsare stöder flera försök. Gästen behöver inget Auth-konto.

   Kontokopians autentiserade krypteringskontext binder även kontoägaren och köpet. Ett oavsiktligt byte av enbart databasens ägarfält gör alltså inte analysen läsbar på ett annat konto. Den separata krypteringsnyckeln måste säkerhetskopieras skyddat utanför databasen och bevaras för den godkända återställningsperioden. Förlorad nyckel kan inte återskapas från köp eller mejladress. Nyckelrotation kräver en plan för gamla ciphertext/versioner; byt inte bara miljövariabeln.
3. Servern väljer allowlistat ADHD-pris och kontrollerar aktivt engångspris, SEK och 39 kr innan checkout skapas. Försöks-ID binds till `client_reference_id`, sessionen lagras unikt. Enbart sessions-ID, mejladress, klientdata eller `paid=true` räcker aldrig. Begäran har ursprungskontroll och strömmad kropp på högst 4096 byte. DB-lås begränsar nya försök till 10/webbläsare/timme och 500 totalt/timme; detta ersätter inte Vercel-skydd mot överbelastning.
4. Läsning/sparning kontrollerar aktuell Stripe-session, exakt en produkt/kvantitet/pris, belopp/valuta, lyckad PaymentIntent och betald/capturerad charge. Delåterbetalning, full återbetalning och även historisk tvist nekar åtkomst. Leverantörsfel stänger läsningen tillfälligt; de tolkas inte som återbetalning. Återkallad kontoläsning journalför och raderar analysen. Köp sparas separat.
5. Sparning kräver bekräftad Supabase-användare och aktivt kryss för versionerat lagringssamtycke. Ägarskapet sätts från Auth, aldrig från inskickad mejl/owner. Databastransaktion låser försöket och förhindrar att ett redan kopplat köp flyttas till någon annan. Upprepad sparning förlänger inte lagringstiden.
6. Servern gör en självständig krypterad kontokopia som öppnas även när sjudagarsförsöket är borta. Kontokopian är oföränderlig och raderas efter tolv kalendermånader minus tio dagar. Fördröjning i daglig fysisk rensning ryms inom tolvmånadersgränsen; åtkomst spärras omedelbart vid utgången. Försök är åtkomliga högst sju dagar. En lång driftincident kan fördröja fysisk radering: övervakning och bemannad felhantering krävs.
7. Kontoläsning gör ägarkontroll före Stripe/dekryptering, sedan omläsning och separat kontroll mot privat externt raderingsregister. Radering journalförs före SQL-radering; DB-trigger stoppar oregistrerade deletes/updates och osäkra Auth-cascades. Kontoanalysradering tar även bort kvarvarande gästförsök. Journalavbrott eller fel registeridentitet ger stängd åtkomst, aldrig antagandet att registret är tomt.
8. Den exakta gästvägen `/mina-sidor/gast/adhd/<uuid-v4>` undantas från proxy-inloggningen. Den autentiserar i stället betalningsinnehav i serverläsaren. Alla övriga kontovägar skyddas som tidigare. Placeringen återanvänder befintligt statistikundantag, no-store och no-referrer; analys/identifierare skickas inte till GA. Gå aldrig från denna gästväg till en vanlig publik rapportsida med statistik.

Gästnyckeln är ett innehavsbevis, inte personidentifiering. Delad webbläsare, stulen session/cookie eller komprometterat konto är kvarstående risker; skydda nycklar, Auth och administratörsbehörigheter. Att råka ha samma mejladress ger ingen särskild åtkomst. Ingen automatisk överföring av analyser mellan konton finns.

## Historikimport

Separat funktionsgräns `prepareLegacyImport` och avstängd egen flagga finns. Den nekar även när flaggan slås på: ingen historisk proof-provider är implementerad. De gamla Payment Links ger här inget verifierat, försöksbundet innehavsbevis. En framtida import kräver oberoende serververifierat köpinnehav, giltigt ursprungligt underlag/frågeversion och uttryckligt val. Den får inte påstå att lokala svar är de ursprungliga köpsvaren. Ingen import eller masskoppling ingår i denna etapp.

## Drift och säker återställning

Ny separat migrering `202610260001_test_accounts.sql`: fem privata tabeller (`test_account_attempts`, `test_account_purchases`, `test_account_analyses`, `test_account_erasure_receipts`, `test_account_cleanup_state`), relevanta ägar-/utgångs-/browserindex, RLS utan klientpolicyer, explicita behörighetsåterkallelser inklusive TRUNCATE och raderingstrigger. Körs endast med godkännande efter jämförelse mot då aktuellt schema. AuDHD-migreringen är oförändrad.

Vercel Pro/Supabase Pro är planerade beroenden. Ingen uppgradering görs av koden. Egen Node-cronroute med maxDuration 300 sekunder, arbetsbudget 210 sekunder, upp till 1000 analyser/körning och stängd hälsostatus vid kvarvarande backlogg. Lägg efter godkännande till **en** cronpost i befintlig `vercel.json`: path `/api/cron/test-account-cleanup`, schedule `30 3 * * *` (UTC). AuDHD:s befintliga jobb ska vara kvar. Cron skyddas av befintligt `CRON_SECRET`. GET med `?health=true` kräver samma hemlighet och ger 503 vid osunt läge.

Konfigurera ett separat kostnadsfritt Healthchecks-jobb, 24-timmarsperiod och 2-timmars frist, larm till drift@relationsvarning.se när adressen fungerar. Jobbet skickar tom POST först efter lyckad full rensning, `/fail` vid fel. Missad körning, journalfel eller uteblivet lyckat ping måste larma externt. Hälsoraden kontrollerar både fysisk rensning och levererat ping yngre än 26 timmar. Nya kontosparningar stoppas när hälsan är för gammal. Kontrollera första riktiga körningen och simulerat uteblivet ping innan sparning aktiveras. Ny monitor måste skilja sig från AuDHD:s så jobben inte maskerar varandras fel. Ingen extern tjänst är registrerad av denna leverans.

Raderingsregister återanvänder AuDHD:s privata externa R2-register/signerade sentinel, med nya slumpade generationer. Samma förutsättningar gäller: separat skydd mot databastillbakaläsning, skyddad registeridentitet/nyckel, registerposter bevarade 400 dagar och sentinel utan automatisk utgång. Testerna använder endast en minneskopia av registret. Aktuellt Pro-backupfönster och faktisk konfiguration ska bekräftas vid driftsättning.

**Återställningsrutin:**

1. Sätt både `ACCOUNT_STORAGE_MODE` och `TEST_ACCOUNTS_STORAGE_MODE` till `maintenance`; stoppa nya checkout/sparningar och pausa jobb. Verifiera att alla körande instanser fått spärren. Spara raderingsregistret separat och återställ aldrig det från databasbackupen.
2. Kontrollera tidsstämpeln från Supabase, återställ endast en backup högst sju dagar gammal i karantän. Äldre backup kräver ny säkerhetsgranskning. Återställ ursprungliga krypteringsnycklar och exakt samma registeridentitet; skapa aldrig en ny sentinel för att få en gammal backup att öppna.
3. Kör AuDHD:s befintliga reconcile och denna motors separat. För den nya motorn: POST `/api/cron/test-account-cleanup` med `ACCOUNT_MAINTENANCE_SECRET`, korrekt Origin och URL-kodad form `confirm=reconcile-isolated-test-restore&snapshotAt=<ISO>&after=<cursor>`. Börja utan cursor, följ `nextCursor` tills `complete=true`. Den granskar både kontokopior och gästförsök; raderade/utgångna kopior försvinner innan åtkomst återaktiveras. Journalfel/identitetsfel avbryter. Operatören måste verifiera backupdatumet från oberoende källa; anropets datum är ingen automatisk attest.
4. Verifiera med syntetiskt raderingsfall, ägarskap, giltiga köp och helt tom förfallen kö; dokumentera genomförd kontroll. Aktivera driftläge, kör rensning och kontrollera monitor innan sparning öppnas. Återanvänd inte gammal körningsstatus som bevis efter restore.
5. Om koden behöver backas: stäng först nya checkout- och save-flaggor. Behåll radering/cron och befintliga kontoläsare tills data avvecklats. Droppa inte tabeller, ändra inte köp och återskapa aldrig en raderad analys. En rollback till kod utan rensningsjobb kräver en separat fungerande raderingsrutin.

Vid kontoradering: sätt båda driftlägena i maintenance och kör både AuDHD:s befintliga erase-account-analyses och nya POST `/api/cron/test-account-cleanup?operation=erase-owner` med maintenance-hemligheten, korrekt Origin och URL-kodad form `owner=<Auth-UUID>&confirm=erase-test-account-analyses`; upprepa tills `complete=true` innan Auth-kontot tas bort. Ny trigger stoppar annars osäker cascade. Operatörsanropet ska ske från skyddad driftmiljö, inte från klientgränssnittet.

## Integritet före aktivering

Föreslagen visningstext finns på `/mina-sidor/tester/integritet` och samtyckesrutan på gästanalysen. Den är ett tekniskt textförslag, inte ett juridiskt godkännande. Före aktivering behöver ansvarig besluta/dokumentera rättslig grund enligt artikel 6 för frivillig kontolagring och undantag enligt artikel 9 för potentiella hälsouppgifter (förslaget använder uttryckligt samtycke för den frivilliga lagringen), samt separat grund/lagringstid för köp- och bokföringsuppgifter. Testköp och kontosparning får inte villkoras av samma samtycke. Bekräfta personuppgiftsansvarig, biträden, geografisk lagring/överföringar, giltighet/återkallelse av samtycke och behov av konsekvensbedömning. Befintlig integritetspolicy ändras inte av denna etapp; fullständig text och dessa beslut är publiceringsblockerare för aktivering.

## Publiceringsordning (samtliga produktionssteg kräver ägarens godkännande)

1. Godkänn juridiska beslut/text, lagringstider och ny separat nyckel/monitor; uppgradera planerna enligt tidigare beslut. Bekräfta faktisk backup, R2-livscykel, fungerande driftbrevlåda och extern övervakning.
2. Granska exakt filmanifest, AuDHD-beroendet och de tre delade filernas avgränsade ändringar. Verifiera aktuell schemajämförelse/migreringsförutsättningar och säker backup. Ingen automatisk SQL-migrering finns i build.
3. Publicera först med samtliga nya flaggor av; befintliga betalflöden förblir tillgängliga. Kör därefter godkänd separat migrering, ange serverhemligheter och allowlistat ADHD-pris i rätt miljö. Inga miljövariabelvärden läses ut av leveransskripten.
4. Lägg till cronposten, koppla separat monitor och verifiera dess larm. Aktivera driftläge och kör rensning en gång; observera både DB-status och externt ping.
5. Verifiera det nya flödet i isolerad Stripe-testmiljö eller genom ett uttryckligen godkänt produktionsprov. **Den levererade betalningsverifieraren accepterar endast live mode.** Testsvitens SDK är helt simulerat. Att använda Stripe test mode i en extern preview kräver en separat genomgranskad miljöadapter; byt aldrig bara nyckel och anta att flödet är verifierat. Ingen skarp betalning har gjorts här.
6. Slå först på READ, sedan SAVE och sist CHECKOUT för ADHD efter godkänt prov. Kontrollera konto/gäst, felkonto, återbetalning, radering, mobil, cookie-/inloggningsåterkomst och hälsa. LEGACY_IMPORT förblir av. Vid fel: stäng CHECKOUT/SAVE, behåll radering och övervakning.

## Isolering och verifiering

Exakt leveranslista finns i `scripts/test-accounts-stage1-files.json`. Den nya leveransen rör tre befintliga filer: `app/adhd-test/test/page.tsx` (rapportextraktion och flaggstyrd checkout), `app/mina-sidor/page.tsx` (en import och en flaggstyrd länk), `proxy.ts` (exakt gästundantag). Portalens tidigare AuDHD-ändringar ingår inte i den nya etappens diff mot arbetsstarten. Övriga nya filer är självständiga. Inga befintliga Stripe-/recovery-, miljö-, package-, sitemap- eller AuDHD-specifika filer redigeras.

Arbetsstartens hashlista och portalens dåvarande källa ligger lokalt under ignorerade `.artifacts/test-accounts-stage1/`. `prepare-test-accounts-stage1.cjs` kontrollerar att alla frysta AuDHD-beroendefiler fortfarande har samma hash (portalgränsen undantagen), skapar HEAD + tidigare explicit AuDHD-allowlist + denna etapps allowlist och genererar nya granskningshashar. Övrigt pågående arbete följer inte med till verifieringskopian. Ingen staging eller Git-skrivning sker. Framtida push kräver ny selektiv granskning och uttryckligt godkännande.

Kör `node scripts/prepare-test-accounts-stage1.cjs`, använd den utskrivna katalogen, kör sedan `node scripts/test-test-accounts-stage1.cjs`, produktionsbygge med `npm run build -- --webpack` samt `node <rotens node_modules>/typescript/bin/tsc --noEmit --incremental false`. Kör inte rotens postbuild över pågående sitemap-arbete. Resultat för det aktuella genomförandet rapporteras separat efter körning.

Testerna använder syntetiska användare, PGlite/äkta SQL för migration/RLS/behörigheter/retention/backupåterställning och simulerade Stripe/R2-anrop. PGlite har inte riktiga PostgreSQL-advisory locks; SQL-låsets backendverkan och verklig Stripe/Supabase/Vercel/R2-koppling återstår som kontroller inför driftsättning. Detta är inte en fullständig verifiering av produktionsmiljön.

## Verifierat lokalt 2026-10-26

- 45 testprogram passerade: fem nya testprogram, tre befintliga ADHD-program och hela tidigare sviten med 37 konto-/AuDHD-/recovery-/bok-/Auth-regressioner. Inkluderar 30 negativa/positiva Stripe-gränsfall, 100 krypterade rapportjämförelser och faktisk SQL-återställning av tidigare raderad analys/gästkopia.
- Separat TypeScript-kontroll: godkänd utan fel i isolerad verifieringskopia.
- Produktionsbygge med webpack och postbuild: godkänt, 144 statiska sidor. Nya privata rapportvägar är dynamiska; inga nya privata vägar ska hamna i genererad sitemap.
- ESLint för etappens kod: inga fel; befintlig `react-hooks/exhaustive-deps`-varning i ADHD-sidans tidigare inläsningseffekt kvarstår.
- Tre befintliga filer skiljer sig från arbetsstartens hashlista. Alla övriga då befintliga filer är oförändrade. Inget staged, ingen commit och ingen push. HEAD är fortsatt `da093160c886d316cc9c2b35a11bdc6e8f505105`.
- Den nya verifieringsförberedelsen utgår från detta HEAD. Det äldre AuDHD-förberedelseskriptets pinning till föregående commit har lämnats orörd. Mellan dessa commits finns endast den redan gjorda borttagningen av en tillfällig publik bokkopia; den återinförs inte av denna etapp.

Inför aktivering måste ägaren även godkänna och tydligt kommunicera gästflödets sjudagarslagring före köp, separat från frivillig kontosparning. Befintliga Payment Link-köp och deras lokala resultat ändras inte. Förslaget är ingen automatisk import eller förlängning av tidigare köps åtkomst.
