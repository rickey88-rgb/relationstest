/* eslint-disable @typescript-eslint/no-require-imports -- local release runner, never contacts Stripe or R2. */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const files = [
  "app/adhd-deluxe/page.test.cjs", "app/adhd-deluxe/tack/klart/page.test.cjs",
  "app/api/books/adhd-deluxe/download/purchase-flow.test.cjs", "scripts/adhd-deluxe-scope.test.cjs",
  "scripts/price-contract.test.cjs", "scripts/price-map.test.cjs",
  "app/adhd-test/test/model.test.cjs", "app/adhd-test/test/paywall.test.cjs", "app/adhd-test/test/personalFinding.test.cjs",
];
const env = { ...process.env, NEXT_PUBLIC_ADHD_PAYMENT_LINK_79: "https://buy.stripe.com/eVq8wO2CB5Ad1u71ws0gw0z", NEXT_PUBLIC_AUTISM_PAYMENT_LINK_79: "https://buy.stripe.com/bJe6oGfpn2o1egT1ws0gw0A" };
const results = files.map(file => {
  const result = spawnSync(process.execPath, [file], { cwd: root, env, encoding: "utf8", timeout: 120000 });
  const entry = { file, status: result.status, passed: result.status === 0, stdout: result.stdout, stderr: result.stderr, error: result.error?.message };
  console.log(`${entry.passed ? "PASS" : "FAIL"}: ${file}`);
  if (!entry.passed) console.error(entry.stderr || entry.error);
  return entry;
});
const output = path.join(root, ".artifacts/adhd-deluxe/release-tests.json");
fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, JSON.stringify(results, null, 2));
console.log(`${results.filter(item => item.passed).length}/${results.length} test programs passed.`);
process.exitCode = results.every(item => item.passed) ? 0 : 1;
