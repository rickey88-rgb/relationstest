/* eslint-disable @typescript-eslint/no-require-imports -- verifies the actual deployment package. */
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const { execFileSync } = require("node:child_process"), ts = require("typescript");
const root = path.resolve(__dirname, "..");
execFileSync(process.execPath, [path.join(__dirname, "build-customer-edge.cjs")], { cwd: root, stdio: "pipe" });
const directory = path.join(root, "supabase/functions/customer-tests"), manifest = JSON.parse(fs.readFileSync(path.join(directory, "source-manifest.json")));
let dynamic = 0, imports = 0;
for (const source of manifest.files) {
  const file = path.join(directory, "_generated", source.path.replace(/\.(?:tsx?|cjs)$/, ".mjs"));
  const tree = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  function visit(node) {
    let specifier;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) specifier = node.moduleSpecifier?.text;
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      dynamic++; assert(ts.isStringLiteral(node.arguments[0])); specifier = node.arguments[0].text;
    }
    if (specifier?.startsWith(".")) {
      imports++; assert(specifier.endsWith(".mjs"), "Edge requires explicit runtime extensions: " + source.path);
      assert(fs.statSync(path.resolve(path.dirname(file), specifier)).isFile(), "Bundled dependency must exist");
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
}
assert(dynamic >= 2, "The restore journal imports must be checked, too");
console.log(`PASS: ${manifest.files.length} Edge modules, ${imports} local imports and ${dynamic} dynamic restore imports resolve in the deployment package.`);

// Execute the emitted frozen ESM graph too, rather than checking import paths alone.
(async () => {
  const { pathToFileURL } = require("node:url");
  const frozen = require("../app/persona/_domain/release-v61/snapshot.cjs");
  const emitted = (await import(pathToFileURL(path.join(directory, "_generated/app/persona/_domain/release-v61/snapshot.mjs")).href)).default;
  const commerce = await import(pathToFileURL(path.join(directory, "_generated/app/_lib/testAccounts/personaV61Commerce.server.mjs")).href);
  const presentation = await import(pathToFileURL(path.join(directory, "_generated/app/persona/report/v61Presentation.mjs")).href);
  const profiles = require("../tests/persona/insights-v2-full-fixtures.cjs");
  process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED = "true";
  for (const profile of profiles) {
    const result = frozen.completeReport(profile.answers);
    assert.deepEqual(emitted.completeReport(profile.answers), result);
    const current = commerce.prepareV61Checkout({ questionVersion:"persona-questions-v3",reportVersion:"persona-report-v61-release2",answers:profile.answers });
    const delivered = commerce.openV61Purchase(current.envelope);
    assert.equal(delivered.presentation.sections.length,6);
    assert(delivered.presentation.sections.every(s=>s.blocks.length));
    const input = { questionVersion:"persona-questions-v3", reportVersion:"persona-report-v61-release1", answers:profile.answers };
    if (result.after.state === "ready") {
      const prepared = commerce.prepareV61Checkout(input);
      assert.deepEqual(commerce.openV61Purchase(prepared.envelope).presentation, presentation.presentCompletion(result));
    } else assert.throws(() => commerce.prepareV61Checkout(input));
  }
  delete process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED;
  console.log("PASS: emitted frozen ESM runtime, quality gate and paid presentation match Node for all 24 profiles.");
})().catch(error => { console.error(error); process.exitCode = 1; });
