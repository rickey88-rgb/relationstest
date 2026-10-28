/* eslint-disable @typescript-eslint/no-require-imports -- isolated release regression runner. */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const files = [
  "app/_lib/bookProducts.server.test.cjs",
  "app/_lib/bookOffers.test.cjs",
  "app/_lib/bookAccess.server.test.cjs",
  "app/_lib/audhdBookVerification.server.test.cjs",
  "app/_lib/autismBookVerification.server.test.cjs",
  "app/_components/crossSellConfig.test.cjs",
  "app/api/books/autism-bok/download/route.test.cjs",
  "app/api/books/autism-bok/download/purchase-flow.test.cjs",
  "app/api/books/audhd-bok/download/route.test.cjs",
  "app/api/books/adhd-deluxe/download/route.test.cjs",
  "app/autism-bok/page.test.cjs",
  "app/autism-bok/tack/klart/page.test.cjs",
  "app/autism-test/test/model.test.cjs",
  "app/autism-test/test/flow.test.cjs",
  "app/autism-test/test/recovery-analytics.test.cjs",
];
const env = {
  ...process.env,
  NEXT_PUBLIC_AUTISM_PAYMENT_LINK_79: "https://buy.stripe.com/bJe6oGfpn2o1egT1ws0gw0A",
  NEXT_PUBLIC_ADHD_PAYMENT_LINK_79: "https://buy.stripe.com/eVq8wO2CB5Ad1u71ws0gw0z",
};
const results = files.map(file => {
  const result = spawnSync(process.execPath, [file], { cwd: root, env, encoding: "utf8", timeout: 120000 });
  const item = { file, status: result.status, passed: result.status === 0, stdout: result.stdout, stderr: result.stderr, error: result.error?.message };
  console.log(`${item.passed ? "PASS" : "FAIL"}: ${file}`);
  if (!item.passed) console.error(item.stderr || item.error);
  return item;
});
const outputIndex = process.argv.indexOf("--output");
if (outputIndex !== -1 && process.argv[outputIndex + 1]) fs.writeFileSync(process.argv[outputIndex + 1], JSON.stringify(results, null, 2));
console.log(`${results.filter(item => item.passed).length}/${results.length} test programs passed.`);
process.exitCode = results.every(item => item.passed) ? 0 : 1;
