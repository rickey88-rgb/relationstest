/* eslint-disable @typescript-eslint/no-require-imports -- Executable scoring regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const load = require("../../autism-test/test/test-loader.cjs")();
const model = load(path.join(__dirname, "model.ts"));

assert.equal(model.questions.length, 40);
assert.equal(new Set(model.questions.map(question => question.id)).size, 40);
assert(model.questions.every(question => question.options.length === 4 && question.correct >= 0 && question.correct < question.options.length));
assert.equal(model.questions.find(question => question.id === "m3")?.prompt, "Vilket tal saknas?");
assert.deepEqual(model.questions.find(question => question.id === "m6"), {
  id: "m6", area: "matrices", difficulty: "medium", weight: 1.25,
  prompt: "Vilken figur saknas i matrisen?", options: ["△△△", "▲▲▲", "△△", "○○○"], correct: 0,
  visual: { size: 2, cells: ["●", "○○", "▲▲", "?"], options: ["△△△", "▲▲▲", "△△", "○○○"] },
});
assert.deepEqual(Object.fromEntries(model.areas.map(area => [area, model.questions.filter(question => question.area === area).length])), { matrices: 10, logic: 8, numeric: 8, verbal: 7, spatial: 7 });
assert.deepEqual(Object.fromEntries(["easy", "medium", "hard"].map(difficulty => [difficulty, model.questions.filter(question => question.difficulty === difficulty).length])), { easy: 12, medium: 16, hard: 12 });
assert.equal(model.maxWeightedRaw, 50);
assert.equal(model.estimateIq(0), 75); assert.equal(model.estimateIq(20), 95); assert.equal(model.estimateIq(50), 130);
const full = model.calculate(model.questions.map(question => question.correct));
assert.equal(full.weightedRaw, 50); assert.equal(full.iqEstimate, 130); assert(model.areas.every(area => full.scores[area] === 100)); assert.equal(full.strongest, null); assert.equal(full.weakest, null);
const evenReport = model.buildProfileReport(full);
assert.equal(evenReport.evenness, "even"); assert.equal(evenReport.topAreas.length, 5); assert.equal(evenReport.bottomAreas.length, 5); assert.equal(evenReport.insights.length, 3); assert(evenReport.areaReports.every(item => item.position === "near_average"));
assert.notEqual(full.raw.matrices, full.raw.logic); // Equal normalized scores must still remain a tie when raw totals differ.
const empty = model.calculate(model.questions.map(question => (question.correct + 1) % 4));
assert.equal(empty.weightedRaw, 0); assert.equal(empty.iqEstimate, 75);
const middle = model.calculate(model.questions.map((question, index) => index % 2 === 0 ? question.correct : (question.correct + 1) % 4));
assert(middle.iqEstimate >= 90 && middle.iqEstimate <= 110); assert(model.buildProfileReport(middle).areaReports.every(item => Number.isFinite(item.score)));
const uneven = model.calculate(model.questions.map(question => question.area === "matrices" ? question.correct : (question.correct + 1) % 4));
const unevenReport = model.buildProfileReport(uneven);
assert.equal(unevenReport.evenness, "very_varied"); assert.deepEqual(unevenReport.topAreas, ["matrices"]); assert.equal(unevenReport.bottomAreas.length, 4); assert(unevenReport.teaser.includes("varierade tydligt")); assert(unevenReport.areaReports.every(item => Number.isFinite(item.score) && item.interpretation.length > 0));
const topTie = model.calculate(model.questions.map(question => ["matrices", "logic"].includes(question.area) ? question.correct : (question.correct + 1) % 4));
const topTieReport = model.buildProfileReport(topTie);
assert.deepEqual(topTieReport.topAreas, ["matrices", "logic"]); assert.equal(topTie.strongest, null);
const bottomTie = model.calculate(model.questions.map(question => question.area === "matrices" ? question.correct : (question.correct + 1) % 4));
const bottomTieReport = model.buildProfileReport(bottomTie);
assert.equal(bottomTieReport.bottomAreas.length, 4); assert.equal(bottomTie.weakest, null);
assert(model.parseState(JSON.stringify({ version: 2, answers: model.emptyAnswers(), index: 0, unlocked: false })));
assert.equal(model.parseState(JSON.stringify({ version: 2, answers: Array(39).fill(0), index: 0, unlocked: false })), null);
console.log("PASS: IQ question bank, cautious estimate scale, profile report variants, tie handling and persisted-state validation.");
