/* eslint-disable @typescript-eslint/no-require-imports -- no real SDK/network calls */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path"),{randomBytes,createHash}=require("node:crypto");
const root=path.resolve(__dirname,"../.."),snapshot=require("../../app/persona/_domain/release-v61/snapshot.cjs");
const names=["NODE_ENV","PERSONA_V61_ALLOW_REMOTE_TEST","TEST_ACCOUNTS_ENCRYPTION_KEY"];
const previous=Object.fromEntries(names.map(n=>[n,process.env[n]])),key=randomBytes(32).toString("base64url");
let constructions=0,statements=[],options,user,error,authCalls=0;
const postgresMock=(_url,configuration)=>{
 constructions++;options=configuration;
 return {begin:async operation=>operation({unsafe:async(statement,params=[])=>{statements.push({statement,params});return [];}}),end:async()=>{}};
};
const load=require("../../app/autism-test/test/test-loader.cjs")({
 "server-only":{},"./snapshot.cjs":{default:snapshot},postgres:{default:postgresMock},
 "@supabase/supabase-js":{createClient:()=>{constructions++;return {auth:{getUser:async()=>{authCalls++;return {data:{user},error};}}};}},
});
const api=load(path.join(root,"app/_lib/testAccounts/personaV61SupabaseTest.server.ts"));
const valid=()=>({environment:"isolated-test",approvedProjectRef:"t".repeat(20),productionProjectRefs:["p".repeat(20)],
 databaseUrl:"postgresql://persona_v61_runtime:synthetic-only@db."+"t".repeat(20)+".supabase.co:5432/postgres",
 supabaseUrl:"https://"+"t".repeat(20)+".supabase.co",publishableKey:"synthetic_publishable_test_key_only",
 encryptionKeyFingerprint:createHash("sha256").update(key).digest("hex")});
test.before(()=>{process.env.NODE_ENV="test";process.env.PERSONA_V61_ALLOW_REMOTE_TEST="1";process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=key;});
test.after(()=>{for(const [name,value] of Object.entries(previous))if(value===undefined)delete process.env[name];else process.env[name]=value;});
test.beforeEach(()=>{constructions=0;statements=[];authCalls=0;error=null;user={id:"11111111-1111-4111-8111-111111111111",email_confirmed_at:"2026-11-20",is_anonymous:false};});
test("missing opt-in or incomplete configuration cannot construct any client",()=>{
 delete process.env.PERSONA_V61_ALLOW_REMOTE_TEST;
 assert.throws(()=>api.connectApprovedPersonaTest(valid()),/Separate approved/);
 process.env.PERSONA_V61_ALLOW_REMOTE_TEST="1";
 assert.throws(()=>api.connectApprovedPersonaTest({}),/Separate approved/);assert.equal(constructions,0);
});
test("project, login, TLS URL options and key pins reject dangerous or mixed configurations before connection",()=>{
 for(const change of [
  c=>{c.approvedProjectRef=c.productionProjectRefs[0];},c=>{c.productionProjectRefs=[];},
  c=>{c.databaseUrl=c.databaseUrl.replace("db."+"t".repeat(20),"db."+"p".repeat(20));},
  c=>{c.databaseUrl=c.databaseUrl.replace("persona_v61_runtime","postgres");},
  c=>{c.databaseUrl+="?sslmode=disable";},c=>{c.supabaseUrl="http://"+"t".repeat(20)+".supabase.co";},
  c=>{c.supabaseUrl="https://"+"p".repeat(20)+".supabase.co";},c=>{c.encryptionKeyFingerprint="0".repeat(64);},
 ]){
  const config=valid();change(config);assert.throws(()=>api.connectApprovedPersonaTest(config),/Separate approved/);
 }
 assert.equal(constructions,0);
});
test("production and missing dedicated key are denied even when explicitly opted in",()=>{
 process.env.NODE_ENV="production";assert.throws(()=>api.connectApprovedPersonaTest(valid()),/Separate approved/);
 process.env.NODE_ENV="test";delete process.env.TEST_ACCOUNTS_ENCRYPTION_KEY;
 assert.throws(()=>api.connectApprovedPersonaTest(valid()),/Separate approved/);
 process.env.TEST_ACCOUNTS_ENCRYPTION_KEY=key;assert.equal(constructions,0);
});
test("approved test factory preserves verified TLS and transaction-local, server-derived ownership",async()=>{
 const connection=api.connectApprovedPersonaTest(valid());
 assert.equal(options.ssl.rejectUnauthorized,true);assert.equal(typeof options.ssl.checkServerIdentity,"function");
 await assert.rejects(connection.adapter.read("Bearer "+"A".repeat(50),"44444444-4444-4444-8444-444444444444"),e=>e.code==="not_found");
 assert.equal(authCalls,1);assert.equal(statements[0].statement,"SET LOCAL ROLE persona_v61_backend");
 assert.deepEqual(statements[1].params,["11111111-1111-4111-8111-111111111111"]);
 assert(statements[1].statement.includes("set_config"));await connection.close();
});
test("invalid, revoked, anonymous and unconfirmed Auth sessions cannot start a SQL transaction",async()=>{
 const connection=api.connectApprovedPersonaTest(valid());
 for(const account of [null,{...user,is_anonymous:true},{...user,email_confirmed_at:null}]){
  user=account;
  await assert.rejects(connection.adapter.read("Bearer "+"A".repeat(50),"44444444-4444-4444-8444-444444444444"),e=>e.code==="unauthorized");
 }
 error=Error("synthetic Auth rejection");
 await assert.rejects(connection.adapter.read("Bearer "+"A".repeat(50),"44444444-4444-4444-8444-444444444444"),e=>e.code==="unauthorized");
 await assert.rejects(connection.adapter.read(null,"44444444-4444-4444-8444-444444444444"),e=>e.code==="unauthorized");
 assert.equal(statements.length,0);await connection.close();
});
