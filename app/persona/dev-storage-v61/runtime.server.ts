import "server-only";
import { createHash } from "node:crypto";
import { createLocalDatabase } from "../../_lib/testAccounts/personaV61LocalDatabase.server";
type Runtime=Awaited<ReturnType<typeof createLocalDatabase>>;
const globals=globalThis as typeof globalThis & {personaV61LocalDb?:Promise<Runtime>};
export async function localRuntime():Promise<Runtime> {
  if(process.env.NODE_ENV!=="development"||process.env.PERSONA_V61_LOCAL_DB!=="pglite-memory")throw Error("Local database disabled");
  const key=process.env.TEST_ACCOUNTS_ENCRYPTION_KEY??"";
  if(!/^[A-Za-z0-9_-]{43}$/.test(key)||createHash("sha256").update(key).digest("hex")!==process.env.PERSONA_V61_LOCAL_KEY_ID)
    throw Error("Separate local test key required");
  if(["DATABASE_URL","SUPABASE_DB_URL","SUPABASE_URL","NEXT_PUBLIC_SUPABASE_URL","STRIPE_SECRET_KEY","RESEND_API_KEY"]
    .some(name=>!!process.env[name]))throw Error("Isolated environment required");
  if(!globals.personaV61LocalDb)globals.personaV61LocalDb=(async()=>{
    const {PGlite:Database}=await import("@electric-sql/pglite");
    const db=new Database();
    try{return await createLocalDatabase(db);}catch(error){await db.close();throw error;}
  })().catch(error=>{delete globals.personaV61LocalDb;throw error;});
  return globals.personaV61LocalDb;
}
