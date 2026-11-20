/* eslint-disable @typescript-eslint/no-require-imports -- isolated synthetic audit, no providers */
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),load=require("../app/autism-test/test/test-loader.cjs")();
const {assessReportQuality,POLICY,QUALITY_VERSION}=load(path.join(root,"app/persona/_domain/quality-v1/index.ts"));
const fixtures=require("../tests/persona/insights-v2-full-fixtures.cjs");
const assessments=fixtures.map(p=>({id:p.id,name:p.name,assessment:assessReportQuality(p.answers)}));
const summary=Object.fromEntries(["ready","limited","insufficient"].map(state=>[state,assessments.filter(p=>p.assessment.state===state).length]));
const result={version:QUALITY_VERSION,syntheticOnly:true,representativeCustomers:false,policy:POLICY,summary,assessments};
if(process.argv[2]){
 const dir=path.resolve(process.argv[2]);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,"assessments.json"),JSON.stringify(result,null,2)+"\n");
}
console.log(JSON.stringify({version:QUALITY_VERSION,summary,profiles:assessments.map(p=>({id:p.id,state:p.assessment.state,
 valid:p.assessment.validCount,sections:p.assessment.meaningfulSections,blocks:p.assessment.meaningfulBlocks,
 insights:p.assessment.insights,strengths:p.assessment.strengths,advice:p.assessment.advice,
 reservations:Math.round(p.assessment.reservationShare*100),reasons:p.assessment.reasons}))},null,2));
