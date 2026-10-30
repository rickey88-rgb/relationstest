/* eslint-disable @typescript-eslint/no-require-imports -- generates synthetic cross-runtime fixtures. */
const fs=require("node:fs"),path=require("node:path"),{randomBytes}=require("node:crypto");
const load=require("../app/autism-test/test/test-loader.cjs")();
const models=load(path.resolve(__dirname,"../app/_lib/testAccounts/adapter.ts")).registeredAdapters();
const seal=load(path.resolve(__dirname,"../app/_lib/testAccounts/crypto.server.ts")).seal;
process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=Buffer.alloc(32,7).toString("base64url");
let seed=17; const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
const cases=[];
for(const model of models) {
  let count=0;
  for(let n=1;n<=100;n++){try{model.parse({answers:Array(n).fill(0),questionVersion:model.questionVersion,reportVersion:model.reportVersion});count=n;break;}catch{}}
  if(!count)throw new Error("No valid fixture");
  for(let i=0;i<80;i++){
    const input={answers:Array.from({length:count},()=>i<4?i:Math.floor(random()*4)),questionVersion:model.questionVersion,reportVersion:model.reportVersion};
    const answers=model.parse(input),context="synthetic-"+model.product;
    cases.push({product:model.product,input,result:model.calculate(answers),context,ciphertext:seal(input,context)});
  }
}
fs.writeFileSync(path.resolve(__dirname,"../supabase/functions/customer-tests/_fixtures.json"),JSON.stringify({cases,syntheticProof:randomBytes(32).toString("base64url")}));
console.log("Prepared "+cases.length+" synthetic cross-runtime comparisons for 15 tests.");
