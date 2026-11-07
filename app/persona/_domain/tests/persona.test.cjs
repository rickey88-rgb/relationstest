/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const createLoader = require("../../../autism-test/test/test-loader.cjs");
const load = createLoader();
const domain = path.resolve(__dirname, "..");
const api = load(path.join(domain, "v1/index.ts"));
const { narrativeRules } = load(path.join(domain, "v1/findings.ts"));
const { adaptiveRules } = load(path.join(domain, "v1/adaptive.ts"));
const { observations } = load(path.join(domain, "v1/copy.ts"));
const { profiles, fixed, submission, ratingIds } = require("./fixtures.cjs");
const base = () => fixed(profiles[0]);
const complete = (answers, followups = Array(6).fill(0)) => ({ questionVersion: api.VERSIONS.question, reportVersion: api.VERSIONS.report, answers: [...answers, ...followups] });
function audit(report, input) {
  const reconstructed = api.describeAnswers(input);
  const answers = new Map(reconstructed.map(item => [item.questionId, item.value]));
  const findings = new Map(report.findings.map(f => [f.id, f]));
  assert.equal(findings.size, report.findings.length);
  const paragraphIds = new Set();
  for (const finding of report.findings) {
    assert(finding.evidence.length > 0);
    for (const evidence of [...finding.evidence, ...finding.counterEvidence]) {
      assert.equal(answers.get(evidence.questionId), evidence.answer);
      assert.notEqual(evidence.answer, api.UNKNOWN);
    }
    if (finding.kind === "pattern") {
      assert(new Set(finding.evidence.map(e => e.questionId)).size >= 3);
      assert(finding.evidence.filter(e => e.questionId.startsWith("P")).length >= 2);
    }
  }
  for (const section of report.sections) {
    assert(section.paragraphs.length > 0);
    for (const paragraph of section.paragraphs) {
      assert(!paragraphIds.has(paragraph.id)); paragraphIds.add(paragraph.id);
      assert(paragraph.text.length > 0);
      if (paragraph.scope !== "method") assert(paragraph.findingIds.length > 0);
      for (const id of paragraph.findingIds) assert(findings.has(id), id);
    }
  }
  assert(report.preview.findingIds.length <= 1, "only one free insight");
  for (const id of report.preview.findingIds) assert(findings.has(id));
  for (const id of report.selection.selectedIds) {
    if (answers.get(id) === api.UNKNOWN) continue;
    assert(report.sections.some(s => s.paragraphs.some(p => p.findingIds.includes(`obs:${id}:${answers.get(id)}`))), `${id} must affect visible report`);
  }
}

test("bank: approved counts, chapter progression, metadata, unique IDs and complete option copy", () => {
  assert.equal(api.fixedQuestions.length, 34); assert.equal(api.adaptiveQuestions.length, 18);
  assert.equal(api.questionBank.length, 52);
  assert.deepEqual([1,2,3].map(ch => api.fixedQuestions.filter(q => q.chapter === ch).length), [10,12,12]);
  assert.deepEqual(api.fixedQuestions.map(q => q.id), Array.from({length:34},(_,i)=>`P${String(i+1).padStart(2,"0")}`));
  assert.equal(new Set(api.questionBank.map(q => q.id)).size, 52);
  assert.equal(api.fixedQuestions.filter(q=>q.kind==="rating").length,15);
  assert.equal(api.fixedQuestions.filter(q=>q.kind==="scenario").length + 6,25);
  for (const q of api.questionBank) {
    assert(q.prompt.length > 20); assert(q.title && q.purpose && q.supports.length);
    assert.equal(q.source,"persona-original");
    assert.equal(q.options.length, q.kind === "rating" ? 5 : 4);
    assert.equal(new Set(q.options).size, q.options.length);
    if (q.kind === "scenario") assert.equal(observations[q.id].length, 4);
  }
  assert.equal(adaptiveRules.length, 18);
  assert.throws(()=>api.getQuestion("P99"));
});

for (const profile of profiles) test(`approved regression: ${profile.name}`, () => {
  const input = submission(api,profile);
  const selected = api.selectAdaptive(fixed(profile));
  assert.deepEqual(selected.selectedIds,profile.selected);
  const report = api.buildPersonaReport(input);
  assert.deepEqual(report.dimensions.map(d=>d.raw),profile.raw);
  for (const rule of profile.required) assert(report.findings.some(f=>f.ruleId===rule),rule);
  assert(report.quality.eligible);
  assert.equal(new Set(selected.selectedIds.map(id=>api.getQuestion(id).theme)).size, profile === profiles[2] ? 4 : 5);
  audit(report,input);
  assert.deepEqual(report,api.buildPersonaReport(JSON.parse(JSON.stringify(input))));
  assert.equal(report.sections.length,8);
});

test("selection scores: all approved triggers, 0/2/8, including unknown P32", () => {
  for (const rule of adaptiveRules) {
    for (const mask of [0,1,2,3]) {
      const answers = Array(34).fill(5);
      rule.conditions.forEach((c,i)=>{if(mask & (1<<i)) answers[Number(c.questionId.slice(1))-1] = c.answers[0];});
      const candidate = api.selectAdaptive(answers).candidates.find(c=>c.id===rule.id);
      assert.equal(candidate.score,mask===3?8:mask?2:0,rule.id);
      assert.equal(candidate.evidence.length,mask===3?2:mask?1:0);
    }
  }
  const answers = Array(34).fill(5); answers[7]=1; // P08 B, P32 unknown must not satisfy >=3
  assert.equal(api.selectAdaptive(answers).candidates.find(c=>c.id==="A16").score,2);
});

// Independent bit-mask oracle, rather than a copy of the selector's recursive search.
function oracle(candidates) {
  let bestScore=-1,bestKey=null;
  for(let mask=0; mask < (1<<18); mask++) {
    let bits=mask, count=0; while(bits){bits&=bits-1;count++;}
    if(count!==6)continue;
    const selected=candidates.filter((_,i)=>mask&(1<<i));
    const themes=new Map(); for(const q of selected)themes.set(q.theme,(themes.get(q.theme)||0)+1);
    if(themes.size<4 || [...themes.values()].some(n=>n>2))continue;
    const score=selected.reduce((sum,q)=>sum+q.score,0),key=selected.map(q=>q.id).join(",");
    if(score>bestScore || score===bestScore&&key<bestKey){bestScore=score;bestKey=key;}
  }
  return {score:bestScore,key:bestKey};
}
let seed=8121;
const random = max => {seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed>>>16)%max;};
const randomFixed = () => api.fixedQuestions.map(q => {const r=random(q.options.length+1);return r===q.options.length?5:r;});
test("selection: globally optimal sets, constraints, order, ties and repeatability", () => {
  for (const values of [Array(34).fill(5),base(),...Array.from({length:8},randomFixed)]) {
    const selected=api.selectAdaptive(values), expected=oracle(selected.candidates);
    assert.equal(selected.totalScore,expected.score);
    assert.equal([...selected.selectedIds].sort().join(","),expected.key);
    assert.deepEqual(selected,api.selectAdaptive([...values]));
    const candidates=new Map(selected.candidates.map(c=>[c.id,c]));
    for(let i=1;i<6;i++) {
      const a=candidates.get(selected.selectedIds[i-1]),b=candidates.get(selected.selectedIds[i]);
      assert(a.score>b.score || a.score===b.score&&a.id<b.id);
    }
  }
  const empty=api.selectAdaptive(Array(34).fill(5));
  assert.equal(empty.totalScore,0); assert(empty.candidates.every(c=>c.reason==="fallback"&&c.evidence.length===0));
});

test("dimensions: every rating, reverse coding, all boundaries and missingness", () => {
  for(const q of api.fixedQuestions.filter(q=>q.kind==="rating")) {
    for(let raw=0;raw<=4;raw++) {
      const values=Array(34).fill(5); values[Number(q.id.slice(1))-1]=raw;
      const d=api.scoreDimensions(values).find(d=>d.dimension===q.dimension);
      assert.equal(d.raw,q.reverse?4-raw:raw); assert.equal(d.valid,1);
      assert.equal(d.value,null); assert.equal(d.level,"insufficient");
    }
  }
  for(let a=0;a<5;a++)for(let b=0;b<5;b++)for(let c=0;c<5;c++) {
    const values=Array(34).fill(5); values[0]=a;values[8]=4-b;values[24]=c;
    const d=api.scoreDimensions(values)[0],raw=a+b+c;
    assert.equal(d.raw,raw); assert.equal(d.level,raw<=4?"lower":raw>=8?"higher":"middle");
    assert.equal(d.varied,Math.max(a,b,c)-Math.min(a,b,c)>=3);
  }
  const two=Array(34).fill(5);two[0]=4;two[8]=0;
  assert.equal(api.scoreDimensions(two)[0].level,"limited");
  assert.equal(api.scoreDimensions(two)[0].value,100);
});

test("dimensions: scenarios and all adaptive responses are excluded", () => {
  const values=base(),before=api.scoreDimensions(values);
  api.fixedQuestions.forEach((q,i)=>{if(q.kind==="scenario")values[i]=(values[i]+1)%4;});
  assert.deepEqual(before,api.scoreDimensions(values));
  assert.deepEqual(api.buildPersonaReport(complete(base(),Array(6).fill(0))).dimensions,
    api.buildPersonaReport(complete(base(),Array(6).fill(3))).dimensions);
});

test("strict boundary: bad types, holes, counts, options, version and forged fields", () => {
  const input=complete(base());
  for(const bad of [null,[],{}, {...input,questionVersion:"persona-questions-v2"}, {...input,reportVersion:"v0"},
    {...input,selectedIds:["A18"]},{...input,unlocked:true},{...input,result:{}},
    {...input,answers:input.answers.slice(1)}, {...input,answers:[...input.answers,0]}]) assert.throws(()=>api.parseSubmission(bad));
  for(const index of [0,1,33,34,39])for(const invalid of [-1,6,NaN,Infinity,"1",null,undefined,1.5,true]) {
    const answers=[...input.answers];answers[index]=invalid;
    assert.throws(()=>api.parseSubmission({...input,answers}));
  }
  const scenarioFour=[...input.answers];scenarioFour[1]=4;
  assert.throws(()=>api.parseSubmission({...input,answers:scenarioFour}));
  const adaptiveFour=[...input.answers];adaptiveFour[34]=4;
  assert.throws(()=>api.parseSubmission({...input,answers:adaptiveFour}));
  const sparse=[...input.answers];delete sparse[2];
  assert.throws(()=>api.parseSubmission({...input,answers:sparse}));
  assert.throws(()=>api.selectAdaptive(Array(33).fill(0)));
  assert.throws(()=>api.selectAdaptive(Array(34)));
});

test("unknown is separate from midpoint; exact eligibility boundaries", () => {
  const unknown=complete(Array(34).fill(5),Array(6).fill(5));
  const empty=api.buildPersonaReport(unknown);
  assert.equal(empty.findings.length,0);assert.equal(empty.quality.eligible,false);
  assert.equal(empty.quality.unknownCount,40);assert.equal(empty.preview.findingIds.length,0);
  assert(empty.sections.flatMap(s=>s.paragraphs).every(p=>p.scope==="method"));
  const midpoint=base();ratingIds.flat().forEach(id=>{midpoint[id-1]=2;});
  assert(api.scoreDimensions(midpoint).every(d=>d.level==="middle"&&d.valid===3));
  const values=Array(34).fill(5);
  ratingIds.slice(0,4).forEach(ids=>ids.slice(0,2).forEach(id=>{values[id-1]=2;}));
  const scenarios=api.fixedQuestions.map((q,i)=>({q,i})).filter(x=>x.q.kind==="scenario");
  scenarios.slice(0,9).forEach(({i})=>{values[i]=0;});
  assert.equal(api.buildPersonaReport(complete(values)).quality.eligible,false);
  values[scenarios[9].i]=0;
  assert.equal(api.buildPersonaReport(complete(values)).quality.eligible,true);
  values[0]=5;
  assert.equal(api.buildPersonaReport(complete(values)).quality.eligible,false);
});

test("each narrative rule needs its documented evidence and cannot infer an unknown", () => {
  for(const rule of narrativeRules) {
    const values=Array(34).fill(5);
    const adaptiveNeeded=rule.conditions.filter(c=>c.questionId.startsWith("A"));
    // Pure finding evaluation lets us test every editorial rule, including adaptive combinations,
    // without claiming those combinations are selectable for an arbitrary fixture.
    const ids=adaptiveNeeded.map(c=>c.questionId);
    rule.conditions.forEach(c=>{if(c.questionId.startsWith("P"))values[Number(c.questionId.slice(1))-1]=c.answers[0];});
    const all=[...values,...adaptiveNeeded.map(c=>c.answers[0])];
    const {deriveFindings}=load(path.join(domain,"v1/findings.ts"));
    const found=deriveFindings(all,ids,api.scoreDimensions(values)).find(f=>f.ruleId===rule.id);
    assert(found,rule.id);
    const min=rule.minimum||rule.conditions.length;
    for(let i=0;i<rule.conditions.length;i++) {
      const changed=[...all], condition=rule.conditions[i];
      const index=condition.questionId.startsWith("P")?Number(condition.questionId.slice(1))-1:34+ids.indexOf(condition.questionId);
      changed[index]=5;
      const result=deriveFindings(changed,ids,api.scoreDimensions(changed.slice(0,34))).find(f=>f.ruleId===rule.id);
      if(rule.conditions.length===min)assert.equal(result,undefined,rule.id);
    }
  }
});

test("full answer coverage: every selected adaptive answer changes visible content", () => {
  const seen=new Set();
  for(let attempt=0;attempt<200 && seen.size<18;attempt++) {
    const values=randomFixed(),selected=api.selectAdaptive(values);
    for(let i=0;i<6;i++) {
      const id=selected.selectedIds[i];if(seen.has(id))continue;seen.add(id);
      const texts=new Set();
      for(let answer=0;answer<4;answer++) {
        const followups=Array(6).fill(5);followups[i]=answer;
        const input=complete(values,followups),report=api.buildPersonaReport(input);
        const paragraph=report.sections.flatMap(s=>s.paragraphs).find(p=>p.findingIds.includes(`obs:${id}:${answer}`));
        assert(paragraph,id);texts.add(paragraph.text);audit(report,input);
      }
      assert.equal(texts.size,4,id);
    }
  }
  assert.equal(seen.size,18,"all adaptive candidates must actually be reachable");
});

test("all fixed scenario alternatives have distinct supported interpretations", () => {
  for(let i=0;i<34;i++) {
    const q=api.fixedQuestions[i];if(q.kind!=="scenario")continue;
    const texts=new Set();
    for(let answer=0;answer<4;answer++) {
      const values=base();values[i]=answer;
      const input=complete(values),report=api.buildPersonaReport(input);
      const finding=report.findings.find(f=>f.id===`obs:${q.id}:${answer}`);
      assert(finding);texts.add(finding.text);audit(report,input);
    }
    assert.equal(texts.size,4,q.id);
  }
});

test("report determinism, immutable content, no caller mutation or shared state", () => {
  const input=submission(api,profiles[0]),before=JSON.stringify(input),a=api.buildPersonaReport(input);
  assert.equal(JSON.stringify(input),before); assert(Object.isFrozen(a));
  assert(Object.isFrozen(a.sections[0].paragraphs)); assert(Object.isFrozen(api.questionBank[0].options));
  input.answers[0]=0;
  assert.notDeepEqual(a.dimensions,api.buildPersonaReport(input).dimensions);
  assert.deepEqual(a,api.buildPersonaReport(JSON.parse(before)));
  assert.notDeepEqual(a.sections,api.buildPersonaReport(submission(api,profiles[1])).sections);
  const restored=JSON.parse(JSON.stringify(a));assert.deepEqual(restored,a);
});

test("version registry refuses unknown pairs and keeps the archived implementation explicit", () => {
  const implementation=api.resolvePersonaVersion("persona-questions-v1","persona-report-v1");
  assert(Object.isFrozen(implementation));
  assert.equal(implementation.versions.adaptive,"persona-adaptive-v1");
  assert.throws(()=>api.resolvePersonaVersion("persona-questions-v2","persona-report-v1"));
  assert.throws(()=>api.resolvePersonaVersion(null,null));
  assert.deepEqual(implementation.buildReport(submission(api,profiles[0])),api.buildPersonaReport(submission(api,profiles[0])));
});

test("editing recomputes selection, retains answers by ID and clears stale slots", () => {
  const previous=submission(api,profiles[0]),next=fixed(profiles[2]);
  const result=api.reconcileAdaptive(previous,next);
  assert.deepEqual(result.selection.selectedIds,profiles[2].selected);
  for(const item of result.followups) {
    const index=profiles[0].selected.indexOf(item.questionId);
    assert.equal(item.answer,index<0?null:previous.answers[34+index]);
  }
  assert(result.removedIds.length>0);
  assert(result.followups.some(f=>f.answer===null));
  const unchanged=api.reconcileAdaptive(previous,previous.answers.slice(0,34));
  assert.equal(unchanged.removedIds.length,0);
  assert.deepEqual(unchanged.followups.map(f=>f.answer),previous.answers.slice(34));
  const unknown=complete(base(),Array(6).fill(5));
  assert(api.reconcileAdaptive(unknown,base()).followups.every(f=>f.answer===5));
});

test("domain dependency boundary: no providers, framework, secrets, randomness or clocks", () => {
  const scan=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()&&e.name!=="tests"?scan(path.join(dir,e.name)):e.isFile()&&e.name.endsWith(".ts")?[path.join(dir,e.name)]:[]);
  for(const file of scan(domain)) {
    const source=fs.readFileSync(file,"utf8");
    assert(!/process\.env|Math\.random\s*\(|Date\.now\s*\(|new Date\s*\(|\bfetch\s*\(/.test(source),file);
    for(const m of source.matchAll(/(?:from|import)\s*["']([^"']+)["']/g))assert(m[1].startsWith("."),`${file}: ${m[1]}`);
  }
  assert.throws(()=>require("node:https").get("https://example.invalid"),/disabled/);
  assert.throws(()=>globalThis.fetch("https://example.invalid"),/disabled/);
});

test("versioned material fingerprint: wording, scoring, selection and report copy are pinned", () => {
  const files=["versions.ts","registry.ts","v1/manifest.ts","v1/questions.ts","v1/answers.ts","v1/adaptive.ts","v1/submission.ts","v1/score.ts","v1/copy.ts","v1/findings.ts","v1/experiments.ts","v1/report.ts","v1/editing.ts"];
  const digest=createHash("sha256").update(files.map(file=>`${file}\n${fs.readFileSync(path.join(domain,file),"utf8").replace(/\r\n/g,"\n")}`).join("\n")).digest("hex");
  const expected=JSON.parse(fs.readFileSync(path.join(__dirname,"v1-fingerprint.json"),"utf8"));
  assert.equal(digest,expected.sha256,"A sold content/model version must be preserved; introduce a new implementation/version deliberately.");
});
