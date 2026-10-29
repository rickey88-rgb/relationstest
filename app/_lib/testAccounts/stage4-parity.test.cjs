/* eslint-disable @typescript-eslint/no-require-imports -- exact original autism report references and synthetic profile/subscale boundaries. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup: render } = require("react-dom/server");
const load = require("../../autism-test/test/test-loader.cjs")();
const registry = load(path.join(__dirname, "adapter.ts")), a = registry.adapter("autism_test");
const m = load(path.join(__dirname, "../../autism-test/test/model.ts"));
const text = load(path.join(__dirname, "../../autism-test/test/interpretation.ts"));
const originalText = load(path.join(__dirname, "stage4-fixtures/interpretation-v1.ts"));
const Original = load(path.join(__dirname, "stage4-fixtures/autism-v1.tsx")).default;
const Report = load(path.join(__dirname, "../../autism-test/test/ReportView.tsx")).default;
const Portal = load(path.join(__dirname, "../../mina-sidor/tester/ReportView.tsx")).default;
const material = require("./stage4-fixtures/material.json");
const values = raw => raw.flatMap(total => Array.from({ length: 5 }, (_, index) => Math.max(0, Math.min(4, total - index * 4))));
const samples = new Map(), add = answers => samples.set(JSON.stringify(answers), answers);
assert.equal(a.amount, 3900); assert.equal(a.slug, "autism"); assert.equal(a.testPath, "/autism-test/test");
assert.deepEqual(registry.flags(a.product), { checkout: false, save: false, read: false, legacyImport: false });
const envelope = answers => ({ answers, questionVersion: a.questionVersion, reportVersion: a.reportVersion });
for (const bad of [null, [], envelope(Array(29).fill(0)), envelope(Array(31).fill(0)), envelope(Array(30).fill(-1)), envelope(Array(30).fill(5)), envelope(Array(30).fill(0.5)), envelope(Array(30).fill("2")), envelope(Array(30).fill(NaN)), envelope(Array(30).fill(Infinity)), envelope(Array(30)), { ...envelope(Array(30).fill(2)), unlocked: true }, { ...envelope(Array(30).fill(2)), recovery: "success" }, { ...envelope(Array(30).fill(2)), questionVersion: "old-v0" }, { ...envelope(Array(30).fill(2)), reportVersion: "unsupported" }]) assert.throws(() => a.parse(bad));
// main 9c4c34c restored the same 39 SEK link and documented that former _79
// variables are ignored. Pin that approved payment module separately; retain
// every frozen model, interpretation and recovery reference unchanged.
const currentPaymentHash = "4b8c2caea606367bbf2a3113d0ecb767377c45f842442a617fecbcac820842b7";
for (const [file, expected] of Object.entries(material.files)) assert.equal(createHash("sha256").update(fs.readFileSync(path.join(__dirname, "../../..", file), "utf8").replace(/\r\n/g, "\n")).digest("hex"), file === "app/autism-test/test/payment.ts" ? currentPaymentHash : expected, `original model/recovery changed: ${file}`);
const profiles = new Set(), modifiers = new Set(), symptomProfiles = new Map();
for (let code = 0; code < 15625; code++) {
  let cursor = code;
  const raw = Array.from({ length: 6 }, () => { const value = [0, 5, 9, 13, 20][cursor % 5]; cursor = Math.floor(cursor / 5); return value; });
  const answers = values(raw), actual = a.calculate(a.parse(envelope(answers))), expected = m.calculate(answers);
  assert.deepEqual(actual, expected);
  assert.equal(actual.symptomIndex, raw.slice(0, 5).reduce((sum, value) => sum + value, 0));
  m.areas.forEach((area, index) => { assert.equal(actual.raw[area], raw[index]); assert.equal(actual.scores[area], raw[index] * 5); assert.equal(text.describeArea(area, actual.scores[area]), originalText.describeArea(area, actual.scores[area])); });
  assert.deepEqual(text.impactText(actual), originalText.impactText(actual));
  assert.equal(text.standoutText(actual), originalText.standoutText(actual));
  profiles.add(actual.profileType); modifiers.add(actual.impactModifier);
  const key = raw.slice(0, 5).join(","), summary = { index: actual.symptomIndex, profile: actual.profileType, ranked: actual.ranked, level: actual.level, gap: actual.leadingGap };
  if (symptomProfiles.has(key)) assert.deepEqual(summary, symptomProfiles.get(key), "impact/history must not change symptom index/profile/ranking"); else symptomProfiles.set(key, summary);
  if (code % 83 === 0) add(answers);
}
assert.equal(profiles.size, 5); assert.equal(modifiers.size, 4);
for (let code = 0; code < 3125; code++) {
  let cursor = code;
  const impact = Array.from({ length: 5 }, () => { const v = cursor % 5; cursor = Math.floor(cursor / 5); return v; });
  const answers = [...Array(25).fill(3), ...impact], actual = a.calculate(a.parse(envelope(answers)));
  assert.deepEqual(actual, m.calculate(answers));
  assert.equal(actual.symptomIndex, 75); assert.equal(actual.profileType, "Bred kombinerad profil");
  assert.equal(actual.historyAnswer, impact[3]); assert.equal(actual.impactAnswer, impact[0]); assert.equal(actual.settingsAnswer, impact[4]);
  assert.deepEqual(text.impactText(actual), originalText.impactText(actual));
  if (code % 13 === 0) add(answers);
}
for (const index of [0, 24, 25, 26, 44, 45, 46, 64, 65, 66, 79, 80, 81, 100]) {
  let remaining = index;
  const raw = Array.from({ length: 5 }, () => { const v = Math.min(20, remaining); remaining -= v; return v; }); raw.push(0);
  const answers = values(raw), result = a.calculate(a.parse(envelope(answers)));
  const level = index >= 80 ? "Mycket tydligt autismrelaterat mönster" : index >= 65 ? "Tydligt autismrelaterat mönster" : index >= 45 ? "Måttligt autismrelaterat mönster" : index >= 25 ? "Vissa autismrelaterade drag" : "Svagt autismrelaterat mönster";
  assert.equal(result.symptomIndex, index); assert.equal(result.level, level); add(answers);
}
for (const [raw, expected] of [
  [[13,13,10,0,0,0], "Social-kommunikativ profil"], [[13,13,11,0,0,0], "Svagt eller ospecifikt mönster"],
  [[10,0,13,13,0,0], "Förutsägbarhets-/sensorisk profil"], [[11,0,13,13,0,0], "Svagt eller ospecifikt mönster"],
  [[20,0,18,0,18,0], "Bred kombinerad profil"], [[20,0,18,0,17,0], "Fokuserad/intensiv profil"],
  [[13,12,8,8,13,0], "Svagt eller ospecifikt mönster"], [[13,12,8,7,13,0], "Fokuserad/intensiv profil"],
  [[13,12,7,7,13,0], "Fokuserad/intensiv profil"],
]) { const answers = values(raw); assert.equal(a.calculate(a.parse(envelope(answers))).profileType, expected); add(answers); }
for (const [symptom, impact, modifier] of [[13,7,"limited"],[13,8,"standard"],[13,11,"standard"],[13,12,"marked"],[12,7,"standard"],[8,12,"impactWithoutPattern"],[9,12,"standard"],[0,20,"impactWithoutPattern"]]) {
  const answers = values([symptom,symptom,symptom,symptom,symptom,impact]); assert.equal(a.calculate(a.parse(envelope(answers))).impactModifier, modifier); add(answers);
}
for (let area = 0; area < 6; area++) for (let raw = 0; raw <= 20; raw++) { const scores = Array(6).fill(0); scores[area] = raw; add(values(scores)); }
for (let q = 0; q < 30; q++) for (let value = 0; value <= 4; value++) { const answers = Array(30).fill(0); answers[q] = value; add(answers); }
add(Array(30).fill(0)); add(Array(30).fill(4));
let seed = 137;
for (let i = 0; i < 256; i++) add(Array.from({ length: 30 }, () => { seed = seed * 16807 % 2147483647; return seed % 5; }));
for (const answers of samples.values()) {
  const actual = a.calculate(a.parse(envelope(answers))), expected = m.calculate(answers);
  assert.deepEqual(actual, expected);
  const html = render(React.createElement(Original, { result: expected }));
  assert.equal(render(React.createElement(Report, { result: actual })), html);
  assert.equal(render(React.createElement(Portal, { product: a.product, result: actual })), html);
}
const source = fs.readFileSync(path.join(__dirname, "../../autism-test/test/page.tsx"), "utf8").replace(/\r\n/g, "\n");
const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), functions = {};
function visit(node) { if (ts.isFunctionDeclaration(node) && ["checkout", "restart", "restoreSupportRecovery"].includes(node.name?.text)) functions[node.name.text] = node.getText(ast); ts.forEachChild(node, visit); } visit(ast);
assert.equal(functions.checkout.replace(" if (accountCheckout()) return;", "").replace(/\s+/g, " "), material.checkout.replace(/\s+/g, " "));
assert.equal(functions.restart, material.restart); assert.equal(functions.restoreSupportRecovery, material.recovery);
assert(source.includes('purchaseEvent("autism_test")') && source.includes('usePaymentRecovery(STORAGE_KEY') && source.includes('<PostPurchaseRecommendation sourceProduct="autism_test" />'));
process.env.TEST_ACCOUNTS_AUTISM_SAVE_ENABLED = "true";
registry.registeredAdapters().forEach(other => assert.equal(registry.flags(other.product).save, other.product === "autism_test"));
console.log(`PASS: autism: ${samples.size} exact original/client/server/portal premium report cases; 15,625 subscale/profile and 3,125 impact/history combinations, five profiles, four modifiers, exact boundaries, strict schema and independent flags. Legacy checkout/restart/recovery functions and signed-cookie implementation unchanged.`);
