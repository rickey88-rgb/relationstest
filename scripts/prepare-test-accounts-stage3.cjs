/* eslint-disable @typescript-eslint/no-require-imports -- isolated explicit local overlays; never stages, commits or publishes. */
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, ".."), manifest = require("./test-accounts-stage3-files.json");
const hash = file => createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex");
for (const [file, expected] of Object.entries(manifest.frozenDependencyHashes)) {
  if (hash(file).toUpperCase() !== expected.toUpperCase()) throw new Error(`Unreviewed dependency change: ${file}`);
}
const result = spawnSync(process.execPath, [path.join(__dirname, "prepare-test-accounts-stage2.cjs")], { cwd: root, encoding: "utf8" });
if (result.status !== 0) throw new Error(result.stderr || "Stage 2 dependency preparation failed");
const output = path.resolve(result.stdout.trim());
if (!output.startsWith(path.join(root, ".next", "test-accounts-stage1-release-"))) throw new Error("Unexpected isolated directory");
const hashes = {};
for (const file of manifest.files) {
  if (path.isAbsolute(file) || file.split(/[\\/]/).includes("..")) throw new Error("Unsafe release path");
  const target = path.join(output, file); fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target); hashes[file] = hash(file);
}
fs.writeFileSync(path.join(output, "test-accounts-stage3-review-hashes.json"), JSON.stringify({ dependencyManifests: ["scripts/account-phase2-files.json", "scripts/test-accounts-stage1-files.json", "scripts/test-accounts-stage2-files.json"], hashes }, null, 2) + "\n");
console.log(output);
