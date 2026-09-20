/* eslint-disable @typescript-eslint/no-require-imports -- Node test for presentation copy. */
const assert = require('node:assert/strict');
const path = require('node:path');
const load = require('../autism-test/test/test-loader.cjs')();
const { buildPaywallTeaser } = load(path.join(__dirname, 'paywallTeaser.ts'));

const cases = [
  [[0, 0, 0], 'Det som inte syns i dina svar är också viktigt'],
  [[39, 20, 0], 'Det som inte syns i dina svar är också viktigt'],
  [[60, 35, 10], 'Ett mönster i dina svar är svårt att bortse från'],
  [[60, 36, 10], 'En del av ditt resultat sticker ut från resten'],
  [[45, 30, 10], 'En del av ditt resultat sticker ut från resten'],
  [[44, 30, 10], 'Helheten blir tydligare när dina svar läggs ihop'],
  [[80, 70, 0], 'Helheten blir tydligare när dina svar läggs ihop'],
];

for (const [scores, title] of cases) {
  const original = [...scores];
  const teaser = buildPaywallTeaser(scores);
  assert.equal(teaser.title, title);
  assert.deepEqual(scores, original);
  assert(!teaser.title.includes('motsägelse'));
}
