/* eslint-disable @typescript-eslint/no-require-imports -- offline quality policy verification */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"../.."),createLoader=require("../../app/autism-test/test/test-loader.cjs");
const load=createLoader(),{assessReportQuality,QUALITY_VERSION}=load(path.join(root,"app/persona/_domain/quality-v1/index.ts"));
const v6=load(path.join(root,"app/persona/_domain/v6/index.ts")),profiles=require("./insights-v2-full-fixtures.cjs");
const expected={F13:"limited",F16:"limited",F19:"limited",F21:"insufficient",F22:"limited",F23:"insufficient",F24:"insufficient"};
for(const profile of profiles)test(profile.id+": auditable information classification",()=>{
 const before=JSON.stringify(profile.answers),r=assessReportQuality(profile.answers);
 assert.equal(r.state,expected[profile.id]??"ready");assert.equal(r.validCount,40);
 assert.deepEqual(r,assessReportQuality(profile.answers.slice()));assert.equal(JSON.stringify(profile.answers),before);
 assert.equal(r.sections.length,6);assert(Object.isFrozen(r)&&Object.isFrozen(r.dimensionDiagnostics));
 assert(r.insights<=3&&r.advice<=3);assert(r.followUpProposals.length<=4);
 assert.equal(r.version,QUALITY_VERSION);
 assert.equal(r.state==="insufficient",Object.values(r.checks).some(ok=>!ok));
 for(const section of r.sections)assert.equal(section.noteOnly,section.meaningfulBlockIds.length===0);
});
test("F19 low values are valid, consistent and useful, not a personality failure",()=>{
 const r=assessReportQuality(profiles.find(p=>p.id==="F19").answers);
 assert.equal(r.state,"limited");assert(r.dimensionDiagnostics.every(d=>d.direction==="low"&&!d.bidirectional));
 assert.equal(r.strengths,3);assert.equal(r.advice,3);assert.equal(r.insights,0);
 assert(r.checks.personalContentDominates);assert.equal(r.followUpProposals.length,0);
});
test("mixed middle-range F16 remains usable without a forced archetype or strengths",()=>{
 const p=profiles.find(p=>p.id==="F16"),r=assessReportQuality(p.answers);
 assert(r.dimensionDiagnostics.every(d=>!["high","low"].includes(d.direction)));
 assert.equal(r.state,"limited");assert.equal(r.strengths,0);assert.equal(r.insights,1);
 assert(r.checks.sufficientSections&&r.checks.usefulResource);
});
test("balanced dimensions with informative reflections are not automatically rejected",()=>{
 const a=Array(40).fill(3);
 for(const n of [3,31,32,35,36,33,7,38])a[n-1]=4;
 for(const n of [28,12])a[n-1]=2;
 const r=assessReportQuality(a);
 assert(r.dimensionDiagnostics.every(d=>!["high","low"].includes(d.direction)));
 assert.notEqual(r.state,"insufficient");assert(r.insights>0&&r.advice>0);
});
test("uniform agreement is a caution, never a declaration of invalid customer answers",()=>{
 const r=assessReportQuality(Array(40).fill(5));
 assert.equal(r.state,"limited");assert.equal(r.validCount,40);assert.deepEqual(r.invalidIds,[]);
 assert(r.rawUniformExtreme);assert(!r.readyChecks.interpretableResponsePattern);
});
test("neutral answers remain valid; insufficient refers to the report, not the person",()=>{
 const r=assessReportQuality(Array(40).fill(3));
 assert.equal(r.state,"insufficient");assert.equal(r.validCount,40);assert.deepEqual(r.invalidIds,[]);
 assert.equal(r.neutralCount,40);assert.equal(r.reservationShare,1);assert.equal(r.meaningfulBlocks,0);
 assert(r.followUpProposals.some(q=>q.id==="meaning-of-middle"));
 assert(r.followUpProposals.every(q=>q.limitation));
});
test("missing, malformed and sparse ratings are distinguished without coercion",()=>{
 const r=assessReportQuality([5,0,null,undefined,"5",6,NaN,true,2.5]);
 assert.equal(r.validCount,1);assert.deepEqual(r.invalidIds,["Q05","Q06","Q07","Q08","Q09"]);
 assert.equal(r.missingIds.length,39);assert.equal(r.state,"insufficient");
 assert(r.followUpProposals.some(q=>q.id==="complete-existing"));
 assert.throws(()=>assessReportQuality(Array(41).fill(3)));
 assert.equal(assessReportQuality([]).state,"insufficient");
});
test("minimum sample and per-dimension coverage are enforced independently",()=>{
 const a=profiles[0].answers.slice();
 for(let i=0;i<20;i++)a[i]=0;
 const r=assessReportQuality(a);
 assert(!r.checks.sufficientAnswers);assert(!r.checks.sufficientDimensions);
 assert.equal(r.state,"insufficient");
});
test("wordy abstention cannot buy a ready classification",()=>{
 const report=v6.buildReport({answers:Array(40).fill(3),questionVersion:v6.VERSIONS.question,reportVersion:v6.VERSIONS.report});
 const inflated={...report,sections:report.sections.map(s=>({...s,note:"Generell reservation. ".repeat(1000)}))};
 const mock=createLoader({"../v6/index":{VERSIONS:v6.VERSIONS,buildReport:()=>inflated}});
 const result=mock(path.join(root,"app/persona/_domain/quality-v1/index.ts")).assessReportQuality(Array(40).fill(3));
 assert.equal(result.state,"insufficient");assert.equal(result.meaningfulBlocks,0);
});
test("report generation remains byte-identical after isolated quality assessment",()=>{
 for(const p of profiles){
  const input={answers:p.answers,questionVersion:v6.VERSIONS.question,reportVersion:v6.VERSIONS.report};
  const before=JSON.stringify(v6.buildReport(input));assessReportQuality(p.answers);
  assert.equal(JSON.stringify(v6.buildReport(input)),before);
 }
});
