/* eslint-disable @typescript-eslint/no-require-imports -- executable product-model regression harness. */
const assert = require('node:assert/strict');
const path = require('node:path');
const load = require('../../autism-test/test/test-loader.cjs')();
const m = load(path.join(__dirname, 'model.ts'));
const answersFor = totals => m.questions.map(question => {
  const total = totals[question.dimension];
  const group = m.questions.filter(item => item.dimension === question.dimension);
  const position = group.findIndex(item => item.id === question.id);
  const base = Math.floor(total / group.length); const remainder = total % group.length;
  return base + (position < remainder ? 1 : 0);
});
const context = Array(6).fill(2);
assert.equal(m.questions.length, 48);
assert.equal(new Set(m.questions.map(q => q.id)).size, 48);
assert.deepEqual(m.questions.map(q => q.dimension).sort(), ["A","A","A","A","A","A","A","A","B","B","B","B","B","B","C","C","C","C","C","C","C","D","D","D","D","D","D","D","E","E","E","E","E","F","F","F","F","F","G","G","G","G","G","H","H","H","H","H"]);
const full = m.calculateReport(Array(48).fill(4), context);
for (const key of m.dimensions) assert.equal(full.scores[key], 100);
assert.equal(full.indices.adhdIndex, 100); assert.equal(full.indices.autismIndex, 100);
const onlyMasking = m.calculateReport(answersFor({A:0,B:0,C:0,D:0,E:0,F:20,G:0,H:0}), context);
assert.equal(onlyMasking.indices.autismIndex, 0); assert.equal(onlyMasking.indices.adhdIndex, 0);
const onlyFriction = m.calculateReport(answersFor({A:0,B:0,C:0,D:0,E:0,F:0,G:20,H:0}), context);
assert.equal(onlyFriction.indices.autismIndex, 0); assert.equal(onlyFriction.indices.adhdIndex, 0);
const indices = m.calculatePrimaryIndices({A:60,B:40,C:70,D:60,E:40,F:100,G:100,H:100});
assert.equal(indices.adhdIndex, 52); assert.equal(indices.autismIndex, 59);
assert.equal(indices.maskingIndex, 100); assert.equal(indices.frictionIndex, 100);
const sameCoreDifferentContext = answersFor({A:16,B:8,C:12,D:14,E:4,F:0,G:0,H:0});
assert.equal(m.calculateReport(sameCoreDifferentContext, [0,0,0,0,0,3]).indices.adhdIndex, m.calculateReport(sameCoreDifferentContext, [4,4,4,4,4,0]).indices.adhdIndex);
assert.equal(m.determineMainProfile(49, 20, full.scores), "Gränsnära/ojämn profil");
assert.equal(m.determineMainProfile(55, 55, full.scores), "Gränsnära/ojämn profil");
assert(!m.findDimensionOutliers({A:35,B:20,C:20,D:20,E:20,F:20,G:20,H:20}).some(item => item.kind === "stark topp"));
assert.equal(m.generateTeaser({A:0,B:0,C:0,D:0,E:0,F:0,G:60,H:0}, {adhdIndex:0,autismIndex:0,maskingIndex:0,frictionIndex:60,functionalIndex:0}, [], context).type, "friction");
assert.equal(m.parseState(JSON.stringify({reportVersion:"audhd-v1",answers:Array(48).fill(2),contextAnswers:Array(6).fill(2),questionIndex:99,contextIndex:99,unlocked:true})).questionIndex, 47);
for (const invalid of [Array(47).fill(0), Array(48).fill(-1), Array(48).fill(5)]) assert.throws(() => m.calculateDimensions(invalid));
console.log('PASS: AuDHD questions, weights, index isolation, context isolation, boundaries, outliers, teaser and persistence validation.');

const norwegianQuestions = load(path.join(__dirname, "questions.nb.ts"));
assert.deepEqual(norwegianQuestions.questionsNb.map(({ id, dimension }) => [id, dimension]), m.questions.map(({ id, dimension }) => [id, dimension]));
assert(norwegianQuestions.questionsNb.every(question => question.text.startsWith("Hvor ofte")));
assert.deepEqual(norwegianQuestions.contextQuestionsNb.map(({ options }) => options.length), m.contextQuestions.map(({ options }) => options.length));
for (let scenario = 0; scenario < 20; scenario++) {
  const answers = m.questions.map(({ dimension }, index) => (scenario + index * (scenario % 4) + dimension.charCodeAt(0)) % 5);
  const context = [scenario % 5, 2, 3, 1, 3, scenario % 4];
  const sv = m.calculateReport(answers, context);
  const nb = m.calculateReport(answers, context, "no");
  assert.deepEqual(nb.scores, sv.scores);
  assert.deepEqual(nb.indices, sv.indices);
  assert.equal(nb.impact.combined, sv.impact.combined);
  assert.equal(nb.teaser.type, sv.teaser.type);
  assert.notEqual(nb.profileType, sv.profileType);
}

const highAnswers = Array(48).fill(4);
const highWithLowImpact = m.questions.map(question => question.dimension === "H" ? 0 : 4);
for (const [market, known, uncertain, recent, combinedProfile, boundary, limited, substantial, discrepancy, handlingEnergy, followup] of [
  ["sv", "Profilen är konsekvent", "Uppgifter om utvecklingsmönstret är osäkra", "Profilen är svår att tolka", "Mycket framträdande kombinationsmönster", "Gränsnära/ojämn profil", "Begränsad påverkan", "Stor påverkan", /Huvudfrågorna.*I följdfrågorna/, /energin det tar att hantera svårigheterna/, /följdfrågorna/i],
  ["no", "Et gjennomgående mønster", "Opplysninger om utviklingsmønsteret er usikre", "Et mønster som er vanskelig å tolke", "Svært fremtredende kombinasjon av trekk", "Sammensatt profil nær en grense", "Begrenset påvirkning", "Stor påvirkning", /Hovedspørsmålene.*I oppfølgingsspørsmålene/, /energien det krever å håndtere vanskene/, /oppfølgingsspørsmålene/i],
]) {
  const knownContext = [3, 3, 4, 4, 4, 0];
  assert.equal(m.calculateReport(highAnswers, knownContext, market).development.title, known);
  assert.equal(m.calculateReport(highAnswers, [0, 3, 4, 4, 4, 2], market).development.title, recent);
  for (const contextAnswers of [[4,3,4,4,4,0], [3,4,4,4,4,0], [4,4,4,4,4,0], [0,3,4,4,4,3]]) {
    const stored = m.parseState(JSON.stringify({
      reportVersion: "audhd-v1", answers: highAnswers, contextAnswers,
      questionIndex: 47, contextIndex: 5, unlocked: true, report: { development: { title: known } },
    }));
    assert.deepEqual(stored.contextAnswers, contextAnswers);
    assert.equal(stored.unlocked, true);
    const restored = m.calculateReport(stored.answers, stored.contextAnswers, market);
    assert.equal(restored.development.title, uncertain);
    assert.deepEqual(restored.indices, full.indices);
    assert.equal(restored.profileType, combinedProfile);
  }
  assert.equal(m.determineMainProfile(75, 75, full.scores, market), combinedProfile);
  assert.equal(m.determineMainProfile(90, 89, full.scores, market), combinedProfile);
  assert.equal(m.determineMainProfile(75, 74, full.scores, market), boundary);

  const impactDiffers = m.calculateReport(highWithLowImpact, knownContext, market);
  assert.equal(impactDiffers.impact.combined, 75);
  assert.equal(impactDiffers.impact.title, substantial);
  assert(impactDiffers.contradicting.some(text => discrepancy.test(text)));
  assert(!impactDiffers.contradicting.some(text => /sammantaget begränsad|samlet sett begrenset|vardagspåverkan är låg|påvirker hverdagen i liten grad/.test(text)));
  const impactLow = m.calculateReport(highWithLowImpact, [3,3,0,0,0,0], market);
  assert.equal(impactLow.impact.title, limited);
  assert(impactLow.contradicting.some(text => /sammantaget begränsad|samlet sett begrenset/.test(text)));

  const energyOnly = m.calculateReport(highAnswers, [3,3,0,0,4,0], market);
  assert.equal(energyOnly.impact.combined, 50);
  assert.match(energyOnly.impact.text, handlingEnergy);
  assert(energyOnly.keyFindings.some(text => handlingEnergy.test(text)));
  const lowFollowup = m.calculateReport(highAnswers, [3,3,1,1,0,0], market);
  assert.equal(lowFollowup.impact.combined, 37.5);
  assert.equal(lowFollowup.impact.largest, null);
  assert.doesNotMatch(lowFollowup.impact.text, followup);
}
