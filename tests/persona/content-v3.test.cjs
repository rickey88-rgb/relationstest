/* eslint-disable @typescript-eslint/no-require-imports -- offline PERSONA domain checks */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../../app/autism-test/test/test-loader.cjs");
const { payloadFor, root } = require("./runtime.cjs");
const load = createLoader();
const api = { ...load(path.join(root, "app/persona/_domain/index.ts")), ...load(path.join(root, "app/persona/_domain/v3/submission.ts")), VERSIONS: load(path.join(root, "app/persona/_domain/v3/manifest.ts")).VERSIONS };
const submit = answers => ({ questionVersion: api.VERSIONS.question, reportVersion: api.VERSIONS.report, answers });
const coreWith = value => api.coreQuestions.map(question => question.reverse ? 6 - value : value);

test("each V3 chapter has ten statements and each dimension has six documented keys", () => {
  assert.equal(api.questions.length, 40);
  assert.equal(new Set(api.questions.map(question => question.prompt)).size, 40);
  assert.equal(new Set(api.questions.map(question => question.id)).size, 40);
  assert.equal(api.ratingLabels.length, 5);
  for (const chapter of api.CHAPTERS) {
    const questions = api.questions.filter(question => question.chapter === chapter.id);
    assert.equal(questions.length, 10);
    if (chapter.id === 4) assert(questions.every(question => !("dimension" in question)));
    else for (const dimension of ["E", "A", "C", "N", "O"]) {
      const keys = questions.filter(question => question.dimension === dimension);
      assert.deepEqual(keys.map(question => question.reverse).sort(), [false, true]);
      assert(keys.every(question => question.source.length > 1));
    }
  }
});
test("coding is balanced, reversible and independent from reflections", () => {
  for (const value of [1, 2, 3, 4, 5]) {
    const base = [...coreWith(value), ...Array(10).fill(0)];
    const report = api.buildPersonaReport(submit(base));
    for (const dimension of report.dimensions) {
      assert.equal(dimension.value, value);
      assert.equal(dimension.raw, value * 6);
      assert.equal(dimension.valid, 6);
      assert.equal(dimension.varied, false);
    }
    assert.deepEqual(api.buildPersonaReport(submit([...base.slice(0, 30), ...Array(10).fill(5)])).dimensions, report.dimensions);
  }
});
test("a skipped answer is absent; four is the exact threshold per dimension", () => {
  const answers = [...coreWith(4), ...Array(10).fill(0)];
  for (const index of [0, 5]) answers[index] = 0;
  const partial = api.buildPersonaReport(submit(answers));
  assert.equal(partial.quality.eligible, true);
  assert.equal(partial.dimensions[0].level, "limited");
  assert.equal(partial.dimensions[0].value, 4);
  assert.equal(partial.quality.validReflections, 0);
  answers[10] = 0;
  const insufficient = api.buildPersonaReport(submit(answers));
  assert.equal(insufficient.dimensions[0].value, null);
  assert.equal(insufficient.quality.eligible, false);
  assert.equal(api.describeAnswers(submit(answers))[0].answer, "Hoppade över");
});
test("opposing keyed extremes are identified even when raw ratings are equal", () => {
  const answers = Array(40).fill(3);
  answers[0] = 5;
  answers[5] = 5;
  const report = api.buildPersonaReport(submit(answers));
  assert.equal(report.dimensions[0].value, 3);
  assert.equal(report.dimensions[0].varied, true);
  const text = report.findings.find(finding => finding.id === "dimension-E").text;
  assert.match(text, /Jag brukar inleda samtal/);
  assert.match(text, /Jag är ofta tyst/);
});
test("five examples produce distinct signatures and source-backed reports without inferring opposite needs", () => {
  const signatures = new Set();
  for (let index = 0; index < 5; index++) {
    const input = submit(payloadFor(load, index).answers);
    const report = api.buildPersonaReport(input);
    assert.deepEqual(report, api.buildPersonaReport(JSON.parse(JSON.stringify(input))));
    assert.equal(report.sections.length, 8);
    signatures.add(report.sections.find(section => section.id === "signature").paragraphs[0].text);
    for (const section of report.sections) for (const paragraph of section.paragraphs) {
      if (paragraph.scope === "method") continue;
      assert(paragraph.findingIds.length);
      for (const id of paragraph.findingIds) {
        const finding = report.findings.find(item => item.id === id);
        assert(finding.evidence.length);
        for (const item of finding.evidence) {
          assert.equal(item.answer, input.answers[Number(item.questionId.slice(1)) - 1]);
          assert(item.answer >= 1 && item.answer <= 5);
        }
      }
    }
  }
  assert.equal(signatures.size, 5);
  const neutral = Array(40).fill(3);
  neutral[32] = 1;
  const report = api.buildPersonaReport(submit(neutral));
  assert.match(report.preview.text, /mittenalternativet/);
  assert(!report.findings.some(finding => finding.id === "listen"));
  neutral[35] = neutral[39] = 5;
  const withGoal = api.buildPersonaReport(submit(neutral));
  assert.deepEqual(withGoal.preview.findingIds, ["yes"]);
  assert(withGoal.sections.find(section => section.id === "compass").paragraphs.some(paragraph => paragraph.findingIds.includes("reply-later")));
  assert(!api.buildPersonaReport(submit(Array(40).fill(0))).findings.length);
});
test("the versioned boundary rejects sparse answers, mixed versions and client claims", () => {
  const input = submit(payloadFor(load).answers);
  for (const patch of [
    { answers: Array(40) }, { answers: [...input.answers.slice(0, 39), "4"] },
    { questionVersion: "persona-questions-v2" }, { reportVersion: "persona-report-v2" },
    { paid: true }, { findings: [] },
  ]) assert.throws(() => api.buildPersonaReport({ ...input, ...patch }));
});
