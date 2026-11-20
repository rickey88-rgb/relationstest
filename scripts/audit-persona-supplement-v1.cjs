/* eslint-disable @typescript-eslint/no-require-imports -- offline synthetic completion audit */
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),load=require("../app/autism-test/test/test-loader.cjs")();
const {completeReport,SUPPLEMENT_VERSION}=load(path.join(root,"app/persona/_domain/supplement-v1/index.ts"));
const fixtures=require("../tests/persona/insights-v2-full-fixtures.cjs");
const scenarios={
 informative:{S01:"context",S02:"one",S03:"small-step",S04:"voice"},
 skipped:{S01:"skip",S02:"skip",S03:"skip",S04:"skip"},
 noChange:{S01:"fits",S02:"no-difference",S03:"no-example",S04:"none"},
 preservation:{S01:"fits",S02:"one",S03:"small-step",S04:"preserve"},
 nonSocialStart:{S01:"context",S02:"one",S03:"asked",S04:"start"},
 nonSocialPreserve:{S01:"context",S02:"writing",S03:"asked",S04:"preserve"},
};
const assessments=fixtures.filter(p=>["F21","F23","F24"].includes(p.id)).flatMap(p=>Object.entries(scenarios).map(([scenario,responses])=>{
 const r=completeReport(p.answers,responses);
 return {profile:p.id,scenario,responses,before:r.before,after:r.after,
  additions:r.additions,offer:r.offer,contentVersion:r.contentVersion,methodNote:r.methodNote,freeResult:r.freeResult,allowCheckout:r.allowCheckout};
}));
const result={version:SUPPLEMENT_VERSION,syntheticOnly:true,representativeCustomers:false,assessments};
if(process.argv[2]){
 const dir=path.resolve(process.argv[2]);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,"supplement-assessments.json"),JSON.stringify(result,null,2)+"\n");
}
console.log(JSON.stringify(assessments.map(r=>({profile:r.profile,scenario:r.scenario,before:r.before.state,after:r.after.state,
 units:r.after.independentContentUnits,sections:r.after.meaningfulSections,evidence:r.after.distinctEvidenceIds,
 additions:r.additions.length,reservations:Math.round(r.after.reservationShare*100),reasons:r.after.reasons})),null,2));
