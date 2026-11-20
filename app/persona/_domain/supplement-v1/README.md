# PERSONA – Kompletteringsflöde v1

Isolerad modell och lokal utvecklingsvy. Ingen ändring av de 40 frågorna, V5, V6, insiktsregler, poängsättning, quality-v1, Stripe, betalvägg eller aktiva kundflöden. Frågorna nedan finns i en separat bank och är inte registrerade i testet.

## Informationsluckor

Alla tre kontrollprofiler har 40 giltiga svar. Att någon svarar jämnt eller nära mitten är inte i sig ett fel.

| Profil | Svarsmönster | Vad biblioteken/generatorn faktiskt ger | Typ av lucka |
|---|---|---|---|
| F21 | Värden i båda riktningar inom alla fem dimensioner | En avgränsad insikt och ett råd; generellt porträtt, inga styrkor eller relationsblock | Sammanhang saknas. Motriktade aspekter är inte bevis på felaktiga svar. Biblioteket och porträttet ger liten täckning av denna kombination. |
| F23 | Råa ettor på alla 40 frågor; efter omvänd kodning stora skillnader inom dimensionerna | Inga valda individuella block | Variation saknas i råa svar men finns efter kodning. Det kan finnas verkliga aspektskillnader, låg igenkänning eller annan tolkning. Orsaken är okänd. Biblioteket saknar matchande lågkombinationer och generatorn har en generell reservtext. |
| F24 | Råa treor på alla frågor; mitten även efter kodning | Inga valda individuella block | Ingen differentiering i de markerade graderna. Mitten kan betyda måttlig igenkänning, situationsvariation eller osäkerhet. Det är också en generatorbegränsning att ingen individuell mittprofil beskrivs. |

Information som kan tillföra något: vad skattningarna betyder för personen, ett självuppgivet sammanhang för kontakt, en resurs vid ett nyligt avgränsat tillfälle och en egen aktuell prioritering. Det ger inte stöd för att skriva om Big Five-värden eller hitta en dold arketyp.

## Fyra frivilliga frågor

Samtliga har dessutom Hoppa över / vill inte svara. Inget fritextfält eller identifierande kunddata används i experimentet.

### S01 – Vad passar bäst in på hur du svarade på de första frågorna?
- Svaren beskriver mig ungefär som jag brukar vara.
- Jag är olika i olika situationer.
- Flera påståenden var svåra att bedöma.
- Ingen av beskrivningarna passar riktigt.

Användning: en metodnyans i rapportens metodtext och gratis reservresultat. Ger inga personlighetspoäng, individuella analysblock eller fler underlagsenheter. Det går att behålla alla ursprungliga svar.

### S02 – I vilket sammanhang blir det oftast lättast för dig att säga det du vill?
- Med en person i taget.
- Bland människor jag känner väl.
- När jag kan skriva i lugn och ro.
- I ett spontant samtal.
- Sammanhanget gör ingen tydlig skillnad.
- Det vet jag inte riktigt.

Användning: en vald konkret kontaktform kombineras med S04 om prioriteringen gäller egen röst, betänketid inför ja eller en uppskattad kontakt. Det ger ett avgränsat relationsperspektiv. Ingen skillnad/osäkerhet blir inte en påhittad svårighet.

### S03 – Tänk på något litet du nyligen hanterade bra. Vad hjälpte mest just då?
- Jag lyssnade innan jag bestämde mig.
- Jag tog ett litet steg i taget.
- Jag bad om hjälp eller ett förtydligande.
- Jag prövade ett annat sätt.
- Jag kommer inte på något exempel just nu.
- Jag vet inte vad som hjälpte.

Användning: tillsammans med en konkret S04-prioritering ges en situationsbunden resurs och ett frivilligt experiment. Ett nyligt tillfälle görs aldrig till en generell förmåga. Inget exempel/osäkerhet ger ingen styrka eller övning.

### S04 – Vad vill du helst ge lite utrymme åt i vardagen just nu?
- Få fram vad jag själv vill.
- Ge mig tid innan jag tackar ja.
- Komma igång med något jag vill göra.
- Ge en kontakt jag uppskattar mer plats.
- Bevara en liten rutin som fungerar.
- Jag vill inte välja något att förändra nu.
- Det vet jag inte ännu.

Användning: avgör vilken självvald situation som relationsperspektivet och experimentet får gälla. Tjugo dokumenterade varianter kopplar de fyra resurserna till de fem konkreta prioriteringarna. Inget förändringsönskemål förutsätts. Bevara fungerar också. Inget val/osäkerhet ger inga nya sådana tolkningar eller råd.

## Analys och kvalitetsbedömning

completeReport(originalAnswers, supplementaryAnswers) bygger originalrapporten oförändrad och returnerar ett separat versionsbundet omslag med kompletteringar. Alla tillägg anger avsnitt, räckvidd, konkret S-fråga och valt alternativ, begränsning och innehållsgrupp.

Komplettering erbjuds när grundrapporten är insufficient och för limited när resurs/råd eller relationsinnehåll kan berikas av de befintliga frågorna. Utan kompletteringar behåller samtliga 24 profiler sin klassificering. F13, F16 och F22 erbjuds komplettering; F19 får ingen verkningslös komplettering för sin saknade kombinationsinsikt. Ready får inga kompletteringar.

Det sociala relationsperspektivet använder S02 + S04. Från innehåll v1.1 kan start/bevarande också få en snäv kommunikationskoppling när S03 uttryckligen anger en erfarenhet av att be om hjälp eller förtydligande; då används S02 + S03 + S04. Resursen och övningen använder S03 + S04. Resursen och dess övning tillhör samma innehållsgrupp och räknas en gång i mängd- och täthetsmåtten. S01 räknas inte som personlig analys. Befintliga V6-block bedöms precis som tidigare.

De befintliga minimikraven återanvänds: 24 giltiga grundsvar, fyra bedömbara dimensioner, tre individuella avsnitt, fyra innehållsenheter, sex olika underlagsfrågor, resurs eller insikt, minst ett råd och högst 50 procent reservationer. S-frågor räknas endast när de faktiskt används i ett genererat block. De räknas inte som nya Big Five-frågor och fyller inte ut saknade grundsvar.

Täthetsmåttet räknar originalmetod, kvarvarande noter, reservationer och generellt porträtt som tidigare. En avståendenot tas bort från ett avsnitt som faktiskt fått ett nytt block. Nya begränsningar räknas som reservationer. För resurs/övningsgruppen räknas den längsta texten en gång, så att extra rådstext inte blåser upp innehållet.

En kompletterad rapport kan högst bli limited. Modellen tillför kontextuella självuppgifter, inte validerade nya skalor eller generella kombinationsinsikter. Ingen ny aktivering av de 18 gamla insiktsreglerna görs.

## Simulerad effekt

Konstruerade testfall, inte representativa kunder. Informativ simulering: S01=context, S02=one, S03=small-step, S04=voice.

| Profil | Före | Efter | Individuella avsnitt före/efter | Innehållsenheter före/efter | Underlagsfrågor före/efter |
|---|---|---|---:|---:|---:|
| F21 | insufficient | limited | 2 / 4 | 2 / 4 | 3 / 6 |
| F23 | insufficient | insufficient | 0 / 3 | 0 / 2 | 0 / 3 |
| F24 | insufficient | insufficient | 0 / 3 | 0 / 2 | 0 / 3 |

Samtliga får tre nya renderade block, men resurs och övning delar underlag. Därför är det bara två nya innehållsenheter.

F21 har redan Q31, Q35 och Q28 bakom en insikt och ett råd. Med tre ytterligare använda S-frågor passerar den minimikraven; reservationsandelen sjunker från cirka 59 till 44 procent.

F23/F24 får relevanta lokala observationer, men fortfarande för få innehållsenheter och oberoende frågeunderlag. Reservationsandelen ligger runt 58 procent. Enbart tillagda textstycken eller S01-förtydligandet kan inte lösa detta. Fyra korta kompletteringar räcker inte med nuvarande bibliotek och policy för en bred premiumrapport.

Om samtliga frågor hoppas över eller inget konkret väljs skapas inga nya block och alla tre förblir insufficient. Om samma resurs kopplas till att bevara en rutin får F21 två nya renderade block men bara en ny innehållsenhet; även F21 förblir då insufficient. Målet är inte att styra till vissa val.

## Reservväg

När resultatet fortfarande är insufficient returneras ett kort gratisresultat och en uttrycklig förklaring: underlaget i denna analys räcker inte till en tillräckligt individuell premiumrapport; svaren är inte felaktiga; inget köp erbjuds.

Den lokala vyn visar då endast gratisresultatet och eventuellt ett avgränsat nytt perspektiv. Den renderar inte hela premiumrapporten. Alla experimentresultat har allowCheckout=false, även limited. Ingen befintlig betalvägg har ändrats.

## Lokal granskning och verifiering

Utvecklingsväg: /persona/dev-report-v6/supplement
Endast F21/F23/F24 från befintliga syntetiska fixtures används.
Samma strikta utvecklings-, opt-in-, loopback- och ursprungsskydd som den tidigare förhandsgranskningen. Produktionsbyggen returnerar 404.

Lokal server i denna granskning: http://127.0.0.1:60700/persona/dev-report-v6/supplement?profile=F21
Välj svar och tryck Visa vad svaren tillför. Hoppa över är standard i alla fyra frågor. Den vanliga V6-förhandsgranskningen är oförändrad.

Audit: node scripts/audit-persona-supplement-v1.cjs [utdatakatalog]
Test: node --require ./tests/persona/network-guard.cjs --test ./tests/persona/supplement-v1.test.cjs

Testningen omfattar alla 24 ursprungsprofiler, 756 kombinationer av S02–S04 för de tre insufficient-profilerna, samtliga 20 rådskombinationer, avstående, osäkerhet, ingen skillnad, inget förändringsönskemål, otillåtna svar, renderad reservväg och produktionsskydd.

## Rekommendation

Behåll modellen lokal. F21 visar att relevant komplettering kan ge användbart smalt innehåll. F23/F24 visar en kvarstående begränsning som inte bör döljas genom sänkta trösklar, extra utfyllnad eller extrema skattningar.

Före kundintegration behövs redaktionellt godkännande av de nya observationerna och råden, oberoende provning av limited-resultatets faktiska värde och ett beslut om hur generiska mitt-/motsvariga profiler kan beskrivas bättre från befintliga aspekter. Den befintliga grinden är en redaktionell policy, inte empiriskt kalibrerad. Kravet på sex olika underlagsfrågor påverkar utfallet och ska bedömas tillsammans med innehållets värde, inte ändras bara för att få dessa tre testfall att passera.

En senare integration måste dessutom lagra separata kompletteringsversioner och samtycken och koppla köp till serverbedömt resultat. Det görs inte här.

## Kvarstående täckningsbegränsning

S02 tillför ett socialt sammanhang. När S04 gäller att börja en egen uppgift eller bevara en rutin ger kombinationen inget nytt relationspåstående. Därför kan ett lika rimligt mål ge färre innehållsenheter. Det är en modellbegränsning, inte ett sämre svar eller en uppmaning att välja ett socialt förändringsmål. En eventuell framtida version behöver pröva en neutral, målrelevant kontextfråga även för dessa val; den här versionens täckning ska inte användas som incitament att byta svar.

## Slutlig verifiering

182/182 automatiska tester passerar: 164 PERSONA-tester inklusive 15 nya kompletteringstester samt 18 äldre domäntester. De 756 svarskombinationerna ingår i de nya testerna. TypeScript och ESLint för PERSONA och det nya auditskriptet passerar. Fullständigt Next.js-bygge passerar, med 160/160 statiska sidor genererade. Bygget gjordes i en separat kopia utan .env eller leverantörsnycklar. Befintlig Node DEP0205-varning kvarstår.

HTTP-verifiering av den slutliga koden: de tre profilerna testade med och utan informativa kompletteringar; korrekt gratis/premium-rendering i lokal vy, inga interna underlagsfält i HTML, otillåtna alternativ och profiler nekade, falska upplåsningsparametrar verkningslösa, främmande ursprung nekat. Produktionsbygget returnerar 404 även med utvecklingsflaggan på. Befintlig V6-förhandsgranskning svarar fortsatt 200.

Webbläsare: F21-formuläret genomfört till limited och kompletterad rapport; F23/F24 till gratis reservresultat. Mobil vid 390×844 kontrollerad utan horisontell överströmning. Befintlig statistikdialog kan visas över sidan; den är inte ändrad. Ingen ny PDF-export har manuellt granskats.

SHA256-jämförelse: alla 891 befintliga filer oförändrade. Åtta nya filer tillkom. Ingen commit, push, deployment eller betalningsintegration.

## Avslutad riktad förbättring – innehåll v1.1

Den icke-sociala luckan är delvis åtgärdad utan fler frågor: S03=asked och en konkret S02-form kan användas för start eller bevarande, villkorat av att ett besked från någon annan faktiskt behövs. Andra resursval får ingen påhittad kommunikationskoppling. F21 kan då nå limited; F23/F24 kvarstår som insufficient. Den tidigare beskrivningen av kvarstående täckningsbegränsning gäller fortfarande övriga icke-sociala kombinationer.

Ny separat offer.ts låser informationsbeteendet för ready/limited/insufficient. Ready kan kvalitetsmässigt erbjudas som full premiumrapport. Limited får en faktisk innehållsbeskrivning och relevanta frivilliga kompletteringar, men inget fullständigt premiumerbjudande. Insufficient får gratis reservresultat och köp blockerat. Alla verkliga betalningar förblir avstängda i experimentmodellen. Högst tre råd även efter komplettering.

Aktuell verifiering: 188/188 tester passerar, inklusive 21 kompletteringstester. TypeScript, PERSONA-ESLint och fullständigt Next.js-bygge med 160 statiska sidor passerar. Separat byggkopia utan .env eller leverantörsnycklar. Ingen kundintegration eller publicering.

Se docs/persona-v61-integration-plan.md för integrationsordning, exakta filreferenser, testkrav, äldre kundversioner och blockerare.
