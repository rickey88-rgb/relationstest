# PERSONA – etapp 1: fristående innehålls- och analysmotor

Denna etapp bygger den senast godkända kreativa frågebanken och analysplanen.
Endast nya filer läggs till. Befintliga produkter, tester, priser, checkout,
kontoläsare, databaser, miljöfiler och paketberoenden ändras inte.

## Leverans

- 34 fasta frågor i kapitel om 10, 12 och 12 frågor.
- 15 strukturerade självskattningar, 19 fasta scenarier och en bank om 18 adaptiva scenarier.
- Sex följdfrågor per genomförande; 25 av 40 besvarade frågor är scenarier.
- Versionsbunden validering, deterministiskt globalt urval, dimensionsberäkning,
  specifika observationer, kombinationsregler och återkommande mönster.
- Åtta rapportavsnitt, exakt en fri insikt och tre svarsförankrade experiment när underlag finns.
- Rapporter och allt frågeinnehåll är frysta objekt; indata muteras inte.
- Tre syntetiska regressionsexempel från innehållsgodkännandet.

Detta är en headless domänmotor. Ingen publik sida, visuell testupplevelse,
betalningsknapp, produktregistrering eller Mina sidor-integration aktiveras.
Rapportmodellen innehåller rubriker och färdig text med underlag för senare rendering.
Ett frågesvar är ett val i ett tänkt sammanhang, inte bevis på en verklig livshändelse.

## API

Importera från `app/persona/_domain/index.ts`.

```ts
const selection = selectAdaptive(fixedAnswers); // exakt 34 färdiga svar
// Fråga användaren i selection.selectedIds-ordning.
const submission = {
  questionVersion: VERSIONS.question,
  reportVersion: VERSIONS.report,
  answers: [...fixedAnswers, ...sixAnswersInSelectionOrder],
};
const report = buildPersonaReport(submission);
const answerHistory = describeAnswers(submission);
```

`0..4` kodar självskattningarnas fem alternativ. Scenarier använder `0..3`
för A–D. `UNKNOWN=5` är ett aktivt Svårt att bedöma-svar för båda formaten.
Ett obesvarat fält är inte samma sak som UNKNOWN. Parsern accepterar inte
ofullständiga svar, strängar, NaN, luckor eller scenarioalternativ 4.

Inlämningen får endast innehålla `answers`, `questionVersion` och `reportVersion`.
Klientvalda fråge-ID:n, poäng, upplåsningsflaggor och rapportobjekt accepteras inte.
Serveranvändaren ska alltid anropa samma parser och urval före leverans.
Motorn ensam ger inga betalrättigheter.

### Ändrade grundsvar

`reconcileAdaptive(previousSubmission, nextFixedAnswers)` räknar om urvalet.
Samma fråge-ID behåller sitt tidigare svar även om ordningen ändras. Nya ID:n
får `null` (obesvarat); borttagna ID:n redovisas separat. Ett bevarat UNKNOWN
är fortfarande ett svar. Funktionen gäller tidigare kompletta versionerade utkast.
En kommande test-UI behöver hantera pågående, ofullständiga utkast separat.

## Adaptivitet

Den låsta tabellen i `v1/adaptive.ts` ger varje kandidat 6 poäng för två matchade
ingångar plus 2 för minst en matchad ingång: alltså 0, 2 eller 8. UNKNOWN matchar
aldrig en ingång, inklusive P32-regeln som bara accepterar 3 eller 4.

Alla möjliga sexuppsättningar jämförs. Minst fyra teman måste representeras och
högst två frågor får komma från samma tema. Högst sammanlagd poäng vinner.
Lika poäng avgörs med lägst sorterad ID-sekvens. Visningsordning är fallande poäng,
sedan stigande ID. Inga lokalberoende sorteringar, klockor eller slump används.

Urvalet returnerar även varje kandidats poäng, matchade svar och reservstatus.
En reservfråga är inte belägg för att ett starkt individuellt mönster identifierats.
Poängen är redaktionella regler, inte ett skattat psykometriskt informationsvärde.

## Analys och spårbarhet

Dimensioner använder endast tre egna skattningsfrågor vardera. Omvänd kodning
är `4 - svar`. Med tre giltiga svar ger summa 0–4 lägre riktning, 5–7 mellanläge
och 8–12 högre riktning. Två svar ger begränsat underlag utan en samlad riktning;
färre än två ger inget orienteringsvärde. Skillnad på minst tre kodade steg
redovisas som variation. UNKNOWN ersätts inte och ingår inte i nämnaren.

Scenarierna har ingen moralisk rangordning och inget sammanlagt personlighetspoäng.
Varje svar har en egen redaktionell observation. Kombinationsregler kopplar samman
bestämda svar. Breda mönster kräver minst tre oberoende frågor, minst två fasta.
Nyanserande svar redovisas i `counterEvidence` där regeln definierar sådana.

Varje personlig rapportparagraf hänvisar till `findingIds`. Varje fynd har
regel-ID, konkret `questionId` och ursprungligt numeriskt svar, samt eventuell
nyansering. Metodtext är separat märkt. Experiment och möjliga kostnader är
villkorliga förslag med eget svarsstöd, inte påståenden om observerad skicklighet
eller ett fastställt problem. Inga förklaringar om barndom, diagnoser eller
hemliga motiv läggs till.

`quality.eligible` kräver minst tio bedömbara fasta scenarier och minst fyra
dimensioner med två bedömbara svar. Även otillräckligt underlag returnerar en
transparent rapportmodell, med varning och utan gissade egenskaper. En framtida
köp-/leveransintegration måste själv kontrollera eligibility innan köp erbjuds.

Rapportens huvudporträtt kombinerar specifika fynd och andra observationer med
nytt svarsstöd. Samtliga sex bedömbara följdsvar används i synliga avsnitt.
Huvudporträttet är regelbaserad redaktionell text, inte generativ AI.
De tidigare tre handskrivna exempelrapporterna är innehållsförebilder;
motorn ger inte en ordagrann kopia av dem.

## Versioner

Första kodversionen: `persona-questions-v1`, `persona-report-v1`,
`persona-analysis-v1`, `persona-adaptive-v1`, innehåll `persona-creative-revision-v1`.
V1 importerar sitt eget manifest. `registry.ts` väljer en uttryckligen känd
fråge-/rapportkombination; okända versioner nekas. Återöppning räknar om från
exakt samma versions innehåll och regler. Ingen oskyddad separat rapportkopia behövs.

Vid framtida ändring: lägg till en ny versionsmapp och registerpost. Behåll den
gamla implementationen, dess manifest och tester. Ändra inte bara aktuell alias
eller versionsetiketten på gammalt innehåll. Testernas SHA-256-fingeravtryck
låser denna första versions centrala material; det ska inte uppdateras automatiskt
som en del av den vanliga testkörningen.

Etablerade personlighetsbegrepp är en teoretisk orientering, inte ett påstående
att de nyskrivna indikatorerna är en validerad IPIP- eller BFI-skala.
Bakgrund: https://ipip.ori.org/newBigFive5broadKey.htm

## Lokala kontroller

Med installerade projektberoenden:

```powershell
node scripts/test-persona-stage1.cjs
```

I den isolerade arbetskopian kan installerade, skrivskyddade beroenden återanvändas:

```powershell
$env:NODE_PATH = 'C:\src\relationsvarning-github\node_modules'
node scripts/test-persona-stage1.cjs
node C:\src\relationsvarning-github\node_modules\eslint\bin\eslint.js --config C:\src\relationsvarning-github\eslint.config.mjs app/persona/_domain scripts/test-persona-stage1.cjs
```

Köraren typkontrollerar endast den nya rena domänen och startar sedan Node-tester.
Barnprocesserna får bara OS-/sökvägs-/tempvariabler och NODE_PATH; inga applikations-
eller produktionsnycklar förs vidare. Testprocessen blockerar HTTP, HTTPS, fetch,
TCP och TLS före modulimport. Varken Next-start, dotenv, Supabase, Stripe, Resend,
bygge med postbuild eller externa integrationsprov körs.

Sviten täcker frågebank, alla adaptiva ingångar, en oberoende optimeringsoracle,
tre godkända regressionsprofiler, alla 125 kodade kombinationer i en dimension,
varje enskild skattningsnyckel, varje scenarioalternativ, alla adaptiva kandidaters
nåbarhet och svar, negativa parserfall, UNKNOWN, gränsvärden, spårbarhet,
serialisering, versionsåterläsning, redigering, oföränderlighet och beroendegräns.

## Återstående etapper

Visuell mobilupplevelse och utskrift, produktregistrering, Stripe, Mina sidor,
versionsval i befintliga läsare samt leverantörsintegration ingår inte här.
De kräver separat godkänd koppling och säker testkonfiguration för Stripe,
Supabase/Auth, Resend och relevanta lagrings-/raderingsberoenden. Befintlig
betalningsverifiering accepterar live mode och får inte testas genom att bara
byta nycklar. Ingen produktion aktiveras av denna leverans.
