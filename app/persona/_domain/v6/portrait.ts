import type { Evidence, Dimension } from "../types";
import type { Reading, Block, Claim } from "./types";

export function buildPortrait(readings: readonly Reading[], answers: readonly number[]): Block {
  const claims: Claim[] = [];
  const is = (d: Dimension, direction: Reading["direction"]) => readings.some(r => r.dimension === d && r.direction === direction);
  const raw = (n: number, high = true) => answers[n-1] > 0 && (high ? answers[n-1] >= 4 : answers[n-1] <= 2);
  function add(id: string, text: string, dims: readonly Dimension[] = [], numbers: readonly number[] = []) {
    const selected = readings.filter(r => dims.includes(r.dimension));
    const evidence: Evidence[] = [...selected.flatMap(r => r.support), ...numbers.map(n => ({questionId:"Q"+String(n).padStart(2,"0"),answer:answers[n-1]}))];
    claims.push({ id, text, evidence: Array.from(new Map(evidence.map(e => [e.questionId,e])).values()), counterEvidence: selected.flatMap(r => r.counter) });
  }
  const emotionalCare = is("A","high") && is("N","high") && raw(19) && !is("E","high") && !is("E","low");
  if (is("E","high") && is("A","high") && raw(27)) {
    add("contact-and-company", "Du verkar trivas med att ta kontakt och samtidigt värdesätta att människor hittar lösningar tillsammans. I en gemensam kväll eller ett nytt sällskap kan du både vilja komma in i samtalet och bry dig om hur ni har det ihop. För dig kan det vara skillnad mellan att få något att hända och att bestämma åt alla. Båda sidorna ryms i din profil.", ["E","A"]);
  } else if (is("E","low") && is("A","high")) {
    add("quiet-care-"+(is("O","high")?"curious":"familiar"), is("O","high")
      ? "Du beskriver omtanke om andra och ett mer återhållsamt socialt sätt. Samtidigt finns ett tydligt intresse för nya idéer och upplevelser. Det kan alltså finnas gott om sådant du vill utforska, även när ditt sociala deltagande är mer lågmält. Hur mycket du pratar är ingen bra ensam måttstock på ditt intresse. De olika sidorna behöver få plats samtidigt i bilden av dig."
      : "Du verkar värdesätta att människor tar hänsyn till varandra, utan att själv behöva ta mycket plats. Du kan vilja vara delaktig och ändå föredra ett lugnare socialt tempo. Det gör det rimligt att skilja på hur synlig du är och vad du vill bidra med. Ett kort svar behöver till exempel inte betyda att en väns fråga är oviktig för dig.", is("O","high") ? ["E","A","O"] : ["E","A"]);
  } else if (emotionalCare) {
    add("care-and-changing-feelings", "Du verkar bry dig om hur andra har det, samtidigt som dina egna känslor kan skifta tydligt. I ett samtal kan du till exempel vilja lyssna på någon och samtidigt vara berörd av något eget. Då är det två frågor som får plats: vad den andra behöver och hur du själv har det. Porträttet handlar därför om både din vilja till hänsyn och din egen upplevelse, utan att göra den ena till förklaring av den andra.", ["A","N"]);
  } else if (is("E","mixed") && raw(1) && raw(11) && raw(6)) {
    add("different-social-situations", "Du kan känna dig bekväm med andra och gärna inleda ett samtal, men ändå bli tystare bland människor du inte känner. Det är en konkret skillnad i dina svar, snarare än en anledning att välja mellan etiketterna utåtriktad och tillbakadragen. Hur du deltar kan se olika ut i olika sällskap. Här är det mer användbart att behålla den skillnaden än att låta ett enda genomsnitt beskriva dig.", [], [1,11,6]);
  } else if (is("A","high")) {
    if (raw(27)) {
      add("care-without-social-label", "Du verkar lägga vikt vid hänsyn och samarbete. I ett gemensamt val kan det därför vara viktigt för dig hur lösningen fungerar mellan människor, inte bara vilket alternativ som väljs. Ditt sociala sätt är mindre entydigt. Omtanken behöver alltså inte ta samma form i varje sällskap, och du behöver inte passa in i en bestämd social roll för att den ska vara en relevant del av bilden.", ["A","E"], [27]);
    } else if (raw(17) && raw(12,false)) {
      add("time-and-tone", "Du beskriver att du tar dig tid för andra och känner mindre igen dig i att ofta uttrycka dig vasst. I ett samtal kan det till exempel handla om att ge plats åt det den andra vill få fram. Din hållning till att samarbeta eller tävla är en separat fråga. Den behöver få ett eget svar, i stället för att tolkas fram ur hur du brukar bemöta andra.", ["A"], [17,12]);
    } else {
      add("individual-aspects-of-interaction", "Dina svar om samspel behöver läsas på sin egen nivå. Ton, tillit och tid för andra är olika delar. De behöver inte följas åt i varje situation, och den samlade riktningen får inte ersätta dina mer specifika svar.", ["A"]);
    }
  } else if (is("E","high") || is("E","low")) {
    add("social-preference", is("E","high")
      ? "Du verkar gärna ta kontakt och vara med i det som händer mellan människor. Det ger en tydlig social utgångspunkt, men avgör inte vad du vill i varje relation. Vem du träffar och vad ni gör kan fortfarande spela stor roll för om ett sammanhang passar dig."
      : "Du verkar föredra ett mer återhållsamt sätt att delta. Du behöver inte vara den som pratar mest eller märks först för att en kontakt ska vara meningsfull för dig. Det är en social preferens, inte en förklaring till hur nära du står andra människor.", ["E"]);
  }
  if (is("C","high") && is("O","high")) {
    add("curiosity-and-structure", "Du verkar också uppskatta både nya infallsvinklar och en tydlig ordning när något ska genomföras. Det behöver inte bli ett val mellan nyfikenhet och struktur. Du kan vilja undersöka en möjlighet och samtidigt veta vad ett beslut innebär i praktiken. I vardagen kan det till exempel vara skillnaden mellan att lockas av en ny aktivitet och att vilja få grepp om tid, kostnad och upplägg innan du väljer.", ["C","O"]);
  } else if (is("C","high") && is("O","low")) {
    add("familiar-structure", "Du verkar gärna bygga vidare på något du känner igen och hålla ihop det praktiska. Ett bekant upplägg kan ge dig en tydlig utgångspunkt när du väljer vad du vill lägga tid på. Det behöver finnas en poäng med att ändra något. En ny rutin kan därför bli mer relevant när du ser vad den tillför, än bara för att den är ny.", ["C","O"]);
  } else if (is("C","low") && is("O","high")) {
    add("interest-and-follow-through", "Nya idéer och upplevelser verkar däremot ha en tydligare plats än en jämnt hållen ordning. Det kan finnas en skillnad mellan vad du tycker är intressant och hur du tar dig igenom sådant som ska bli gjort. Den skillnaden är värd att behålla i bilden av dig. Den behöver varken bli en berättelse om brist på ambition eller om att allt fungerar bäst utan ramar.", ["C","O"]);
  } else if (is("C","high")) {
    add("practical-continuity", "När något ska bli gjort beskriver du mer kontinuitet än ryckighet. En tydlig överenskommelse kan ge dig något att återvända till, även om alla delar av en uppgift inte är lika lätta. Det praktiska verkar därför vara en viktig del av helheten: både vad som ska hända och hur det hänger ihop med resten av vardagen.", ["C"]);
  } else if (is("C","low")) {
    add("different-parts-of-doing", is("A","high")
      ? "Det finns också en skillnad mellan ditt intresse för samarbete och hur du organiserar det praktiska. Hänsynen är tydligare i dina svar än en jämnt hållen ordning. En vardaglig situation att känna efter i är när ni ordnar något tillsammans: att vilja hitta något båda uppskattar är en fråga, hur detaljerna ska hållas ihop är en annan."
      : "Du känner mindre igen dig i en jämnt hållen ordning genom det praktiska. Det gör en stor etikett om disciplin mindre användbar än att hålla isär de delar som frågorna berör. Din ambition, vilka mål du väljer och hur mycket du vill åstadkomma behöver fortfarande få beskrivas på andra sätt.", is("A","high") ? ["A","C"] : ["C"]);
  } else if (is("O","high") && !(is("E","low") && is("A","high"))) {
    add("curiosity-without-method", "Du verkar också uppskatta att möta idéer och upplevelser som ger något nytt att tänka på. Vad som väcker ditt intresse behöver få skiljas från hur du organiserar vardagen. Det går att vara nyfiken i en fråga och vilja hålla andra delar välbekanta. Därför beskriver din öppenhet ett intresseområde, inte en skyldighet att välja det mest ovanliga alternativet.", ["O"]);
  } else if (is("O","low")) {
    add("familiar-start", "Du verkar gärna ha en bekant utgångspunkt när du möter något nytt. En konkret koppling till sådant du redan gör kan vara mer intressant än en idé som ännu saknar plats i vardagen. Det ger en riktning åt dina val, utan att bestämma hur långt du vill gå inom ett ämne du själv tycker om.", ["O"]);
  }
  if (is("N","low") && raw(19)) {
    add("calm-with-mood-variation", "Du känner igen humörskiftningar, samtidigt som flera andra svar beskriver lugnare reaktioner. Det är en viktig skillnad att behålla. Ett lägre samlat värde ska därför inte göra din känslomässiga vardag mer enhetlig i texten än du själv har beskrivit den.", ["N"], [19]);
  } else if (is("N","low")) {
    add("steady-emotional-pace-"+(is("C","low")?"less-structured":"structured"), is("C","low")
      ? "Samtidigt beskriver du ett förhållandevis jämnt känsloläge. Mindre fast struktur behöver alltså inte betyda att vardagen känns känslomässigt turbulent. Hur något blir gjort och hur du reagerar under tiden är två skilda delar av din profil. Den kombinationen gör det mer precist att tala om vissa praktiska delar än om att hela vardagen skulle kännas svår."
      : "Du beskriver också ett förhållandevis jämnt känsloläge. När något ändras kan känslan inför det och det som behöver ordnas vara två olika frågor. Din profil ger plats åt båda: vad du tycker om det som hänt och hur du vill gå vidare. Ett lugnt läge behöver inte göra själva valet mindre viktigt.", is("C","low")?["N","C"]:["N"]);
  } else if (is("N","high") && !emotionalCare) {
    add("responsive-emotional-pace", "Dina känslor verkar också kunna ta tydlig plats. En situation kan beröra dig utan att den för den skull behöver styra varje beslut du fattar. Det är därför värt att behålla både reaktionen och resten av ditt sätt att fungera i bilden, i stället för att låta ett starkt ögonblick beskriva hela dig.", ["N"]);
  }
  if (is("O","mixed") && raw(15) && raw(30)) {
    add("interest-without-depth-demand", "I lärandet finns ytterligare en nyans: du kan uppskatta en ny idé och ändå tycka att grunderna ofta räcker. Intresse och lust att fördjupa sig i varje ämne är alltså inte samma sak i dina svar.", [], [15,30]);
  } else if (emotionalCare) {
    add("care-not-a-duty", "Sammantaget behöver din omtanke och din egen upplevelse få varsin plats. I ett gemensamt val kan du vilja ta hänsyn och ändå behöva säga vad som passar dig. Det är ett vardagsnära sätt att förstå kombinationen, utan att göra dig ansvarig för allas upplevelse.", ["A","N"]);
  }
  if (emotionalCare && !is("C","high") && !is("C","low") && is("O","mixed") && raw(15) && raw(30)) {
    add("values-and-current-feeling", "Det som verkar viktigt i helheten är att hålla isär vad du vill bidra med och hur en viss stund känns. Du kan vilja vara omtänksam även när reaktionen är stark. Den ena sidan gör inte den andra mindre relevant.", ["A","N"]);
  }
  if (!claims.length) {
    if (is("A","low")) {
      add("reserved-interaction-only", "Dina svar ger en tydligare riktning inom samspel än inom de andra områdena. Den samlade skattningen är lägre, men ton, tillit och tid för andra är fortfarande olika frågor. De mer specifika relationssvaren behöver därför styra vad som går att säga om just ditt sätt att möta andra.", ["A"]);
    } else add("no-simple-label", readings.some(r => r.direction === "mixed")
      ? "Dina svar ger ingen enkel beskrivning som passar genomgående. Du känner igen olika sidor av samma område, och ett genomsnitt skulle göra flera av skillnaderna osynliga. Därför får du ingen bestämd arketyp här. De mer avgränsade mönstren längre ned kan fortfarande vara värda att undersöka, men de ska inte läsas som en förklaring till hela din personlighet."
      : "Du har inte markerat någon tydlig riktning som går igenom flera av frågorna. Därför får du ingen bestämd arketyp eller en färdig berättelse om vem du är. Det är ett avgränsat resultat av den här självskattningen. Det ger varken skäl att beskriva dig som särskilt balanserad eller att fylla luckorna med egenskaper du inte har uppgett.", readings.filter(r => r.score.valid > 0).map(r => r.dimension));
  }
  if (claims.length === 1 && is("C","high") && is("O","high")) {
    claims[0] = { ...claims[0], evidence: readings.flatMap(r=>r.score.evidence) };
    claims[0] = { ...claims[0], text: "Du verkar uppskatta både nya infallsvinklar och en tydlig ordning när något ska genomföras. Det kan ge dig två olika saker att ta hänsyn till i samma beslut: vad som väcker ditt intresse och vad du vill få grepp om innan du väljer. De behöver inte konkurrera.\n\nEn ny aktivitet kan till exempel locka genom att vara annorlunda, samtidigt som du vill veta vad den kräver i tid och pengar. Du kan alltså vara nyfiken på innehållet och föredra att de praktiska delarna är begripliga. Det ena är inte ett färdigt svar på det andra.\n\nDet gör det mer träffsäkert att skilja intresset för en möjlighet från beslutet att faktiskt ge den plats. Du kan uppskatta något nytt utan att vilja göra om hela vardagen. De sociala och känslomässiga svaren ger inte lika tydliga gemensamma riktningar här. Därför får de inget bestämt tonläge i porträttet." };
  }
  if (claims.length === 1 && is("C","high") && is("O","low")) {
    claims[0] = { ...claims[0], evidence: readings.flatMap(r=>r.score.evidence) };
    claims[0] = { ...claims[0], text: "Du verkar gärna utgå från något bekant och ha grepp om det praktiska. En ny idé behöver inte bli mer lockande bara för att den är ny. Det kan vara viktigare vad den skulle tillföra i en vardag du redan känner till.\n\nNär du överväger en förändring kan du därför vilja förstå både nyttan och hur den skulle passa in. En annan kvällsrutin kan till exempel vara intressant om den löser något bestämt, även om du helst behåller flera delar som de redan är. En bekant utgångspunkt och ett tydligt genomförande kan få finnas i samma val.\n\nDen kombinationen är mer precis än att beskriva dig som antingen förändringsvillig eller ovillig. Du kan värdera en bestämd förändring utan att behöva vilja ha mer nytt i allmänhet. De övriga delarna av din självskattning rymmer större variation. De får därför inte avgöra hur social, lugn eller omtänksam du ska beskrivas som i helheten." };
  }
  const evidence = Array.from(new Map(claims.flatMap(c => c.evidence).map(e => [e.questionId,e])).values());
  return { id:"portrait",theme:"whole-person-portrait",title:"Din helhetsbild",source:"dimension",
    interpretation:claims.map(c => c.text).join("\n\n"), claims, evidence,
    counterEvidence:Array.from(new Map(claims.flatMap(c => c.counterEvidence).map(e => [e.questionId,e])).values()), limitations:[] };
}
