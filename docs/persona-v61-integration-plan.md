# PERSONA V6.1 – integrationsbeslut och genomförandeplan

Status: beslutsunderlag på codex/persona-stage1. Ingen kundintegration, commit, push eller deployment genomförd.
Projekt: C:/src/relationsvarning-github.
Denna plan ersätter inte äldre produktdokumentation eller V5.

## 1. Vad som avslutats här

Fyra kompletteringar och deras svarsalternativ behålls exakt. Inga nya skalfrågor, ändrade Big Five-poäng eller ändrade insiktsaktiveringar.

Slutlig kompletteringsmodell: persona-supplement-v1, innehåll persona-supplement-content-v1.1.
Ny isolerad erbjudandepolicy: persona-offer-policy-v1.

Rotorsaken till svagare icke-social täckning var att S02 uttryckligen gäller kommunikation, medan S04 också kan gälla att börja en uppgift eller bevara en rutin. Att behandla S02 som ett mått på genomförande vore ett påhittat samband.

Den befintliga kontextregeln har därför kompletterats med en snäv gren:
- S02 anger en konkret form för att uttrycka sig.
- S03 anger en nylig erfarenhet av att be om hjälp/förtydligande.
- S04 anger start eller bevarande.
Då kan rapporten beskriva hur personen, OM ett besked från någon annan behövs, kan använda den valda kontaktformen för en konkret fråga. Den påstår inte att personen behöver hjälp, saknar självständighet eller har svårt att genomföra uppgifter.

S02 + S03 + S04 spåras. Resursen och dess övning räknas fortfarande bara som en gemensam innehållsenhet. Vid små steg, lyssnande eller alternativa arbetssätt utan uppgift om att be om hjälp görs ingen sådan ny koppling. Att bevara något fungerande är ett lika giltigt mål som förändring.

Exempel med F21:
| Komplettering | Tidigare | Nu | Orsak |
|---|---|---|---|
| Konkret kontaktform + bad om förtydligande + börja en egen sak | insufficient | limited | Ny underbyggd kontext, sammanlagt fyra innehållsenheter och sex frågeunderlag |
| Skriva i lugn och ro + bad om förtydligande + bevara rutin | insufficient | limited | Samma avgränsade koppling för bevarande |
| Konkret kontaktform + små steg + bevara rutin | insufficient | insufficient | Inget stöd för att kommunikationsformen behövs; ingen kontext hittas på |

F23/F24 får mer avgränsat innehåll av den nya grenen men förblir insufficient. Ingen komplettering kan skapa ready. Det är ett ärligt kvarstående resultat, inte något som ska lösas med utfyllnad eller extrema svar.

## 2. Låst kvalitetsbeteende

Implementerat separat i app/persona/_domain/supplement-v1/offer.ts. Inte anslutet till verkliga köp.

| Tillstånd | Information | Komplettering | Framtida fullständigt premiumerbjudande |
|---|---|---|---|
| ready | Sex individuella delar, faktiska innehållsantal | Behövs inte | Kvalitetsmässigt tillåtet; köp kräver fortfarande serververifierad betalningsarkitektur |
| limited | Namnger delar med individuellt innehåll, saknade delar samt antal insikter, resurser och råd | Endast vid en lucka de befintliga frågorna faktiskt kan berika | Inte tillåtet som fullständig sexdelad premiumrapport |
| insufficient, ej kompletterat | Frivilligt erbjudande om högst fyra frågor samt möjlighet till gratisresultat | Ja | Blockerat |
| insufficient, efter komplettering/avstående | Kort, respektfullt gratisresultat; inga anklagelser om felaktiga svar | Kan återbesökas frivilligt | Blockerat |

Konservativ lanseringspolicy: endast ready får säljas som den fullständiga premiumrapporten för 79 kr. Limited presenteras sakligt men har inget köptillstånd. Om ett separat, tydligt begränsat betalalternativ senare önskas krävs ett nytt uttryckligt produktbeslut; det är inte implementerat eller förutsatt här.

F13, F16 och F22 får nu relevanta frivilliga kompletteringar. F19 saknar en kombinationsinsikt som dessa fyra frågor inte kan skapa i den validerade insiktsmotorn; därför erbjuds ingen verkningslös komplettering för just den luckan. Ready får inga extra frågor. Råd begränsas till tre även när en redan limited rapport kompletteras.

Den isolerade modellen har alltid allowCheckout=false. fullPremiumOfferAllowed anger enbart vad en framtida serverpolicy får erbjuda; det är aldrig ett betalningsbevis. Frågesvar, köpstatus och behörighet får inte tas från klientflaggor.

## 3. Befintlig arkitektur – verifierade kopplingspunkter

| Del | Exakt befintlig fil | Nödvändig integrationsändring senare |
|---|---|---|
| 40 frågor och poäng | app/persona/_domain/v3/questions.ts; app/persona/_domain/v3/score.ts | Ingen. Samma questionVersion och poängsättning behålls. |
| Versionsval | app/persona/_domain/registry.ts; app/persona/_domain/versions.ts; app/persona/_domain/index.ts; app/persona/_domain/types.ts | Lägg till en uttrycklig kundversion och typad versionerad indata/rapportunion. Behåll samtliga gamla registerposter. Byt aktiv nyförsäljningsversion först sist. |
| V6.1 | app/persona/_domain/v6/index.ts; manifest.ts; report.ts | Återanvänd motorn genom en fryst releaseadapter. Ingen omskrivning av frågebank, poäng eller V5. |
| Kvalitet och komplettering | app/persona/_domain/quality-v1/index.ts; app/persona/_domain/supplement-v1/index.ts; offer.ts | Anropas av en ny servergemensam releaseadapter; inte direkt som klientbehörighet. |
| Testflöde och lokal lagring | app/persona/test/PersonaFlow.tsx; state.ts; session.ts | Separat frivillig kompletteringsfas efter 40 svar, versionsbunden lokal lagring, tillbaka/redigering och ogiltigförklaring av gammalt erbjudandebeslut vid ändrat svar. Behåll de 40 frågorna och 350 ms-navigationen. |
| Gratisresultat | app/persona/test/actions.ts | Ny servergren för releaseversionen: beräkna analys/kvalitet, returnera endast tillåtet gratisresultat och erbjudandebeskrivning. Skicka aldrig hela rapporten före verifierat köp. V5-grenar behålls. |
| Betalvägg | app/persona/test/PersonaPaywall.tsx | Visa 79 kr och köpknapp endast för serverbedömd ready; limited får saklig innehållsbeskrivning, insufficient får reservväg. Klientens spärr är endast UX. |
| Klientens köpstart | app/_lib/testAccounts/directClient.ts:90 | Befintlig serververifierad Checkout återanvänds. Samma anrop kan bära den nya versionerade indataformen; inga Stripe-URL:er eller köpbevis skapas lokalt. Ändra endast om typningen kräver det. |
| PERSONA-adapter | app/_lib/testAccounts/adapters/persona.ts | Ny releaseparser som gör samma kvalitetsbedömning på servern före köp. Nu returnerar parse endast number[], vilket inte räcker för kompletteringslagring. |
| Adapterkontrakt | app/_lib/testAccounts/adapter.ts:20 | Minsta utökning: valfri produktspecifik serializer för PERSONA. Övriga produkter behåller sin parse/calculate-väg oförändrad. |
| Krypterad lagring | app/_lib/testAccounts/store.server.ts:27 | Bevara hela validerade PERSONA-kuvertet, inte bara answers. Nu rekonstrueras endast answers/questionVersion/reportVersion före kryptering. |
| Betald återöppning | app/_lib/testAccounts/service.server.ts:17 | Versionerad avkodning av nya kuvert. guestConsent-grenen får inte kasta bort kompletteringar/versionsfält. Behåll ägar-, besittnings-, raderings- och betalningskontroller. |
| Svarsbeskrivning | app/_lib/testAccounts/answerDescriptions.ts | Beskriv kompletteringar utifrån sparad kompletteringsversion, separat från 40 skalfrågor. Gamla resultat får ingen tom ny frågelista. |
| Rapportval i Mina sidor | app/mina-sidor/tester/ReportView.tsx:35 | Dispatch på sparad rapportversion inom persona_test. Nu används bara den äldre PersonaReportView. V5 måste fortsätta gå till exakt sin renderer. |
| Kontovy/gästvy | app/mina-sidor/DirectAccountPortal.tsx; app/mina-sidor/tester/[test]/[id]/page.tsx; app/mina-sidor/gast/[test]/[id]/page.tsx | Återanvänd verifierad öppning och frivilligt sparande. Generiska sidor behöver normalt ingen ändring om rapportdispatch och svarstyper behålls kompatibla. Testa båda transportvägarna. |
| V6-presentation | app/persona/dev-report-v6/PersonaV6Report.tsx | Flytta den rena renderern/projektionen till ny app/persona/report/PersonaV6ReportView.tsx. Utvecklingsvyn får importera den. Kundkod får aldrig importera fixtureladdare eller utvecklingsroute. Behåll den äldre PersonaReportView oförändrad. |
| Utskrift/PDF | app/persona/report/PrintPersonaButton.tsx; report.module.css | Återanvänd window.print och befintlig utskriftsdesign. Prova den nya renderern med A4, långa rubriker och korta rapporter. |
| Backendpaketering | scripts/build-customer-edge.cjs; supabase/functions/customer-tests/index.ts | Generera och verifiera backendpaketet från samma kanoniska releasekod i isolerad kopia. Ingen manuell dubbelimplementering och ingen publicering i detta steg. |

Ytterligare föreslagna nya filer vid implementation: app/persona/_domain/release-v61/submission.ts, manifest.ts och index.ts; app/persona/test/PersonaSupplement.tsx; app/persona/report/PersonaV6ReportView.tsx. Namnen är planerade, inte skapade.

## 4. Exakt framtida dataflöde och integrationsordning

### Steg A – frys versioner och indata före UI

1. Definiera en ny offentlig releaseidentitet, exempelvis persona-report-v61-release1. Aktiva V5 och alla äldre identiteter fortsätter resolvas oförändrat.
2. Lås exakt frågeversion, analysversion, insiktsmotor/katalog, V6-innehåll, kompletteringsfrågor/innehåll, kvalitets- och erbjudandepolicy i en release-manifestfil. Versionsträngar utan bevarad implementation räcker inte; äldre implementationer måste kunna köras.
3. Använd ett strikt kuvert med answers[40], questionVersion, reportVersion samt ett separat supplement-objekt med version, contentVersion och S01–S04. Frånvaro av supplement är giltigt. Okända versioner/fält/alternativ avvisas.
4. Betalningsstatus, ready och tillgång till rapporten tas aldrig emot som sanning från klienten. Servern beräknar dem.
5. Spara bara de kompakta svaren och releaseidentiteterna. Befintlig crypto.server.ts:18 avvisar ciphertext över 8192 tecken. En hel rapport på 900–1400 ord plus spårbarhet kan överskrida gränsen och får inte stoppas in där. Testa maxstorlek på det nya kuvertet; ändra inte kryptogränsen slentrianmässigt.

Godkännandekrav: V1–V5 går att öppna byte-identiskt enligt befintliga regressioner; ny release klarar serialisering/kryptering/avkodning utan förlust av S-svar.

### Steg B – en gemensam serverberäkning

1. Releaseadaptern validerar de 40 svaren och valfria kompletteringar.
2. Bygg V6.1 och kvalitetsbedömning från samma validerade indata.
3. ready ger endast en gratis insikt + tillåtet fullständigt erbjudande i den offentliga serverresponsen.
4. limited ger faktisk innehållsförteckning, begränsningar och endast relevanta frivilliga kompletteringar. Ingen full premiumförsäljning enligt låst v1-policy.
5. insufficient erbjuder komplettering eller ett gratisresultat. Efter otillräcklig komplettering: enbart reservväg och köp blockerat.
6. Ingen premiumtext, underlagstabell, rapportobjekt eller lokal upplåsningsmekanism får följa med gratisresponsen eller dess RSC/HTML.

Godkännandekrav: manipulerade klientflaggor, gamla previewbeslut och främmande rapportversioner kan inte starta ett nytt köp. Redigering av originalsvar räknar om alla beslut.

### Steg C – bevara hela underlaget före Stripe

1. Adaptern gör serverns ready-kontroll på nytt vid köpstart, innan Stripe-anrop.
2. store.createAttempt krypterar det kompletta normaliserade kuvertet. En valfri PERSONA-serializer i adapterkontraktet kan åstadkomma detta utan att ändra övriga produkters payload.
3. directHandler.server.ts:92 anropar redan model.parse före prisuppslag och Checkout. Den ordningen återanvänds. Därmed behövs ingen förändring av Stripe-protokoll, pris, URL:er eller Payment Links.
4. Behåll produkten persona_test, 7900 öre, engångsköp, allowlistade priser, idempotens, besittningsbevis och existerande samtycken.
5. Serviceavkodningen måste behålla supplement även när guestConsent finns. Nu skapar service.server.ts:24 ett nytt objekt med bara de tre gamla fälten.

Godkännandekrav: insufficient/limited nekas före externa betalningsanrop; återförsök/dubbelklick skapar inte dubbla försäljningar; avbrutet köp bevarar svar utan rapportåtkomst. Gamla pris-ID:n får ligga kvar i historisk allowlist.

### Steg D – leverans, återöppning och frivilligt konto

1. Köpstart låser en specifik release och indata; ändrade lokala svar efter köp ändrar inte den köpta rapporten.
2. Gäst- och kontoläsning behåller nuvarande verifyPayment, ägar-/besittningskontroll, raderingsjournal och utgångstider.
3. Läs sparad version från posten och använd dess frysta release. Kör inte den senaste nya försäljningsgrinden retroaktivt på V5 eller redan köpta resultat.
4. service.save krypterar redan checked.data på nytt för kontot. Säkerställ att det nya kuvertet följer med utan bortfall och att separat lagringssamtycke kvarstår.
5. Återbetalning/tvist ska fortsätta nekas av befintlig verifierare vid nästa serverläsning. Betalt statusvärde i URL, e-post eller localStorage ger aldrig tillgång.
6. Ingen migrering, massomräkning eller radering av äldre kundresultat behövs för denna integration.

### Steg E – PDF och nedladdning

Befintlig funktion är webbläsarutskrift/Spara som PDF, inte en separat genererad PDF-fil eller publik nedladdningsadress. Den kan återanvändas efter verifierad rapportöppning. Ge inga löften om ny servergenererad PDF utan ett separat krav.

Om en riktig nedladdningsroute senare behövs måste den göra samma serverkontroller som rapportöppningen, returnera privat/no-store och aldrig använda en publik permanent filadress. Redan nedladdade eller utskrivna kopior kan inte återkallas vid återbetalning.

### Steg F – aktivering sist och möjlighet till återgång

Först efter alla grindar aktiveras en separat PERSONA-releaseflagga för nya köp och aktiva versionspekare. Gamla läsare förblir aktiva. Vid återgång stängs nya V6-erbjudanden; redan köpta V6-resultat fortsätter kunna öppnas med sin frysta läsare. Ingen ändring av Stripe, priser eller andra produkter ingår i aktiveringen.

## 5. Befintliga säkerhetsdelar som ska återanvändas

Följande behöver normalt ingen logikändring för innehållsintegrationen:
- app/_lib/testAccounts/payment.server.ts: serververifiering av session, belopp, produkt, pris, återbetalning och tvist.
- app/_lib/testAccounts/directHandler.server.ts: befintlig Checkout och auktoriserad läsning; ingen ny betalningsväg.
- app/_lib/testAccounts/directWebhook.server.ts och app/api/stripe/webhook/route.ts: nuvarande signatur-/leveranshantering.
- app/_lib/paymentProductCatalog.server.ts: befintlig produkt och historisk prisallowlist.
- app/_lib/testAccounts/crypto.server.ts: befintlig kryptering, kontextbindning och storleksgräns.
- app/_lib/testAccounts/directPublic.ts och directClient.ts: befintlig offentlig konfiguration och transport.
- supabase/functions/customer-tests/index.ts: kanonisk backend via genererat paket.

Viktigt: den nuvarande betalningskoden är uttryckligen live-only (payment.server.ts:15 och directHandler.server.ts:95). Befintliga lokala köpregressioner använder ett mockat SDK. De är inte ett genomfört Stripe Sandbox-köp. Riktig Sandbox-testning kräver en separat testadapter/konfiguration som förblir otillgänglig i produktionsbyggen, separat Supabase och test-Resend. Produktionskraven får inte sänkas för att få ett testköp att fungera. Detta är en kvarstående verifieringsgrind före lansering, inte genomfört arbete.

## 6. Risker och testkrav

| Risk | Obligatoriskt test före kundintegration |
|---|---|
| Kompletteringar tappas av number[]-adaptern eller guestConsent-rekonstruktionen | Krypterad roundtrip för hela kuvertet: köp → gäst → frivilligt konto → utloggning/återöppning; identiska S-svar och rapport |
| Ny kvalitetsgrind blockerar äldre betalda V5 | Öppna syntetiska redan köpta V1–V5 efter versionsbyte och rollback; inga nya grindkrav på gammal version |
| Ny renderer får gammalt/nytt objekt av fel typ | Versionsdispatch-test för samtliga stödda rapporttyper; inga tvingande typkast till V5 för V6 |
| Preview kan läsas gratis som full rapport | Inspektera HTML, RSC, gratis-JSON och klientpaket; inga premiumblock/fixturedata; förfalskade paid/unlocked/ready nekas |
| Limited säljs som full rapport | Policytest ready/limited/insufficient i både preview och köpserver; beskrivningen ska motsvara faktiska avsnitt och antal |
| Fel råd/duplicerad resurs | Alla 24 profiler + 756 kompletteringskombinationer; högst tre råd, ingen dubbelräkning av resurs/övning |
| Sena redigeringar/två flikar | Ändra svar efter preview, under komplettering och efter checkoutstart; köpt kuvert förblir fryst |
| Återbetalning, tvist, borttagen/utgången analys | Nekad ny läsning, inklusive PDF-route om sådan införs; gammal klientcache får inte bli ny behörighet |
| Oavsiktlig påverkan på andra produkter | Befintliga PERSONA-köp/åtkomsttester samt gemensamma testAccounts- och ADHD/autism/AuDHD-regressioner med gamla payloads |
| Backend och Next kör olika katalog/version | Generera Edge-paket i isolerad kopia; kör scripts/build-customer-edge.test.cjs och parity på resultat/avslag från båda miljöer |
| Rapport/PDF överlappar eller klipps | Mobil 390×844, desktop 1366×768 och 1440×900; A4-utskrift, långa rubriker och svagt resultat |
| Produktionsskydd bryts | Produktionsbygge: samtliga dev-previewvägar ger 404 även med utvecklingsflaggor; inga testprofiler i publika klientpaket |

## 7. Beslut och blockerare före genomförande

1. Godkänn denna försäljningspolicy: ready får fullständigt premiumerbjudande; limited får ärlig beskrivning och eventuellt komplettering, men säljs inte som hela premiumprodukten; insufficient säljs inte.
2. Godkänn en fryst kundrelease, kompakt kuvert och bevarade implementationer för alla innehålls-/analysversioner.
3. Implementera och verifiera förlustfri serialisering i store/service före betalväggsaktivering.
4. Lös isolerad verklig Sandbox-verifiering utan att försvaga den live-only kod som används för kunder.
5. Slutgranska språk och värde för de få kompletterade limited-resultaten. De nya observationerna är självuppgivna kontexter, inte validerade skalor.
6. Utför end-to-end-testerna ovan och ge uttryckligt slutgodkännande före push/deployment.

Det krävs ingen ytterligare omfattande frågeutveckling för att börja integrationen enligt denna ordning. F23/F24 har en fungerande gratis reservväg och får kvarstå som insufficient. Kvarstående täckningsskillnader ska redovisas, inte döljas genom sänkta kvalitetskrav.

## 8. Verifierat i detta uppdrag

- 188/188 tester godkända: 170 PERSONA-tester och 18 äldre domäntester. Kompletteringssviten har 21 tester, varav sex nya för riktad täckning och erbjudandepolicy. Testerna omfattar även 756 kombinationer och alla 24 grundprofiler.
- TypeScript godkänd: npx tsc --noEmit --incremental false.
- ESLint godkänd för app/persona, tests/persona och ändrat auditskript.
- Fullständigt Next.js-bygge godkänt: 160/160 statiska sidor. Separat kopia utan .env-filer eller leverantörsnycklar, med nätverksvakt. Befintlig Node DEP0205-varning förekommer.
- Lokal utvecklingsvy uppdaterad på http://127.0.0.1:60700/persona/dev-report-v6/supplement?profile=F21 . HTTP-verifierad för start och bevarande i F21/F23/F24: rätt limited-/gratisväg och ärlig begränsningsbeskrivning. Ingen ny visuell granskning eller PDF-export gjordes i detta uppdrag.
- Alla 24 ursprungliga klassificeringar är oförändrade utan komplettering: 17 ready, 4 limited, 3 insufficient. Frivilliga kompletteringar erbjuds för F13/F16/F21/F22/F23/F24, fortfarande högst fyra.
- SHA256-jämförelse av 899 befintliga filer: endast fem avsiktliga ändringar i kompletteringsmodul, dess dokumentation, lokal experimentvy, audit och testfil. Ny offer.ts och denna plan tillkom. Aktiva produkter, frågor, Stripe, lagring, V5, V6-generatorn och kvalitetsgrinden är oförändrade.
- Verklig Sandbox, ny kundlagring, kundrenderer, versionsregistrering och köpaktivering är planerade krav, inte genomförda funktioner.
- Ingen commit, push eller deployment.
