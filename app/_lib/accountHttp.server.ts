import { NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./authSession.server";
import { validAccountRecordId } from "./accountPurchasesDb.server";
import { accountPortalEnabled } from "./accountLaunch.server";

export async function accountIdentity() {
  if (!accountPortalEnabled()) return { kind: "unavailable" as const };
  try {
    const user = await authenticatedUser();
    if (!user || !validAccountRecordId(user.id) || !user.email_confirmed_at || user.is_anonymous) return { kind: "anonymous" as const };
    return { kind: "authenticated" as const, userId: user.id, email: user.email ?? "Ditt konto" };
  } catch { return { kind: "unavailable" as const }; }
}
export function accountResponse(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache",
    "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow", Vary: "Cookie" } });
}
export function accountRedirect(request: NextRequest, path: string) {
  const response = NextResponse.redirect(new URL(path, request.nextUrl.origin), 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
export function sameAccountOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}
/** Claim forms contain no answers or arbitrary user ids; cap the streamed body. */
export async function readAccountForm(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 4096) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
}
