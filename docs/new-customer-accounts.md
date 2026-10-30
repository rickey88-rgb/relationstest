# Mina sidor – endast nya kunder

Lokal leverans från 541c096. Ingen historikimport, PLUS-koppling, produktionsändring, migration, commit eller push ingår. Originalarbetsytan och tidigare frysta leveranser är orörda. Alla nya flaggor är av som standard.

## Färdigt flöde

Alla 15 betaltester använder samma serverkärna och de befintliga kalkylatorerna. Nya AuDHD-köp använder de befintliga generella test_account-tabellerna. Den gamla AuDHD-motorns data, cookies, nyckel, priser och pågående köp ändras inte.

1. Kunden genomför samma test i webbläsaren och väljer betald analys. Ett separat uttryckligt val gäller känslig behandling för gästleveransen.
2. Svar skickas direkt till Supabase Edge, valideras strikt och krypteras där. Servern skapar en Stripe Checkout-session, bunden till försöket och ett slumpmässigt webbläsarbevis. Inget konto krävs.
3. Efter betalningen öppnas /mina-sidor med försöks-ID endast i URL-fragmentet. Supabase verifierar betalning, belopp, produkt/pris, capture, återbetalning/disput och webbläsarbevis innan svar/rapport lämnas ut.
4. Kunden kan läsa hela rapporten som gäst. Inloggning går direkt till befintlig Supabase Auth; ingen server-action eller känslig callback via Vercel. Den befintliga mejlmallen kan återanvändas med RedirectTo=/mina-sidor#login. Token-hash hamnar då i fragmentet och verifieras först när kunden trycker på bekräftelseknappen.
5. Kunden väljer uttryckligen kontosparning efter inloggning. Köpägarskap låses atomiskt till Auth-UUID; mejladress, klientflaggor, Stripe-ID eller gammal support-cookie ger inte ensam rätt.
6. Kontoägaren kan återöppna fullständiga svar och samma versionsbundna rapport efter utloggning och efter gästförsökets utgång. Rapporten återskapas av samma versionsbundna kalkylator från de krypterade svaren; ingen andra rapportmodell eller oskyddad rapportkopia införs.
7. Radering tar bort svar/analys med externt R2-kvitto först. Köphistoriken finns kvar separat. Återställd äldre SQL-kopia blockeras av samma externa journal. Befintlig 12-månadersgräns med backupmarginal behålls.

Första kopplingen måste göras i webbläsaren som har det nya köpbeviset och innan sju dagars gäståtkomst löpt ut. Ingen gammal cookie eller recovery-länk importeras. Flera nya osparade köp i samma webbläsare bevaras separat. Auth-sessionen ligger i sessionStorage; kontosparade resultat ligger i Supabase och är oberoende av webbläsarsessionen. Detta nya klientflöde använder bearer-token i stället för gamla HttpOnly-cookies; skydda mot XSS och behåll privata sidors undantag från tredjepartsanalys. Utloggning/kontobyte rensar personlig visning, och sena svar från en tidigare identitet ska inte återvisa dennes rapport.

Vercel levererar ett generiskt portalskal. Testdata, rapporter, köpbevis och nya Auth-token skickas direkt till Supabase. Personliga ID:n/token läggs inte i Vercels query/path/RSC. För första leveransen ska gamla kontoflaggan på Vercel förbli false: gamla konto-API och SSR-sidor öppnas inte.

## Produkter och inställningsnamn

| Test | Engångspris | Supabase-prisvariabel | Supabase-produktflaggor |
|---|---:|---|---|
| AuDHD | 79 kr | `AUDHD_CHECKOUT_PRICE_ID` | `TEST_ACCOUNTS_AUDHD_{CHECKOUT,SAVE,READ}_ENABLED` |
| IQ | 79 kr | `TEST_ACCOUNTS_IQ_PRICE_ID` | `TEST_ACCOUNTS_IQ_{CHECKOUT,SAVE,READ}_ENABLED` |
| ADHD | 39 kr | `TEST_ACCOUNTS_ADHD_PRICE_ID` | `TEST_ACCOUNTS_ADHD_{CHECKOUT,SAVE,READ}_ENABLED` |
| HSP | 49 kr | `TEST_ACCOUNTS_HSP_PRICE_ID` | `TEST_ACCOUNTS_HSP_{CHECKOUT,SAVE,READ}_ENABLED` |
| Ångest | 39 kr | `TEST_ACCOUNTS_ANGEST_PRICE_ID` | `TEST_ACCOUNTS_ANGEST_{CHECKOUT,SAVE,READ}_ENABLED` |
| PTSD | 39 kr | `TEST_ACCOUNTS_PTSD_PRICE_ID` | `TEST_ACCOUNTS_PTSD_{CHECKOUT,SAVE,READ}_ENABLED` |
| Narcissism – självtest | 39 kr | `TEST_ACCOUNTS_NARCISSISM_SELFTEST_PRICE_ID` | `TEST_ACCOUNTS_NARCISSISM_SELFTEST_{CHECKOUT,SAVE,READ}_ENABLED` |
| Relationstest | 39 kr | `TEST_ACCOUNTS_SCREENING_PRICE_ID` | `TEST_ACCOUNTS_SCREENING_{CHECKOUT,SAVE,READ}_ENABLED` |
| Autism | 39 kr | `TEST_ACCOUNTS_AUTISM_PRICE_ID` | `TEST_ACCOUNTS_AUTISM_{CHECKOUT,SAVE,READ}_ENABLED` |
| Anknytning | 39 kr | `TEST_ACCOUNTS_ATTACHMENT_PRICE_ID` | `TEST_ACCOUNTS_ATTACHMENT_{CHECKOUT,SAVE,READ}_ENABLED` |
| Medberoende | 39 kr | `TEST_ACCOUNTS_CODEPENDENCY_PRICE_ID` | `TEST_ACCOUNTS_CODEPENDENCY_{CHECKOUT,SAVE,READ}_ENABLED` |
| Gaslighting | 39 kr | `TEST_ACCOUNTS_GASLIGHTING_PRICE_ID` | `TEST_ACCOUNTS_GASLIGHTING_{CHECKOUT,SAVE,READ}_ENABLED` |
| Narcissist i en relation | 39 kr | `TEST_ACCOUNTS_PARTNER_PRICE_ID` | `TEST_ACCOUNTS_PARTNER_{CHECKOUT,SAVE,READ}_ENABLED` |
| Traumabindning | 39 kr | `TEST_ACCOUNTS_TRAUMA_BOND_PRICE_ID` | `TEST_ACCOUNTS_TRAUMA_BOND_{CHECKOUT,SAVE,READ}_ENABLED` |
| Psykisk misshandel | 39 kr | `TEST_ACCOUNTS_PSYCHOLOGICAL_ABUSE_PRICE_ID` | `TEST_ACCOUNTS_PSYCHOLOGICAL_ABUSE_{CHECKOUT,SAVE,READ}_ENABLED` |

Varje produkt har oberoende CHECKOUT/SAVE/READ-flaggor enligt tabellen. Samtliga tre måste vara på för att nya köp ska erbjudas. Ett valt direktflöde faller aldrig tillbaka till en gammal Payment Link vid fel. LEGACY_IMPORT aktiveras aldrig.

Checkout nekar nya köp om den befintliga hälsokontrollen för gallring/monitor är inaktuell, innan någon Stripe-session skapas. Browseranrop använder en fast forceFunctionRegion-parameter så att även CORS-preflight går till eu-central-1; inga kunduppgifter finns i parametern.

## Driftsättning – kräver separat godkännande

1. **Konfigurera befintligt Supabase-projekt**, utan schemaändring. Lägg till DATABASE_URL med den redan verifierade projektanslutningen; officiell CA och värdnamnskontroll följer med koden. Tillhandahåll TEST_ACCOUNTS_ENCRYPTION_KEY säkert, befintlig STRIPE_SECRET_KEY och befintlig STRIPE_WEBHOOK_SECRET. Ändra inte legacy-AuDHD-nyckeln. Kopiera den befintliga journalens sex ACCOUNT_ERASURE-värden och CRON_SECRET samt TEST_ACCOUNTS_HEALTHCHECKS_URL. Ingen ny bucket, sentinel, monitor eller journalidentitet.
2. Konfigurera aktuella verifierade Price-ID:n enligt tabellen och motsvarande STRIPE_PAYMENT_PRODUCT_MAP_JSON **i Supabase**. Ingen ändring av Vercels befintliga mappning eller gamla Stripe-ID:n. En allowlist för endast nya aktuella försäljningspriser räcker här; gamla köp stannar i sitt gamla system.
3. Kör build:customer-edge och publicera customer-tests på befintligt Supabase Pro, först med DIRECT_CUSTOMER_TESTS_ENABLED=false, ACCOUNT_STORAGE_MODE=maintenance, TEST_ACCOUNTS_STORAGE_MODE=maintenance och alla produktflaggor av. Koden använder internt ACCOUNT_PORTAL_ENABLED för den befintliga kärnans databasgallring; aktivering av den på Supabase öppnar inte Vercel. verify_jwt=false behövs för gäster, medan alla kontoåtgärder kontrollerar token med Auth.getUser och ägarskap på servern.
4. Verifiera den riktiga Edge-runtime-miljön med syntetiska uppgifter: TLS, region, Auth, journal, monitor, två konton och otillåten direktåtkomst. Lokala tester har inte ersatt detta leverantörsprov. Anrop låses till eu-central-1; SB_REGION med annat värde nekas. Kontrollera x-sb-edge-region i verkligt svar. Ingen automatisk regional fallback.
5. **Mejlretur:** kontrollera befintliga Confirm signup/Magic Link-mallar enligt docs/supabase-auth-setup.md. Tillåt exakt den nya /mina-sidor#login-returen i Supabase Auth. Mallarna måste använda RedirectTo enligt befintlig dokumentation, så att token-hash aldrig hamnar i en Vercel-query. Kör ett riktigt mejlprov med godkända testadresser, utan kundsvar eller köp. Ingen OTP förbrukas vid enbart GET/skanning.
6. **Webhook före nya köp:** aktivera DIRECT_CUSTOMER_TESTS_WEBHOOK_ENABLED och verifiera signatur/relay först. Ändra sedan endast URL på den befintliga Stripe webhook-endpointen till Supabases customer-tests/stripe-webhook?forceFunctionRegion=eu-central-1. Behåll endpointidentitet, signing secret och relevanta events. Bekräfta att ingen annan aktiv Stripe-destination parallellt levererar nya testevents direkt till Vercel. Om samma hemlighet inte säkert kan återanvändas: stoppa före omläggning.
7. Gatewayen identifierar nya sessioner/PaymentIntent med serverstyrd metadata rv_flow=direct_customer_v1. Dessa betalnings-, refund- och dispute-notiser skickas inte till Vercel. Befintliga relevanta events för äldre köp/böcker vidarebefordras med **oförändrad body och Stripe-signatur** till gamla webhooken. Osäker klassificering returnerar 503 för retry. Gamla outbox-/recovery-/bokfunktioner bevaras. Nya rättigheter bygger alltid på aktuell Stripe-verifiering vid läsning/sparning, inte på att en webhook kommit fram. Nya direktköp skrivs därför inte till Vercels gamla skuggledger/GA4-köpleverans; Stripe samt kontots köphistorik används. Ingen känslig betalmetadata skickas till gamla GA4-processen för dessa nya köp.
8. Förbered Vercels nya kod med NEXT_PUBLIC_DIRECT_TEST_ACCOUNTS_ENABLED=false och ACCOUNT_DIRECT_PORTAL_ENABLED=false. Behåll ACCOUNT_PORTAL_ENABLED=false och gamla kontoproduktflaggor av. Nödvändiga befintliga publika Supabase URL/publishable-key-värden återanvänds; inga serverhemligheter behövs i webbläsaren.
9. Aktivera TEST_ACCOUNTS_EDGE_CLEANUP_ENABLED på Vercel först efter att den behöriga Edge-rensningen verifierats. Det befintliga 03:30 UTC-jobbet blir en tunn anropare; ingen ny cron. Befintlig gästcron och AuDHD-kontocron ändras inte. Edge sköter gallring, journal och Healthchecks. Spara kräver färsk lyckad rensning och monitorleverans.
10. **Slutligt godkännande:** integritetsinformation och de två samtyckestexterna ska godkännas före riktiga kunder. Aktivera därefter Supabases DIRECT_CUSTOMER_TESTS_ENABLED, kärnans active-lägen och alla 15 produkters CHECKOUT/SAVE/READ. Publicera Vercels bygge med de två direktflaggorna på. NEXT_PUBLIC-flaggor kräver ombyggnad. Kontrollera omedelbart portal, avstängda gamla API, priser 39/39/79, bokpriser 149/99, gästköp och båda monitorerna. Inget betalt skarpt prov ingår utan separat tillstånd.

Supabase URL och Auth-nycklarna som plattformen ger Edge finns redan som SUPABASE_URL/SUPABASE_ANON_KEY och ska inte återskapas som reserverade hemlighetsnamn. Den hemliga nyckeln till krypteringen och externa journalcredentials får aldrig hamna i Git, rapporter eller klientkod.

## Integritet – förslag inför godkännande, inte publicerad policy

Skilj mellan nödvändig administration av ett engångsköp och känsliga svar/analyser. Föreslagen grund för köpadministration är avtal; uttryckligt samtycke föreslås för hälsorelaterad analysbehandling och separat frivillig kontolagring. Rättslig grund/undantag för respektive behandling måste slutligt beslutas, inte förutsättas löst av kryptering.

Gäståtkomst: högst sju dagar. Därefter nekar servern läsning; daglig fysisk gallring och begränsad backupretention ska beskrivas separat. Kontosparade analyser: högst tolv månader inklusive befintlig gallrings-/backupmarginal, eller tidigare efter kundens radering. Samtyckesversion/tid sparas med underlaget. Köphistoriken innehåller referenser och produkt/belopp, inte svar eller rapport. Ange inte att köphistorik automatiskt gallras efter 400 dagar: sådan rutin finns ännu inte i kärnan och rätt tidsgräns ska beslutas med hänsyn till bokföring. Bestäm även minimerad bevisförvaring efter återkallat samtycke; nuvarande analysbundna samtyckesmetadata försvinner vid analysradering.

Ange Supabase för Auth/databas/känslig behandling, Stripe för betalning, Resend för inloggningsmejl, Cloudflare R2 för privat raderingsjournal och Vercel för webbplats/äldre flöden. Healthchecks får tomma driftpingar. Identitet/kontaktuppgifter för ansvarig hanteras i den separata juridiska frågan; inga företagsuppgifter har uppfunnits här. Leverantörsavtal och överföringsinformation behöver stämma med faktisk konfiguration.

## Återställning utan att förstöra nya köp

Vid fel: stäng **nya checkoutflaggor**, behåll möjligheten att läsa, spara, radera och rensa redan genomförda nya köp där det är säkert. Behåll Edge-webhooken för pågående nya sessioner; återställ inte dess URL till Vercel så att nya betalmetadata börjar skickas dit. Behåll nycklar, Price-ID:n, journalidentitet och raderingskvitton. Återställ ingen databas och radera inga köp. Äldre kunder/böcker fortsätter via den signerade legacy-relayen.

Innan senare push/deploy ska aktuell main och Production kontrolleras på nytt. GitHub main återbekräftades till 541c096 under detta arbete. Original och frysta kandidater ska inte skrivas över. Den isolerade arbetskopians origin kommer från lokal kloning och ska inte användas för push utan att rätt GitHub-remote verifierats.

Källor: Supabases regional-invocation, dependencies, auth och development-environment; Stripes API update-webhook-endpoint. Deno CLI-proven är inte ett påstående om att Supabase CLI:s egen Edge Runtime eller faktisk produktionsanslutning har testats.
