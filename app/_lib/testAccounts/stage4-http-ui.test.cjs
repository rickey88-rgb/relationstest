/* eslint-disable @typescript-eslint/no-require-imports -- reuse the existing API/UI/ownership/flags and checkout transport regression harness. */
require("./stage2-http-ui.test.cjs")(["autism"])
  .catch(error => { console.error(error); process.exitCode = 1; });
