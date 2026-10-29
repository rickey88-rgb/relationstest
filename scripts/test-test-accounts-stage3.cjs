/* eslint-disable @typescript-eslint/no-require-imports -- complete local synthetic stage 3 regression runner. */
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const tests = ["app/_lib/testAccounts/stage3-parity.test.cjs", "app/_lib/testAccounts/stage3-flow.test.cjs", "app/_lib/testAccounts/stage3-http-ui.test.cjs", "scripts/test-test-accounts-stage2.cjs"];
let failed = 0;
for (const file of tests) {
  const result = spawnSync(process.execPath, [path.join(root, file)], { cwd: root, stdio: "inherit", timeout: 300000 });
  if (result.error || result.status !== 0) { failed++; console.error(`FAILED: ${file}`); }
}
console.log(`${tests.length - failed}/${tests.length} stage 3 commands passed (53 test programs including the previous 50).`);
process.exitCode = failed ? 1 : 0;
