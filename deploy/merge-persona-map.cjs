/* eslint-disable @typescript-eslint/no-require-imports -- pure config preparation; no provider, env or secret access. */
function mergePersonaMap(existing,price) {
  if(!existing||typeof existing!=="object"||Array.isArray(existing)||!/^price_[A-Za-z0-9]+$/.test(price))throw Error("Invalid product map or PERSONA Price ID");
  const result=structuredClone(existing);
  for(const [product,entry] of Object.entries(result))if(product!=="persona_test"&&entry?.priceIds?.includes(price))throw Error("Price already belongs to another product");
  const prior=result.persona_test??{priceIds:[],paymentLinkIds:[]};
  if(!Array.isArray(prior.priceIds)||!Array.isArray(prior.paymentLinkIds)||prior.paymentLinkIds.length)throw Error("PERSONA only supports server-created Checkout");
  result.persona_test={...prior,priceIds:[...new Set([...prior.priceIds,price])],paymentLinkIds:[]};
  return result;
}
module.exports={mergePersonaMap};
if(require.main===module) {
  const fs=require("node:fs");
  const [file,price]=process.argv.slice(2);
  if(!file||!price)throw Error("Usage: node deploy/merge-persona-map.cjs reviewed-map.json price_PERSONA");
  process.stdout.write(JSON.stringify(mergePersonaMap(JSON.parse(fs.readFileSync(file,"utf8")),price),null,2)+"\n");
}
