/* eslint-disable @typescript-eslint/no-require-imports -- synthetic checkout/maintenance/cron boundaries; no external calls. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../autism-test/test/test-loader.cjs");
const http = createLoader({ "./authSession.server": { authenticatedUser: async () => null } })(path.join(__dirname, "../accountHttp.server.ts"));
const ID = "11111111-1111-4111-8111-111111111111";
const origin = "https://www.relationsvarning.se";
let created, bound, stripeArgs, badPrice = false, badSession = false;
Object.assign(process.env, { TEST_ACCOUNTS_ADHD_CHECKOUT_ENABLED: "true", TEST_ACCOUNTS_SITE_ORIGIN: origin });
const checkout = createLoader({ "../../../../_lib/accountHttp.server": http,
  "../../../../_lib/testAccounts/store.server": {
    createAttempt: async (...args) => { created = args; return ID; }, bindCheckout: async (...args) => { bound = args; },
  }, "../../../../_lib/testAccounts/payment.server": {
    paymentConfig: () => ({ price: "price_synthetic", live: true }),
    stripeClient: () => ({ prices: { retrieve: async () => ({ active: true, livemode: true, type: "one_time", currency: "sek", unit_amount: badPrice ? 1 : 3900 }) },
      checkout: { sessions: { create: async (...args) => { stripeArgs = args; return { id: "cs_synthetic", livemode: true, url: badSession ? "https://attacker.invalid/" : "https://checkout.stripe.com/synthetic" }; } } } }),
  },
})(path.join(__dirname, "../../api/test-accounts/adhd/[action]/route.ts"));
function post(url, body, extra = {}) { return new NextRequest(origin + url, { method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded", ...extra }, body }); }
(async () => {
  const payload = JSON.stringify({ answers: Array(30).fill(2), questionVersion: "adhd-questions-v1", reportVersion: "adhd-report-v1" });
  const invoke = () => checkout.POST(post("/api/test-accounts/adhd/checkout", new URLSearchParams({ payload })), { params: Promise.resolve({ action: "checkout" }) });
  let response = await invoke(); assert.equal(response.status, 200);
  assert.equal(created[0], "adhd_test"); assert.deepEqual(created[1].answers, Array(30).fill(2)); assert.equal(created[2].length, 43);
  assert.deepEqual(bound, [ID, "cs_synthetic"]);
  assert.equal(stripeArgs[0].client_reference_id, `ta:${ID}`); assert.equal(stripeArgs[1].idempotencyKey, `test-account:${ID}`);
  assert.equal(stripeArgs[0].success_url, `${origin}/mina-sidor/gast/adhd/${ID}`);
  assert(!JSON.stringify(stripeArgs).includes("answers")); assert(!JSON.stringify(stripeArgs).includes(created[2]));
  assert.match(response.headers.get("set-cookie"), /HttpOnly/i); assert.match(response.headers.get("set-cookie"), /Secure/i); assert.match(response.headers.get("set-cookie"), /SameSite=lax/i);
  badPrice = true; created = null; assert.equal((await invoke()).status, 503); assert.equal(created, null); badPrice = false;
  badSession = true; bound = null; assert.equal((await invoke()).status, 503); assert.equal(bound, null); badSession = false;
  process.env.TEST_ACCOUNTS_SITE_ORIGIN = "https://attacker.invalid"; assert.equal((await invoke()).status, 503);
  let cleans = 0, restores = 0, erasures = 0, healthy = false;
  process.env.CRON_SECRET = "synthetic-cron"; process.env.ACCOUNT_MAINTENANCE_SECRET = "synthetic-maintenance-secret-at-least-32-characters";
  const operations = createLoader({ "../../../_lib/accountHttp.server": http, "../../../_lib/testAccounts/operations.server": {
    cleanup: async () => { cleans++; }, health: async () => healthy,
    reconcile: async () => { restores++; return { complete: true }; }, eraseOwner: async () => { erasures++; return { complete: true }; },
  } })(path.join(__dirname, "../../api/cron/test-account-cleanup/route.ts"));
  assert.equal((await operations.GET(new NextRequest(origin + "/api/cron/test-account-cleanup"))).status, 401); assert.equal(cleans, 0);
  const cron = url => new NextRequest(origin + url, { headers: { authorization: "Bearer synthetic-cron" } });
  assert.equal((await operations.GET(cron("/api/cron/test-account-cleanup"))).status, 200); assert.equal(cleans, 1);
  assert.equal((await operations.GET(cron("/api/cron/test-account-cleanup?health=true"))).status, 503);
  healthy = true; assert.equal((await operations.GET(cron("/api/cron/test-account-cleanup?health=true"))).status, 200);
  const maintenance = { authorization: `Bearer ${process.env.ACCOUNT_MAINTENANCE_SECRET}` };
  assert.equal((await operations.POST(post("/api/cron/test-account-cleanup", "confirm=reconcile-isolated-test-restore"))).status, 401);
  assert.equal((await operations.POST(post("/api/cron/test-account-cleanup", "", maintenance))).status, 400); assert.equal(restores, 0);
  assert.equal((await operations.POST(post("/api/cron/test-account-cleanup", "confirm=reconcile-isolated-test-restore&snapshotAt=synthetic", maintenance))).status, 200); assert.equal(restores, 1);
  assert.equal((await operations.POST(post("/api/cron/test-account-cleanup?operation=erase-owner", `owner=${ID}`, maintenance))).status, 400); assert.equal(erasures, 0);
  assert.equal((await operations.POST(post("/api/cron/test-account-cleanup?operation=erase-owner", `owner=${ID}&confirm=erase-test-account-analyses`, maintenance))).status, 200); assert.equal(erasures, 1);
  console.log("PASS: anonymous checkout binds encrypted attempt to server-selected Stripe session; price/origin/redirect checks and authorized, explicit cron/restore/erase boundaries.");
})().catch(error => { console.error(error); process.exitCode = 1; });
