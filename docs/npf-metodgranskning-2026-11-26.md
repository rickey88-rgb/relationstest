# Intern metodgranskning av ADHD-, autism- och AuDHD-självtesten

Granskad och uppdaterad 26 november 2026. Utgångspunkt för den godkända granskningen är commit `738ada6fe65834ed7e42223ef02398fb62d5f875`. De fem godkända korrigeringarna har genomförts lokalt inför beslut om produktionssättning.

## Kriterier och underlag

För varje test granskades frågornas relevans för det som ska skattas, vuxna som målgrupp och självreflektion som användningsområde. I den bedömningen ingick svarsalternativ och tidsram. Täckningen bedömdes genom att kartlägga vilka erfarenheter frågorna tar upp. För begriplighet lästes instruktioner, formuleringar och svarsalternativ tillsammans. [COSMIN:s manual för innehållsvaliditet](https://www.cosmin.nl/wp-content/uploads/COSMIN_methodology-content-validity-prom_user-manual_v1.0.pdf)

Granskningen omfattade den svenska frågetexten samt källkod för beräkning, rapporter och gratisåterkoppling. I ursprungsgranskningen ingick låga, medelhöga, höga och blandade svarsmönster samt 500 syntetiska jämförelser per test. Inget huvudindex sjönk när ett frekvenssvar höjdes. Kontextfrågorna ändrade inte huvudindexen. Betalstatus styr tillgången till rapporten och ingår inte i poängberäkningen. De nya regressionstesterna kontrollerar de korrigerade reglerna. För AuDHD omfattar de både svenska och norska utfall, inklusive samma numeriska värden och lokaliserad text. Inget liveköp gjordes.

## ADHD

**Datum** 26 november 2026. **Versioner** `adhd-questions-v1` och `adhd-report-v1`.

- **Relevans.** De 30 frågorna tar upp konkreta vuxensituationer. Fem områden formar huvudindexet och det sjätte ger kontext om vardag och historik.
- **Täckning.** Uppmärksamhet, organisering, impulsivitet, rastlöshet och igångsättning kan läsas var för sig. Några frågor om att komma igång överlappar organisering och aktivering. Genomgången ger inget stöd för att justera deras vikter.
- **Begriplighet.** Den gemensamma frekvensskalan, sexmånadersperioden och den särskilda frågan om tidigare liv ger en tydlig struktur. Fråga 28 bygger delvis på en jämförelse med andra vars ansträngning deltagaren behöver uppskatta.
- **Korrigering 1.** Rapporten använder svaret på fråga 29 för att säga att svårigheter ofta återkommer i flera delar av livet. Ett högt värde i det sammanvägda vardagsområdet räcker inte. Den generella områdestexten ändrades också eftersom samma obelagda påstående kunde visas där. Regressionen jämför lika höga delresultat med olika svar på fråga 29.
- **Begränsning.** Frågorna om relativ ansträngning och tidigare liv har inte prövats i intervjuer inom denna granskning. [Modelltest](../app/adhd-test/test/model.test.cjs)

## Autism

**Datum** 26 november 2026. **Versioner** `autism-questions-v1` och `autism-report-v1`.

- **Relevans.** Frågorna täcker vuxnas upplevelser av samspel, kommunikation, flexibilitet, sensorik och intressen. Vardagspåverkan och långvarighet fördjupar resultatet utanför huvudindexet.
- **Täckning.** Sensorikfrågorna fångar främst starka intryck, överbelastning och undvikande. Låg känslighet och sökande efter intryck är mindre representerade.
- **Begriplighet.** Frekvensskalan är bekant, men svarsalternativen passar olika väl när ett påstående redan innehåller en frekvens eller gäller långvarighet och strategier.
- **Korrigering 2.** Vid ett huvudindex under 25 och en delpoäng från 65 beskriver gratisåterkopplingen både den låga helheten och vilket område som ligger högt. Regressionen kontrollerar flera områden, gränsvärdet och fall där även vardagsområdet är högt. Poäng och regler för rapportprofilen är desamma.
- **Begränsning.** Inga deltagarintervjuer genomfördes om hur de tolkar frekvensskalan eller vilka andra erfarenheter de saknar i frågorna. [Modelltest](../app/autism-test/test/model.test.cjs)

## AuDHD

**Datum** 26 november 2026. **Versioner** `audhd-questions-v1` och `audhd-v1`.

- **Relevans.** Testet följer separata ADHD- och autismrelaterade mönster och använder följdfrågor för att fånga när och var de märks.
- **Täckning.** De 48 huvudfrågorna täcker åtta områden, däribland anpassning, behov som krockar och vardagspåverkan. De sex följdfrågorna ger kontext. Huvudindexens befintliga vikter är produktval.
- **Begriplighet.** Ett särskilt svarsalternativ för osäkerhet gör det möjligt att ange att man saknar underlag om historik eller miljö. Den tidigare modellens tolkning stämde inte med betydelsen av alternativet.
- **Korrigering 3.** Osäkra svar om barndom, flera miljöer och när svårigheter blev tydliga ger inget stöd för en slutsats om den uppgiften. Verifierade tidigare svar läses med samma svarskoder och samma version och får den korrigerade tolkningen när rapporten räknas om.
- **Korrigering 4.** När båda huvudindexen är minst 75 får den befintliga rubriken för ett starkt kombinationsmönster företräde. Gränsregeln gäller fortfarande när bara ett index når 75 och värdena ligger nära gränsen. Huvudindex och viktningar är desamma.
- **Korrigering 5.** Påverkansbedömningen behåller sin beräkning och sina nivågränser. Rapporten skiljer låga svar i huvudfrågorna från högre svar i följdfrågorna när den sammantagna påverkan är tydlig. När den lyfter en specifik följdfråga kan även energin det tar att hantera svårigheterna vara det som framträder mest.
- **Begränsning.** Begriplighet granskades för svenska, medan norska ingår i de tekniska testerna. De syntetiska kontrollerna kan inte avgöra viktningarnas lämplighet i en befolkning. [Modelltest för båda språken](../app/audhd-test/test/model.test.cjs), [test av återöppning av betald rapport](../app/audhd-test/test/payment-return.test.cjs)

## Kompatibilitet och publik dokumentation

Frågeversioner, rapportversioner och svarskoder behålls. Sparade svar kan öppnas med de korrigerade tolkningarna. Frågebatterier, beräkning av huvudindex, viktningar, design, pris och betalflöden är oförändrade.

De 22 testprogrammen för de berörda frågeflödena, modellerna och AuDHD:s betalnings- och återställningsvägar passerade lokalt. Det gjorde även kontosvitens 37 testprogram. Återöppning av en äldre AuDHD-rapport provades med simulerade svar från det verifierade återställningsflödet i båda språken.

Det lokala bygget passerade med syntetiska uppgifter för den juridiska sidan. De renderade metodtexterna, länkarna och det norska frågeflödet kontrollerades. En separat körning av alla 469 upptäckta testfall gav 418 godkända och 51 fel. Samtliga 51 fel återkom i en separat utcheckning av utgångscommitten. Den körningen omfattade även testfall som använder särskilda lokala inställningar eller privata testfiler.

Metodtexterna har förberetts på ADHD-testets och autismtestets landningssidor, den befintliga AuDHD-metodsidan och i en gemensam sektion på `/metodik`. De beskriver vad självskattningarna hjälper användaren att se och ger exempel på de tekniska kontrollerna.

Detta är intern innehållsgranskning och teknisk kvalitetssäkring. Oberoende bedömning, empirisk validering och diagnostisk träffsäkerhet kräver separat underlag. Inga slutsatser dras om hur väl testen mäter mellan grupper eller om kliniska gränsvärden. [COSMIN:s manual v2.0, avsnitt 6.1](https://www.cosmin.nl/wp-content/uploads/COSMIN-manual-V2_final.pdf)
