import { NextRequest, NextResponse } from "next/server";
import { AUDHD_RECOVERY_COOKIE, verifyAudhdBrowserUnlockToken } from "../../../_lib/audhdRecovery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const unlocked = Boolean(verifyAudhdBrowserUnlockToken(request.cookies.get(AUDHD_RECOVERY_COOKIE)?.value ?? null));
  return NextResponse.json({ unlocked }, { headers: { "Cache-Control": "no-store" } });
}
