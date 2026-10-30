import { Buffer } from "node:buffer";
import process from "node:process";
// Existing canonical modules use Node globals. Supabase supports Node built-ins.
Object.assign(globalThis, { Buffer, process });
// Supabase injects this connection for the same project. The shared client still
// requires our official CA, rejectUnauthorized and hostname verification.
if (!process.env.DATABASE_URL && Deno.env.get("SUPABASE_DB_URL")) {
  process.env.DATABASE_URL = Deno.env.get("SUPABASE_DB_URL");
}
// Generated deterministically from existing application sources; no hand-copied calculators.
const { directCustomerHandler } = await import("./_generated/app/_lib/testAccounts/directHandler.server.mjs");
Deno.serve(directCustomerHandler());
