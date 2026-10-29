# Kontointegration etapp 7 – IQ, lokal leverans

## Leverans

IQ är anslutet till samma servermotor som de tidigare testerna: verifierad Stripe-bindning, valfritt konto efter köpet, uttryckligt samtycke till separat kontokopia, AES-GCM-kryptering, ägarkontroll, återöppning, återbetalnings-/tvistspärr, radering, raderingsjournal och daglig rensning. Ingen ny serverkärna, tabell, migrering, nyckel, bucket, cron eller monitor införs. AuDHD-specifik implementation är orörd.

Adapter: `iq_test`, slug `iq`, testsida `/iq-test/test`, frågeversion `iq-questions-v2`, rapportversion `iq-report-v2`, prefix `TEST_ACCOUNTS_IQ`, prisvariabel `TEST_ACCOUNTS_IQ_PRICE_ID`. Priset kommer från originalets PRICE_SEK=79 och är 7900 öre. Detta är ett engångsköp, inte portalens eventuella framtida månadsabonnemang. CHECKOUT/SAVE/READ/LEGACY_IMPORT_ENABLED är separata och avstängda som standard. Historikimport är fortsatt blockerad; gammal lokal upplåsning eller mejladress utgör inte köpinnehav.

## Strikt schema och dataminimering

Exakt 40 svar krävs, varje svar ett heltalsindex till frågans befintliga alternativ (0–3). Endast answers, questionVersion och reportVersion accepteras. Sparse, saknade, null, 4, negativa/fractionella, extra resultat-/paid-/ägarskapsfält eller fel versioner avvisas före serverlagring. Servermodellen väljs via registret, aldrig av klientens resultat.

Svarstider används i originalkoden endast för lokal registrering, localStorage-återupptagning, den gamla checkoutens lokala återställningskopia och omstart. calculate och buildProfileReport tar endast svar. Varken poäng, IQ-estimat, delskalor, profiler, insikter eller rapporttexter använder tiderna. Därför tar nya serverflödet inte emot svarstider; payload med responseTimes avvisas, inte bara ignoreras. Ingen tidskolumn eller timingmetadata införs. Gästens befintliga lokala hantering av tider är oförändrad. Detta korrigerar IQ-antagandet i den äldre inventeringsrapporten; den historiska inventeringen skrivs inte om.

## Resultatlikhet och särskilda IQ-förhållanden

Originalets model.ts och payment.ts är oförändrade och hashbevakas. Beräkningen behåller 40 frågor, fem områden, 12 lätta/16 medelsvåra/12 svåra frågor, vikter 1/1,25/1,5 (max 50), områdesnormalisering, stabila lika-resultat, IQ-skalan 75–130 i femsteg och profilgränserna spread <=14 respektive <30. Rapporter byggs med originalets buildProfileReport. FullAnalysis flyttas oförändrad till en komponent som både klient- och servervyer använder. Frysta originalmodeller och rapporter används som jämförelse, med oberoende kontroll av viktade poäng och estimat.

Vetenskapliga påståenden, försiktighetsformuleringar, rapportinnehåll och testets ambitionsnivå ändras inte. Serverberäkning verifierar beräkningen och köpinnehavet; den bevisar inte att frågorna besvarats utan hjälp eller att resultatet är normerat. Ingen tidspåverkan, proctoring eller ny validering av testets vetenskapliga anspråk införs. Originalets calculate-validering ensam är inte servergräns: den striktare adaptern kontrollerar även hål i arrayer och okända fält.

## Avgränsade UI-beroenden

- Gemensamma klienthjälparen får en valfri capabilities-callback. Alla äldre anrop har samma beteende som förut; inga serverkärnfunktioner ändras. IQ använder endast beskedet för korrekt lagringsinformation och feltext.
- Med flaggan AV behålls originalets lokala lagringstext, Payment Link, checkoutState inklusive lokala svarstider, betalningsretur, lokal upplåsning, granskning och omstart. Gamla effekter samt choose/restart/checkout jämförs mot originalet (endast den nya checkout-grenen undantas).
- Med flaggan PÅ visas information före köp om krypterad serverlagring i sju dagar, valfri kontokopia efter köp och att svarstider inte skickas. Det behövs eftersom det gamla påståendet att allt sparas endast lokalt annars vore fel. Tekniska betalningsfel ersätts med ett neutralt meddelande i just det nya flödet, utan tyst återfall till Payment Link.
- Originalsidans Granska mina svar/Börja om behålls. Den nya serverrapporten är en läsvy och erbjuder Börja om via befintliga TestRestartLink: just IQ:s lokala svar/tider rensas före navigation, sparad analys och betalmarkörer påverkas inte. Ingen redigering av den köpta, sparade analysen införs. Originalets allmänna IQ-förbehåll återges även i servervyn.

## Lokal verifiering

Samtliga 74 testprogram passerade: fem nya IQ-program, originalets IQ-modelltest och tidigare 68 regressioner. Separat TypeScript samt byggets typkontroll är godkända. ESLint för leveransens runtime-, test- och skriptkod gav noll fel och noll varningar. Produktionsbygge med webpack och postbuild är godkänt, 144 statiska sidor. Paritet: 72 938 analys-/profiljämförelser och 1 089 kompletta rapportjämförelser, alla tolv estimatsteg och tre profilnivåer, varje områdes rättantal, alla individuella områdessubset, samtliga rättantal per svårighetsgrad, gränser, ties, extrema/syntetiska svar och avvisade ofullständiga svar. Ingen konstaterad analysavvikelse.

PGlite kör verklig SQL/RLS/kryptering; Stripe, extern journal och nätverk simuleras. Samma verifierare provas för fel ägare/produkt, återbetalning, utgång, krypterad återöppning efter gästrensning, radering och återställd äldre backup. Syntetiskt känsligt felinnehåll får inte läcka till API-/rapportfel eller loggar. Klienttestet kör verkliga IQ-sidan och gemensamma checkout-hooken mot lokal fejkad klocka, storage och fetch: sista svar, dubbelklick, fördröjd analys, betalningsretur, reload, omstart, lokal tidsregistrering, default-off legacyväg, capability-information och timingfri ny checkout.

Verifikation ska göras i kopia skapad av `node scripts/prepare-test-accounts-stage7.cjs`, följt av `node scripts/test-test-accounts-stage7.cjs`, separat TypeScript, leveransens ESLint och `npm run build -- --webpack`. Kopian består av HEAD plus uttryckliga tidigare allowlists och etapp 7. Bara den tidigare godkända två-raders recovery-testfixen rekonstrueras från HEAD; andra pågående recovery-/betalnings-/bokändringar följer inte med. Tidigare manifest och leveranser skrivs inte om. Bevis sparas lokalt under ignorerade `.artifacts/test-accounts-stage7/`.

## Produktionsberoenden – separat godkännande krävs

1. Godkänn och driftsätt tidigare kontomotor/AuDHD/driftleveranser och deras generella migrering enligt tidigare plan. Befintlig lagringsgräns högst tolv månader, daglig radering, externa journalen, backup-avstämning och larm måste vara driftsatta. Planerade Supabase Pro/Vercel Pro, övervakning och driftadress beslutas/konfigureras i separat produktionssteg. Inget sådant ändras nu.
2. Verifiera korrekt aktivt engångspris 79 SEK, live, för IQ. Lägg godkänt Price ID i iq_test.priceIds i STRIPE_PAYMENT_PRODUCT_MAP_JSON och TEST_ACCOUNTS_IQ_PRICE_ID. Bevara gamla produktmappningar och Payment Link. Inga skarpa ID:n eller miljövärden har lästs eller ändrats här.
3. Godkänn utökad integritetsinformation, rättslig grund och uttryckligt frivilligt lagringssamtycke. Bedömningen ska omfatta kognitiva resultat och tidigare känsliga relationstest; tidsdata tillförs inte serverbehandlingen. Ingen juridisk garanti lämnas.
4. Efter godkännande: kontrollera verklig checkout-/returkonfiguration, mobil, cookieägarskap, läsning efter sju dagar, radering, återbetalning och larm. Testerna här använder bara simuleringar. Kontrollera att prestanda och kostnader räcker för faktiska volymer.
5. Aktivera READ/SAVE och sist CHECKOUT, en produkt åt gången efter godkänd verifiering. Import förblir avstängd. Vid fel stäng nya köp/sparningar för berörd produkt, bevara fungerande läsning, radering och driftjobb; backa kod utan att återställa data. Databasåterställning måste ske i underhållsläge med extern journalavstämning före återöppning.

## Hela projektets status efter etapp 7

15 betalda tester är lokalt kontointegrerade: 14 i gemensamma motorn plus AuDHD i dess bevarade separata implementation. Det inkluderar IQ. Inget i dessa lokala etapper ska uppfattas som publicerat eller aktiverat.

Två gratis snabbtester återstår: Röda flaggor (`/roda-flaggor-relation-test`) och Är min relation sund? (`/ar-min-relation-sund`). De ska inte få en påhittad Stripe-betalning; frivillig kontolagring kräver en separat beslutad ägarskaps-/samtyckespolicy för gratis försök. Deras gästflöden är orörda. Böcker/abonnemang är separata nästa steg.

Gemensamma blockerande punkter inför publicering: godkänd sammanhållen release och tidigare migreringar, verifierade Stripe-mappningar, produktionsmiljöns nycklar/behörigheter, extern raderingsjournal/backup-rutin, fungerande rensning/övervakning/larm och godkänd integritets-/samtyckestext. Ingen skarp betalning, migrering, produktionsändring, commit, push eller publicering ingår här.

## Exakt filförteckning

22 filer: 15 nya och 7 ändrade från arbetsstarten.

### Ändrade befintliga filer

- `app/_components/useTestAccountCheckout.ts`
- `app/_lib/testAccounts/adapter.ts`
- `app/_lib/testAccounts/stage2-flow.test.cjs`
- `app/iq-test/test/page.tsx`
- `app/mina-sidor/tester/ReportView.tsx`
- `app/mina-sidor/tester/integritet/page.tsx`
- `proxy.ts`

### Nya filer

- `app/_lib/testAccounts/adapters/iq.ts`
- `app/_lib/testAccounts/stage7-client.test.cjs`
- `app/_lib/testAccounts/stage7-fixtures/material.json`
- `app/_lib/testAccounts/stage7-fixtures/model-v2.ts`
- `app/_lib/testAccounts/stage7-fixtures/report-v2.tsx`
- `app/_lib/testAccounts/stage7-flow.test.cjs`
- `app/_lib/testAccounts/stage7-http-ui.test.cjs`
- `app/_lib/testAccounts/stage7-parity.test.cjs`
- `app/_lib/testAccounts/stage7-safety.test.cjs`
- `app/iq-test/test/ReportView.tsx`
- `docs/test-accounts-stage7.env.example`
- `docs/test-accounts-stage7.md`
- `scripts/prepare-test-accounts-stage7.cjs`
- `scripts/test-accounts-stage7-files.json`
- `scripts/test-test-accounts-stage7.cjs`
