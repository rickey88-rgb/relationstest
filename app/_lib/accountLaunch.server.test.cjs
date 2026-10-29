/* eslint-disable @typescript-eslint/no-require-imports -- synthetic closed-rollout regression. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../autism-test/test/test-loader.cjs");
const root = path.resolve(__dirname, "../..");
let sideEffects = 0;
const forbidden = () => { sideEffects++; throw new Error("Unexpected external dependency"); };
const dependency = new Proxy({}, { get: () => forbidden });
const overrides = {
  postgres: { default: forbidden },
  "next/navigation": {
    notFound: () => { throw new Error("TEST_NOT_FOUND"); },
    redirect: () => { throw new Error("TEST_REDIRECT"); },
  },
};
for (const prefix of ["./", "../", "../../", "../../../", "../../../../", "../../../../../", "../../../../../../"]) {
  for (const directory of ["", "_lib/"]) {
    for (const name of ["authSession.server", "supabase/server", "supabase/routeClient.server",
      "accountAudhdProof.server", "accountMonitoring.server", "testAccounts/operations.server"]) {
      overrides[prefix + directory + name] = dependency;
    }
  }
}
const load = createLoader(overrides);
const launch = load(path.join(__dirname, "accountLaunch.server.ts"));
const proxy = load(path.join(root, "proxy.ts")).proxy;
const adapters = load(path.join(__dirname, "testAccounts/adapter.ts"));
for (const model of adapters.registeredAdapters()) {
  for (const feature of ["CHECKOUT", "SAVE", "READ", "LEGACY_IMPORT"]) process.env[model.flagPrefix + "_" + feature + "_ENABLED"] = "true";
}
process.env.ACCOUNT_STORAGE_MODE = "active";
process.env.TEST_ACCOUNTS_STORAGE_MODE = "active";
process.env.CRON_SECRET = "synthetic-cron-secret";
const request = (url, method = "GET") => new NextRequest("https://www.relationsvarning.se" + url, {
  method, headers: { origin: "https://www.relationsvarning.se", authorization: "Bearer synthetic-cron-secret",
    cookie: "sb-synthetic-auth-token=synthetic-session", "content-type": "application/x-www-form-urlencoded" },
  ...(method === "POST" ? { body: "consent=synthetic" } : {}),
});
function routeFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? routeFiles(path.join(directory, entry.name)) :
      entry.name === "route.ts" ? [path.join(directory, entry.name)] : []);
}
const files = ["api/account", "api/account-maintenance", "api/test-accounts",
  "api/cron/account-analysis-cleanup", "api/cron/test-account-cleanup", "auth/confirm"]
  .flatMap(directory => routeFiles(path.join(root, "app", directory)));
const id = "11111111-1111-4111-8111-111111111111";
const params = { params: Promise.resolve({ test: "autism", action: "checkout", purchaseId: id }) };

(async () => {
  let directChecks = 0, proxyChecks = 0;
  // Even all product/storage flags and a session cookie cannot bypass the launch gate.
  for (const value of [undefined, "false", "FALSE", "TRUE", "1", " true ", "true\n"]) {
    if (value === undefined) delete process.env.ACCOUNT_PORTAL_ENABLED;
    else process.env.ACCOUNT_PORTAL_ENABLED = value;
    assert.equal(launch.accountPortalEnabled(), false);
    for (const model of adapters.registeredAdapters()) assert.deepEqual(adapters.flags(model.product),
      { checkout: false, save: false, read: false, legacyImport: false });
    for (const file of files) {
      const handlers = load(file);
      const url = "/" + path.relative(path.join(root, "app"), file).replaceAll("\\", "/").replace(/\/route\.ts$/, "")
        .replace("[test]", "autism").replace("[action]", "checkout").replace("[purchaseId]", id);
      for (const method of ["GET", "POST"]) {
        const response = await proxy(request(url, method));
        assert.equal(response.status, 503, url);
        assert.match(response.headers.get("cache-control"), /no-store/);
        proxyChecks++;
        if (handlers[method]) {
          assert.equal((await handlers[method](request(url, method), params)).status, 503, file + ":" + method);
          directChecks++;
        }
      }
    }
    for (const url of ["/mina-sidor", "/mina-sidor/koppla", "/mina-sidor/tester",
      "/mina-sidor/analyser/" + id, "/mina-sidor/gast/autism/" + id,
      "/mina-sidor/tester/autism/" + id, "/logga-in", "/mina-sidor/?_rsc=synthetic",
      "/%6dina-sidor", "/api/account/purchases/claim/"]) {
      assert.equal((await proxy(request(url))).status, 503, url);
      proxyChecks++;
    }
    assert.throws(() => load(path.join(root, "app/mina-sidor/layout.tsx")).default({ children: "PRIVATE" }), /TEST_NOT_FOUND/);
    await assert.rejects(load(path.join(root, "app/logga-in/page.tsx")).default({ searchParams: Promise.resolve({}) }), /TEST_NOT_FOUND/);
    await assert.rejects(load(path.join(root, "app/logga-in/actions.ts")).requestMagicLink(new FormData()), /TEST_REDIRECT/);
    assert.equal((await load(path.join(__dirname, "accountHttp.server.ts")).accountIdentity()).kind, "unavailable");
    await assert.rejects(load(path.join(__dirname, "accountPurchasesDb.server.ts")).accountStorageReady(), /Account portal unavailable/);
    assert.throws(() => load(path.join(__dirname, "testAccounts/store.server.ts")).db(), /Account portal unavailable/);
    assert.throws(() => load(path.join(__dirname, "accountErasureJournal.server.ts")).assertAccountStorageActive(), /Account portal unavailable/);
  }
  for (const url of ["/", "/adhd-test/test?paid=true", "/autism-test/test?paid=true", "/audhd-test/test",
    "/adhd-deluxe", "/autism-bok", "/audhd-bok", "/logga-ut",
    "/api/audhd-checkout/prepare", "/api/audhd-checkout/start", "/api/audhd-checkout/return",
    "/api/audhd-checkout/restore", "/api/audhd-recovery/redeem", "/api/autism-recovery/redeem",
    "/api/books/adhd-deluxe/download", "/api/books/autism-bok/download", "/api/books/autism-bok/worksheets",
    "/api/books/audhd-bok/download", "/api/stripe/webhook", "/api/cron/audhd-checkout-cleanup"]) {
    assert.equal((await proxy(request(url))).status, 200, url);
  }
  assert.equal(sideEffects, 0, "Closed customer routes must not call Auth, database, Stripe or monitoring");
  process.env.ACCOUNT_PORTAL_ENABLED = "true";
  assert.equal(launch.accountPortalEnabled(), true);
  assert(adapters.flags("autism_test").checkout, "Global opt-in still requires individual product flags");
  process.env.TEST_ACCOUNTS_AUTISM_CHECKOUT_ENABLED = "false";
  assert.equal(adapters.flags("autism_test").checkout, false);
  console.log("PASS: closed rollout; " + files.length + " real route modules, " + directChecks +
    " direct-handler checks, " + proxyChecks + " proxy checks; zero external effects; existing guest routes preserved.");
})().catch(error => { console.error(error); process.exitCode = 1; });
