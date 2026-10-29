/* eslint-disable @typescript-eslint/no-require-imports -- reuse API/UI/flags/transport tests including legacy return paths and question versions. */
const run = require("./stage2-http-ui.test.cjs");
run(["narcissism-sjalvtest", "screening"], model => Array(model.product === "screening_test" ? 42 : 30).fill(2))
  .catch(error => { console.error(error); process.exitCode = 1; });
