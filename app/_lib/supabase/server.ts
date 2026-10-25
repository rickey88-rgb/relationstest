import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublicConfig } from "../authConfig.server";

const cookieOptions = {
  name: "rv-auth",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/** A request-scoped SSR client. Never cache this client or its user data. */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const config = supabasePublicConfig();
  return createServerClient(config.url, config.publishableKey, {
    auth: { flowType: "pkce", detectSessionInUrl: false },
    cookieOptions,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. The proxy refreshes sessions
          // before rendering authenticated pages, so this is safe here.
        }
      },
    },
  });
}
