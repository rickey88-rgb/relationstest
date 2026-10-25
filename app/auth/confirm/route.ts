import { NextRequest, NextResponse } from "next/server";
import { ACCOUNT_PATH, loginUrl } from "../../_lib/authConfig.server";
import { privateCacheControl } from "../../_lib/authSession.server";
import { createRouteSupabaseClient } from "../../_lib/supabase/routeClient.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", privateCacheControl);
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

function loginRedirect(request: NextRequest, status: "invalid-link" | "unavailable") {
  return noStore(NextResponse.redirect(loginUrl(request.nextUrl.origin, status), 303));
}

function validTokenHash(value: string | null): value is string {
  return typeof value === "string" && value.length >= 16 && value.length <= 512;
}

function escapeHtmlAttribute(value: string) {
  return value.replace(/[&<>\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] as string);
}

/**
 * Verifies the one-time token hash rather than exchanging a browser-bound code.
 * GET deliberately does not verify it: mail scanners and link previews must
 * never be able to consume a customer's sign-in link.
 */
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  if (!validTokenHash(tokenHash) || type !== "email") return loginRedirect(request, "invalid-link");
  return new NextResponse(`<!doctype html>
<html lang="sv">
  <head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Öppna Mina sidor</title>
    <style>
      body { margin: 0; background: #f7f5f2; color: #202124; font-family: system-ui, sans-serif; }
      main { min-height: 100vh; min-height: 100dvh; display: grid; place-items: center; padding: 24px; }
      section { width: min(100%, 540px); border: 1px solid #e5e2de; border-radius: 24px; background: #fff; padding: clamp(28px, 6vw, 44px); }
      h1 { margin: 0; font-family: Georgia, serif; font-size: clamp(30px, 7vw, 42px); }
      p { line-height: 1.6; }
      button { width: 100%; min-height: 54px; border: 0; border-radius: 12px; background: #27666a; color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
      button:focus-visible { outline: 3px solid #202124; outline-offset: 4px; }
    </style>
  </head>
  <body><main><section>
    <p>Relationsvarning.se</p>
    <h1>Öppna Mina sidor</h1>
    <p>Tryck på knappen för att logga in. Detta skyddar länken från att förbrukas av automatiska mejlskannrar.</p>
    <form method="post" action="/auth/confirm">
      <input type="hidden" name="token_hash" value="${escapeHtmlAttribute(tokenHash)}">
      <input type="hidden" name="type" value="email">
      <button type="submit">Öppna Mina sidor</button>
    </form>
  </section></main></body>
</html>`, {
    headers: {
      "Cache-Control": privateCacheControl,
      Pragma: "no-cache",
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow, nosnippet",
    },
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submittedTokenHash = formData.get("token_hash");
  const type = formData.get("type");
  if (typeof submittedTokenHash !== "string" || !validTokenHash(submittedTokenHash) || type !== "email") return loginRedirect(request, "invalid-link");
  const tokenHash = submittedTokenHash;

  const destination = new URL(ACCOUNT_PATH, request.nextUrl.origin);
  const response = noStore(NextResponse.redirect(destination, 303));
  try {
    const supabase = createRouteSupabaseClient(request, response);
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" });
    return error ? loginRedirect(request, "invalid-link") : response;
  } catch {
    return loginRedirect(request, "unavailable");
  }
}
