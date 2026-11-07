/* eslint-disable @typescript-eslint/no-require-imports */
const path=require("node:path");
const {spawnSync}=require("node:child_process");
const root=path.resolve(__dirname,"..");
const environment={};
for(const key of ["SystemRoot","WINDIR","PATH","Path","TEMP","TMP","NODE_PATH"])if(process.env[key])environment[key]=process.env[key];
const commands=[
  [require.resolve("typescript/bin/tsc"),"--noEmit","--incremental","false"],
  [path.join(root,"scripts/test-persona-stage1.cjs")],
  ["--require",path.join(root,"app/persona/_domain/tests/network-guard.cjs"),"--test",path.join(root,"app/persona/test/flow.test.cjs")],
  [path.join(path.dirname(require.resolve("eslint/package.json")),"bin/eslint.js"),"--config","eslint.config.mjs","--max-warnings","0","app/persona","scripts/test-persona-stage1.cjs","scripts/test-persona-stage2.cjs"],
];
for(const args of commands){
  const result=spawnSync(process.execPath,args,{cwd:root,env:environment,stdio:"inherit"});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}
