import type { NextRequest } from "next/server";
import { legacyBookReturn } from "../../_lib/bookDelivery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return legacyBookReturn(request, "adhd-deluxe");
}
