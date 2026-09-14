/* Run from the repository root: node app/adhd-test/test/model.test.cjs */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
function load(file) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('require', 'module', 'exports', code)(name => load(path.resolve(path.dirname(file), name + '.ts')), module, module.exports);
  return module.exports;
}
const m = load(path.join(__dirname, 'model.ts'));
const values = totals => totals.flatMap(total => Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(4, total - i * 4))));
const score = totals => m.calculate(values(totals));
assert.equal(m.questions.length, 30);
assert.deepEqual(m.questions.map(q => q.id), Array.from({ length: 30 }, (_, i) => i + 1));
for (const [totals, profile] of [
  [[15,15,0,0,15,15], 'Ouppmärksam profil'],
  [[5,20,0,0,20,15], 'Exekutiv profil'],
  [[0,0,20,20,0,15], 'Rastlös/impulsiv profil'],
  [[15,15,15,15,15,15], 'Kombinerad profil'],
  [[0,0,0,0,0,0], 'Svagt/ospecifikt mönster'],
]) assert.equal(score(totals).profileType, profile);
for (const [value, prefix] of [[0,'Svagt'],[24,'Svagt'],[25,'Vissa'],[44,'Vissa'],[45,'Måttligt'],[64,'Måttligt'],[65,'Tydligt'],[79,'Tydligt'],[80,'Mycket tydligt'],[100,'Mycket tydligt']]) assert(m.overallLevel(value).startsWith(prefix));
assert.equal(score([20,20,20,20,20,0]).symptomIndex, 100);
assert.equal(score([20,20,20,20,20,0]).impactModifier, 'limited');
assert.equal(score([20,20,20,20,20,13]).impactModifier, 'marked');
assert.equal(score([20,20,20,20,20,5]).impactModifier, 'standard');
assert.equal(score([10,10,10,10,10,20]).symptomIndex, 50);
assert.equal(score([10,10,10,10,10,20]).impactModifier, 'standard');
assert.equal(score([20,17,0,0,0,20]).leadingGap, 15);
assert.equal(score([20,18,0,0,0,20]).leadingGap, 10);
assert.equal(score([20,20,0,0,0,20]).leadingGap, 0);
assert.equal(score([0,0,0,0,0,0]).supporting.length, 0);
assert.equal(score([20,20,20,20,20,20]).lessClear.length, 0);
const earlier = Array(30).fill(0); earlier[29] = 3;
assert(m.calculate(earlier).supporting.some(p => p.includes('tidigare delar')));
assert(!m.calculate(earlier).supporting.some(p => p.includes('flera delar av vardagen')));
assert.throws(() => m.calculate(Array(29).fill(0)));
assert.throws(() => m.calculate(Array(30).fill(-1)));
assert.throws(() => m.calculate(Array(30).fill(5)));
assert.equal(m.parseState('{broken'), null);
assert.equal(m.parseState(JSON.stringify({ version: 99, answers: Array(30).fill(2) })), null);
assert.deepEqual(m.parseState(JSON.stringify({ version: 1, answers: Array(30).fill(2), index: 999, unlocked: true })), { version:1, answers:Array(30).fill(2), index:29, unlocked:true });
// Exhaustive constant-answer combinations per area, checking normalization and index independence.
for (let n=0; n<15625; n++) {
  let v=n; const totals=Array.from({length:6},()=>{const t=(v%5)*5;v=Math.floor(v/5);return t});
  const r=score(totals);
  assert.equal(r.symptomIndex, totals.slice(0,5).reduce((a,b)=>a+b,0));
  m.areas.forEach((area,i)=>assert.equal(r.scores[area], totals[i]*5));
  assert(r.supporting.length<=4 && r.lessClear.length<=4);
}
console.log('PASS: 30 questions; all 5 profiles; level/gap/impact boundaries; honest evidence lists; storage validation; 15,625 score combinations.');
