/* eslint-disable @typescript-eslint/no-require-imports -- offline preview boundary and renderer tests */
const test = require("node:test"), assert = require("node:assert/strict"), path = require("node:path");
const React = require("react"), { renderToStaticMarkup } = require("react-dom/server");
const createLoader = require("../../app/autism-test/test/test-loader.cjs");
const fixtures = require("./insights-v2-full-fixtures.cjs");
const root = path.resolve(__dirname, "../..");
const css = { default: new Proxy({}, { get: (_, key) => String(key) }) };
const load = createLoader({
  "../report/report.module.css": css, "./preview.module.css": css,
  "./report.module.css": css,
});
const v6 = load(path.join(root, "app/persona/_domain/v6/index.ts"));
const view = load(path.join(root, "app/persona/dev-report-v6/PersonaV6Report.tsx"));
const build = profile => v6.buildReport({ questionVersion: v6.VERSIONS.question, reportVersion: v6.VERSIONS.report, answers: profile.answers });
for (const id of ["F01","F03","F04","F06","F19","F24"]) {
  test(id + ": preview preserves the real title, six sections, insights and advice without trace fields", () => {
    const report = build(fixtures.find(p => p.id === id)), presentation = view.presentReport(report);
    const html = renderToStaticMarkup(React.createElement(view.default, { report: presentation }));
    assert(html.includes(report.title));
    assert.equal((html.match(/<section /g) || []).length, 6);
    for (const section of report.sections) {
      assert(html.includes(section.title));
      assert(section.blocks.length || section.note);
      for (const block of section.blocks) assert(html.includes(block.title));
    }
    const json = JSON.stringify(presentation);
    for (const key of ["evidence","counterEvidence","contextEvidence","insightAnalysis","claims","presentationId","contentVersion","answers"])
      assert(!json.includes('"' + key + '":'), key);
    assert(!/Q[0-9]{2}[=:]|Underlag:|Motbelägg:/.test(html));
    assert(html.includes("Skriv ut eller spara som PDF"));
    const paragraphs = Array.from(html.matchAll(/<p(?: [^>]*)?>(.*?)<\/p>/gs), match => match[1]).filter(p => p.length > 100);
    assert.equal(new Set(paragraphs).size, paragraphs.length, "renderer duplicates prose");
    if (id === "F04") {
      const strengths = presentation.sections.find(s => s.id === "strengths");
      assert(!/idéintresse/i.test(JSON.stringify(strengths)));
      assert(JSON.stringify(strengths).includes("bekant"));
    }
  });
}
test("all 24 projections match the original generator without mutating reports", () => {
  for (const profile of fixtures) {
    const report = build(profile), before = JSON.stringify(report), result = view.presentReport(report);
    assert.equal(JSON.stringify(report), before);
    assert.deepEqual(result.sections.map(s => s.blocks.map(b => b.interpretation)),
      report.sections.map(s => s.blocks.map(b => b.interpretation)));
  }
});
test("preview page denies production and non-local requests before loading synthetic data", async () => {
  const original = process.env.NODE_ENV;
  let calls = 0;
  const guarded = createLoader({
    "next/navigation": { notFound() { throw Error("not found"); } },
    "../dev-report/access": { canOpenLocalReport: async () => { calls++; return false; } },
    "./PersonaV6Report": {}, "./preview.module.css": css,
  })(path.join(root, "app/persona/dev-report-v6/page.tsx")).default;
  try {
    process.env.NODE_ENV = "production";
    await assert.rejects(guarded({ searchParams: Promise.resolve({}) }), /not found/);
    assert.equal(calls, 0);
    process.env.NODE_ENV = "development";
    await assert.rejects(guarded({ searchParams: Promise.resolve({ profile: "F01" }) }), /not found/);
    assert.equal(calls, 1);
  } finally {
    if (original === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = original;
  }
});
test("malformed IDs cannot load report data and arbitrary answer input is not accepted", async () => {
  const original = process.env.NODE_ENV;
  const guarded = createLoader({
    "next/navigation": { notFound() { throw Error("not found"); } },
    "../dev-report/access": { canOpenLocalReport: async () => true },
    "./PersonaV6Report": {}, "./preview.module.css": css,
  })(path.join(root, "app/persona/dev-report-v6/page.tsx")).default;
  try {
    process.env.NODE_ENV = "development";
    for (const profile of ["F00","F25","../../result","",["F01","F02"]])
      await assert.rejects(guarded({ searchParams: Promise.resolve({ profile }) }), /not found/);
  } finally {
    if (original === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = original;
  }
});
