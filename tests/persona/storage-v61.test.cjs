/* eslint-disable @typescript-eslint/no-require-imports -- isolated encrypted release persistence */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs"),os=require("node:os");
const {randomBytes}=require("node:crypto"),{execFileSync}=require("node:child_process");
const root=path.resolve(__dirname,"../.."),snapshot=require("../../app/persona/_domain/release-v61/snapshot.cjs");
const createLoader=require("../../app/autism-test/test/test-loader.cjs");
const loader=()=>createLoader({"server-only":{},"./snapshot.cjs":{default:snapshot}});
const load=loader(),storage=load(path.join(root,"app/_lib/testAccounts/personaV61Storage.server.ts"));
const manifest=load(path.join(root,"app/persona/_domain/release-v61/manifest.ts"));
const parser=load(path.join(root,"app/persona/_domain/release-v61/submission.ts"));
const profiles=require("./insights-v2-full-fixtures.cjs");
const current=load(path.join(root,"app/persona/_domain/supplement-v1/index.ts"));
const stamp="2026-11-20T10:00:00.000Z",later="2026-11-20T11:00:00.000Z";
const binding={id:"11111111-1111-4111-8111-111111111111"};
const informative={S01:"context",S02:"one",S03:"asked",S04:"preserve"};
const input=(profile,extra)=>({questionVersion:manifest.QUESTION_VERSION,reportVersion:manifest.REPORT_VERSION,
 answers:profile.answers.slice(),...(extra?{supplement:{questionVersion:manifest.SUPPLEMENT_QUESTION_VERSION,answers:extra}}:{})});
const clone=value=>JSON.parse(JSON.stringify(value));
const originalKey=process.env.TEST_ACCOUNTS_ENCRYPTION_KEY;
const testKey=randomBytes(32).toString("base64url");
test.before(()=>{process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=testKey;});
test.after(()=>{if(originalKey===undefined)delete process.env.TEST_ACCOUNTS_ENCRYPTION_KEY;else process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=originalKey;});
for(const profile of profiles)test(profile.id+": frozen release and encrypted roundtrip reproduce the same report",()=>{
 const submitted=input(profile),before=JSON.stringify(submitted);
 const envelope=storage.createV61Envelope(submitted,{now:stamp});
 const record=storage.sealV61Envelope(envelope,binding),restored=storage.openV61Record(record,binding);
 assert.equal(JSON.stringify(submitted),before);
 assert.deepEqual(restored.envelope,envelope);
 assert.deepEqual(restored.result,current.completeReport(profile.answers));
 assert.deepEqual(restored.result,snapshot.completeReport(profile.answers));
 assert.equal(restored.envelope.quality.state,restored.result.after.state);
 assert.equal(restored.envelope.supplement,null);
 assert(record.ciphertext.length<8192);assert(Object.isFrozen(restored.envelope));
 assert(!Object.hasOwn(record,"answers")&&!Object.hasOwn(record,"quality"));
});
test("supplementary answers, quality and all resume states survive fresh repository instances",async()=>{
 const profile=profiles.find(p=>p.id==="F21"),submitted=input(profile,informative);
 const records=new Map(),driver={read:async id=>records.get(id)??null,write:async(id,record)=>{records.set(id,clone(record));}};
 let repository=storage.createV61Repository(driver,binding);
 assert.equal(await repository.load(),null);
 let saved=await repository.save(submitted,{now:stamp,resume:{screen:"supplement",questionIndex:null}});
 assert.equal(saved.envelope.quality.state,"limited");
 for(const resume of [{screen:"questions",questionIndex:21},{screen:"result",questionIndex:null},{screen:"supplement",questionIndex:null}]){
  repository=storage.createV61Repository(driver,binding);
  const refreshed=await repository.load();
  assert.deepEqual(refreshed.envelope.supplement.answers,informative);
  assert.equal(refreshed.envelope.reopen.reportDigest,saved.envelope.reopen.reportDigest);
  saved=await repository.save(submitted,{now:later,resume});
  const back=await storage.createV61Repository(driver,binding).load();
  assert.deepEqual(back.envelope.metadata.resume,resume);
  assert.equal(back.envelope.metadata.createdAt,stamp);assert.equal(back.envelope.metadata.updatedAt,later);
 }
});
test("new process can reopen a disk-persisted ciphertext without printing answers or keys",()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"persona-storage-v61-")),file=path.join(dir,"record.json");
 try{
  const envelope=storage.createV61Envelope(input(profiles.find(p=>p.id==="F24"),informative),{now:stamp});
  fs.writeFileSync(file,JSON.stringify(storage.sealV61Envelope(envelope,binding)));
  assert(!fs.readFileSync(file,"utf8").includes('"S03":'));
  const source='const path=require("node:path"),fs=require("node:fs");const root=process.argv[1],snapshot=require(path.join(root,"app/persona/_domain/release-v61/snapshot.cjs"));const load=require(path.join(root,"app/autism-test/test/test-loader.cjs"))({"server-only":{},"./snapshot.cjs":{default:snapshot}});const api=load(path.join(root,"app/_lib/testAccounts/personaV61Storage.server.ts"));const restored=api.openV61Record(JSON.parse(fs.readFileSync(process.argv[2],"utf8")),'+JSON.stringify(binding)+');process.stdout.write(JSON.stringify({digest:restored.envelope.reopen.reportDigest,state:restored.envelope.quality.state}));';
  const env={TEST_ACCOUNTS_ENCRYPTION_KEY:testKey};
  for(const key of ["SystemRoot","WINDIR","PATH","TEMP","TMP"])if(process.env[key])env[key]=process.env[key];
  const out=execFileSync(process.execPath,["--require",path.join(root,"tests/persona/network-guard.cjs"),"-e",source,root,file],{env,encoding:"utf8"});
  assert.deepEqual(JSON.parse(out),{digest:envelope.reopen.reportDigest,state:"insufficient"});
 }finally{fs.unlinkSync(file);fs.rmdirSync(dir);}
});
test("V5 continues through its old registry and is never accepted as V6.1",()=>{
 const v5=load(path.join(root,"app/persona/_domain/v5/manifest.ts"));
 const registry=load(path.join(root,"app/persona/_domain/registry.ts"));
 const old={answers:profiles[0].answers,questionVersion:v5.VERSIONS.question,reportVersion:v5.VERSIONS.report};
 const original=registry.buildPersonaReport(old);
 assert.throws(()=>storage.createV61Envelope(old,{now:stamp}),/data unavailable/);
 assert.throws(()=>parser.parseSubmission(old));
 assert.throws(()=>registry.resolvePersonaVersion(manifest.QUESTION_VERSION,manifest.REPORT_VERSION));
 assert.deepEqual(registry.buildPersonaReport(old),original);
});
test("strict submission rejects incomplete shapes, holes, invalid ratings and unknown fields",()=>{
 const valid=input(profiles[0]);
 for(const change of [
  value=>{delete value.answers;},value=>{value.answers.pop();},value=>{value.answers.push(3);},
  value=>{value.answers[0]="5";},value=>{value.answers[0]=-1;},value=>{value.answers[0]=6;},
  value=>{value.answers[0]=2.5;},value=>{delete value.answers[0];},value=>{value.ready=true;},
  value=>{value.paid=true;},value=>{value.quality={state:"ready"};},
  value=>{value.reportVersion="persona-report-v5";},value=>{value.questionVersion="other";},
  value=>{value.supplement={questionVersion:"unknown",answers:{}};},
  value=>{value.supplement={questionVersion:manifest.SUPPLEMENT_QUESTION_VERSION,answers:{S05:"one"}};},
  value=>{value.supplement={questionVersion:manifest.SUPPLEMENT_QUESTION_VERSION,answers:{S02:"invalid"}};},
 ]){
  const value=clone(valid);change(value);assert.throws(()=>storage.createV61Envelope(value,{now:stamp}),/data unavailable/);
 }
 assert.throws(()=>storage.createV61Envelope(null,{now:stamp}));
 assert.throws(()=>storage.createV61Envelope([],{now:stamp}));
});
test("40 incomplete answer slots and partial/declined supplements are valid, not format failures",()=>{
 const incomplete={...input(profiles.find(p=>p.id==="F24")),answers:Array(40).fill(0)};
 const envelope=storage.createV61Envelope(incomplete,{now:stamp,resume:{screen:"questions",questionIndex:0}});
 assert.equal(envelope.quality.state,"insufficient");assert.equal(envelope.quality.counts.validAnswers,0);
 for(const answers of [{},{S01:"skip"},{S01:"fits",S04:"none"}]){
  const value=input(profiles.find(p=>p.id==="F24"),answers);
  const stored=storage.createV61Envelope(value,{now:stamp});
  assert.deepEqual(storage.openV61Record(storage.sealV61Envelope(stored,binding),binding).envelope.supplement.answers,answers);
 }
});
test("stored quality, release identity and report fingerprint cannot be silently substituted",()=>{
 const original=storage.createV61Envelope(input(profiles.find(p=>p.id==="F21"),informative),{now:stamp});
 for(const change of [
  e=>{e.schemaVersion="v2";},e=>{e.product="adhd_test";},e=>{e.reportVersion="persona-report-v5";},
  e=>{e.versions.reportContent="other";},e=>{e.versions.implementation="0".repeat(64);},
  e=>{e.quality.state="ready";},e=>{e.quality.counts.advice=99;},e=>{e.quality.extra=true;},
  e=>{e.reopen.reportDigest="0".repeat(64);},e=>{e.answers[0]=1;},
  e=>{e.supplement.answers.S04="start";},e=>{e.metadata.resume.screen="paid";},
  e=>{e.metadata.resume.questionIndex=42;},e=>{e.metadata.createdAt="not-a-date";},
  e=>{e.metadata.updatedAt="2020-01-01T00:00:00.000Z";},e=>{delete e.quality;},
 ]){
  const value=clone(original);change(value);assert.throws(()=>storage.reopenV61Envelope(value),/data unavailable/);
 }
});
test("cipher authentication binds record, versions, owner and purchase and rejects damage",()=>{
 const envelope=storage.createV61Envelope(input(profiles[0]),{now:stamp});
 const record=storage.sealV61Envelope(envelope,binding);
 const owner={...binding,ownerId:"22222222-2222-4222-8222-222222222222",purchaseId:"33333333-3333-4333-8333-333333333333"};
 assert.throws(()=>storage.openV61Record(record,owner));
 assert.deepEqual(storage.openV61Record(storage.sealV61Envelope(envelope,owner),owner).envelope,envelope);
 for(const change of [
  r=>{r.id=owner.ownerId;},r=>{r.report_version="persona-report-v5";},
  r=>{r.question_version="old";},r=>{r.ciphertext=r.ciphertext.slice(0,-8);},
  r=>{r.ciphertext="X".repeat(8193);},
  r=>{const parts=r.ciphertext.split(".");parts[3]=(parts[3][0]==="A"?"B":"A")+parts[3].slice(1);r.ciphertext=parts.join(".");},
 ]){
  const bad=clone(record);change(bad);assert.throws(()=>storage.openV61Record(bad,binding),/data unavailable/);
 }
});
test("wrong or absent encryption key never falls back to plaintext",async()=>{
 const envelope=storage.createV61Envelope(input(profiles[0]),{now:stamp});
 const record=storage.sealV61Envelope(envelope,binding);
 try{
  process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=randomBytes(32).toString("base64url");
  assert.throws(()=>storage.openV61Record(record,binding));
  delete process.env.TEST_ACCOUNTS_ENCRYPTION_KEY;
  let writes=0;
  const repo=storage.createV61Repository({read:async()=>null,write:async()=>{writes++;}},binding);
  await assert.rejects(repo.save(input(profiles[0]),{now:stamp}),/data unavailable/);
  assert.equal(writes,0);
 }finally{process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=testKey;}
});
test("unreadable existing data and storage errors are explicit and never overwritten",async()=>{
 let writes=0;
 const repo=storage.createV61Repository({read:async()=>({ciphertext:"broken"}),write:async()=>{writes++;}},binding);
 await assert.rejects(repo.load(),/data unavailable/);
 await assert.rejects(repo.save(input(profiles[0]),{now:stamp}),/data unavailable/);
 assert.equal(writes,0);
 const offline=storage.createV61Repository({read:async()=>{throw Error("private details");},write:async()=>{}},binding);
 await assert.rejects(offline.load(),error=>error.message==="PERSONA V6.1 data unavailable");
});
test("frozen implementation matches current authored release sources at creation",()=>{
 const out=execFileSync(process.execPath,[path.join(root,"scripts/build-persona-v61-snapshot.cjs"),"--check"],{cwd:root,encoding:"utf8"});
 assert.equal(JSON.parse(out).fingerprint,snapshot.sourceFingerprint);
 assert.equal(Object.keys(snapshot.sourceHashes).length,23);
});

test("storage never logs answers, keys or decrypted report data",()=>{
 const calls=[],originals={};
 for(const method of ["log","warn","error","info","debug"]){originals[method]=console[method];console[method]=(...args)=>calls.push(args);}
 try{
  const envelope=storage.createV61Envelope(input(profiles.find(p=>p.id==="F21"),informative),{now:stamp});
  const record=storage.sealV61Envelope(envelope,binding);
  storage.openV61Record(record,binding);
  assert.throws(()=>storage.openV61Record({...record,ciphertext:"invalid"},binding));
 }finally{for(const [method,original] of Object.entries(originals))console[method]=original;}
 assert.deepEqual(calls,[]);
});
test("failed durable write is not reported as a restored or saved session",async()=>{
 const repository=storage.createV61Repository({read:async()=>null,write:async()=>{throw Error("disk unavailable");}},binding);
 await assert.rejects(repository.save(input(profiles[0]),{now:stamp}),error=>error.message==="PERSONA V6.1 data unavailable");
});