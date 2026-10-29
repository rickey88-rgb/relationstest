/* eslint-disable @typescript-eslint/no-require-imports -- existing API/UI/flags/transport harness for the three new adapters. */
require("./stage2-http-ui.test.cjs")(["anknytningstest", "medberoendetest", "gaslightingtest"])
  .catch(error => { console.error(error); process.exitCode = 1; });
