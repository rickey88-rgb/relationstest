/* eslint-disable @typescript-eslint/no-require-imports -- report and evidence regression tests */
const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const load = require("../../app/autism-test/test/test-loader.cjs")();
const { profiles, submission } = require("./v4-profiles.cjs");
const domain = path.resolve(__dirname, "../../app/persona/_domain");
const api = load(path.join(domain, "index.ts"));
const { buildTeaser } = load(path.join(domain, "v5/report.ts"));
const { initialDraft, parseDraft, toSubmission } = load(path.join(domain, "../test/state.ts"));
const exampleIndices = [0, 2, 4, 8, 9];
const filler = /underlaget räcker inte|inget tillräckligt tydligt samspel|ingen specifik inre spänning/i;

test("five complete profiles have useful sections and evidence across two teaser dimensions", () => {
  const signatures = new Set(), tips = new Set();
  for (const index of exampleIndices) {
    const input = submission(api, profiles[index]);
    const report = api.buildPersonaReport(input);
    const teaser = buildTeaser(input);
    assert.deepEqual(report, api.buildPersonaReport(input));
    assert(report.sections.length >= 5 && report.sections.length <= 6);
    signatures.add(report.sections[0].paragraphs[0].text);
    tips.add(report.sections.find(section => section.id === "compass").paragraphs[0].text);
    const paragraphs = report.sections.flatMap(section => {
      assert(section.paragraphs.length, section.id);
      return section.paragraphs;
    });
    assert.equal(paragraphs.length, new Set(paragraphs.map(paragraph => paragraph.text)).size);
    for (const paragraph of paragraphs) {
      assert(!filler.test(paragraph.text), paragraph.text);
      assert.notEqual(paragraph.text, teaser.text);
      for (const question of api.questions) assert(!paragraph.text.includes(question.prompt), question.id);
      for (const findingId of paragraph.findingIds) {
        const finding = report.findings.find(item => item.id === findingId);
        assert(finding.evidence.length >= 3);
        for (const item of [...finding.evidence, ...finding.counterEvidence, ...finding.context]) {
          assert.equal(item.answer, input.answers[Number(item.questionId.slice(1)) - 1]);
        }
      }
    }
    const teaserDimensions = new Set(teaser.evidence.map(item => api.coreQuestions[Number(item.questionId.slice(1)) - 1]?.dimension).filter(Boolean));
    assert(teaserDimensions.size >= 2, profiles[index].name);
  }
  assert.equal(signatures.size, exampleIndices.length);
  assert.equal(tips.size, exampleIndices.length);
});

test("a middle-range average is distinguished from polarized answers and incomplete drafts", () => {
  const input = submission(api, profiles[9]);
  const neutral = api.buildPersonaReport(input);
  assert.equal(neutral.sections.length, 5);
  assert.match(buildTeaser(input).text, /socialt sätt 3 av 5/);
  assert(neutral.findings.every(finding => finding.kind === "dimension" && finding.strength === "limited"));
  const mixed = [...input.answers];
  const o = api.coreQuestions.flatMap((item, index) => item.dimension === "O" ? [index] : []);
  for (const [index, position] of o.entries()) {
    const keyed = index < 3 ? 5 : 1;
    mixed[position] = api.coreQuestions[position].reverse ? 6 - keyed : keyed;
  }
  const result = api.buildPersonaReport({ ...input, answers: mixed });
  assert.match(result.sections.find(section => section.id === "dimensions").paragraphs[0].text, /går åt olika håll/);
  assert.equal(buildTeaser({ ...input, answers: Array(40).fill(0) }).evidence.length, 0);
  assert.equal(toSubmission(initialDraft()), null);
  for (const version of ["persona-report-v3", "persona-report-v4"]) {
    const saved = parseDraft(JSON.stringify({ ...initialDraft(), ...input, reportVersion: version, phase: "preview", cursor: 39 }));
    assert.deepEqual(toSubmission(saved), input);
    assert.notEqual(api.buildPersonaReport({ ...input, reportVersion: version }).analysisVersion, reportVersion(input));
  }
});

function reportVersion(input) {
  return api.buildPersonaReport(input).analysisVersion;
}
