/* eslint-disable @typescript-eslint/no-require-imports -- executable product-model regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const load = require("../../autism-test/test/test-loader.cjs")();
const model = load(path.join(__dirname, "model.ts"));

assert.equal(model.questions.length, 30);
assert.equal(model.dimensions.length, 6);
const highest = model.calculate(Array(30).fill(4));
for (const dimension of model.dimensions) { assert.equal(highest.raw[dimension], 25); assert.equal(highest.normalized[dimension], 100); }
assert.equal(highest.even, true);
const lowest = model.calculate(Array(30).fill(0));
for (const dimension of model.dimensions) { assert.equal(lowest.raw[dimension], 5); assert.equal(lowest.normalized[dimension], 0); }
const dominantAnswers = Array(30).fill(3); dominantAnswers.fill(4, 0, 5);
const dominant = model.calculate(dominantAnswers);
assert.equal(dominant.highest, "overstimulation"); assert.equal(dominant.pattern, "dominant");
const contrastAnswers = Array(30).fill(1); contrastAnswers.fill(4, 0, 5); contrastAnswers.fill(0, 5, 10);
assert.equal(model.calculate(contrastAnswers).pattern, "contrast");
assert.equal(model.level(5), "Låg tendens"); assert.equal(model.level(16), "Måttlig"); assert.equal(model.level(23), "Mycket tydlig");
assert.equal(model.parseState(JSON.stringify({ version: 1, answers: Array(30).fill(2), index: 99, unlocked: true })).index, 29);
assert.equal(model.parseState(JSON.stringify({ version: 1, answers: Array(29).fill(2), index: 0, unlocked: false })), null);
assert.throws(() => model.calculate(Array(30).fill(5)));
console.log("PASS: HSP question count, dimensions, raw and normalized scoring, patterns, levels and persistence validation.");
