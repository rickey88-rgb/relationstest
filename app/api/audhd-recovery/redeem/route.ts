import { NextRequest, NextResponse } from "next/server";
import { AUDHD_LEGACY_RECOVERY_COOKIE, AUDHD_RECOVERY_COOKIE, audhdBrowserUnlockMaxAge, hashAudhdRecoveryToken, isAudhdRecoveryToken, issueAudhdBrowserUnlockToken, issueAudhdLegacyBrowserUnlockToken, verifyAudhdLegacySupportRecoveryToken } from "../../../_lib/audhdRecovery.server";
import { redeemAudhdRecoveryGrant } from "../../../_lib/audhdRecoveryDb.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const destination = new URL("/audhd-test/test", request.url);
  const token = request.nextUrl.searchParams.get("token");
  const legacyToken = verifyAudhdLegacySupportRecoveryToken(token);
  if (legacyToken) {
    const remainingSeconds = legacyToken.exp - Math.floor(Date.now() / 1000);
    destination.searchParams.set("recovery", "success");
    const response = NextResponse.redirect(destination, 303);
    // Do not extend v1: this replacement cookie expires with the old link.
    response.cookies.set(AUDHD_LEGACY_RECOVERY_COOKIE, issueAudhdLegacyBrowserUnlockToken(legacyToken.exp), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: remainingSeconds });
    return response;
  }
  // v1 is a signed dotted token; v2 is a fixed-size opaque value. A legacy
  // shaped value is never hashed or considered by the v2 grant lookup.
  if (!isAudhdRecoveryToken(token)) {
    destination.searchParams.set("recovery", "invalid");
    return NextResponse.redirect(destination, 303);
  }
  let grantId: string | null = null;
  try {
    grantId = await redeemAudhdRecoveryGrant(hashAudhdRecoveryToken(token));
  } catch {
    grantId = null;
  }
  if (!grantId) {
    destination.searchParams.set("recovery", "invalid");
    return NextResponse.redirect(destination, 303);
  }
  destination.searchParams.set("recovery", "success");
  const response = NextResponse.redirect(destination, 303);
  response.cookies.set(AUDHD_RECOVERY_COOKIE, issueAudhdBrowserUnlockToken(grantId), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: audhdBrowserUnlockMaxAge });
  return response;
}
