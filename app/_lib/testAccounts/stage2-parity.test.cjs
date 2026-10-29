/* eslint-disable @typescript-eslint/no-require-imports -- frozen original reports and synthetic version/legacy regression checks. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const ts = require("typescript");
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const load = require("../../autism-test/test/test-loader.cjs")();
const registry = load(path.join(__dirname, "adapter.ts"));
const originals = require("./stage2-fixtures/material.json");
const GenericReport = load(path.join(__dirname, "../../mina-sidor/tester/ReportView.tsx")).default;
const normalize = value => value.replace(/\r\n/g, "\n");
for (const slug of ["hsp", "angest", "ptsd"]) {
  const model = load(path.join(__dirname, `../../${slug}-test/test/model.ts`));
  const a = registry.adapterForSlug(slug);
  const Report = load(path.join(__dirname, `../../${slug}-test/test/ReportView.tsx`)).default;
  const Original = load(path.join(__dirname, `stage2-fixtures/${slug}-v1.tsx`)).default;
  assert.deepEqual(registry.flags(a.product), { checkout: false, save: false, read: false, legacyImport: false });
  assert.equal(a.amount, model.PRICE_SEK * 100);
  assert.equal(createHash("sha256").update(normalize(fs.readFileSync(path.join(__dirname, `../../${slug}-test/test/model.ts`), "utf8"))).digest("hex"), originals[slug].model, "version 1 question/scoring material must remain unchanged");
  const envelope = answers => ({ answers, questionVersion: a.questionVersion, reportVersion: a.reportVersion });
  for (const value of [null, [], envelope(Array(29).fill(0)), envelope(Array(30).fill(-1)), envelope(Array(30).fill(5)), envelope(Array(30).fill("2")), envelope(Array(30).fill(0.5)), { ...envelope(Array(30).fill(2)), paid: true }, { ...envelope(Array(30).fill(2)), questionVersion: "other-v1" }, { ...envelope(Array(30).fill(2)), reportVersion: "other-v1" }]) assert.throws(() => a.parse(value));
  let seed = 137;
  const samples = [Array(30).fill(0), Array(30).fill(4)];
  for (let q = 0; q < 30; q++) for (let value = 0; value <= 4; value++) { const answers = Array(30).fill(0); answers[q] = value; samples.push(answers); }
  for (let i = 0; i < 128; i++) samples.push(Array.from({ length: 30 }, () => { seed = (seed * 16807) % 2147483647; return seed % 5; }));
  for (const answers of samples) {
    const actual = a.calculate(a.parse(envelope(answers))), expected = model.calculate(answers);
    assert.deepEqual(actual, expected);
    const originalMarkup = renderToStaticMarkup(createElement(Original, { result: expected }));
    assert.equal(renderToStaticMarkup(createElement(Report, { result: actual })), originalMarkup, `${slug}: report differs from pre-integration guest report`);
    assert.equal(renderToStaticMarkup(createElement(GenericReport, { product: a.product, result: actual })), originalMarkup, `${slug}: portal dispatch differs`);
  }
  const page = normalize(fs.readFileSync(path.join(__dirname, `../../${slug}-test/test/page.tsx`), "utf8"));
  const ast = ts.createSourceFile("page.tsx", page, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let checkout;
  function visit(node) { if (ts.isFunctionDeclaration(node) && node.name?.text === "checkout") checkout = node.getText(ast); ts.forEachChild(node, visit); }
  visit(ast);
  assert.equal(checkout.replace(' if (accountCheckout()) return;', '').replace(/\s+/g, " "), originals[slug].checkout.replace(/\s+/g, " "), "flags-off legacy checkout must remain identical");
  assert(page.includes('unlocked') && page.includes('hasPaidReturn(STORAGE_KEY)') && page.includes('usePaymentRecovery(STORAGE_KEY'), "existing guest unlock/recovery retained");
  process.env[`${a.flagPrefix}_SAVE_ENABLED`] = "true";
  for (const other of registry.registeredAdapters()) assert.equal(registry.flags(other.product).save, other.product === a.product, "flags must be independent");
  delete process.env[`${a.flagPrefix}_SAVE_ENABLED`];
  console.log(`PASS: ${slug}: ${samples.length} exact score + frozen-original + portal report comparisons; schema/version, independent flags and unchanged legacy checkout.`);
}
assert.throws(() => registry.adapterForSlug("audhd"));
