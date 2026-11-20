import "server-only";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { accountDatabaseTls } from "../accountDatabaseTls.server";
import { createPersonaPersistentAdapter, type PersonaSql, type PersonaOwnerTransactions } from "./personaV61Postgres.server";

export type ApprovedPersonaTest={
  environment:"isolated-test";approvedProjectRef:string;productionProjectRefs:readonly string[];
  databaseUrl:string;supabaseUrl:string;publishableKey:string;encryptionKeyFingerprint:string;
};
function denied():never{throw Error("Separate approved PERSONA test environment required");}
export function validateApprovedTest(config:ApprovedPersonaTest){
  try{
    if(process.env.NODE_ENV==="production"||process.env.PERSONA_V61_ALLOW_REMOTE_TEST!=="1"||config.environment!=="isolated-test")denied();
    const ref=config.approvedProjectRef;
    if(!/^[a-z0-9]{20}$/.test(ref)||!config.productionProjectRefs.length||
      config.productionProjectRefs.some(r=>!/^[a-z0-9]{20}$/.test(r))||config.productionProjectRefs.includes(ref))denied();
    const db=new URL(config.databaseUrl),auth=new URL(config.supabaseUrl);
    if(!["postgres:","postgresql:"].includes(db.protocol)||db.hostname!=="db."+ref+".supabase.co"||
      decodeURIComponent(db.username)!=="persona_v61_runtime"||!db.password||db.search||db.hash||(db.port&&db.port!=="5432"))denied();
    if(auth.protocol!=="https:"||auth.hostname!==ref+".supabase.co"||auth.pathname!=="/"||
      auth.username||auth.password||auth.search||auth.hash||config.publishableKey.length<20)denied();
    const key=process.env.TEST_ACCOUNTS_ENCRYPTION_KEY??"";
    if(!/^[A-Za-z0-9_-]{43}$/.test(key)||createHash("sha256").update(key).digest("hex")!==config.encryptionKeyFingerprint)denied();
    return {databaseUrl:config.databaseUrl,supabaseUrl:auth.origin,publishableKey:config.publishableKey};
  }catch{denied();}
}
/** Explicit opt-in factory only. No environment URL defaults, migrations or calls at module import. */
export function connectApprovedPersonaTest(config:ApprovedPersonaTest){
  const checked=validateApprovedTest(config);
  const sql=postgres(checked.databaseUrl,{max:1,prepare:false,idle_timeout:20,connect_timeout:10,
    ssl:accountDatabaseTls(),connection:{statement_timeout:20000,lock_timeout:5000}});
  const auth=createClient(checked.supabaseUrl,checked.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const transactions:PersonaOwnerTransactions={
    withOwner:operationWithOwner,
  };
  async function operationWithOwner<T>(owner:string,operation:(connection:PersonaSql)=>Promise<T>):Promise<T>{
    const result=await sql.begin(async tx=>{
      await tx.unsafe("SET LOCAL ROLE persona_v61_backend");
      await tx.unsafe("SELECT set_config('persona_v61_test.owner_id',$1,true)",[owner]);
      return {value:await operation({query:async <R,>(statement:string,params:unknown[]=[])=>({
        rows:Array.from(await tx.unsafe(statement,params as never[])) as R[],
      })})};
    });
    return result.value;
  }
  const adapter=createPersonaPersistentAdapter(transactions,async authorization=>{
    if(!authorization||!/^Bearer [A-Za-z0-9_.-]{40,8192}$/.test(authorization))return null;
    const {data,error}=await auth.auth.getUser(authorization.slice(7));
    if(error||!data.user||!data.user.email_confirmed_at||data.user.is_anonymous)return null;
    return {userId:data.user.id};
  });
  return {adapter,close:()=>sql.end({timeout:5})};
}
