import { Buffer } from "node:buffer";
import process from "node:process";
// Existing canonical modules use Node globals. Supabase supports Node built-ins.
Object.assign(globalThis, { Buffer, process });
// Generated deterministically from existing application sources; no hand-copied calculators.
const { directCustomerHandler } = await import("./_generated/app/_lib/testAccounts/directHandler.server.mjs");
Deno.serve(directCustomerHandler());
