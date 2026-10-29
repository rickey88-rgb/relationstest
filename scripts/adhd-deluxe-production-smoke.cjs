/* eslint-disable @typescript-eslint/no-require-imports -- local production-build HTTP smoke test; no real credentials. */
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const secret = "production-smoke-local-only-book-cookie-secret-32-plus";
const env = { ...process.env, NODE_ENV: "production", ADHD_DELUXE_LOCAL_PREVIEW: "1", BOOK_ACCESS_TOKEN_SECRET: secret, NEXT_TELEMETRY_DISABLED: "1" };
for (const name of Object.keys(env)) if (/^(R2_|STRIPE_SECRET_KEY|ADHD_DELUXE_.*R2_KEY)/.test(name)) delete env[name];
const server = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "3125"], { cwd: root, env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
let logs = ""; server.stdout.on("data", value => logs += value); server.stderr.on("data", value => logs += value);
const base = "http://127.0.0.1:3125";
function cookie(product) {
  const payload = Buffer.from(JSON.stringify({ v: 1, kind: "book-access", product, exp: Math.floor(Date.now() / 1000) + 600, nonce: "local-production-smoke-nonce" })).toString("base64url");
  return `rv_adhd_deluxe_book_access=${payload}.${crypto.createHmac("sha256", secret).update(payload).digest("base64url")}`;
}
(async () => {
  let ready = false;
  try {
    for (let attempt = 0; attempt < 80; attempt++) {
      try { const response = await fetch(base + "/adhd-deluxe"); if (response.status === 200) { ready = true; break; } } catch { /* server starting */ }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    assert(ready, logs);
    let checks = 0;
    for (const query of ["", "?offer=analysis"]) {
      const response = await fetch(base + "/adhd-deluxe" + query); const html = await response.text();
      assert.equal(response.status, 200); assert(html.includes("Försäljningen öppnar snart")); assert(!html.includes('href="https://buy.stripe.com/'));
      assert(!html.includes('"availability":"https://schema.org/InStock"')); checks += 4;
    }
    for (const file of ["book", "worksheets", "print"]) {
      for (const token of [undefined, "rv_adhd_deluxe_book_access=forged", cookie("autism-bok")]) {
        const response = await fetch(`${base}/api/books/adhd-deluxe/download?file=${file}`, { headers: token ? { cookie: token } : {}, redirect: "manual" });
        assert.equal(response.status, 403); assert.equal(response.headers.get("location"), null); assert.equal(response.headers.get("cache-control"), "private, no-store"); checks += 3;
      }
      const response = await fetch(`${base}/api/books/adhd-deluxe/download?file=${file}`, { headers: { cookie: cookie("adhd-deluxe") }, redirect: "manual" });
      assert.equal(response.status, 503); assert.equal(response.headers.get("location"), null); checks += 2;
    }
    const denied = await fetch(base + "/adhd-deluxe/tack/klart"); assert(!(await denied.text()).includes('href="/api/books/adhd-deluxe/download')); checks++;
    const allowed = await fetch(base + "/adhd-deluxe/tack/klart", { headers: { cookie: cookie("adhd-deluxe") } });
    const allowedHtml = await allowed.text();
    for (const suffix of ["", "?file=worksheets", "?file=print"]) assert(allowedHtml.includes(`href="/api/books/adhd-deluxe/download${suffix}"`)); checks += 3;
    const spoof = await fetch(base + "/adhd-deluxe/tack?paid=true&session_id=invalid", { redirect: "manual" });
    assert.equal(spoof.status, 303); assert(spoof.headers.get("location").endsWith("/tack/fel")); assert.equal(spoof.headers.get("set-cookie"), null); checks += 3;
    const home = await (await fetch(base + "/")).text(); assert(home.includes('href="/adhd-deluxe"')); assert(home.includes("28 verktyg")); checks += 2;
    const result = { checks, productionBuild: true, developmentOverrideRejected: true, externalWrites: 0, fileAccessFailsClosed: true };
    fs.writeFileSync(path.join(root, ".artifacts/adhd-deluxe/production-smoke.json"), JSON.stringify(result, null, 2));
    console.log(`PASS: ${checks} HTTP checks against the actual local production build; paused sale, ignored development override, protected downloads, three-file confirmation, spoofed returns denied and updated home card.`);
  } finally { server.kill(); }
})().catch(error => { console.error(error); console.error(logs); process.exitCode = 1; });
