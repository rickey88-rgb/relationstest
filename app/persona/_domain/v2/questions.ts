import type { Dimension, Question, SectionId } from "../types";
import { immutable } from "../immutable";
import { fixedScenarios, adaptiveScenarios, type Scenario } from "./content";
export const ratingLabels = immutable(["Det här stämmer sällan på mig.", "Det här stämmer ibland på mig.", "Det här stämmer ofta på mig.", "Det här stämmer nästan alltid på mig."]);
export const unknownLabel = "Svårt att bedöma";
export const introduction = "Tänk på hur du brukar fungera under det senaste året. I situationerna väljer du det som ligger närmast vad du skulle göra. Det finns inga perfekta svar. Välj Svårt att bedöma när du inte kan ta ställning.";
const supports: readonly SectionId[] = ["portrait","signature","drivers","relationships","tensions","strengths","compass"];
const chapter = (n: number): 1|2|3 => n <= 10 ? 1 : n <= 22 ? 2 : 3;
const rating = (n: number, title: string, prompt: string, dimension: Dimension, reverse = false): Question => ({
  id: "P"+String(n).padStart(2,"0"), chapter: chapter(n), title, prompt, kind: "rating", options: ratingLabels,
  dimension, reverse, purpose: "Egen fyrgradig indikator för "+dimension+". Ingen normerad eller validerad delskala.", supports: ["dimensions"], source: "persona-original",
});
const ratings: readonly Question[] = [
  rating(1,"Efter en lång dag","Även efter en ganska full dag kan jag bli piggare av att träffa människor än av att vara ensam.","E"),
  rating(3,"En ny smak","När någon föreslår mat, musik eller en aktivitet jag inte känner till blir jag oftast nyfiken och vill prova.","O"),
  rating(5,"Det korta svaret","När någon viktig svarar ovanligt kort fastnar jag lätt i funderingar på om jag har gjort något fel.","N"),
  rating(7,"Det du vill få gjort","När jag vill få något gjort brukar jag göra en enkel plan och sedan faktiskt följa den ganska väl.","C"),
  rating(9,"Bland nya människor","När jag kommer till en plats där många är nya föredrar jag att först hålla mig lite i bakgrunden.","E",true),
  rating(12,"Innan du bestämmer dig","När någon tycker annorlunda än jag försöker jag först förstå vad som är viktigt för personen innan jag svarar.","A"),
  rating(15,"En tanke som skaver","Jag tycker om samtal som får mig att ifrågasätta en åsikt jag tidigare känt mig ganska säker på.","O"),
  rating(17,"Efter ett jobbigt samtal","Efter ett jobbigt samtal brukar jag kunna släppa spänningen och ägna mig åt annat utan att tänka på det särskilt länge.","N",true),
  rating(19,"Löftet till dig själv","När jag har bestämt mig för något brukar jag hålla i det även de dagar då det känns ganska tråkigt.","C"),
  rating(23,"När ni inte håller med","I en diskussion är det ofta viktigare för mig att driva min ståndpunkt tydligt än att hitta något vi kan enas om.","A",true),
  rating(25,"Att ta kontakt","När jag möter någon jag inte känner brukar jag ganska lätt börja prata utan att vänta på den andra.","E"),
  rating(27,"När något går fel","När något som betyder mycket för mig går fel dröjer känslan ofta kvar även efter att själva situationen är över.","N"),
  rating(29,"Det välbekanta eller nya","När jag väl hittat något jag tycker om väljer jag oftast det igen framför att utforska ett okänt alternativ.","O",true),
  rating(31,"En persons bästa sida","När någon gör mig besviken försöker jag vanligtvis ge personens avsikt en chans innan jag drar en negativ slutsats.","A"),
  rating(32,"De små sakerna","Små saker jag tänkt ordna blir ofta liggande tills de börjar kännas mer brådskande än jag egentligen hade velat.","C",true),
];
function scenario(item: Scenario, adaptive = false): Question {
  return {id: (adaptive?"A":"P")+String(item.n).padStart(2,"0"),chapter:adaptive?4:chapter(item.n),title:item.title,prompt:item.prompt,
    kind:"scenario",options:item.choices,purpose:item.purpose,theme:item.theme,supports,source:"persona-original"};
}
export const fixedQuestions: readonly Question[] = immutable([...ratings,...fixedScenarios.map(item=>scenario(item))].sort((a,b)=>a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
export const adaptiveQuestions: readonly Question[] = immutable(adaptiveScenarios.map(item=>scenario(item,true)));
export const questionBank: readonly Question[] = immutable([...fixedQuestions,...adaptiveQuestions]);
export function getQuestion(id: string): Question { const question=questionBank.find(item=>item.id===id); if(!question)throw new Error("Unknown PERSONA v2 question");return question; }
