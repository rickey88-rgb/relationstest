/* eslint-disable @typescript-eslint/no-require-imports -- synthetic, offline completion tests */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
const {renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../.."),createLoader=require("../../app/autism-test/test/test-loader.cjs");
const load=createLoader(),api=load(path.join(root,"app/persona/_domain/supplement-v1/index.ts"));
const v6=load(path.join(root,"app/persona/_domain/v6/index.ts"));
const profiles=require("./insights-v2-full-fixtures.cjs"),get=id=>profiles.find(p=>p.id===id).answers;
const informative={S01:"context",S02:"one",S03:"small-step",S04:"voice"};
test("F21 gains bounded report content and limited status without changed ratings",()=>{
 const original=get("F21"),snapshot=JSON.stringify(original),r=api.completeReport(original,informative);
 assert.equal(r.before.state,"insufficient");assert.equal(r.after.state,"limited");
 assert.equal(r.additions.length,3);assert.equal(r.after.independentContentUnits,4);
 assert.equal(r.after.meaningfulSections,4);assert.equal(r.after.distinctEvidenceIds.length,6);
 assert.equal(JSON.stringify(original),snapshot);assert.equal(r.baseReport.insightAnalysis.insights.length,1);
 assert.equal(r.after.additionalInsights,0);assert(!r.allowCheckout);
});
for(const id of ["F23","F24"])test(id+": new content does not masquerade as enough independent evidence",()=>{
 const r=api.completeReport(get(id),informative);
 assert.equal(r.after.state,"insufficient");assert.equal(r.additions.length,3);
 assert.equal(r.after.independentContentUnits,2);assert.equal(r.after.meaningfulSections,3);
 assert.equal(r.after.distinctEvidenceIds.length,3);assert(!r.after.checks.diverseEvidence);
 assert(!r.after.checks.sufficientBlocks);assert.equal(r.presentation,"free-fallback");
 assert(r.freeResult.explanation.includes("erbjuder vi inget köp"));assert(!r.allowCheckout);
});
test("all 24 uncompleted reports preserve original state, original V6 and input data",()=>{
 for(const p of profiles){
  const input={answers:p.answers,questionVersion:v6.VERSIONS.question,reportVersion:v6.VERSIONS.report};
  const before=JSON.stringify(v6.buildReport(input)),r=api.completeReport(p.answers);
  assert.equal(r.before.state,r.after.state);assert.equal(JSON.stringify(r.baseReport),before);
  assert(Object.isFrozen(r));assert(r.offeredQuestions.length<=4);
  if(r.before.state==="ready")assert.equal(r.offeredQuestions.length,0);
 }
});
test("skip, uncertainty and no change are accepted without forced stories or advice",()=>{
 for(const id of ["F21","F23","F24"]){
  for(const extra of [{},{S01:"skip",S02:"skip",S03:"skip",S04:"skip"},
    {S01:"uncertain",S02:"uncertain",S03:"uncertain",S04:"uncertain"},
    {...informative,S04:"none"}]){
   const r=api.completeReport(get(id),extra);assert.equal(r.after.state,"insufficient");
   assert.equal(r.additions.length,0);assert(r.freeResult);assert(!r.allowCheckout);
  }
 }
});
test("clarifying the middle or context alone cannot change status or create traits",()=>{
 for(const S01 of ["fits","context","uncertain","other"]){
  const r=api.completeReport(get("F24"),{S01});
  assert.equal(r.after.state,"insufficient");assert.equal(r.additions.length,0);assert(r.methodNote);
 }
});
test("no reported difference is respected and not reframed as a hidden difficulty",()=>{
 const r=api.completeReport(get("F21"),{...informative,S02:"no-difference"});
 assert(!r.additions.some(a=>a.section==="relationships"));assert.equal(r.after.state,"insufficient");
});
test("a missing recent example never becomes an invented strength or experiment",()=>{
 const r=api.completeReport(get("F21"),{...informative,S03:"no-example"});
 assert(r.additions.every(a=>a.section==="relationships"));
 assert(!r.additions.some(a=>["strengths","compass"].includes(a.section)));
});
test("every supplementary statement cites actual selected options; resource and advice are one evidence group",()=>{
 const r=api.completeReport(get("F21"),informative);
 for(const block of r.additions){
  assert.equal(block.evidence.length,2);
  for(const e of block.evidence)assert.equal(e.optionId,informative[e.questionId]);
  assert(block.limitation&&block.scope);
 }
 const strength=r.additions.find(a=>a.section==="strengths"),advice=r.additions.find(a=>a.section==="compass");
 assert.equal(strength.group,advice.group);assert.equal(r.after.independentContentUnits-r.before.meaningfulBlocks,2);
});
test("every resource/priority combination selects a concrete, goal-specific experiment",()=>{
 const {experiment}=load(path.join(root,"app/persona/_domain/supplement-v1/experiments.ts"));
 const texts=[];
 for(const resource of ["listened","small-step","asked","alternative"])
  for(const goal of ["voice","pause","start","connection","preserve"]){
   const r=api.completeReport(get("F24"),{...informative,S03:resource,S04:goal});
   const copy=experiment(goal,resource);assert(copy.length>40);
   assert(r.additions.find(a=>a.section==="compass").text.includes(copy));texts.push(copy);
  }
 assert.equal(new Set(texts).size,20);
});
test("all 756 response combinations stay deterministic, voluntary and never upgrade to ready",()=>{
 let count=0;
 for(const id of ["F21","F23","F24"])
  for(const context of api.QUESTIONS[1].options)
   for(const resource of api.QUESTIONS[2].options)
    for(const goal of api.QUESTIONS[3].options){
     const r=api.completeReport(get(id),{S02:context.id,S03:resource.id,S04:goal.id});
     assert.notEqual(r.after.state,"ready");assert.equal(r.allowCheckout,false);
     if(id!=="F21")assert.equal(r.after.state,"insufficient");
     assert.equal(r.freeResult!==null,r.after.state==="insufficient");count++;
    }
 assert.equal(count,756);
});
test("unsupported option IDs, answer injection, arrays and non-eligible profiles are rejected",()=>{
 for(const bad of [null,[],{S05:"one"},{S01:5},{S02:"invented"},{answers:Array(40).fill(5)}])
  assert.throws(()=>api.completeReport(get("F24"),bad));
 assert.throws(()=>api.completeReport(get("F01"),informative));
});
const css={default:new Proxy({},{get:(_,key)=>String(key)})};
function pageLoader(result,allowed=true){
 return createLoader({
  "next/navigation":{notFound(){throw Error("not found");}},
  "../../dev-report/access":{canOpenLocalReport:async()=>allowed},
  "./model.server":{loadSupplement:()=>result},
  "../preview.module.css":css,"./preview.module.css":css,
  "../report/report.module.css":css,"./report.module.css":css,
 })(path.join(root,"app/persona/dev-report-v6/supplement/page.tsx")).default;
}
test("local reserve renders a free result without a premium report or purchase button",async()=>{
 const env=process.env.NODE_ENV;try{
  process.env.NODE_ENV="development";
  for(const id of ["F23","F24"]){
   const page=pageLoader(api.completeReport(get(id),informative));
   const html=renderToStaticMarkup(await page({searchParams:Promise.resolve({profile:id,...informative})}));
   assert(html.includes("Det här kan vi säga just nu"));assert(html.includes("erbjuder vi inget köp"));
   assert(!html.includes('id="persona-premium-report"'));assert(!html.includes("79 kr"));
   assert.equal((html.match(/<select /g)||[]).length,5); // profile + four optional questions
  }
 }finally{if(env===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=env;}
});
test("local F21 renders the real V6 sections plus new scoped content without trace data",async()=>{
 const env=process.env.NODE_ENV;try{
  process.env.NODE_ENV="development";
  const result=api.completeReport(get("F21"),informative),page=pageLoader(result);
  const html=renderToStaticMarkup(await page({searchParams:Promise.resolve({profile:"F21",...informative})}));
  assert(html.includes('id="persona-premium-report"'));assert.equal((html.match(/<section /g)||[]).length,6);
  for(const block of result.additions)assert(html.includes(block.title));
  assert(!/counterEvidence|independentContentUnits|optionId/.test(html));
  assert.equal(html.split(result.methodNote).length-1,1);
 }finally{if(env===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=env;}
});
test("preview is inaccessible in production and for non-local requests before loading data",async()=>{
 const env=process.env.NODE_ENV;try{
  process.env.NODE_ENV="production";await assert.rejects(pageLoader(null)({searchParams:Promise.resolve({})}),/not found/);
  process.env.NODE_ENV="development";await assert.rejects(pageLoader(null,false)({searchParams:Promise.resolve({})}),/not found/);
  await assert.rejects(pageLoader(null)({searchParams:Promise.resolve({profile:"F01"})}),/not found/);
 }finally{if(env===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=env;}
});

test("non-social goals gain context only with an explicit experience of asking for clarification",()=>{
 for(const goal of ["start","preserve"]){
  const r=api.completeReport(get("F21"),{...informative,S03:"asked",S04:goal});
  assert.equal(r.after.state,"limited");
  const context=r.additions.find(a=>a.id==="context-for-clarification");
  assert(context&&context.section==="relationships");
  assert.deepEqual(context.evidence.map(e=>e.questionId),["S02","S03","S04"]);
  assert(context.text.includes("Om den valda uppgiften eller rutinen"));
  assert.equal(r.after.independentContentUnits,4);
  for(const resource of ["small-step","listened","alternative","no-example"]){
   const narrower=api.completeReport(get("F21"),{...informative,S03:resource,S04:goal});
   assert(!narrower.additions.some(a=>a.id==="context-for-clarification"));
   assert.equal(narrower.after.state,"insufficient");
  }
 }
});
test("non-social rule never invents a preferred communication form",()=>{
 for(const S02 of ["no-difference","uncertain","skip"]){
  const r=api.completeReport(get("F21"),{...informative,S02,S03:"asked",S04:"preserve"});
  assert(!r.additions.some(a=>a.id==="context-for-clarification"));
 }
});
test("ready allows a future full offer but no live checkout is activated",()=>{
 const r=api.completeReport(get("F01"));
 assert(r.offer.fullPremiumOfferAllowed);assert.equal(r.offer.nextStep,"premium-offer");
 assert.equal(r.offeredQuestions.length,0);assert.equal(r.allowCheckout,false);
 assert.equal(r.offer.includedSections.length,6);assert.equal(r.offer.missingSections.length,0);
});
test("limited has a factual inventory, missing sections and relevant optional completion",()=>{
 for(const id of ["F13","F16","F22"]){
  const r=api.completeReport(get(id));
  assert.equal(r.offer.nextStep,"limited-summary");assert(!r.offer.fullPremiumOfferAllowed);
  assert(!r.offer.limitedPurchaseAllowed);assert(r.offer.supplementAllowed);
  assert.equal(r.offeredQuestions.length,4);
  for(const title of r.offer.includedSections)assert(r.offer.description.includes(title));
  for(const title of r.offer.missingSections)assert(r.offer.description.includes(title));
 }
 const f19=api.completeReport(get("F19"));
 assert(!f19.offer.supplementAllowed);assert.equal(f19.offeredQuestions.length,0);
 assert.throws(()=>api.completeReport(get("F19"),informative));
});
test("limited completion stays limited at best and every report keeps at most three advice items",()=>{
 for(const id of ["F13","F16","F22"]){
  const r=api.completeReport(get(id),informative);
  assert.notEqual(r.after.state,"ready");assert(!r.offer.fullPremiumOfferAllowed);
  assert(r.after.advice<=3);assert(r.sections.find(s=>s.id==="compass").blocks.length+r.additions.filter(a=>a.section==="compass").length<=3);
  assert.equal(r.allowCheckout,false);
 }
});
test("insufficient offers completion first, then a free result even if everything is skipped",()=>{
 const before=api.completeReport(get("F24"));
 assert.equal(before.offer.nextStep,"supplement");assert(before.offer.supplementAllowed);
 const after=api.completeReport(get("F24"),{S01:"skip",S02:"skip",S03:"skip",S04:"skip"});
 assert.equal(after.offer.nextStep,"free-result");assert(after.freeResult);
 assert(!after.offer.fullPremiumOfferAllowed&&!after.offer.limitedPurchaseAllowed);
});