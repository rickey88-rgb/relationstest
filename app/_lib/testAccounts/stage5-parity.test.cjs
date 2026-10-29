/* eslint-disable @typescript-eslint/no-require-imports -- frozen original inline models/reports; deterministic synthetic score and legacy behavior checks. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { createHash } = require("node:crypto");
const React = require("react");
const { renderToStaticMarkup: render } = require("react-dom/server");
const load = require("../../autism-test/test/test-loader.cjs")({ "next/link": { default: ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children) } });
const registry = load(path.join(__dirname, "adapter.ts"));
const Portal = load(path.join(__dirname, "../../mina-sidor/tester/ReportView.tsx")).default;
const material = require("./stage5-fixtures/material.json");
const cases = [["anknytningstest", "attachment_test"], ["medberoendetest", "codependency_test"], ["gaslightingtest", "gaslighting_test"]];
const normalized = value => value.replace(/\s+/g, " ").trim();
let totalReports = 0, totalScores = 0;
for (const [slug, product] of cases) {
  const modelPath = path.join(__dirname, `../../${slug}/test/model.ts`);
  const m = load(modelPath), original = load(path.join(__dirname, `stage5-fixtures/${slug}-model-v1.ts`));
  const Report = load(path.join(__dirname, `../../${slug}/test/ReportView.tsx`)).default;
  const Original = load(path.join(__dirname, `stage5-fixtures/${slug}-report-v1.tsx`)).default;
  const a = registry.adapter(product), attachment = product === "attachment_test";
  assert.equal(m.questions.length, 30); assert.deepEqual(m.questions, original.questions);
  assert.equal(a.amount, 3900); assert.equal(a.testPath, `/${slug}/test`);
  assert.deepEqual(registry.flags(product), { checkout: false, save: false, read: false, legacyImport: false });
  const modelSource = fs.readFileSync(modelPath, "utf8").replace(/\r\n/g, "\n");
  assert.equal(createHash("sha256").update(modelSource.slice(0, modelSource.indexOf('export function calculateScores')).trim()).digest("hex"), material[slug].prefixHash, "questions/texts/limits/payment constants changed during extraction");
  const input = answers => ({ answers, questionVersion: a.questionVersion, reportVersion: a.reportVersion });
  for (const bad of [null, [], input(Array(29).fill(0)), input(Array(31).fill(0)), input(Array(30).fill(-1)), input(Array(30).fill(5)), input(Array(30).fill("2")), input(Array(30).fill(0.5)), input(Array(30).fill(null)), input(Array(30).fill(NaN)), input(Array(30).fill(Infinity)), input(Array(30)), { ...input(Array(30).fill(0)), paid: true }, { ...input(Array(30).fill(0)), questionVersion: "unknown" }, { ...input(Array(30).fill(0)), reportVersion: "unknown" }]) assert.throws(() => a.parse(bad));
  const keys = Object.keys(attachment ? m.subscaleLabels : m.areaLabels);
  function answersForRaw(raw) {
    const remaining = Object.fromEntries(keys.map((key, index) => [key, raw[index]]));
    return m.questions.map(q => { const key = attachment ? q.subscale : q.area, score = Math.min(4, remaining[key]); remaining[key] -= score; return q.reverse ? 4 - score : score; });
  }
  const samples = new Map(), add = answers => samples.set(JSON.stringify(answers), answers);
  for (let code = 0; code < 15625; code++) {
    let cursor = code;
    const raw = keys.map(() => { const v = [0,5,10,15,20][cursor % 5]; cursor = Math.floor(cursor / 5); return v; });
    const answers = answersForRaw(raw), actual = a.calculate(a.parse(input(answers))), expected = original.calculate(answers);
    assert.deepEqual(actual, expected);
    keys.forEach((key, index) => assert.equal(attachment ? actual.scores.subscales[key] : actual.scores.areas[key], raw[index] * 5));
    if (attachment) {
      assert.equal(actual.scores.dimensions.anxiety, Math.round(raw.slice(0,3).reduce((s,n)=>s+n,0) / 60 * 100));
      assert.equal(actual.scores.dimensions.avoidance, Math.round(raw.slice(3).reduce((s,n)=>s+n,0) / 60 * 100));
      assert.equal(actual.profile, original.profileName(actual.anxiety, actual.avoidance));
    } else {
      const sum = raw.reduce((s,n)=>s+n,0);
      assert.equal(actual.scores.overall, product === "gaslighting_test" ? Math.round(sum/120*100) : Math.round(sum/120*1000)/10);
    }
    if (code % 83 === 0) add(answers);
  }
  totalScores += 15625;
  if (attachment) {
    const profiles = new Set();
    for (let anxietyRaw = 0; anxietyRaw <= 60; anxietyRaw++) for (let avoidanceRaw = 0; avoidanceRaw <= 60; avoidanceRaw++) {
      let first = anxietyRaw, second = avoidanceRaw;
      const raw = keys.map((_, index) => { const value = Math.min(20, index < 3 ? first : second); if(index < 3) first -= value; else second -= value; return value; });
      const answers = answersForRaw(raw), result = a.calculate(a.parse(input(answers)));
      assert.deepEqual(result, original.calculate(answers));
      const anxiety = Math.round(anxietyRaw/60*100), avoidance = Math.round(avoidanceRaw/60*100);
      assert.equal(result.anxiety, anxiety); assert.equal(result.avoidance, avoidance);
      assert.equal(result.profile, anxiety < 50 && avoidance < 50 ? "Övervägande trygg anknytningsprofil" : anxiety >= 50 && avoidance < 50 ? "Övervägande ängslig / ambivalent anknytningsprofil" : anxiety < 50 ? "Övervägande undvikande anknytningsprofil" : "Blandad otrygg / rädd-undvikande anknytningsprofil");
      profiles.add(result.profile);
      if ([14,15,16,29,30,31,44,45,46].includes(anxietyRaw) && [14,15,16,29,30,31,44,45,46].includes(avoidanceRaw)) add(answers);
    }
    assert.equal(profiles.size, 4); totalScores += 3721;
  } else {
    for (let sum = 0; sum <= 120; sum++) {
      let remaining = sum;
      const raw = keys.map(() => { const v = Math.min(20, remaining); remaining -= v; return v; });
      const answers = answersForRaw(raw), result = a.calculate(a.parse(input(answers)));
      assert.deepEqual(result, original.calculate(answers)); add(answers);
    }
    totalScores += 121;
  }
  for (let index = 0; index < 6; index++) for (let raw = 0; raw <= 20; raw++) { const values = Array(6).fill(0); values[index] = raw; add(answersForRaw(values)); }
  for (let index = 0; index < 30; index++) for (let value = 0; value <= 4; value++) { const answers = Array(30).fill(0); answers[index] = value; add(answers); }
  add(Array(30).fill(0)); add(Array(30).fill(4));
  let seed = 137;
  for (let i = 0; i < 256; i++) add(Array.from({length:30},()=>{seed = seed*16807%2147483647; return seed%5;}));
  // Preserve partial guest scoring; only the account adapter rejects missing answers.
  for (const incomplete of [Array(30).fill(-1), Array(30), Array.from({length:30},(_,i)=>i%2 ? -1 : 4)]) {
    assert.deepEqual(m.calculate(incomplete), original.calculate(incomplete)); assert.throws(()=>a.parse(input(incomplete)));
  }
  for (const value of [24.9,25,25.1,49.9,50,50.1,74.9,75,75.1]) {
    if (attachment) { assert.equal(m.scoreLevel(value), original.scoreLevel(value)); assert.equal(m.profileDeep(value, 50), original.profileDeep(value, 50)); }
    else { assert.equal(m.level(value), original.level(value)); assert.equal(m.overallTitle(value), original.overallTitle(value)); assert.equal(m.overallDescription(value), original.overallDescription(value)); }
  }
  for (const answers of samples.values()) {
    const actual = a.calculate(a.parse(input(answers))), expected = original.calculate(answers);
    assert.deepEqual(actual, expected);
    const originalHtml = render(React.createElement(Original, { result: expected }));
    assert.equal(render(React.createElement(Report, { result: actual, onRestart: () => {} })), originalHtml, "legacy report markup/content changed");
    let controls = 0;
    const portalExpected = originalHtml.replace(/<button type="button" style="([^"]*)">([\s\S]*?)<\/button>/g, (_match, style, body) => { controls++; return `<a href="/${slug}/test" style="${style}">${body}</a>`; });
    assert.equal(controls, 1, "only the original restart control changes in a saved report");
    assert.equal(render(React.createElement(Portal, { product, result: actual })), portalExpected);
  }
  const source = fs.readFileSync(path.join(__dirname, `../../${slug}/test/page.tsx`), "utf8").replace(/\r\n/g,"\n");
  const ast = ts.createSourceFile("page.tsx",source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX), functions = {};
  function visit(node) { if(ts.isFunctionDeclaration(node) && material[slug].functions[node.name?.text]) functions[node.name.text] = node.getText(ast); ts.forEachChild(node,visit); } visit(ast);
  const effects = [];
  function visitEffects(node) { if(ts.isCallExpression(node) && node.expression.getText(ast) === "useEffect") effects.push(node.getText(ast)); ts.forEachChild(node,visitEffects); } visitEffects(ast);
  assert.deepEqual(effects, material[slug].effects, "guest restore/persistence/payment effects changed");
  for(const [name, text] of Object.entries(material[slug].functions)) assert.equal(normalized(functions[name].replace(" if (accountCheckout()) return;", "").replace("    setCheckoutUnavailable(false);\n", "")), normalized(text), `legacy ${name} changed`);
  assert(source.includes('usePaymentRecovery(LS_KEY') && source.includes('hasPaidReturn(LS_KEY)') && source.includes('localStorage.getItem(LS_KEY)'));
  process.env[`${a.flagPrefix}_SAVE_ENABLED`] = "true"; registry.registeredAdapters().forEach(other => assert.equal(registry.flags(other.product).save, other.product === product)); delete process.env[`${a.flagPrefix}_SAVE_ENABLED`];
  totalReports += samples.size;
  console.log(`PASS: ${slug}: ${samples.size} exact frozen-original/client/server reports; saved report differs only by restart navigation; strict schema, partial guest answers, thresholds and legacy handlers preserved.`);
}
console.log(`PASS: ${totalScores} score/profile/boundary combinations and ${totalReports} full reports across attachment, codependency and gaslighting.`);
