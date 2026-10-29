/* eslint-disable @typescript-eslint/no-require-imports -- reuse the exact SQL/payment/erasure harness with the new adapters. */
const run = require("./stage2-flow.test.cjs");
run(["narcissism-sjalvtest", "screening"], model => Array.from({ length: model.product === "screening_test" ? 42 : 30 }, (_, index) => index % 5))
  .catch(error => { console.error(error); process.exitCode = 1; });
