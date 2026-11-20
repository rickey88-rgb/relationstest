/* eslint-disable @typescript-eslint/no-require-imports -- offline customer-flow verification. */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
const {createRuntime,root,payloadFor}=require("./runtime.cjs");
const snapshot=require("../../app/persona/_domain/release-v61/snapshot.cjs");
const profiles=require("./insights-v2-full-fixtures.cjs");
const createLoader=require("../../app/autism-test/test/test-loader.cjs");
const overrides={"server-only":{},"./snapshot.cjs":{default:snapshot}};
const load=createLoader(overrides);
const input=id=>({questionVersion:"persona-questions-v3",reportVersion:"persona-report-v61-release1",answers:profiles.find(p=>p.id===id).answers.slice()});
const consent="test-guest-processing-v1";
test("V6.1 uses the existing encrypted checkout/account lifecycle without changing V5",async t=>{
  const r=await createRuntime(overrides);
  try{
    process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="true";
    await t.test("capabilities retain V5 and advertise the gated V6.1 version",async()=>{
      const result=await(await r.request({action:"capabilities"})).json();
      const p=result.tests.find(p=>p.product==="persona_test");
      assert.equal(p.reportVersion,"persona-report-v5");assert.deepEqual(p.additionalReportVersions,["persona-report-v61-release1"]);
    });
    await t.test("limited, insufficient, forged and disabled requests never create Stripe sessions",async()=>{
      const size=r.sessions.size;
      for(const id of ["F19","F21","F23","F24"]){
        assert.notEqual(snapshot.completeReport(input(id).answers).after.state,"ready");
        assert.equal((await r.request({action:"checkout",product:"persona_test",payload:input(id),consent})).status,503);
      }
      const forged={...input("F01"),quality:{state:"ready"}};
      assert.equal((await r.request({action:"checkout",product:"persona_test",payload:forged,consent})).status,503);
      process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="false";
      assert.equal((await r.request({action:"checkout",product:"persona_test",payload:input("F01"),consent})).status,503);
      process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="true";
      assert.equal(r.sessions.size,size);
    });
    await t.test("V6.1-only rollout never opens ordinary PERSONA sales",async()=>{
      process.env.TEST_ACCOUNTS_PERSONA_V61_ONLY="true";
      const caps=await(await r.request({action:"capabilities"})).json();
      assert.deepEqual(caps.tests.find(p=>p.product==="persona_test").checkoutReportVersions,["persona-report-v61-release1"]);
      const count=r.sessions.size;
      assert.equal((await r.request({action:"checkout",product:"persona_test",payload:payloadFor(r.load),consent})).status,503);
      await assert.rejects(()=>r.store.createAttempt("persona_test",payloadFor(r.load),"synthetic",r.price,consent));
      assert.equal(r.sessions.size,count);
      delete process.env.TEST_ACCOUNTS_PERSONA_V61_ONLY;
    });
    let purchase,paid;
    await t.test("unpaid and cancelled purchases never expose report content",async()=>{
      purchase=await r.checkout(0,input("F01"));
      assert.equal(purchase.row.report_version,"persona-report-v61-release1");
      assert(!purchase.row.ciphertext.includes("answers"));
      const response=await r.request({action:"guest",product:"persona_test",id:purchase.id},null,purchase.secret);
      assert.equal(response.status,503);assert(!JSON.stringify(await response.json()).includes("presentation"));
      r.sessions.get(purchase.row.session_id).status="expired";
      assert.equal((await r.request({action:"guest",product:"persona_test",id:purchase.id},null,purchase.secret)).status,503);
    });
    await t.test("paid guest receives the frozen six-part report, with no internal evidence fields",async()=>{
      purchase=await r.checkout(0,input("F04"));r.pay(purchase);
      const response=await r.request({action:"guest",product:"persona_test",id:purchase.id},null,purchase.secret);
      assert.equal(response.status,200);paid=await response.json();
      assert.equal(paid.result.reportVersion,"persona-report-v61-release1");
      assert.equal(paid.result.presentation.sections.length,6);
      assert(paid.result.presentation.sections.every(s=>s.blocks.length));
      assert.equal(paid.answers.length,40);
      const projection=r.load(path.join(root,"app/persona/report/v61Presentation.ts"));
      assert.deepEqual(paid.result.presentation,JSON.parse(JSON.stringify(projection.presentCompletion(snapshot.completeReport(input("F04").answers)))));
      assert(!/evidence|counterEvidence|insightAnalysis|sourceFingerprint|ciphertext/.test(JSON.stringify(paid.result)));
      assert(!paid.result.presentation.sections.find(s=>s.id==="strengths").blocks.some(b=>/idéintresse/i.test(b.title)));
    });
    await t.test("possession, owner authorization, saving and reopening preserve exact results",async()=>{
      const guest={action:"guest",product:"persona_test",id:purchase.id};
      assert.equal((await r.request(guest,null,"wrong")).status,503);
      const save={action:"save",product:"persona_test",id:purchase.id,consent:"test-account-consent-v1"};
      const registry=r.load(path.join(root,"app/_lib/testAccounts/adapter.ts"));save.consent=registry.consentVersion;
      assert.equal((await r.request(save,r.token,purchase.secret)).status,200);
      assert.equal((await r.request({action:"open",product:"persona_test",id:purchase.id},r.otherToken)).status,503);
      const opened=await r.request({action:"open",product:"persona_test",id:purchase.id},r.token);
      assert.equal(opened.status,200);assert.deepEqual((await opened.json()).result,paid.result);
      // New-sales rollback must not strand a purchased frozen report.
      process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="false";
      assert.equal((await r.request({action:"open",product:"persona_test",id:purchase.id},r.token)).status,200);
      process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="true";
    });
    await t.test("refund blocks both guest and account premium access",async()=>{
      const intent=r.intents.get(r.sessions.get(purchase.row.session_id).payment_intent);
      intent.latest_charge.refunded=true;intent.latest_charge.amount_refunded=7900;
      assert.equal((await r.request({action:"guest",product:"persona_test",id:purchase.id},null,purchase.secret)).status,503);
      assert.equal((await r.request({action:"open",product:"persona_test",id:purchase.id},r.token)).status,503);
    });
    await t.test("existing V5 checkout, report identity and generator remain unchanged",async()=>{
      const payload=payloadFor(r.load),receipt=await r.checkout(0,payload);r.pay(receipt);
      const response=await r.request({action:"guest",product:"persona_test",id:receipt.id},null,receipt.secret);
      assert.equal(response.status,200);
      const version=r.load(path.join(root,"app/persona/_domain/registry.ts")).resolvePersonaVersion(payload.questionVersion,payload.reportVersion);
      assert.deepEqual((await response.json()).result,JSON.parse(JSON.stringify(version.buildReport(payload))));
    });
  }finally{delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;await r.close();}
});
test("all 24 profiles enforce the frozen quality gate and exact deliverable before Checkout",()=>{
  process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="true";
  const commerce=load(path.join(root,"app/_lib/testAccounts/personaV61Commerce.server.ts"));
  for(const profile of profiles){
    const submitted=input(profile.id),completion=snapshot.completeReport(profile.answers);
    if(completion.after.state==="ready"){
      const prepared=commerce.prepareV61Checkout(submitted);
      const reopened=commerce.openV61Purchase(prepared.envelope);
      assert.equal(reopened.presentation.sections.length,6,profile.id);
      assert(reopened.presentation.sections.every(s=>s.blocks.length),profile.id);
    }else assert.throws(()=>commerce.prepareV61Checkout(submitted),undefined,profile.id);
  }
  delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;
});
test("draft restores all 40 answers and supplements; malformed versions and IDs fail closed",()=>{
  const draft=load(path.join(root,"app/persona-v61/draft.ts"));
  const d={answers:input("F24").answers,cursor:39,phase:"result",supplement:{S01:"context",S02:"writing",S03:"asked",S04:"preserve"}};
  assert.deepEqual(draft.restoreDraft(draft.serializeDraft(d)),d);
  assert.deepEqual(draft.submissionFor(d).supplement.answers,d.supplement);
  for(const raw of [{...d,reportVersion:"old"},{...d,answers:[1]},{...d,supplement:{S05:"forged"}}])
    assert.throws(()=>draft.restoreDraft(JSON.stringify(raw)));
});
test("public server analysis exposes one insight only and never sells limited or insufficient profiles",async()=>{
  process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="true";
  const action=createLoader({...overrides,"next/navigation":{notFound:()=>{throw Error("404");}}})(path.join(root,"app/persona-v61/actions.ts"));
  for(const id of ["F01","F04","F19","F21","F23","F24"]){
    const result=await action.analyzePersonaV61(input(id));
    assert.deepEqual(Object.keys(result).sort(),["description","questions","state","text","title"]);
    assert.equal(result.state,snapshot.completeReport(input(id).answers).after.state);
    assert(result.questions.length<=4);
    assert(result.text.length>30);
    if(result.state!=="ready")assert.match(result.description,/inget|inte|begränsat/i);
  }
  const extra={questionVersion:"persona-supplement-questions-v1",answers:{S01:"context",S02:"writing",S03:"asked",S04:"preserve"}};
  const result=await action.analyzePersonaV61({...input("F24"),supplement:extra});
  assert.notEqual(result.state,"ready");
  delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;
  await assert.rejects(()=>action.analyzePersonaV61(input("F01")));
});

test("the unlinked entry defaults to 404 and does not load a report without its release flag",()=>{
 const Page=createLoader({"next/navigation":{notFound:()=>{throw Error("404");}},"./PersonaV61Flow":{default:()=>null}})(path.join(root,"app/persona-v61/page.tsx")).default;
 delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;assert.throws(()=>Page(),/404/);
 process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="true";assert.doesNotThrow(()=>Page());
 delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;
});

test("V6.1-only production publication leaves the ordinary entry closed without removing its report reader",()=>{
 const Layout=createLoader({"next/navigation":{notFound:()=>{throw Error("404");}},"./_components/PersonaShell":{default:()=>null}})(path.join(root,"app/persona/layout.tsx")).default;
 const node=process.env.NODE_ENV,only=process.env.TEST_ACCOUNTS_PERSONA_V61_ONLY;
 try {process.env.NODE_ENV="production";process.env.TEST_ACCOUNTS_PERSONA_V61_ONLY="true";assert.throws(()=>Layout({children:null}),/404/);process.env.TEST_ACCOUNTS_PERSONA_V61_ONLY="false";assert.doesNotThrow(()=>Layout({children:null}));}
 finally {if(node===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=node;if(only===undefined)delete process.env.TEST_ACCOUNTS_PERSONA_V61_ONLY;else process.env.TEST_ACCOUNTS_PERSONA_V61_ONLY=only;}
});
