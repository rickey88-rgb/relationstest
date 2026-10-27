/* eslint-disable @typescript-eslint/no-require-imports -- standalone local deployment preparation. */
const fs = require('node:fs');
const config = require('./pricing79.json');
const allowed = new Set([...Object.keys(config.referencePriceIds), 'audhd_bok', 'autism_bok', 'adhd_deluxe']);
function validate(map) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) throw new Error('Invalid product map');
  const owners = new Map();
  for (const [product, entry] of Object.entries(map)) {
    if (!allowed.has(product) || !entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error('Invalid product entry');
    for (const [field, prefix] of [['priceIds', 'price_'], ['paymentLinkIds', 'plink_']]) {
      if (entry[field] === undefined) continue;
      if (!Array.isArray(entry[field])) throw new Error('Invalid identifier array');
      for (const id of entry[field]) {
        if (typeof id !== 'string' || !new RegExp('^' + prefix + '[A-Za-z0-9]+$').test(id)) throw new Error('Invalid identifier');
        if (owners.has(id) && owners.get(id) !== product) throw new Error('Identifier mapped to multiple products');
        owners.set(id, product);
      }
    }
  }
  return map;
}
function mergeProductMap(existing, additions = config.productMapMerge) {
  validate(existing); validate(additions);
  const merged = structuredClone(existing);
  for (const [product, entry] of Object.entries(additions)) {
    if (!['adhd_test', 'autism_test'].includes(product)) throw new Error('Price release may only add ADHD/autism identifiers');
    merged[product] ??= {};
    for (const field of ['priceIds', 'paymentLinkIds']) {
      merged[product][field] = [...new Set([...(merged[product][field] ?? []), ...(entry[field] ?? [])])];
    }
  }
  validate(merged);
  return merged;
}
function verifyCoverage(map) {
  validate(map);
  for (const [product, id] of Object.entries(config.referencePriceIds)) {
    if (!map[product]?.priceIds?.includes(id)) throw new Error('Missing verified historical/reference test price');
  }
  for (const [product, entry] of Object.entries(config.productMapMerge)) {
    for (const field of ['priceIds', 'paymentLinkIds']) {
      if (!entry[field].every(id => map[product]?.[field]?.includes(id))) throw new Error('Missing old/new ADHD or autism identifier');
    }
  }
  return true;
}
module.exports = { mergeProductMap, verifyCoverage };
if (require.main === module) {
  try {
    const [, , input, output] = process.argv;
    if (!input || !output) throw new Error('Provide existing-map JSON file and a new output file');
    const merged = mergeProductMap(JSON.parse(fs.readFileSync(input, 'utf8')));
    verifyCoverage(merged);
    fs.writeFileSync(output, JSON.stringify(merged, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    console.log('PASS: additive map prepared; all 15 reference test prices and old/new ADHD/autism identifiers retained. No remote settings changed.');
  } catch {
    console.error('Map preparation stopped: check input format, all 15 test prices, identifier ownership and unused output path. No values logged.');
    process.exitCode = 1;
  }
}
