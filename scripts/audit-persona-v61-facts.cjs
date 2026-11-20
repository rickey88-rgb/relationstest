/* eslint-disable @typescript-eslint/no-require-imports -- offline per-claim fact audit */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const [beforeDir,afterDir,output]=process.argv.slice(2);
if(!beforeDir||!afterDir||!output)throw Error("Pass before, after, output directories");
const before=JSON.parse(fs.readFileSync(path.join(beforeDir,"PERSONA-V6-underlag.json"),"utf8"));
const after=JSON.parse(fs.readFileSync(path.join(afterDir,"PERSONA-V6-underlag.json"),"utf8"));
const body=b=>[b.observation,b.interpretation,b.example,b.adviceReason].filter(Boolean).join("\n");
function audit(rows) {
 const entries=[];
 for(const p of rows) {
  const r=p.report,reading=d=>r.readings.find(t=>t.dimension===d);
  function check(section,b,requirements=[],coverage=[]) {
   const failures=[],trace=[...b.evidence,...b.counterEvidence,...(b.contextEvidence??[])];
   for(const e of trace)if(p.answers[+e.questionId.slice(1)-1]!==e.answer)failures.push("Svarsspåret avviker från indata: "+e.questionId);
   function dim(d,dir) {const got=reading(d);if(got.direction!==dir)failures.push(d+" kräver "+dir+", har "+got.direction+" ("+got.score.value+")");}
   function raw(n,dir) {const a=p.answers[n-1];if(!(a>0&&(dir==="high"?a>=4:a<=2)))failures.push("Q"+n+" kräver "+dir+", har "+a);}
   for(const t of requirements) {
    const [kind,key,dir]=t;
    if(kind==="dimension")dim(key,dir);else if(kind==="raw")raw(key,dir);
    else if(kind==="clear"&&!["high","low"].includes(reading(key).direction))failures.push(key+" saknar tydlig riktning");
    else if(kind==="notHigh"&&reading(key).direction==="high")failures.push(key+" får inte vara high");
    else if(kind==="noClear"&&r.readings.some(t=>["high","low"].includes(t.direction)))failures.push("Text om avsaknad av riktning trots en tydlig dimension");
   }
   for(const d of coverage)for(const e of reading(d).score.evidence)if(!trace.some(t=>t.questionId===e.questionId))failures.push("Saknat underlag för beskriven dimension: "+e.questionId);
   const mentionIdeaintresse=b.interpretation.includes("idéintresse");
   if(section==="strengths"&&mentionIdeaintresse) {dim("O","high");raw(15,"high");}
   if(section==="strengths"&&b.id==="strength-O"&&reading("O").direction==="low"&&mentionIdeaintresse)failures.push("Låg öppenhet har skrivits över med hög-öppenhetstext");
   if(b.id==="relation-listening-and-care"&&b.interpretation.includes("känslor som kan skifta"))raw(19,"high");
   entries.push({profile:p.id,section,id:b.id,title:b.title,text:body(b),requirements,source:b.source,
     evidence:b.evidence,counterEvidence:b.counterEvidence,contextEvidence:b.contextEvidence??[],failures});
  }
  for(const s of r.sections)for(const b of s.blocks) {
   if(s.id==="persona") {
    const claims=b.claims??[];
    for(const c of claims) {
     let req=[],coverage=[];
     switch(c.id) {
      case "contact-and-company": req=[["dimension","E","high"],["dimension","A","high"],["raw",27,"high"]];break;
      case "quiet-care-curious": req=[["dimension","E","low"],["dimension","A","high"],["dimension","O","high"]];break;
      case "quiet-care-familiar": req=[["dimension","E","low"],["dimension","A","high"]];break;
      case "care-and-changing-feelings": req=[["dimension","A","high"],["dimension","N","high"],["raw",19,"high"]];break;
      case "different-social-situations":req=[["dimension","E","mixed"],["raw",1,"high"],["raw",11,"high"],["raw",6,"high"]];break;
      case "care-without-social-label":req=[["dimension","A","high"],["raw",27,"high"]];coverage=["E"];break;
      case "time-and-tone":req=[["dimension","A","high"],["raw",17,"high"],["raw",12,"low"]];break;
      case "individual-aspects-of-interaction":req=[["dimension","A","high"]];break;
      case "reserved-interaction-only":req=[["dimension","A","low"]];break;
      case "social-preference":req=[["clear","E"]];break;
      case "curiosity-and-structure":req=[["dimension","C","high"],["dimension","O","high"]];break;
      case "familiar-structure":req=[["dimension","C","high"],["dimension","O","low"]];break;
      case "interest-and-follow-through":req=[["dimension","C","low"],["dimension","O","high"]];break;
      case "practical-continuity":req=[["dimension","C","high"]];break;
      case "different-parts-of-doing":req=[["dimension","C","low"]];if(c.text.includes("Hänsynen"))req.push(["dimension","A","high"]);break;
      case "curiosity-without-method":req=[["dimension","O","high"]];break;
      case "familiar-start":req=[["dimension","O","low"]];break;
      case "steady-emotional-pace-structured":req=[["dimension","N","low"]];break;
      case "steady-emotional-pace-less-structured":req=[["dimension","N","low"],["dimension","C","low"]];break;
      case "calm-with-mood-variation":req=[["dimension","N","low"],["raw",19,"high"]];break;
      case "responsive-emotional-pace":req=[["dimension","N","high"]];break;
      case "interest-without-depth-demand":req=[["dimension","O","mixed"],["raw",15,"high"],["raw",30,"high"]];break;
      case "care-not-a-duty":req=[["dimension","A","high"],["dimension","N","high"]];break;
      case "values-and-current-feeling":req=[["dimension","A","high"],["dimension","N","high"],["raw",15,"high"],["raw",30,"high"]];break;
      case "no-simple-label":req=[["noClear"]];break;
      default:throw Error("Unaudited portrait claim: "+c.id);
     }
     check(s.id,{...b,id:c.id,interpretation:c.text,observation:undefined,example:undefined,evidence:c.evidence,counterEvidence:c.counterEvidence},req,coverage);
    }
    continue;
   }
   const m=b.id.match(/^(strength|blind|advice)-([EACNO])$/);
   if(m) {
    const d=m[2],dir=reading(d).direction,req=[["clear",d]];
    if(["strength","blind"].includes(m[1])&&["A","C"].includes(d))req.push(["dimension",d,"high"]);
    if(d==="N")req.push(["dimension","N","low"]);
    if(d==="O"&&m[1]==="blind")req.push(["dimension","O","high"]);
    if(d==="N"&&m[1]==="strength")req.push(["raw",14,"high"]);
    if(d==="A"&&m[1]==="strength")req.push(["raw",7,"high"],["raw",17,"high"]);
    if(d==="O"&&dir==="high"&&m[1]==="strength")req.push(["raw",15,"high"]);
    if(d==="C"&&m[1]==="advice")req.push(["raw",3,"high"]);
    check(s.id,b,req);continue;
   }
   if(b.id==="strength-renewed-conversation"){check(s.id,b,[["dimension","A","high"],["raw",12,"low"],["raw",22,"low"]]);continue;}
   if(b.id==="strength-expression"){check(s.id,b,[["dimension","O","high"],["raw",5,"high"],["raw",25,"high"]]);continue;}
   const relational={
    "relation-trust-pace":[[2,"high"],[34,"high"]],"relation-listening-and-care":[[33,"high"],[7,"high"]],
    "relation-voice-and-tone":[[35,"high"],[12,"low"]],"relation-voice-and-boundaries":[[35,"high"],[36,"high"]],
    "relation-tone-and-repair":[[12,"high"],[22,"high"]],
   }[b.id];
   if(relational){check(s.id,b,relational.map(([n,d])=>["raw",n,d]));continue;}
   if(b.source==="insight") {
    const e=r.insightAnalysis.evaluations.find(e=>e.candidateId===b.insightId);
    assert(e?.qualified&&e.decision==="selected");
    check(s.id,b,e.required.map(t=>["raw",+t.condition.questionId.slice(1),t.condition.direction]));
    if(b.presentationId?.endsWith(":structured"))assert.equal(reading("C").direction,"high");
    continue;
   }
   throw Error("Unaudited block: "+b.id);
  }
 }
 return entries;
}
const old=audit(before),current=audit(after);
for(const p of after) {
 const b=before.find(b=>b.id===p.id);assert.deepEqual(p.answers,b.answers);assert.deepEqual(p.report.dimensions,b.report.dimensions);
 assert.deepEqual(p.report.readings,b.report.readings);assert.deepEqual(p.report.insightAnalysis,b.report.insightAnalysis);
 assert.deepEqual(p.report.archetype,b.report.archetype);
}
const summary={profiles:after.length,blocksBefore:old.length,blocksAfter:current.length,
 failuresBefore:old.filter(e=>e.failures.length).map(e=>({profile:e.profile,id:e.id,failures:e.failures})),
 failuresAfter:current.filter(e=>e.failures.length).map(e=>({profile:e.profile,id:e.id,failures:e.failures})),
 affectedByIdeaMismatch:old.filter(e=>e.section==="strengths"&&e.text.includes("idéintresse")&&e.failures.length).map(e=>e.profile),
};
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,"PERSONA-faktakontroll-underlag.json"),JSON.stringify({summary,before:old,after:current},null,2));
const lines=["# PERSONA V6.1 – granskningsmatris","",
 "Varje rad avser en personlig slutsats eller ett innehållsblock. Vardagsexempel och blinda fläckar granskas som villkorade möjligheter, inte som påståenden om inträffade händelser.",
 "Kontrollen verifierar uttryckliga villkor och svarsspår. Den bevisar inte psykologisk giltighet.","",
 "| Profil | Kontrollerade delar | Underlagsfel före | Underlagsfel efter |","|---|---:|---:|---:|",
 ...after.map(p=>"| ["+p.id+"](efter/rapporter/"+p.id+".md) | "+current.filter(e=>e.profile===p.id).length+" | "+old.filter(e=>e.profile===p.id&&e.failures.length).length+" | "+current.filter(e=>e.profile===p.id&&e.failures.length).length+" |"),
 "", "## Konkreta fel före korrigering", "",
 ...old.filter(e=>e.failures.length).flatMap(e=>["### "+e.profile+" – "+e.id,"",e.text,"",...e.failures.map(f=>"- "+f),""]),
 "", "## Efter korrigering", "", "Kvarstående villkors- eller spårbarhetsfel: "+summary.failuresAfter.length+".",
 "Fullständig text, villkor, stöd och motbelägg för alla delar finns i JSON-underlaget."];
fs.writeFileSync(path.join(output,"PERSONA-faktakontroll-matris.md"),lines.join("\n")+"\n");
console.log(JSON.stringify(summary));
process.exitCode=summary.failuresAfter.length?1:0;
