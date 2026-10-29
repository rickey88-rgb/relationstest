/* eslint-disable @typescript-eslint/no-require-imports -- protect release scope against current production source. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const base = "dd4a00a4390786f793d8cb496932709c7e0fa473";
const git = args => execFileSync("git", args, { cwd: root, encoding: "utf8" });
const original = file => git(["show", `${base}:${file}`]);
const current = file => fs.readFileSync(path.join(root, file), "utf8");
const normalized = text => text.replace(/\r\n/g, "\n").trim();
const allowed = new Set(["app/page.tsx", "app/_lib/bookProducts.server.ts", "app/_lib/bookProducts.server.test.cjs", "public/adhd-bok-mockup.png", "next-env.d.ts"]);
for (const file of git(["diff", "--name-only", base]).trim().split("\n").filter(Boolean)) {
  assert(allowed.has(file) || file.startsWith("app/adhd-deluxe/") || file.startsWith("app/api/books/adhd-deluxe/") || file.startsWith("public/adhd-deluxe/") || file.startsWith("docs/adhd-deluxe-") || file.startsWith("scripts/adhd-deluxe-") || file.startsWith("scripts/test-adhd-deluxe-"), `Out-of-scope edit: ${file}`);
}
for (const file of ["app/_lib/featureFlags.ts", "app/_lib/bookOffers.ts", "app/_lib/bookAccess.server.ts", "app/_components/crossSellConfig.ts", "app/adhd-test/test/model.ts", "app/adhd-test/test/payment.ts", "app/autism-test/test/model.ts", "app/autism-test/test/payment.ts", "app/autism-bok/page.tsx", "app/autism-bok/tack/klart/page.tsx", "app/api/books/autism-bok/download/route.ts", "app/api/books/autism-bok/worksheets/route.ts"]) assert.equal(normalized(current(file)), normalized(original(file)), file);
function statements(text) {
  return ts.createSourceFile("products.ts", text, ts.ScriptTarget.Latest, true).statements.map(node => ({ name: node.name?.text || node.declarationList?.declarations[0]?.name?.getText(), text: normalized(node.getText()) }));
}
const modifiedAdhd = new Set(["ADHD_DELUXE_BOOK", "AdhdDeluxeCheckoutVerification", "AdhdDeluxeCheckoutDiagnostic", "inspectAdhdDeluxeBookCheckoutSession", "adhdDeluxeBookR2Config"]);
const after = statements(current("app/_lib/bookProducts.server.ts"));
for (const statement of statements(original("app/_lib/bookProducts.server.ts"))) {
  if (!modifiedAdhd.has(statement.name)) assert(after.some(candidate => candidate.text === statement.text), `Shared statement changed: ${statement.name}`);
}
function withoutAdhdCard(text) {
  const start = text.indexOf('          <article className={styles.bookCard}>\n            <Image src="/adhd-');
  assert(start !== -1);
  const end = text.indexOf("          </article>", start) + "          </article>".length;
  return text.slice(0, start) + "ADHD_CARD" + text.slice(end);
}
assert.equal(withoutAdhdCard(normalized(current("app/page.tsx"))), withoutAdhdCard(normalized(original("app/page.tsx"))));
const manifest = JSON.parse(current("docs/adhd-deluxe-release-assets.json"));
const privateNames = manifest.files.map(file => file.file);
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
for (const file of walk(path.join(root, "public"))) {
  assert(!privateNames.includes(path.basename(file)), `Private release file in public: ${file}`);
  if (file.toLowerCase().endsWith(".pdf")) assert(!/adhd(?!.*audhd)/i.test(file.replaceAll("\\", "/").split("/public/")[1]), `Public ADHD PDF: ${file}`);
}
assert.equal(fs.readFileSync(path.join(root, "public/adhd-bok-mockup.png")).compare(fs.readFileSync(path.join(root, "public/adhd-deluxe/mockup.png"))), 0);
console.log("PASS: only ADHD release edits; all other book verifiers, autism delivery, test prices/paywalls, shared offers, account candidate and sale switches preserved; homepage differs only in its ADHD card; complete ADHD PDFs remain outside public.");
