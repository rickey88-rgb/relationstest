# AuDHD: ämnesstrategi för Relationsvarning

Senast uppdaterad: 2026-09-27

## Målet

Relationsvarning ska bli den tydligaste svenska resursen för vuxna som vill förstå ADHD och autism samtidigt. Strategin ska förena tre saker:

1. saklig och källförankrad information,
2. praktisk hjälp för vardag och relationer,
3. ett transparent självskattningsverktyg som aldrig framställs som diagnostik.

AuDHD är ett informellt begrepp, inte en separat diagnos. ADHD och autism ska beskrivas som skilda tillstånd som kan förekomma samtidigt. Ett självtest kan strukturera egna observationer men kan inte avgöra om någon har ADHD, autism eller båda.

## Vad projektet redan har

Det pågående klustret består av:

- `/audhd` – huvudhubb och begreppsförklaring
- `/audhd-test` – självskattning för vuxna
- `/adhd-eller-autism` – skillnader och överlapp
- `/adhd-och-autism-samtidigt` – samtidig förekomst
- `/audhd-symtom-vuxna` – vardagsmönster hos vuxna
- `/audhd-kvinnor` – variation, kompensation och synlighet
- `/audhd-masking` – masking och kompensationsstrategier

Det finns dessutom etablerade separata kluster för ADHD och autism. De ger AuDHD-klustret en bättre start än en fristående nischsajt skulle ha.

### Omedelbar kannibaliseringsrisk

Den befintliga sidan `/adhd-autism` och den nya `/adhd-eller-autism` har i praktiken samma jämförelseintention: skillnader, likheter och överlapp. De bör inte båda lanseras som indexerbara sidor i nuvarande form.

Innan publicering ska Search Console, befintliga bakåtlänkar och historisk trafik avgöra vilken URL som behålls. Om `/adhd-autism` redan har signaler är den sannolikt bättre som huvud-URL och det nya innehållet bör konsolideras dit. Om den saknar värde kan den omdirigeras permanent till `/adhd-eller-autism`. Canonical ensam är en sämre lösning än faktisk konsolidering när innehåll och intention är så lika.

## Vad sökresultaten visar

Den svenska resultatsidan är fortfarande relativt tunn för själva ordet AuDHD. De tydligaste kommersiella konkurrenterna är privata psykiatri- och utredningsaktörer. De kombinerar ofta en bred introduktion med konsultation eller utredning som slutmål. Informationsintentionen kan därför betjänas bättre med en oberoende struktur som också vågar förklara osäkerhet, alternativa förklaringar och vad ett webbtest inte kan visa.

De centrala sökintentionerna är:

- **Definition:** vad är AuDHD, är det en diagnos?
- **Självigenkänning:** AuDHD symtom, AuDHD test, ADHD eller autism?
- **Vuxenliv:** rutiner, fokus, sensorik, social energi och återhämtning.
- **Kvinnor och masking:** varför svårigheter kan vara mindre synliga utåt.
- **Utredning:** kan man utredas för båda, hur går det till och vart vänder man sig?
- **Praktisk hjälp:** arbete, studier, hem, relationer och överbelastning.

De första fyra täcks redan helt eller delvis. Utredning, vardagsstöd och relationer är de tydligaste luckorna.

## Medicinska och redaktionella gränser

- Skriv alltid att AuDHD är ett informellt ord för samtidig ADHD och autism.
- Beskriv inte ett särskilt “AuDHD-syndrom” med egna diagnoskriterier.
- Undvik prevalenstal utan population, metod och källa. Svenska vård- och insatsprogram anger ungefär 30 procent ADHD bland personer med autism och ungefär 15 procent autism bland personer med ADHD, men uppskattningar varierar mellan studier och urval.
- Skilj mellan kärnområden, associerade svårigheter och personliga erfarenheter.
- Masking får inte användas som bevis för autism och ska inte beskrivas som kvinnospecifikt.
- “Behov som krockar”, exempelvis struktur kontra variationsbehov, kan beskrivas som rapporterade erfarenheter. Det ska inte presenteras som ett validerat diagnostiskt kännetecken.
- Utmattning, sömnproblem, ångest, depression, trauma och stress kan påverka samma vardagsområden och måste nämnas som möjliga alternativa eller samtidiga förklaringar där det är relevant.
- Testet får kallas självskattning eller reflektionsunderlag. Det bör inte kallas validerat screeningtest om en egen valideringsstudie saknas.

## Den största förtroendeluckan

Detta är hälsorelaterat YMYL-innehåll. Nuvarande tekniska Article-schema anger organisationen som författare. För att bygga verklig auktoritet behövs:

1. en namngiven redaktionell författare,
2. medicinsk eller psykologisk faktagranskare med verifierbara meriter,
3. synliga källor på varje central sida,
4. datum för faktisk sakgranskning,
5. en metodiksida som förklarar hur det egenutvecklade AuDHD-testet skapats och vilka begränsningar det har,
6. tydlig rättelse- och uppdateringspolicy.

Detta bör göras före en bred expansion. Att publicera många automatiskt strukturerade sidor utan tydligt mervärde riskerar både förtroende och organisk synlighet.

## Rekommenderad informationsarkitektur

### Nivå 1: huvudnav

- `/audhd` äger “AuDHD” och “vad är AuDHD”.
- `/audhd-test` äger testintentionen.
- `/adhd-eller-autism` äger jämförelseintentionen.
- `/adhd-och-autism-samtidigt` äger den kliniskt formulerade samtidighetsintentionen.

De ska ha tydligt olika huvudfrågor och inte upprepa samma introduktion i flera versioner.

### Nivå 2: befintliga fördjupningar

- `/audhd-symtom-vuxna`
- `/audhd-kvinnor`
- `/audhd-masking`

### Nivå 3: nästa rekommenderade sidor

Prioritet 1:

- **`/audhd-i-relationer`** – kommunikation, ansvarsfördelning, återhämtning, planändringar och konflikter. Detta ligger nära Relationsvarnings etablerade ämnesauktoritet och kan ge ett verkligt eget perspektiv.
- **`/audhd-utredning`** – vad en bred bedömning behöver undersöka, skillnaden mellan självskattning och utredning samt vägar till svensk vård.
- **`/audhd-utmattning`** – belastning, återhämtning och när liknande symtom kräver bredare bedömning. Sidan måste vara försiktig med termen “autistisk burnout”, där klinisk definition och evidens fortfarande är mindre etablerade.

Prioritet 2:

- **`/audhd-i-vardagen`** – praktisk hubb för planering, sensorisk belastning, energi och hållbara system.
- **`/audhd-arbete`** – arbetsmiljö, tydlighet, avbrott, återhämtning och möjliga anpassningar.
- **`/audhd-studier`** – struktur, startsvårigheter, miljö, pauser och stödvägar.
- **`/partner-med-audhd`** – stöd för partner utan att förklara skadliga relationsbeteenden med diagnoser.

Prioritet 3, först efter verifierad efterfrågan i Search Console:

- sömn,
- föräldraskap,
- känsloreglering,
- sensorisk överbelastning,
- stöd efter diagnos.

Skapa inte separata sidor för varje liten synonym eller varje möjlig vardagssituation. Utöka en befintlig sida när sökintentionen är densamma.

## Teststrategi

Den nuvarande testmodellen har en bra grundstruktur: ADHD-relaterade områden, autismrelaterade områden, masking, upplevd friktion, vardagspåverkan och utvecklingskontext hålls delvis isär. Följande måste vara tydligt före lansering:

- De egenutvecklade procentvärdena är produktbeskrivningar, inte kliniska cutoffs.
- Resultatnamn som “kombinationsmönster” får inte läsas som sannolikhet för diagnos.
- “AuDHD-friktion” är en egen explorativ dimension, inte ett etablerat diagnostiskt mått.
- Frågornas ursprung, granskningsprocess och versionsnummer ska dokumenteras.
- Rapporten bör länka till vilka konkreta svarsområden som påverkat beskrivningen utan att ge medicinska slutsatser.
- Det bör finnas användartestning för begriplighet och en separat professionell sakgranskning innan marknadsföring som ett centralt AuDHD-verktyg.

På sikt kan en riktig valideringsstudie ge en stark konkurrensfördel, men fram till dess ska produkten konsekvent beskrivas som en strukturerad självskattning.

## Publiceringsordning

### Fas 0 – kvalitetssäkra det som redan byggts

1. faktagranska hubben, testfrågorna och resultattexterna,
2. jämför rubriker och stycken mellan de sju sidorna för att ta bort överlapp,
3. konsolidera `/adhd-autism` och `/adhd-eller-autism` efter kontroll av historiska signaler,
4. lägg till källor, författare och granskare,
5. publicera testmetodik och versionshistorik,
6. kontrollera canonical, schema, sitemap, noindex på testappen och interna länkar,
7. skapa en unik 16:9-bild för hubben och testlandningen.

### Fas 1 – lansera kärnan

Publicera hubb, test och de fem befintliga fördjupningarna som ett sammanhängande kluster. Länka in från relevanta ADHD- och autismsidor, men behåll separata testintentioner.

### Fas 2 – bygg det egna perspektivet

Publicera relationer, utredning och utmattning. Dessa sidor ska innehålla mer än sammanfattade diagnosbeskrivningar: konkreta situationer, gränser för vad forskningen visar, praktiska frågor att ta med till vården och tydliga vägar vidare.

### Fas 3 – styr med verkliga data

Efter indexering används Search Console för att följa:

- visningar och klick per sökfråga,
- om flera routes visas för samma fråga,
- vilka frågor som ligger på position 5–20,
- teststart, testslutförande och övergång mellan guider och test,
- återkommande landningssidor och assisterade konverteringar.

Nya sidor skapas först när data visar en egen intention som den befintliga sidan inte kan tillfredsställa.

## Källbas

Primära svenska kunskapskällor:

- [Socialstyrelsens nationella riktlinjer för adhd och autism](https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/nationella-riktlinjer/riktlinjer-och-utvarderingar/adhd-och-autism/)
- [Nationella vård- och insatsprogram: adhd och autism](https://www.vardochinsats.se/adhd/om-tillstaandet/adhd-och-autism/)
- [Socialstyrelsen: Autism – förekomst och samsjuklighet](https://www.socialstyrelsen.se/contentassets/91f558f96c144b34b42a490ad40be0bd/2024-11-9353.pdf)
- [1177: adhd](https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/adhd/)

Forskningsöversikter:

- [Waldren et al. 2024: overlap between autism and ADHD in adults](https://pubmed.ncbi.nlm.nih.gov/38387375/)
- [Rosello et al. 2022: co-occurring autism and ADHD](https://pubmed.ncbi.nlm.nih.gov/34961363/)
- [Micai et al. 2023: co-occurring conditions in autism](https://pubmed.ncbi.nlm.nih.gov/37913872/)
- [Systematic review of social camouflaging](https://pubmed.ncbi.nlm.nih.gov/39370528/)

SEO- och publiceringsprinciper:

- [Google: people-first content och YMYL](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content)
- [Google Discover](https://developers.google.com/search/docs/appearance/google-discover)

## Beslut

Nästa kodpass bör inte skapa fler routes. Det bör kvalitetssäkra och färdigställa de sju befintliga AuDHD-sidorna och testet. Därefter är `/audhd-i-relationer`, `/audhd-utredning` och `/audhd-utmattning` den starkaste första expansionen.
