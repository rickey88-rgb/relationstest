/* eslint-disable @typescript-eslint/no-require-imports -- local synthetic stage 5 and full previous regression suite. */
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const tests = ["app/_lib/testAccounts/stage5-parity.test.cjs", "app/_lib/testAccounts/stage5-flow.test.cjs", "app/_lib/testAccounts/stage5-http-ui.test.cjs", "scripts/test-test-accounts-stage4.cjs"];
let failed = 0;
for (const file of tests) {
  const result = spawnSync(process.execPath, [path.join(root, file)], { cwd: root, stdio: "inherit", timeout: 300000 });
  if (result.error || result.status !== 0) { failed++; console.error(`FAILED: ${file}`); }
}
console.log(`${tests.length - failed}/${tests.length} stage 5 commands passed (63 test programs including the previous 60).`);
process.exitCode = failed ? 1 : 0;
