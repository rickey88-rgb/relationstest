/* eslint-disable @typescript-eslint/no-require-imports -- offline before/after editorial audit */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const [beforeDir,afterDir,output]=process.argv.slice(2);
if(!beforeDir||!afterDir||!output)throw Error("Pass before, after and output directories");
const before=JSON.parse(fs.readFileSync(path.join(beforeDir,"PERSONA-V6-underlag.json"),"utf8"));
const after=JSON.parse(fs.readFileSync(path.join(afterDir,"PERSONA-V6-underlag.json"),"utf8"));
const words=t=>(t.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)??[]).length;
const reservations=/bevisar inte|det säger inte|underlaget visar inte|svaren visar inte|det betyder inte|säger inget|bevisar ingen|inte ett bevis|ingen slutsats om/gi;
const portrait=r=>r.sections.find(s=>s.id==="persona").blocks.map(b=>b.interpretation).join("\n\n");
const paragraphs=r=>r.sections.flatMap(s=>s.blocks.flatMap(b=>[b.observation,b.interpretation,b.example,b.adviceReason].filter(Boolean).flatMap(t=>t.split("\n\n"))));
assert.equal(before.length,24);assert.equal(after.length,24);
const rows=after.map(a=>{
 const b=before.find(b=>b.id===a.id);assert(b);
 assert.deepEqual(a.answers,b.answers);assert.deepEqual(a.report.dimensions,b.report.dimensions);
 assert.deepEqual(a.report.readings,b.report.readings);assert.deepEqual(a.report.insightAnalysis,b.report.insightAnalysis);
 assert.deepEqual(a.report.archetype,b.report.archetype);
 const old=fs.readFileSync(path.join(beforeDir,"rapporter",a.id+".md"),"utf8"),now=fs.readFileSync(path.join(afterDir,"rapporter",a.id+".md"),"utf8");
 return {id:a.id,name:a.name,beforeWords:b.words,afterWords:a.words,beforePortrait:words(portrait(b.report)),afterPortrait:words(portrait(a.report)),
 beforeReservations:(old.match(reservations)??[]).length,afterReservations:(now.match(reservations)??[]).length,
 strengths:a.report.sections.find(s=>s.id==="strengths").blocks.length,
 insightIds:a.report.insightAnalysis.insights.map(i=>i.id),advice:a.report.sections.find(s=>s.id==="compass").blocks.map(b=>({id:b.id,topic:b.topics,reason:b.adviceReason})),
 };
});
function shared(entries) {
 const main=entries.filter(e=>["F01","F03","F06"].includes(e.id)),result=[];
 for(let i=0;i<main.length;i++)for(let j=i+1;j<main.length;j++){
  const a=new Set(paragraphs(main[i].report).filter(t=>words(t)>=35));
  for(const text of new Set(paragraphs(main[j].report)))if(a.has(text))result.push({first:main[i].id,second:main[j].id,words:words(text),text});
 }
 return result;
}
const summary={unchangedAnswers:true,unchangedDimensions:true,unchangedInsightAnalysis:true,unchangedArchetypes:true,
 beforeContent:before[0].report.contentVersion,afterContent:after[0].report.contentVersion,
 main:rows.filter(r=>["F01","F03","F06"].includes(r.id)),sharedLongBefore:shared(before),sharedLongAfter:shared(after)};
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,"PERSONA-V6.1-jamforelse.json"),JSON.stringify({summary,profiles:rows},null,2));
const lines=["# PERSONA V6.1 – före och efter","",
 "Samma 24 konstruerade profiler och exakt samma dimensionsvärden, insiktsurval, motbelägg och arketypvillkor. Ingen slutsats om vetenskaplig träffsäkerhet kan dras av språkmåtten.","",
 "| Profil | Ord före | Ord efter | Porträtt före | Porträtt efter | Reservationsfraser före/efter |","|---|---:|---:|---:|---:|---:|",
 ...rows.map(r=>"| ["+r.id+" – "+r.name+"](efter/rapporter/"+r.id+".md) | "+r.beforeWords+" | "+r.afterWords+" | "+r.beforePortrait+" | "+r.afterPortrait+" | "+r.beforeReservations+" / "+r.afterReservations+" |"),
 "", "Porträttlängden avser löptexten i första avsnittet. Totalantalet inkluderar rubriker och metodtext, men inte svarsbilagan.",
 "", "Reservationsmåttet räknar endast följande uttryck: "+reservations.source+". Det är inget validerat läsbarhetsmått.",
 "", "Identiska stycken om minst 35 ord mellan huvudexemplen, utanför den gemensamma metodtexten: "+summary.sharedLongBefore.length+" före, "+summary.sharedLongAfter.length+" efter. Det mäter exakt återanvändning, inte all semantisk likhet.",
 "", "## Tre huvudexempel",
 ...["F01","F03","F06"].map(id=>"- "+id+": [före](fore/rapporter/"+id+".md) / [efter](efter/rapporter/"+id+".md)"),
 ];
fs.writeFileSync(path.join(output,"PERSONA-V6.1-jamforelse.md"),lines.join("\n")+"\n");
console.log(JSON.stringify(summary));
