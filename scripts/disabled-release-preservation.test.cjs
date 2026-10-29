/* eslint-disable @typescript-eslint/no-require-imports -- release scope and production preservation. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const git = args => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const allowed = new Set([
  "app/_lib/accountDatabaseTls.server.ts", "app/_lib/accountDatabaseTls.server.test.cjs",
  "app/_lib/accountLaunch.server.ts", "app/_lib/accountLaunch.server.test.cjs",
  "app/_lib/accountErasureJournal.server.ts", "app/_lib/accountHttp.server.ts",
  "app/_lib/accountPurchasesDb.server.ts", "app/_lib/accountPortal.postgres.test.cjs",
  "app/_lib/testAccounts/adapter.ts", "app/_lib/testAccounts/handlers.server.ts", "app/_lib/testAccounts/store.server.ts",
  "app/api/account/purchases/route.ts", "app/api/account/purchases/claim/route.ts",
  "app/api/account/purchases/[purchaseId]/analysis/delete/route.ts",
  "app/api/account-maintenance/reconcile/route.ts", "app/api/account-maintenance/erase-account-analyses/route.ts",
  "app/api/cron/account-analysis-cleanup/route.ts", "app/api/cron/account-analysis-cleanup/health/route.ts",
  "app/api/cron/test-account-cleanup/route.ts", "app/api/test-accounts/[test]/[action]/route.ts",
  "app/auth/confirm/route.ts", "app/logga-in/actions.ts", "app/logga-in/page.tsx",
  "app/mina-sidor/layout.tsx", "proxy.ts", "vercel.json", "vercel-cron.test.cjs",
  "scripts/test-account-phase2.cjs", "scripts/test-disabled-release.cjs",
  "scripts/disabled-release-preservation.test.cjs", "docs/mina-sidor-disabled-release.md",
]);
for (const file of git(["diff", "--name-only", "dd95876"]).split("\n").filter(Boolean)) assert(allowed.has(file), "Unexpected release edit: " + file);
assert.equal(git(["diff", "dd95876", "--", "supabase/migrations", "app/api/books", "app/_lib/bookProducts.server.ts",
  "app/_lib/bookAccess.server.ts", "app/_lib/audhdRecovery.server.ts", "app/api/audhd-checkout", "app/api/audhd-recovery",
  "app/api/stripe", "deploy"]), "", "Migrations, books, guest payment/recovery and Stripe configuration stay unchanged");
const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
const base = JSON.parse(git(["show", "9c4c34c:vercel.json"]));
assert.deepEqual(config, base, "First deployment preserves exactly the existing production cron configuration");
for (const slug of ["adhd", "autism"]) {
  assert.match(fs.readFileSync(path.join(root, "app", slug + "-test/test/model.ts"), "utf8"), /PRICE_SEK\s*=\s*39/);
}
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
const publicPdfs = files(path.join(root, "public")).filter(file => file.toLowerCase().endsWith(".pdf"))
  .map(file => path.relative(root, file).replaceAll("\\", "/")).sort();
const originalPublicPdfs = git(["ls-tree", "-r", "--name-only", "9c4c34c", "--", "public"])
  .split("\n").filter(file => file.toLowerCase().endsWith(".pdf")).sort();
assert.deepEqual(publicPdfs, originalPublicPdfs, "No additional PDF may become public in this release");
const protectedNames = JSON.parse(fs.readFileSync(path.join(root, "docs/adhd-deluxe-release-assets.json"))).files.map(file => file.file);
protectedNames.push("AUTISM_ALL_INCLUSIVE_Elias_Voss.pdf", "AUTISM_ALL_INCLUSIVE_arbetsblad_A4.pdf",
  "Varldens-basta-bok-om-AuDHD_Elias-Voss.pdf");
assert(!publicPdfs.some(file => protectedNames.includes(path.basename(file))), "Protected release PDFs stay outside public");
console.log("PASS: bounded follow-up diff; production cron, guest prices, books, Stripe, migrations and recovery remain unchanged.");
