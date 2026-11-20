/* eslint-disable @typescript-eslint/no-require-imports -- existing Next webpack packs canonical server modules for the Dashboard editor. */
const fs=require("node:fs"),path=require("node:path"),os=require("node:os");
const {execFileSync}=require("node:child_process");
const {pathToFileURL}=require("node:url");
const root=path.resolve(__dirname,"..");
const webpack=require("next/dist/compiled/webpack/webpack");
const output=path.join(root,"supabase/functions/customer-tests/_generated-dashboard");
async function build(){
  execFileSync(process.execPath,[path.join(__dirname,"build-customer-edge.cjs")],{cwd:root,stdio:"pipe"});
  fs.mkdirSync(output,{recursive:true});
  const entry=path.join(output,"entry.mjs");
  fs.writeFileSync(entry,`import {Buffer} from "node:buffer";
import process from "node:process";
Object.assign(globalThis,{Buffer,process});
const {directCustomerHandler}=await import("../_generated/app/_lib/testAccounts/directHandler.server.mjs");
const {prepareV61Checkout,openV61Purchase}=await import("../_generated/app/_lib/testAccounts/personaV61Commerce.server.mjs");
export {directCustomerHandler,prepareV61Checkout,openV61Purchase};
if (typeof Deno !== "undefined") Deno.serve(directCustomerHandler());
`);
  const compiler=webpack.webpack({
    mode:"none",target:"webworker",context:root,entry,
    experiments:{outputModule:true},devtool:false,
    output:{path:output,filename:"index.mjs",module:true,library:{type:"module"},chunkFormat:"module"},
    optimization:{minimize:false,splitChunks:false,runtimeChunk:false},
    plugins:[new webpack.LimitChunkCountPlugin({maxChunks:1})],
    externalsType:"module",
    externals:[({request},callback)=>{
      if(request?.startsWith("node:")||request?.startsWith("npm:"))return callback(null,request);
      callback();
    }],
  });
  await new Promise((resolve,reject)=>compiler.run((error,stats)=>{
    compiler.close(()=>{});
    if(error||stats.hasErrors())reject(error??Error(stats.toString({all:false,errors:true})));else resolve();
  }));
  // Execute the same module body in Node, changing only Deno npm: specifiers
  // to installed packages. The production artifact remains byte-identical.
  let source=fs.readFileSync(path.join(output,"index.mjs"),"utf8");
  const testDir=fs.mkdtempSync(path.join(os.tmpdir(),"persona-dashboard-package-"));
  fs.symlinkSync(path.join(root,"node_modules"),path.join(testDir,"node_modules"),"junction");
  const nodeSource=source.replace(/from "npm:([^"]+)"/g,(_match,specifier)=>{
    const packageName=specifier.startsWith("@")?specifier.split("@").slice(0,2).join("@"):specifier.split("@")[0];
    return 'from "'+pathToFileURL(require.resolve(packageName)).href+'"';
  });
  const nodeFile=path.join(testDir,"index.mjs");fs.writeFileSync(nodeFile,nodeSource);
  const api=await import(pathToFileURL(nodeFile).href);
  if(typeof api.directCustomerHandler!=="function")throw Error("Missing handler export");
  process.env.ACCOUNT_PORTAL_ENABLED="true";process.env.DIRECT_CUSTOMER_TESTS_ENABLED="true";
  process.env.TEST_ACCOUNTS_PERSONA_ENABLED="true";process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED="true";
  process.env.TEST_ACCOUNTS_PERSONA_V61_ONLY="true";
  const handler=api.directCustomerHandler();
  const response=await handler(new Request("https://synthetic.supabase.co/functions/v1/customer-tests",{method:"POST",
    headers:{origin:"https://www.relationsvarning.se","content-type":"application/json"},body:JSON.stringify({action:"capabilities"})}));
  if(response.status!==200)throw Error("Bundled handler did not open");
  const capabilities=await response.json();
  const persona=capabilities.tests.find(t=>t.product==="persona_test");
  if(JSON.stringify(persona.checkoutReportVersions)!=='["persona-report-v61-release1"]')throw Error("Wrong release gate");
  const profiles=require("../tests/persona/insights-v2-full-fixtures.cjs"),frozen=require("../app/persona/_domain/release-v61/snapshot.cjs");
  for(const profile of profiles){
    const input={questionVersion:"persona-questions-v3",reportVersion:"persona-report-v61-release1",answers:profile.answers};
    if(frozen.completeReport(profile.answers).after.state==="ready"){
      const prepared=api.prepareV61Checkout(input),reopened=api.openV61Purchase(prepared.envelope);
      if(reopened.presentation.sections.length!==6)throw Error("Missing bundled report section");
    }else{let refused=false;try{api.prepareV61Checkout(input);}catch{refused=true;}if(!refused)throw Error("Bundled quality gate opened");}
  }
  const sourceManifest=JSON.parse(fs.readFileSync(path.join(root,"supabase/functions/customer-tests/source-manifest.json")));
  fs.writeFileSync(path.join(output,"manifest.json"),JSON.stringify({generatedFrom:sourceManifest.files,bytes:Buffer.byteLength(source)},null,2));
  console.log(JSON.stringify({file:path.join(output,"index.mjs"),bytes:Buffer.byteLength(source),canonicalModules:sourceManifest.files.length,bundledHandlerVerified:true}));
}
build().catch(error=>{console.error(error);process.exitCode=1;});
