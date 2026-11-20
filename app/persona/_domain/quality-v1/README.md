# PERSONA – isolerad kvalitetsgrind v1

Deterministisk redaktionell policy: `assessReportQuality(answers)`.
Inte aktiverad i rapport, förhandsgranskning, köp eller kundflöde. Äldre generatorer förblir oförändrade.
Utdata är versionsbundna till quality-v1 och aktuell V6-innehållsversion.
Alla profiler är konstruerade testfall, inte representativa kunder.

## Vad som bedöms

Tillståndet gäller informationsvärdet i den rapport V6 faktiskt bygger, inte om en personlighet är giltig, normal eller önskvärd. Neutrala/låga/höga/motriktade svar är giltiga svar. Ingen arketyp krävs. Inget krav på stark dimensionsriktning införs.

Motorn tar högst 40 svar och skapar en privat 40-positioners kopia. Heltalen 1–5 räknas som giltiga. Noll, null, undefined och utelämnade positioner behandlas som saknade. Andra värden särredovisas som ogiltiga och blir obesvarade endast i den privata analyskopian. Fler än 40 värden eller annat än array avvisas. Originalet och befintlig poängsättning ändras inte.

V6 byggs alltid från samma normaliserade svar. Ingen extern rapport kan injiceras.
För varje dimension redovisas giltiga svar, befintlig tolkningsriktning, omvänt kodade värden, höga/låga/neutrala värden, variationsbredd och största andel som pekar högt eller lågt. Den sista andelen är en beskrivning, inte reliabilitet eller en psykologisk sannolikhet. Olika frågor inom en dimension kan mäta olika aspekter.

## Meningsfullt individuellt innehåll

Ett block måste ha tolkningstext och minst två unika underlags-ID vars giltiga svar stämmer exakt med indata. Porträttet måste dessutom ha minst ett spårbart påstående utöver den generella reservtexten med ID no-simple-label. En rubrik, not eller generellt avstående räknas inte som ett innehållsblock.

En insikt räknas bara när dess ID också finns bland insiktsmotorns valda insikter. Resurser och råd räknas från rapportens faktiska, underbyggda block. Varje avsnitt visar vilka block som räknats respektive uteslutits.

Kontrollen återanvänder V6:s faktagranskade texter och underlag. Den granskar inte textens betydelse med en språkmodell och bevisar inte vetenskaplig validitet. En felaktigt kodad framtida V6-text med två spårbara svar kan därför passera strukturellt.

## Exakta beslutsvillkor

### insufficient

Minst ett av följande minimikrav faller:
- Minst 24 giltiga svar.
- Minst fyra dimensioner har minst fyra giltiga skalfrågor vardera.
- Minst tre av sex avsnitt har meningsfullt individuellt innehåll.
- Minst fyra meningsfulla block totalt.
- Minst sex olika fråge-ID stöder de meningsfulla blocken.
- Minst en underbyggd styrka ELLER en vald analysinsikt.
- Minst ett relevant råd.
- Reservationsandelen är högst 50 procent.

### ready

Samtliga minimikrav ovan och samtliga följande villkor uppfylls:
- Minst 36 giltiga svar och inga ogiltiga värden.
- Alla fem dimensioner har minst fyra giltiga skalfrågor.
- Alla sex avsnitt har meningsfullt individuellt innehåll.
- Minst två styrkor och två råd.
- Minst en vald kombinationsinsikt.
- Svarsmönstret är inte enbart råa ettor eller enbart råa femmor i alla 40 positioner.

### limited

Alla minimikrav uppfylls men ett eller flera ready-villkor faller.
Det innebär användbart men begränsat rapportinnehåll, inte automatiskt godkänt för köp.
Enbart råa ettor/femmor medför försiktighet, inte att personen eller svaren förklaras felaktiga.
Motriktade dimensionssvar i sig medför ingen spärr.

### Reservationsandel

Antal tecken i metodtext + alla avsnittsnoter + alla specifika reservationer + tolkningstexten för uteslutna block, dividerat med samma mängd plus observation/tolkning/exempel/rådsförankring i räknade individuella block.

Rubriker räknas inte. Generella avståenden räknas inte som personlig analys även om deras underlagsfält listar många frågor. Andelen är en transparent strukturproxy, inte en semantisk klassificerare. Inga ordantal används i beslutet. Trösklarna är preliminära produktkriterier, inte empiriskt kalibrerade gränsvärden.

## Resultat för de 24 profilerna

Alla har 40 giltiga svar. Avsnitt betyder avsnitt med individuellt innehåll; övriga avsnitt finns men är huvudsakligen avstående.

| Profil | Bedömning | Avsnitt | Insikter | Styrkor | Råd | Avgörande faktor |
|---|---|---:|---:|---:|---:|---|
| F01 | ready | 6 | 3 | 3 | 3 | Alla villkor uppfyllda |
| F02 | ready | 6 | 3 | 3 | 3 | Alla villkor uppfyllda |
| F03 | ready | 6 | 2 | 3 | 3 | Alla villkor uppfyllda |
| F04 | ready | 6 | 2 | 3 | 3 | Alla villkor uppfyllda |
| F05 | ready | 6 | 2 | 2 | 2 | Alla villkor uppfyllda |
| F06 | ready | 6 | 2 | 2 | 3 | Alla villkor uppfyllda |
| F07 | ready | 6 | 2 | 2 | 3 | Alla villkor uppfyllda |
| F08 | ready | 6 | 1 | 3 | 3 | Alla villkor uppfyllda |
| F09 | ready | 6 | 1 | 3 | 3 | Alla villkor uppfyllda |
| F10 | ready | 6 | 2 | 2 | 3 | Alla villkor uppfyllda |
| F11 | ready | 6 | 1 | 2 | 3 | Alla villkor uppfyllda |
| F12 | ready | 6 | 1 | 2 | 2 | Alla villkor uppfyllda |
| F13 | limited | 5 | 3 | 2 | 3 | Relationsavsnittet saknar individuellt innehåll |
| F14 | ready | 6 | 3 | 3 | 3 | Alla villkor uppfyllda |
| F15 | ready | 6 | 3 | 2 | 3 | Alla villkor uppfyllda |
| F16 | limited | 3 | 1 | 0 | 1 | Individuella insikts-, relations- och rådsavsnitt; styrkor och nyanserat porträtt saknas |
| F17 | ready | 6 | 2 | 3 | 3 | Alla villkor uppfyllda |
| F18 | ready | 6 | 1 | 3 | 3 | Alla villkor uppfyllda |
| F19 | limited | 5 | 0 | 3 | 3 | Låga värden är samstämmiga; kombinationsinsikt saknas |
| F20 | ready | 6 | 3 | 3 | 3 | Alla villkor uppfyllda trots genomgående höga dimensioner |
| F21 | insufficient | 2 | 1 | 0 | 1 | Två block/avsnitt, tre unika underlagsfrågor, 59 procent reservationer |
| F22 | limited | 4 | 3 | 0 | 3 | Avgränsade användbara insikter; styrkor saknas och råa svar är enbart femmor |
| F23 | insufficient | 0 | 0 | 0 | 0 | Inga individuella block; helt generell/avstående rapport |
| F24 | insufficient | 0 | 0 | 0 | 0 | Alla svar är giltiga mittsvar; generatorn levererar ingen individuell analys |

Summa: 17 ready, 4 limited, 3 insufficient.
F19 får inte etiketten insufficient på grund av låga värden.
F22:s råa femmor är något annat än F20:s genomgående höga, omvänt kodade dimensioner.
F16 och ytterligare ett separat balanserat testfall har inga tydligt höga/låga dimensionsriktningar men passerar minimikraven.

## Falska positiva och falska negativa

Ingen empirisk felklassificeringsfrekvens kan beräknas från dessa syntetiska profiler utan oberoende facit.

- Ingen identifierad ready-felklassificering i den strukturella genomgången av de 24 rapporterna. Det är inte ett påstående om verifierad precision.
- F13 kan vara ett konservativt negativt fall för ready: tre insikter och användbar rapport men ett svagt relationsavsnitt. Den blockeras inte som insufficient.
- F19 kan också vara ett konservativt negativt fall för ready: rapporten har användbart innehåll men saknar en del av det utlovade erbjudandet.
- F16 har användbart smalt innehåll; limited är inte ett löfte om tillräckligt värde för ett köp.
- F24 och F23 är inte felaktiga personer eller nödvändigtvis informationsfattiga i verkligheten. Generatorns oförmåga att beskriva deras svar kan vara ett falskt negativt resultat om grinden felaktigt tolkas som ett mått på personens beskrivbarhet.
- Framtida duplicerade/semantiskt tunna block skulle kunna blåsa upp innehållsmåtten. Redaktionell granskning och befintliga innehållstester behövs fortsatt.
- Ett ordlångt avstående är uttryckligen testat: mycket extra text ändrar inte klassificeringen till ready.

## Högst fyra kompletteringar – endast förslag

Modulen lämnar versionsbundna förslag vid insufficient. De ingår inte i frågebanken, kundflödet, poängsättningen eller V6. Inga svar på dem analyseras ännu.

Prioritet:
1. Vid saknade svar: erbjud frivilligt att återbesöka befintliga frågor.
2. Vid minst 15 mittsvar: fråga vad mittalternativet brukar betyda. Val: ungefär till hälften / varierar med situation / osäker på bedömningen / något annat.
3. Be om två nyliga tillfällen med andra och vad som var likt eller olika i deltagandet.
4. Be om en liten situation personen är nöjd med och vad personen gjorde som hjälpte.
5. Om plats finns inom fyra frågor: be om en självvald sak att underlätta eller bevara och ett konkret tillfälle.

För F24 blir det mittalternativets betydelse, socialt sammanhang, självuppgiven resurs och självvald prioritering.
För F21/F23 blir det sammanhang, resurs och prioritering (tre frågor räcker; ingen fjärde fylls på).
Inget förslag kräver starkare skattning eller antar att personen behöver förändras.
Ett enskilt exempel belägger inte en generell förmåga eller orsak.

För att använda kompletteringarna senare krävs separat samtyckt flödesdesign och dokumenterad, spårbar tolkning av svaren. De uppgraderar inte nuvarande klassificering automatiskt.

## Köra och rekommendation

Test: node --require ./tests/persona/network-guard.cjs --test ./tests/persona/quality-v1.test.cjs

Audit: node scripts/audit-persona-quality-v1.cjs [utdatakatalog]
Utan katalog skrivs endast sammanfattning till standardutdata. Med katalog skapas assessments.json med samtliga beslutsvillkor, avsnittsbedömningar, dimensionsdiagnostik och kompletteringsförslag per profil.

Behåll modulen fristående tills trösklar, särskilt limited, har godkänts redaktionellt och provats med samtyckta användare. Koppla inte till köp enbart utifrån denna syntetiska granskning. Lös rapportluckor före en eventuell betalspärr; annars riskerar balanserade profiler att få sämre produktutbud. En framtida kommersiell policy bör ha en användbar gratis återkoppling för insufficient och aldrig ta betalt för ett på förhand känt avstående resultat.

## Verifiering i detta uppdrag

33 nya kvalitetstester passerar. Tillsammans med befintliga PERSONA- och äldre domäntester: 167/167 godkända. TypeScript, ESLint för app/persona, tests/persona och auditskriptet samt fullständigt Next.js-bygge (160/160 statiska sidor) passerar. Bygget kördes i separat kopia utan .env-filer eller leverantörsnycklar. Befintlig Node DEP0205-varning förekom.

SHA256-kontroll av de 887 filer som fanns före uppdraget: noll ändringar. Endast modul, denna dokumentation, auditskript och ny testfil tillkom. Ingen commit, push, deployment eller koppling till förhandsgranskning/kundflöde.
