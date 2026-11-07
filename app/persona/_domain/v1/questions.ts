import type { Dimension, Question, SectionId, Theme } from "../types";
import { immutable } from "../immutable";

export const ratingLabels = immutable(["Stämmer mycket dåligt", "Stämmer ganska dåligt", "Varken bra eller dåligt", "Stämmer ganska bra", "Stämmer mycket bra"]);
export const unknownLabel = "Svårt att bedöma";
export const introduction = "Föreställ dig situationen så konkret du kan. Välj det alternativ som ligger närmast vad du faktiskt skulle göra, även när flera svar känns rimliga. Några frågor handlar om hur du brukar fungera. Utgå då främst från det senaste året. Du behöver inte ha upplevt exakt det som beskrivs. Välj Svårt att bedöma när du inte kan leva dig in i situationen eller när inget alternativ ligger tillräckligt nära.";
const id = (n: number) => `P${String(n).padStart(2, "0")}`;
const chapter = (n: number): 1 | 2 | 3 => n <= 10 ? 1 : n <= 22 ? 2 : 3;
const rating = (n: number, title: string, prompt: string, dimension: Dimension, reverse = false): Question => ({ id: id(n), chapter: chapter(n), title, prompt, kind: "rating", options: ratingLabels, dimension, reverse, purpose: `Försiktig orientering inom ${dimension}; egen nyskriven indikator, inte en validerad skala.`, supports: ["portrait", "dimensions", "tensions"], source: "persona-original" });
const scenario = (n: number, title: string, prompt: string, options: readonly string[], purpose: string, supports: readonly SectionId[]): Question => ({ id: id(n), chapter: chapter(n), title, prompt, options, purpose, supports, kind: "scenario", source: "persona-original" });
const all: readonly SectionId[] = ["portrait", "drivers", "relationships", "tensions", "strengths", "compass"];

/** Canonical fixed wording from the approved creative revision; order is part of v1. */
export const fixedQuestions: readonly Question[] = immutable([
  rating(1, "Att öppna rummet", "När ett samtal mellan människor som inte känner varandra går trögt brukar jag själv försöka få igång det.", "E"),
  scenario(2, "Någon annans namn", "På ett möte berömmer en ansvarig person ett förslag som du och en kollega arbetat fram. Personen verkar tro att kollegan gjort det mesta. Kollegan säger inget, men du vet inte om hen märkt missförståndet. Vad gör du helst?", [
    "Lägger kort till vad jag bidrog med medan förslaget fortfarande diskuteras.",
    "Pratar med kollegan efteråt och ber hen hjälpa till att göra ansvarsfördelningen tydlig nästa gång.",
    "Låter mötet gå vidare och ser till att mitt arbete blir synligt genom det jag gör framöver.",
    "Lyfter det gemensamma arbetet nu och beskriver min egen del i den skriftliga uppföljningen.",
  ], "Hur erkännande söks, timing och synliggörande av eget bidrag.", all),
  rating(3, "Andra sätt att se", "Jag dras till idéer som får mig att se något välbekant på ett oväntat sätt.", "O"),
  scenario(4, "Samma möjlighet", "Du och en nära vän upptäcker att ni vill söka samma attraktiva uppdrag. Båda känner till möjligheten och ingen har lovat den andra något. Du tror att ni båda har en verklig chans.", [
    "Säger att jag tänker söka och vill prata om hur vi kan hantera konkurrensen mellan oss.",
    "Söker och berättar det, men vill hålla våra förberedelser åtskilda.",
    "Söker på egen hand och tar samtalet om det när processen kommit längre.",
    "Undersöker först om det finns en annan möjlighet jag skulle vilja lika mycket, innan jag bestämmer mig.",
  ], "Konkurrens inom en relation, öppenhet och alternativa vägar.", all),
  rating(5, "Det som ännu inte är avgjort", "När något viktigt är oklart blir jag ofta upptagen av vad som kan gå fel, även när jag inte kan påverka mer just då.", "N"),
  scenario(6, "Undantaget", "Du fördelar en begränsad resurs i en förening eller arbetsgrupp. En person du tycker mycket om ber om ett undantag från den vanliga fördelningen. Skälet är begripligt, men undantaget kan påverka andra.", [
    "Prövar önskemålet mot samma kriterier som övriga, även om det tar längre tid att få ett besked.",
    "Gör undantaget och är öppen med skälet, med beredskap att ge andra samma möjlighet.",
    "Försöker lösa det genom något jag själv kan avstå från, utan att ändra de andras tilldelning.",
    "Föreslår en tillfällig förändring av regeln så att hela gruppen kan pröva ett annat sätt.",
  ], "Likabehandling, situationshänsyn, egen kostnad och förändring av regler.", all),
  rating(7, "När någon räknar med dig", "När andra är beroende av ett åtagande jag gjort vill jag bestämma hur och när det ska bli klart innan jag börjar.", "C"),
  scenario(8, "En oväntad beskrivning", "Någon som känner dig ganska väl säger: Du vill nog bestämma mer än du själv tror. Du tänker på dig själv som en person som gärna lämnar utrymme åt andra. Ni har nyligen gjort något tillsammans där du tog mycket ansvar.", [
    "Ber om ett konkret exempel och vill prova att göra annorlunda nästa gång.",
    "Förklarar varför jag tog ansvar och frågar vilken del personen själv hade velat styra.",
    "Låter personen leda nästa gång och ser hur det fungerar utan min vanliga inblandning.",
    "Säger att tydlighet är viktig för mig och vill komma överens om vad jag ska få hålla i.",
  ], "Reaktion på återkoppling, fördelning av kontroll och självbeskrivning.", all),
  rating(9, "Att ha allas uppmärksamhet", "När flera personer lyssnar på samma gång föredrar jag oftast att någon annan håller i samtalet.", "E", true),
  scenario(10, "Beröm för fel sak", "Du får varmt beröm för något du gjort. Personen uppskattar framför allt den del som du själv tycker var ganska enkel. Det du arbetat mest med verkar ha gått obemärkt förbi.", [
    "Tar emot berömmet och berättar också vad jag själv är mest stolt över.",
    "Tar emot omtanken i berömmet och behåller min egen värdering för mig själv.",
    "Frågar vad personen tyckte om den del som var viktigast för mig.",
    "Berättar hur jag själv ser på resultatet, även om samtalet då blir mindre av ett firande.",
  ], "Vilken sorts erkännande som efterfrågas och hur egen bedömning uttrycks.", all),
  scenario(11, "Din chans, deras problem", "Du får ett erbjudande du länge velat ha. För att ta det behöver du lämna ett gemensamt projekt tidigare än planerat. De andra klarar sig sannolikt, men får en besvärlig period.", [
    "Tackar ja och lägger kraft på en så bra överlämning som jag kan åstadkomma.",
    "Ber den nya parten om senare start, även om det kan försämra mina möjligheter.",
    "Väljer att avsluta det gemensamma projektet och accepterar att erbjudandet kan försvinna.",
    "Pratar med gruppen innan jag bestämmer mig och låter deras situation påverka mitt beslut.",
  ], "Egen möjlighet, tidigare åtagande och graden av gemensamt inflytande.", all),
  rating(12, "Beslut som berör fler", "Jag vill ofta förstå hur ett beslut påverkar andra innan jag väljer, även när jag själv redan vet vad jag föredrar.", "A"),
  scenario(13, "Vännen bland kandidaterna", "Du sitter i en liten grupp som ska välja vem som får ett eftertraktat stipendium eller uppdrag. En nära vän är en stark kandidat. Relationen är känd, men ni har ännu inte bestämt hur sådana situationer ska hanteras.", [
    "Avstår från att bedöma just min vän och deltar i resten av arbetet.",
    "Bedömer alla enligt en skriftlig mall och ber någon annan kontrollera min bedömning.",
    "Ber gruppen bestämma en gemensam princip för relationer innan någon kandidat diskuteras.",
    "Lämnar hela bedömningsrollen för att slippa påverka processen indirekt.",
  ], "Vald rättviseprocedur och hur relationens inflytande avgränsas.", all),
  scenario(14, "Sista ordet", "Du har sista ordet i ett beslut som påverkar flera personer. Gruppen lutar åt ett alternativ. Du tror mer på ett annat, men inget av dem är uppenbart rätt.", [
    "Fattar det beslut jag själv tror mest på och tar ansvar för att förklara och följa upp det.",
    "Följer gruppens riktning och gör min reservation tydlig.",
    "Väljer ett begränsat försök som går att ändra innan vi låser oss.",
    "Låter den med bäst sakkunskap välja vägen och behåller ansvaret för ramarna.",
  ], "Eget mandat, förankring, reversibilitet och delegering.", all),
  rating(15, "Nyfiken utan användningsområde", "Jag tycker om att utforska ett nytt ämne även när jag inte vet vad jag ska använda kunskapen till.", "O"),
  scenario(16, "Det var det du också ville", "En vän får något du själv längtat efter. Du är glad för hens skull och märker samtidigt att du jämför er. Vännen hör av sig för att berätta.", [
    "Gratulerar och frågar om upplevelsen; min egen jämförelse får jag ta hand om efteråt.",
    "Svarar varmt men kort och tar mer kontakt när jag hunnit landa i min egen reaktion.",
    "Gratulerar och använder sedan känslan till att bestämma ett eget nästa steg.",
    "Berättar att jag är glad och att beskedet också väcker något svårt hos mig, utan att be vännen tona ner sin glädje.",
  ], "Vald hantering av jämförelse, känsla, handling och personlig öppenhet.", all),
  rating(17, "Efter besvikelsen", "När något inte blir som jag hoppats brukar känslorna lägga sig ganska snabbt.", "N", true),
  scenario(18, "Det som skulle stanna mellan er", "Du berättade något personligt för en vän. Senare märker du att vännen nämnt det för en annan person. Vännen säger att det inte var illa menat och verkar förvånad över att du reagerar.", [
    "Vill förstå hur det gick till och göra en tydlig överenskommelse om vad som får föras vidare.",
    "Fortsätter relationen men blir mer selektiv med vad jag berättar.",
    "Säger hur det påverkat mig och behöver en paus innan jag vet hur jag vill ha det.",
    "Vill först begränsa följderna av att informationen spridits och tar relationsfrågan därefter.",
  ], "Förtroendebrott, praktiska följder och villkor för fortsatt närhet.", all),
  rating(19, "När nyheten har lagt sig", "Jag fortsätter oftast med en uppgift jag påbörjat även när något nytt börjar kännas mer lockande.", "C"),
  scenario(20, "Felet som blev gemensamt", "Ett beslut du varit drivande i visar sig bygga på ett misstag från din sida. Flera andra godkände också beslutet. Det finns tid att rätta till det, men situationen kan bli besvärlig.", [
    "Berättar för gruppen vad jag missat och föreslår hur vi går vidare.",
    "Pratar först med dem som påverkas mest och samlar sedan gruppen.",
    "Arbetar fram en möjlig rättelse innan jag tar upp felet, så att jag också har något konkret att erbjuda.",
    "Ber gruppen gå igenom hur beslutet blev till och klargör min egen del i den genomgången.",
  ], "Ordningen mellan öppenhet, hänsyn, åtgärd och gemensamt lärande.", all),
  scenario(21, "Fördelen du inte bett om", "Du får en större belöning än en kollega efter ett gemensamt arbete. Du har inte lämnat felaktiga uppgifter. Du vet heller inte säkert hur beslutsfattaren har resonerat. Kollegan blir besviken.", [
    "Tar emot belöningen och håller fast vid att bedömningen är beslutsfattarens ansvar.",
    "Ber om en förklaring innan jag avgör hur jag vill förhålla mig till skillnaden.",
    "Är öppen med kollegan om vad jag fått och hjälper hen att formulera sina frågor, utan att avstå från min belöning.",
    "Driver frågan om tydligare kriterier nästa gång, även om just den här fördelningen får stå kvar.",
  ], "Egen fördel, insyn, relationell öppenhet och förändring av system.", all),
  scenario(22, "Hjälpen som inte behövdes", "Du har lagt tid på att tänka ut hur du kan hjälpa någon du tycker om. Personen tackar men säger att hen vill lösa det själv. Du märker en besvikelse över att ditt bidrag inte efterfrågas.", [
    "Tar ett steg tillbaka och låter personen höra av sig om behovet ändras.",
    "Frågar en gång vilken sorts stöd som faktiskt skulle vara välkommet.",
    "Berättar att jag blev lite besviken, samtidigt som jag låter beslutet stå.",
    "Fortsätter vara närvarande på andra sätt och lämnar just problemet åt personen.",
  ], "Mottagarens självbestämmande, eget känslouttryck och omställning av stöd.", all),
  rating(23, "Oenighet", "Vid oenighet prioriterar jag oftast att reda ut sakfrågan framför att vi känner samförstånd.", "A", true),
  scenario(24, "Att behöva någon", "Du går igenom något som gör dig osäker. En person du litar på skulle kunna finnas där, men du vill inte känna att du lämnar över ansvaret för ditt liv.", [
    "Ber personen lyssna medan jag försöker förstå vad som pågår.",
    "Ber om en avgränsad praktisk hjälp så att jag kan hantera resten själv.",
    "Väntar med att ta kontakt tills jag vet bättre vad jag behöver.",
    "Föreslår att vi träffas, men berättar bara så mycket som jag känner mig redo för.",
  ], "Hur stöd efterfrågas och vad personen vill behålla eget ansvar för.", all),
  rating(25, "Energi från andra", "Efter en längre stund av ensamarbete vill jag ofta söka upp människor för att få ny energi.", "E"),
  scenario(26, "Vännen vill ha dig på sin sida", "En vän berättar om en konflikt och vill tydligt ha ditt stöd. Du förstår varför vännen är sårad, men tycker också att hen bidrog till det som hände.", [
    "Börjar med att finnas på vännens sida känslomässigt och tar upp hens del senare.",
    "Säger från början både vad jag förstår och vad jag tycker att vännen behöver se.",
    "Frågar om hen vill bli lyssnad på eller höra min uppriktiga bedömning just nu.",
    "Avstår från att bedöma vem som har rätt och fokuserar på vad vännen vill göra härnäst.",
  ], "Känslomässigt stöd, uppriktighet, samtycke till återkoppling och handlingsfokus.", all),
  rating(27, "Orden efteråt", "Kritiska kommentarer brukar stanna kvar i mina tankar långt efter att samtalet är över.", "N"),
  scenario(28, "Ursäkten räcker inte hela vägen", "Någon nära har brutit ett förtroende. Personen har bett om ursäkt och du tror att ursäkten är uppriktig. Du känner ändå inte samma tillit som tidigare.", [
    "Vill bygga upp förtroendet genom små överenskommelser som går att följa upp.",
    "Vill behålla relationen men låta vissa delar av mitt liv förbli mer privata.",
    "Behöver ett djupare samtal om vad som hände innan jag kan välja nästa steg.",
    "Behöver mer avstånd under en tid, även om det gör relationens framtid osäker.",
  ], "Villkor för återupprättat förtroende. Ingen rangordning av förlåtelse.", all),
  rating(29, "Att återvända", "När jag får välja fritt återvänder jag gärna till välbekanta ämnen eller upplevelser i stället för att söka något helt nytt.", "O", true),
  scenario(30, "Den generösa personen", "Du har lovat att hjälpa till igen. Efteråt märker du att du känner mer motstånd än du väntat dig. Du tycker om att vara generös, men börjar uppleva att din tillgänglighet tas för given.", [
    "Håller det här löftet och bestämmer tydligare villkor innan jag säger ja nästa gång.",
    "Tar upp det nu och försöker minska det jag har lovat, trots att det kan ställa till det.",
    "Berättar om obalansen och vill prata om hur vi kan hjälpa varandra mer ömsesidigt.",
    "Genomför det jag lovat men avslutar sedan just den här återkommande hjälprollen.",
  ], "Löften, omförhandling, ömsesidighet och avslut av en roll.", all),
  rating(31, "Två sidor", "När jag försöker förstå ett gräl blir jag ofta upptagen av hur båda sidor upplever situationen.", "A"),
  rating(32, "Vägen kan ändras", "Jag låter gärna arbetssättet ändras under vägen i stället för att hålla fast vid den plan jag gjorde från början.", "C", true),
  scenario(33, "Arbetet och publiken", "Du kan välja hur något du skapat ska få möta andra. Alla alternativen är genomförbara, men inget ger dig allt.", [
    "Ett resultat jag själv tycker håller hög kvalitet, även om mitt namn inte syns.",
    "En större publik och tydlig koppling till mig, även om jag får mindre kontroll över slutresultatet.",
    "En mindre krets vars omdöme betyder mycket för mig.",
    "Mer tid innan jag visar det, tills jag själv kan stå för det utan att behöva andras reaktion direkt.",
  ], "Egen kvalitetsbedömning, synlighet, utvald publik och timing.", all),
  scenario(34, "Innan du vågar stå för det", "Du har nästan bestämt dig för ett viktigt val. När du föreställer dig att en person du respekterar skulle ogilla det blir du osäker.", [
    "Ber om personens stöd och säger att hens reaktion faktiskt betyder mycket för mig.",
    "Ber personen pröva mitt resonemang kritiskt så att jag kan skilja svagheter i beslutet från min oro för reaktionen.",
    "Fattar beslutet först och berättar sedan, så att ansvaret tydligt förblir mitt.",
    "Väntar med att dela beslutet tills jag hunnit förstå varför reaktionen påverkar mig så mycket.",
  ], "Önskat stöd, kritisk prövning, egen beslutspunkt och privat reflektion.", all),
]);

const adaptive = (n: number, theme: Theme, title: string, prompt: string, options: readonly string[]): Question => ({ id: `A${String(n).padStart(2, "0")}`, chapter: 4, kind: "scenario", theme, title, prompt, options, purpose: `Fördjupning inom ${theme}; utvald genom versionsbundna svarskombinationer.`, supports: all, source: "persona-original" });
export const adaptiveQuestions: readonly Question[] = immutable([
  adaptive(1, "R", "Resultatet utan ditt namn", "Du erbjuds att bidra till något du tror starkt på. Resultatet kan bli mycket bra, men ditt namn kommer inte att synas. Du får samtidigt möjlighet till ett mindre betydelsefullt arbete där ditt bidrag blir tydligt.", [
    "Väljer det starkare resultatet; det räcker att jag själv vet vad jag bidragit med.",
    "Väljer det starkare resultatet men vill att några personer jag värdesätter känner till min del.",
    "Väljer det synliga arbetet eftersom jag vill bygga möjligheter genom det jag gör.",
    "Försöker förhandla fram ett sätt att kombinera betydelse och synlighet, även om jag då kan förlora båda alternativen.",
  ]),
  adaptive(2, "R", "Applåden som missar dig", "Något du gjort blir omtyckt för en egenskap som du själv inte tycker representerar arbetet särskilt väl. Du får mer uppskattning än du väntat dig.", [
    "Låter andra ha sin upplevelse och behåller min egen förståelse av arbetet.",
    "Berättar mer om den del jag själv tycker är viktig, även om det förändrar mottagandet.",
    "Tar reda på vad uppskattningen säger om dem jag nått och låter det påverka nästa arbete.",
    "Söker respons från en mindre krets som kan bedöma det jag själv försökte åstadkomma.",
  ]),
  adaptive(3, "R", "Om ingen kunde jämföra", "Du får veta att en person du ofta jämför dig med har nått längre än du inom ett område som betyder mycket för dig. Tänk dig att du kan välja vad du får veta härnäst.", [
    "Hur personens väg faktiskt såg ut, även de delar som inte synts.",
    "Vad någon kunnig tycker om mina egna möjligheter framåt.",
    "Vilket konkret steg jag själv kan ta utan att följa personens väg.",
    "Inget mer just nu; jag vill först märka vad jag själv fortfarande vill när jämförelsen fått lägga sig.",
  ]),
  adaptive(4, "L", "När det verkligen är lika", "Du får sista ordet mellan två likvärdiga kandidater. Den ena har hjälpt dig mycket tidigare. Den andra har ingen sådan relation till dig. De kända meriterna skiljer dem inte åt.", [
    "Låter den tidigare relationen väga som ytterligare relevant erfarenhet av personen.",
    "Tar in en ny bedömare som inte har min relation till någon av dem.",
    "Låter en i förväg tydlig neutral utslagsregel avgöra.",
    "Undersöker vilket val som tillför mest till sammanhanget, snarare än vem som förtjänar det mest.",
  ]),
  adaptive(5, "L", "Det outtalade löftet", "En vän säger: Jag trodde att vi skulle göra det här tillsammans. Du har fått en möjlighet som skulle föra dig vidare på egen hand. Du minns ingen överenskommelse, men förstår varför vännen hade förväntningen.", [
    "Försöker skapa en gemensam fortsättning även om min egen möjlighet blir mindre.",
    "Väljer möjligheten och vill samtidigt erkänna att vännen kan uppleva en verklig förlust.",
    "Tar tid på mig att reda ut vad vi faktiskt lovat varandra innan jag bestämmer mig.",
    "Försöker få vännen involverad på ett annat sätt utan att göra mitt beslut gemensamt.",
  ]),
  adaptive(6, "L", "Undantaget får en efterföljare", "Du gjorde ett begripligt undantag för en person. Nu kommer någon annan med ett liknande skäl. Att ge samma undantag igen skulle göra den ursprungliga regeln svår att upprätthålla.", [
    "Ger samma möjlighet nu och tar sedan upp om regeln behöver ändras.",
    "Gör en ny individuell bedömning och accepterar att fallen kan få olika utfall.",
    "Pausar nya undantag tills gruppen bestämt vad som ska gälla.",
    "Försöker hitta en annan form av stöd som inte bygger på undantag från regeln.",
  ]),
  adaptive(7, "M", "När du inte kan få med dig alla", "Du behöver fatta ett beslut innan dagen är slut. De berörda har blivit hörda, men några kommer att motsätta sig vilket alternativ du än väljer.", [
    "Väljer det jag bedömer som bäst och beskriver vilken nackdel jag accepterar.",
    "Väljer det alternativ flest kan leva med, även om det inte är min egen favorit.",
    "Väljer det som är lättast att rätta till om bedömningen visar sig fel.",
    "Ber en person med relevant sakkunskap ge en sista rekommendation och låter den väga tungt.",
  ]),
  adaptive(8, "M", "Efter ditt beslut", "Ett beslut du fattat blir sämre än väntat. Du hade rimliga skäl och gruppens stöd. Någon frågar offentligt varför det blev som det blev.", [
    "Börjar med mitt eget ansvar och förklarar sedan förutsättningarna.",
    "Börjar med vad vi visste när beslutet fattades och beskriver därefter ansvaret.",
    "Börjar med vad jag tänker ändra och går sedan igenom hur vi hamnade här.",
    "Föreslår en gemensam genomgång så att både mitt beslut och gruppens underlag blir synliga.",
  ]),
  adaptive(9, "M", "De klarade det utan dig", "Du brukar vara den som håller ihop något. Under din frånvaro har andra ändrat arbetssättet, och det verkar fungera bra. Ingen har frågat dig först.", [
    "Vill förstå förändringen ordentligt innan jag avgör vilken roll jag ska ha nu.",
    "Låter dem fortsätta och tar ansvar för en annan avgränsad del.",
    "Ber om ett samtal om vilka beslut de vill äga och vilka de fortfarande vill att jag tar.",
    "Provar deras sätt en period innan vi bestämmer den fortsatta ansvarsfördelningen.",
  ]),
  adaptive(10, "F", "Det svåraste att få tillbaka", "Någon har gjort en trovärdig ansträngning för att reparera ett brutet förtroende. Vilken förändring skulle betyda mest för dig?", [
    "Att personen håller små överenskommelser konsekvent över tid.",
    "Att jag upplever att personen verkligen förstått hur det blev för mig.",
    "Att vi har tydligare gränser för vad vi kan förvänta oss av varandra.",
    "Att vi kan vara tillsammans utan att hela relationen kretsar kring det som hände.",
  ]),
  adaptive(11, "F", "Samma människa, annan relation", "Du tycker fortfarande om en person efter en besvikelse, men vill inte återgå till exakt samma närhet. Vilken fortsättning känns mest möjlig?", [
    "En nära relation som byggs upp långsamt med tydligare överenskommelser.",
    "En varm relation där vissa personliga områden förblir mina.",
    "En mer avgränsad relation utan förväntan att den måste bli som förr.",
    "En paus där vi senare får avgöra om någon ny form känns rätt.",
  ]),
  adaptive(12, "F", "Svaret som kan göra ont", "Någon nära frågar om din ärliga bedömning av ett beslut hen verkar vilja få bekräftat. Du har invändningar som kan påverka relationen.", [
    "Säger min bedömning tydligt eftersom personen uttryckligen frågat.",
    "Frågar först om hen vill ha stöd för beslutet eller hjälp att pröva det.",
    "Beskriver mina viktigaste farhågor och låter personen själv dra slutsatsen.",
    "Är tydlig med vad jag inte kan bedöma och håller mig till den del jag faktiskt har underlag för.",
  ]),
  adaptive(13, "G", "Rollen du blivit bra på", "Du är ofta den som andra kontaktar när något behöver lösas. Du uppskattar förtroendet, men märker att rollen tar mer plats än du vill.", [
    "Behåller rollen men sätter tydligare gränser för när jag är tillgänglig.",
    "Hjälper andra att ta över delar, även om det blir sämre under en övergång.",
    "Väljer vilka situationer jag fortfarande vill vara den personen i.",
    "Kliver ur rollen under en period för att märka vad jag själv vill återvända till.",
  ]),
  adaptive(14, "G", "Att ta emot utan att betala tillbaka direkt", "En vän erbjuder hjälp som skulle göra stor skillnad för dig. Du kan inte erbjuda något likvärdigt just nu.", [
    "Tar emot och berättar att det känns ovant att inte kunna återgälda.",
    "Tar emot en tydligt avgränsad del så att omfattningen känns hanterbar.",
    "Frågar vad vännen förväntar sig, så att jag vet vad hjälpen innebär mellan oss.",
    "Tar emot och låter ömsesidigheten få sträcka sig över längre tid.",
  ]),
  adaptive(15, "G", "Ett nej som märks", "Du har rätt att tacka nej till en förfrågan, men ditt nej skulle göra någon du tycker om tydligt besviken. Vilken väg ligger närmast?", [
    "Säger nej och låter besvikelsen få finnas utan att försöka lösa den.",
    "Säger nej till huvudförfrågan men erbjuder en mindre insats.",
    "Ber om tid och undersöker om en annan fördelning skulle göra ett ja möjligt.",
    "Säger ja den här gången och gör samtidigt klart att det är ett undantag.",
  ]),
  adaptive(16, "S", "Egenskapen du vill kännas vid", "Någon beskriver en egenskap hos dig som du själv värdesätter. Samtidigt kommer du att tänka på ett tillfälle då du handlade tvärtom.", [
    "Berättar om undantaget; jag vill att bilden av mig ska rymma båda delarna.",
    "Tar emot beskrivningen och funderar privat på när den stämmer.",
    "Frågar vad personen sett som fått hen att uppfatta mig så.",
    "Låter beskrivningen stå men använder undantaget för att välja hur jag vill agera nästa gång.",
  ]),
  adaptive(17, "S", "Det du vill höra", "Du vill berätta något viktigt för någon nära. Du märker att du redan hoppas på en viss reaktion.", [
    "Säger vilken sorts stöd jag önskar innan jag berättar.",
    "Berättar utan att styra svaret, även om jag kan bli besviken.",
    "Väljer en person vars sätt att svara brukar passa det jag behöver just nu.",
    "Väntar tills jag känner att jag kan bära fler möjliga reaktioner.",
  ]),
  adaptive(18, "S", "Ett beslut utan publik", "Du föreställer dig att ingen kommer att berömma eller kritisera ditt nästa viktiga val. Vad skulle du då vilja låta väga tyngst?", [
    "Att valet stämmer med vad jag själv tycker är viktigt, även om vägen blir besvärligare.",
    "Att vardagen som följer känns möjlig att leva i.",
    "Att jag får pröva en möjlighet jag annars skulle undra över.",
    "Att valet tar hänsyn till de relationer jag vill fortsätta bygga mitt liv tillsammans med.",
  ]),
]);
export const questionBank: readonly Question[] = immutable([...fixedQuestions, ...adaptiveQuestions]);
export function getQuestion(questionId: string): Question {
  const question = questionBank.find(q => q.id === questionId);
  if (!question) throw new Error("Unknown PERSONA question");
  return question;
}
