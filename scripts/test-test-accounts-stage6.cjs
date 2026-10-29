/* eslint-disable @typescript-eslint/no-require-imports -- local synthetic stage 6 and full previous regression suite. */
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const tests = ["app/_lib/testAccounts/stage6-parity.test.cjs", "app/_lib/testAccounts/stage6-flow.test.cjs", "app/_lib/testAccounts/stage6-http-ui.test.cjs", "app/_lib/testAccounts/stage6-safety.test.cjs", "app/psykisk-misshandel-relation/test/flow.test.cjs", "scripts/test-test-accounts-stage5.cjs"];
let failed = 0;
for (const file of tests) {
  const result = spawnSync(process.execPath, [path.join(root, file)], { cwd: root, stdio: "inherit", timeout: 300000 });
  if (result.error || result.status !== 0) { failed++; console.error(`FAILED: ${file}`); }
}
console.log(`${tests.length - failed}/${tests.length} stage 6 commands passed (68 test programs including the previous 63).`);
process.exitCode = failed ? 1 : 0;
