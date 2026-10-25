import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { supabasePublicConfig } from "../authConfig.server";

const cookieOptions = {
  name: "rv-auth",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const AUTH_COOKIE_PREFIX = "rv-auth";

/** Applies all Supabase session-cookie changes to this particular response. */
export function createRouteSupabaseClient(request: NextRequest, response: NextResponse) {
  const config = supabasePublicConfig();
  return createServerClient(config.url, config.publishableKey, {
    auth: { flowType: "pkce", detectSessionInUrl: false },
    cookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
}

/** Clear all chunked variants as well as the base session cookie. */
export function clearRouteAuthCookies(request: NextRequest, response: NextResponse) {
  request.cookies.getAll()
    .filter(({ name }) => name === AUTH_COOKIE_PREFIX || name.startsWith(`${AUTH_COOKIE_PREFIX}.`))
    .forEach(({ name }) => response.cookies.set(name, "", { ...cookieOptions, maxAge: 0 }));
}
