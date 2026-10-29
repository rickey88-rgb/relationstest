/* eslint-disable @typescript-eslint/no-require-imports -- synthetic API, anonymous/owned reports and client transport regression checks. */
const assert = require("node:assert/strict");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { NextRequest } = require("next/server");
const createLoader = require("../../autism-test/test/test-loader.cjs");
const load = createLoader(), registry = load(path.join(__dirname, "adapter.ts"));
let user = null, stripeCalls = 0, creates = [], binds = [], saves = [], removals = [], stripeArgs, badPrice = false;
const origin = "https://www.relationsvarning.se", ID = "11111111-1111-4111-8111-111111111111";
const http = createLoader({ "./authSession.server": { authenticatedUser: async () => user } })(path.join(__dirname, "../accountHttp.server.ts"));
const factory = load(path.join(__dirname, "handlers.server.ts")).testAccountHandlers;
process.env.TEST_ACCOUNTS_SITE_ORIGIN = origin;
const deps = {
  ...http,
  paymentConfig: product => ({ price: `price_${product}` }),
  stripeClient: () => ({ prices: { retrieve: async () => { stripeCalls++; return { active: true, livemode: true, type: "one_time", unit_amount: badPrice ? 1 : current.amount, currency: "sek" }; } }, checkout: { sessions: { create: async (...args) => { stripeArgs = args; return { id: "cs_synthetic", livemode: true, url: "https://checkout.stripe.com/synthetic" }; } } } }),
  createAttempt: async (...args) => { creates.push(args); return ID; }, bindCheckout: async (...args) => binds.push(args),
  save: async (...args) => saves.push(args), remove: async (...args) => removals.push(args),
};
let current;
const api = createLoader({ "../../../../_lib/testAccounts/handlers.server": { testAccountHandlers: (product, slug) => factory(product, slug, deps) } })(path.join(__dirname, "../../api/test-accounts/[test]/[action]/route.ts"));
function request(slug, action, body = "", requestOrigin = origin) {
  return new NextRequest(`${origin}/api/test-accounts/${slug}/${action}`, { method: "POST", headers: { origin: requestOrigin, "content-type": "application/x-www-form-urlencoded", cookie: "rv_test_accounts_browser=" + "a".repeat(43) }, body });
}
const params = (slug, action) => ({ params: Promise.resolve({ test: slug, action }) });
async function expand(value) {
  if (Array.isArray(value)) return Promise.all(value.map(async (item, index) => {
    const child = await expand(item);
    return React.isValidElement(child) && child.key === null ? React.cloneElement(child, { key: `expanded-${index}` }) : child;
  }));
  if (!React.isValidElement(value)) return value;
  if (typeof value.type === "function") return expand(await value.type(value.props));
  return React.cloneElement(value, {}, await expand(value.props.children));
}
async function run(slugs = ["hsp", "angest", "ptsd"], answerFactory = () => Array(30).fill(2)) {
  for (const slug of slugs) {
    current = registry.adapterForSlug(slug);
    const get = await api.GET(request(slug, "capabilities"), params(slug, "capabilities")); assert.deepEqual(await get.json(), { checkout: false });
    const before = stripeCalls;
    assert.equal((await api.POST(request(slug, "checkout"), params(slug, "checkout"))).status, 503); assert.equal(stripeCalls, before);
    process.env[`${current.flagPrefix}_CHECKOUT_ENABLED`] = "true";
    const body = new URLSearchParams({ payload: JSON.stringify({ answers: answerFactory(current), questionVersion: current.questionVersion, reportVersion: current.reportVersion }) });
    assert.equal((await api.POST(request(slug, "checkout", body, "https://attacker.invalid"), params(slug, "checkout"))).status, 403);
    assert.equal((await api.POST(request(slug, "checkout", "x=" + "a".repeat(5000)), params(slug, "checkout"))).status, 400);
    badPrice = true; const createdBefore = creates.length; assert.equal((await api.POST(request(slug, "checkout", body), params(slug, "checkout"))).status, 503); assert.equal(creates.length, createdBefore); badPrice = false;
    const response = await api.POST(request(slug, "checkout", body), params(slug, "checkout")); assert.equal(response.status, 200);
    assert.equal(creates.at(-1)[0], current.product); assert.equal(creates.at(-1)[2], "a".repeat(43)); assert.deepEqual(binds.at(-1), [ID, "cs_synthetic"]);
    assert.equal(stripeArgs[0].success_url, `${origin}/mina-sidor/gast/${slug}/${ID}`); assert.equal(stripeArgs[0].cancel_url, `${origin}${current.testPath ?? `/${slug}-test/test`}`);
    assert.equal(stripeArgs[0].client_reference_id, `ta:${ID}`); assert(!JSON.stringify(stripeArgs).includes("answers"));
    assert.match(response.headers.get("set-cookie"), /HttpOnly/); assert.match(response.headers.get("set-cookie"), /Secure/);
    assert.equal((await api.POST(request(slug, "save", "id=x"), params(slug, "save"))).status, 401);
    user = { id: ID, email_confirmed_at: "2026-01-01", is_anonymous: false };
    assert.equal((await api.POST(request(slug, "save", "id=x&owner=forged&consent=test-account-storage-v1"), params(slug, "save"))).status, 303);
    assert.equal(saves.at(-1)[2], ID); assert.equal(saves.at(-1)[4], current.product, "save is explicitly bound to endpoint product");
    assert.equal((await api.POST(request(slug, "legacy-import", "paid=true"), params(slug, "legacy-import"))).status, 503);
    await api.POST(request(slug, "delete", "id=x&owner=forged"), params(slug, "delete")); assert.deepEqual(removals.at(-1), ["x", ID]);
    user = null; delete process.env[`${current.flagPrefix}_CHECKOUT_ENABLED`];

    process.env[`${current.flagPrefix}_SAVE_ENABLED`] = "true";
    const calls = [];
    const viewLoader = createLoader({ "next/link": { default: ({ href, children }) => React.createElement("a", { href }, children) }, "next/headers": { cookies: async () => ({ get: () => ({ value: "synthetic-possession" }) }) },
      "../../../../_lib/accountHttp.server": { accountIdentity: async () => ({ kind: "anonymous" }) },
      "../../../../_lib/testAccounts/service.server": { guestForProduct: async (...args) => { calls.push(args); return { row: { expires_at: new Date("2026-11-01") }, result: current.calculate(answerFactory(current)) }; } },
    });
    const Guest = viewLoader(path.join(__dirname, "../../mina-sidor/gast/[test]/[id]/page.tsx")).default;
    const html = renderToStaticMarkup(await expand(await Guest({ params: Promise.resolve({ test: slug, id: ID }) })));
    assert(html.includes(`Din köpta ${current.title}-analys`)); assert(!html.includes('name="consent"'), "guest can read without account; saving requires login");
    assert.deepEqual(calls[0], [ID, "synthetic-possession", current.product]);
    const signedLoader = createLoader({ "next/link": { default: ({ href, children }) => React.createElement("a", { href }, children) }, "next/headers": { cookies: async () => ({ get: () => ({ value: "synthetic-possession" }) }) },
      "../../../../_lib/accountHttp.server": { accountIdentity: async () => ({ kind: "authenticated", userId: ID, email: "synthetic@example.invalid" }) },
      "../../../../_lib/testAccounts/service.server": { guestForProduct: async () => ({ row: { expires_at: new Date("2026-11-01") }, result: current.calculate(answerFactory(current)) }), openForProduct: async (...args) => { calls.push(args); return current.calculate(answerFactory(current)); } },
    });
    const SignedGuest = signedLoader(path.join(__dirname, "../../mina-sidor/gast/[test]/[id]/page.tsx")).default;
    const signedHtml = renderToStaticMarkup(await expand(await SignedGuest({ params: Promise.resolve({ test: slug, id: ID }) })));
    assert(signedHtml.includes(`action="/api/test-accounts/${slug}/save"`)); assert(signedHtml.includes('required="" name="consent" value="test-account-storage-v1"'));
    const Saved = signedLoader(path.join(__dirname, "../../mina-sidor/tester/[test]/[id]/page.tsx")).default;
    const savedHtml = renderToStaticMarkup(await expand(await Saved({ params: Promise.resolve({ test: slug, id: ID }) })));
    assert(savedHtml.includes(`Din sparade ${current.title}-analys`)); assert.deepEqual(calls.at(-1), [ID, ID, current.product]);
    delete process.env[`${current.flagPrefix}_SAVE_ENABLED`];
    console.log(`PASS: ${slug}: flags-off isolation, bound checkout/save URLs, price/CSRF/Auth/body checks, anonymous report and explicit consent/owned reopening UI.`);
  }
  assert.equal((await api.GET(request("audhd", "capabilities"), params("audhd", "capabilities"))).status, 404);
  const all = registry.registeredAdapters();
  all.forEach(model => { process.env[`${model.flagPrefix}_READ_ENABLED`] = "true"; });
  const libraryLoader = createLoader({ "next/link": { default: ({ href, children }) => React.createElement("a", { href }, children) },
    "../../_lib/accountHttp.server": { accountIdentity: async () => ({ kind: "authenticated", userId: ID }) },
    "../../_lib/testAccounts/service.server": { active: () => {} },
    "../../_lib/testAccounts/store.server": { list: async owner => { assert.equal(owner, ID); return all.map((model, index) => ({ id: `synthetic-purchase-${index}`, product: model.product, purchased_at: new Date("2026-01-01"), expires_at: new Date(Date.now() + 86400000) })); } },
  });
  const Library = libraryLoader(path.join(__dirname, "../../mina-sidor/tester/page.tsx")).default;
  const libraryHtml = renderToStaticMarkup(await expand(await Library()));
  all.forEach((model, index) => {
    assert(libraryHtml.includes(`${model.title} – personlig analys`));
    assert(libraryHtml.includes(`href="/mina-sidor/tester/${model.slug}/synthetic-purchase-${index}"`));
    assert(libraryHtml.includes(`action="/api/test-accounts/${model.slug}/delete"`));
    delete process.env[`${model.flagPrefix}_READ_ENABLED`];
  });
  console.log("PASS: actual Mina tester component labels and routes all registered products correctly and queries only the authenticated owner.");
  let authCalls = 0;
  const { proxy } = createLoader({ "./app/_lib/authSession.server": { refreshAuthSession: async () => { authCalls++; return null; }, copyResponseCookies: (_, to) => to } })(path.join(__dirname, "../../../proxy.ts"));
  for (const slug of [...new Set(["adhd", "hsp", "angest", "ptsd", ...slugs])]) assert.equal((await proxy(new NextRequest(`${origin}/mina-sidor/gast/${slug}/${ID}`))).status, 200);
  assert.equal(authCalls, 0);
  assert.equal((await proxy(new NextRequest(`${origin}/mina-sidor/tester/hsp/${ID}`))).status, 303);
  assert.equal((await proxy(new NextRequest(`${origin}/mina-sidor/gast/audhd/${ID}`))).status, 303);
  assert.equal((await proxy(new NextRequest(`${origin}/mina-sidor/gast/hsp/${ID}/other`))).status, 303);
  let enabled = false, posts = [], errors = 0;
  global.fetch = async (url, options) => { posts.push({ url, options }); return { ok: false }; };
  const hooks = createLoader({ react: { useState: () => [enabled, () => {}], useRef: () => ({ current: false }), useEffect: () => {} } });
  const useCheckout = hooks(path.join(__dirname, "../../_components/useTestAccountCheckout.ts")).useTestAccountCheckout;
  for (const slug of [...new Set(["adhd", "hsp", "angest", "ptsd", ...slugs])]) {
    current = registry.adapterForSlug(slug);
    const versions = { questionVersion: current.questionVersion, reportVersion: current.reportVersion };
    assert.equal(useCheckout(slug, answerFactory(current), () => errors++, versions)(), false); assert.equal(posts.length, 0);
    enabled = true; const start = useCheckout(slug, answerFactory(current), () => errors++, versions);
    assert.equal(start(), true); assert.equal(start(), true); assert.equal(posts.length, 1); assert.equal(posts[0].url, `/api/test-accounts/${slug}/checkout`);
    const submitted = JSON.parse(posts[0].options.body.get("payload")); assert.equal(submitted.questionVersion, current.questionVersion); assert.equal(submitted.reportVersion, current.reportVersion); assert.deepEqual(submitted.answers, answerFactory(current));
    await new Promise(resolve => setImmediate(resolve)); assert(errors > 0); posts = []; enabled = false;
  }
  console.log("PASS: shared browser transport preserves flags-off fallback and prevents duplicate requests/silent legacy fallback on errors; guest proxy exemptions remain narrow.");
}
module.exports = run;
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
