/* eslint-disable @typescript-eslint/no-require-imports -- synthetic local regression runner, no real credentials required. */
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const tests = ["core", "payment", "postgres", "http", "checkout-operations"].map(name => `app/_lib/testAccounts/${name}.test.cjs`)
  .concat(["app/adhd-test/test/model.test.cjs", "app/adhd-test/test/personalFinding.test.cjs", "app/adhd-test/test/paywall.test.cjs", "scripts/test-account-phase2.cjs"]);
let failed = 0;
for (const test of tests) {
  const result = spawnSync(process.execPath, [path.join(root, test)], { cwd: root, stdio: "inherit", timeout: 180000 });
  if (result.error || result.status !== 0) { failed++; console.error(`FAILED: ${test}`); }
}
console.log(`${tests.length - failed}/${tests.length} test commands passed (includes full existing AuDHD/account regression suite).`);
process.exitCode = failed ? 1 : 0;
