/* eslint-disable @typescript-eslint/no-require-imports -- real component rendering with safe fixtures. */
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const createLoader = require("../autism-test/test/test-loader.cjs");
let signedIn = true, unavailable = false, purchases = [];
const styles = new Proxy({}, { get: (_target, name) => name });
const Page = createLoader({
  "./page.module.css": { default: styles },
  "../_components/Brand": { default: () => React.createElement("span", null, "Relationsvarning") },
  "../_lib/authSession.server": { authenticatedUser: async () => signedIn ? { id: "11111111-1111-4111-8111-111111111111", email: "safe-fixture@example.test", email_confirmed_at: "2026-01-01" } : null },
  "../_lib/accountPurchasesDb.server": { accountStorageReady: async () => !unavailable, listAccountPurchases: async () => purchases },
  "next/navigation": { redirect: url => { throw new Error("REDIRECT:" + url); } },
})(path.join(__dirname, "page.tsx")).default;
const render = async () => renderToStaticMarkup(await Page({ searchParams: Promise.resolve({}) }));
function preview(name, html) {
  if (!process.env.ACCOUNT_UI_PREVIEW_DIR) return;
  const output = path.resolve(process.env.ACCOUNT_UI_PREVIEW_DIR);
  fs.mkdirSync(output, { recursive: true });
  const css = fs.readFileSync(path.join(__dirname, "page.module.css"), "utf8");
  fs.writeFileSync(path.join(output, name + ".html"), `<!doctype html><html lang="sv"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lokal testvy</title><style>*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif}a{color:inherit}${css}</style><body><p style="padding:8px;margin:0;background:#fff2ba;font-size:11px">LOKAL TESTVY · FIKTIVA TESTDATA</p>${html}</body></html>`);
}
(async () => {
  let html = await render();
  preview("empty", html);
  assert.match(html, /Välkommen till din samling/);
  assert.doesNotMatch(html, /Öppna min analys/);
  assert.doesNotMatch(html, /kan inte hämtas just nu/);
  purchases = [{ id: "22222222-2222-4222-8222-222222222222", productKey: "audhd_test", status: "available",
    purchasedAt: new Date("2026-10-01"), analysisExpiresAt: new Date("2027-09-30"), amountTotalOre: 7900, currency: "sek" }];
  html = await render(); preview("purchased", html); assert.match(html, /Öppna min analys/); assert.match(html, /Radera sparad analys/);
  purchases[0].status = "user_deleted"; purchases[0].analysisExpiresAt = null;
  html = await render(); assert.match(html, /Analysen raderad/); assert.doesNotMatch(html, /Öppna min analys/);
  unavailable = true; html = await render(); assert.match(html, /kan inte hämtas just nu/); assert.doesNotMatch(html, /0 sparade/);
  signedIn = false; await assert.rejects(render(), /REDIRECT:\/logga-in/);
  const load = createLoader();
  const { calculateReport } = load(path.join(__dirname, "../audhd-test/test/model.ts"));
  const Report = load(path.join(__dirname, "../audhd-test/test/ReportView.tsx")).default;
  const SavedReport = load(path.join(__dirname, "SavedAudhdReport.tsx")).default;
  const report = calculateReport(Array(48).fill(2), Array(6).fill(3));
  const guest = renderToStaticMarkup(React.createElement(Report, { report, onRestart: () => {} }));
  const saved = renderToStaticMarkup(React.createElement(SavedReport, { report }));
  assert.equal(saved, guest, "saved and guest analysis reuse the identical full report markup");
  assert.match(saved, /id="audhd-print-report"/);
  console.log("PASS: real portal components render empty, purchased, deleted and unavailable states; guest/account report markup is identical.");
})().catch(error => { console.error(error); process.exitCode = 1; });
