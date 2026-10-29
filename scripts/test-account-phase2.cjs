/* eslint-disable @typescript-eslint/no-require-imports -- local regression runner. */
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const tests = [
  "app/_lib/accountPortal.postgres.test.cjs",
  "app/_lib/accountErasureJournal.server.test.cjs",
  "app/_lib/accountMonitoring.server.test.cjs",
  "app/api/account-maintenance/reconcile/route.test.cjs",
  "app/api/account-maintenance/erase-account-analyses/route.test.cjs",
  "app/_lib/accountAudhdProof.server.test.cjs",
  "app/_lib/accountAudhdPayment.server.test.cjs",
  "app/api/account/account-routes.test.cjs",
  "app/api/cron/account-analysis-cleanup/route.test.cjs",
  "app/api/cron/account-analysis-cleanup/health/route.test.cjs",
  "app/mina-sidor/portal-ui.test.cjs",
  "app/_analytics/account-privacy.test.cjs",
  "app/_analytics/analytics.test.cjs",
  "app/_analytics/checkout-navigation.test.cjs",
  "app/logga-in/actions.test.cjs",
  "app/auth/confirm/route.test.cjs",
  "app/logga-ut/route.test.cjs",
  "app/_lib/authConfig.server.test.cjs",
  "proxy.auth.test.cjs", "proxy.test.cjs",
  "app/audhd-test/test/model.test.cjs",
  "app/audhd-test/test/print-report.test.cjs",
  "app/audhd-test/test/payment-return.test.cjs",
  "app/audhd-test/test/legacy-recovery-client.test.cjs",
  "app/_lib/audhdCheckoutAttempt.server.test.cjs",
  "app/_lib/audhdCheckoutPayment.server.test.cjs",
  "app/_lib/audhdRecoveryPayment.server.test.cjs",
  "app/_lib/audhdRecovery.server.test.cjs",
  "app/api/audhd-checkout/restore/route.test.cjs",
  "app/api/audhd-recovery/restore/route.test.cjs",
  "app/api/audhd-recovery/redeem/route.test.cjs",
  "app/api/audhd-recovery/legacy-compat.test.cjs",
  "app/_lib/bookAccess.server.test.cjs",
  "app/api/books/audhd-bok/download/route.test.cjs",
  "app/api/books/autism-bok/download/route.test.cjs",
  "app/api/books/adhd-deluxe/download/route.test.cjs",
  "vercel-cron.test.cjs",
];
for (const test of tests) {
  console.log(`RUN ${test}`);
  const result = spawnSync(process.execPath, [test], { cwd: path.resolve(__dirname, ".."), stdio: "inherit",
    env: { ...process.env, ACCOUNT_PORTAL_ENABLED: "true" } });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(`PASS: ${tests.length} account and compatibility test programs completed.`);
