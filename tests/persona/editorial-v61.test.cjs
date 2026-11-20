/* eslint-disable @typescript-eslint/no-require-imports -- editorial quality gates, independent of customer flow */
const assert=require("node:assert/strict"),test=require("node:test"),path=require("node:path"),fs=require("node:fs"),crypto=require("node:crypto");
const root=path.resolve(__dirname,"../.."),load=require("../../app/autism-test/test/test-loader.cjs")();
const v6=load(path.join(root,"app/persona/_domain/v6/index.ts"));
const {CATALOG,analyzeInsights}=load(path.join(root,"app/persona/_domain/insights-v1/index.ts"));
const {presentInsight,insightCopy}=load(path.join(root,"app/persona/_domain/v6/insight-copy.ts"));
const profiles=require("./insights-v2-full-fixtures.cjs");
const input=answers=>({answers,questionVersion:v6.VERSIONS.question,reportVersion:v6.VERSIONS.report});
const build=p=>v6.buildReport(input(p.answers));
const section=(r,id)=>r.sections.find(s=>s.id===id);
const words=text=>(text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)??[]).length;

test("main portraits have 150–220 words and combine sourced claims in one narrative",()=>{
  for(const id of ["F01","F03","F06"]) {
    const p=profiles.find(p=>p.id===id),r=build(p),blocks=section(r,"persona").blocks;
    assert.equal(blocks.length,1);
    assert(words(blocks[0].interpretation)>=150&&words(blocks[0].interpretation)<=220,id);
    assert(blocks[0].claims.length>=3);
    assert.equal(blocks[0].interpretation,blocks[0].claims.map(c=>c.text).join("\n\n"));
    for(const c of blocks[0].claims)for(const e of [...c.evidence,...c.counterEvidence])assert.equal(p.answers[+e.questionId.slice(1)-1],e.answer);
    assert(!/här möts|självskattat läge|stöd för en riktning/i.test(blocks[0].interpretation));
  }
  const f06=build(profiles.find(p=>p.id==="F06"));
  assert.equal(f06.archetype,null);
  assert(f06.sections[0].blocks[0].claims.some(c=>c.id==="interest-without-depth-demand"));
  const neutral=build(profiles.find(p=>p.id==="F24"));
  assert(words(section(neutral,"persona").blocks[0].interpretation)<100);
});

test("general qualifications appear once and long repeated main-example paragraphs are absent",()=>{
  const longParagraphs=new Map();
  for(const p of profiles) {
    const r=build(p),rendered=v6.renderMarkdown(r);
    assert.equal(rendered.split(r.method).length,2);
    assert(words(r.method)<65);
    assert(!/bevisar inte|underlaget visar inte|det säger inte|svaren visar inte/i.test(rendered));
    assert(!/budskapsgrupp|\bQ\d{2}\b/.test(rendered));
    if(!["F01","F03","F06"].includes(p.id))continue;
    for(const b of r.sections.flatMap(s=>s.blocks))for(const text of [b.observation,b.interpretation,b.example,b.adviceReason].filter(Boolean).flatMap(t=>t.split("\n\n"))) {
      if(words(text)<35)continue;
      assert(!longParagraphs.has(text),p.id+" shares a long paragraph with "+longParagraphs.get(text));
      longParagraphs.set(text,p.id);
    }
  }
});

test("every selected insight has source identity, pattern, possible reading and a concrete everyday extension",()=>{
  assert.equal(Object.keys(insightCopy).length,CATALOG.length);
  for(const p of profiles) {
    const r=build(p);
    assert.deepEqual(r.insightAnalysis,analyzeInsights(p.answers));
    for(const b of section(r,"insights").blocks) {
      const original=r.insightAnalysis.insights.find(i=>i.id===b.insightId);
      assert(original);
      assert.deepEqual(b.evidence,original.evidence);
      assert.deepEqual(b.counterEvidence,original.counterEvidence);
      assert(words(b.observation)>=8&&words(b.interpretation)>=15&&words(b.example)>=15);
      assert(b.presentationId.startsWith(b.insightId+":"));
      for(const e of b.contextEvidence)assert.equal(p.answers[+e.questionId.slice(1)-1],e.answer);
    }
  }
  for(const c of CATALOG) {
    const a=Array(40).fill(3);
    for(const t of [...c.required,...c.supporting])a[+t.questionId.slice(1)-1]=t.direction==="high"?4:2;
    const r=v6.buildReport(input(a));
    const b=section(r,"insights").blocks.find(b=>b.insightId===c.id);
    assert(b,c.id);
    assert(b.observation&&b.interpretation&&b.example);
  }
});

test("advice tries a next step instead of rehearsing a self-reported strength",()=>{
  const f01=build(profiles.find(p=>p.id==="F01")),f03=build(profiles.find(p=>p.id==="F03")),f06=build(profiles.find(p=>p.id==="F06"));
  assert.match(section(f01,"compass").blocks.find(b=>b.insightId==="autonomy-with-milestones").interpretation,/obestämd/);
  assert.match(section(f01,"compass").blocks.find(b=>b.insightId==="cooperation-with-own-voice").interpretation,/invändningen/);
  const pause=section(f06,"compass").blocks.find(b=>b.insightId==="emotional-signals-with-pause-awareness");
  assert.match(pause.interpretation,/både känner irritation och märker/);
  assert(!/lär dig märka|upptäck signalerna/.test(pause.interpretation));
  const first=section(f01,"compass").blocks.find(b=>b.insightId==="depth-with-self-direction");
  const other=section(f03,"compass").blocks.find(b=>b.insightId==="depth-with-self-direction");
  assert.notEqual(first.interpretation,other.interpretation);
  assert(first.contextEvidence.length>0);
  assert.equal(presentInsight("depth-with-self-direction",f01.readings).variantId,"depth-with-self-direction:structured");
  assert.equal(presentInsight("depth-with-self-direction",f03.readings).variantId,"depth-with-self-direction:base");
});

test("semantic topic exclusions keep boundaries, social recovery and relationship blocks distinct",()=>{
  for(const p of profiles) {
    const r=build(p),topics=new Set(section(r,"insights").blocks.flatMap(b=>b.topics));
    if(topics.has("commitment-boundaries"))assert(!section(r,"strengths").blocks.some(b=>b.topics.includes("bounded-support")));
    if(topics.has("social-recovery"))assert(!section(r,"strengths").blocks.some(b=>b.id==="strength-E"));
    const compass=section(r,"compass").blocks;
    assert(compass.length<=3);
    assert.equal(new Set(compass.flatMap(b=>b.topics)).size,compass.length);
    assert.equal(section(r,"insights").blocks.length,r.insightAnalysis.insights.length);
  }
  const f06=build(profiles.find(p=>p.id==="F06"));
  assert(section(f06,"strengths").blocks.some(b=>b.topics.includes("renewed-conversation")));
  assert(!section(f06,"strengths").blocks.some(b=>b.topics.includes("shared-choice")));
  const f15=build(profiles.find(p=>p.id==="F15"));
  assert.equal(section(f15,"strengths").blocks.length,2);
  assert(section(f15,"strengths").blocks.some(b=>b.topics.includes("renewed-conversation")));
});

test("insight activation and dimension confidence code are byte-identical to the editorial baseline",()=>{
  const pinned={"app/persona/_domain/insights-v1/catalog.ts":"2515E5E775D197580DF6FD5973D897EA1B4E782ECEDACC8354648FBD3F0B1938","app/persona/_domain/insights-v1/engine.ts":"36C5569AA56E0ED4B4443FD3BB4B251F923CAA2C8E6915E84E58406E94B70581","app/persona/_domain/v6/dimensions.ts":"7E59B4C10E860507EC2424C203FF3F07BB6D70A7D8E16037FF64BDE98342F8E9","app/persona/_domain/insights-v1/index.ts":"7F93AA409BA707934F46AC679DC42A558BADFEB901340E7E75787AA224022414","app/persona/_domain/insights-v1/types.ts":"75CF153A65E6F90BE5AE2D02ABAB48CBA580C2F0C9461CC91B29C24B0232D28B"};
  for(const [file,hash]of Object.entries(pinned))assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(root,file))).digest("hex").toUpperCase(),hash,file);
});
