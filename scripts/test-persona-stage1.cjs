/* eslint-disable @typescript-eslint/no-require-imports */
// Offline-only runner. Do not import application startup, Next config, dotenv or provider SDKs.
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname,"..");
const tests = path.join(root,"app/persona/_domain/tests");
const environment = {};
for (const key of ["SystemRoot","WINDIR","PATH","Path","TEMP","TMP","NODE_PATH"]) {
  if (process.env[key]) environment[key] = process.env[key];
}
// No application keys, DB URLs, email settings or NODE_OPTIONS are inherited.
const steps = [
  [require.resolve("typescript/bin/tsc"),"--project",path.join(root,"app/persona/_domain/tsconfig.json")],
  ["--require",path.join(tests,"network-guard.cjs"),"--test",path.join(tests,"persona.test.cjs")],
];
for(const args of steps) {
  const result=spawnSync(process.execPath,args,{cwd:root,env:environment,stdio:"inherit"});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}
