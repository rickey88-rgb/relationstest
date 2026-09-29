/* eslint-disable @typescript-eslint/no-require-imports -- executable product-model regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const load = require("../../autism-test/test/test-loader.cjs")();
const model = load(path.join(__dirname, "model.ts"));

assert.equal(model.questions.length, 30);
assert.deepEqual(model.dimensions, ["reexperiencing", "avoidance", "thoughtsFeelings", "hyperarousal", "dailyImpact"]);
const highest = model.calculate(Array(30).fill(4));
for (const dimension of model.dimensions) assert.equal(highest.scores[dimension], 100);
assert.equal(highest.totalRaw, 120);
const lowest = model.calculate(Array(30).fill(0));
for (const dimension of model.dimensions) assert.equal(lowest.scores[dimension], 0);
assert.equal(lowest.totalRaw, 0);
const uneven = Array(30).fill(0); uneven.fill(4, 0, 6);
const result = model.calculate(uneven);
assert.equal(result.highest, "reexperiencing");
assert.equal(result.scores.reexperiencing, 100);
assert.equal(result.scores.avoidance, 0);
assert.equal(model.symptomLevel(0), "Få PTSD-relaterade symtom framträder i svaren");
assert.equal(model.symptomLevel(55), "Tydliga PTSD-relaterade symtom framträder i svaren");
assert.equal(model.parseState(JSON.stringify({ version: 1, answers: Array(30).fill(2), index: 99, unlocked: true })).index, 29);
assert.equal(model.parseState(JSON.stringify({ version: 1, answers: Array(29).fill(2), index: 0, unlocked: false })), null);
assert.throws(() => model.calculate(Array(30).fill(5)));
console.log("PASS: PTSD question count, five areas, 0–4 scoring, normalization, totals and persistence validation.");
