/* eslint-disable @typescript-eslint/no-require-imports -- existing SQL/crypto/Stripe/journal harness, synthetic 40-answer IQ payload only. */
require("./stage2-flow.test.cjs")(["iq"], () => Array.from({length:40},(_,i)=>i%4))
 .catch(error=>{console.error(error);process.exitCode=1;});
