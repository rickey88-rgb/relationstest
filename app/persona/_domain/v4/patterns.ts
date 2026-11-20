import type { Dimension } from "../types";

export type Key = `${Dimension}${"+" | "-"}`;
export type Pattern = {
  id: string;
  keys: readonly Key[];
  context?: readonly number[];
  name: string;
  core: string;
  strength: string;
  risk: string;
  experiment: string;
  scene: string;
  relationship?: string;
  driver?: string;
  tension?: string;
  free: readonly [headline: string, interpretation: string, why: string, deeper: string];
};

export const patterns: readonly Pattern[] = [
  {
    id: "explore-then-build", keys: ["O+", "C+"], context: [31, 32], name: "Idébyggaren",
    core: "Nyfikenheten kan öppna flera vägar, medan ditt sätt att skapa struktur gör det lättare att avgöra vilken väg som är värd att pröva. En ny idé kan bli mer lockande när du ser hur den går att omsätta.",
    strength: "När andra fastnar mellan en lockande vision och en lång att-göra-lista kan du göra nästa steg litet nog att faktiskt ta.",
    risk: "Om du börjar ordna detaljer innan du har valt riktning kan du göra en svag idé mer genomförbar utan att upptäcka att du borde byta idé.",
    experiment: "Dela ett nytt projekt i två sittningar. Skissa först tre vägar utan att rangordna dem. Välj sedan ett litet försök med ett tydligt tecken på om du ska fortsätta.",
    scene: "Om ni planerar en helg ihop kan du föreslå flera upplägg och göra det lätt att välja genom att visa vad varje alternativ kräver.",
    driver: "Ett mål kan kännas mer värt att driva när ramarna säger vad som ska bli klart men lämnar öppet hur du tar dig dit.",
    free: ["Du kan ge en ny idé en första hållpunkt", "Din nyfikenhet verkar ha en praktisk följeslagare. Struktur kan göra en idé möjlig att undersöka i verkligheten.", "Det spelar roll när ett spännande alternativ konkurrerar med sådant du faktiskt hinner genomföra.", "Porträttet visar när det kan hjälpa att strukturera tidigt och när det kan låsa ett val för snart."],
  },
  {
    id: "wide-then-light", keys: ["O+", "C-"], context: [31], name: "Spårfinnaren",
    core: "Du kan vinna fart när en väg får växa fram ur det som händer. Ett oväntat spår blir lättare att följa när du kan ändra upplägg utan att först göra om en detaljerad plan.",
    strength: "Du kan hjälpa andra ur ett för tidigt antingen–eller genom att ta fram ett tredje alternativ som går att pröva direkt.",
    risk: "Om varje nytt spår får företräde riskerar den del som kräver repetition att bli kvar, även när du fortfarande tycker att slutresultatet spelar roll.",
    experiment: "Välj ett pågående projekt. Bestäm vad som räknas som tillräckligt klart innan nästa idé får konkurrera om platsen.",
    scene: "När ett tänkt utflyktsmål är stängt kan du föreslå en omväg som gör dagen intressant. Säg också när ni behöver välja, så att utflykten faktiskt blir av.",
    driver: "Ett mål som ger snabb återkoppling och utrymme att byta metod kan vara lättare att återvända till än en plan vars värde visar sig först långt senare.",
    free: ["En omväg kan vara produktiv för dig", "Det oväntade kan ge fart, eftersom nya möjligheter och ett öppnare genomförande tycks passa ihop i ditt underlag.", "Samma flexibilitet kan vara mer användbar i början av något än nära mållinjen.", "Rapporten skiljer på när det lönar sig att öppna fler vägar och när en behöver få bli klar."],
  },
  {
    id: "bring-people-along", keys: ["E+", "A+"], context: [33], name: "Samtalsöppnaren",
    core: "Socialt initiativ och hänsyn kan ge samtalet både fart och plats för andra. Du kan bidra till att människor kommer till tals även när det är du som startar utbytet.",
    strength: "Du kan göra det enklare för en ny person att hitta in genom att ställa en fråga som går att svara på utan att känna gruppens historia.",
    risk: "Om du både för samtalet framåt och försöker få med alla kan du råka ta på dig ansvaret för ett samförstånd som egentligen behöver delas.",
    experiment: "Nästa gång en grupp ska välja, ge ditt förslag och låt en annan person samla in de övrigas synpunkter. Lägg märke till om arbetet fördelas annorlunda.",
    scene: "När tre personer har olika idéer om en gemensam kväll kan du först få fram vad som är viktigt för var och en och sedan föreslå något alla kan ta ställning till.",
    relationship: "I en nära relation kan du öppna ett svårt samtal på ett sätt som ändå bjuder in den andra att sätta ord på sin egen version.",
    free: ["Ditt initiativ kan göra plats för andra", "Här pekar svaren på en särskild sorts social fart: att öppna en situation så att fler kan delta.", "Det kan förändra hur en grupp kommer fram till ett beslut.", "I rapporten får du exempel på vad som händer när initiativ också blir ett ansvar du kan dela."],
  },
  {
    id: "clear-course", keys: ["E+", "A-"], context: [35], name: "Riktningssättaren",
    core: "När socialt initiativ möter en mer återhållsam samspelsstil kan en diskussion snabbare få en riktning. Du kan bidra med ett förslag innan det finns en gemensam uppfattning.",
    strength: "Om en diskussion står still kan ett tydligt alternativ göra det lättare för andra att säga exakt vad de invänder mot.",
    risk: "Ett första förslag kan uppfattas som beslut om det kommer innan andra hunnit formulera sina alternativ.",
    experiment: "Formulera nästa tydliga förslag som en prövning: ’Det här är en väg. Vad skulle få oss att välja en annan?’ Vänta sedan in ett verkligt motförslag.",
    scene: "Om en gemensam uppgift blir liggande kan du föreslå vem som gör vad. Sätt också en tid då upplägget går att ändra.",
    relationship: "I ett meningsutbyte kan du göra sakfrågan tydlig tidigt. Det kan hjälpa att också fråga hur den andra uppfattade situationen innan ni diskuterar lösningen.",
    free: ["Ett tydligt förslag kan ge andra något att invända mot", "Initiativ och en mer självständig hållning i samspelet kan göra ett otydligt samtal lättare att ta vidare.", "Ett första förslag sätter ofta också ramen för vad som diskuteras.", "Rapporten visar hur du kan använda tydligheten och ändå ge alternativa förslag tid."],
  },
  {
    id: "careful-bridge", keys: ["E-", "A+"], context: [34, 38], name: "Den lågmälda länken",
    core: "Hänsynen kan bli tydligare i utbyten där du har tid att svara genomtänkt än i sammanhang där alla förväntas ta plats samtidigt. Närhet kan få byggas genom vad du gör mellan samtalen.",
    strength: "Att följa upp efteråt kan ge ett viktigt samtal en andra chans, särskilt för någon som hade svårt att formulera sig i stunden.",
    risk: "I snabba sammanhang kan andra missa att du vill bidra om de förväxlar din takt med brist på engagemang.",
    experiment: "Vid nästa samtal som går fort, säg en tidig mening om att frågan spelar roll för dig. Ta sedan upp detaljerna på det sätt som passar dig.",
    scene: "Om en vän berättar något oväntat i ett större sällskap kan ett kort meddelande efteråt ge mer plats för det ni faktiskt behöver prata om.",
    relationship: "På tu man hand kan din omtanke bli mer synlig genom ett precist nästa steg än genom att säga allt i stunden.",
    free: ["Omtanke kan bli tydligare efter samtalet", "I ditt underlag kan social återhållsamhet ge hänsynen en annan form. En följdfråga senare kan bära mer än ett snabbt svar inför alla.", "Det är relevant när andra behöver veta att en fråga landade hos dig.", "Porträttet visar hur du kan göra ditt engagemang lättare att uppfatta även när tempot är högt."],
  },
  {
    id: "private-track", keys: ["E-", "O+"], context: [31, 38], name: "Den egna upptäcktsvägen",
    core: "Du kan ha mycket rörelse i tankarna även när ditt sätt att delta är återhållsamt. En möjlighet kan hinna bli mer originell om den får ta form enskilt innan du behöver förklara den för andra.",
    strength: "Ett första eget utkast kan ge gruppen material som inte hade uppstått om alla bara reagerat på det första förslaget i rummet.",
    risk: "Om återkopplingen kommer först efter att idén blivit färdig i ditt huvud kan den bli svårare att justera utan att göra om mycket.",
    experiment: "Dela en ofärdig version med en person och be om svar på en enda fråga. Se om du får ny information utan att förlora arbetsron.",
    scene: "Om ni väljer present till en vän kan du först samla egna idéer och sedan visa två alternativ i stället för att behöva komma på något på stående fot.",
    relationship: "En gemensam fråga att utforska kan ge ett nära samtal utrymme. Det kan vara lättare att visa en ny sida av dig genom något ni upptäcker tillsammans.",
    driver: "Ett eget undersökningsutrymme kan göra det lättare att gå på djupet före ett gemensamt beslut.",
    free: ["Egen tid kan ge en idé större svängrum", "Nyfikenhet och social återhållsamhet kan bilda ett arbetssätt där en första tanke får ta form innan andras alternativ kommer in.", "Det påverkar när i processen det är värt att bjuda in återkoppling.", "Rapporten går vidare till hur du kan behålla arbetsron och ändå få respons i tid."],
  },
  {
    id: "steady-execution", keys: ["N-", "C+"], context: [32], name: "Den stadiga handen",
    core: "Ett jämnare känslomässigt tempo och ett strukturerat genomförande kan göra det lättare att skilja vad som faktiskt måste lösas från vad som bara har blivit brådskande i stunden.",
    strength: "När en plan går sönder kan du göra om ordningsföljden utan att förlora överblicken över vad som fortfarande behöver bli gjort.",
    risk: "Om du återgår snabbt till det praktiska kan andra tro att du inte sett vad ändringen kostade dem, även när du har uppfattat det.",
    experiment: "När något ändras, ge först en mening om vad som gick förlorat och sedan en mening om nästa steg. Jämför hur lätt ni kommer vidare.",
    scene: "Om en bokning faller bort kan du skilja på att alla är besvikna och vad som behöver ordnas inom nästa kvart.",
    relationship: "En tydlig plan kan skapa arbetsro i en relation, särskilt när båda först har fått säga vad de behöver av situationen.",
    free: ["När det brådskar kan du sortera före du löser", "Lugnare reaktioner tillsammans med struktur kan göra det lättare att hitta nästa steg när läget skiftar.", "Det gör skillnad mellan att återställa en plan och att dra alla med sig in i brådskan.", "Rapporten visar en konkret situation där ditt lugn kan hjälpa och när det behöver förklaras för andra."],
  },
  {
    id: "prepare-under-pressure", keys: ["N+", "C+"], context: [37], name: "Marginalbyggaren",
    core: "Starkare känslomässiga reaktioner kan göra det lättare att märka att något står på spel, medan ett strukturerat arbetssätt kan omsätta signalen i förberedelser. De två sidorna kan vara till hjälp vid olika tidpunkter.",
    strength: "Du kan göra en oklar risk konkret genom att ge den en reservväg och en punkt då det är dags att ändra plan.",
    risk: "Om varje stark signal får en ny kontroll kan förberedelsen fortsätta efter att den slutat tillföra ny information.",
    experiment: "Inför ett beslut, skriv en reservväg och ett villkor som skulle få dig att använda den. Bestäm sedan när du har kontrollerat tillräckligt för den här gången.",
    scene: "När ett gemensamt beslut känns viktigt kan en reservplan frigöra uppmärksamhet till samtalet, så länge ni också enas om vad som räknas som tillräcklig förberedelse.",
    tension: "Samma förberedelse som skapar handlingsutrymme kan börja ta utrymme från beslutet. En användbar skiljelinje är om en extra kontroll faktiskt kan ändra vad du gör.",
    free: ["En stark signal kan bli en användbar reservplan", "I dina svar finns både reaktion och struktur. När de samverkar kan en diffus risk få en konkret nästa åtgärd.", "Det är särskilt användbart om åtgärden gör det lättare att fatta beslut i tid.", "Rapporten hjälper dig skilja en reservplan som frigör tid från en kontroll som förbrukar den."],
  },
  {
    id: "respond-fast", keys: ["N+", "C-"], context: [40], name: "Den snabba omställaren",
    core: "När händelser känns tydligt och genomförandet är flexibelt kan du byta kurs tidigt. Det kan vara värdefullt när ny information kräver handling, men samma snabbhet blir mindre hjälpsam när situationen ännu är oklar.",
    strength: "Du kan märka att ett upplägg inte längre fungerar och föreslå en tillfällig lösning medan det fortfarande finns flera vägar.",
    risk: "Det som först väcker en stark reaktion kan få mer vikt än vad det behåller efter en stund.",
    experiment: "Skilj på beslut som går att backa och beslut som inte gör det. Prova en liten omväg direkt, men ge det stora beskedet en ny tidpunkt.",
    scene: "Om tonen i ett meddelande känns oväntad kan du börja med en fråga om hur det var menat och lämna större slutsatser tills du fått ett svar.",
    tension: "Snabb omställning hjälper när läget verkligen ändrats. Det kan bli svårare när en stark signal säger att något är viktigt utan att ännu säga vad som har hänt.",
    free: ["Det kan vara lätt att byta kurs innan läget klarnat", "Starkare reaktioner och ett flexibelt sätt att gå vidare kan göra ett första intryck handlingskraftigt.", "Tidpunkten blir viktig: vissa beslut går lätt att ändra medan andra får större följder.", "Rapporten skiljer de två sorternas beslut åt och ger dig ett sätt att hantera båda."],
  },
  {
    id: "warm-stakes", keys: ["A+", "N+"], context: [36, 37], name: "Den uppmärksamma medspelaren",
    core: "Hänsyn och starkare känslomässiga reaktioner kan göra mänskliga frågor svåra att avfärda för tidigt. När ett läge betyder mycket kan du bidra genom att lyfta både det praktiska och vad det innebär för de berörda.",
    strength: "Du kan ge ett beslut bättre villkor genom att göra en social kostnad synlig innan den uppstår, exempelvis vem som förväntas anpassa sig.",
    risk: "Det kan bli svårare att skilja vad du själv behöver ta ansvar för från vad du har lagt märke till hos andra.",
    experiment: "När du märker att något skaver, skriv ned vad du kan påverka och vad någon annan behöver säga eller göra. Ta först ett steg på din egen sida.",
    scene: "Om någon i en grupp verkar utelämnad kan du öppna för deras synpunkt. Stanna där tills du vet om de faktiskt vill ha hjälp.",
    relationship: "En rak avstämning om vad den andra behöver kan göra omtanken träffsäker och minska risken att du ensam börjar bära frågan.",
    free: ["Det du märker behöver inte alltid bli ditt ansvar", "Hänsyn och känslomässigt gensvar kan göra det lättare att ta en mellanmänsklig fråga på allvar.", "Att upptäcka att något spelar roll och att kunna lösa det är två olika saker.", "I rapporten får du ett sätt att skilja det du kan påverka från det andra behöver formulera själva."],
  },
  {
    id: "calm-boundary", keys: ["A-", "N-"], context: [35], name: "Den sakliga avgränsaren",
    core: "Ett lugnare känslomässigt tempo och en mer självständig samspelsstil kan ge dig utrymme att hålla en sakfråga öppen även när det socialt vore enklare att gå med på det första förslaget.",
    strength: "Du kan bidra med en tydlig gräns när alla andra pratar om hur något ska göras utan att fråga om det behöver göras alls.",
    risk: "Om resonemanget är tydligt för dig kan ett kort besked ändå lämna den andra utan sammanhang.",
    experiment: "När du håller en gräns, lägg till vad du försöker skydda i en mening. Fråga sedan om den andra uppfattade beskedet som du avsåg.",
    scene: "Om en gemensam plan tar mer tid än ni räknat med kan du föreslå ett tydligt stopp och förklara vilken del som fortfarande är genomförbar.",
    relationship: "Det kan vara lättare att stå kvar i en olikhet om du uttryckligen visar att sakfrågan får vara oavgjord medan relationen består.",
    free: ["Ett lugnt nej kan göra plats för ett bättre ja", "I ditt underlag kan lugn och en mer självständig hållning göra det möjligt att låta en fråga vara öppen tills alternativen klarnat.", "Det hjälper när ett snabbt ja skulle göra det svårare att säga vad som är rimligt senare.", "Rapporten visar hur du kan behålla gränsen och göra den lättare att förstå."],
  },
  {
    id: "reliable-care", keys: ["A+", "C+"], context: [36], name: "Den som får hjälpen att hända",
    core: "Hänsyn och genomförande kan göra omtanke pålitlig även när den kräver flera steg. Du kan bidra genom att ge ett löfte en form som går att följa upp.",
    strength: "När någon behöver hjälp kan du göra den lättare att ta emot genom att erbjuda något konkret och säga när du kan göra det.",
    risk: "Ett erbjudande som börjar av omtanke kan växa när du också vill få arbetet färdigt. Det är lättare att se gränsen när den är tydlig redan från början.",
    experiment: "Ge nästa erbjudande en omfattning och en sluttid: ’Jag kan göra den här delen fram till söndag.’ Låt resten vara en egen fråga.",
    scene: "Om en vän ska flytta kan det vara tydligare att erbjuda två timmar för ett visst moment än att säga att du kan hjälpa till med allt.",
    driver: "Ett mål kan kännas mer angeläget när det går att se vem som får nytta av arbetet och vilken del du själv kan ansvara för.",
    relationship: "Pålitliga, avgränsade erbjudanden kan vara lättare för andra att både tacka ja till och återgälda.",
    free: ["Din omtanke kan bli konkret tidigt", "När hänsyn får sällskap av struktur kan hjälp få en form som andra faktiskt kan planera kring.", "Hur hjälpen ramas in påverkar vem som bär resten av uppgiften.", "Rapporten visar hur du kan göra ett erbjudande tydligt utan att ta över hela arbetet."],
  },
  {
    id: "measured-focus", keys: ["O-", "C+"], context: [32], name: "Den praktiska förfinaren",
    core: "Ett konkret fokus tillsammans med struktur kan göra det lättare att förbättra något i flera små steg. Du kan se värdet i att förfina det som redan fungerar tillräckligt väl för att prövas.",
    strength: "När alternativen är många kan du göra jämförelsen användbar genom att välja två egenskaper som faktiskt får konsekvenser i vardagen.",
    risk: "En snabb sortering efter praktisk nytta kan utesluta ett ovant alternativ innan det hunnit visa vad det kan göra.",
    experiment: "När du jämför välkända lösningar, ge också ett ovant alternativ ett litet försök med samma villkor. Låt utfallet avgöra om det ska få mer tid.",
    scene: "Inför ett större inköp kan du jämföra kostnad och skötsel över tid och sedan prova den okända modellen i liten skala om det är möjligt.",
    driver: "Synliga förbättringar kan ge mer mening åt arbetet än en storslagen idé vars praktiska innebörd ännu är oklar.",
    free: ["En liten förbättring kan ge dig mer information än en stor plan", "Ett praktiskt fokus och struktur kan tillsammans göra ett experiment lätt att jämföra med det som redan fungerar.", "Då behöver en förändring inte vara stor för att ändra beslutet.", "Rapporten visar också hur du kan ge ett ovant alternativ en rättvis chans."],
  },
  {
    id: "social-motion", keys: ["E+", "O+"], context: [31], name: "Idébollaren",
    core: "När socialt initiativ och nyfikenhet möts kan ett samtal fungera som ett sätt att tänka. En idé kan bli tydligare när någon ställer frågan du inte hade tänkt på själv.",
    strength: "Du kan få en grupp ur en tidig låsning genom att låta någon bygga vidare på förslaget innan ni röstar om det.",
    risk: "Ett livligt utbyte kan kännas som framsteg även när ni ännu inte har valt vad som ska hända sedan.",
    experiment: "Avsluta nästa bra idésamtal med att var och en säger vilken idé som är värd ett försök och vad som skulle räknas som ett svar.",
    scene: "När ni planerar något ihop kan du använda första halvan av samtalet till idéer och sista fem minuterna till att välja vad ni faktiskt testar.",
    driver: "Ett mål kan få mer energi när det finns någon att pröva idéer tillsammans med och utrymme att förändra dem på vägen.",
    free: ["Samtalet kan vara en del av hur du tänker", "När nyfikenhet möter socialt initiativ kan andras frågor ge en idé en form den aldrig hade fått på egen hand.", "Därför kan den som deltar i samtalet påverka vad som över huvud taget blir ett alternativ.", "Rapporten visar hur du kan ta vara på det utan att förväxla ett livligt samtal med ett fattat beslut."],
  },
  {
    id: "quiet-consistency", keys: ["E-", "C+"], context: [38], name: "Den tysta genomföraren",
    core: "Återhållsamhet i större utbyten och struktur i arbetet kan göra att ditt bidrag blir tydligast i vad som faktiskt blir gjort. Det kan ge en annan sorts inflytande än att vara den som pratar först.",
    strength: "Du kan hjälpa en grupp att hålla kurs genom att göra det tydligt vad ni redan bestämt och vad som återstår.",
    risk: "Om du väntar med att visa arbetet tills det är genomtänkt kan andra fatta beslut utan att känna till den information du har.",
    experiment: "Visa en tidig lägesbild i tre rader: klart, öppet, nästa steg. På så sätt blir arbetet synligt innan du behöver försvara en färdig lösning.",
    scene: "När ni förbereder ett gemensamt arrangemang kan du skicka en kort avstämning innan någon annan börjar planera utifrån en annan tidslinje.",
    free: ["Ditt inflytande kan synas först i det som blir gjort", "Social återhållsamhet och struktur kan ge tyngd åt dina bidrag även när du inte är den som sätter tonen i rummet.", "Andra kan använda den tyngden bättre om de ser arbetet före slutresultatet.", "Rapporten ger ett konkret sätt att göra ditt bidrag synligt utan att byta arbetssätt."],
  },
];
