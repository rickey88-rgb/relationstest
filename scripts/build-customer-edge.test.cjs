/* eslint-disable @typescript-eslint/no-require-imports -- verifies the actual deployment package. */
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const { execFileSync } = require("node:child_process"), ts = require("typescript");
const root = path.resolve(__dirname, "..");
execFileSync(process.execPath, [path.join(__dirname, "build-customer-edge.cjs")], { cwd: root, stdio: "pipe" });
const directory = path.join(root, "supabase/functions/customer-tests"), manifest = JSON.parse(fs.readFileSync(path.join(directory, "source-manifest.json")));
let dynamic = 0, imports = 0;
for (const source of manifest.files) {
  const file = path.join(directory, "_generated", source.path.replace(/\.tsx?$/, ".mjs"));
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
