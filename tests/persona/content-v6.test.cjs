/* eslint-disable @typescript-eslint/no-require-imports -- isolated report quality and compatibility checks */
const assert = require("node:assert/strict"), test = require("node:test");
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const root = path.resolve(__dirname,"../.."), createLoader = require("../../app/autism-test/test/test-loader.cjs");
const load = createLoader(), v6 = load(path.join(root,"app/persona/_domain/v6/index.ts"));
const { analyzeInsights } = load(path.join(root,"app/persona/_domain/insights-v1/index.ts"));
const { scoreDimensions } = load(path.join(root,"app/persona/_domain/v3/score.ts"));
const { presentInsight } = load(path.join(root,"app/persona/_domain/v6/insight-copy.ts"));
const { coreQuestions, questions } = load(path.join(root,"app/persona/_domain/v3/questions.ts"));
const profiles = require("./insights-v2-full-fixtures.cjs");
const input = answers => ({ answers, questionVersion: v6.VERSIONS.question, reportVersion: v6.VERSIONS.report });
const get = (r,id) => r.sections.find(s=>s.id===id);
const prose = r => r.sections.flatMap(s=>s.blocks.flatMap(b=>[b.observation,b.interpretation,b.example].filter(Boolean)));

test("24 reports preserve scores, selected insights, raw evidence and deterministic immutable results", () => {
  const texts = new Set();
  for(const p of profiles) {
    const submitted=input(p.answers), snapshot=JSON.stringify(submitted), r=v6.buildReport(submitted);
    assert.deepEqual(r,v6.buildReport(input([...p.answers])));
    assert.equal(JSON.stringify(submitted),snapshot);
    assert(Object.isFrozen(r) && Object.isFrozen(r.sections));
    assert.deepEqual(r.dimensions,scoreDimensions(p.answers));
    assert.deepEqual(r.insightAnalysis,analyzeInsights(p.answers));
    assert.deepEqual(r.sections.map(s=>s.title),Object.values(v6.SECTION_TITLES));
    assert.equal(r.sections.length,6);
    assert(r.experimental && r.reportVersion==="persona-report-v6");
    assert.equal(get(r,"insights").blocks.length,r.insightAnalysis.insights.length);
    assert(get(r,"compass").blocks.length<=3);
    for(const s of r.sections) {
      assert(s.blocks.length || s.note,s.id);
      for(const b of s.blocks) {
        assert(b.interpretation.trim() && b.title.trim());
        for(const e of [...b.evidence,...b.counterEvidence,...(b.contextEvidence??[])]) assert.equal(p.answers[Number(e.questionId.slice(1))-1],e.answer);
        if(b.source==="insight") {
          const original=r.insightAnalysis.insights.find(i=>i.id===b.insightId);
          assert(original);
          if(s.id==="insights") {
            const copy=presentInsight(original.id,r.readings);
            assert.equal(b.observation,copy.observation);
            assert.equal(b.interpretation,copy.interpretation);
            assert.equal(b.example,copy.everyday);
            assert.deepEqual(b.evidence,original.evidence);
            assert(original.nuanceEvidence.every(e=>b.contextEvidence.some(c=>c.questionId===e.questionId&&c.answer===e.answer)));
          }
        }
      }
    }
    texts.add(v6.renderMarkdown(r));
  }
  assert.equal(texts.size,24);
});

test("strong readings require multiple converging keyed items and archetypes require full consistent pairs", () => {
  for(const p of profiles) {
    const r=v6.buildReport(input(p.answers));
    for(const reading of r.readings.filter(x=>["high","low"].includes(x.direction))) {
      assert(reading.score.valid>=4 && reading.support.length>=4);
      assert(reading.counter.length<=1 && reading.support.length-reading.counter.length>=3);
      const mean=reading.score.raw/reading.score.valid;
      assert(reading.direction==="high"?mean>3.5:mean<2.5);
      for(const e of reading.support) {
        const q=coreQuestions.find(q=>q.id===e.questionId), coded=q.reverse?6-e.answer:e.answer;
        assert(reading.direction==="high"?coded>=4:coded<=2);
      }
    }
    if(r.archetype) {
      assert(r.archetype.evidence.length>=8);
      const dims=new Set(r.archetype.evidence.map(e=>coreQuestions.find(q=>q.id===e.questionId).dimension));
      assert(dims.size>=2);
      for(const d of dims) {
        const reading=r.readings.find(x=>x.dimension===d);
        assert.equal(reading.score.valid,6);
        assert.equal(reading.counter.length,0);
      }
    }
  }
});

test("neutral, polarized, absent and low profiles never manufacture traits or engine insights", () => {
  const neutral=v6.buildReport(input(Array(40).fill(3)));
  assert.equal(neutral.archetype,null);
  assert.equal(get(neutral,"insights").blocks.length,0);
  assert.equal(get(neutral,"strengths").blocks.length,0);
  assert.equal(get(neutral,"compass").blocks.length,0);
  assert(neutral.readings.every(r=>r.direction==="middle"));
  const polarized=v6.buildReport(input(Array(40).fill(5)));
  assert.equal(polarized.archetype,null);
  assert.equal(polarized.quality.variedDimensions.length,5);
  assert(polarized.readings.every(r=>r.direction==="mixed"));
  assert.equal(get(polarized,"strengths").blocks.length,0);
  assert.match(get(polarized,"insights").note,/motriktade/);
  const missing=v6.buildReport(input(Array(40).fill(0)));
  assert(!missing.quality.eligible && missing.quality.skipped===40);
  assert.equal(get(missing,"compass").blocks.length,0);
  const low=v6.buildReport(input(profiles.find(p=>p.id==="F19").answers));
  assert.equal(get(low,"insights").blocks.length,0);
  assert.equal(low.sections.length,6);
  assert(!get(low,"blindSpots").blocks.some(b=>["blind-A","blind-C"].includes(b.id)));
  assert(get(low,"strengths").blocks.length>=2);
});

test("editorial advice preserves engine identity and evidence, followed by distinct dimension opportunities", () => {
  for(const p of profiles) {
    const r=v6.buildReport(input(p.answers)), compass=get(r,"compass").blocks;
    const engine=r.insightAnalysis.advice;
    assert(compass.length<=3 && compass.length>=engine.length);
    assert.equal(new Set(compass.map(b=>b.theme)).size,compass.length);
    engine.forEach((a,i)=>{
      const copy=presentInsight(a.insightId,r.readings);
      assert.equal(compass[i].interpretation,copy.advice);
      assert.equal(compass[i].adviceReason,copy.reason);
      assert.equal(compass[i].insightId,a.insightId);
      assert.deepEqual(compass[i].evidence,a.evidence);
    });
    for(const b of compass.filter(b=>b.source==="dimension")) {
      assert(b.evidence.length>=4);
      const dimension=coreQuestions.find(q=>q.id===b.evidence[0].questionId).dimension;
      assert(["high","low"].includes(r.readings.find(x=>x.dimension===dimension).direction));
      assert(!engine.some(a=>a.evidence.some(e=>coreQuestions.find(q=>q.id===e.questionId)?.dimension===dimension)));
    }
  }
});

test("sections do not copy paragraphs, quote items or duplicate selected relational insights", () => {
  for(const p of profiles) {
    const r=v6.buildReport(input(p.answers)), texts=prose(r);
    assert(!/\bQ\d{2}\b|budskapsgrupp|stödindikator/.test(v6.renderMarkdown(r)));
    for(const s of r.sections) {
      for(const limit of new Set(s.blocks.flatMap(b=>b.limitations))) {
        assert(v6.renderMarkdown(r).split("*"+limit+"*").length<=2,limit);
      }
    }
    assert.equal(new Set(texts).size,texts.length,p.id);
    const themes=r.sections.flatMap(s=>s.blocks.map(b=>b.theme));
    assert.equal(new Set(themes).size,themes.length);
    for(const text of texts)for(const q of questions)assert(!text.includes(q.prompt),q.id);
    const selected=r.insightAnalysis.insights.map(i=>i.id), rel=get(r,"relationships").blocks.map(b=>b.id);
    if(selected.includes("empathy-with-slow-trust"))assert(!rel.includes("relation-trust-pace"));
    if(selected.some(id=>["care-with-unwanted-yes","opinion-before-commitment"].includes(id)))assert(!rel.includes("relation-voice-and-boundaries"));
    if(selected.includes("cooperation-with-own-voice"))assert(!rel.includes("relation-voice-and-tone"));
    for(const id of ["F01","F03","F06"])assert(get(r,"strengths").blocks.length>=2 || p.id!==id);
  }
});

test("V5 files, question bank, scoring and all 24 V5 outputs remain unchanged after V6 use", () => {
  const pinned={"app/persona/_domain/v3/questions.ts":"4A2EBFD45143C7A3D4E3C2203CB165A64AA5091C9A2A929351BC6DB95EA39535","app/persona/_domain/v3/score.ts":"6E4D2E42B1A5CDE72F04943B70D4B22587920788A78311C976AB20D495E9568F","app/persona/_domain/v5/comparison.ts":"B1A070F9E25092A8EF7739466BF0AD30001B5468568DEE4CF83236E651481722","app/persona/_domain/v5/submission.ts":"E723C39D3F389CEC2E2B3CEA96EB11709201EFDA3D235B52FEEBDAD71F96EDDF","app/persona/_domain/v5/report.ts":"028524C987351703257CD7D346479ECFBE7FA2063BAA4FF5310D57CBAE787D62","app/persona/_domain/v5/manifest.ts":"6481AFA03EDFC641826FA6913464253F42F762DA13F1FF5BF2957AA0351BC493"};
  for(const [file,expected]of Object.entries(pinned))assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(root,file))).digest("hex").toUpperCase(),expected,file);
  const v5=load(path.join(root,"app/persona/_domain/v5/report.ts"));
  for(const p of profiles) {
    const old={...input(p.answers),reportVersion:"persona-report-v5"}, before=v5.buildReport(old);
    v6.buildReport(input(p.answers));
    assert.deepEqual(v5.buildReport(old),before);
    assert.equal(before.reportVersion,"persona-report-v5");
  }
});

test("V6 rejects forged inputs and cannot be reached from the active registry or public question flow", () => {
  const good=input(profiles[0].answers);
  for(const value of [null,{},[],{...good,reportVersion:"persona-report-v5"},{...good,questionVersion:"forged"},{...good,paid:true},{...good,answers:Array(39).fill(4)}])assert.throws(()=>v6.buildReport(value));
  for(const bad of [null,undefined,6,-1,NaN,1.5,"4"]) { const a=[...good.answers];a[0]=bad;assert.throws(()=>v6.buildReport(input(a))); }
  const registry=load(path.join(root,"app/persona/_domain/index.ts"));
  assert.throws(()=>registry.buildPersonaReport(good));
  for(const file of ["app/persona/_domain/index.ts","app/persona/_domain/registry.ts","app/persona/test/actions.ts","app/persona/dev-report/actions.ts","app/_lib/testAccounts/adapters/persona.ts","app/persona/test/state.ts"])assert(!fs.readFileSync(path.join(root,file),"utf8").includes("/v6"),file);
  for(const file of fs.readdirSync(path.join(root,"app/persona/_domain/v6"))) {
    const source=fs.readFileSync(path.join(root,"app/persona/_domain/v6",file),"utf8");
    assert(!/process\.env|Date\.now|Math\.random|\bfetch\s*\(/.test(source),file);
  }
});
