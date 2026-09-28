import { NextRequest, NextResponse } from "next/server";
import { AUDHD_RECOVERY_COOKIE, audhdBrowserUnlockMaxAge, issueAudhdBrowserUnlockToken, verifyAudhdSupportRecoveryToken } from "../../../_lib/audhdRecovery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const destination = new URL("/audhd-test/test", request.url);
  if (!verifyAudhdSupportRecoveryToken(request.nextUrl.searchParams.get("token"))) {
    destination.searchParams.set("recovery", "invalid");
    return NextResponse.redirect(destination, 303);
  }
  destination.searchParams.set("recovery", "success");
  const response = NextResponse.redirect(destination, 303);
  response.cookies.set(AUDHD_RECOVERY_COOKIE, issueAudhdBrowserUnlockToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: audhdBrowserUnlockMaxAge });
  return response;
}
