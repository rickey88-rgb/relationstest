/* eslint-disable @typescript-eslint/no-require-imports -- content, causal evidence and deterministic model audit. */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const root=path.resolve(__dirname,"../.."),load=require("../../app/autism-test/test/test-loader.cjs")();
const api=load(path.join(root,"app/persona/_domain/v2/index.ts"));
const {profiles,fixed,submission,ratingIds}=require("../../app/persona/_domain/tests/v2-fixtures.cjs");
const {adaptiveRules}=load(path.join(root,"app/persona/_domain/v2/adaptive.ts"));
const {narrativeRules,deriveFindings}=load(path.join(root,"app/persona/_domain/v2/findings.ts"));
const {observations}=load(path.join(root,"app/persona/_domain/v2/copy.ts"));
const words=text=>text.trim().split(/\s+/).length;
const complete=answers=>({questionVersion:api.VERSIONS.question,reportVersion:api.VERSIONS.report,answers:[...answers,...Array(6).fill(0)]});
function triggers(rule){const answers=Array(34).fill(5);rule.conditions.forEach(c=>{answers[Number(c.questionId.slice(1))-1]=c.answers[0];});return answers;}
function audit(report,input) {
  const values=new Map(api.describeAnswers(input).map(a=>[a.questionId,a.value]));
  const findings=new Map(report.findings.map(f=>[f.id,f]));
  for(const finding of report.findings) {
    assert(finding.evidence.length>0);
    for(const evidence of [...finding.evidence,...finding.counterEvidence]) {assert.equal(values.get(evidence.questionId),evidence.answer);assert.notEqual(evidence.answer,5);}
  }
  for(const section of report.sections) {
    assert(section.paragraphs.length>0);
    for(const paragraph of section.paragraphs) {
      if(paragraph.scope!=="method")assert(paragraph.findingIds.length>0);
      for(const id of paragraph.findingIds)assert(findings.has(id),"Missing finding for "+paragraph.id);
    }
  }
}
test("v2 bank: 34 fixed, 18 candidates, four options each, short Swedish and scenario majority",()=>{
  assert.equal(api.fixedQuestions.length,34);assert.equal(api.adaptiveQuestions.length,18);
  assert.deepEqual([1,2,3].map(c=>api.fixedQuestions.filter(q=>q.chapter===c).length),[10,12,12]);
  assert.equal(api.fixedQuestions.filter(q=>q.kind==="rating").length,15);
  assert.equal(api.fixedQuestions.filter(q=>q.kind==="scenario").length+6,25);
  assert.equal(new Set(api.questionBank.map(q=>q.id)).size,52);
  for(const q of api.questionBank) {
    assert(words(q.prompt)>=15&&words(q.prompt)<=35,q.id+" prompt length");
    assert.equal(q.options.length,4,q.id);assert.equal(new Set(q.options).size,4,q.id);
    q.options.forEach(a=>assert(words(a)>=5&&words(a)<=12,q.id+" option length: "+a));
    assert(!/\b(arbetsgrupp|arbetsmöte|ansvarsfördelning|projektgrupp|mandat|budgetprocess)\b/i.test(q.prompt));
    assert(q.purpose&&q.supports.length);assert(Object.isFrozen(q));
    if(q.kind==="scenario"){assert.equal(observations[q.id].length,4);assert.equal(new Set(observations[q.id]).size,4);}
  }
});
test("four-point scoring: correct reverse keys, every item, uncertainty and scenario exclusion",()=>{
  const base=fixed(profiles[0]);
  for(const q of api.fixedQuestions.filter(q=>q.kind==="rating"))for(let value=0;value<4;value++) {
    const answers=Array(34).fill(5);answers[Number(q.id.slice(1))-1]=value;
    const dimension=api.scoreDimensions(answers).find(d=>d.dimension===q.dimension);
    assert.equal(dimension.raw,q.reverse?3-value:value);assert.equal(dimension.valid,1);assert.equal(dimension.value,null);
  }
  for(const ids of ratingIds) {
    const answers=[...base];ids.forEach(id=>{answers[id-1]=5;});assert.equal(api.scoreDimensions(answers).find(d=>d.dimension===api.getQuestion("P"+String(ids[0]).padStart(2,"0")).dimension).valid,0);
  }
  const changed=base.map((value,i)=>api.fixedQuestions[i].kind==="scenario"?(value+1)%4:value);
  assert.deepEqual(api.scoreDimensions(changed),api.scoreDimensions(base));
  assert.throws(()=>api.parseSubmission({...complete(base),answers:[4,...complete(base).answers.slice(1)]}));
  assert(api.parseSubmission({...complete(base),answers:[5,...complete(base).answers.slice(1)]}));
});
test("each adaptive candidate is reachable and has exact explicit evidence with 0/3/9 relevance",()=>{
  for(const rule of adaptiveRules) {
    const answers=triggers(rule),selection=api.selectAdaptive(answers),candidate=selection.candidates.find(c=>c.id===rule.id);
    assert.equal(candidate.score,9);assert.equal(candidate.reason,"combination");assert.equal(candidate.evidence.length,2);
    assert(selection.selectedIds.includes(rule.id),"Unreachable followup: "+rule.id);
    answers[Number(rule.conditions[0].questionId.slice(1))-1]=5;
    assert.equal(api.selectAdaptive(answers).candidates.find(c=>c.id===rule.id).score,3);
    answers[Number(rule.conditions[1].questionId.slice(1))-1]=5;
    assert.equal(api.selectAdaptive(answers).candidates.find(c=>c.id===rule.id).score,0);
  }
});
test("adaptive optimum, theme bounds, tie breaking and determinism are independently enumerated",()=>{
  for(const answers of [Array(34).fill(5),...profiles.map(fixed)]) {
    const selection=api.selectAdaptive(answers),items=selection.candidates;
    let optimum=-1,themes=-1,key="";
    function choose(start,chosen) {
      if(chosen.length===6) {
        const counts=new Map();chosen.forEach(c=>counts.set(c.theme,(counts.get(c.theme)??0)+1));
        if(counts.size<3||[...counts.values()].some(n=>n>3))return;
        const score=chosen.reduce((n,c)=>n+c.score,0),ids=chosen.map(c=>c.id).join(",");
        if(score>optimum||(score===optimum&&(counts.size>themes||(counts.size===themes&&ids<key)))){optimum=score;themes=counts.size;key=ids;}
        return;
      }
      for(let i=start;i<=items.length-(6-chosen.length);i++)choose(i+1,[...chosen,items[i]]);
    }
    choose(0,[]);
    assert.equal(selection.totalScore,optimum);assert.equal([...selection.selectedIds].sort().join(","),key);
    assert.deepEqual(api.selectAdaptive([...answers]),selection);
  }
  assert(profiles.some(profile=>{const selection=api.selectAdaptive(fixed(profile));return new Set(selection.selectedIds.map(id=>api.getQuestion(id).theme)).size<6;}),"not one mandatory question per category");
});
test("five authored profiles produce different signatures, portraits and every personal section",()=>{
  const reports=profiles.map(profile=>{
    const input=submission(api,profile),report=api.buildPersonaReport(input);audit(report,input);assert(report.quality.eligible);
    assert.deepEqual(report.selection.selectedIds,profile.selected);
    profile.required.forEach(id=>assert(report.findings.some(f=>f.ruleId===id),profile.name+": "+id));
    return report;
  });
  for(let section=0;section<8;section++)assert.equal(new Set(reports.map(r=>JSON.stringify(r.sections[section]))).size,5,"section "+section+" must differ across profiles");
  assert.equal(new Set(reports.map(r=>JSON.stringify(r.selection.selectedIds))).size,5);
  assert.equal(new Set(reports.map(r=>JSON.stringify(r.dimensions.map(d=>d.value)))).size,5);
});
test("all 76 fixed scenario answers are visible, distinct and traceable in the eight report sections",()=>{
  for(const q of api.fixedQuestions.filter(q=>q.kind==="scenario")) {
    const rendered=[];
    for(let answer=0;answer<4;answer++) {
      const answers=fixed(profiles[0]);answers[Number(q.id.slice(1))-1]=answer;
      const input=complete(answers),report=api.buildPersonaReport(input),id=`obs:${q.id}:${answer}`;
      audit(report,input);assert(report.sections.some(s=>s.paragraphs.some(p=>p.findingIds.includes(id)&&p.text===observations[q.id][answer])),id);
      rendered.push(JSON.stringify(report.sections));
    }
    assert.equal(new Set(rendered).size,4,q.id);
  }
});
test("all 72 adaptive answers change visible personal report text, never just hidden metadata",()=>{
  for(const rule of adaptiveRules) {
    const answers=triggers(rule),selection=api.selectAdaptive(answers),position=selection.selectedIds.indexOf(rule.id);assert(position>=0);
    const rendered=[];
    for(let answer=0;answer<4;answer++) {
      const input=complete(answers);input.answers[34+position]=answer;
      const report=api.buildPersonaReport(input),id=`obs:${rule.id}:${answer}`;audit(report,input);
      assert(report.sections.some(s=>s.paragraphs.some(p=>p.findingIds.includes(id)&&p.text===observations[rule.id][answer])),id);
      rendered.push(JSON.stringify(report.sections));
    }
    assert.equal(new Set(rendered).size,4,rule.id);
  }
});
test("combination claims require every documented condition; unknown cannot supply a missing premise",()=>{
  for(const rule of narrativeRules) {
    const fixedAnswers=Array(34).fill(5),adaptive=[...api.adaptiveQuestions.map(q=>q.id)],answers=[...fixedAnswers,...Array(18).fill(5)];
    const at=id=>id.startsWith("P")?Number(id.slice(1))-1:34+adaptive.indexOf(id);
    rule.conditions.forEach(c=>{answers[at(c.questionId)]=c.answers[0];});
    assert(deriveFindings(answers,adaptive,api.scoreDimensions(answers.slice(0,34))).some(f=>f.ruleId===rule.id));
    for(const condition of rule.conditions) {
      const missing=[...answers];missing[at(condition.questionId)]=5;
      assert(!deriveFindings(missing,adaptive,api.scoreDimensions(missing.slice(0,34))).some(f=>f.ruleId===rule.id),rule.id);
    }
  }
});
test("missing/forged data fails closed and all-unknown creates no personal filler",()=>{
  const input=submission(api,profiles[0]);
  for(const bad of [{...input,adaptiveIds:["A01"]},{...input,paid:true},{...input,reportVersion:"persona-report-v1"},{...input,answers:Array(39).fill(0)},{...input,answers:Array(40).fill(null)}])assert.throws(()=>api.parseSubmission(bad));
  const sparse=[...input.answers];delete sparse[12];assert.throws(()=>api.parseSubmission({...input,answers:sparse}));
  const unknown=api.buildPersonaReport({...input,answers:Array(40).fill(5)});
  assert.equal(unknown.findings.length,0);assert.equal(unknown.quality.eligible,false);assert.deepEqual(unknown.preview.findingIds,[]);
  assert(unknown.sections.every(s=>s.paragraphs.every(p=>p.scope==="method")));
});
test("v2 reports are reproducible, immutable and version isolated from v1",()=>{
  const input=submission(api,profiles[0]),before=JSON.stringify(input),report=api.buildPersonaReport(input);
  assert.deepEqual(api.buildPersonaReport(JSON.parse(before)),report);assert.equal(JSON.stringify(input),before);assert(Object.isFrozen(report));
  assert.equal(report.questionVersion,"persona-questions-v2");assert.equal(report.adaptiveVersion,"persona-adaptive-v2");
  const old=api.resolvePersonaVersion("persona-questions-v1","persona-report-v1");assert.equal(old.versions.analysis,"persona-analysis-v1");
  assert.throws(()=>api.resolvePersonaVersion("persona-questions-v2","persona-report-v1"));
  const state=load(path.join(root,"app/persona/test/state.ts"));
  assert.equal(state.STORAGE_KEY,"relationsvarning_persona_flow_v3");
  assert.equal(state.parseDraft(JSON.stringify({...state.initialDraft(),version:2,questionVersion:"persona-questions-v2",reportVersion:"persona-report-v2"})),null);
});
test("v2 content/model fingerprint requires an explicit future revision",()=>{
  const manifest=require("../../app/persona/_domain/tests/v2-fingerprint.json");
  for(const item of manifest.files)assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(root,item.path),"utf8").replace(/\r\n/g,"\n")).digest("hex"),item.sha256,item.path);
});
test("public question dependencies contain no premium interpretations or report engine",()=>{
  const seen=new Set();
  function visit(file) {
    if(seen.has(file))return;seen.add(file);
    assert(!/\/(interpretations|copy|findings|report|experiments|registry)\.ts$/.test(file.replaceAll("\\","/")),file);
    const source=fs.readFileSync(file,"utf8");
    for(const match of source.matchAll(/(?:from|import)\s*["'](\.[^"']+)["']/g)) {
      const base=path.resolve(path.dirname(file),match[1]);
      const target=fs.existsSync(base+".ts")?base+".ts":base+".tsx";visit(target);
    }
  }
  visit(path.join(root,"app/persona/_domain/v2/questions.ts"));
  assert(seen.size>=3);
  const visible=JSON.stringify(api.questionBank);
  for(const texts of Object.values(observations))texts.forEach(text=>assert(!visible.includes(text)));
});
