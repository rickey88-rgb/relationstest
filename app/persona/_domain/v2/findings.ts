import type { Condition, DimensionScore, Evidence, Finding, SectionId } from "../types";
import { immutable } from "../immutable";
import { UNKNOWN } from "./manifest";
import { answerMap, evidenceFor } from "./answers";
import { fixedQuestions, getQuestion } from "./questions";
import { observations } from "./copy";

export const c = (questionId: string, answers: readonly number[]): Condition => ({ questionId, answers });
type Rule = Readonly<{ id: string; title: string; text: string; conditions: readonly Condition[]; counters?: readonly Condition[]; supports: readonly SectionId[] }>;
const portrait: readonly SectionId[] = ["portrait","signature","drivers","relationships"];
const tension: readonly SectionId[] = [...portrait,"tensions"];
export const narrativeRules: readonly Rule[] = immutable([
  {id:"own-path-together",title:"En egen väg, med plats för samtalet",conditions:[c("P04",[0,3]),c("P11",[1,3]),c("P21",[2])],supports:portrait,
    text:"Du låter inte en egen möjlighet behöva stänga dörren till vännen. När ni söker samma plats vill du göra situationen gemensamt begriplig; när löftet krockar med konserten söker du ett samtal innan allt är avgjort. Också inför den förenklade historien vill du hitta något ni båda kan stå för. I dessa tre val får relationen vara med utan att helt bestämma din riktning."},
  {id:"own-measure",title:"En egen måttstock",conditions:[c("P10",[1,3]),c("P33",[0,2]),c("P34",[2])],supports:portrait,
    text:"Du ger den egna upplevelsen utrymme även när andras reaktion går åt ett annat håll. Du behöver inte rätta berömmet för att behålla din mening, och månaden utan publik får värde genom din egen stolthet eller glädje. Inför ett viktigt beslut vill du dessutom hitta din riktning innan du tar in andras åsikter. Det beskriver en ordning du väljer här, inte att du är oberoende av människor."},
  {id:"clear-ground",title:"Tydlig med vad du kan stå för",conditions:[c("P13",[0]),c("P20",[2]),c("P21",[0,3])],supports:portrait,
    text:"När situationerna blir oklara söker du en avgränsad grund. Notan får följa vad var och en beställt, återkopplingen till vännen får stanna vid det du sett, och den förenklade historien får inte obegränsat stöd av dig. Den tydligheten kan göra din del lättare att förstå. Den garanterar inte att ni gör samma bedömning eller att samtalet blir friktionsfritt."},
  {id:"trust-in-steps",title:"Tillit som får märkas",conditions:[c("P18",[3]),c("P26",[3]),c("P28",[3])],supports:portrait,
    text:"I svaren om tillit söker du något som går att uppleva över tid. Efter den spridda hemligheten vill du se konkret reparation; när initiativen minskar vill du ge kontakten en återkommande form. Den gamla relationen får komma tillbaka i små steg. Du väljer därmed en prövbar väg till närhet i dessa situationer, snarare än ett enda avgörande besked."},
  {id:"room-for-discovery",title:"Plats för det som växer fram",conditions:[c("P08",[3]),c("P10",[3]),c("P33",[2])],supports:portrait,
    text:"Du ger sådant som uppstår längs vägen ett eget värde. Den lediga dagen får ändras, det du skapat får betyda olika saker, och den fria månaden får bäras av glädjen i själva görandet. I de här valen behöver inte allt få sin mening i förväg. Utrymmet kan vara en tillgång, samtidigt som andra ibland kan behöva veta vilka delar som ändå är bestämda."},
  {id:"closeness-with-door",title:"Närhet med en egen dörr",conditions:[c("P18",[1,2]),c("P24",[1,2]),c("P28",[2,3])],supports:tension,
    text:"Du skiljer mellan att ha kontakt och att lämna över hela det personliga. Efter ett förtroendebrott väljer du mindre insyn eller en paus; en tung dag börjar du praktiskt eller på egen hand. När en gammal relation söker sig tillbaka vill du inte lova samma närhet direkt. Svaren stöder en vald gräns för tillgången till dig. De säger inte varför du väljer den eller att du saknar längtan efter närhet."},
  {id:"say-the-need",title:"Du låter behovet få ord",conditions:[c("P06",[3]),c("P24",[0,3]),c("P26",[0,3])],counters:[c("P22",[3])],supports:portrait,
    text:"Du ger andra ledtrådar till det som annars lätt blir osynligt. Den inställda kvällen får heta besvikelse, den tunga dagen får bli känd och den glesare kontakten får ett samtal eller en konkret fråga. Det kan göra dig lättare att möta i dessa lägen. Samtidigt blir också risken tydligare: ett uttalat behov kan få ett annat svar än du hoppas."},
  {id:"space-before-answer",title:"Andrum före beskedet",conditions:[c("P24",[2]),c("P30",[1]),c("P34",[2])],supports:portrait,
    text:"Du vill hinna möta det egna innan du öppnar för andras respons. Känslorna får en stund på egen hand, tvekan i dejtandet får undersökas och beslutet får en egen riktning före råden. Det kan ge ett mer förankrat besked. Den möjliga svårigheten ligger i mellanrummet: andra kanske inte vet om de väntar på eftertanke, avstånd eller ett kommande nej."},
  {id:"gentle-opening",title:"En mjuk början",conditions:[c("P24",[3]),c("P28",[0]),c("P30",[0])],supports:portrait,
    text:"Du väljer öppningar som inte kräver ett färdigt svar på allt. Ett meddelande kan visa att dagen är tung, ett möte kan undersöka en gammal relation och fortsatt dejtande kan få ske med uttalad osäkerhet. I de situationerna får erfarenheten hjälpa dig vidare. Det kan skapa rörelse, så länge den andra också får förstå vad du ännu inte kan lova."},
  {id:"want-and-retreat",title:"Längtan framåt, skydd åt sidan",conditions:[c("P30",[3]),c("P24",[2]),c("P26",[1])],supports:tension,
    text:"I dejtandet vill du dela både vilja och rädsla. När dagen är tung väljer du däremot att först bära känslorna själv, och när någon tar färre initiativ minskar du dina egna. Det är olika sammanhang, inte ett bevis för en falsk självbild. En intressant fråga i just kombinationen är vilka behov som får bli hörda och vilka som den andra behöver upptäcka utan ett tydligt besked."},
  {id:"own-chance-fair-terms",title:"Egen chans, gemensamma villkor",conditions:[c("P04",[0,1]),c("P13",[0]),c("P14",[1,2])],supports:tension,
    text:"Du vill kunna söka din egen chans och sätter samtidigt vikt vid hur en fördel fördelas. Din ansökan behöver inte vänta på ett gemensamt beslut, men notan ska följa beställningen och rummet fördelas genom lika chans eller uttalade behov. Det är olika principer för olika situationer. Svaren säger inte att en enda regel ska styra alla avvägningar."},
  {id:"earlier-promise",title:"Det tidigare löftet har tyngd",conditions:[c("P11",[0]),c("P21",[0,3]),c("P22",[3])],supports:portrait,
    text:"Du står kvar vid flytthjälpen när en efterlängtad biljett dyker upp. Samtidigt begränsar du din medverkan i vännens förenklade historia och i de två vännernas konflikt. Lojalitet blir i dessa val inte samma sak som att alltid följa den närmaste personens önskan. Du skiljer på ett löfte du redan gett och ett ansvar du inte vill ta över."},
  {id:"support-with-edges",title:"Hjälp som får en form",conditions:[c("P24",[1]),c("A14",[0,2])],supports:portrait,
    text:"Du öppnar för stöd genom en avgränsad praktisk fråga och vill också kunna ange hur mycket av orsaken du delar. Hjälpen får därmed en form som lämnar kvar en egen gräns. Det är en möjlig väg till stöd i de två situationerna, utan att all närhet behöver börja med hela berättelsen."},
  {id:"test-without-surrender",title:"Pröva tanken utan att lämna över",conditions:[c("P34",[1]),c("A18",[1])],supports:portrait,
    text:"Du söker inte enbart ett lugnande medhåll i de här svaren. Du vill möta invändningen tillräckligt tydligt för att kunna ta ställning till den. Andra får hjälpa dig pröva beslutet, samtidigt som svaret inte ger dem sista ordet."},
  {id:"humour-and-disclosure",title:"Humor som öppnar en nyans",conditions:[c("P02",[2]),c("A02",[2])],supports:portrait,
    text:"Du använder humor både när en bild känns obekväm och när uppskattningen gör dig till en alltför entydig person. I de svaren blir skämtet ett sätt att påverka bilden utan att börja med ett helt allvarligt samtal. En möjlig fråga är om den nyans du vill visa också blir förstådd."},
  {id:"plan-and-delay",title:"Avsikt och start är olika saker",conditions:[c("P07",[2,3]),c("P32",[2,3]),c("A16",[0,1,2,3])],supports:tension,
    text:"Du skattar att du ofta gör och följer en enkel plan, men också att små saker ofta blir liggande. I följdfrågan väljer du ett sätt att möta uppskjutandet. De två skattningarna kan gälla olika uppgifter och dagar. Underlaget stöder därför en skillnad att undersöka mellan att ha en riktning och att komma igång, inte en diagnos eller en förklaring till varför det sker."},
]);

export function matchingEvidence(values: ReadonlyMap<string, number>, conditions: readonly Condition[]): Evidence[] {
  return conditions.filter(item=>item.answers.includes(values.get(item.questionId)!)).map(item=>evidenceFor(item.questionId,values.get(item.questionId)!));
}
export function deriveFindings(answers: readonly number[], adaptiveIds: readonly string[], dimensions: readonly DimensionScore[]): readonly Finding[] {
  const values=answerMap(answers,adaptiveIds),findings: Finding[]=[];
  for(const question of [...fixedQuestions,...adaptiveIds.map(getQuestion)]) {
    const answer=values.get(question.id)!;
    if(answer===UNKNOWN||question.kind!=="scenario")continue;
    const text=observations[question.id]?.[answer];
    if(!text)throw new Error("Missing versioned PERSONA interpretation");
    findings.push({id:`obs:${question.id}:${answer}`,ruleId:`observation-v2:${question.id}`,title:question.title,text,kind:"observation",evidence:[evidenceFor(question.id,answer)],counterEvidence:[],supports:question.supports,strength:"situational"});
  }
  for(const rule of narrativeRules) {
    const evidence=matchingEvidence(values,rule.conditions);
    if(evidence.length!==rule.conditions.length)continue;
    const counterEvidence=matchingEvidence(values,rule.counters??[]);
    findings.push({id:`finding:${rule.id}`,ruleId:rule.id,title:rule.title,text:rule.text+(counterEvidence.length?" Det finns också ett svar som nyanserar kombinationen; läs båda underlagen tillsammans.":""),
      kind:evidence.length>=3?"pattern":"combination",evidence,counterEvidence,supports:rule.supports,strength:evidence.length>=3?"recurrent":"specific"});
  }
  for(const score of dimensions) {
    if(!score.valid)continue;
    const direction=score.level==="lower"?"De tre svaren lutar mot skalans lägre riktning.":score.level==="higher"?"De tre svaren lutar mot skalans högre riktning.":score.level==="middle"?"De tre svaren ligger sammantaget mellan skalans lägre och högre riktning.":"Underlaget är för begränsat för en samlad riktning.";
    findings.push({id:`dimension:${score.dimension}`,ruleId:`dimension-v2:${score.dimension}`,title:score.name,
      text:`${score.name}: ${direction} ${score.valid} av 3 egna indikatorer går att bedöma.`+(score.varied?" Svaren varierar tydligt mellan påståendena; läs deras olika sammanhang innan du sammanfattar.":"")+" Det är en försiktig orientering utan normjämförelse, inte ett validerat deltest.",
      kind:"dimension",evidence:score.evidence,counterEvidence:[],supports:["dimensions"],strength:"limited"});
  }
  return immutable(findings);
}
export function rankNarrative(findings: readonly Finding[]): Finding[] {
  const priority=new Map(narrativeRules.map((rule,index)=>[rule.id,index]));
  return findings.filter(f=>f.kind==="pattern"||f.kind==="combination").sort((a,b)=>b.evidence.length-a.evidence.length||priority.get(a.ruleId)!-priority.get(b.ruleId)!);
}
