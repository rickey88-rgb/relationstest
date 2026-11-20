import { immutable } from "../immutable";
import type { Evidence, Dimension } from "../types";
import { patterns } from "../v4/patterns";
import { analyzeInsights } from "../insights-v1/index";
import { coreQuestions } from "../v3/questions";
import { readDimensions } from "./dimensions";
import { content } from "./content";
import { insightCopy, presentInsight } from "./insight-copy";
import { buildPortrait } from "./portrait";
import { SECTION_TITLES, VERSIONS } from "./manifest";
import { parseSubmission } from "./submission";
import type { Block, Reading, Report, Section, SectionId } from "./types";

const archetypeIds = ["explore-then-build","bring-people-along","careful-bridge","steady-execution"];
const method = "Det här är en självskattning. Texten beskriver svarsmönster och möjliga tolkningar, inte en diagnos eller ett facit på din personlighet. Exemplen är tänkbara situationer. Råden är försök att prova; orsaker och förmågor har inte undersökts.";
const isClear = (r: Reading) => r.direction === "high" || r.direction === "low";
function matches(answers: readonly number[], n: number, dir: "high" | "low") {
  const v=answers[n-1]; return v>0 && (dir==="high"?v>=4:v<=2);
}
function at(answers: readonly number[], numbers: readonly number[]): Evidence[] {
  return numbers.map(n=>({questionId:"Q"+String(n).padStart(2,"0"),answer:answers[n-1]}));
}
function dimensionBlock(r: Reading, role: "strength" | "blind" | "advice"): Block | null {
  if(!isClear(r))return null;
  const passage=content[r.dimension+"-"+r.direction]?.[role];
  if(!passage)return null;
  return {id:role+"-"+r.dimension,theme:role+"-"+r.dimension,topics:[passage.topic],title:passage.title,source:"dimension",
    interpretation:passage.text,example:passage.example,evidence:r.support,counterEvidence:r.counter,limitations:[]};
}
type Relation = Readonly<{id:string;title:string;conditions:readonly (readonly [number,"high"|"low"])[];exclude?:string}>;
const relations: readonly Relation[] = [
  {id:"trust-pace",title:"En kontakt kan få växa i etapper",conditions:[[2,"high"],[34,"high"]],exclude:"trust-and-disclosure"},
  {id:"listening-and-care",title:"Det stöd du vill ha behöver få bli tydligt",conditions:[[33,"high"],[7,"high"]]},
  {id:"voice-and-tone",title:"Sakfrågan och tonen kan få varsin plats",conditions:[[35,"high"],[12,"low"]],exclude:"cooperation-and-disagreement"},
  {id:"voice-and-boundaries",title:"Intresse är inte samma sak som ett ja",conditions:[[35,"high"],[36,"high"]],exclude:"commitment-boundaries"},
  {id:"tone-and-repair",title:"Det finns en fråga kvar efter ordväxlingen",conditions:[[12,"high"],[22,"high"]]},
];
function relationBlock(r: Relation, answers: readonly number[], readings: readonly Reading[]): Block {
  const high=(d:Dimension)=>readings.find(t=>t.dimension===d&&t.direction==="high");
  const low=(d:Dimension)=>readings.find(t=>t.dimension===d&&t.direction==="low");
  let text="",example="",context: Reading|undefined;
  if(r.id==="listening-and-care") {
    if(high("N")) {
      context=high("N");
      text="När du själv berättar om något svårt vill du helst bli lyssnad på först. " + (matches(answers,19,"high") ? "Med känslor som kan skifta" : "När reaktioner tar tydlig plats") + " kan det vara särskilt relevant att skilja den stunden från ett senare samtal om vad som ska göras. Du kan prova att göra ordningen tydlig, utan att behöva veta lösningen redan när du börjar berätta.";
      example="Du kan säga att du först vill få berätta färdigt och sedan gärna vill höra ett förslag. Hur den andra vill ha stöd behöver ni fråga om var för sig.";
    } else if(low("E")) {
      context=low("E");
      text="Du vill helst bli lyssnad på först när du berättar om något svårt. Med ett mer återhållsamt sätt att delta kan det vara värt att ge själva berättandet ett tydligt utrymme, i stället för att hoppas att allt kommer fram mellan andra ämnen.";
      example="En promenad med en person eller en bestämd stund i telefon kan vara former att prova om du själv vill prata. Det viktiga är att du hinner säga det du ville, inte att samtalet blir långt.";
    } else if(high("E")) {
      context=high("E");
      text="Även om du gärna tar kontakt kan ett svårt samtal behöva ett annat upplägg än ett vanligt småprat. Du vill helst bli lyssnad på först. Det kan hjälpa att säga det i början, så att samtalet inte direkt fylls av frågor, egna berättelser eller lösningsförslag.";
      example="Du kan be att få berätta klart innan ni diskuterar vad du ska göra. När en vän berättar behöver du fråga vilken sorts respons personen själv vill ha.";
    } else {
      text="När något är svårt vill du helst få berätta innan lösningsförslagen kommer. Det ger en konkret utgångspunkt för hur du kan be om stöd. Den andra behöver få veta vilken del du vill ha hjälp med just nu.";
      example="En fråga som Vill du att jag bara lyssnar en stund? kan tydliggöra ordningen när rollerna är omvända. Ditt eget önskemål behöver inte vara samma som vännen har.";
    }
  } else if(r.id==="trust-pace") {
    text="Du behöver inte avgöra hur mycket du vill dela bara för att ett möte känns vänligt. En kontakt kan fortsätta medan tilliten får mer tid. Det kan vara hjälpsamt att låta den andra förstå att du gärna ses igen, även om du inte vill berätta mer om en personlig sak just då.";
    example="Du kan föreslå ett nytt tillfälle att träffas och samtidigt säga att du vill vänta med ett visst ämne. De två beskeden kan finnas i samma samtal.";
  } else if(r.id==="voice-and-tone") {
    text="Du beskriver att du kan säga vad du tycker och känner liten igenkänning i att ofta uttrycka dig vasst. Det öppnar för att skilja en invändning från ett avståndstagande. Någon kan höra ett nej till hela idén där du själv bara vill ändra en del.";
    example="Om ni vill olika saker en kväll kan ni först reda ut om ni är oense om själva planen eller bara om tid och omfattning.";
  } else if(r.id==="voice-and-boundaries") {
    text="Du kan tycka att ett förslag är bra utan att ännu vilja förbinda dig till det. För den andra kan skillnaden behöva bli tydlig. Ett positivt samtal om en idé är inte automatiskt en överenskommelse om vad du ska göra.";
    example="Du kan uppskatta en inbjudan och ändå behöva återkomma om du vill delta. Det går att visa intresse utan att ge ett färdigt besked.";
  } else {
    text="Efter ett skarpt meningsutbyte kan det finnas både en sakfråga och något som fortfarande skaver. De behöver inte vara samma problem. Om du vill återuppta kontakten kan det vara användbart att först skilja vad du fortfarande invänder mot från hur ni vill prata med varandra.";
    example="Att förklara varför en sak var viktig besvarar inte alltid frågan om vad ni vill göra annorlunda nästa gång.";
  }
  return {id:"relation-"+r.id,theme:"relation-"+r.id,topics:["relation-"+r.id],title:r.title,source:"reflection",
    interpretation:text,example,evidence:at(answers,r.conditions.map(([n])=>n)),contextEvidence:context?.support,counterEvidence:context?.counter??[],limitations:[]};
}
export function buildReport(input: unknown): Report {
  const {answers}=parseSubmission(input);
  const readings=readDimensions(answers),dimensions=readings.map(r=>r.score);
  const insightAnalysis=analyzeInsights(answers);
  const clear=readings.filter(isClear);
  const byKey=(key:string)=>clear.find(r=>r.score.valid===6&&r.counter.length===0&&r.dimension===key[0]&&(key[1]==="+"?r.direction==="high":r.direction==="low"));
  const candidate=patterns.filter(p=>archetypeIds.includes(p.id)&&p.keys.every(byKey)).sort((a,b)=>{
    const weight=(keys:readonly string[])=>keys.reduce((n,k)=>n+byKey(k)!.support.length-byKey(k)!.counter.length,0);
    return weight(b.keys)-weight(a.keys)||(a.id<b.id?-1:1);
  })[0];
  const archetype=candidate?{id:candidate.id,name:candidate.name,evidence:candidate.keys.flatMap(k=>byKey(k)!.support)}:null;
  const strong=(d:Dimension,dir:"high"|"low")=>clear.some(r=>r.dimension===d&&r.direction===dir);
  const title=archetype?.name??(strong("A","high")&&strong("N","high")?(matches(answers,19,"high")?"Omtanke och känslor som skiftar":"Samspel och tydligare känsloreaktioner"):clear.length?"Din profil med "+clear.slice(0,2).map(r=>({
    E:r.direction==="high"?"socialt initiativ":"ett lugnare socialt tempo",
    A:r.direction==="high"?"omtanke":"lägre värden inom samspel",
    C:r.direction==="high"?"struktur":"varierat genomförande",
    N:r.direction==="high"?"tydligare känsloreaktioner":"ett jämnare känsloläge",
    O:r.direction==="high"?"nyfikenhet":"en bekant utgångspunkt",
  }[r.dimension])).join(" och "):"En bild med flera nyanser");
  const selectedTopics=new Set(insightAnalysis.insights.map(i=>insightCopy[i.id].topic));
  const profile=buildPortrait(readings,answers);
  const insightBlocks: Block[]=insightAnalysis.insights.map(i=>{
    const copy=presentInsight(i.id,readings);
    const limits:string[]=[];
    if(i.id==="autonomy-with-milestones"&&matches(answers,23,"low"))limits.push("Du känner samtidigt mindre igen dig i att hålla det du lovar. Den nyansen gäller fullföljandet, även om delmål och eget metodval passar dig.");
    return {id:"insight-"+i.id,theme:"insight-"+i.id,topics:[copy.topic],title:copy.title,source:"insight",insightId:i.id,
      observation:copy.observation,interpretation:copy.interpretation,example:copy.everyday,
      evidence:i.evidence,counterEvidence:i.counterEvidence,contextEvidence:[...i.nuanceEvidence,...copy.contextEvidence],presentationId:copy.variantId,limitations:limits};
  });
  const priority=[...clear].sort((a,b)=>b.support.length-a.support.length||["C","O","A","E","N"].indexOf(a.dimension)-["C","O","A","E","N"].indexOf(b.dimension));
  const strengths:Block[]=[];
  for(const r of priority) {
    if(r.dimension==="A"&&selectedTopics.has("commitment-boundaries"))continue;
    if(r.dimension==="E"&&selectedTopics.has("social-recovery"))continue;
    if(r.dimension==="N"&&!matches(answers,14,"high"))continue;
    if(r.dimension==="A"&&(!matches(answers,7,"high")||!matches(answers,17,"high")))continue;
    if(r.dimension==="O"&&r.direction==="high"&&!matches(answers,15,"high"))continue;
    const b=dimensionBlock(r,"strength"); if(!b)continue;
    // Individual examples depend on a second clear direction; its evidence remains visible.
    if(r.dimension==="A"&&strong("E","high")) {
      strengths.push({...b,interpretation:"När du redan är i kontakt med andra kan du använda ett enkelt utbyte till att ta reda på vilken hjälp som faktiskt önskas. En konkret fråga gör det lättare att erbjuda något användbart, utan att du behöver ta över det som den andra vill sköta själv.",
        example:"Om en vän har mycket omkring sig kan du fråga om en bestämd praktisk del skulle underlätta, i stället för att börja ordna flera saker på eget initiativ.",contextEvidence:clear.find(t=>t.dimension==="E")!.support});
    } else if(r.dimension==="A"&&strong("E","low")) {
      strengths.push({...b,interpretation:"Omtanke kan få en tydlig form genom en liten handling. Du kan välja ett bidrag som inte kräver ett långt samtal eller en stor insats, men som den andra faktiskt vill ha.",
        example:"Ett erbjudande om att följa med på ett ärende eller lämna något som behövs kan vara former att prova. Stäm av vilken del personen själv vill ha hjälp med.",contextEvidence:clear.find(t=>t.dimension==="E")!.support});
    } else if(r.dimension==="O"&&r.direction==="high"&&strong("C","high")) {
      strengths.push({...b,interpretation:"Du kan använda ditt idéintresse till att jämföra mer än ett genomförbart alternativ. Med struktur i genomförandet finns också en ram för att undersöka vad alternativen faktiskt kräver. Möjligheten ligger i jämförelsen, inte i att det nyaste förslaget måste vinna.",
        example:"Inför en ledig dag kan du jämföra två olika upplägg med samma tid och kostnad, så att skillnaden du väljer mellan faktiskt blir tydlig.",contextEvidence:clear.find(t=>t.dimension==="C")!.support});
    } else if(r.dimension==="O"&&r.direction==="high"&&strong("C","low")) {
      strengths.push({...b,interpretation:"Du kan låta ditt idéintresse bidra när ett val känns låst. Ett tredje alternativ behöver inte bli ett helt nytt upplägg. Det kan räcka att ändra en del av en vardagsplan så att du får något annat att ta ställning till.",
        example:"Om två alternativ för en ledig dag inte passar kan du behålla aktiviteten från det ena och platsen från det andra. Det är ett möjligt försök, inte en beskrivning av vad du redan brukar göra.",contextEvidence:clear.find(t=>t.dimension==="C")!.support});
    } else strengths.push(b);
    if(strengths.length===3)break;
  }
  if(strengths.length===1&&strong("A","high")&&matches(answers,12,"low")&&matches(answers,22,"low")) {
    strengths.push({id:"strength-renewed-conversation",theme:"strength-renewed-conversation",topics:["renewed-conversation"],title:"Ge en oenighet ett nytt samtal",source:"dimension",
      interpretation:"I dina svar tar en vass ton och kvarhållet groll mindre plats. Det kan vara en användbar utgångspunkt när en oenighet behöver tas upp igen: låt samtalet handla om den bestämda frågan, utan att göra den till ett omdöme om personen.",
      example:"Om ni valde olika saker i går kan nästa samtal börja med vad ni vill göra nu, snarare än vem som hade mest fel.",
      evidence:at(answers,[12,22]),counterEvidence:[],limitations:[]});
  }
  if(strengths.length===1&&strong("O","high")&&matches(answers,5,"high")&&matches(answers,25,"high")&&!selectedTopics.has("imagination-and-detail")) {
    strengths.push({id:"strength-expression",theme:"strength-expression",topics:["personal-expression"],title:"Ge en tanke något att möta",source:"dimension",
      interpretation:"Du kan använda fantasi och känsla för vardagliga uttryck till att göra en tanke synlig. Ett litet utkast ger något konkret att reagera på, utan att du behöver bestämma hur det färdiga resultatet ska bli.",
      example:"En färg, bild eller enkel skiss kan hjälpa dig att märka vilken del av en tänkt förändring du själv tycker om.",
      evidence:at(answers,[5,25]),counterEvidence:[],limitations:[]});
  }
  const riskPriority=strong("C","low")&&strong("N","low")
    ? [...priority].sort((a,b)=>["N","A","O","E","C"].indexOf(a.dimension)-["N","A","O","E","C"].indexOf(b.dimension))
    : priority;
  const blindSpots=riskPriority.flatMap(r=>{
    if(r.dimension==="A"&&selectedTopics.has("commitment-boundaries"))return [];
    const b=dimensionBlock(r,"blind");
    if(b&&r.dimension==="A"&&strong("N","high"))return [{...b,title:"Ett lättare samtal är inte alltid ett färdigt beslut",
      interpretation:"Om ett samtal har varit intensivt kan det kännas skönt när tonen blir lättare. Det kan ändå finnas en sakfråga kvar. Kontrollpunkten är vad ni faktiskt har bestämt, inte bara om samtalet kändes bättre på slutet.",
      contextEvidence:clear.find(t=>t.dimension==="N")!.support}];
    return b?[b]:[];
  }).slice(0,2);
  const relationships=relations.filter(r=>r.conditions.every(([n,d])=>matches(answers,n,d))&&(!r.exclude||!selectedTopics.has(r.exclude))).slice(0,2).map(r=>relationBlock(r,answers,readings));
  const compass:Block[]=insightAnalysis.advice.map(a=>{
    const copy=presentInsight(a.insightId,readings);
    return {id:"advice-"+a.id,theme:"advice-"+a.id,topics:[copy.topic],title:copy.adviceTitle,source:"insight",insightId:a.insightId,
      interpretation:copy.advice,adviceReason:copy.reason,evidence:a.evidence,counterEvidence:a.counterEvidence,contextEvidence:[...a.nuanceEvidence,...copy.contextEvidence],presentationId:copy.variantId,limitations:[]};
  });
  const usedDimensions=new Set<Dimension>();
  for(const i of insightAnalysis.insights)for(const e of i.evidence){const q=coreQuestions.find(q=>q.id===e.questionId);if(q)usedDimensions.add(q.dimension);}
  for(const r of priority) {
    if(compass.length>=3)break;
    if(usedDimensions.has(r.dimension))continue;
    if(r.dimension==="C"&&!matches(answers,3,"high"))continue;
    if(r.dimension==="A"&&matches(answers,35,"high")&&matches(answers,36,"low"))continue;
    const b=dimensionBlock(r,"advice");if(b){compass.push(b);usedDimensions.add(r.dimension);}
  }
  // Keep the resource, but do not repeat the same one-change routine as both example and advice.
  const presentedStrengths=strengths.map(b=>b.id==="strength-O"&&strong("O","low")&&compass.some(a=>a.id==="advice-O")
    ? {...b,example:undefined}:b);
  function section(id:SectionId,blocks:readonly Block[],note?:string):Section{return{id,title:SECTION_TITLES[id],blocks,note};}
  const varied=readings.filter(r=>r.score.varied).map(r=>r.dimension);
  const warnings=[...(varied.length?["varied_dimensions"]:[]),...(answers.some(a=>a===0)?["skipped_answers"]:[]),...(!clear.length?["no_clear_dimension_direction"]:[])];
  return immutable({
    product:"persona_test",experimental:true,reportVersion:VERSIONS.report,questionVersion:VERSIONS.question,analysisVersion:VERSIONS.analysis,contentVersion:VERSIONS.content,
    insightVersion:insightAnalysis.engineVersion,catalogVersion:insightAnalysis.catalogVersion,title,archetype,method,dimensions,readings,insightAnalysis,
    sections:[
      section("persona",[profile]),
      section("insights",insightBlocks,!insightBlocks.length?"Inga tillräckligt underbyggda kombinationsinsikter valdes. De andra delarna bedöms var för sig.":!clear.length&&varied.length?"Dina svar rymmer motriktade signaler. Insikterna gäller avgränsade kombinationer, inte en bestämd personlighetstyp.":undefined),
      section("strengths",presentedStrengths,presentedStrengths.length?undefined:"Här väljs inga generella styrkor med tillräckligt tydligt svarsstöd."),
      section("blindSpots",blindSpots,blindSpots.length?"Det här är möjliga fallgropar att pröva mot din vardag.":"Ingen särskild fallgrop valdes med tillräckligt stöd."),
      section("relationships",relationships,relationships.length?undefined:"Relationssvaren ger inget ytterligare perspektiv som är tillräckligt tydligt eller skiljer sig från insikterna ovan."),
      section("compass",compass,compass.length?undefined:"Inget tillräckligt personligt försök valdes."),
    ],
    quality:{eligible:dimensions.every(d=>d.value!==null),warnings,skipped:answers.filter(a=>a===0).length,variedDimensions:varied},
  });
}
