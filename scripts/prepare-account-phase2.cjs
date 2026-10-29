/* eslint-disable @typescript-eslint/no-require-imports -- local release isolation; never stages or publishes. */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "account-phase2-files.json"), "utf8"));
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, maxBuffer: 256 * 1024 * 1024, ...options });
  if (result.error || result.status !== 0) throw new Error(`${command} failed; no files staged or published`);
  return result.stdout;
}
const head = run("git", ["rev-parse", "HEAD"]).toString().trim();
if (head !== manifest.baseCommit) throw new Error("HEAD changed: re-review the release manifest first");
fs.mkdirSync(path.join(root, ".next"), { recursive: true });
const output = fs.mkdtempSync(path.join(root, ".next", "account-phase2-release-"));
run("tar", ["-xf", "-", "-C", output], { input: run("git", ["archive", "--format=tar", "HEAD"]) });
const hashes = {};
for (const file of manifest.files) {
  if (path.isAbsolute(file) || file.split(/[\\/]/).includes("..")) throw new Error("Unsafe release path");
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target);
  hashes[file] = createHash("sha256").update(fs.readFileSync(target)).digest("hex");
}
// This file also has unrelated local recovery changes. Reconstruct ONLY the
// existing test's two-line logging fix from HEAD; never copy the dirty file.
const testFile = "app/api/audhd-recovery/restore/route.test.cjs";
let testSource = fs.readFileSync(path.join(output, testFile), "utf8");
const newline = testSource.includes("\r\n") ? "\r\n" : "\n";
const restoreLog = "  console.error = originalError;" + newline;
if (testSource.split(restoreLog).length !== 2) throw new Error("Recovery test baseline changed");
testSource = testSource.replace(restoreLog, "");
testSource = testSource.replace('  console.log("PASS: redeemed recovery', restoreLog + '  console.log("PASS: redeemed recovery');
fs.writeFileSync(path.join(output, testFile), testSource);
hashes[testFile] = createHash("sha256").update(testSource).digest("hex");
fs.writeFileSync(path.join(output, "account-phase2-review-hashes.json"), JSON.stringify({ head, hashes }, null, 2) + "\n");
console.log(output);
