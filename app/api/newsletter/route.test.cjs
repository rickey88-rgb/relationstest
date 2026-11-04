/* eslint-disable @typescript-eslint/no-require-imports -- newsletter HTTP regression harness. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("../../autism-test/test/test-loader.cjs");
async function main() {
  let calls = 0, configured = true;
  const service = { newsletterConfigured: () => configured, subscribeNewsletter: async body => { calls++; return body.consent === true ? "accepted" : "invalid"; } };
  const route = createLoader({ "../../_lib/newsletter.server": service })(path.join(__dirname, "route.ts"));
  const request = (body, origin = "https://www.relationsvarning.se") => new NextRequest("https://www.relationsvarning.se/api/newsletter", { method: "POST", headers: { origin, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  assert.equal((await route.POST(request({ consent: true }, "https://attacker.invalid"))).status, 403);
  assert.equal(calls, 0);
  assert.equal((await route.POST(request({ email: "x".repeat(3000), consent: true }))).status, 400);
  assert.equal(calls, 0);
  assert.equal((await route.POST(request({ consent: false }))).status, 400);
  const accepted = await route.POST(request({ consent: true }));
  assert.equal(accepted.status, 202);
  assert.deepEqual(await accepted.json(), { accepted: true });
  assert.equal(accepted.headers.get("cache-control"), "private, no-store");
  configured = false;
  assert.deepEqual(await (await route.GET()).json(), { enabled: false });
  const actions = createLoader({ "../../../_lib/newsletter.server": { confirmNewsletterToken: async token => token === "valid" ? "home" : null, unsubscribeNewsletterToken: async token => token === "valid" } })(path.join(__dirname, "[action]/route.ts"));
  assert.equal(actions.GET, undefined, "GET/link previews never activate or unsubscribe");
  const context = action => ({ params: Promise.resolve({ action }) });
  assert.equal((await actions.POST(request({ token: "invalid" }), context("confirm"))).status, 410);
  assert.equal((await actions.POST(request({ token: "valid" }), context("confirm"))).status, 200);
  assert.equal((await actions.POST(request({ token: "valid" }), context("unsubscribe"))).status, 200);
  console.log("PASS: newsletter HTTP origin/body protections, neutral responses, disabled capability and explicit POST-only actions.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
