import { NextRequest, NextResponse } from "next/server";
import { AUTISM_RECOVERY_COOKIE, autismBrowserUnlockMaxAge, issueAutismBrowserUnlockToken, verifyAutismSupportRecoveryToken } from "../../../_lib/autismRecovery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const destination = new URL("/autism-test/test", request.url);
  if (!verifyAutismSupportRecoveryToken(request.nextUrl.searchParams.get("token"))) {
    destination.searchParams.set("recovery", "invalid");
    return NextResponse.redirect(destination, 303);
  }
  destination.searchParams.set("recovery", "success");
  const response = NextResponse.redirect(destination, 303);
  response.cookies.set(AUTISM_RECOVERY_COOKIE, issueAutismBrowserUnlockToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: autismBrowserUnlockMaxAge });
  return response;
}
