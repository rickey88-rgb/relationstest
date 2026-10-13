import { NextRequest, NextResponse } from "next/server";
import { AUDHD_LEGACY_RECOVERY_COOKIE, AUDHD_RECOVERY_COOKIE, verifyAudhdBrowserUnlockToken, verifyAudhdLegacyBrowserUnlockToken } from "../../../_lib/audhdRecovery.server";
import { isAudhdRecoveryGrantActive } from "../../../_lib/audhdRecoveryDb.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const legacyCookie = verifyAudhdLegacyBrowserUnlockToken(request.cookies.get(AUDHD_LEGACY_RECOVERY_COOKIE)?.value ?? null);
  const cookie = verifyAudhdBrowserUnlockToken(request.cookies.get(AUDHD_RECOVERY_COOKIE)?.value ?? null);
  let unlocked = false;
  try {
    // v1 is only a pre-existing signed browser entitlement. v2 additionally
    // requires a redeemed, active database grant.
    unlocked = Boolean(legacyCookie) || Boolean(cookie && await isAudhdRecoveryGrantActive(cookie.grantId));
  } catch {
    unlocked = false;
  }
  return NextResponse.json({ unlocked }, { headers: { "Cache-Control": "no-store" } });
}
