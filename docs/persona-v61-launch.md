# PERSONA V6.1 inför publicering

Publiceringsunderlag för 2026-11-20 på grenen codex/persona-stage1. Den separata ingången är /persona-v61. Publiceringen är godkänd av ägaren; verkligt provköp och PDF-prov lämnas till ägaren. Ingen datamigration ingår.

## Färdig funktion

De befintliga Q01–Q40 och den godkända frågekomponenten används i fyra kapitel. Svar markeras i guld och pekarval går vidare efter 350 ms. Tangentbordsnavigation, Tillbaka, kapitelövergångar och lokal återställning finns kvar. V6.1 har en egen lokal utkastnyckel, så det tidigare PERSONA-flödet påverkas inte.

Analysen körs på servern med den frysta releasen persona-report-v61-release1. Gratisanropet lämnar endast kvalitetsstatus, en personlig insikt, erbjudandebeskrivning och relevanta kompletteringsfrågor. Det lämnar inte premiumrapporten, interna spår eller svarsbiblioteket.

- ready: erbjudande för 79 kr via befintlig Stripe Checkout.
- limited: avgränsat gratisresultat och relevanta frivilliga kompletteringar; inget köp.
- insufficient: gratisresultat och högst fyra frivilliga kompletteringar; inget köp.
- Kompletteringar ändrar inte de 40 svaren och kan enligt den frysta modellen högst ge limited. De används inte för att tvinga fram ready.

Ett köp får starta först efter servervalidering av hela V6.1-paketet, kvalitetsgrinden och den faktiska sexdelade leveransen. Paketet krypteras med befintlig AES-GCM och befintlig kontextbindning. Det läses tillbaka och verifieras före Checkout. Pris, betalningsstatus, innehav av köpet, ägarskap, gallringsjournal, återbetalningar och tvister kontrolleras genom de befintliga funktionerna.

V6.1 använder samma persona_test-produkt och de befintliga tabellerna test_account_attempts, test_account_purchases och test_account_analyses. Nya tabeller, SQL-migrationer, Stripe-produkter eller tjänster har inte lagts till. Den tidigare isolerade databaslabben är inte kopplad till kundflödet.

Vid köp lagras hela versionspaketet inklusive ursprungliga svar, eventuella kompletteringar, versionsmanifest, kvalitetsbedömning, metadata och rapportkontrollsumma. Befintlig samtyckesmetadata finns kvar. Före köp sparas utkast och frivilliga kompletteringar lokalt i webbläsaren, enligt det befintliga testets mönster. Lokal sparning är inte krypterad och beskrivs därför uttryckligen som synlig för andra som använder samma webbläsare.

Betalda rapporter öppnas via befintlig gästbehörighet eller frivillig kontosparning på Mina sidor. Endast den verifierade läsarens presentationsobjekt skickas till rapportkomponenten. Utskrift och Spara som PDF använder befintlig webbläsarutskrift; någon separat PDF-tjänst eller publik rapportfil har inte införts.

V5 och äldre resultat går fortfarande genom sina tidigare läsare och generatorer. Den nya försäljningsgrinden appliceras inte på dem. Avstängd V6.1-försäljning spärrar inte återöppning av redan köpta V6.1-resultat.

## Ändrade och nya filer i detta arbete

Projektrot för samtliga filer: C:/src/relationsvarning-github.

Ny kundingång:

- C:/src/relationsvarning-github/app/persona-v61/constants.ts
- C:/src/relationsvarning-github/app/persona-v61/actions.ts
- C:/src/relationsvarning-github/app/persona-v61/draft.ts
- C:/src/relationsvarning-github/app/persona-v61/PersonaV61Flow.tsx
- C:/src/relationsvarning-github/app/persona-v61/layout.tsx
- C:/src/relationsvarning-github/app/persona-v61/page.tsx
- C:/src/relationsvarning-github/app/persona-v61/supplements.module.css

Köpkoppling och återöppning:

- C:/src/relationsvarning-github/app/_lib/testAccounts/personaV61Commerce.server.ts — ny versions- och leveransgräns.
- C:/src/relationsvarning-github/app/_lib/testAccounts/store.server.ts — krypterar hela V6.1-kuvertet, verifierar återöppning före köp.
- C:/src/relationsvarning-github/app/_lib/testAccounts/service.server.ts — separat versionsdispatch efter befintliga betalnings- och ägarkontroller.
- C:/src/relationsvarning-github/app/_lib/testAccounts/directHandler.server.ts — annonserar den nya rapportversionen, kontrollerar kvalitet före Stripe, återgår till rätt ingång vid avbrutet köp.
- C:/src/relationsvarning-github/app/_lib/testAccounts/answerDescriptions.ts — beskriver samma Q01–Q40 under den nya rapportidentiteten.
- C:/src/relationsvarning-github/app/mina-sidor/tester/ReportView.tsx — väljer V6.1-komponenten endast för rätt rapportversion.

Återanvänd rapportpresentation och produktkomponenter:

- C:/src/relationsvarning-github/app/persona/report/PersonaV6Report.tsx — gemensam tidigare granskad renderer.
- C:/src/relationsvarning-github/app/persona/report/presentation.ts — ren projektion av rapporttext utan interna underlagsfält.
- C:/src/relationsvarning-github/app/persona/report/v61Presentation.ts — fryst rapport samt relevanta kompletteringstexter.
- C:/src/relationsvarning-github/app/persona/report/PersonaV61PaidReport.tsx — betald versionsbunden presentation.
- C:/src/relationsvarning-github/app/persona/report/preview.module.css — återanvänd rapporttypografi och utskriftsregler.
- C:/src/relationsvarning-github/app/persona/dev-report-v6/PersonaV6Report.tsx — återexporterar samma renderer.
- C:/src/relationsvarning-github/app/persona/_components/PersonaShell.tsx — valfri egen hemlänk, tidigare standard bevarad.
- C:/src/relationsvarning-github/app/persona/test/PersonaJourney.tsx — motsvarande versionsspecifika hemlänk.
- C:/src/relationsvarning-github/app/persona/test/PersonaPaywall.tsx — explicit extra rapportversion i serverns capabilities samt korrekt V6.1-erbjudandetext.

Paketering, sökindex och tester:

- C:/src/relationsvarning-github/next-sitemap.config.js — utesluter V6.1-ingången.
- C:/src/relationsvarning-github/scripts/build-customer-edge.cjs — paketerar den frysta CommonJS-releasen som server-ESM.
- C:/src/relationsvarning-github/scripts/build-customer-edge.test.cjs — kontrollerar importgraf samt kör genererad V6.1-kod för alla 24 profiler.
- C:/src/relationsvarning-github/tests/persona/runtime.cjs — återanvänd syntetisk transport kan ladda den frysta versionen.
- C:/src/relationsvarning-github/tests/persona/integration-v61.test.cjs — köpgrind, leverans, konton, återbetalning och äldre version.
- C:/src/relationsvarning-github/tests/persona/flow-v61.test.cjs — 350 ms, dubbelklick, Tillbaka, samtliga kapitel och återställning.
- C:/src/relationsvarning-github/tests/persona/paywall.test.cjs — den nya versionen kräver uttrycklig serverannonsering.
- C:/src/relationsvarning-github/docs/persona-v61-launch.md — denna verifierings- och publiceringsanvisning.

Frågebank, poängsättning, fryst analys, insiktsregler, V5-generator och betalningsverifieraren payment.server.ts har inte ändrats i detta arbete. Övrigt befintligt ocommittat arbete finns kvar. Genererad backendkod och source-manifest är befintliga ignorerade byggartefakter, inte en ny handskriven backend.

## Verifiering

- 260/260 PERSONA-tester inklusive nya kundkopplingen och befintliga regressionssviter.
- 18/18 äldre PERSONA-domäntester.
- Befintliga gemensamma köpregressioner passerar: alla 15 tidigare produkter, autentisering/sessionsåterställning, privat transport, krypterad SQL-lagring, frivillig kontosparning, fel ägare, återbetalning och Stripe-webhooks. Den separata betalningssviten täcker 30 strikt verifierade betalningsfall.
- TypeScript passerar: npx tsc --noEmit --incremental false.
- ESLint passerar för PERSONA, ny ingång, tester och berörda gemensamma filer.
- Fullständigt Next.js-produktionsbygge passerar, 160 statiska sidor. Bygget gjordes i tillfällig kopia utan leverantörsnycklar eller .env-filer.
- Befintlig backendpaketering passerar: 102 moduler, 259 lokala importer och fem dynamiska importer. Den faktiskt genererade ESM-koden ger samma frysta resultat och köpavslag för alla 24 profiler när den körs lokalt i Node.
- Profilernas grundklassificering är oförändrad: 17 ready, fyra limited, tre insufficient.
- Produktionsbyggets HTTP-kontroll: /persona-v61 svarar 200 med noindex/nofollow även för Googlebot. Utvecklingsrapport och databaslab svarar 404. /persona, /persona/test, ADHD-, autism- och AuDHD-testens frågesidor svarar 200.
- Sitemap-transformen utesluter den nya ingången och dess undervägar. Inga meny- eller sitemaplänkar har lagts till.
- Inget fryst V6.1-analysbibliotek hittades i de 263 publika JavaScript-filerna i slutbygget.
- Webbläsarkontroll: alla 40 frågor, samtliga fyra kapitel och gratisinsikt för F01 genomfördes. Återställning efter omladdning fungerade. Fråga och fem vertikala alternativ syntes inom laptopvyn 1366×768. Gratisresultatet kontrollerades vid 390×844 utan horisontell överströmning.
- Ett navigeringsfel hittades och korrigerades: Granska mina svar återgår nu till Q40, inte Q39. Det täcks av automatisk regression.
- Browserautomationen fastnade vid webbläsarens inbyggda omstartsdialog. Ett ytterligare visuellt neutralt omtag genomfördes därför inte. Neutral/limited-kompletteringspolicy och återställning är automatiskt testade.
- Riktigt Stripe-köp, publicerad Supabase-funktion och en manuellt exporterad A4-PDF har inte verifierats i detta arbete. Ingen Deno-process finns tillgänglig på denna dator; importpaket och genererad ESM har verifierats lokalt, inte i Supabases körande miljö.

De äldre kontoflödessviterna behövde ACCOUNT_PORTAL_ENABLED=true i den isolerade testprocessen. Med deras portalgrind aktiverad passerade alla sex produktgrupper. Ingen produktionskonfiguration ändrades för detta.

## Lokal granskning

Den säkra utvecklingsservern är igång på:

http://127.0.0.1:57142/persona-v61

Full rapport med syntetisk profil via befintlig utvecklingsvy:

http://127.0.0.1:57142/persona/dev-report-v6?profile=F04

Profilväljaren i den befintliga utvecklingsvyn kan visa de övriga syntetiska profilerna. Den vägen är fortsatt spärrad i produktionsbyggen.

Det går att genomföra alla frågor, få gratisanalysen och granska syntetiska fullrapporter lokalt. Köp-/konto-/återbetalningskedjan är genomtestad med de redan befintliga simulerade leverantörerna. Ett verkligt komplett köp kan inte göras i denna nyckelfria lokala körning. Befintlig backend tillåter endast sin konfigurerade sajt-origin; localhost har inte lagts till som en ny betalningsorigin.

## Publicering efter ägarens godkännande

1. Publicera den uppdaterade befintliga Supabase-funktionen customer-tests med V6.1-försäljningen avstängd. Generera dess paket först med npm run build:customer-edge och kontrollera med node scripts/build-customer-edge.test.cjs. Behåll befintligt projekt, databas, krypteringsnyckel, Auth, verifierad TLS, gallring, webhook och andra produktflaggor. Inga nya SQL-migrationer ingår.
2. Publicera motsvarande Vercel-kod. Sätt TEST_ACCOUNTS_PERSONA_V61_ENABLED=true för den nya ingången i Vercel. Behåll befintlig Mina sidor-konfiguration och dess publika Supabase-anslutning. Ingången är olänkad och noindex; den är inte en ägarlåst inloggningssida.
3. Kontrollera i den befintliga Supabase-miljön att PERSONA redan har TEST_ACCOUNTS_PERSONA_ENABLED, TEST_ACCOUNTS_PERSONA_CHECKOUT_ENABLED, TEST_ACCOUNTS_PERSONA_SAVE_ENABLED och TEST_ACCOUNTS_PERSONA_READ_ENABLED aktiverade. Kontrollera TEST_ACCOUNTS_PERSONA_PRICE_ID mot befintlig produktallowlist: persona_test, 7900 öre SEK, aktiv engångsbetalning i live-läge. Komplettera endast PERSONA-konfiguration om den saknas; ersätt aldrig hela produktkartan och ta inte bort historiska pris-ID:n.
4. Aktivera TEST_ACCOUNTS_PERSONA_V61_ENABLED=true även på Supabase först när både backendens versionsläsare och Vercels renderer är publicerade. Samma nya flagga behövs på båda tjänsterna. Supabase annonserar då V6.1 till betalväggen; dess kvalitetsgrind räknar själv och litar inte på klientstatus.
5. Ägaren kan därefter testa https://www.relationsvarning.se/persona-v61. Verifiera ready-erbjudande, avbrutet köp, limited/insufficient utan köp, högst fyra kompletteringar, återkomst efter omladdning och oförändrade äldre resultat.
6. Ett verkligt köp på 79 kr och eventuell återbetalning kräver separat uttryckligt godkännande eller görs av ägaren själv. Verifiera då rätt sexdelade rapport, frivillig kontosparning, utloggning/inloggning, återöppning, mobilvisning och Spara som PDF. Kontrollera att återbetalningen spärrar ny åtkomst.
7. Vid återgång: stäng endast den nya V6.1-flaggan. Behåll läsarkoden, PERSONA READ-flaggan, prisallowlistens historik och krypteringsnyckeln så att redan köpta resultat kan öppnas.

Produktionsinställningarnas faktiska värden är inte tillgängliga i denna lokala körning. Därför är befintligt Stripe-pris, publicerad funktion, kontoflaggor och den verkliga betalningskedjan inte påstått driftverifierade. Detta kräver inga nya miljöer; det är kontroll och aktivering på de befintliga tjänsterna efter publiceringsgodkännande.

## Anpassningar för befintlig produktion den 20 november

Produktionssajten saknade PERSONA och hade tre senare sidändringar på main. Dessa ändringar har slagits in i PERSONA-grenen; ADHD-, autism- och IQ-landningssidorna är identiska med main inför denna publicering.

TEST_ACCOUNTS_PERSONA_V61_ONLY=true sätts på Vercel och Supabase. Den håller den tidigare opublicerade vanliga /persona-ingången stängd i produktion och begränsar nya PERSONA-köp till persona-report-v61-release1. V5-koden och läsning av tidigare rapportversioner finns kvar. Utan flaggan behålls tidigare beteende. Capabilities annonserar uttryckligt checkoutReportVersions, och servern avvisar andra PERSONA-versioner i detta läge.

STRIPE_PERSONA_PRICE_IDS är en separat, icke-hemlig tilläggslista för PERSONA-prisidentifierare. Den sammanfogas i minnet med den befintliga produktkartan, bevarar historiska identifierare och avvisar priser som redan tillhör andra produkter. Den skyddade STRIPE_PAYMENT_PRODUCT_MAP_JSON behöver därför inte skrivas över eller exporteras. TEST_ACCOUNTS_PERSONA_PRICE_ID väljer aktuellt pris ur tillåtelselistan.

Befintlig Supabase Dashboard används för uppdateringen. Kör node scripts/build-customer-dashboard.cjs för ett genererat, fristående ESM-paket från samma kanoniska 102 servermoduler. Det använder befintlig Next.js-webpack, utan nya beroenden eller tjänster. Endast index.ts behöver ersättas i den befintliga funktionen; de gamla genererade filerna lämnas kvar. Paketet verifieras lokalt, inklusive kvalitetsgrind och rapportleverans för samtliga 24 profiler.

Backup av tidigare funktionspaket sparas före ändring. Återgång av funktionskod kan göras genom att återställa tidigare index.ts; inga databasposter eller krypteringsnycklar ändras. Återgång av ny försäljning görs genom att stänga V6.1-flaggan och behålla läsning av redan köpta rapporter.

Vercels befintliga GitHub-main-flöde används efter godkänt produktionsbygge. Både den nya adressen och gamla /persona-ingången utesluts ur sitemap under provkörningen. Inga menyer ändras.
