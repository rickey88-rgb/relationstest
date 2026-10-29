/* eslint-disable @typescript-eslint/no-require-imports -- shared checkout, ownership, report and flags harness; no timings transported. */
require("./stage2-http-ui.test.cjs")(["iq"], model => Array(model.product === "iq_test" ? 40 : 30).fill(2))
 .catch(error=>{console.error(error);process.exitCode=1;});
