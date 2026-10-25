import type { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "./supabase/server";
import { createRouteSupabaseClient } from "./supabase/routeClient.server";

export const privateCacheControl = "private, no-store, max-age=0, must-revalidate";

export async function authenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

/** Refreshes a cookie-backed session before a protected response is rendered. */
export async function refreshAuthSession(request: NextRequest, response: NextResponse) {
  const supabase = createRouteSupabaseClient(request, response);
  const { data, error } = await supabase.auth.getUser();
  response.headers.set("Cache-Control", privateCacheControl);
  response.headers.set("Pragma", "no-cache");
  return error ? null : data.user;
}

export function copyResponseCookies(source: NextResponse, destination: NextResponse) {
  source.cookies.getAll().forEach(({ name, value, ...options }) => destination.cookies.set(name, value, options));
  return destination;
}
