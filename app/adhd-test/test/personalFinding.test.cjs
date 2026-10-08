/* eslint-disable @typescript-eslint/no-require-imports -- Executable Node regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../../autism-test/test/test-loader.cjs");

const load = createLoader();
const model = load(path.join(__dirname, "model.ts"));
const interpretation = load(path.join(__dirname, "interpretation.ts"));

function answersFor(totals) {
  return totals.flatMap((total) => {
    let remaining = total;
    return Array.from({ length: 5 }, () => {
      const answer = Math.min(4, remaining);
      remaining -= answer;
      return answer;
    });
  });
}

function findingFor(totals) {
  return interpretation.personalFinding(model.calculate(answersFor(totals)));
}

const cases = [
  { name: "low", totals: [2, 3, 1, 0, 2, 4], kind: "low", phrase: "genomgående låga" },
  { name: "executive pair", totals: [15, 16, 2, 3, 16, 12], kind: "executive-pair", phrase: "Uppmärksamhet och organisation" },
  { name: "restless pair", totals: [2, 3, 16, 15, 3, 10], kind: "restless-pair", phrase: "Impulsivitet och inre rastlöshet" },
  { name: "contrast", totals: [16, 4, 0, 0, 3, 8], kind: "contrast", phrase: "medan impulsivitet och inre rastlöshet ligger lågt" },
  { name: "dominant", totals: [16, 5, 5, 5, 5, 9], kind: "dominant", phrase: "tydligast drar ifrån" },
  { name: "shared", totals: [10, 10, 4, 3, 2, 8], kind: "shared", phrase: "ligger nära varandra" },
];

for (const scenario of cases) {
  const finding = findingFor(scenario.totals);
  assert.equal(finding.kind, scenario.kind, scenario.name);
  assert.equal(finding.sentences.length, 3, `${scenario.name} must have a bounded three-sentence finding`);
  assert(finding.sentences.join(" ").includes(scenario.phrase), `${scenario.name} should use its supported observation`);
  assert(!finding.sentences.join(" ").match(/\b\d+(?:[,.]\d+)?\s*\/\s*100\b/), `${scenario.name} must not reveal a score`);
  assert(!finding.sentences.join(" ").includes("profiltyp"), `${scenario.name} must not reveal the premium profile type`);
}

console.log("PASS: ADHD personal finding handles low, paired, contrasting, dominant and shared response patterns without leaking premium scores.");
