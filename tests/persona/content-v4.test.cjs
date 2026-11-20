/* eslint-disable @typescript-eslint/no-require-imports -- synthetic analysis and editorial regression checks */
const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const load = require("../../app/autism-test/test/test-loader.cjs")();
const { profiles, submission } = require("./v4-profiles.cjs");
const active = load(path.resolve(__dirname, "../../app/persona/_domain/index.ts"));
const api = { ...active, VERSIONS: load(path.resolve(__dirname, "../../app/persona/_domain/v4/manifest.ts")).VERSIONS };
const { analyze } = load(path.resolve(__dirname, "../../app/persona/_domain/v4/analysis.ts"));
const { buildTeaser } = load(path.resolve(__dirname, "../../app/persona/_domain/v4/report.ts"));
const { parseDraft, toSubmission, initialDraft } = load(path.resolve(__dirname, "../../app/persona/test/state.ts"));

function similar(a, b) {
  const grams = text => {
    const words = text.toLowerCase().match(/\p{L}+/gu) ?? [];
    return new Set(words.slice(2).map((_, index) => words.slice(index, index + 3).join(" ")));
  };
  const left = grams(a), right = grams(b);
  return [...left].filter(gram => right.has(gram)).length / Math.max(1, Math.min(left.size, right.size));
}

test("ten synthetic profiles give reproducible, grounded and distinct portraits", () => {
  const names = new Set();
  for (const profile of profiles) {
    const input = submission(api, profile);
    const report = api.buildPersonaReport(input), teaser = buildTeaser(input);
    assert.deepEqual(api.buildPersonaReport({ ...input, answers: [...input.answers] }), report);
    assert.deepEqual(buildTeaser(input), teaser);
    assert.equal(report.sections.length, 10);
    const lead = report.findings.find(finding => finding.supports.includes("signature"));
    assert.equal(lead?.ruleId, profile.expected, profile.name);
    const authored = report.sections.flatMap(section => section.paragraphs).filter(paragraph => paragraph.findingIds.length);
    assert.equal(new Set(authored.map(paragraph => paragraph.text)).size, authored.length, profile.name);
    names.add(report.sections[0].paragraphs[0].text);
    for (const paragraph of authored) {
      for (const id of paragraph.findingIds) {
        const finding = report.findings.find(item => item.id === id);
        assert(finding && finding.evidence.length >= 3, id);
        for (const entry of [...finding.evidence, ...finding.counterEvidence, ...(finding.context ?? [])]) {
          assert.equal(entry.answer, input.answers[Number(entry.questionId.slice(1)) - 1], id);
        }
      }
    }
    for (const text of [...authored.map(paragraph => paragraph.text), teaser.text, teaser.why]) {
      for (const question of api.questions) assert(similar(text, question.prompt) < 0.65, text + " ~ " + question.id);
    }
    for (const paragraph of authored) {
      assert(!paragraph.text.includes(teaser.text));
      assert(similar(paragraph.text, teaser.text) < 0.55);
    }
  }
  assert.equal(names.size, 10);
});

test("weak and conflicting support changes interpretation instead of forcing a trait", () => {
  const input = submission(api, profiles[0]);
  const social = api.coreQuestions.flatMap((question, index) => question.dimension === "E" ? [index] : []);
  const first = social[0];
  const neighbor = [...input.answers];
  neighbor[first] = 3;
  assert.equal(analyze(neighbor).candidates[0].pattern.id, "social-motion");
  input.answers[first] = 6 - input.answers[first];
  const conditional = analyze(input.answers).candidates[0];
  assert.equal(conditional.pattern.id, "social-motion");
  assert(conditional.qualified);
  assert.equal(conditional.counterEvidence.length, 1);
  assert(buildTeaser(input).qualified);
  for (const index of social.slice(1, 4)) input.answers[index] = 0;
  assert(!analyze(input.answers).candidates.some(candidate => candidate.pattern.keys.includes("E+")));
  assert(!api.buildPersonaReport(input).quality.eligible);
  const neutral = api.buildPersonaReport(submission(api, profiles[9]));
  assert.equal(neutral.findings.length, 0);
  assert.match(neutral.sections.find(section => section.id === "tensions").paragraphs[0].text, /Ingen specifik/);
});

test("V3 purchased reports are unchanged; a local draft with the same questions uses the active report version", () => {
  const input = submission(api, profiles[0]);
  const legacy = { ...input, reportVersion: "persona-report-v3" };
  const old = api.buildPersonaReport(legacy);
  assert.equal(old.sections.length, 8);
  assert.equal(old.analysisVersion, "persona-analysis-v3");
  assert.throws(() => api.parseSubmission(legacy));
  const restored = parseDraft(JSON.stringify({ ...initialDraft(), ...legacy, cursor: 39, phase: "preview" }));
  assert.deepEqual(toSubmission(restored), { ...input, reportVersion: active.VERSIONS.report });
  assert.deepEqual(active.describeAnswers(toSubmission(restored)), api.resolvePersonaVersion(legacy.questionVersion, legacy.reportVersion).describeAnswers(legacy));
});
