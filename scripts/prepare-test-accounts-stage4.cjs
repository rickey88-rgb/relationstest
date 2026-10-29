/* eslint-disable @typescript-eslint/no-require-imports -- explicit cumulative local verification only; no Git writes or publishing. */
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, ".."), manifest = require("./test-accounts-stage4-files.json");
function hash(file) { return createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex"); }
for (const [file, expected] of Object.entries(manifest.frozenDependencyHashes)) {
  if (hash(file).toUpperCase() !== expected.toUpperCase()) throw new Error(`Unreviewed dependency change: ${file}`);
}
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, maxBuffer: 256 * 1024 * 1024, ...options });
  if (result.error || result.status !== 0) throw new Error(`${command} failed; nothing staged or published`);
  return result.stdout;
}
if (run("git", ["rev-parse", "HEAD"]).toString().trim() !== manifest.baseCommit) throw new Error("HEAD changed; re-review release base");
fs.mkdirSync(path.join(root, ".next"), { recursive: true });
const output = fs.mkdtempSync(path.join(root, ".next", "test-accounts-stage4-release-"));
run("tar", ["-xf", "-", "-C", output], { input: run("git", ["archive", "--format=tar", "HEAD"]) });
const allFiles = new Set();
for (const name of manifest.dependencyManifests) for (const file of JSON.parse(fs.readFileSync(path.join(root, name), "utf8")).files) allFiles.add(file);
for (const file of manifest.files) allFiles.add(file);
const hashes = {};
for (const file of allFiles) {
  if (path.isAbsolute(file) || file.split(/[\\/]/).includes("..")) throw new Error("Unsafe release path");
  const target = path.join(output, file); fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target); hashes[file] = hash(file);
}
// Preserve ONLY the previously approved two-line recovery test logging fix.
// Other dirty recovery changes are deliberately excluded, exactly as in stage 1.
const file = "app/api/audhd-recovery/restore/route.test.cjs", target = path.join(output, file);
let source = fs.readFileSync(target, "utf8");
const newline = source.includes("\r\n") ? "\r\n" : "\n", restoreLog = "  console.error = originalError;" + newline;
if (source.split(restoreLog).length !== 2) throw new Error("Recovery test baseline changed");
source = source.replace(restoreLog, "").replace('  console.log("PASS: redeemed recovery', restoreLog + '  console.log("PASS: redeemed recovery');
fs.writeFileSync(target, source);
hashes[file] = createHash("sha256").update(source).digest("hex");
fs.writeFileSync(path.join(output, "test-accounts-stage4-review-hashes.json"), JSON.stringify({ dependencyManifests: manifest.dependencyManifests, hashes }, null, 2) + "\n");
console.log(output);
