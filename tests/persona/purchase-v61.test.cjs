/* eslint-disable @typescript-eslint/no-require-imports -- isolated provider fixtures, no external requests. */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs"),crypto=require("node:crypto");
const createLoader=require("../../app/autism-test/test/test-loader.cjs");
const {createRuntime,root}=require("./runtime.cjs");
const profiles=require("./insights-v2-full-fixtures.cjs"),snapshot=require("../../app/persona/_domain/release-v61/snapshot.cjs");
const overrides={"server-only":{},"./snapshot.cjs":{default:snapshot}};
const load=createLoader(overrides),api=load(path.join(root,"app/persona/_domain/purchase-v61/index.ts"));
const commerce=load(path.join(root,"app/_lib/testAccounts/personaV61Commerce.server.ts"));
const input=p=>({questionVersion:"persona-questions-v3",reportVersion:api.PURCHASE_VERSION,answers:p.answers.slice()});
const enable=()=>{process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="true";};

test("all 24 valid profiles get deterministic, nonempty deliveries without changing evidence or frozen reports",()=>{
  enable();
  try {for(const p of profiles){
    const before=snapshot.completeReport(p.answers),built=api.buildPurchaseReport(input(p));
    assert.deepEqual(built.completion,before,p.id);
    assert.deepEqual(built,api.buildPurchaseReport(input(p)),p.id);
    assert.equal(built.presentation.sections.length,6);
    for(const section of built.presentation.sections){
      assert(section.blocks.length,p.id+" "+section.id);
      assert(section.blocks.every(b=>b.interpretation.trim().length>50),p.id+" "+section.id);
      assert.equal(new Set(section.blocks.map(b=>b.interpretation)).size,section.blocks.length);
    }
    assert.equal(built.evidence.length,5);
    assert(built.evidence.every(d=>d.answers.length===6&&d.low+d.middle+d.high===6));
    const prepared=commerce.prepareV61Checkout(input(p)),opened=commerce.openV61Purchase(prepared.envelope);
    assert.equal(prepared.reportVersion,api.PURCHASE_VERSION);
    assert.deepEqual(opened.presentation,built.presentation);
    assert(!/evidence|counterEvidence|insightAnalysis|ciphertext/.test(JSON.stringify(opened)));
    assert.equal(opened.presentation.sections.find(s=>s.id==="persona").blocks.filter(b=>/Medelvärde:/.test(b.interpretation)).length,5);
  }}finally{delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;}
});

test("128 additional full response patterns remain deliverable without forcing insight matches",()=>{
  enable();let seed=9137;
  try {for(let n=0;n<128;n++){
    const answers=Array.from({length:40},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return 1+seed%5;});
    const value={questionVersion:"persona-questions-v3",reportVersion:api.PURCHASE_VERSION,answers};
    const prepared=commerce.prepareV61Checkout(value),opened=commerce.openV61Purchase(prepared.envelope);
    assert(opened.presentation.sections.every(s=>s.blocks.length&&s.blocks.every(b=>b.interpretation.trim().length>0)));
  }}finally{delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;}
});

test("F21–F24 distinguish mixed from midpoint answers and never invent trait strengths",()=>{
  const results=profiles.slice(20).map(p=>api.buildPurchaseReport(input(p)));
  assert(results[0].evidence.some(d=>d.high&&d.low));
  assert(results[1].evidence.every(d=>d.high&&d.low));
  assert(results[2].evidence.every(d=>d.high&&d.low));
  assert(results[3].evidence.every(d=>d.middle===6));
  assert.match(results[3].teaser.text,/inte från tydliga ytterligheter/);
  assert.match(results[2].teaser.text,/Samma svar på även motriktade/);
  for(const built of results){
    const generated=built.completion.baseReport.insightAnalysis.insights;
    const delivered=built.presentation.sections.find(s=>s.id==="insights");
    if(!generated.length)assert.match(delivered.blocks[0].interpretation,/inte.*stöd|inget stöd|inte tillräckligt/);
    const strengths=built.presentation.sections.find(s=>s.id==="strengths");
    if(!built.completion.baseReport.sections.find(s=>s.id==="strengths").blocks.length)
      assert.match(strengths.blocks[0].interpretation,/inte tillräckligt stöd för att utnämna/);
  }
  const lowO=api.buildPurchaseReport(input(profiles[3])).presentation.sections.find(s=>s.id==="strengths");
  assert(!lowO.blocks.some(b=>/ditt idéintresse/.test(b.interpretation)));
});

test("the actual paid report renderer displays every profile without trace fields or empty sections",()=>{
  const styles={default:new Proxy({},{get:(_,key)=>String(key)})};
  const renderer=createLoader({...overrides,"../report/report.module.css":styles,"./preview.module.css":styles,"./report.module.css":styles});
  const Component=renderer(path.join(root,"app/persona/report/PersonaV61PaidReport.tsx")).default;
  const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
  for(const p of profiles){
    const built=api.buildPurchaseReport(input(p));
    const html=renderToStaticMarkup(React.createElement(Component,{report:{product:"persona_test",reportVersion:api.PURCHASE_VERSION,presentation:built.presentation}}));
    assert.equal((html.match(/<section /g)??[]).length,6,p.id);
    assert(html.includes("Skriv ut eller spara som PDF"));
    assert(!/counterEvidence|insightAnalysis|sourceFingerprint|ciphertext|undefined/.test(html));
    for(const s of built.presentation.sections)assert(html.includes('id="v6-'+s.id+'"'));
  }
});

test("new envelopes reject incomplete input, invalid shape, version confusion and altered delivery proofs",()=>{
  enable();try{
    const valid=input(profiles[0]);
    const cases=[{...valid,answers:valid.answers.slice(1)},{...valid,answers:[...valid.answers,3]},
      ...[0,-1,6,2.5,null,"3"].map(v=>({...valid,answers:valid.answers.map((a,i)=>i===5?v:a)})),
      {...valid,quality:{state:"ready"}},{...valid,reportVersion:"unknown"},{...valid,questionVersion:"old"}];
    for(const value of cases)assert.throws(()=>commerce.prepareV61Checkout(value));
    const envelope=commerce.prepareV61Checkout(valid).envelope;
    assert.throws(()=>commerce.openV61Purchase({...envelope,answers:profiles[23].answers}));
    assert.throws(()=>commerce.openV61Purchase({...envelope,delivery:{...envelope.delivery,digest:"0".repeat(64)}}));
    assert.throws(()=>commerce.openV61Purchase({...envelope,delivery:{...envelope.delivery,version:"unknown"}}));
    assert.throws(()=>commerce.openV61Purchase({...envelope,reportVersion:"persona-report-v61-release1"}));
    assert.throws(()=>commerce.openV61Purchase({...envelope,delivery:undefined}));
  }finally{delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;}
});

test("new public analysis advertises purchase for all 24 full profiles; skipped answers never qualify",async()=>{
  const action=createLoader({...overrides,"next/navigation":{notFound:()=>{throw Error("404");}}})(path.join(root,"app/persona-v61/actions.ts"));
  enable();try{
    for(const p of profiles){
      const result=await action.analyzePersonaV61(input(p));
      assert.equal(result.canPurchase,true,p.id);assert.deepEqual(result.questions,[]);
      assert.equal(result.title,api.buildPurchaseReport(input(p)).teaser.title);
      assert(!/presentation|blocks|evidence|answers|readings/.test(JSON.stringify(result)));
    }
    const skipped=input(profiles[0]);skipped.answers[0]=0;
    const result=await action.analyzePersonaV61(skipped);
    assert.equal(result.canPurchase,false);assert.match(result.text,/1 av 40/);
  }finally{delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;}
});

test("corrected checkout keeps payment, refunds, ownership and account reopening server-verified",async()=>{
  const r=await createRuntime(overrides);enable();
  try {
    for(const p of profiles){
      const receipt=await r.checkout(0,input(p));
      assert.equal(receipt.row.report_version,api.PURCHASE_VERSION);
      assert(!receipt.row.ciphertext.includes("answers"));
      const request={action:"guest",product:"persona_test",id:receipt.id};
      assert.equal((await r.request(request,null,receipt.secret)).status,503);
      r.pay(receipt);
      const paid=await r.request(request,null,receipt.secret);assert.equal(paid.status,200,p.id);
      const payload=await paid.json();assert.equal(payload.answers.length,40);
      assert.deepEqual(payload.result.presentation,JSON.parse(JSON.stringify(api.buildPurchaseReport(input(p)).presentation)));
      const saved=await r.request({action:"save",product:"persona_test",id:receipt.id,
        consent:r.load(path.join(root,"app/_lib/testAccounts/adapter.ts")).consentVersion},r.token,receipt.secret);
      assert.equal(saved.status,200,p.id);
      assert.equal((await r.request({action:"open",product:"persona_test",id:receipt.id},r.otherToken)).status,503);
      const reopened=await r.request({action:"open",product:"persona_test",id:receipt.id},r.token);
      assert.equal(reopened.status,200);assert.deepEqual((await reopened.json()).result,payload.result);
      const intent=r.intents.get(r.sessions.get(receipt.row.session_id).payment_intent);
      intent.latest_charge.refunded=true;intent.latest_charge.amount_refunded=7900;
      assert.equal((await r.request(request,null,receipt.secret)).status,503);
      assert.equal((await r.request({action:"open",product:"persona_test",id:receipt.id},r.token)).status,503);
    }
    const count=r.sessions.size,bad=input(profiles[0]);bad.answers[1]=0;
    assert.equal((await r.request({action:"checkout",product:"persona_test",payload:bad,consent:"test-guest-processing-v1"})).status,503);
    assert.equal(r.sessions.size,count);
  }finally{delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;await r.close();}
});

test("archived V6.1 and V5 implementation bytes remain untouched",()=>{
  for(const file of ["app/persona/_domain/release-v61/snapshot.cjs","app/persona/_domain/v5/report.ts"]){
    const original=require("node:child_process").execFileSync("git",["show","HEAD:"+file],{cwd:root});
    // Git's text representation can differ only by local CRLF checkout conversion.
    const hash=x=>crypto.createHash("sha256").update(x.toString().replace(/\r\n/g,"\n")).digest("hex");
    assert.equal(hash(fs.readFileSync(path.join(root,file))),hash(original));
  }
});
