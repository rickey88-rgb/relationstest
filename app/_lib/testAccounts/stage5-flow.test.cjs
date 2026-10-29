/* eslint-disable @typescript-eslint/no-require-imports -- same real SQL/crypto/verifier harness, only synthetic Stripe/R2 data. */
require("./stage2-flow.test.cjs")(["anknytningstest", "medberoendetest", "gaslightingtest"])
  .catch(error => { console.error(error); process.exitCode = 1; });
