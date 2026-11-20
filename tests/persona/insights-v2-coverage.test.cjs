/* eslint-disable @typescript-eslint/no-require-imports -- isolated synthetic coverage and advice checks */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const load = require("../../app/autism-test/test/test-loader.cjs")();
const { analyzeInsights, CATALOG, CATALOG_VERSION } = load(path.resolve(__dirname, "../../app/persona/_domain/insights-v1/index.ts"));
const { coreQuestions } = load(path.resolve(__dirname, "../../app/persona/_domain/v3/questions.ts"));
const profiles = require("./insights-v2-full-fixtures.cjs");
const expected = [
  [
    "autonomy-with-milestones",
    "cooperation-with-own-voice",
    "depth-with-self-direction"
  ],
  [
    "autonomy-with-milestones",
    "new-ideas-practical-filter",
    "quiet-contact-private-recovery"
  ],
  [
    "depth-with-self-direction",
    "quiet-contact-private-recovery"
  ],
  [
    "autonomy-with-milestones",
    "self-direction-with-deliberation"
  ],
  [
    "depth-with-self-direction",
    "imagination-and-detail"
  ],
  [
    "emotional-signals-with-pause-awareness",
    "ideas-with-starting-friction"
  ],
  [
    "ideas-with-starting-friction",
    "recovery-with-late-signals"
  ],
  [
    "self-direction-with-deliberation"
  ],
  [
    "cooperation-with-own-voice"
  ],
  [
    "empathy-with-slow-trust",
    "quiet-contact-private-recovery"
  ],
  [
    "lead-without-spotlight"
  ],
  [
    "social-initiative-private-recovery"
  ],
  [
    "ideas-with-starting-friction",
    "autonomy-with-milestones",
    "depth-with-self-direction"
  ],
  [
    "autonomy-with-milestones",
    "cooperation-with-own-voice",
    "commitment-with-starting-friction"
  ],
  [
    "care-with-unwanted-yes",
    "cooperation-with-own-voice",
    "planning-with-stress"
  ],
  [
    "opinion-before-commitment"
  ],
  [
    "autonomy-with-milestones",
    "new-ideas-practical-filter"
  ],
  [
    "imagination-and-detail"
  ],
  [],
  [
    "autonomy-with-milestones",
    "care-with-unwanted-yes",
    "cooperation-with-own-voice"
  ],
  [
    "self-direction-with-deliberation"
  ],
  [
    "social-initiative-private-recovery",
    "autonomy-with-milestones",
    "care-with-unwanted-yes"
  ],
  [],
  []
];
const newIds = ["quiet-contact-private-recovery", "depth-with-self-direction", "emotional-signals-with-pause-awareness"];
function evaluate(answers, id) { return analyzeInsights(answers).evaluations.find(e => e.candidateId === id); }

test("24 complete authored profiles cover dimensions, reflections, extremes and weak controls", () => {
  assert.equal(profiles.length, 24);
  assert.equal(new Set(profiles.map(p => p.id)).size, 24);
  const groups = new Set(profiles.map(p => p.group));
  for (const group of ["stabil", "styrkor", "återhållsam", "höga", "låga", "motsägelsefull", "neutral"]) assert(groups.has(group));
  let neutral = 0;
  for (const p of profiles) {
    assert.equal(p.answers.length, 40);
    assert(p.answers.every(v => Number.isInteger(v) && v >= 1 && v <= 5));
    assert.equal(p.reflections.length, 10);
    assert.deepEqual(p.answers.slice(30), p.reflections);
    const positions = {};
    coreQuestions.forEach((q, i) => {
      const slot = positions[q.dimension] ?? 0;
      assert.equal(q.reverse ? 6 - p.answers[i] : p.answers[i], p.dimensions[q.dimension][slot]);
      positions[q.dimension] = slot + 1;
    });
    neutral += p.answers.filter(v => v === 3).length;
    if (p.group !== "neutral") assert(p.answers.filter(v => v === 3).length < 20, p.id);
  }
  assert(neutral / (profiles.length * 40) < 0.30);
});

test("full profiles produce curated outcomes, reproducible traces and answer-backed advice", () => {
  assert.equal(CATALOG_VERSION, "persona-insights-catalog-v1.2");
  profiles.forEach((p, i) => {
    const original = JSON.stringify(p.answers), r = analyzeInsights(p.answers);
    assert.deepEqual(r.insights.map(x => x.id), expected[i], p.id);
    assert.deepEqual(r, analyzeInsights([...p.answers]));
    assert.equal(JSON.stringify(p.answers), original);
    assert.equal(r.missingQuestionIds.length, 0);
    assert.equal(r.answered, 40);
    assert(r.insights.length <= 3 && r.advice.length <= 3);
    assert.equal(r.insights.length, r.advice.length);
    const premises = [];
    const selected = [];
    for (const insight of r.insights) {
      const c = CATALOG.find(c => c.id === insight.id);
      const e = r.evaluations.find(e => e.candidateId === insight.id);
      assert(e.required.every(t => t.status === "matched"));
      premises.push(...c.required);
      assert(!selected.some(other => c.messageKey === other.messageKey || c.adviceKey === other.adviceKey));
      for (const other of selected) {
        const a = new Set(e.evidence.map(t => t.questionId));
        const b = new Set(r.evaluations.find(t => t.candidateId === other.id).evidence.map(t => t.questionId));
        assert([...a].filter(t => b.has(t)).length / new Set([...a, ...b]).size < 0.5);
      }
      selected.push(c);
      const advice = r.advice.find(a => a.insightId === insight.id);
      assert.equal(advice.text, c.advice);
      assert.deepEqual(advice.evidence, insight.evidence);
      assert.deepEqual(advice.counterEvidence, insight.counterEvidence);
      assert.deepEqual(advice.nuanceEvidence, insight.nuanceEvidence);
      for (const item of [...advice.evidence, ...advice.counterEvidence, ...advice.nuanceEvidence]) {
        assert.equal(p.answers[Number(item.questionId.slice(1)) - 1], item.answer);
      }
    }
    for (const t of premises) assert(!premises.some(o => o.questionId === t.questionId && o.direction !== t.direction));
  });
  for (const id of newIds) assert(profiles.some(p => analyzeInsights(p.answers).insights.some(i => i.id === id)), id);
});

test("low promise keeping nuances autonomy without replacing plan support", () => {
  const a = Array(40).fill(3);
  for (const n of [31, 32, 3]) a[n - 1] = 5;
  const baseline = evaluate(a, "autonomy-with-milestones");
  a[22] = 1;
  const low = evaluate(a, "autonomy-with-milestones");
  assert(low.qualified);
  assert.equal(low.score, baseline.score);
  assert.equal(low.counterEvidence.length, 0);
  assert(low.nuanceEvidence.some(t => t.questionId === "Q23" && t.answer === 1));
  assert.equal(low.caution, "with_nuance");
  a[2] = 3;
  assert.equal(evaluate(a, "autonomy-with-milestones").decision, "insufficient_support");
});

test("new observations require every premise and opposite answers remain traceable", () => {
  for (const id of newIds) {
    const c = CATALOG.find(c => c.id === id);
    const positive = Array(40).fill(3);
    for (const t of c.required) positive[Number(t.questionId.slice(1)) - 1] = t.direction === "high" ? 4 : 2;
    assert(evaluate(positive, id).qualified);
    for (const t of c.required) for (const value of [3, null, t.direction === "high" ? 1 : 5]) {
      const a = [...positive]; a[Number(t.questionId.slice(1)) - 1] = value;
      const e = evaluate(a, id);
      assert(!e.qualified);
      if (value !== null && value !== 3) assert(e.counterEvidence.some(x => x.questionId === t.questionId));
    }
  }
});

test("social recovery variants cannot create duplicate messages", () => {
  const p = profiles.find(p => p.id === "F12");
  const r = analyzeInsights(p.answers);
  assert(r.insights.some(i => i.id === "social-initiative-private-recovery"));
  assert.equal(r.evaluations.find(e => e.candidateId === "quiet-contact-private-recovery").decision, "duplicate_message");
});

test("low and neutral profiles retain abstention; saturated profiles remain cautious", () => {
  for (const id of ["F19", "F23", "F24"]) assert.equal(analyzeInsights(profiles.find(p => p.id === id).answers).insights.length, 0);
  const saturated = analyzeInsights(profiles.find(p => p.id === "F22").answers);
  assert.equal(saturated.insights.length, 3);
  assert(saturated.insights.every(i => i.caveat && i.limitations.length));
});
