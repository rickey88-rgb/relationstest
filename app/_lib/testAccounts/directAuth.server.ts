import { createClient } from "@supabase/supabase-js";
import { accountPilotUserAllowed } from "../accountPilot.server";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
/** Validate the token with Supabase Auth; a client user ID/email is never proof. */
export async function directIdentity(authorization: string | null) {
  if (!authorization || !/^Bearer [A-Za-z0-9_.-]{40,8192}$/.test(authorization)) return null;
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || new URL(url).protocol !== "https:") throw new Error("Auth unavailable");
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data, error } = await client.auth.getUser(authorization.slice(7));
  const user = data.user;
  if (error || !user || !uuid.test(user.id) || !user.email_confirmed_at || user.is_anonymous || !accountPilotUserAllowed(user)) return null;
  return { userId: user.id };
}
