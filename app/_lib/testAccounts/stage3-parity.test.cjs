/* eslint-disable @typescript-eslint/no-require-imports -- frozen original interpretations/reports; synthetic edge and threshold coverage. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup: render } = require("react-dom/server");
const loader = require("../../autism-test/test/test-loader.cjs");
const load = loader({ "next/link": { default: ({ href, children, className }) => React.createElement("a", { href, className }, children) } });
const registry = load(path.join(__dirname, "adapter.ts"));
const material = require("./stage3-fixtures/material.json");
const Portal = load(path.join(__dirname, "../../mina-sidor/tester/ReportView.tsx")).default;
const n = load(path.join(__dirname, "../../narcissism-sjalvtest/test/model.ts"));
const s = load(path.join(__dirname, "../../test/screening.ts"));
const oldNText = load(path.join(__dirname, "stage3-fixtures/narcissism-interpretation-v1.ts"));
const nText = load(path.join(__dirname, "../../narcissism-sjalvtest/test/interpretation.ts"));
const oldSAnalysis = load(path.join(__dirname, "stage3-fixtures/screening-analysis-v2.ts"));
const samples = { narcissism: new Map(), screening: new Map() };
const add = (key, answers) => samples[key].set(JSON.stringify(answers), answers);
function narcissismAnswers(raw) {
  const remaining = Object.fromEntries(n.dimensions.map(d => [d, raw[d] ?? 0]));
  return n.questions.map(q => { const score = Math.min(4, remaining[q.dimension]); remaining[q.dimension] -= score; return q.reverse ? 4 - score : score; });
}
function screeningAnswers(raw) {
  const remaining = Object.fromEntries(s.domains.map(d => [d, raw[d] ?? 0]));
  return s.questions.map(q => { const score = Math.min(4, remaining[q.domain]); remaining[q.domain] -= score; return score; });
}
for (const [key, count] of [["narcissism", 30], ["screening", 42]]) {
  add(key, Array(count).fill(0)); add(key, Array(count).fill(4));
  for (let index = 0; index < count; index++) for (let value = 0; value <= 4; value++) { const answers = Array(count).fill(0); answers[index] = value; add(key, answers); }
  let seed = 137;
  for (let i = 0; i < 256; i++) add(key, Array.from({ length: count }, () => { seed = seed * 16807 % 2147483647; return seed % 5; }));
}
for (const d of n.dimensions) for (let raw = 0; raw <= 20; raw++) add("narcissism", narcissismAnswers({ [d]: raw }));
for (const total of [0, 29, 30, 31, 53, 54, 55, 77, 78, 79, 120]) {
  let remaining = total;
  const raw = Object.fromEntries(n.dimensions.map(d => { const v = Math.min(20, remaining); remaining -= v; return [d, v]; }));
  const answers = narcissismAnswers(raw), result = n.calculate(answers);
  assert.equal(result.totalScore, total);
  assert.equal(result.level, total < 30 ? "Få narcissistiska drag" : total < 54 ? "Vissa narcissistiska drag" : total < 78 ? "Tydliga narcissistiska drag" : "Mycket tydliga narcissistiska drag");
  add("narcissism", answers);
}
for (const empathy of [1, 2, 3]) {
  const answers = narcissismAnswers({ grandiosity: 20, criticism: 7, empathy });
  const result = n.calculate(answers), gap = Math.abs(result.grandiose - result.vulnerable);
  assert.equal(gap, 16 - empathy * 0.5);
  assert.equal(result.profileType, gap < 15 ? "Blandad profil" : "Främst grandios profil"); add("narcissism", answers);
}
assert.equal(n.calculate(Array(30).fill(0)).totalScore, 16, "reverse items mean all-zero answers are not zero points");
assert.equal(n.calculate(Array(30).fill(4)).totalScore, 104);
const profileTypes = new Set();
const nAdapter = registry.adapter("narcissism_selftest");
for (let code = 0; code < 15625; code++) {
  let cursor = code;
  const raw = Object.fromEntries(n.dimensions.map(d => { const value = [0, 5, 9, 13, 20][cursor % 5]; cursor = Math.floor(cursor / 5); return [d, value]; }));
  const answers = narcissismAnswers(raw), actual = nAdapter.calculate(answers);
  assert.deepEqual(actual.raw, raw); assert.deepEqual(actual, n.calculate(answers));
  assert.deepEqual(nText.profileAnalysis(actual), oldNText.profileAnalysis(actual));
  for (const d of n.dimensions) assert.deepEqual(nText.interpretation(actual, d), oldNText.interpretation(actual, d));
  profileTypes.add(actual.profileType);
}
assert.equal(profileTypes.size, 4);
for (const d of s.domains) {
  const count = s.questions.filter(q => q.domain === d).length;
  for (let raw = 0; raw <= count * 4; raw++) add("screening", screeningAnswers({ [d]: raw }));
  for (const score of [24.99, 25, 44.99, 45, 64.99, 65]) assert.equal(s.band(score), score < 25 ? "Få signaler" : score < 45 ? "Vissa signaler" : score < 65 ? "Förhöjda signaler" : "Tydliga signaler");
}
for (const id of ["threats_fear_punishment_1", "threats_fear_punishment_2", "threats_fear_punishment_5", "threats_fear_punishment_6"]) {
  const index = s.questions.findIndex(q => q.id === id), threshold = id.endsWith("_6") ? 3 : 1;
  for (const value of [threshold - 1, threshold, threshold + 1]) {
    const answers = Array(42).fill(0); answers[index] = value;
    const p = s.calculate(answers); assert.equal(p.safety, value >= threshold);
    if (p.safety) { assert.equal(p.highlights[0], "threats_fear_punishment"); assert(p.scores.threats_fear_punishment < 25); }
    add("screening", answers);
  }
}
const sAdapter = registry.adapter("screening_test");
for (let code = 0; code < 6561; code++) {
  let cursor = code;
  const raw = Object.fromEntries(s.domains.map(d => { const max = s.questions.filter(q => q.domain === d).length * 4;
    const value = [0, Math.ceil(max * 0.45), max][cursor % 3]; cursor = Math.floor(cursor / 3); return [d, value]; }));
  const answers = screeningAnswers(raw), profile = s.calculate(answers);
  assert.deepEqual(sAdapter.calculate(answers), { profile, analysis: oldSAnalysis.resultAnalysis(profile, answers) });
  if (code % 26 === 0) add("screening", answers);
}
let reportCases = 0;
for (const [key, product, dir, count] of [["narcissism", "narcissism_selftest", "narcissism-sjalvtest/test", 30], ["screening", "screening_test", "test", 42]]) {
  const a = registry.adapter(product), Report = load(path.join(__dirname, `../../${dir}/ReportView.tsx`)).default;
  const Original = load(path.join(__dirname, `stage3-fixtures/${key === "screening" ? "screening-v2" : "narcissism-v1"}.tsx`)).default;
  assert.deepEqual(registry.flags(product), { checkout: false, save: false, read: false, legacyImport: false });
  const input = answers => ({ answers, questionVersion: a.questionVersion, reportVersion: a.reportVersion });
  for (const bad of [null, [], input(Array(count - 1).fill(0)), input(Array(count + 1).fill(0)), input(Array(count).fill(-1)), input(Array(count).fill(5)), input(Array(count).fill("2")), input(Array(count).fill(NaN)), input(Array(count).fill(Infinity)), { ...input(Array(count).fill(0)), paid: true }, { ...input(Array(count).fill(0)), questionVersion: "old-unknown-version" }, { ...input(Array(count).fill(0)), reportVersion: "other-report" }]) assert.throws(() => a.parse(bad));
  for (const [file, expected] of Object.entries(material[key].files)) assert.equal(createHash("sha256").update(fs.readFileSync(path.join(__dirname, "../../..", file), "utf8").replace(/\r\n/g, "\n")).digest("hex"), expected, `versioned original changed: ${file}`);
  for (const answers of samples[key].values()) {
    const actual = a.calculate(a.parse(input(answers)));
    const profile = key === "screening" ? s.calculate(answers) : null;
    const expected = key === "screening" ? { profile, analysis: oldSAnalysis.resultAnalysis(profile, answers) } : n.calculate(answers);
    assert.deepEqual(actual, expected);
    const originalHtml = render(React.createElement(Original, { result: expected }));
    const actualHtml = render(React.createElement(Report, { result: actual }));
    assert.equal(actualHtml, originalHtml); assert.equal(render(React.createElement(Portal, { product, result: actual })), originalHtml);
    if (key === "screening") assert.equal((actualHtml.match(/aria-label="Stöd och säkerhet"/g) ?? []).length, profile.safety ? 1 : 0);
  }
  const source = fs.readFileSync(path.join(__dirname, `../../${dir}/page.tsx`), "utf8").replace(/\r\n/g, "\n");
  const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let checkout; function visit(node) { if (ts.isFunctionDeclaration(node) && node.name?.text === "checkout") checkout = node.getText(ast); ts.forEachChild(node, visit); } visit(ast);
  assert.equal(checkout.replace(" if (accountCheckout()) return;", "").replace(/\s+/g, " "), material[key].checkout.replace(/\s+/g, " "));
  assert(source.includes('usePaymentRecovery(STORAGE_KEY') && source.includes('hasPaidReturn(STORAGE_KEY)'));
  if (key === "screening") assert(source.includes('profile.safety && <aside'), "free safety guidance must remain outside the paywall");
  process.env[`${a.flagPrefix}_SAVE_ENABLED`] = "true";
  registry.registeredAdapters().forEach(other => assert.equal(registry.flags(other.product).save, other.product === product));
  delete process.env[`${a.flagPrefix}_SAVE_ENABLED`];
  reportCases += samples[key].size;
  console.log(`PASS: ${key}: ${samples[key].size} exact original/client/server/portal report cases, strict schema/version, flags and unchanged legacy checkout.`);
}
console.log(`PASS: 15,625 narcissism and 6,561 screening score/interpretation combinations; all four narcissism profiles, reverse items, exact cutoffs/gaps and safety overrides; ${reportCases} full report cases.`);
