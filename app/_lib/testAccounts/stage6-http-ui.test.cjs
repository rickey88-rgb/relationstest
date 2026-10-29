/* eslint-disable @typescript-eslint/no-require-imports -- reuse existing synthetic security and API harness. */
require("./stage2-http-ui.test.cjs")(["narcissist-i-en-relation","traumabindningtest","psykisk-misshandel-relation"])
 .catch(error => { console.error(error); process.exitCode = 1; });
