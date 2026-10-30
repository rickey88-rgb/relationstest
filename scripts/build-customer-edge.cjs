/* eslint-disable @typescript-eslint/no-require-imports -- deterministic local packaging. */
const fs = require("node:fs"), path = require("node:path"), ts = require("typescript");
const { createHash } = require("node:crypto");
const root = path.resolve(__dirname, "..");
const target = path.join(root, "supabase/functions/customer-tests");
const output = path.join(target, "_generated");
const modules = new Map(), packages = new Map();
function resolve(file, specifier) {
  const base = path.resolve(path.dirname(file), specifier);
  const resolved = [base + ".ts", base + ".tsx", base].find(value => fs.existsSync(value) && fs.statSync(value).isFile());
  if (!resolved || !resolved.startsWith(root + path.sep)) throw new Error("Unresolved source import");
  return resolved;
}
function packageSpecifier(name) {
  if (name.startsWith("node:")) return name;
  if (name.startsWith("next") || name === "react") throw new Error("Framework dependency entered Edge core");
  const packageName = name.startsWith("@") ? name.split("/").slice(0, 2).join("/") : name.split("/")[0];
  const info = JSON.parse(fs.readFileSync(path.join(root, "node_modules", packageName, "package.json"), "utf8"));
  packages.set(packageName, info.version);
  return "npm:" + packageName + "@" + info.version + name.slice(packageName.length);
}
function emit(file) {
  const relative = path.relative(root, file).replaceAll("\\", "/"), dest = path.join(output, relative.replace(/\.tsx?$/, ".mjs"));
  if (modules.has(relative)) return dest;
  const source = fs.readFileSync(file);
  modules.set(relative, { path: relative, sha256: createHash("sha256").update(source).digest("hex") });
  const js = ts.transpileModule(source.toString("utf8"), { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const result = ts.transform(ts.createSourceFile(file + ".js", js, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS), [context => source => {
    function visit(node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
        const name = node.moduleSpecifier.text;
        let specifier;
        if (name.startsWith(".")) { specifier = path.relative(path.dirname(dest), emit(resolve(file, name))).replaceAll("\\", "/"); if (!specifier.startsWith(".")) specifier = "./" + specifier; }
        else specifier = packageSpecifier(name);
        const literal = ts.factory.createStringLiteral(specifier);
        return ts.isImportDeclaration(node)
          ? ts.factory.updateImportDeclaration(node, node.modifiers, node.importClause, literal, node.attributes)
          : ts.factory.updateExportDeclaration(node, node.modifiers, node.isTypeOnly, node.exportClause, literal, node.attributes);
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(source, visit);
  }]);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, "// GENERATED from canonical application source. Do not edit.\n" + ts.createPrinter().printFile(result.transformed[0]));
  result.dispose();
  return dest;
}
emit(path.join(root, "app/_lib/testAccounts/directHandler.server.ts"));
fs.writeFileSync(path.join(target, "source-manifest.json"), JSON.stringify({ files: [...modules.values()], packages: Object.fromEntries(packages) }, null, 2));
console.log(JSON.stringify({ generatedCanonicalModules: modules.size, packages: Object.fromEntries(packages), applicationSourcesChanged: false }));
