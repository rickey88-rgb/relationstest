/* eslint-disable @typescript-eslint/no-require-imports -- isolated catalog, traceability and selection checks */
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
const load = require("../../app/autism-test/test/test-loader.cjs")();
const { analyzeInsights, CATALOG, FAMILIES, CATALOG_VERSION } = load(path.join(root, "app/persona/_domain/insights-v1/index.ts"));
const { questions } = load(path.join(root, "app/persona/_domain/v3/questions.ts"));
const original = require("./insights-v1-fixtures.cjs");
const profiles = require("./insights-v1-expanded-fixtures.cjs");
const expected = [
  ["social-initiative-private-recovery"],
  ["autonomy-with-milestones", "opinion-before-commitment", "self-direction-with-deliberation"],
  ["planning-with-stress"],
  ["ideas-with-starting-friction"],
  ["care-with-unwanted-yes", "planning-with-stress"],
  [],
  ["lead-without-spotlight"],
  ["empathy-with-slow-trust"],
  ["new-ideas-practical-filter"],
  ["imagination-and-detail"],
  ["worry-with-composure"],
  ["recovery-with-late-signals"],
  ["cooperation-with-own-voice"],
  ["commitment-with-starting-friction"],
  ["self-direction-with-deliberation"],
  [], [],
  ["autonomy-with-milestones", "care-with-unwanted-yes", "social-initiative-private-recovery"],
  ["autonomy-with-milestones"], ["ideas-with-starting-friction"],
];
const evaluation = (answers, id) => analyzeInsights(answers).evaluations.find(item => item.candidateId === id);
const empty = () => Array(40).fill(3);
const set = (answers, numbers, value = 5) => numbers.forEach(number => { answers[number - 1] = value; });

function positive(candidate) {
  const answers = empty();
  for (const condition of [...candidate.required, ...candidate.supporting]) {
    answers[Number(condition.questionId.slice(1)) - 1] = condition.direction === "high" ? 4 : 2;
  }
  return answers;
}

function audit(result, answers) {
  assert(result.insights.length <= 3 && result.advice.length <= 3);
  assert.equal(result.insights.length, result.advice.length);
  assert.equal(result.evaluations.length, CATALOG.length);
  assert.equal(result.catalogVersion, CATALOG_VERSION);
  assert(Object.isFrozen(result) && Object.isFrozen(result.evaluations));
  const messages = new Set(), adviceKeys = new Set();
  for (const insight of result.insights) {
    const candidate = CATALOG.find(item => item.id === insight.id);
    const checked = result.evaluations.find(item => item.candidateId === insight.id);
    assert(candidate && checked.qualified && checked.decision === "selected");
    assert(checked.required.every(item => item.status === "matched"));
    assert(insight.evidence.length >= candidate.minimumSupport);
    assert(!messages.has(candidate.messageKey));
    assert(!adviceKeys.has(candidate.adviceKey));
    messages.add(candidate.messageKey);
    adviceKeys.add(candidate.adviceKey);
    assert(insight.observation && insight.possibleExplanation && insight.caveat);
    assert.deepEqual(insight.limitations, candidate.limitations);
    assert(result.advice.some(item => item.insightId === insight.id && item.text === candidate.advice));
    for (const item of [...insight.evidence, ...insight.counterEvidence, ...insight.nuanceEvidence]) {
      assert.equal(answers[Number(item.questionId.slice(1)) - 1], item.answer);
    }
  }
  assert(result.evaluations.every(item => item.reason));
}

test("18 documented hypotheses span six families with valid and non-duplicated prerequisites", () => {
  assert.equal(CATALOG.length, 18);
  assert.equal(new Set(CATALOG.map(candidate => candidate.id)).size, CATALOG.length);
  assert.deepEqual(new Set(CATALOG.map(candidate => candidate.family)), new Set(Object.keys(FAMILIES)));
  for (const candidate of CATALOG) {
    assert.equal(candidate.epistemicStatus, "preliminary-hypothesis");
    assert.equal(candidate.caution, "provisional");
    assert(candidate.minimumSupport >= 3 && candidate.required.length >= 2);
    assert(candidate.limitations.length);
    const positiveConditions = [...candidate.required, ...candidate.supporting];
    assert.equal(new Set(positiveConditions.map(item => item.questionId)).size, positiveConditions.length);
    assert(positiveConditions.length >= candidate.minimumSupport);
    const referenced = [...positiveConditions, ...candidate.contradictory, ...candidate.nuances];
    assert.deepEqual(new Set(candidate.questionIds), new Set(referenced.map(item => item.questionId)));
    assert(referenced.every(item => questions.some(question => question.id === item.questionId)));
    for (const counter of candidate.contradictory) {
      assert(candidate.supporting.some(item => item.questionId === counter.questionId && item.direction !== counter.direction));
    }
  }
});

test("all 20 curated profiles give the expected traceable results, preserving the original six inputs", () => {
  assert.equal(profiles.length, 20);
  assert.deepEqual(profiles.slice(0, 6), original);
  profiles.forEach((profile, index) => {
    const before = JSON.stringify(profile.answers);
    const result = analyzeInsights(profile.answers);
    assert.deepEqual(result.insights.map(item => item.id).sort(), [...expected[index]].sort(), profile.name);
    assert.deepEqual(analyzeInsights([...profile.answers]), result);
    assert.equal(JSON.stringify(profile.answers), before);
    audit(result, profile.answers);
  });
});

test("each rule is reachable, needs every premise and keeps the minimum support threshold", () => {
  for (const candidate of CATALOG) {
    const answers = positive(candidate);
    assert(analyzeInsights(answers).insights.some(item => item.id === candidate.id), candidate.id);
    for (const condition of candidate.required) {
      const index = Number(condition.questionId.slice(1)) - 1;
      for (const value of [0, null, undefined, 3, condition.direction === "high" ? 1 : 5]) {
        const changed = [...answers];
        changed[index] = value;
        const item = evaluation(changed, candidate.id);
        assert(!item.qualified, candidate.id);
        assert(!analyzeInsights(changed).insights.some(insight => insight.id === candidate.id));
      }
    }
    if (candidate.minimumSupport > candidate.required.length) {
      const onlyRequired = empty();
      for (const condition of candidate.required) onlyRequired[Number(condition.questionId.slice(1)) - 1] = condition.direction === "high" ? 4 : 2;
      assert.equal(evaluation(onlyRequired, candidate.id).decision, "insufficient_support");
    }
  }
});

test("coexisting characteristics are recorded as nuances without reducing score or blocking hypotheses", () => {
  const cases = [
    ["autonomy-with-milestones", [18]],
    ["care-with-unwanted-yes", [35]],
    ["planning-with-stress", [4, 14, 37]],
    ["ideas-with-starting-friction", [3, 28]],
    ["opinion-before-commitment", [28]],
  ];
  for (const [id, numbers] of cases) {
    const candidate = CATALOG.find(item => item.id === id);
    const answers = positive(candidate);
    const before = evaluation(answers, id);
    set(answers, numbers);
    const after = evaluation(answers, id);
    assert.equal(after.score, before.score, id);
    assert.equal(after.qualified, true, id);
    assert.equal(after.counterEvidence.length, 0, id);
    assert(numbers.every(number => after.nuanceEvidence.some(item => item.questionId === "Q" + String(number).padStart(2, "0"))));
    assert.equal(after.caution, "with_nuance");
  }
});

test("an early pause signal cannot replace evidence for planning and worry", () => {
  const answers = empty();
  set(answers, [3, 9, 13, 37]);
  const item = evaluation(answers, "planning-with-stress");
  assert.equal(item.qualified, false);
  assert.equal(item.supportCount, 3);
  assert.equal(item.nuanceEvidence[0].questionId, "Q37");
});

test("actual opposite answers reduce evidence score and may block selection", () => {
  const answers = positive(CATALOG.find(item => item.id === "autonomy-with-milestones"));
  const baseline = evaluation(answers, "autonomy-with-milestones");
  answers[2] = 1;
  const blocked = evaluation(answers, "autonomy-with-milestones");
  assert(blocked.score < baseline.score);
  assert.equal(blocked.supportCount, 3);
  assert.equal(blocked.counterEvidence[0].questionId, "Q03");
  assert.equal(blocked.decision, "counterevidence");
  assert(!analyzeInsights(answers).insights.some(item => item.id === blocked.candidateId));
  answers[30] = 1;
  const opposed = evaluation(answers, "autonomy-with-milestones");
  assert.equal(opposed.decision, "required_not_met");
  assert(opposed.counterEvidence.some(item => item.questionId === "Q31" && item.answer === 1));
});

test("duplicate messages about starting friction and unwanted commitments are suppressed", () => {
  const start = empty();
  set(start, [15, 18, 5, 32, 23]);
  const result = analyzeInsights(start);
  assert.equal(result.evaluations.find(item => item.candidateId === "commitment-with-starting-friction").decision, "duplicate_message");
  assert(!result.insights.some(item => item.id === "commitment-with-starting-friction"));
  const mixed = analyzeInsights(original[4].answers);
  assert.equal(mixed.evaluations.find(item => item.candidateId === "opinion-before-commitment").decision, "duplicate_message");
  assert.equal(mixed.evaluations.find(item => item.candidateId === "planning-with-stress").decision, "selected");
});

test("substantial evidence overlap removes a second interpretation even when message keys differ", () => {
  const answers = empty();
  set(answers, [1, 11, 21, 26, 38, 16]);
  const result = analyzeInsights(answers);
  assert(result.insights.some(item => item.id === "social-initiative-private-recovery"));
  assert.equal(result.evaluations.find(item => item.candidateId === "lead-without-spotlight").decision, "overlapping_evidence");
});
test("neutral, weak, missing and invalid profiles are handled without manufactured support", () => {
  assert.equal(analyzeInsights(Array(40).fill(3)).insights.length, 0);
  assert.equal(analyzeInsights(Array(40)).missingQuestionIds.length, 40);
  assert.equal(analyzeInsights(Array(40).fill(0)).advice.length, 0);
  assert.equal(analyzeInsights(profiles[15].answers).insights.length, 0);
  assert.equal(analyzeInsights(profiles[16].answers).insights.length, 0);
  for (const input of [null, {}, "answers", [], Array(39).fill(3), Array(41).fill(3)]) assert.throws(() => analyzeInsights(input));
  for (const value of [-1, 6, NaN, Infinity, "4", false, {}, 2.5]) {
    const answers = empty();
    answers[0] = value;
    assert.throws(() => analyzeInsights(answers));
  }
});

test("1000 deterministic variations respect limits, uniqueness, traceability and opposite premises", () => {
  let seed = 713;
  for (let index = 0; index < 1000; index++) {
    const answers = Array.from({ length: 40 }, () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed % 6;
    });
    const result = analyzeInsights(answers);
    audit(result, answers);
    assert.deepEqual(result, analyzeInsights(answers));
    const premises = result.insights.flatMap(item => CATALOG.find(candidate => candidate.id === item.id).required);
    for (const premise of premises) {
      assert(!premises.some(other => other.questionId === premise.questionId && other.direction !== premise.direction));
    }
  }
  const saturated = analyzeInsights(Array(40).fill(5));
  assert.equal(saturated.insights.length, 3);
  assert(saturated.evaluations.some(item => item.decision === "limit"));
});

test("selected interpretations are textually distinct and do not quote question wording", () => {
  for (const { answers } of profiles) {
    const result = analyzeInsights(answers);
    const messages = result.insights.flatMap(item => [item.observation, item.possibleExplanation]);
    assert.equal(new Set(messages).size, messages.length);
    for (const message of messages) {
      for (const question of questions) assert(!message.includes(question.prompt), question.id);
    }
  }
});

test("engine remains local and unconnected to active reports, scoring and payment entry points", () => {
  const seen = new Set();
  function visit(file) {
    if (seen.has(file)) return;
    seen.add(file);
    const text = fs.readFileSync(file, "utf8");
    assert(!/process\.env|Date\.now|Math\.random|\bfetch\s*\(/.test(text), file);
    for (const match of text.matchAll(/from\s+["']([^"']+)["']/g)) {
      assert(match[1].startsWith("."), file);
      const dependency = path.resolve(path.dirname(file), match[1] + ".ts");
      assert(!/\/(registry|report|score)\.ts$/.test(dependency.replaceAll("\\", "/")), dependency);
      visit(dependency);
    }
  }
  visit(path.join(root, "app/persona/_domain/insights-v1/index.ts"));
  for (const file of ["app/persona/_domain/index.ts", "app/persona/_domain/registry.ts", "app/persona/test/actions.ts", "app/persona/dev-report/actions.ts", "app/_lib/testAccounts/adapters/persona.ts"]) {
    assert(!fs.readFileSync(path.join(root, file), "utf8").includes("insights-v1"), file);
  }
});
