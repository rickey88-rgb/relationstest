/* eslint-disable @typescript-eslint/no-require-imports -- explicit local stage 5 overlay; never stages, commits or publishes. */
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, ".."), manifest = require("./test-accounts-stage5-files.json");
const hash = file => createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex");
for (const [file, expected] of Object.entries(manifest.frozenDependencyHashes)) {
  if (hash(file).toUpperCase() !== expected.toUpperCase()) throw new Error(`Unreviewed dependency change: ${file}`);
}
const prepared = spawnSync(process.execPath, [path.join(__dirname, "prepare-test-accounts-stage4.cjs")], { cwd: root, encoding: "utf8" });
if (prepared.status !== 0) throw new Error(prepared.stderr || "Stage 4 preparation failed");
const output = path.resolve(prepared.stdout.trim());
if (!output.startsWith(path.join(root, ".next", "test-accounts-stage4-release-"))) throw new Error("Unexpected isolated directory");
const hashes = {};
for (const file of manifest.files) {
  if (path.isAbsolute(file) || file.split(/[\\/]/).includes("..")) throw new Error("Unsafe release path");
  const target = path.join(output, file); fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target); hashes[file] = hash(file);
}
fs.writeFileSync(path.join(output, "test-accounts-stage5-review-hashes.json"), JSON.stringify({ dependencyManifests: manifest.dependencyManifests, hashes }, null, 2) + "\n");
console.log(output);
