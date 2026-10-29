/* eslint-disable @typescript-eslint/no-require-imports -- local synthetic regression suite. */
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const tests = ["app/_lib/testAccounts/stage2-parity.test.cjs", "app/_lib/testAccounts/stage2-flow.test.cjs", "app/_lib/testAccounts/stage2-http-ui.test.cjs", "app/hsp-test/test/model.test.cjs", "app/ptsd-test/test/model.test.cjs", "scripts/test-test-accounts-stage1.cjs"];
let failed = 0;
for (const file of tests) {
  const result = spawnSync(process.execPath, [path.join(root, file)], { cwd: root, stdio: "inherit", timeout: 300000 });
  if (result.error || result.status !== 0) { failed++; console.error(`FAILED: ${file}`); }
}
console.log(`${tests.length - failed}/${tests.length} stage 2 test commands passed (50 programs including the existing 45).`);
process.exitCode = failed ? 1 : 0;
