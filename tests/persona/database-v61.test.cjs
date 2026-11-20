/* eslint-disable @typescript-eslint/no-require-imports -- isolated local PostgreSQL/WASM, synthetic data only */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
const {randomBytes}=require("node:crypto"),{PGlite}=require("@electric-sql/pglite");
const root=path.resolve(__dirname,"../.."),snapshot=require("../../app/persona/_domain/release-v61/snapshot.cjs");
const loader=require("../../app/autism-test/test/test-loader.cjs");
const load=loader({"server-only":{},"./snapshot.cjs":{default:snapshot}});
const {createLocalDatabase}=load(path.join(root,"app/_lib/testAccounts/personaV61LocalDatabase.server.ts"));
const manifest=load(path.join(root,"app/persona/_domain/release-v61/manifest.ts"));
const profiles=require("./insights-v2-full-fixtures.cjs"),originalKey=process.env.TEST_ACCOUNTS_ENCRYPTION_KEY;
const initialTime="2026-11-20T10:00:00.000Z";let now=initialTime,pg,db;
const input=(id="F21",extra)=>({questionVersion:manifest.QUESTION_VERSION,reportVersion:manifest.REPORT_VERSION,
 answers:profiles.find(p=>p.id===id).answers.slice(),...(extra?{supplement:{questionVersion:manifest.SUPPLEMENT_QUESTION_VERSION,answers:extra}}:{})});
const extra={S01:"context",S02:"writing",S03:"asked",S04:"preserve"};
const resume={screen:"supplement",questionIndex:null};
const code=expected=>error=>error.code===expected&&error.message==="Local PERSONA data unavailable";
test.before(async()=>{
 process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=randomBytes(32).toString("base64url");
 pg=new PGlite();db=await createLocalDatabase(pg,()=>new Date(now));
});
test.after(async()=>{
 await pg.close();
 if(originalKey===undefined)delete process.env.TEST_ACCOUNTS_ENCRYPTION_KEY;else process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=originalKey;
});
test("all 24 frozen V6.1 results survive real SQL storage without plaintext answers",async()=>{
 const session=await db.newSession();
 for(const p of profiles){
  const saved=await db.create(session.token,input(p.id),{screen:"result",questionIndex:null});
  const loaded=await db.read(session.token,saved.id);
  assert.deepEqual(loaded.envelope,saved.envelope);assert.deepEqual(loaded.result,saved.result);
  assert.equal(loaded.revision,1);
  const row=(await pg.query("SELECT * FROM persona_v61_local_results WHERE id=$1",[saved.id])).rows[0];
  assert.deepEqual(Object.keys(row).sort(),["ciphertext","id","owner_id","product","question_version","report_version","revision","updated_at"]);
  assert(!Object.hasOwn(row,"answers"));assert.match(row.ciphertext,/^v1\.[A-Za-z0-9_-]{16}\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]+$/);assert(!JSON.stringify(row).includes('"answers":'));
 }
});
test("refresh, resumed session, interrupted flow and return to results preserve supplements",async()=>{
 const session=await db.newSession(),saved=await db.create(session.token,input("F21",extra),resume);
 assert.deepEqual((await db.read(session.token,saved.id)).envelope.supplement.answers,extra);
 const refreshed=await db.read(session.token,saved.id);assert.equal(refreshed.envelope.metadata.resume.screen,"supplement");
 const updated=await db.update(session.token,saved.id,1,input("F21",extra),{screen:"result",questionIndex:null});
 assert.equal(updated.revision,2);assert.equal(updated.envelope.metadata.resume.screen,"result");
 assert.deepEqual(updated.envelope.supplement.answers,extra);
 assert.equal(updated.envelope.reopen.reportDigest,saved.envelope.reopen.reportDigest);
});
test("two concurrent updates cannot both replace the same revision",async()=>{
 const session=await db.newSession(),saved=await db.create(session.token,input(),resume);
 const results=await Promise.allSettled([
  db.update(session.token,saved.id,1,input("F21",extra),resume),
  db.update(session.token,saved.id,1,input("F21",{...extra,S04:"start"}),resume),
 ]);
 assert.equal(results.filter(r=>r.status==="fulfilled").length,1);
 const failed=results.find(r=>r.status==="rejected");assert.equal(failed.reason.code,"conflict");
 const final=await db.read(session.token,saved.id),winner=results.find(r=>r.status==="fulfilled").value;
 assert.equal(final.revision,2);assert.deepEqual(final.envelope,winner.envelope);
 await assert.rejects(db.update(session.token,saved.id,1,input(),resume),code("conflict"));
});
test("a valid result ID alone never authorizes a read or update",async()=>{
 const a=await db.newSession(),saved=await db.create(a.token,input(),resume);
 for(const token of [undefined,null,"",saved.id,"A".repeat(43)]){
  await assert.rejects(db.read(token,saved.id),code("unauthorized"));
  await assert.rejects(db.update(token,saved.id,1,input(),resume),code("unauthorized"));
 }
});
test("a second authorized user cannot read or overwrite another user's result",async()=>{
 const a=await db.newSession(),b=await db.newSession(),saved=await db.create(a.token,input(),resume);
 await assert.rejects(db.read(b.token,saved.id),code("not_found"));
 await assert.rejects(db.update(b.token,saved.id,1,input("F24"),resume),code("not_found"));
 assert.equal((await db.read(a.token,saved.id)).revision,1);
});
test("revoked and expired sessions stay denied even with a known result reference",async()=>{
 const a=await db.newSession(),saved=await db.create(a.token,input(),resume);
 await db.endSession(a.token);await assert.rejects(db.read(a.token,saved.id),code("unauthorized"));
 const b=await db.newSession(),second=await db.create(b.token,input(),resume);
 try{now="2026-11-20T11:00:00.001Z";await assert.rejects(db.read(b.token,second.id),code("unauthorized"));}
 finally{now=initialTime;}
});
test("database stores only session hashes, never usable session secrets",async()=>{
 const a=await db.newSession();
 const rows=(await pg.query("SELECT * FROM persona_v61_local_sessions")).rows;
 assert(rows.every(row=>row.token_hash.length===64&&row.token_hash!==a.token));
 assert(!JSON.stringify(rows).includes(a.token));assert(rows.every(row=>!Object.hasOwn(row,"token")));
});
test("version conflicts and malformed packets preserve the previous ciphertext and revision",async()=>{
 const a=await db.newSession(),saved=await db.create(a.token,input(),resume);
 const original=(await pg.query("SELECT ciphertext FROM persona_v61_local_results WHERE id=$1",[saved.id])).rows[0].ciphertext;
 for(const bad of [{...input(),reportVersion:"persona-report-v5"},{...input(),answers:[3]},
  {...input(),paid:true},{...input(),questionVersion:"other"}]){
  await assert.rejects(db.update(a.token,saved.id,1,bad,resume),code("invalid_data"));
 }
 const row=(await pg.query("SELECT ciphertext,revision FROM persona_v61_local_results WHERE id=$1",[saved.id])).rows[0];
 assert.equal(row.ciphertext,original);assert.equal(row.revision,1);
});
test("SQL constraints reject foreign versions and tampered ciphertext fails authenticated reopening",async()=>{
 const a=await db.newSession(),saved=await db.create(a.token,input(),resume);
 await assert.rejects(pg.query("UPDATE persona_v61_local_results SET report_version=$1 WHERE id=$2",["persona-report-v5",saved.id]));
 await pg.query("UPDATE persona_v61_local_results SET ciphertext=$1 WHERE id=$2",["invalid",saved.id]);
 await assert.rejects(db.read(a.token,saved.id),code("invalid_data"));
 await assert.rejects(db.update(a.token,saved.id,1,input(),resume),code("invalid_data"));
});
test("missing records and malformed identifiers are handled without SQL injection",async()=>{
 const a=await db.newSession();
 for(const id of ["44444444-4444-4444-8444-444444444444","';DROP TABLE persona_v61_local_results;--",null])
  await assert.rejects(db.read(a.token,id),code("not_found"));
 assert((await pg.query("SELECT count(*) FROM persona_v61_local_results")).rows.length);
});
test("V5 remains available through the original registry and cannot enter this database",async()=>{
 const v5=load(path.join(root,"app/persona/_domain/v5/manifest.ts")).VERSIONS;
 const registry=load(path.join(root,"app/persona/_domain/registry.ts"));
 const old={answers:profiles[0].answers,questionVersion:v5.question,reportVersion:v5.report};
 const before=registry.buildPersonaReport(old),a=await db.newSession();
 await assert.rejects(db.create(a.token,old,resume),code("invalid_data"));
 assert.deepEqual(registry.buildPersonaReport(old),before);
});
test("local runtime refuses missing configuration, wrong key or provider environments before DB creation",async()=>{
 const names=["NODE_ENV","PERSONA_V61_LOCAL_DB","TEST_ACCOUNTS_ENCRYPTION_KEY","PERSONA_V61_LOCAL_KEY_ID","DATABASE_URL"];
 const previous=Object.fromEntries(names.map(n=>[n,process.env[n]]));
 const runtime=load(path.join(root,"app/persona/dev-storage-v61/runtime.server.ts")).localRuntime;
 try{
  process.env.NODE_ENV="production";await assert.rejects(runtime(),/disabled/);
  process.env.NODE_ENV="development";delete process.env.PERSONA_V61_LOCAL_DB;await assert.rejects(runtime(),/disabled/);
  process.env.PERSONA_V61_LOCAL_DB="pglite-memory";delete process.env.PERSONA_V61_LOCAL_KEY_ID;
  await assert.rejects(runtime(),/Separate local test key/);
  process.env.PERSONA_V61_LOCAL_KEY_ID=require("node:crypto").createHash("sha256").update(process.env.TEST_ACCOUNTS_ENCRYPTION_KEY).digest("hex");
  process.env.DATABASE_URL="postgres://blocked.example.invalid/never-connect";
  await assert.rejects(runtime(),/Isolated environment/);
 }finally{for(const [name,value] of Object.entries(previous))if(value===undefined)delete process.env[name];else process.env[name]=value;}
});

test("server restores the authorized user's result reference without browser storage",async()=>{
 const a=await db.newSession(),b=await db.newSession();
 assert.equal((await db.session(a.token)).lastResultId,null);
 const saved=await db.create(a.token,input("F24",extra),resume);
 assert.equal((await db.session(a.token)).lastResultId,saved.id);
 assert.equal((await db.session(b.token)).lastResultId,null);
 assert.deepEqual((await db.read(a.token,(await db.session(a.token)).lastResultId)).envelope.supplement.answers,extra);
});