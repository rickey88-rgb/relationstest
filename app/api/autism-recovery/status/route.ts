import { NextRequest, NextResponse } from "next/server";
import { AUTISM_RECOVERY_COOKIE, verifyAutismBrowserUnlockToken } from "../../../_lib/autismRecovery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const unlocked = Boolean(verifyAutismBrowserUnlockToken(request.cookies.get(AUTISM_RECOVERY_COOKIE)?.value ?? null));
  return NextResponse.json({ unlocked }, { headers: { "Cache-Control": "no-store" } });
}
