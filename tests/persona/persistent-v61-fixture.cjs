/* eslint-disable @typescript-eslint/no-require-imports -- local test database only */
const fs=require("node:fs"),path=require("node:path"),{PGlite}=require("@electric-sql/pglite");
const root=path.resolve(__dirname,"../.."),snapshot=require("../../app/persona/_domain/release-v61/snapshot.cjs");
const load=require("../../app/autism-test/test/test-loader.cjs")({"server-only":{},"./snapshot.cjs":{default:snapshot}});
const {createPersonaPersistentAdapter}=load(path.join(root,"app/_lib/testAccounts/personaV61Postgres.server.ts"));
const manifest=load(path.join(root,"app/persona/_domain/release-v61/manifest.ts"));
const A="11111111-1111-4111-8111-111111111111",B="22222222-2222-4222-8222-222222222222";
const tokenA="Bearer "+"A".repeat(50),tokenB="Bearer "+"B".repeat(50);
const profiles=require("./insights-v2-full-fixtures.cjs");
function input(id="F21",extra){
 return {questionVersion:manifest.QUESTION_VERSION,reportVersion:manifest.REPORT_VERSION,
 answers:profiles.find(p=>p.id===id).answers.slice(),...(extra?{supplement:{questionVersion:manifest.SUPPLEMENT_QUESTION_VERSION,answers:extra}}:{})};
}
async function openLocal(directory,initialize=true){
 const pg=directory?new PGlite(directory):new PGlite();
 if(initialize){
  await pg.exec("CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY);");
  await pg.query("INSERT INTO auth.users(id) VALUES($1),($2)",[A,B]);
  await pg.exec(fs.readFileSync(path.join(root,"supabase/persona-v61-test/001_persistent_results.sql"),"utf8"));
 }
 const transactions={withOwner:(owner,operation)=>pg.transaction(async tx=>{
  await tx.exec("SET LOCAL ROLE persona_v61_backend");
  await tx.query("SELECT set_config('persona_v61_test.owner_id',$1,true)",[owner]);
  return operation({query:(sql,params=[])=>tx.query(sql,params)});
 })};
 let valid=true,authCalls=0;
 const adapter=createPersonaPersistentAdapter(transactions,async authorization=>{
  authCalls++;return valid&&authorization===tokenA?{userId:A}:valid&&authorization===tokenB?{userId:B}:null;
 },()=>new Date("2026-11-20T12:00:00.000Z"));
 return {pg,adapter,transactions,setValid:value=>{valid=value;},authCalls:()=>authCalls,close:()=>pg.close()};
}
module.exports={openLocal,input,A,B,tokenA,tokenB,root,load};
