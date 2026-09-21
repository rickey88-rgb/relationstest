/* eslint-disable @typescript-eslint/no-require-imports -- Executable Node CommonJS test harness. */
const assert = require("node:assert/strict");
const test = require("node:test");
const load = require("../autism-test/test/test-loader.cjs")();
const { applyAnswer, calculate, emptyAnswers, parseState, questions, STATE_VERSION, STORAGE_KEY } = load("./app/ar-min-relation-sund/model.ts");

test("all answers 3 gives a genuinely positive result", () => {
  const result = calculate(Array(12).fill(3));
  assert.equal(result.category, "strong");
  assert.equal(result.title, "Din relation visar flera tydliga styrkor");
  assert.equal(result.weaker.length, 0);
  assert.equal(result.strengths.length, 3);
});

test("all answers 0 identifies attention areas", () => {
  const result = calculate(Array(12).fill(0));
  assert.equal(result.category, "attention");
  assert.equal(result.strengths.length, 0);
  assert.equal(result.weaker.length, 3);
});

test("safety can be strong while the other areas are weak", () => {
  const result = calculate([3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(result.strengths, ["safety"]);
  assert.ok(!result.weaker.includes("safety"));
});

test("low communication alone recommends only the broad test", () => {
  const answers = Array(12).fill(3); answers[4] = 0; answers[5] = 0;
  const result = calculate(answers);
  assert.deepEqual(result.weaker, ["communication"]);
  assert.deepEqual(result.recommendations.map((item) => item.href), ["/test"]);
});

test("low autonomy recommends the existing controller guide", () => {
  const answers = Array(12).fill(3); answers[6] = 0; answers[7] = 0;
  const result = calculate(answers);
  assert.equal(result.weaker[0], "autonomy");
  assert.equal(result.recommendations[0].href, "/kontrollerande-relation");
});

test("low stability recommends the existing trauma and love bombing guides", () => {
  const answers = Array(12).fill(3); answers[10] = 0; answers[11] = 0;
  const result = calculate(answers);
  assert.deepEqual(result.recommendations.slice(0, 2).map((item) => item.href), ["/traumabindning-i-relation", "/love-bombing-relation"]);
});

test("equal strengths use stable dimension order", () => {
  const result = calculate(Array(12).fill(3));
  assert.deepEqual(result.strengths, ["safety", "respect", "communication"]);
});

test("equal weak areas use stable dimension order", () => {
  const result = calculate(Array(12).fill(0));
  assert.deepEqual(result.weaker, ["safety", "respect", "communication"]);
});

test("an entirely middle result stays balanced", () => {
  const result = calculate(Array(12).fill(2));
  assert.equal(result.category, "balanced");
  assert.equal(result.strengths.length, 0);
  assert.equal(result.weaker.length, 0);
  assert.equal(result.middle.length, 6);
});

test("recommendations are unique and capped at three", () => {
  const result = calculate(Array(12).fill(0));
  const hrefs = result.recommendations.map((item) => item.href);
  assert.equal(new Set(hrefs).size, hrefs.length);
  assert.ok(hrefs.length <= 3);
});

test("positive result does not create a problem recommendation", () => {
  const result = calculate(Array(12).fill(3));
  assert.deepEqual(result.recommendations.map((item) => item.href), ["/sund-relation"]);
});

test("question 12 is included before completion", () => {
  let answers = emptyAnswers(); let index = 0; let completions = 0;
  for (let i = 0; i < questions.length; i++) {
    const transition = applyAnswer(answers, index, 3);
    answers = transition.answers; index = transition.nextIndex;
    if (transition.complete) completions++;
  }
  assert.equal(answers[11], 3);
  assert.equal(completions, 1);
  assert.equal(calculate(answers).category, "strong");
});

test("refresh state restores an in-progress test", () => {
  const state = { version: STATE_VERSION, answers: [3, 2, ...Array(10).fill(-1)], index: 2, view: "test" };
  assert.deepEqual(parseState(JSON.stringify(state)), state);
});

test("refresh state restores a completed result", () => {
  const state = { version: STATE_VERSION, answers: Array(12).fill(3), index: 11, view: "result" };
  assert.deepEqual(parseState(JSON.stringify(state)), state);
});

test("rapid transition model is isolated and rejects double-state corruption", () => {
  const initial = emptyAnswers();
  const first = applyAnswer(initial, 0, 3);
  const repeated = applyAnswer(first.answers, 0, 2);
  assert.equal(initial[0], -1);
  assert.equal(first.answers[0], 3);
  assert.equal(repeated.answers[0], 2);
  assert.notEqual(STORAGE_KEY, "relationsvarning_roda_flaggor_quickcheck_v1");
});
