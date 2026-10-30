/* eslint-disable @typescript-eslint/no-require-imports -- bounded operations follow-up. */
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const git = args => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const allowed = new Set(["app/_lib/accountCleanupContext.server.ts", "app/_lib/accountCleanupContext.server.test.cjs",
  "app/_lib/accountCleanupMaintenance.postgres.test.cjs", "app/_lib/accountLaunch.server.test.cjs",
  "app/_lib/accountPurchasesDb.server.ts", "app/_lib/testAccounts/store.server.ts", "app/_lib/testAccounts/operations.server.ts",
  "app/api/cron/account-analysis-cleanup/route.ts", "app/api/cron/account-analysis-cleanup/health/route.ts",
  "app/api/cron/account-analysis-cleanup/health/route.test.cjs", "app/api/cron/test-account-cleanup/route.ts",
  "proxy.ts", "scripts/maintenance-scope.test.cjs", "docs/account-maintenance-readiness.md", "vercel.json", "vercel-cron.test.cjs"]);
const changed = [...git(["diff", "--name-only", "5133c7a"]).split("\n"), ...git(["ls-files", "--others", "--exclude-standard"]).split("\n")].filter(Boolean);
for (const file of changed) assert(allowed.has(file), "Unexpected change: " + file);
assert.equal(git(["diff", "5133c7a", "--", "supabase/migrations", "app/api/books", "app/api/audhd-checkout",
  "app/api/audhd-recovery", "app/api/autism-recovery", "app/api/stripe", "deploy", "public",
  "app/_lib/accountErasureJournal.server.ts", "app/_lib/accountDatabaseTls.server.ts"]), "");
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "vercel.json"))).crons,
  [{ path: "/api/cron/audhd-checkout-cleanup", schedule: "15 3 * * *" },
    { path: "/api/cron/account-analysis-cleanup", schedule: "0 2 * * *" },
    { path: "/api/cron/test-account-cleanup", schedule: "30 3 * * *" }]);
console.log("PASS: maintenance-only scope and two approved account schedules; guest cron preserved; no migrations, prices, Stripe, books, guest recovery, journal or TLS changes.");
