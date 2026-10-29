/* eslint-disable @typescript-eslint/no-require-imports -- local autism + existing full regression suite, synthetic data only. */
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const tests = ["app/_lib/testAccounts/stage4-parity.test.cjs", "app/_lib/testAccounts/stage4-flow.test.cjs", "app/_lib/testAccounts/stage4-http-ui.test.cjs", "app/autism-test/test/model.test.cjs", "app/autism-test/test/flow.test.cjs", "app/autism-test/test/recovery-analytics.test.cjs", "app/_lib/autismRecovery.test.cjs", "scripts/test-test-accounts-stage3.cjs"];
let failed = 0;
for (const file of tests) {
  const result = spawnSync(process.execPath, [path.join(root, file)], { cwd: root, stdio: "inherit", timeout: 300000 });
  if (result.error || result.status !== 0) { failed++; console.error(`FAILED: ${file}`); }
}
console.log(`${tests.length - failed}/${tests.length} stage 4 commands passed (60 test programs including the previous 53).`);
process.exitCode = failed ? 1 : 0;
