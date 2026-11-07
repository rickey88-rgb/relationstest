import type { Finding, Paragraph, PersonaReport, ReportSection, SectionId } from "../types";
import { immutable } from "../immutable";
import { FIXED_COUNT, UNKNOWN, VERSIONS } from "./manifest";
import { selectAdaptive } from "./adaptive";
import { answerMap } from "./answers";
import { deriveFindings, matchingEvidence, rankNarrative } from "./findings";
import { experiments } from "./experiments";
import { fixedQuestions, getQuestion } from "./questions";
import { scoreDimensions } from "./score";
import { parseSubmission } from "./submission";

export const sectionTitles: Readonly<Record<SectionId,string>>=immutable({portrait:"Personlighetsporträtt",signature:"Personlig signatur",dimensions:"Fem personlighetsdimensioner",drivers:"Drivkrafter",relationships:"Relationella mönster",tensions:"Inre motsägelser",strengths:"Styrkor och blinda fläckar",compass:"Personlig kompass"});
const method=(id:string,text:string):Paragraph=>({id,text,findingIds:[],scope:"method"});
const personal=(id:string,finding:Finding):Paragraph=>({id,text:finding.text,findingIds:[finding.id],scope:"personal"});
const signatures: Readonly<Record<string,readonly string[]>>=immutable({
  P04:["En egen chans med öppen dörr","En ansökan på egna villkor","Nyfiken på en annan väg","Samarbete mitt i konkurrensen"],
  P18:["Ett samtal före nästa steg","Kontakt med förändrad insyn","Utrymme att välja på nytt","Tillit som får märkas"],
  P24:["Ett behov som får bli hört","Stöd med en tydlig form","Eget utrymme före delandet","En öppning utan hela berättelsen"],
  P28:["Mötet får visa vägen","Förståelse före återkomst","Förlåtelse med en egen gräns","Närhet i små steg"],
  P30:["En riktning utan färdigt facit","Andrum för den egna tvekan","Ett steg tillbaka med ett tydligt skäl","Plats för både längtan och rädsla"],
  P33:["Stolthet med egen måttstock","Det som får delas","Värdet finns på vägen","Nyfiken på den egna förmågan"],
  P34:["Stöd utan att lämna över","Ett beslut som får prövas","Egen riktning före andras råd","Nyfiken på vad medhållet ger"],
});
/** Prefer fresh evidence, never pad the portrait with unsupported personality prose. */
function diverse(candidates: readonly Finding[],limit:number):Finding[] {
  const result:Finding[]=[],remaining=[...candidates],seen=new Set<string>();
  while(remaining.length&&result.length<limit) {
    let best=0,fresh=-1;
    remaining.forEach((finding,index)=>{const count=finding.evidence.filter(e=>!seen.has(e.questionId)).length;if(count>fresh){best=index;fresh=count;}});
    if(fresh<=0)break;
    const item=remaining.splice(best,1)[0];result.push(item);item.evidence.forEach(e=>seen.add(e.questionId));
  }
  return result;
}
export function buildReport(input:unknown):PersonaReport {
  const submission=parseSubmission(input),fixed=submission.answers.slice(0,FIXED_COUNT),selection=selectAdaptive(fixed),dimensions=scoreDimensions(fixed);
  const findings=deriveFindings(submission.answers,selection.selectedIds,dimensions),narrative=rankNarrative(findings),values=answerMap(submission.answers,selection.selectedIds);
  const observation=(id:string)=>findings.find(f=>f.id.startsWith(`obs:${id}:`));
  const observations=(ids:readonly string[])=>ids.map(observation).filter((f):f is Finding=>Boolean(f));
  const validScenarios=fixedQuestions.filter((q,i)=>q.kind==="scenario"&&fixed[i]!==UNKNOWN).length;
  const dimensionsWithEnoughAnswers=dimensions.filter(d=>d.valid>=2).length,unknownCount=submission.answers.filter(a=>a===UNKNOWN).length;
  const warnings:string[]=[];
  if(validScenarios<10)warnings.push("Färre än tio fasta situationer går att bedöma.");
  if(dimensionsWithEnoughAnswers<4)warnings.push("Färre än fyra dimensioner har minst två bedömbara svar.");
  if(dimensions.some(d=>d.varied))warnings.push("Minst en dimension har tydligt varierade svar; sammanhanget i frågorna spelar roll.");
  if(selection.candidates.some(c=>selection.selectedIds.includes(c.id)&&c.reason==="fallback"))warnings.push("Minst en följdfråga breddar underlaget utan en matchad ingång.");
  const quality={eligible:validScenarios>=10&&dimensionsWithEnoughAnswers>=4,validScenarios,dimensionsWithEnoughAnswers,unknownCount,warnings};
  const sections:ReportSection[]=[];
  const add=(id:SectionId,paragraphs:Paragraph[])=>sections.push({id,title:sectionTitles[id],paragraphs});
  const lead=diverse(narrative,3),seen=new Set(lead.flatMap(f=>f.evidence.map(e=>e.questionId)));
  const supporting=observations(["P16","P24","P33","P28","P04","P10","P34"]).filter(f=>!seen.has(f.evidence[0].questionId)).slice(0,lead.length?2:5);
  const portrait=[...lead,...supporting];
  add("portrait",[
    method("portrait-context","Det här porträttet följer dina val i tänkta situationer och dina skattningar av vardagsvanor. Det beskriver inte din historia, vad andra tänker om dig eller en dold orsak till att du fungerar som du gör."),
    ...(quality.eligible?[]:[method("portrait-limited","Underlaget räcker inte till ett samlat premiumporträtt. Granska svar som varit svåra att bedöma innan du går vidare; enstaka observationer fyller inte i det som saknas.")]),
    ...portrait.map((f,i)=>personal(`portrait-${i}`,f)),
    ...(portrait.length?[]:[method("portrait-empty","Det saknas bedömbara situationsval att bygga ett personligt porträtt av.")]),
  ]);
  const signature=lead[0]??supporting[0];
  const signatureTitle=signature?.kind==="observation"?signatures[signature.evidence[0].questionId]?.[signature.evidence[0].answer]??signature.title:signature?.title;
  add("signature",[
    ...(signature?[{id:"signature-claim",text:signatureTitle!,findingIds:[signature.id],scope:"personal" as const}]:[method("signature-empty","Ingen personlig signatur sätts när underlaget saknas.")]),
    method("signature-context","Signaturen är en rubrik för en belagd kombination eller ett bestämt val, inte en fast personlighetstyp. Det är svarunderlaget som avgör hur brett den kan läsas."),
  ]);
  add("dimensions",[
    method("dimensions-context","Fem Big Five-inspirerade begrepp ger en försiktig orientering. Varje dimension bygger på tre egna fyrgradiga påståenden, inte på en validerad skala. Situationsval och följdfrågor räknas inte in. Värdena är interna sammanfattningar, inte percentiler eller jämförelser med andra."),
    ...dimensions.map(d=>{const finding=findings.find(f=>f.id===`dimension:${d.dimension}`);return finding?personal(`dimension-${d.dimension}`,finding):method(`dimension-${d.dimension}`,`${d.name}: inget bedömbart underlag. Ett osäkert svar blir aldrig ett mittensvar.`);}),
  ]);
  add("drivers",[
    method("drivers-context","Här betyder drivkrafter det du ger plats åt i valen: en egen chans, ett löfte, ett meningsfullt gensvar eller värdet av själva stunden. Texten fastställer inga hemliga motiv."),
    ...observations(["P04","P08","P10","P11","P13","P14","P16","P20","P21","P33",...selection.selectedIds.filter(id=>["R","L","M"].includes(getQuestion(id).theme!))]).map((f,i)=>personal(`drivers-${i}`,f)),
    ...(!observations(["P04","P11","P13","P16","P21","P33"]).length?[method("drivers-limited","De fasta prioriteringsvalen ger begränsat underlag. Eventuella följdfrågor ska läsas för sig.")]:[]),
  ]);
  const relations=observations(["P06","P18","P22","P24","P26","P28","P30",...selection.selectedIds.filter(id=>["A10","A11","A12","A13","A14","A15","A17"].includes(id))]);
  add("relationships",[method("relationships-context","Närhet kan behöva olika villkor i olika relationer. De här svaren används inte för att tilldela en anknytningstyp eller bedöma någon annan person."),
    ...relations.map((f,i)=>personal(`relationships-${i}`,f)),...(!relations.length?[method("relationships-empty","Det saknas bedömbart underlag för personliga relationella observationer.")]:[])]);
  const tensions=diverse(narrative.filter(f=>f.supports.includes("tensions")),3);
  add("tensions",[method("tensions-context","Olika val är inte bevis för att någon sida av dig är falsk. Här undersöks bara de särskilda kombinationer som svaren faktiskt stöder. Dina enskilda val om självbild och andras respons får också plats; de är inte i sig motsägelser."),
    ...tensions.map((f,i)=>personal(`tensions-${i}`,f)),
    ...observations(["P02","P34",...selection.selectedIds.filter(id=>id==="A16"||id==="A18")]).map((f,i)=>personal(`self-reflection-${i}`,f)),...(!tensions.length?[method("tensions-empty","Ingen av modellens specificerade spänningar framträder tillräckligt tydligt. Rapporten hittar inte på en motsägelse för att fylla avsnittet.")]:[])]);
  const selected=experiments.map(experiment=>({experiment,evidence:matchingEvidence(values,experiment.conditions)})).filter(item=>item.evidence.length===item.experiment.conditions.length)
    .sort((a,b)=>b.evidence.length-a.evidence.length||experiments.indexOf(a.experiment)-experiments.indexOf(b.experiment)).slice(0,3);
  const refs=(evidence:readonly {questionId:string;answer:number}[])=>evidence.map(e=>`obs:${e.questionId}:${e.answer}`);
  add("strengths",[method("strengths-context","En möjlig tillgång kan också ha en kostnad. Följande perspektiv är knutna till dina val och beskriver möjligheter att pröva, inte säkra förmågor eller brister."),
    ...selected.flatMap(({experiment,evidence})=>[
      {id:`opportunity-${experiment.id}`,text:experiment.opportunity,findingIds:refs(evidence),scope:"experiment" as const},
      {id:`tradeoff-${experiment.id}`,text:experiment.tradeoff,findingIds:refs(evidence),scope:"experiment" as const},
    ]),...(!selected.length?[method("strengths-empty","Inga personliga tillgångar eller kostnader fylls i utan en matchad kombination av svar.")]:[])]);
  add("compass",[method("compass-context","Välj gärna ett av de små experiment som dina svar gett stöd för. De är reflektionsförslag att pröva i ett lämpligt vardagssammanhang, inte behandling eller krav på förändring."),
    ...selected.map(({experiment,evidence})=>({id:`experiment-${experiment.id}`,text:`${experiment.title}. ${experiment.action} Reflektion: ${experiment.reflection}`,findingIds:refs(evidence),scope:"experiment" as const})),
    ...(!selected.length?[method("compass-empty","Börja med att granska frågor du hade svårt att bedöma. Inget särskilt experiment väljs utan tillräckligt stöd i dina svar.")]:[])]);
  const preview=lead[0]??supporting[0];
  return immutable({product:"persona_test",questionVersion:VERSIONS.question,reportVersion:VERSIONS.report,analysisVersion:VERSIONS.analysis,adaptiveVersion:VERSIONS.adaptive,
    selection,dimensions,findings,sections,quality,preview:preview?{text:preview.text,findingIds:[preview.id]}:{text:"Det finns för lite bedömbart underlag för en personlig insikt. Granska dina svar innan du går vidare.",findingIds:[]}});
}
