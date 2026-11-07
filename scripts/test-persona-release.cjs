/* eslint-disable @typescript-eslint/no-require-imports -- offline release checks; never reads dotenv or inherits application credentials. */
const fs=require("node:fs"),path=require("node:path"),{spawnSync}=require("node:child_process");
const root=path.resolve(__dirname,".."),quick=process.argv.includes("--quick");
const output=path.join(root,".artifacts/persona-release");fs.mkdirSync(output,{recursive:true});
const env={NODE_ENV:"test",NEXT_TELEMETRY_DISABLED:"1",ACCOUNT_PORTAL_ENABLED:"true"};
for(const key of ["SystemRoot","WINDIR","PATH","Path","TEMP","TMP","NODE_PATH"])if(process.env[key])env[key]=process.env[key];
const guard=path.join(root,"tests/persona/network-guard.cjs"),results=[];
function run(name,args,timeout=180000) {
  const result=spawnSync(process.execPath,args,{cwd:root,env,encoding:"utf8",timeout,maxBuffer:32*1024*1024});
  const log=(result.stdout??"")+(result.stderr??"")+(result.error?"\n"+result.error.message:"");
  fs.writeFileSync(path.join(output,name.replace(/[^A-Za-z0-9_.-]/g,"_")+".txt"),log);
  const row={name,passed:result.status===0&&!result.error,status:result.status};results.push(row);
  console.log(`${row.passed?"PASS":"FAIL"} ${name}`);
  if(!row.passed)console.log(log.slice(-2400));
}
function discover(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(item=>{
    const file=path.join(directory,item.name);
    return item.isDirectory()?discover(file):item.name.endsWith(".test.cjs")?[path.relative(root,file).replaceAll("\\","/")]:[];
  });
}
run("persona-stage2",[path.join(root,"scripts/test-persona-stage2.cjs")]);
const tests=quick?discover(path.join(root,"tests/persona")):
  [...["app","scripts","tests"].flatMap(dir=>discover(path.join(root,dir))),...fs.readdirSync(root).filter(name=>name.endsWith(".test.cjs"))];
for(const file of [...new Set(tests)].sort()) {
  const selectedGuard=file.startsWith("app/persona/_domain/")?path.join(root,"app/persona/_domain/tests/network-guard.cjs"):guard;
  run(file,["--require",selectedGuard,path.join(root,file)]);
}
run("typescript",[require.resolve("typescript/bin/tsc"),"--noEmit","--incremental","false"]);
run("persona-lint",[path.join(path.dirname(require.resolve("eslint/package.json")),"bin/eslint.js"),"--config","eslint.config.mjs","--max-warnings","0",
  "app/persona","tests/persona","scripts/test-persona-release.cjs","scripts/render-persona-samples.cjs","scripts/audit-persona-v2.cjs","deploy/merge-persona-map.cjs","app/_lib/testAccounts/adapters/persona.ts","app/_lib/testAccounts/adapter.ts","app/_lib/testAccounts/answerDescriptions.ts","app/_lib/testAccounts/service.server.ts","app/_lib/paymentProductCatalog.server.ts","app/mina-sidor/tester/ReportView.tsx","app/mina-sidor/tester/integritet/page.tsx"]);
run("eslint",[path.join(path.dirname(require.resolve("eslint/package.json")),"bin/eslint.js"),"--config","eslint.config.mjs","--max-warnings","0"]);
fs.writeFileSync(path.join(output,"summary.json"),JSON.stringify({isolation:require("../tests/persona/isolated.config.json"),quick,results},null,2));
console.log(`${results.filter(r=>r.passed).length}/${results.length} commands passed. Logs: ${output}`);
process.exitCode=results.every(r=>r.passed)?0:1;
