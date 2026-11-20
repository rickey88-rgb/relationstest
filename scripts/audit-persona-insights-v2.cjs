/* eslint-disable @typescript-eslint/no-require-imports -- offline synthetic coverage audit */
const fs = require("node:fs"), path = require("node:path");
const load = require("../app/autism-test/test/test-loader.cjs")();
const { CATALOG, CATALOG_VERSION, analyzeInsights } = load(path.resolve(__dirname, "../app/persona/_domain/insights-v1/index.ts"));
const { scoreDimensions } = load(path.resolve(__dirname, "../app/persona/_domain/v3/score.ts"));
const original = require("../tests/persona/insights-v1-expanded-fixtures.cjs");
const full = require("../tests/persona/insights-v2-full-fixtures.cjs");
// Replay the former 15 activation rules through the same unchanged selection engine.
// Only autonomy counterevidence/nuance activation changed among the original rules.
const legacyCatalog = CATALOG.slice(0, 15).map(c => c.id !== "autonomy-with-milestones" ? c : ({
  ...c, nuances: c.nuances.filter(t => t.questionId !== "Q23"),
  contradictory: c.supporting.map(t => ({ ...t, id: t.questionId + "-low", direction: "low" })),
}));
const legacyLoad = require("../app/autism-test/test/test-loader.cjs")({ "./catalog": { CATALOG: legacyCatalog, CATALOG_VERSION: "persona-insights-catalog-v1.1" } });
const legacyAnalyze = legacyLoad(path.resolve(__dirname, "../app/persona/_domain/insights-v1/engine.ts")).analyzeInsights;
const baseline = full.map(p => { const r = legacyAnalyze(p.answers); return { id: p.id, pre: r.evaluations.filter(e => e.qualified).length, selected: r.insights.map(i => i.id) }; });
const output = process.argv[2];
if (!output) throw Error("Pass an explicit local output directory");
function analyze(p) { return { ...p, result: analyzeInsights(p.answers), dimensionsResult: scoreDimensions(p.answers.map(v => v ?? 0)) }; }
const oldRows = original.map(analyze), rows = full.map(analyze), combined = [...oldRows, ...rows];
function stats(entries) {
  const selected = entries.reduce((n,p) => n + p.result.insights.length, 0);
  return {
    profiles: entries.length, matches: entries.reduce((n,p) => n + p.result.evaluations.filter(e=>e.qualified).length,0),
    selected, average: selected / entries.length,
    zero: entries.filter(p=>!p.result.insights.length).map(p=>p.id ?? p.name),
    zeroShare: entries.filter(p=>!p.result.insights.length).length / entries.length,
    neutralShare: entries.reduce((n,p)=>n+p.answers.filter(v=>v===3).length,0)/(entries.length*40),
  };
}
const rules = CATALOG.map(c => ({
  id: c.id, family: c.family,
  matchedFull: rows.filter(p=>p.result.evaluations.find(e=>e.candidateId===c.id).qualified).length,
  selectedFull: rows.filter(p=>p.result.insights.some(i=>i.id===c.id)).length,
  selectedCombined: combined.filter(p=>p.result.insights.some(i=>i.id===c.id)).length,
}));
const conflicts = [], overlaps = [], adviceIssues = [], discarded = {};
for (const p of combined) {
  const r = p.result, required = r.insights.flatMap(i=>CATALOG.find(c=>c.id===i.id).required);
  if (required.some(t=>required.some(o=>o.questionId===t.questionId && o.direction!==t.direction))) conflicts.push(p.id??p.name);
  for (let i=0;i<r.insights.length;i++) for(let j=i+1;j<r.insights.length;j++) {
    const a=new Set(r.insights[i].evidence.map(t=>t.questionId)),b=new Set(r.insights[j].evidence.map(t=>t.questionId));
    const shared=[...a].filter(t=>b.has(t));
    if(shared.length)overlaps.push({profile:p.id??p.name,first:r.insights[i].id,second:r.insights[j].id,shared,ratio:shared.length/new Set([...a,...b]).size});
  }
  for(const a of r.advice) {
    const c=CATALOG.find(c=>c.id===a.insightId);
    if(a.text!==c.advice || !c.required.every(t=>a.evidence.some(e=>e.questionId===t.questionId&&(t.direction==="high"?e.answer>=4:e.answer<=2)))) adviceIssues.push(p.id??p.name);
  }
  for(const e of r.evaluations)if(e.qualified&&e.decision!=="selected")discarded[e.decision]=(discarded[e.decision]??0)+1;
}
const summary = {catalogVersion:CATALOG_VERSION,rules:CATALOG.length,old:stats(oldRows),full:stats(rows),combined:stats(combined),
  baselineFull:{profiles:baseline.length,matches:baseline.reduce((n,p)=>n+p.pre,0),selected:baseline.reduce((n,p)=>n+p.selected.length,0),zero:baseline.filter(p=>!p.selected.length).map(p=>p.id)},
  groups:full.reduce((a,p)=>(a[p.group]=(a[p.group]??0)+1,a),{}),rulesNeverActivatedFull:rules.filter(r=>!r.matchedFull).map(r=>r.id),
  rulesNeverSelectedFull:rules.filter(r=>!r.selectedFull).map(r=>r.id),rulesNeverSelectedCombined:rules.filter(r=>!r.selectedCombined).map(r=>r.id),
  conflicts,overlaps,adviceIssues,discarded};
const lines = ["# PERSONA – täckningsförbättring v2", "",
  "Konstruerade testfall. Ingen befolkningstäckning, kundfördelning eller vetenskaplig träffsäkerhet kan utläsas ur dessa siffror.",
  "", "## Mätresultat", "", "| Underlag | Profiler | Matchningar | Valda | Genomsnitt | Noll |", "|---|---:|---:|---:|---:|---:|",
  ...[["Tidigare riktade profiler",summary.old],["Nya fullständiga profiler",summary.full],["Samtliga",summary.combined]].map(([n,s])=>"| "+n+" | "+s.profiles+" | "+s.matches+" | "+s.selected+" | "+s.average.toFixed(3)+" | "+s.zero.length+" ("+(100*s.zeroShare).toFixed(1)+" %) |"),
  "", "Registrerad v1.1-baslinje på de 24 nya profilerna: "+summary.baselineFull.selected+" valda, "+summary.baselineFull.zero.length+" nollfall.",
  "", "## Alla 24 fullständiga profiler", "", "| ID | Profil | Före filter | Efter filter | Fynd |", "|---|---|---:|---:|---|",
  ...rows.map(p=>"| "+p.id+" | "+p.name+" | "+p.result.evaluations.filter(e=>e.qualified).length+" | "+p.result.insights.length+" | "+(p.result.insights.map(i=>i.id).join(", ")||"Avstår")+" |"),
  "", "## Regelanvändning", "", "| Regel | Matchar nya 24 | Väljs nya 24 | Väljs samtliga 44 |", "|---|---:|---:|---:|",
  ...rules.map(r=>"| "+r.id+" | "+r.matchedFull+" | "+r.selectedFull+" | "+r.selectedCombined+" |"),
  "", "## Kvalitetskontroll", "", "Motriktade obligatoriska premisser bland valda fynd: "+conflicts.length+". Råd med saknat nödvändigt svarstöd: "+adviceIssues.length+".",
  "Delat underlag redovisas i JSON. Gemensamma frågor är inte automatiskt motsägelse eller upprepning; överlapp på minst 50 procent stoppas.",
  "", "## De tre nya reglernas texter och begränsningar"];
for(const c of CATALOG.slice(-3))lines.push("", "### "+c.id, "",
  "Villkor: "+c.required.map(t=>t.questionId+" "+t.direction).join(", ")+". Alla krävs; neutralt eller saknat svar ger inget stöd. Motsatt svar på en nödvändig premiss blockerar och spåras som motbelägg.",
  "", "**Observation:** "+c.observation, "", "**Möjlig tolkning:** "+c.explanation, "", "**Praktiskt råd:** "+c.advice,"",
  ...c.limitations.map(t=>"- "+t));
lines.push("", "## Fullständigt underlag och råd per profil");
for(const p of rows){
 lines.push("", "### "+p.id+" – "+p.name, "", "Dimensioner: "+p.dimensionsResult.map(d=>d.dimension+" "+d.value+(d.varied?" (varierat)":"")).join(", "), "", "Råsvar Q01–Q40: "+p.answers.join(", "), "");
 for(const i of p.result.insights){const a=p.result.advice.find(a=>a.insightId===i.id);lines.push("**"+i.title+"**", "",i.observation,"",i.possibleExplanation,"","Råd: "+a.text,"","Svarstöd: "+i.evidence.map(e=>e.questionId+"="+e.answer).join(", "),"");}
 if(!p.result.insights.length)lines.push("Motorn avstår. Ingen utfyllnadsinsikt eller något råd har skapats.");
}
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,"PERSONA-tackning-v2-resultat.md"),lines.join("\n")+"\n");
fs.writeFileSync(path.join(output,"PERSONA-tackning-v2-underlag.json"),JSON.stringify({summary,rules,baseline,catalog:CATALOG,original:oldRows,profiles:rows},null,2));
console.log(JSON.stringify(summary));
