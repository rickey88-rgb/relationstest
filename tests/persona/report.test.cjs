/* eslint-disable @typescript-eslint/no-require-imports -- server rendering, evidence and free/paid boundary checks. */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const createLoader=require("../../app/autism-test/test/test-loader.cjs"),{payloadFor,root}=require("./runtime.cjs");
const styles=new Proxy({}, {get:(_,key)=>"persona_"+String(key)});
const load=createLoader({"./report.module.css":{default:styles}});
const api=load(path.join(root,"app/persona/_domain/index.ts"));
const Report=load(path.join(root,"app/persona/report/PersonaReportView.tsx")).default;
const encode=text=>renderToStaticMarkup(React.createElement("span",null,text)).slice(6,-7);
test("eight premium sections render every approved paragraph and evidence, with accessible unnormed visualizations",()=>{
  for(let i=0;i<5;i++) {
    const report=api.buildPersonaReport(payloadFor(load,i)),html=renderToStaticMarkup(React.createElement(Report,{report}));
    assert(html.includes('id="persona-premium-report"'));assert(html.includes("Skriv ut eller spara som PDF"));
    assert.equal((html.match(/<meter /g)||[]).length,report.dimensions.filter(d=>d.value!==null).length);
    assert(html.includes("inte percentil"));assert(html.includes("inte en validerad klinisk skala"));
    for(const section of report.sections) {
      assert(html.includes('id="persona-'+section.id+'"'));
      section.paragraphs.forEach(p=>assert(html.includes(encode(p.text)),p.id));
      for(const paragraph of section.paragraphs)for(const findingId of paragraph.findingIds) {
        const finding=report.findings.find(f=>f.id===findingId);assert(finding);
        for(const evidence of finding.evidence)assert(html.includes(encode(api.getQuestion(evidence.questionId).options[evidence.answer])));
      }
    }
  }
});
test("single free insight never returns the premium payload even for forged unlock flags",async()=>{
  const {getPersonaPreview}=load(path.join(root,"app/persona/test/actions.ts"));
  const input=payloadFor(load),preview=await getPersonaPreview(input);
  assert.deepEqual(Object.keys(preview).sort(),["evidenceCount","kind","text"]);
  assert.equal(preview.kind,"insight");assert.equal(preview.text,api.buildPersonaReport(input).preview.text);
  assert.equal((await getPersonaPreview({...input,unlocked:true})).kind,"invalid");
});
test("print styling isolates the paid report and includes an explicit evidence appendix",()=>{
  const css=fs.readFileSync(path.join(root,"app/persona/report/report.module.css"),"utf8");
  assert(css.includes("@media print"));assert(css.includes("visibility: hidden"));assert(css.includes("visibility: visible !important"));
  assert(css.includes("break-inside: avoid"));assert(css.includes("@page persona-report"));assert(css.includes(".printEvidence { display: block"));
  const source=fs.readFileSync(path.join(root,"app/persona/report/PersonaReportView.tsx"),"utf8");
  assert(!/buildPersonaReport|fetch\(|localStorage|searchParams/.test(source));
  assert(source.includes('className={styles.printEvidence}'));
});
test("paywall is disabled without a verified preview, capability and explicit processing consent",()=>{
  const p=path.join(root,"app/persona/test/PersonaPaywall.tsx"),source=fs.readFileSync(p,"utf8");
  assert(source.includes('startDirectCheckout("persona_test", submission)'));
  assert(source.includes('lock.current || !available || !eligible || !consent || !submission'));
  assert(!/buy\.stripe\.com|paymentLink|paid=true|buildPersonaReport/.test(source));
  const loader=createLoader({"../persona.module.css":{default:styles},"next/link":{default:({children,...props})=>React.createElement("a",props,children)}});
  const Paywall=loader(p).default;
  const html=renderToStaticMarkup(React.createElement(Paywall,{submission:payloadFor(load),eligible:false}));
  assert(html.includes('type="submit"'));assert(html.includes('disabled=""'));assert(html.includes("79 kr"));
  assert(html.includes("Kontosparning är frivillig"));assert(html.includes('href="/villkor"'));
});
