/* eslint-disable @typescript-eslint/no-require-imports -- no provider calls: synthetic Stripe/Auth/Resend and real encrypted PostgreSQL flow. */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
const {createRuntime,payloadFor,root}=require("./runtime.cjs");
test("PERSONA isolated purchase, access, accounts, recovery and revocation",async t=>{
  const r=await createRuntime();
  try {
    let receipt,paidResult;
    await t.test("flags default closed and the old product set remains unchanged",async()=>{
      const registry=r.load(path.join(root,"app/_lib/testAccounts/adapter.ts"));
      process.env.TEST_ACCOUNTS_PERSONA_ENABLED="false";
      assert.equal(registry.registeredAdapters().length,15);assert.equal(registry.flags("persona_test").checkout,false);
      assert.equal((await r.request({action:"checkout",product:"persona_test",payload:payloadFor(r.load),consent:"test-guest-processing-v1"})).status,503);
      process.env.TEST_ACCOUNTS_PERSONA_ENABLED="true";assert.equal(registry.registeredAdapters().length,16);
    });
    await t.test("reject forged versions, adaptive IDs, missing/low-quality answers, wrong price, consent and origin",async()=>{
      const input=payloadFor(r.load),body={action:"checkout",product:"persona_test",payload:input,consent:"test-guest-processing-v1"};
      for(const payload of [{...input,paid:true},{...input,questionVersion:"forged"},{...input,answers:input.answers.slice(0,39)},{...input,answers:Array(40).fill(0)},{...input,adaptiveIds:["A01"]}])
        assert.equal((await r.request({...body,payload})).status,503);
      assert.equal((await r.request({...body,consent:""})).status,400);
      assert.equal((await r.request(body,null,null,"https://other.example.invalid")).status,403);
      r.setPrice(3900);assert.equal((await r.request(body)).status,503);r.setPrice(7900);
      r.setJournalOffline(true);assert.equal((await r.request(body)).status,503);r.setJournalOffline(false);
    });
    await t.test("open/aborted checkout never unlocks and answers are encrypted",async()=>{
      receipt=await r.checkout();assert.equal(new URL(receipt.url).origin,"https://checkout.stripe.com");
      assert(!receipt.row.ciphertext.includes('"answers"'));
      const response=await r.request({action:"guest",product:"persona_test",id:receipt.id},null,receipt.secret);
      assert.equal(response.status,503);assert(!JSON.stringify(await response.json()).includes("sections"));
      r.sessions.get(receipt.row.session_id).status="expired";
      assert.equal((await r.request({action:"guest",product:"persona_test",id:receipt.id},null,receipt.secret)).status,503);
    });
    await t.test("paid reopening returns the exact V5 report and fixed answer wording",async()=>{
      receipt=await r.checkout();r.pay(receipt);
      const response=await r.request({action:"guest",product:"persona_test",id:receipt.id},null,receipt.secret);
      assert.equal(response.status,200);assert.match(response.headers.get("cache-control"),/no-store/);paidResult=await response.json();
      const model=r.load(path.join(root,"app/_lib/testAccounts/adapter.ts")).adapter("persona_test");
      assert.deepEqual(paidResult.result,model.calculate(payloadFor(r.load).answers));assert(paidResult.result.sections.length >= 5 && paidResult.result.sections.length <= 6);
      assert.equal(paidResult.answers.length,40);
      assert.equal(paidResult.answers[30].questionId,"Q31");
      assert.equal(paidResult.answers[30].answer,"Stämmer helt");
      assert.equal((await r.request({action:"guest",product:"persona_test",id:receipt.id},null,"z".repeat(43))).status,503);
      assert.equal((await r.request({action:"guest",product:"adhd_test",id:receipt.id},null,receipt.secret)).status,503);
      assert.equal((await r.request({action:"open",product:"persona_test",id:receipt.id})).status,401);
      process.env.TEST_ACCOUNTS_PERSONA_READ_ENABLED="false";
      const service=r.load(path.join(root,"app/_lib/testAccounts/service.server.ts"));
      await assert.rejects(service.guestForProduct(receipt.id,receipt.secret,"persona_test"),/Feature disabled/);
      process.env.TEST_ACCOUNTS_PERSONA_READ_ENABLED="true";
    });
    await t.test("verified email recovery rotates possession, is single-use and sends no psychological data",async()=>{
      await r.recovery.indexGuestRecovery(receipt.row.session_id);
      await r.recovery.requestGuestRecovery("unknown@example.invalid");assert.equal(r.outbox.length,0);
      await r.recovery.requestGuestRecovery("buyer@example.invalid");assert.equal(r.outbox.length,1);
      const token=r.outbox[0].text.match(/#recover\?token=([A-Za-z0-9_-]{43})/)[1];
      const restored=await r.recovery.redeemGuestRecovery(token);await assert.rejects(r.recovery.redeemGuestRecovery(token));
      assert.equal((await r.request({action:"guest",product:"persona_test",id:receipt.id},null,receipt.secret)).status,503);
      receipt.secret=restored.secret;
      assert.equal((await r.request({action:"guest",product:"persona_test",id:receipt.id},null,receipt.secret)).status,200);
    });
    await t.test("account saving requires explicit consent, validated Auth and purchase possession; wrong owner denied",async()=>{
      const body={action:"save",product:"persona_test",id:receipt.id,consent:"test-account-storage-v1"};
      assert.equal((await r.request(body,null,receipt.secret)).status,401);
      assert.equal((await r.request({...body,consent:""},r.token,receipt.secret)).status,503);
      assert.equal((await r.request(body,r.token,"x".repeat(43))).status,503);
      assert.equal((await r.request(body,r.token,receipt.secret)).status,200);
      assert.equal((await r.request({action:"open",product:"persona_test",id:receipt.id},r.otherToken)).status,503);
      assert.deepEqual((await (await r.request({action:"open",product:"persona_test",id:receipt.id},r.token)).json()).result,paidResult.result);
      assert.equal((await (await r.request({action:"list"},r.token)).json()).purchases.length,1);
      assert.equal((await r.request(body,r.otherToken,receipt.secret)).status,503,"same email cannot take ownership");
    });
    await t.test("partial refunds deny guest and account access and erase the saved analysis",async()=>{
      const session=r.sessions.get(receipt.row.session_id);r.intents.get(session.payment_intent).latest_charge.amount_refunded=1;
      assert.equal((await r.request({action:"guest",product:"persona_test",id:receipt.id},null,receipt.secret)).status,503);
      assert.equal((await r.request({action:"open",product:"persona_test",id:receipt.id},r.token)).status,503);
      assert.equal(await r.store.owned(receipt.id,r.owner),null);
      assert.equal((await r.store.list(r.owner)).length,1,"purchase history retained");
    });
    await t.test("payment mode, charge/refund changes and journal outage fail closed on every reopening",async()=>{
      const current=await r.checkout(1);r.pay(current);const session=r.sessions.get(current.row.session_id),intent=r.intents.get(session.payment_intent);
      for(const mutation of [{payment_status:"unpaid"},{amount_total:1},{livemode:false},{client_reference_id:"ta:forged"}]) {
        const before={...session};Object.assign(session,mutation);
        assert.equal((await r.request({action:"guest",product:"persona_test",id:current.id},null,current.secret)).status,503);Object.assign(session,before);
      }
      intent.latest_charge.disputed=true;assert.equal((await r.request({action:"guest",product:"persona_test",id:current.id},null,current.secret)).status,503);intent.latest_charge.disputed=false;
      r.setJournalOffline(true);assert.equal((await r.request({action:"guest",product:"persona_test",id:current.id},null,current.secret)).status,503);r.setJournalOffline(false);
      intent.latest_charge.refunded=true;assert.equal((await r.request({action:"guest",product:"persona_test",id:current.id},null,current.secret)).status,503);
    });
    await t.test("sealed V2, V3 and V4 checkouts retain their reports after V5",async()=>{
      const old=r.load(path.join(root,"app/persona/_domain/v2/index.ts"));
      const {profiles,fixed}=require("../../app/persona/_domain/tests/v2-fixtures.cjs");
      const profile=profiles[0],first=fixed(profile);
      const input={questionVersion:old.VERSIONS.question,reportVersion:old.VERSIONS.report,
        answers:[...first,...old.selectAdaptive(first).selectedIds.map(id=>"ABCD".indexOf(profile.followups[id]))]};
      const model=r.load(path.join(root,"app/_lib/testAccounts/adapter.ts")).adapter("persona_test");
      const current={...model};
      const v3={...payloadFor(r.load),reportVersion:"persona-report-v3"};
      const registry=r.load(path.join(root,"app/persona/_domain/registry.ts"));
      for (const legacy of [input,v3,{...v3,reportVersion:"persona-report-v4"}]) {
        const archived=registry.resolvePersonaVersion(legacy.questionVersion,legacy.reportVersion);
        let historical;
        try {
          Object.assign(model,{questionVersion:legacy.questionVersion,reportVersion:legacy.reportVersion,parse:value=>archived.parseSubmission(value).answers});
          historical=await r.checkout(0,legacy);
        } finally { Object.assign(model,current); }
        r.pay(historical);
        const response=await r.request({action:"guest",product:"persona_test",id:historical.id},null,historical.secret);
        assert.equal(response.status,200);
        const data=await response.json();
        assert.deepEqual(data.result,archived.buildReport(legacy));
        assert.deepEqual(data.answers,archived.describeAnswers(legacy));
      }
    });
    await t.test("signed direct webhooks are handled without forwarding to production; invalid signatures rejected",async()=>{
      const current=await r.checkout(2);r.pay(current);
      const event=JSON.stringify({id:"evt_synthetic",object:"event",type:"checkout.session.completed",data:{object:r.sessions.get(current.row.session_id)}});
      const signature=r.webhookSdk.webhooks.generateTestHeaderString({payload:event,secret:r.webhookSecret});
      const send=sig=>r.handler(new Request("https://persona-fixture.supabase.co/functions/v1/customer-tests/stripe-webhook",{method:"POST",headers:{"stripe-signature":sig},body:event}));
      assert.equal((await send("invalid")).status,400);assert.equal((await send(signature)).status,200);
      assert.equal((await send(signature)).status,200,"duplicate delivery is idempotent");
    });
  } finally {await r.close();}
});
