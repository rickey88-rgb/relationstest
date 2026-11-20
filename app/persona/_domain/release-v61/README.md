# PERSONA V6.1 – versionssäker lagring, etapp 1

Isolerad implementation på codex/persona-stage1. Inga ändringar av aktivt testflöde, databasadapter, Stripe, betalvägg, priser eller rapportvisning. Ingen version har lagts till i det aktiva registret.

## Filer

- manifest.ts: separat kundreleaseidentitet och versionsmanifest.
- submission.ts: strikt validering av 40 svar och valfria kompletteringar.
- snapshot.cjs: fryst, självförsörjande releasekopia av 23 befintliga domänmoduler.
- app/_lib/testAccounts/personaV61Storage.server.ts: serverbegränsat kuvert, kontrollsumma och krypterad lagringsport.
- scripts/build-persona-v61-snapshot.cjs: reproducerbar skapande-/kontrollprocess för snapshot.
- tests/persona/storage-v61.test.cjs: format-, kompatibilitets-, krypterings- och återställningstester.

Alla dessa filer är nya. Befintliga filer behöver inte ändras i etapp 1.

## Explicit dataformat

Schema: persona-result-envelope-v1.
Produkt: persona_test.
Frågebank: persona-questions-v3.
Separat rapportidentitet: persona-report-v61-release1.
Underliggande fryst generator: persona-report-v6, innehåll persona-report-content-v6.3.

Struktur, schematiskt:
- schemaVersion, product, questionVersion, reportVersion.
- answers: exakt 40 heltal 0–5; 0 är ett legitimt överhoppat svar.
- supplement: null eller { questionVersion: persona-supplement-questions-v1, answers: S01–S04 med dokumenterade alternativ-ID:n }.
- versions: generator, analys, insiktsmotor, insiktskatalog, rapportinnehåll, kompletteringsmodell/-innehåll/-frågor, kvalitetsgrind, erbjudandepolicy och implementationens SHA-256.
- quality: fryst policyversion, grundstatus/slutstatus, beslutsskäl och antal giltiga grundsvar, bedömbara dimensioner, insikter, resurser, råd, individuella avsnitt och innehållsenheter.
- metadata: createdAt, updatedAt och resume { screen: questions/supplement/result, questionIndex: 0–39 för questions, annars null }.
- reopen: algorithm=sha256 och reportDigest över hela det deterministiska analys-/rapportresultatet.

Inga ägar-ID:n, e-postadresser, betalningsflaggor eller behörighetsbevis tas emot i svarsformatet. Krypteringsbindningen hanteras separat av serverns betrodda anropare.

Frånvarande komplettering normaliseras till null. En uttrycklig tom komplettering, delvis besvarad komplettering och skip-alternativ är tillåtna när den frysta modellen erbjuder komplettering. Otillåtna kompletteringar för ready eller en irrelevant limited-profil avvisas.

Paket med saknade obligatoriska fält, främmande extrafält, fel version, 39/41 svar, glest arrayinnehåll, icke-heltal, värden utanför 0–5 eller okända S-alternativ avvisas. Fyrtio nollor är däremot giltig ofullständig indata och klassificeras insufficient, inte som ett felaktigt format.

## Samma rapport vid återöppning

Snapshoten har inga runtime-importer till de föränderliga beräkningsmodulerna. Den kapslar in rapport, frågetexter, poängsättning, insiktsregler, kompletteringar och erbjudandepolicy från den godkända versionen.

Källfingeravtryck:
cdfa997c1ab5085edd337c0603a58f127802f26fdf960d0af2ef92cc868dd55d

Varje kuvert innehåller exakt versionsmanifest och en kontrollsumma av den genererade rapporten inklusive analysunderlaget. Vid öppning:
1. Validera produkt, schema och samtliga versioner.
2. Validera ursprungliga svar och kompletteringar.
3. Kör den frysta implementationen.
4. Jämför sparad kvalitet och rapportkontrollsumma.
5. Återställ rapport och återställningsläge först om allt stämmer.

Ingen automatisk omtolkning till senaste motor och ingen tyst kvalitetsuppgradering sker. En kontrollsumma är integritetskontroll för reproducerbarhet, inte köpbevis; AES-GCM ger det krypterade paketets autentisering.

Snapshoten omfattar analys och innehåll, inte pixelidentisk HTML/CSS eller genererade PDF-bytes. Rapportvisning ingår inte i etapp 1.

Kör node scripts/build-persona-v61-snapshot.cjs --check för att verifiera att den frysta releasekopian motsvarar källorna vid skapandet. Kommandot ändrar inga filer. Skapande utan --check vägrar skriva över en befintlig snapshot med annat innehåll. Vid framtida ändrad motor eller text ska en ny release skapas; den här kopian ska bevaras.

## Återanvänd kryptering

Servermodulen återanvänder seal, unseal och context från app/_lib/testAccounts/crypto.server.ts utan ändring:
- AES-256-GCM.
- Slumpmässig IV.
- Befintlig serverlagrad TEST_ACCOUNTS_ENCRYPTION_KEY.
- Autentiserad kontext med produkt, fråga/rapportversion och servervald postidentitet; vid kontosparning även ägare och köp.
- Samma maximala ciphertextlängd: 8192 tecken.

Både före lagring och efter avkryptering valideras det kompletta paketet. Lagringsdrivern får endast en opak postidentitet och { id, product, question_version, report_version, ciphertext }. Kompletteringar, kvalitetsdata och resume ligger inuti krypteringen.

Mätning av alla 24 profiler, med kompletteringar där relevanta: högst 2101 ciphertexttecken, väl under befintlig gräns. Den frysta koden är cirka 176 kB och lagras en gång som programkod; den ingår inte i kundposterna. Hela rapporttexten behöver därför inte lagras i den begränsade ciphertextkolumnen.

Ingen krypteringsnyckel hamnar i webbläsare, URL eller paket. Modulen loggar inte svar, rapportinnehåll eller nycklar. Fel normaliseras till ett neutralt felmeddelande.

## Lagring, uppdatering och sessionåterställning

createV61Repository får en privat, injicerad read/write-driver och en betrodd serverbindning. Detta är ingen publik endpoint och inte en ny konto- eller köpbehörighet.

- save bygger alltid kvaliteten själv; klienten kan inte skicka en egen ready-status.
- En sparning bevarar createdAt, uppdaterar updatedAt och krypterar hela paketet på nytt.
- load kan köras av en ny repositoryinstans efter siduppdatering, sessionsåterställning eller återgång till resultatet.
- Resume återställer questions/supplement/result och eventuell frågeposition; det ändrar inte kvaliteten eller köprätten.
- En ny process kan öppna samma lagrade ciphertext med samma servernyckel och bindning.
- Fel nyckel, skadad data, främmande version, fel post eller fel ägare/köp ger avslag.
- Saknad nyckel ger ingen klartextreserv.
- Misslyckad läsning eller skrivning rapporteras som fel. En oläsbar befintlig post skrivs inte över med en ny tom session.
- Giltigt paket kan krypteras om med ny betrodd konto-/köpbindning utan att rapportinnehållet ändras. Faktisk kontosparning är inte ansluten här.

Detta beteende är verifierat med nya instanser och en verklig tillfällig diskpost som öppnas i en ny Node-process. Testerna använder syntetiska profiler och en slumpad testnyckel. Ingen riktig databas eller kundnyckel används.

Kundens nuvarande webbläsarflöde använder fortfarande sin tidigare session.ts/state.ts. Det importerar inte den nya servermodulen. En faktisk siduppdatering i det aktiva kundtestet har alltså inte fått en ny lagringsväg; den kopplingen hör till nästa etapp.

## V5 och andra äldre versioner

- V6.1 har egen reportVersion och schemaVersion trots gemensam grundfrågebank.
- V5 kan inte läsas av V6.1-parsern.
- V6.1 är ännu inte registrerad i det aktiva versionsregistret; gamla köp kan inte råka börja använda den.
- V5:s parser, generator, renderer, kvalitet och befintliga krypteringsfunktioner är oförändrade.
- Ingen migrering, omräkning eller omskrivning av gamla poster görs.
- Den befintliga registry-vägen fortsätter fungera för tidigare rapporter.

## Kvarstående integration – inte utförd här

1. Bind den privata lagringsporten till rätt serverauktoriserade Supabase-/sessionposter. Bevara samtliga metadatafält även i service.server.ts:s guestConsent-gren. Ändra inte de aktiva serialiserarna innan nästa etapp godkänts.
2. Anslut kundflödets återställning via en opak referens eller serverförmedlad session. Inga svarsobjekt får läggas i URL-parametrar eller loggar. Den befintliga lokala syntetiska GET-förhandsgranskningen har inte ändrats eller öppnats för kundsvar.
3. Återanvänd befintlig ägar-/besittningskontroll, gallring, samtycken, utgångstid och betalningsverifiering. Kryptobindning ersätter inte dessa kontroller.
4. Supabase Edge-paketeraren måste verifieras för den nya frysta CJS-artefakten och server-only-importen innan den nya servermodulen tas in i det kanoniska backendpaketet. Det befintliga bygget innehåller inte den nya lagringsvägen, eftersom inget aktivt flöde importerar den. Ingen Edge-deploy görs.
5. Driverns write måste vara atomisk och hållbar. Versions-/revisionskontroll för samtidiga flikar eller förlorade uppdateringar behöver fastställas vid databaskopplingen. Etapp 1 uppfinner ingen delad databasmodell.
6. Den befintliga servernyckeln måste finnas kvar eller hanteras genom kontrollerad nyckelrotation för att gamla ciphertextposter ska gå att öppna. Inga nya nycklar eller nyckelinställningar skapas här.
7. Först senare: kvalitetsstyrt erbjudande, kundrenderer, Stripe, Mina sidor och PDF. Ingen av dessa kopplingar ingår här.

## Verifiering

Testkommando: node --require ./tests/persona/network-guard.cjs --test ./tests/persona/storage-v61.test.cjs

Den nya sviten omfattar 36 tester: 24 profilroundtrips, kompletteringar och resume, ny process/disk, V5, felaktiga/ofullständiga paket, versionskonflikter, integritetskontroll, AES-GCM-bindning, nyckelfel, lagringsfel, loggfrihet och kontroll av releasekopian.

Slutresultat: 224/224 tester passerar (206 PERSONA inklusive 36 nya lagringstester, samt 18 äldre domäntester). TypeScript och ESLint för PERSONA, den nya servermodulen och snapshotskriptet passerar. Fullständigt Next.js-bygge godkänt, 160/160 statiska sidor, i separat kopia utan .env eller leverantörsnycklar. Befintlig Node DEP0205-varning förekom. Alla 901 befintliga filer är oförändrade; sju nya filer tillkom. Ingen kundintegration, commit, push eller deployment.
