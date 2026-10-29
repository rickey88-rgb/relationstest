/* eslint-disable @typescript-eslint/no-require-imports -- frozen pre-extraction reports and deterministic synthetic parity cases. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),{createHash}=require('node:crypto');
const React=require('react'),{renderToStaticMarkup:render}=require('react-dom/server');
const load=require('../../autism-test/test/test-loader.cjs')({'next/link':{default:({href,children,...props})=>React.createElement('a',{href,...props},children)}});
const registry=load(path.join(__dirname,'adapter.ts')),Portal=load(path.join(__dirname,'../../mina-sidor/tester/ReportView.tsx')).default,material=require('./stage6-fixtures/material.json');
const cases=[['narcissist-i-en-relation','narcissist_partner'],['traumabindningtest','trauma_bond_test'],['psykisk-misshandel-relation','psychological_abuse_test']];
const normalized=s=>s.replace(/\s+/g,' ').trim();let totalScores=0,totalReports=0,totalSafety=0;
for(const [slug,product]of cases){
 const file=path.join(__dirname,`../../${slug}/test/model.ts`),m=load(file),original=load(path.join(__dirname,`stage6-fixtures/${slug}-model-v1.ts`)),Report=load(path.join(__dirname,`../../${slug}/test/ReportView.tsx`)).default,Original=load(path.join(__dirname,`stage6-fixtures/${slug}-report-v1.tsx`)).default,a=registry.adapter(product),abuse=product==='psychological_abuse_test';
 assert.equal(m.questions.length,30);assert.deepEqual(m.questions,original.questions);assert.equal(a.amount,3900);assert.equal(a.testPath,`/${slug}/test`);
 const modelSource=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');assert.equal(createHash('sha256').update(modelSource.slice(0,modelSource.indexOf('export function calculate')).trim()).digest('hex'),material[slug].prefixHash);
 const calc=ts.createSourceFile('m.ts',modelSource,ts.ScriptTarget.Latest,true).statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculate');
 assert(normalized(calc.body.getText().replace('const totalQuestions = questions.length;','')).includes(normalized(material[slug].calculations)),'original inline calculation expressions changed');
 const input=answers=>({answers,questionVersion:a.questionVersion,reportVersion:a.reportVersion});
 for(const bad of [null,[],input(Array(29).fill(0)),input(Array(31).fill(0)),input(Array(30)),...[-1,5,'2',0.5,null,NaN,Infinity].map(n=>input(Array(30).fill(n))),{...input(Array(30).fill(0)),paid:true},{...input(Array(30).fill(0)),questionVersion:'unknown'},{...input(Array(30).fill(0)),reportVersion:'unknown'}])assert.throws(()=>a.parse(bad));
 const keys=abuse?m.areaOrder:Object.keys(m.areaLabels),max=Object.fromEntries(keys.map(k=>[k,m.questions.filter(q=>q.area===k).length*4]));
 function answersForRaw(raw){const remaining=Object.fromEntries(keys.map((k,i)=>[k,raw[i]]));return m.questions.map(q=>{const n=Math.min(4,remaining[q.area]);remaining[q.area]-=n;return n;});}
 const samples=new Map(),add=answers=>samples.set(JSON.stringify(answers),answers);
 function check(answers){const actual=a.calculate(a.parse(input(answers))),expected=original.calculate(answers);assert.deepEqual(actual,expected);totalScores++;
 const percentages=Object.fromEntries(keys.map(k=>[k,Math.round(m.questions.reduce((sum,q,i)=>sum+(q.area===k?answers[i]:0),0)/max[k]*100)]));
 assert.deepEqual(abuse?actual.areaScores:product==='narcissist_partner'?actual.scores.percentages:actual.scores.areas,percentages);
 const overall=m.weights?Math.round(keys.reduce((s,k)=>s+percentages[k]*m.weights[k],0)/keys.reduce((s,k)=>s+m.weights[k],0)):Math.round(answers.reduce((s,n)=>s+n,0)/120*100);
 assert.equal(abuse?actual.overallScore:actual.scores.overall,overall);
 if(abuse){assert.equal(actual.legalAreasHigh,keys.filter(k=>m.areaInfo[k].legal&&percentages[k]>=50).length);const urgent=['threats','coercion','surveillance'].some(k=>percentages[k]>=75);assert.equal(actual.guidance.heading==='Det finns områden som bör tas särskilt på allvar',urgent);}
 return actual;}
 // Exhaust all low/mid/high area combinations; each area's actual question count determines its maximum.
 for(let code=0;code<3**keys.length;code++){let n=code;const raw=keys.map(k=>{const v=[0,Math.floor(max[k]/2),max[k]][n%3];n=Math.floor(n/3);return v;});const answers=answersForRaw(raw);check(answers);if(code%Math.max(1,Math.floor(3**keys.length/100))===0)add(answers);}
 // Every attainable per-area raw score against empty, midpoint and extreme backgrounds, plus pairwise thresholds.
 for(let i=0;i<keys.length;i++)for(let raw=0;raw<=max[keys[i]];raw++)for(const bg of [0,0.5,1]){const values=keys.map(k=>Math.floor(max[k]*bg));values[i]=raw;const answers=answersForRaw(values);check(answers);add(answers);}
 for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++)for(const left of [0.25,0.5,0.75])for(const right of [0.25,0.5,0.75]){const raw=keys.map(()=>0);raw[i]=Math.round(max[keys[i]]*left);raw[j]=Math.round(max[keys[j]]*right);check(answersForRaw(raw));}
 let seed=137;for(let i=0;i<10000;i++){const answers=Array.from({length:30},()=>{seed=seed*16807%2147483647;return seed%5;});check(answers);if(i<200)add(answers);}
 for(const value of [24.9,25,25.1,29.9,30,30.1,39.9,40,40.1,49.9,50,50.1,54.9,55,55.1,74.9,75,75.1])for(const name of ['level','overallTitle','overallDescription','overallLevel','areaLevel','overallExplanation'])if(m[name])assert.deepEqual(m[name](value),original[name](value));
 if(abuse){for(let high=0;high<=8;high++)for(const p of [0,39,40,49,50,51,100])for(const impact of [0,49,50,51,100]){assert.equal(m.legalOverlapText(high,p,impact),original.legalOverlapText(high,p,impact));totalSafety++;}
 for(const total of [0,29,30,54,55,74,75,100])for(const threat of [0,74,75,76,100])for(const coercion of [0,74,75,76,100])for(const surveillance of [0,74,75,76,100]){assert.deepEqual(m.practicalGuidance(total,threat,coercion,surveillance),original.practicalGuidance(total,threat,coercion,surveillance));totalSafety++;}}
 for(const answers of [Array(30).fill(-1),Array(30),Array.from({length:30},(_,i)=>i%2?-1:4)]){assert.deepEqual(m.calculate(answers),original.calculate(answers));assert.throws(()=>a.parse(input(answers)));}
 for(const answers of samples.values()){
 const actual=check(answers),expected=original.calculate(answers),html=render(React.createElement(Original,{result:expected}));assert.equal(render(React.createElement(Report,{result:actual,onRestart:()=>{}})),html,'legacy premium report changed');
 let controls=0;const serverOriginal=render(React.createElement(Original,{result:expected,footer:true}));const serverExpected=serverOriginal.replace(/<button(?: type="button")? style="([^"]*)">([\s\S]*?)<\/button>/g,(_,style,body)=>{controls++;return `<a href="/${slug}/test" style="${style}">${body}</a>`;});assert.equal(controls,1);assert.equal(render(React.createElement(Portal,{product,result:actual})),serverExpected,'server report text/safety/footer changed');
 }totalReports+=samples.size;
 const source=fs.readFileSync(path.join(__dirname,`../../${slug}/test/page.tsx`),'utf8').replace(/\r\n/g,'\n'),ast=ts.createSourceFile('page.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),functions={},effects=[];
 function visit(n){if(ts.isFunctionDeclaration(n)&&material[slug].functions[n.name?.text])functions[n.name.text]=n.getText(ast);if(ts.isCallExpression(n)&&n.expression.getText(ast)==='useEffect')effects.push(n.getText(ast));ts.forEachChild(n,visit);}visit(ast);
 assert.deepEqual(effects,material[slug].effects);for(const [name,text]of Object.entries(material[slug].functions))assert.equal(normalized(functions[name].replace(' if (accountCheckout()) return;','').replace('    setCheckoutUnavailable(false);\n','')),normalized(text));
 assert.deepEqual(registry.flags(product),{checkout:false,save:false,read:false,legacyImport:false});process.env[`${a.flagPrefix}_SAVE_ENABLED`]='true';for(const other of registry.registeredAdapters())assert.equal(registry.flags(other.product).save,other.product===product);delete process.env[`${a.flagPrefix}_SAVE_ENABLED`];
 console.log(`PASS: ${slug}: ${samples.size} exact original/client/server report cases; strict schema, original guest handlers/effects, weighted scoring, safety content and footer preserved.`);
}
console.log(`PASS: ${totalScores} analysis comparisons; ${totalReports} complete report comparisons; ${totalSafety} explicit safety-boundary comparisons.`);
