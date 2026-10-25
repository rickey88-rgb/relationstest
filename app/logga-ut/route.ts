import { NextRequest, NextResponse } from "next/server";
import { privateCacheControl } from "../_lib/authSession.server";
import { clearRouteAuthCookies, createRouteSupabaseClient } from "../_lib/supabase/routeClient.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", privateCacheControl);
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return origin === request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return noStore(new NextResponse(null, { status: 403 }));
  const response = noStore(NextResponse.redirect(new URL("/", request.nextUrl.origin), 303));
  try {
    const supabase = createRouteSupabaseClient(request, response);
    await supabase.auth.signOut();
  } catch {
    // The upstream session may be revoked later, but this browser must lose its
    // private session immediately even during a transient network failure.
  }
  clearRouteAuthCookies(request, response);
  return response;
}
