/* eslint-disable @typescript-eslint/no-require-imports -- offline synthetic review artifacts */
const fs = require("node:fs");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { profiles, submission } = require("../tests/persona/v4-profiles.cjs");
const root = path.resolve(__dirname, "..");
const current = process.argv.includes("--v5");
const version = current ? "v5" : "v4";
const title = version.toUpperCase();
const output = process.argv[2] && process.argv[2] !== "--v5" ? path.resolve(process.argv[2]) : path.join(root, ".artifacts/persona-release", version);
const styles = new Proxy({}, { get: (_, key) => String(key) });
const load = require("../app/autism-test/test/test-loader.cjs")({ "./report.module.css": { default: styles } });
const Report = load(path.join(root, "app/persona/report/PersonaReportView.tsx")).default;
const api = { ...load(path.join(root, "app/persona/_domain/index.ts")), VERSIONS: load(path.join(root, "app/persona/_domain", version, "manifest.ts")).VERSIONS };
const { buildTeaser } = load(path.join(root, "app/persona/_domain", version, "report.ts"));
const css = fs.readFileSync(path.join(root, "app/persona/report/report.module.css"), "utf8").replaceAll(":global(body)", "body");
fs.mkdirSync(output, { recursive: true });
const examples = current ? [0, 2, 4, 8, 9].map(index => profiles[index]) : profiles;
const overview = [`# PERSONA ${title} – ${examples.length} syntetiska profiler`, "", "Varje länk öppnar hela rapporten. Gratisinsikten står också här så att det går att granska vad respektive del tillför.", ""];
for (const [index, profile] of examples.entries()) {
  const input = submission(api, profile);
  const report = api.buildPersonaReport(input);
  const teaser = buildTeaser(input);
  const file = `PERSONA-${title}-profil-${String(index + 1).padStart(2, "0")}.html`;
  const html = renderToStaticMarkup(React.createElement(Report, { report }));
  const sampleHeader = renderToStaticMarkup(React.createElement("p", { className: "sample" }, "Syntetisk testprofil · " + profile.name));
  fs.writeFileSync(path.join(output, file), `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PERSONA ${title} – exempel ${index + 1}</title><style>body{margin:0;padding:16px;background:#101626;color:#F5F0E7;font-family:Arial,sans-serif}.sample{text-align:center;font-size:13px}${css}</style></head><body>${sampleHeader}${html}<script>document.querySelectorAll('.printButton').forEach(button=>button.addEventListener('click',()=>window.print()))</script></body></html>`);
  const personal = report.sections.filter(section => section.paragraphs.some(paragraph => paragraph.findingIds.length)).length;
  overview.push(`## ${index + 1}. ${profile.name}`, "", `[Öppna fullständig rapport](${file})`, "",
    `**Gratisrubrik:** ${teaser.headline}`, "", teaser.text, "", `**Varför det spelar roll:** ${teaser.why}`, "",
    ...(teaser.deeper ? [`**Premium fortsätter med:** ${teaser.deeper}`, ""] : []),
    `**Rapportens signatur:** ${report.sections[0].paragraphs[0].text}`,
    `Avsnitt med ett personligt fynd: ${personal} av ${report.sections.length}.`, "");
}
fs.writeFileSync(path.join(output, current ? "PERSONA-V5-exempel.md" : "PERSONA-V4-tio-testprofiler.md"), overview.join("\n"));
console.log(`Wrote ${examples.length} complete reports and their free insights to ${output}`);
