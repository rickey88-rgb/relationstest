/* eslint-disable @typescript-eslint/no-require-imports -- Executable Node CommonJS test harness. */
// Run: node app/autism-test/test/model.test.cjs
const assert = require('node:assert/strict');
const path = require('node:path');
const load = require('./test-loader.cjs')();
const m = load(path.join(__dirname, 'model.ts'));
const i = load(path.join(__dirname, 'interpretation.ts'));
const values = totals => totals.flatMap(total => Array.from({ length: 5 }, (_, index) => Math.max(0, Math.min(4, total - index * 4))));
const score = totals => m.calculate(values(totals));
assert.equal(m.questions.length, 30);
assert.deepEqual(m.questions.map(q => q.id), Array.from({ length: 30 }, (_, i) => i + 1));
assert.equal(new Set(m.questions.map(q => q.text)).size, 30);
assert.equal(score([0,0,0,0,0,0]).symptomIndex, 0);
assert.equal(score([20,20,20,20,20,20]).symptomIndex, 100);
for (const [value, prefix] of [[0,'Svagt'],[24,'Svagt'],[25,'Vissa'],[44,'Vissa'],[45,'Måttligt'],[64,'Måttligt'],[65,'Tydligt'],[79,'Tydligt'],[80,'Mycket tydligt'],[100,'Mycket tydligt']]) assert(m.overallLevel(value).startsWith(prefix));
for (const [totals, profile] of [
  [[15,15,0,0,0,0], 'Social-kommunikativ profil'],
  [[0,0,15,15,0,0], 'Förutsägbarhets-/sensorisk profil'],
  [[13,0,0,0,20,0], 'Fokuserad/intensiv profil'],
  [[15,15,15,15,15,0], 'Bred kombinerad profil'],
  [[0,0,0,0,0,20], 'Svagt eller ospecifikt mönster'],
  [[0,0,0,0,20,0], 'Svagt eller ospecifikt mönster'],
  [[20,20,20,0,20,0], 'Bred kombinerad profil'],
  [[16,16,13,0,0,0], 'Social-kommunikativ profil'],
  [[16,16,14,0,0,0], 'Bred kombinerad profil'],
]) assert.equal(score(totals).profileType, profile, totals.join(','));
for (const [symptom, impact, modifier] of [[13,7,'limited'],[13,8,'standard'],[13,11,'standard'],[13,12,'marked'],[12,7,'standard'],[8,12,'impactWithoutPattern'],[9,12,'standard'],[0,20,'impactWithoutPattern']]) {
  const r=score([symptom,symptom,symptom,symptom,symptom,impact]);
  assert.equal(r.impactModifier,modifier);
}
assert.equal(score([20,17,0,0,0,0]).leadingGap,15);
assert.equal(score([14,11,0,0,0,0]).leadingGap,15);
for(let raw=0;raw<=20;raw++) {
  const normalized=score([raw,raw,raw,raw,raw,raw]);
  for(const area of m.areas) assert.equal(normalized.scores[area],raw*5);
}
assert.equal(score([20,18,0,0,0,0]).leadingGap,10);
assert.equal(score([20,20,0,0,0,0]).leadingGap,0);
assert(i.standoutText(score([20,17,0,0,0,0])).includes('tydligt över'));
assert(i.standoutText(score([20,18,0,0,0,0])).includes('Två områden är ungefär lika'));
assert(i.standoutText(score([20,20,0,0,0,0])).includes('Två områden ligger lika'));
assert(i.standoutText(score([20,20,20,0,0,0])).includes('Flera områden ligger lika'));
assert(i.standoutText(score([0,0,0,0,0,0])).includes('ingen förhöjd kombination'));
assert(i.impactText(score([0,0,0,0,0,20])).text.includes('Andra förklaringar'));
assert.equal(score([0,0,0,0,0,0]).supporting.length,0);
const noHistory=Array(30).fill(4); noHistory[28]=0;
assert(m.calculate(noHistory).lessClear.some(text=>text.includes('tidigare delar')));
assert(!m.calculate(noHistory).supporting.some(text=>text.includes('stor del av livet')));
for(const invalid of [Array(29).fill(0),Array(30).fill(-1),Array(30).fill(5),Array(30).fill(NaN),Array(30).fill(0.5),Array(30)]) assert.throws(()=>m.calculate(invalid));
for(const invalid of ['{broken',null,JSON.stringify({version:2,answers:Array(30).fill(2)}),JSON.stringify({version:1,answers:Array(30).fill('2')})]) assert.equal(m.parseState(invalid),null);
assert.deepEqual(m.parseState(JSON.stringify({version:1,answers:Array(30).fill(2),index:999,unlocked:true})),{version:1,answers:Array(30).fill(2),index:29,unlocked:true});
for(let n=0;n<15625;n++) {
  let v=n; const totals=Array.from({length:6},()=>{const t=(v%5)*5;v=Math.floor(v/5);return t;});
  const r=score(totals);
  assert.equal(r.symptomIndex,totals.slice(0,5).reduce((a,b)=>a+b,0));
  m.areas.forEach((area,index)=>assert.equal(r.scores[area],totals[index]*5));
  assert.equal(r.profileType,score([...totals.slice(0,5),0]).profileType);
}
console.log('PASS: 30 questions; normalization; all levels/profiles and priority; impact boundaries; ties; validation; 15,625 combinations.');
