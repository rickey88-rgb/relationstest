/* eslint-disable @typescript-eslint/no-require-imports -- isolated maintenance authority matrix. */
const assert = require("node:assert/strict"), path = require("node:path");
const { NextRequest, NextResponse } = require("next/server");
const load = require("../autism-test/test/test-loader.cjs")();
const access = load(path.join(__dirname, "accountCleanupContext.server.ts"));
const proxy = load(path.join(__dirname, "../../proxy.ts")).proxy;
const SECRET = "synthetic-cron-maintenance-only";
process.env.CRON_SECRET = SECRET;
process.env.ACCOUNT_PORTAL_ENABLED = "false";
const paths = { audhd: "/api/cron/account-analysis-cleanup", tests: "/api/cron/test-account-cleanup" };
const req = (url, token = SECRET, method = "GET") => new NextRequest("https://www.relationsvarning.se" + url,
  { method, headers: { authorization: "Bearer " + token, cookie: "sb-synthetic=synthetic-session" } });
(async () => {
  let checks = 0, executions = 0;
  for (const globalMode of [undefined, "disabled", "maintenance", "active"]) {
    for (const testMode of [undefined, "disabled", "maintenance", "active"]) {
      if (globalMode === undefined) delete process.env.ACCOUNT_STORAGE_MODE; else process.env.ACCOUNT_STORAGE_MODE = globalMode;
      if (testMode === undefined) delete process.env.TEST_ACCOUNTS_STORAGE_MODE; else process.env.TEST_ACCOUNTS_STORAGE_MODE = testMode;
      for (const job of ["audhd", "tests"]) {
        const allowed = ["maintenance", "active"].includes(globalMode) && (job === "audhd" || ["maintenance", "active"].includes(testMode));
        const handler = access.accountCleanupHandler(job, async () => {
          executions++; assert(access.hasCleanupContext(job));
          access.assertAccountDatabaseAccess(job);
          assert.throws(() => access.assertAccountDatabaseAccess(job === "audhd" ? "tests" : "audhd"), /unavailable/);
          await Promise.resolve(); assert(access.hasCleanupContext(job));
          return NextResponse.json({ ok: true });
        });
        assert.equal((await handler(req(paths[job]))).status, allowed ? 200 : 503); checks++;
        assert.equal((await proxy(req(paths[job]))).status, allowed ? 200 : 503); checks++;
        for (const invalid of [req(paths[job], ""), req(paths[job], "wrong"), req(paths[job], SECRET, "POST"),
          req("/api/account/purchases", SECRET), req("/api/cron/test-account-cleanup/extra", SECRET)]) {
          const before = executions;
          assert.equal((await handler(invalid)).status, 503);
          assert.equal(executions, before); checks++;
        }
        assert(!access.hasCleanupContext(job));
        assert.throws(() => access.assertAccountDatabaseAccess(job), /unavailable/);
      }
    }
  }
  process.env.ACCOUNT_STORAGE_MODE = "maintenance"; process.env.TEST_ACCOUNTS_STORAGE_MODE = "maintenance";
  for (const url of ["/mina-sidor", "/logga-in", "/auth/confirm", "/api/account/purchases/claim",
    "/api/test-accounts/adhd/checkout", "/api/account-maintenance/reconcile"]) {
    assert.equal((await proxy(req(url))).status, 503, "Cron credential must not open customer/admin paths"); checks++;
  }
  assert.equal(access.authorizedCleanupJob(req(paths.audhd + "/health")), "audhd");
  assert.equal(access.authorizedCleanupJob(req(paths.tests + "?health=true")), "tests");
  await Promise.all(["audhd", "tests"].map(job => access.accountCleanupHandler(job, async () => {
    await new Promise(resolve => setTimeout(resolve, 1));
    assert(access.hasCleanupContext(job));
    assert(!access.hasCleanupContext(job === "audhd" ? "tests" : "audhd"));
    return NextResponse.json({ ok: true });
  })(req(paths[job]))));
  for (const job of ["audhd", "tests"]) assert(!access.hasCleanupContext(job));
  console.log("PASS: " + checks + " mode/method/path/credential checks; customer gate stays closed; scoped authority survives await and never leaks between jobs.");
})().catch(error => { console.error(error); process.exitCode = 1; });
