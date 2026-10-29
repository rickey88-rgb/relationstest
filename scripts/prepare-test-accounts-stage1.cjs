/* eslint-disable @typescript-eslint/no-require-imports -- read-only Git archive plus explicit local file allowlists; never stages/publishes. */
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, ".."), manifest = require("./test-accounts-stage1-files.json");
const hash = file => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const portal = fs.readFileSync(path.join(root, "app/mina-sidor/page.tsx"), "utf8").replace(/\r\n/g, "\n");
const portalBaseline = portal.replace('import TestAccountEntry from "./TestAccountEntry";\n', "").replace('        <TestAccountEntry />\n', "");
if (portalBaseline === portal || createHash("sha256").update(portalBaseline).digest("hex") !== manifest.portalBoundaryBaseNormalizedHash) {
  throw new Error("Portal contains changes beyond the two reviewed ADHD integration lines");
}
for (const [file, expected] of Object.entries(manifest.dependencyBaselineHashes)) {
  if (hash(path.join(root, file)).toUpperCase() !== expected.toUpperCase()) throw new Error(`AuDHD dependency changed since task baseline: ${file}`);
}
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, maxBuffer: 256 * 1024 * 1024, ...options });
  if (result.error || result.status !== 0) throw new Error(`${command} failed; nothing staged/published`);
  return result.stdout;
}
if (run("git", ["rev-parse", "HEAD"]).toString().trim() !== manifest.baseCommit) throw new Error("HEAD changed; review release base first");
fs.mkdirSync(path.join(root, ".next"), { recursive: true });
const output = fs.mkdtempSync(path.join(root, ".next", "test-accounts-stage1-release-"));
run("tar", ["-xf", "-", "-C", output], { input: run("git", ["archive", "--format=tar", "HEAD"]) });
const dependency = require("./account-phase2-files.json");
for (const file of dependency.files) {
  if (path.isAbsolute(file) || file.split(/[\\/]/).includes("..")) throw new Error("Unsafe dependency path");
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(root, file), target);
}
// Reconstruct ONLY the previously reviewed logging assertion fix from HEAD.
// Never copy the dirty recovery test containing unrelated work.
const recovery = path.join(output, "app/api/audhd-recovery/restore/route.test.cjs");
let source = fs.readFileSync(recovery, "utf8");
const newline = source.includes("\r\n") ? "\r\n" : "\n", restoreLog = "  console.error = originalError;" + newline;
if (source.split(restoreLog).length !== 2) throw new Error("Recovery test baseline changed");
source = source.replace(restoreLog, "").replace('  console.log("PASS: redeemed recovery', restoreLog + '  console.log("PASS: redeemed recovery');
fs.writeFileSync(recovery, source);
const hashes = {};
for (const file of manifest.files) {
  if (path.isAbsolute(file) || file.split(/[\\/]/).includes("..")) throw new Error("Unsafe file path");
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(root, file), target);
  hashes[file] = hash(target);
}
fs.writeFileSync(path.join(output, "test-accounts-stage1-review-hashes.json"), JSON.stringify({ dependencyManifest: "scripts/account-phase2-files.json", hashes }, null, 2) + "\n");
console.log(output);
