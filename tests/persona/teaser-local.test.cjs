/* eslint-disable @typescript-eslint/no-require-imports -- offline assertions on the teaser and the local authorization boundary */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../../app/autism-test/test/test-loader.cjs");
const root = path.resolve(__dirname, "../..");
const modulePath = suffix => path.join(root, "app/persona", suffix);
const load = createLoader();
const { selectTeaser } = load(modulePath("_domain/v3/teaser.ts"));
const { VERSIONS } = load(modulePath("_domain/v5/manifest.ts"));

const ratings = (...numbers) => {
  const answers = Array(40).fill(3);
  for (const number of numbers) answers[number - 1] = 5;
  return answers;
};

test("teaser selects a cross-dimension pattern and cites precisely its premises", () => {
  const answers = ratings(1, 2, 34, 31, 32);
  const teaser = selectTeaser(answers);
  assert.equal(teaser.headline, "Lätt att ta kontakt, varsam med tillit");
  assert.deepEqual(teaser.evidence, [
    { questionId: "Q01", answer: 5 }, { questionId: "Q02", answer: 5 }, { questionId: "Q34", answer: 5 },
  ]);
  for (const value of [0, 1, 2, 3]) {
    answers[1] = value;
    assert.notEqual(selectTeaser(answers).headline, teaser.headline);
  }
  assert.notEqual(selectTeaser(ratings(21, 27)).text, selectTeaser(ratings(9, 14)).text);
});

test("teaser never invents a combination from a single response or changes purchase eligibility", () => {
  const single = selectTeaser(ratings(1));
  assert.equal(single.eligible, true);
  assert.deepEqual(single.evidence, []);
  assert.equal(selectTeaser(Array(40).fill(0)).eligible, false);
  const answers = ratings(1, 11, 21, 7, 17, 27);
  answers[20] = 3; // Avoid the direct leadership/samverkan rule.
  answers[5] = 1;  // Strong keyed support without a literal high response.
  const broad = selectTeaser(answers);
  assert.equal(broad.evidence.length, 6);
  assert.match(broad.text, /utåtriktat socialt sätt/);
  assert.match(broad.text, /hänsyn och samspel/);
});

test("local action fails closed before calculation in production, without opt-in and on non-local requests", async () => {
  const old = { nodeEnv: process.env.NODE_ENV, flag: process.env.PERSONA_LOCAL_REPORT_PREVIEW, origin: process.env.__NEXT_PRIVATE_ORIGIN };
  const host = "127.0.0.1:3134";
  const baseline = { host, origin: "http://" + host, "x-forwarded-host": host, "x-forwarded-proto": "http", "x-forwarded-for": "127.0.0.1" };
  let request = new Headers(baseline);
  const mockLoad = createLoader({
    "next/headers": { headers: async () => request },
    "next/navigation": { notFound: () => { throw new Error("not found"); } },
  });
  const { canOpenLocalReport } = mockLoad(modulePath("dev-report/access.ts"));
  const { loadLocalPersonaReport } = mockLoad(modulePath("dev-report/actions.ts"));
  const submission = { questionVersion: VERSIONS.question, reportVersion: VERSIONS.report, answers: ratings(1, 2, 34) };
  try {
    process.env.__NEXT_PRIVATE_ORIGIN = "http://" + host;
    process.env.NODE_ENV = "production";
    process.env.PERSONA_LOCAL_REPORT_PREVIEW = "1";
    await assert.rejects(loadLocalPersonaReport(submission), /not found/);
    process.env.NODE_ENV = "development";
    delete process.env.PERSONA_LOCAL_REPORT_PREVIEW;
    await assert.rejects(loadLocalPersonaReport(submission), /not found/);
    process.env.PERSONA_LOCAL_REPORT_PREVIEW = "1";
    process.env.__NEXT_PRIVATE_ORIGIN = "http://localhost:3134";
    await assert.rejects(loadLocalPersonaReport(submission), /not found/);
    process.env.__NEXT_PRIVATE_ORIGIN = "http://" + host;
    for (const patch of [
      { host: "example.invalid" }, { origin: "http://example.invalid" }, { "x-forwarded-host": "example.invalid" },
      { "x-forwarded-for": "192.0.2.12" }, { "x-forwarded-for": "127.0.0.1, 192.0.2.12" },
      { forwarded: "for=127.0.0.1" }, { "x-forwarded-proto": "https" },
    ]) {
      request = new Headers({ ...baseline, ...patch });
      await assert.rejects(loadLocalPersonaReport(submission), /not found/);
    }
    request = new Headers(baseline);
    request.delete("origin");
    assert.equal(await canOpenLocalReport(), true);
    await assert.rejects(loadLocalPersonaReport(submission), /not found/);
    request = new Headers(baseline);
    const real = load(modulePath("_domain/registry.ts")).buildPersonaReport(submission);
    assert.deepEqual(await loadLocalPersonaReport(submission), real);
    assert.equal(real.sections.length, 5);
    await assert.rejects(loadLocalPersonaReport({ ...submission, paid: true }), /Invalid PERSONA/);
  } finally {
    if (old.nodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = old.nodeEnv;
    if (old.flag === undefined) delete process.env.PERSONA_LOCAL_REPORT_PREVIEW; else process.env.PERSONA_LOCAL_REPORT_PREVIEW = old.flag;
    if (old.origin === undefined) delete process.env.__NEXT_PRIVATE_ORIGIN; else process.env.__NEXT_PRIVATE_ORIGIN = old.origin;
  }
});
