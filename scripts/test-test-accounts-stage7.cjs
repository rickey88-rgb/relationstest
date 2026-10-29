/* eslint-disable @typescript-eslint/no-require-imports -- isolated synthetic IQ and complete previous regression suite. */
const path=require("node:path"),{spawnSync}=require("node:child_process"),root=path.resolve(__dirname,"..");
const tests=["app/_lib/testAccounts/stage7-parity.test.cjs","app/_lib/testAccounts/stage7-flow.test.cjs","app/_lib/testAccounts/stage7-http-ui.test.cjs","app/_lib/testAccounts/stage7-safety.test.cjs","app/_lib/testAccounts/stage7-client.test.cjs","app/iq-test/test/model.test.cjs","scripts/test-test-accounts-stage6.cjs"];
let failed=0;for(const file of tests){const result=spawnSync(process.execPath,[path.join(root,file)],{cwd:root,stdio:"inherit",timeout:300000});if(result.error||result.status!==0){failed++;console.error(`FAILED: ${file}`);}}
console.log(`${tests.length-failed}/${tests.length} stage 7 commands passed (74 test programs including the previous 68).`);process.exitCode=failed?1:0;
