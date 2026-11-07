# PERSONA – vardagsnära innehållsrevision v2

2026-11-07, `codex/persona-stage1`. Ingen push eller deploy.

Revisionen gäller produkten före dess första köp enligt projektägarens besked.
Inga köp migreras och inga nya historiska betalningsvägar införs. V1-materialet
ligger kvar som referens och regressionstest; nya omgångar använder v2.

## Ny frågebank

- 34 fasta frågor: kapitel 1 = 10, kapitel 2 = 12, kapitel 3 = 12.
- 18 möjliga adaptiva frågor; exakt sex väljs till kapitel 4.
- 40 frågor per omgång, varav 25 vardagsscenarier och 15 strukturerade indikatorer.
- Fyra ordinarie svar på varje fråga. Svårt att bedöma är ett separat osäkert svar.
- Alla 52 frågestammar har 17–26 ord. Alla 208 ordinarie svar har 6–12 ord.
- Alla frågetexter och svar är omskrivna. Inget arbetsplatsdilemma finns kvar
  i den aktiva banken genom ett rent ordbyte.

Den första delen innehåller bland annat en oönskad bild, en inställd kväll,
en ledig dag och beröm som missar avsikten. Den andra prövar egna möjligheter,
löften, en ojämn nota, ett försteg, avund, ärlighet och förtroende. Den tredje
går närmare behov av stöd, saknad, återkomst efter svek, romantisk osäkerhet,
egen stolthet och självbild. Följdfrågorna prövar en mer avgränsad nyans av de
tidigare valen, inte en ny komplicerad bakgrundshistoria.

Alla 37 scenarier i banken har fyra egna redaktionella tolkningar, totalt 148.
De beskriver det valda handlingssättet, dess utrymme och möjliga kostnad i just
situationen. Inga poäng delas ut för att vara moraliskt bättre. Samtliga 76
fasta scenarioalternativ och 72 adaptiva alternativ har synlig egen text i
rapporten; ingen fråga finns bara för att fylla ett frågeantal.

## Egen fyrgradig dimensionsorientering

De 15 egna påståendena fördelas på fem Big Five-inspirerade begrepp, tre per
dimension. De är inte BFI-2, en validerad översättning eller en klinisk skala.
Några publicerade kortskalors resultat kan inte överföras till dessa egna frågor.
Ramverkets metodiska bakgrund kan läsas i
[Soto & John (2017)](https://www.colby.edu/wp-content/uploads/2013/08/Soto_John_2017b.pdf).

Ordinarie svar är frekvensnivåer kodade 0–3. Omvända påståenden kodas 3−svar.
Osäker kod 5 bidrar inte med en riktning; 4 är ogiltigt. Inget svar automatiskt
tolkas som en neutral mittpunkt. Scenarier påverkar aldrig dimensionsvärdena.

Tre bedömbara svar kan ge en försiktig lägre/mellan/högre beskrivning. Två ger
begränsat underlag utan samlad riktning; noll/ett ger inget numeriskt värde.
Skillnader mellan påståendena lyfts som olika sammanhang, inte som lögn,
diagnos eller ett statistiskt bevis på opålitlighet. Interna 0–100-värden är
deskriptiva transformationer, inte normjämförelser eller sannolikheter.

## Adaptivitet

De sex temana är erkännande (R), lojalitet (L), rättvisa/inflytande (M), tillit
(F), behov/gränser (G) och självbild (S). Varje kandidat har två dokumenterade
ingångar. Båda matchade = 9 relevanspoäng, en = 3, ingen = 0. Osäkert svar
matchar aldrig en ingång.

Motorn jämför kombinationer om sex, maximerar relevansen och kräver minst tre
teman och högst tre frågor från ett tema. Vid lika poäng föredras fler teman,
sedan lexikografiskt lägst ID-kombination. Visningsordning är relevans följd av
ID. Ingen får obligatoriskt en fråga från varje tema. Reservfrågor kallas
breddning och blir aldrig bevis för en redan funnen personlighetssignal.

Urvalet binds till `persona-adaptive-v2` och rekonstrueras på servern.
Klientens valda ID:n, scores eller låsflaggor accepteras inte i svaret.

## Rapporten

Den befintliga åttaavsnittsstrukturen och rapportdesignen behålls. V2 har 16
egna kombinationsregler och tio möjliga personliga experiment. Alla premisser
i en kombination måste matcha, inklusive eventuella följdfrågesvar.
Nyanserande underlag redovisas separat.

Porträtt och signatur väljs från belagda kombinationer eller uttryckliga
situationsval. Drivkrafter och relationella mönster fördjupar samtliga relevanta
fasta och adaptiva svar. Inre motsägelser skiljer särskilda stödda spänningar
från enskilda självbildsval; inget behov av en motsägelse fylls i åt användaren.
Styrkor/blinda fläckar och personlig kompass visar endast matchade perspektiv
och experiment, högst tre. Ett enda välgrundat experiment föredras framför tre
generiska råd.

Varje personligt stycke har finding-ID:n som pekar på riktiga svar. Varken
barndom, omedvetna motiv, andra personers avsikter eller anknytningstyper
hittas på. Om underlaget saknas blir det metodtext och begränsad förhandsvisning.

Publikt frågematerial och privat tolkningstext ligger i olika moduler.
Ett beroendetest kontrollerar detta. Efter full build söktes också fyra unika
premiummarkörer i publik klient-JavaScript utan träff. Den befintliga
serververifierade rapportåtkomsten är oförändrad.

## Layout och säkerhetsgräns

Fråga och svar ligger kvar i samma kort, med samma marinblå/guldiga design,
progress, navigation, 350 ms auto-advance och fokus utan scrollkommandon.
Den enda presentationsändringen i fråge-CSS är en uttrycklig kolumn och
borttagna regler för fem horisontella självskattningskort. Inga nya fasta höjder,
scrollåterställningar eller footeröverlappningar införs.

Omgången har ny versionsbunden lokal nyckel, `relationsvarning_persona_flow_v2`.
Gamla prototypsvar omtolkas inte som nya svar; en ny v2-omgång börjar tom.
Den gamla lokala nyckeln raderas inte. Köp-/konto-/innehavsnycklar ändras inte.

Stripe Checkout, pris, åtkomstkontroller, SQL, kryptering, Mina sidor och
webhooks är orörda. Endast PERSONA-adapterns och svarbeskrivarens import av
aktuellt material flyttas till v2. Produkt-ID är fortsatt persona_test och
priset fortsatt 79 kr.

## Granskning och testsvarsprofiler

Fem avsiktligt olika syntetiska svarsmönster används:

| Kontrastfall, inte användartyp | Signatur från motorn |
| --- | --- |
| Öppen samhörighet | En egen väg, med plats för samtalet |
| Egen riktning | En egen måttstock |
| Varsam tillit | Tillit som får märkas |
| Rörlig livslust | Plats för det som växer fram |
| Närhet och eget skydd | Närhet med en egen dörr |

Namnen går aldrig in i analysmotorn. Testerna verifierar att innehållet i vart
och ett av de åtta avsnitten skiljer sig mellan alla fem profiler, liksom
signatur, dimensionsvärden och val av följdfrågor. Alla valda slutsatser
kontrolleras mot respektive svar. Detta demonstrerar programlogik, inte
personlighetsmätningens validitet i en population.

Kör `node scripts/audit-persona-v2.cjs` för hela banken, en matris med syfte,
längder och faktiska rapportspår, alla urvals-/kombinations-/experimentregler
samt de fem fullständiga JSON-rapporterna. Kör
`node scripts/render-persona-samples.cjs` för fem fristående HTML-rapporter.
Artefakterna ligger under .artifacts och är inte publika produktvägar.

## Verifiering

- 72/72 PERSONA-tester passerar: 18 v1-referensregressioner, 24 flödes-/SSR-/CSS-
  tester, 18 köp-/rapport-/konfigurationskontroller och 12 nya v2-granskningar.
- Varje ny följdfråga är nåbar. Urvalets optimum och tie-break jämförs med
  oberoende uppräkning. Alla svarsalternativ har spårbar synlig rapporttext.
- TypeScript hela projektet, strikt ESLint för ändringen och full Next-build
  i isolerad nyckelfri kopia passerar; sitemap-postbuild passerar också.
- Bred körning av 149 Node-testprogram plus fyra samlade kontroller:
  145/153 kommandon passerar. Befintliga miljö-/baslinjehinder är kvar:
  separat PostgreSQL saknas, privat ADHD-PDF-fixtur saknas, autismbokstestet
  har en känd förväntansavvikelse, tre historiska Git-scopekontroller är inte
  generella för detta uppdrag, och full ESLint har samma 13 fel/25 varningar.
  Ett artikeltest saknar .next i projektroten men passerar 9/9 i byggkopian.
- Efter moduluppdelningen av publika frågor och privata tolkningar kördes
  PERSONA-sviten om. De fem rapporternas serialiserade innehåll var dessutom
  byteidentiskt före/efter denna rent tekniska uppdelning.

V1:s ursprungliga implementeringsfiler är oförändrade. Den äldre sviten har
en uttrycklig v1-ingång och dess fingerprint uppdateras för de avsiktligt
ändrade, gemensamma versions-/registerfilerna. V2 har ett eget fingerprint för
hela fråge-, poäng-, urvals- och rapportmaterialet. Det är ingen tyst omkodning
av v1.

## Öppna kvalitetsbegränsningar

Detta är en redaktionell och teknisk revision, inte en psykometrisk validering.
Tre egna indikatorer per dimension ger ett smalt och känsligt underlag. Ingen
reliabilitet, normering eller säker individuell prediktion är fastställd.

Samtliga frågor har granskats vid skrivning för korthet, begriplighet, eget
syfte och fyra meningsfulla handlingsvägar. Ingen oberoende psykolog eller
extern användarpanel har bedömt banken. En pilot med både 18–25-åringar och
äldre behövs för upplevd relevans, läsförståelse och om något svar ändå känns
moraliskt överlägset. Särskilt rättvisa/lojalitet kan påverkas av social önskvärdhet.

Tillit återkommer med avsikt i olika lägen: färskt förtroendebrott, återkomst
efter lång tid och tillitens tempo efter en ursäkt. En användarpilot bör ändå
kontrollera att fördjupningen inte upplevs som upprepning. För den som inte kan
föreställa sig dejtande eller en viss relation finns osäkerhetsalternativet;
rapporten fyller inte i den erfarenheten.

Ingen ny visuell webbläsar-/mobil-/PDF-granskning är genomförd här. Tidigare
automatiserad webbläsaråtkomst var blockerad. CSS-/SSR-kontroller är inte ett
bevis för faktiska pixelmått. Leverantörer är testade med den befintliga säkra
offlinekonfigurationen, inte riktiga betalningar eller kunddata.
