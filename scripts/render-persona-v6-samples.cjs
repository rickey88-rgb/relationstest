/* eslint-disable @typescript-eslint/no-require-imports -- offline experimental report review */
const fs=require("node:fs"),path=require("node:path");
const load=require("../app/autism-test/test/test-loader.cjs")();
const v6=load(path.resolve(__dirname,"../app/persona/_domain/v6/index.ts"));
const profiles=require("../tests/persona/insights-v2-full-fixtures.cjs");
const output=process.argv[2];
if(!output)throw Error("Pass an explicit local output directory");
fs.mkdirSync(path.join(output,"rapporter"),{recursive:true});
const rows=profiles.map(p=>{
  const report=v6.buildReport({answers:p.answers,questionVersion:v6.VERSIONS.question,reportVersion:v6.VERSIONS.report});
  const words=v6.countWords(report);
  fs.writeFileSync(path.join(output,"rapporter",p.id+".md"),v6.renderMarkdown(report));
  fs.writeFileSync(path.join(output,"rapporter",p.id+"-underlag.md"),v6.renderMarkdown(report,true));
  return {id:p.id,name:p.name,group:p.group,answers:p.answers,words,report};
});
const summary=rows.map(r=>({id:r.id,name:r.name,title:r.report.title,words:r.words,
  insights:r.report.sections.find(s=>s.id==="insights").blocks.length,
  strengths:r.report.sections.find(s=>s.id==="strengths").blocks.length,
  advice:r.report.sections.find(s=>s.id==="compass").blocks.length,
  clear:r.report.readings.filter(r=>["high","low"].includes(r.direction)).length,warnings:r.report.quality.warnings}));
const lines=["# PERSONA V6 – ordantal och profiler","",
  "Konstruerade testfall, inte representativa kunder. Ordantalet inkluderar rubriker och synliga försiktighetsnoter men inte svarsbilagan eller tekniska versionsfält.","",
  "| Profil | Rubrik | Ord | Insikter | Styrkor | Råd |","|---|---|---:|---:|---:|---:|",
  ...summary.map(r=>"| ["+r.id+" – "+r.name+"](rapporter/"+r.id+".md) | "+r.title+" | "+r.words+" | "+r.insights+" | "+r.strengths+" | "+r.advice+" |"),
  "","Tre huvudexempel: [F01](rapporter/F01.md), [F03](rapporter/F03.md) och [F06](rapporter/F06.md).",
  "","[F19](rapporter/F19.md) visar sex delar utan kombinationsinsikter. [F24](rapporter/F24.md) är en neutral kontroll utan påhittade egenskaper.",
  "","Ordintervallet är vägledande. Kortare rapporter behålls när stöd saknas. Inga avsnitt förlängs enbart för att nå en kvot."];
fs.writeFileSync(path.join(output,"PERSONA-V6-profiler.md"),lines.join("\n")+"\n");
fs.writeFileSync(path.join(output,"PERSONA-V6-underlag.json"),JSON.stringify(rows,null,2));
console.log(JSON.stringify(summary));
