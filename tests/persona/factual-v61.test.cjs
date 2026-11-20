/* eslint-disable @typescript-eslint/no-require-imports -- factual regression and counterexample checks */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs"),crypto=require("node:crypto");
const root=path.resolve(__dirname,"../.."),load=require("../../app/autism-test/test/test-loader.cjs")();
const v6=load(path.join(root,"app/persona/_domain/v6/index.ts"));
const {content}=load(path.join(root,"app/persona/_domain/v6/content.ts"));
const {coreQuestions}=load(path.join(root,"app/persona/_domain/v3/questions.ts"));
const {analyzeInsights}=load(path.join(root,"app/persona/_domain/insights-v1/index.ts"));
const ps=require("./insights-v2-full-fixtures.cjs");
const build=answers=>v6.buildReport({answers,questionVersion:v6.VERSIONS.question,reportVersion:v6.VERSIONS.report});
const strength=(r,d)=>r.sections.find(s=>s.id==="strengths").blocks.find(b=>b.id==="strength-"+d);
const reading=(r,d)=>r.readings.find(t=>t.dimension===d);
function setDimension(a,d,value) {
 coreQuestions.forEach((q,i)=>{if(q.dimension===d)a[i]=q.reverse?6-value:value;});
}

test("all six affected profiles keep the low-openness strength instead of a high-openness override",()=>{
 const affected=["F04","F08","F09","F11","F14","F19"];
 for(const p of ps) {
  const r=build(p.answers),o=reading(r,"O"),s=strength(r,"O");
  if(o.direction==="low"&&s){
   assert.equal(s.interpretation,content["O-low"].strength.text,p.id);
   const hasOwnAdvice=r.sections.find(t=>t.id==="compass").blocks.some(b=>b.id==="advice-O");
   assert.equal(s.example,hasOwnAdvice?undefined:content["O-low"].strength.example,p.id);
   assert(!s.interpretation.includes("idéintresse"),p.id);
   assert.deepEqual(s.counterEvidence,o.counter);
  }
  if(affected.includes(p.id)){assert.equal(o.score.value,2);assert(s,p.id);}
 }
});

test("all low/high/middle openness and structure combinations respect the actual direction",()=>{
 for(const openness of [1,2,3,4,5])for(const structure of [1,2,3,4,5]){
  const a=Array(40).fill(3);setDimension(a,"O",openness);setDimension(a,"C",structure);
  const r=build(a),o=reading(r,"O"),s=strength(r,"O");
  if(openness<=2){assert(s);assert.equal(s.interpretation,content["O-low"].strength.text);}
  if(openness===3)assert.equal(s,undefined);
  if(openness>=4){
   assert(s);assert.equal(o.direction,"high");assert(s.interpretation.includes("idéintresse"));
  }
 }
});

test("neutral cooperation does not become cooperation preference through the A average",()=>{
 const p=ps.find(p=>p.id==="F04"),r=build(p.answers),claims=r.sections[0].blocks[0].claims;
 assert.equal(p.answers[26],3);
 assert.equal(reading(r,"A").direction,"high");
 assert(!claims.some(c=>c.id==="care-without-social-label"));
 const c=claims.find(c=>c.id==="time-and-tone");assert(c);
 assert(c.evidence.some(e=>e.questionId==="Q17"&&e.answer===4));
 assert(c.evidence.some(e=>e.questionId==="Q12"&&e.answer===2));
 for(const profile of ps){
  const report=build(profile.answers);
  for(const claim of report.sections[0].blocks[0].claims.filter(c=>c.id==="care-without-social-label")){
   assert(profile.answers[26]>=4);
   for(const e of reading(report,"E").score.evidence)assert(claim.evidence.some(t=>t.questionId===e.questionId));
  }
 }
});

test("a local supported idea insight can coexist with low overall openness without a generic idea strength",()=>{
 const a=Array(40).fill(3);setDimension(a,"C",5);
 // C is still high, with a real starting difficulty and no promise-keeping premise.
 a[17]=5;a[22]=3;a[31]=5;
 for(const [n,v]of [[5,3],[10,5],[15,5],[20,5],[25,1],[30,5]])a[n-1]=v;
 const r=build(a);
 assert.equal(reading(r,"O").direction,"low");
 assert.equal(reading(r,"C").direction,"high");
 assert(r.insightAnalysis.insights.some(i=>i.id==="ideas-with-starting-friction"));
 assert.equal(strength(r,"O").interpretation,content["O-low"].strength.text);
 assert.deepEqual(r.insightAnalysis,analyzeInsights(a));
});

test("direct counteranswers prevent unsupported facet claims without changing dimension scores",()=>{
 const a=Array(40).fill(3);setDimension(a,"O",5);setDimension(a,"C",5);a[14]=1;
 const high=build(a);assert.equal(reading(high,"O").direction,"high");
 assert(!strength(high,"O")?.interpretation.includes("idéintresse"));
 const mood=Array(40).fill(3);setDimension(mood,"A",4);setDimension(mood,"N",5);mood[18]=1;mood[32]=5;
 const m=build(mood);assert.equal(reading(m,"N").direction,"high");
 assert(!/känslor som skiftar/.test(m.title));
 assert(!m.sections[0].blocks[0].claims.some(c=>c.id==="care-and-changing-feelings"));
 assert(!m.sections.find(s=>s.id==="relationships").blocks.some(b=>b.interpretation.includes("känslor som kan skifta")));
 const lowMood=Array(40).fill(3);setDimension(lowMood,"N",1);lowMood[18]=5;
 const lm=build(lowMood);assert.equal(reading(lm,"N").direction,"low");
 assert(lm.sections[0].blocks[0].claims.some(c=>c.id==="calm-with-mood-variation"));
 const lowA=Array(40).fill(3);setDimension(lowA,"A",1);
 const la=build(lowA);assert.equal(reading(la,"A").direction,"low");
 assert(la.sections[0].blocks[0].claims.some(c=>c.id==="reserved-interaction-only"));
 assert(!la.sections[0].blocks[0].claims.some(c=>c.id==="no-simple-label"));
 const plan=Array(40).fill(3);setDimension(plan,"C",5);plan[2]=1;
 const pr=build(plan);assert.equal(reading(pr,"C").direction,"high");
 assert(!pr.sections.find(s=>s.id==="compass").blocks.some(b=>b.id==="advice-C"));
});

test("the question bank, score function, V5 and insight activation code remain byte-identical",()=>{
 const pinned={"app/persona/_domain/v5/report.ts":"028524C987351703257CD7D346479ECFBE7FA2063BAA4FF5310D57CBAE787D62","app/persona/_domain/v3/score.ts":"6E4D2E42B1A5CDE72F04943B70D4B22587920788A78311C976AB20D495E9568F","app/persona/_domain/v6/dimensions.ts":"7E59B4C10E860507EC2424C203FF3F07BB6D70A7D8E16037FF64BDE98342F8E9","app/persona/_domain/v5/submission.ts":"E723C39D3F389CEC2E2B3CEA96EB11709201EFDA3D235B52FEEBDAD71F96EDDF","app/persona/_domain/v5/comparison.ts":"B1A070F9E25092A8EF7739466BF0AD30001B5468568DEE4CF83236E651481722","app/persona/_domain/v3/questions.ts":"4A2EBFD45143C7A3D4E3C2203CB165A64AA5091C9A2A929351BC6DB95EA39535","app/persona/_domain/insights-v1/index.ts":"7F93AA409BA707934F46AC679DC42A558BADFEB901340E7E75787AA224022414","app/persona/_domain/insights-v1/engine.ts":"36C5569AA56E0ED4B4443FD3BB4B251F923CAA2C8E6915E84E58406E94B70581","app/persona/_domain/insights-v1/types.ts":"75CF153A65E6F90BE5AE2D02ABAB48CBA580C2F0C9461CC91B29C24B0232D28B","app/persona/_domain/insights-v1/catalog.ts":"2515E5E775D197580DF6FD5973D897EA1B4E782ECEDACC8354648FBD3F0B1938","app/persona/_domain/v5/manifest.ts":"6481AFA03EDFC641826FA6913464253F42F762DA13F1FF5BF2957AA0351BC493"};
 for(const [file,hash]of Object.entries(pinned))assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(root,file))).digest("hex").toUpperCase(),hash,file);
});
