import { immutable } from "../immutable";
import { experiment } from "./experiments";
import { describeOffer } from "./offer";
import { buildReport, VERSIONS } from "../v6/index";
import { assessReportQuality, POLICY } from "../quality-v1/index";
import type { SectionId } from "../v6/types";
import { QUESTIONS, parseAnswers, type SupplementAnswers, type SupplementId } from "./questions";
export { QUESTIONS } from "./questions";
export const SUPPLEMENT_VERSION = "persona-supplement-v1";
export const SUPPLEMENT_CONTENT_VERSION = "persona-supplement-content-v1.1";
type Addition = Readonly<{
  id: string; section: SectionId; title: string; text: string;
  evidence: readonly Readonly<{ questionId: SupplementId; optionId: string }>[];
  group: string; scope: "self-reported-context" | "recent-example" | "suggested-experiment";
  limitation: string;
}>;
const contexts: Record<string,string> = {
  one: "ett samtal med en person i taget", familiar: "ett samtal med någon du känner väl",
  writing: "ett meddelande du skriver i lugn och ro", spontaneous: "ett spontant samtal",
};
const resources: Record<string,{ description:string; action:string }> = {
  listened: { description:"att lyssna innan du bestämde dig", action:"Ge den andra utrymme att berätta och sammanfatta vad du hört innan du väljer nästa steg." },
  "small-step": { description:"att ta ett litet steg i taget", action:"Välj en första handling som går att göra på fem minuter. Stanna där och avgör om du vill fortsätta." },
  asked: { description:"att be om hjälp eller ett förtydligande", action:"Formulera en enda fråga om det du behöver förstå. Be någon om just det beskedet, utan att lämna över hela valet." },
  alternative: { description:"att pröva ett annat sätt", action:"Prova ett annat sätt vid ett enda tillfälle. Jämför sedan vad det tillförde innan du bestämmer om du vill fortsätta." },
};
const goals: Record<string,{description:string; situation:string}> = {
  voice: {description:"att få fram vad du själv vill", situation:"ett litet gemensamt val där din egen önskan spelar roll"},
  pause: {description:"att ge dig tid innan du tackar ja", situation:"en kommande förfrågan där du vill hinna känna efter"},
  start: {description:"att komma igång med något du själv vill göra", situation:"en liten sak du faktiskt vill börja med"},
  connection: {description:"att ge en kontakt du uppskattar mer plats", situation:"en kontakt du själv vill ta initiativ till"},
  preserve: {description:"att bevara en liten rutin som fungerar", situation:"en liten rutin du själv vill behålla"},
};
const methodNotes:Record<string,string> = {
  fits:"Du uppger att de ursprungliga svaren ungefär beskriver hur du brukar vara. De ligger kvar oförändrade.",
  context:"Du uppger att du är olika i olika situationer. Det ger kontext till variationen, men visar inte vilka skillnader som gäller i varje situation.",
  uncertain:"Du uppger att flera påståenden var svåra att bedöma. Därför bör en bred personlighetsbeskrivning fortsatt läsas försiktigt.",
  other:"Du uppger att inget av förtydligandena passar riktigt. Ingen ytterligare tolkning läggs till.",
};
function additionsFor(answers: SupplementAnswers): Addition[] {
  const context=contexts[answers.S02??""], resource=resources[answers.S03??""], goal=goals[answers.S04??""];
  const additions: Addition[] = [];
  const evidence=(ids:SupplementId[])=>ids.map(questionId=>({questionId,optionId:answers[questionId]!}));
  if(context&&goal&&["voice","pause","connection"].includes(answers.S04!)) additions.push({
    id:"context-and-priority",section:"relationships",title:"Ett sammanhang för det du vill få fram",
    text:"Du pekar ut "+context+" som en form där det brukar vara lättare att säga det du vill. Samtidigt vill du ge mer plats åt "+goal.description+". Det gör formen för kontakten relevant, inte bara vad du ska säga. Du behöver inte börja med den situation som känns mest krävande. Det här är ett avgränsat perspektiv på en självvald prioritering, inte ett mått på hur social du är.",
    evidence:evidence(["S02","S04"]),group:"context-priority",scope:"self-reported-context",
    limitation:"Svaren visar inte att du har svårt att uttrycka dig i alla andra sammanhang.",
  });
  // S02 concerns expression, not task execution. A non-social goal is linked only
  // when S03 explicitly supplies a recent experience of asking for help/clarity.
  if(context&&resource&&answers.S03==="asked"&&goal&&["start","preserve"].includes(answers.S04!)) additions.push({
    id:"context-for-clarification",section:"relationships",title:"En form för att be om något konkret",
    text:"Du vill ge utrymme åt "+goal.description+". Vid ett nyligt tillfälle hjälpte det dig att be om hjälp eller ett förtydligande, och du pekar ut "+context+" som en form där det är lättare att få fram det du vill. Om den valda uppgiften eller rutinen någon gång behöver ett besked från någon annan kan du använda den formen för en enda konkret fråga. Du behöver inte lämna över hela valet eller göra det som redan fungerar till ett problem.",
    evidence:evidence(["S02","S03","S04"]),group:"context-priority",scope:"self-reported-context",
    limitation:"Svaren visar inte att uppgiften eller rutinen kräver hjälp. Kopplingen gäller bara om du själv behöver ett besked från någon annan.",
  });
  if(resource&&goal) {
    additions.push({
      id:"resource-in-context",section:"strengths",title:"En resurs från ett tillfälle som fungerade",
      text:"Vid ett nyligt tillfälle som du själv tycker att du hanterade bra pekar du ut "+resource.description+" som det som hjälpte mest. Det är en konkret erfarenhet att ha med dig när du nu vill ge plats åt "+goal.description+". Du behöver inte göra erfarenheten till en etikett om vem du är. Den kan få vara ett exempel på något du har haft nytta av, vars användbarhet i ett nytt sammanhang återstår att pröva.",
      evidence:evidence(["S03","S04"]),group:"resource-priority",scope:"recent-example",
      limitation:"Ett självuppgivet tillfälle fastställer ingen generell styrka eller förklaring till andra svar.",
    },{
      id:"resource-experiment",section:"compass",title:"Prova resursen i ett nytt litet sammanhang",
      text:"Utgå från "+goal.situation+". "+experiment(answers.S04!,answers.S03!)+" Efteråt: hjälpte det dig med det du själv ville ge utrymme åt? Om svaret är nej behöver du inte upprepa försöket. Om det hjälpte kan du välja ett nytt litet tillfälle att prova vid.",
      evidence:evidence(["S03","S04"]),group:"resource-priority",scope:"suggested-experiment",
      limitation:"Detta är ett frivilligt försök, inte ett påstående om vad du saknar eller borde bli bättre på.",
    });
  }
  return additions;
}
/** Isolated completion model. Original answers, scoring, V6 and quality-v1 remain untouched. */
export function completeReport(input: readonly unknown[], extra: unknown = {}) {
  const before=assessReportQuality(input), answers=parseAnswers(extra);
  const normalized=Array.from({length:40},(_,i)=>typeof input[i]==="number"&&Number.isInteger(input[i])&&(input[i] as number)>=1&&(input[i] as number)<=5?input[i] as number:0);
  const baseReport=buildReport({answers:normalized,questionVersion:VERSIONS.question,reportVersion:VERSIONS.report});
  const supplementRelevant=before.state==="insufficient"||(before.state==="limited"&&
    (before.strengths===0||before.advice<2||before.sections.find(s=>s.id==="relationships")!.noteOnly));
  const offered=before.state!=="ready"&&supplementRelevant;
  if(!offered&&Object.keys(answers).length)throw Error("Supplement is not relevant for this report");
  const additions=offered?additionsFor(answers).filter(a=>a.section!=="compass"||before.advice<3):[];
  const methodNote=methodNotes[answers.S01??""]??null;
  const sections=baseReport.sections.map(s=>({
    ...s,
    // Omit an abstention note when a genuinely new block now supplies that section.
    note:additions.some(a=>a.section===s.id)&&!s.blocks.length?undefined:s.note,
    additions:additions.filter(a=>a.section===s.id),
  }));
  const meaningfulSections=new Set(before.sections.filter(s=>!s.noteOnly).map(s=>s.id));
  additions.forEach(a=>meaningfulSections.add(a.section));
  // Resource and its proposed exercise share one fact pattern. Never count them twice.
  const novelGroups=Array.from(new Set(additions.map(a=>a.group)));
  const distinctEvidence=Array.from(new Set([...before.distinctEvidenceIds,...additions.flatMap(a=>a.evidence.map(e=>e.questionId))]));
  const basePersonalChars=baseReport.sections.reduce((n,s)=>n+s.blocks.filter(b=>before.sections.find(t=>t.id===s.id)!.meaningfulBlockIds.includes(b.id))
    .reduce((m,b)=>m+[b.observation,b.interpretation,b.example,b.adviceReason].filter(Boolean).join(" ").length,0),0);
  const reservationChars=baseReport.method.length+(methodNote?.length??0)+sections.reduce((n,s)=>n+(s.note?.length??0)+s.blocks.reduce((m,b)=>m+b.limitations.join(" ").length+
    (before.sections.find(t=>t.id===s.id)!.excludedBlockIds.includes(b.id)?b.interpretation.length:0),0),0)+additions.reduce((n,a)=>n+a.limitation.length,0);
  // Count the resource/experiment group's longest text once also in the density measure.
  const addedPersonalChars=novelGroups.reduce((n,g)=>n+Math.max(...additions.filter(a=>a.group===g).map(a=>a.text.length)),0);
  const reservationShare=reservationChars/Math.max(1,reservationChars+basePersonalChars+addedPersonalChars);
  const novelStrengths=additions.filter(a=>a.section==="strengths").length,novelAdvice=additions.filter(a=>a.section==="compass").length;
  const checks={
    sufficientAnswers:before.checks.sufficientAnswers,
    sufficientDimensions:before.checks.sufficientDimensions,
    sufficientSections:meaningfulSections.size>=POLICY.minimumSections,
    sufficientBlocks:before.meaningfulBlocks+novelGroups.length>=POLICY.minimumBlocks,
    diverseEvidence:distinctEvidence.length>=POLICY.minimumDistinctEvidence,
    usefulResource:before.strengths+novelStrengths>0||before.insights>0,
    actionableAdvice:before.advice+novelAdvice>0,
    personalContentDominates:reservationShare<=POLICY.maximumReservationShare,
  };
  const failed=Object.entries(checks).filter(([,ok])=>!ok).map(([key])=>key);
  // Contextual, unvalidated additions can justify limited, never a new ready verdict.
  const state=offered?(failed.length?"insufficient":"limited"):before.state;
  return immutable({
    version:SUPPLEMENT_VERSION,contentVersion:SUPPLEMENT_CONTENT_VERSION,baseReport,answers,offeredQuestions:offered?QUESTIONS:[],
    offer:describeOffer({state,sections:Array.from(meaningfulSections),insights:before.insights,
      strengths:before.strengths+novelStrengths,advice:before.advice+novelAdvice,
      supplementRelevant,completionAttempted:Object.keys(answers).length>0}),
    sections,additions,methodNote,
    before,after:offered?{state,checks,reasons:failed.length?failed:["contextualInformationOnly"],
      meaningfulSections:meaningfulSections.size,independentContentUnits:before.meaningfulBlocks+novelGroups.length,
      distinctEvidenceIds:distinctEvidence,reservationShare,additionalInsights:0,
      strengths:before.strengths+novelStrengths,advice:before.advice+novelAdvice,
    }:{state:before.state,checks:before.checks,reasons:before.reasons,meaningfulSections:before.meaningfulSections,
      independentContentUnits:before.meaningfulBlocks,distinctEvidenceIds:before.distinctEvidenceIds,
      reservationShare:before.reservationShare,additionalInsights:0,strengths:before.strengths,advice:before.advice},
    // No payment connection exists in this experiment, including for ready/limited.
    allowCheckout:false as const,
    presentation:state==="insufficient"?"free-fallback" as const:"local-report" as const,
    freeResult:state==="insufficient"?{
      title:"Det här kan vi säga just nu",
      text:before.neutralCount>=15?"Dina svar ligger ofta nära mitten. Det kan ha flera betydelser, och vi väljer inte en förklaring åt dig.":"Dina svar ger ingen enkel helhetsbild. Avgränsade erfarenheter kan fortfarande vara meningsfulla utan att bli en beskrivning av hela din personlighet.",
      explanation:"Även med eventuella kompletteringar räcker underlaget i den här analysen inte till en tillräckligt individuell premiumrapport. Det betyder inte att dina svar är felaktiga. Därför erbjuder vi inget köp för det här resultatet.",
    }:null,
  });
}
