/* eslint-disable @typescript-eslint/no-require-imports -- Executable Node CommonJS test harness. */
const assert = require("node:assert/strict");
const test = require("node:test");
const load = require("../autism-test/test/test-loader.cjs")();
const { applyAnswer, calculate, dimensions, emptyAnswers, parseState, questions, STATE_VERSION } = load("./app/roda-flaggor-relation-test/model.ts");

test("all Aldrig gives a truthful low result", () => {
  const result = calculate(Array(12).fill(0));
  assert.equal(result.category, "low");
  assert.equal(result.prominent.length, 0);
  assert.equal(result.title, "Inget tydligt mönster sticker ut");
  assert.equal(result.recommendations[0].href, "/test");
});

test("all Mycket ofta ranks all six dimensions and shows at most three", () => {
  const result = calculate(Array(12).fill(3));
  assert.equal(result.category, "multiple");
  assert.deepEqual(Object.values(result.scores), Array(6).fill(6));
  assert.equal(result.prominent.length, 3);
  assert.ok(result.recommendations.length <= 3);
});

test("a single high control dimension is dominant", () => {
  const result = calculate([3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(result.category, "single");
  assert.equal(result.ranked[0], "control");
  assert.equal(result.recommendations[0].href, "/psykisk-misshandel-relation/test");
});

test("a single high gaslighting dimension recommends the existing gaslighting test", () => {
  const result = calculate([0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(result.ranked[0], "gaslighting");
  assert.equal(result.recommendations[0].href, "/gaslightingtest/test");
});

test("two tied high dimensions are deterministic", () => {
  const result = calculate([3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(result.ranked.slice(0, 2), ["control", "gaslighting"]);
  assert.equal(result.category, "multiple");
});

test("three high dimensions remain ordered and capped", () => {
  const result = calculate([3, 3, 2, 3, 2, 2, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(result.prominent, ["control", "gaslighting", "devaluation"]);
  assert.ok(result.recommendations.length <= 3);
});

test("rapid deterministic transitions include the last answer exactly once", () => {
  let answers = emptyAnswers();
  let index = 0;
  let completions = 0;
  for (let i = 0; i < questions.length; i++) {
    const transition = applyAnswer(answers, index, i % 4);
    answers = transition.answers;
    index = transition.nextIndex;
    if (transition.complete) completions++;
  }
  assert.equal(completions, 1);
  assert.equal(answers.length, 12);
  assert.equal(answers[11], 3);
  assert.doesNotThrow(() => calculate(answers));
});

test("saved state is isolated and validated", () => {
  const valid = { version: STATE_VERSION, answers: Array(12).fill(1), index: 7, view: "test" };
  assert.deepEqual(parseState(JSON.stringify(valid)), valid);
  assert.equal(parseState(JSON.stringify({ ...valid, version: 2 })), null);
  assert.equal(parseState(JSON.stringify({ ...valid, answers: Array(30).fill(1) })), null);
  assert.equal(dimensions.length, 6);
});
