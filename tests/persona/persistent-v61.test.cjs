/* eslint-disable @typescript-eslint/no-require-imports -- real local SQL/RLS, no cloud connections */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {randomBytes}=require("node:crypto"),{execFileSync}=require("node:child_process");
const f=require("./persistent-v61-fixture.cjs"),profiles=require("./insights-v2-full-fixtures.cjs");
let r;const oldKey=process.env.TEST_ACCOUNTS_ENCRYPTION_KEY,key=randomBytes(32).toString("base64url");
const extra={S01:"context",S02:"writing",S03:"asked",S04:"preserve"},resume={screen:"result",questionIndex:null};
const code=value=>e=>e.code===value&&e.message==="PERSONA persistent data unavailable";
test.before(async()=>{process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=key;r=await f.openLocal();});
test.after(async()=>{await r.close();if(oldKey===undefined)delete process.env.TEST_ACCOUNTS_ENCRYPTION_KEY;else process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=oldKey;});
test("all 24 profiles persist and reopen through restricted PostgreSQL transactions",async()=>{
 for(const p of profiles){
  const saved=await r.adapter.create(f.tokenA,f.input(p.id),resume),read=await r.adapter.read(f.tokenA,saved.id);
  assert.deepEqual(read.envelope,saved.envelope);assert.deepEqual(read.result,saved.result);
  const row=(await r.pg.query("SELECT * FROM persona_v61_test.results WHERE id=$1",[saved.id])).rows[0];
  assert(!Object.hasOwn(row,"answers"));assert.match(row.ciphertext,/^v1\.[A-Za-z0-9_-]{16}\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]+$/);assert(!JSON.stringify(row).includes('"answers":'));assert(row.ciphertext.length<=8192);
 }
});
test("supplementary answers and report checksum survive save, update and reopening",async()=>{
 const a=await r.adapter.create(f.tokenA,f.input("F21",extra),{screen:"supplement",questionIndex:null});
 const b=await r.adapter.update(f.tokenA,a.id,1,f.input("F21",extra),resume);
 assert.equal(b.revision,2);assert.deepEqual(b.envelope.supplement.answers,extra);
 assert.equal(b.envelope.reopen.reportDigest,a.envelope.reopen.reportDigest);
 assert.equal((await r.adapter.read(f.tokenA,a.id)).envelope.metadata.resume.screen,"result");
});
test("wrong owner and missing session cannot read or update a known ID",async()=>{
 const a=await r.adapter.create(f.tokenA,f.input(),resume);
 await assert.rejects(r.adapter.read(f.tokenB,a.id),code("not_found"));
 await assert.rejects(r.adapter.update(f.tokenB,a.id,1,f.input("F24"),resume),code("not_found"));
 for(const authorization of [null,"",a.id,"Bearer invalid"]){
  await assert.rejects(r.adapter.read(authorization,a.id),code("unauthorized"));
  await assert.rejects(r.adapter.create(authorization,f.input(),resume),code("unauthorized"));
 }
 assert.equal((await r.adapter.read(f.tokenA,a.id)).revision,1);
});
test("authentication is revalidated on every operation after a lost session",async()=>{
 const a=await r.adapter.create(f.tokenA,f.input(),resume),before=r.authCalls();
 r.setValid(false);
 try{await assert.rejects(r.adapter.read(f.tokenA,a.id),code("unauthorized"));
  await assert.rejects(r.adapter.update(f.tokenA,a.id,1,f.input(),resume),code("unauthorized"));}
 finally{r.setValid(true);}
 assert.equal(r.authCalls(),before+2);
});
test("simultaneous calls and stale revisions never overwrite newer answers",async()=>{
 const a=await r.adapter.create(f.tokenA,f.input(),resume);
 const results=await Promise.allSettled([
  r.adapter.update(f.tokenA,a.id,1,f.input("F21",extra),resume),
  r.adapter.update(f.tokenA,a.id,1,f.input("F21",{...extra,S04:"start"}),resume),
 ]);
 assert.equal(results.filter(x=>x.status==="fulfilled").length,1);
 assert.equal(results.find(x=>x.status==="rejected").reason.code,"conflict");
 const actual=await r.adapter.read(f.tokenA,a.id),winner=results.find(x=>x.status==="fulfilled").value;
 assert.equal(actual.revision,2);assert.deepEqual(actual.envelope,winner.envelope);
 await assert.rejects(r.adapter.update(f.tokenA,a.id,1,f.input(),resume),code("conflict"));
});
test("versions, unknown fields and malformed packets leave the prior row intact",async()=>{
 const a=await r.adapter.create(f.tokenA,f.input(),resume);
 for(const bad of [{...f.input(),reportVersion:"persona-report-v5"},{...f.input(),questionVersion:"other"},
  {...f.input(),answers:[3]},{...f.input(),owner_id:f.B},{...f.input(),paid:true}]){
  await assert.rejects(r.adapter.update(f.tokenA,a.id,1,bad,resume),code("invalid_data"));
 }
 assert.equal((await r.adapter.read(f.tokenA,a.id)).revision,1);
});
test("tampered ciphertext and changed row ownership fail authenticated reopening",async()=>{
 const a=await r.adapter.create(f.tokenA,f.input(),resume);
 await r.pg.query("UPDATE persona_v61_test.results SET owner_id=$1 WHERE id=$2",[f.B,a.id]);
 await assert.rejects(r.adapter.read(f.tokenB,a.id),code("invalid_data")); // owner is part of AES-GCM AAD
 await r.pg.query("UPDATE persona_v61_test.results SET ciphertext=$1 WHERE id=$2",["invalid",a.id]);
 await assert.rejects(r.adapter.update(f.tokenB,a.id,1,f.input(),resume),code("invalid_data"));
});
test("RLS independently hides foreign rows and rejects cross-owner inserts",async()=>{
 const a=await r.adapter.create(f.tokenA,f.input(),resume);
 const foreign=await r.transactions.withOwner(f.B,sql=>sql.query("SELECT id FROM persona_v61_test.results WHERE id=$1",[a.id]));
 assert.equal(foreign.rows.length,0);
 await assert.rejects(r.transactions.withOwner(f.B,sql=>sql.query(
  "UPDATE persona_v61_test.results SET owner_id=$1 WHERE owner_id=$2",[f.A,f.B])));
 const noContext=await r.pg.transaction(async tx=>{
  await tx.exec("SET LOCAL ROLE persona_v61_backend");
  return tx.query("SELECT id FROM persona_v61_test.results");
 });
 assert.equal(noContext.rows.length,0);
});
test("anon, authenticated and service_role cannot reach private results, even with a forged owner setting",async()=>{
 for(const role of ["anon","authenticated","service_role"]){
  const client=await f.openLocal();
  await client.pg.exec("SET SESSION AUTHORIZATION "+role);
  try{
   await assert.rejects(client.pg.query("SELECT * FROM persona_v61_test.results"));
   await assert.rejects(client.pg.exec("SET ROLE persona_v61_backend"));
  }finally{await client.close();}
 }
 // Even accidental table/schema grants still get no applicable client RLS policy.
 await r.pg.exec("GRANT USAGE ON SCHEMA persona_v61_test TO authenticated;GRANT SELECT ON persona_v61_test.results TO authenticated;");
 const denied=await r.pg.transaction(async tx=>{
  await tx.exec("SET LOCAL ROLE authenticated");
  await tx.query("SELECT set_config('persona_v61_test.owner_id',$1,true)",[f.A]);
  return tx.query("SELECT * FROM persona_v61_test.results");
 });
 assert.equal(denied.rows.length,0);
 await r.pg.exec("REVOKE USAGE ON SCHEMA persona_v61_test FROM authenticated;REVOKE SELECT ON persona_v61_test.results FROM authenticated;");
});
test("transaction owner context never leaks into the next pooled operation",async()=>{
 await r.transactions.withOwner(f.A,sql=>sql.query("SELECT id FROM persona_v61_test.results"));
 const after=await r.pg.query("SELECT nullif(current_setting('persona_v61_test.owner_id',true),'') AS owner");
 assert.equal(after.rows[0].owner,null);
 const role=await r.pg.query("SELECT current_user AS name");assert.notEqual(role.rows[0].name,"persona_v61_backend");
});
test("missing rows and SQL injection-shaped IDs return a neutral not-found error",async()=>{
 for(const id of ["44444444-4444-4444-8444-444444444444","';DROP SCHEMA persona_v61_test CASCADE;--",null])
  await assert.rejects(r.adapter.read(f.tokenA,id),code("not_found"));
});
test("V5 registry remains unchanged while persistent V6.1 refuses V5 input",async()=>{
 const v5=f.load(path.join(f.root,"app/persona/_domain/v5/manifest.ts")).VERSIONS;
 const registry=f.load(path.join(f.root,"app/persona/_domain/registry.ts"));
 const old={questionVersion:v5.question,reportVersion:v5.report,answers:profiles[0].answers};
 const original=registry.buildPersonaReport(old);
 await assert.rejects(r.adapter.create(f.tokenA,old,resume),code("invalid_data"));
 assert.deepEqual(registry.buildPersonaReport(old),original);
});
test("disk-backed PostgreSQL survives closure and a fresh server process",async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),"persona-v61-persistent-"));
 const local=await f.openLocal(directory);
 const saved=await local.adapter.create(f.tokenA,f.input("F24",extra),resume);
 await local.close();
 const source='const f=require(process.argv[1]);(async()=>{const r=await f.openLocal(process.argv[2],false);try{const value=await r.adapter.read(f.tokenA,process.argv[3]);process.stdout.write(JSON.stringify({digest:value.envelope.reopen.reportDigest,revision:value.revision,state:value.envelope.quality.state}));}finally{await r.close();}})().catch(()=>{process.exitCode=1});';
 const env={TEST_ACCOUNTS_ENCRYPTION_KEY:key};
 for(const name of ["SystemRoot","WINDIR","PATH","TEMP","TMP"])if(process.env[name])env[name]=process.env[name];
 const output=execFileSync(process.execPath,["--require",path.join(f.root,"tests/persona/network-guard.cjs"),"-e",source,
  path.join(f.root,"tests/persona/persistent-v61-fixture.cjs"),directory,saved.id],{env,encoding:"utf8"});
 assert.deepEqual(JSON.parse(output),{digest:saved.envelope.reopen.reportDigest,revision:1,state:"insufficient"});
 // Kept in OS temp for review. No recursive deletion or workspace changes.
});
