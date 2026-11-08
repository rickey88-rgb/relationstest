import type { NextRequest } from "next/server";
import { accountCronAuthorized } from "../../../_lib/accountCron.server";
import { maintainVerifiedPurchases } from "../../../_lib/verifiedPurchaseDelivery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  if (!accountCronAuthorized(request)) return new Response(null, { status: 401, headers });
  if (process.env.PAYMENT_LEDGER_V2_ENABLED !== "true") return new Response(null, { status: 204, headers });
  try {
    const result = await maintainVerifiedPurchases();
    console.info(JSON.stringify({ event: "verified_purchase_maintenance", ...result }));
    return Response.json(result, { status: result.failed ? 503 : 200, headers });
  } catch {
    console.error(JSON.stringify({ event: "verified_purchase_maintenance_failed" }));
    return new Response(null, { status: 503, headers });
  }
}
