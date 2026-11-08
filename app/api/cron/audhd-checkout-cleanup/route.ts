import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { deleteExpiredAudhdCheckoutAttempts } from "../../../_lib/audhdCheckoutAttemptsDb.server";
import { deliverPendingGa4Purchases } from "../../../_lib/ga4PurchaseDelivery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization") ?? "";
  if (!secret || !authorization.startsWith("Bearer ")) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(authorization);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

function response(body: Record<string, string | number>, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

function safeErrorClass(error: unknown) {
  return error instanceof Error && /^[A-Za-z0-9_.-]{1,80}$/.test(error.name) ? error.name : "unknown";
}

/** Vercel Cron invokes this GET with `Authorization: Bearer $CRON_SECRET`. */
export async function GET(request: NextRequest) {
  if (!authorized(request)) return response({ error: "Unauthorized" }, 401);
  const [cleanup, ga4] = await Promise.allSettled([
    deleteExpiredAudhdCheckoutAttempts(),
    process.env.PAYMENT_LEDGER_V2_ENABLED === "true" ? 0 : deliverPendingGa4Purchases(),
  ]);
  for (const [stage, result] of [["retention", cleanup], ["ga4_delivery", ga4]] as const) {
    if (result.status === "rejected") {
      const error: unknown = result.reason;
      const code = error instanceof Error ? (error as Error & { code?: unknown }).code : undefined;
      console.error(JSON.stringify({
        event: "audhd_checkout_maintenance_failed", stage, error_class: safeErrorClass(error),
        ...(typeof code === "string" && /^[0-9A-Z]{5}$/.test(code) ? { database_code: code } : {}),
      }));
    }
  }
  if (cleanup.status === "rejected" || ga4.status === "rejected") {
    return response({ error: "Maintenance unavailable." }, 503);
  }
  const deleted = cleanup.value;
  const delivered = ga4.value;
  console.info(JSON.stringify({ event: "audhd_checkout_maintenance_completed", deleted_count: deleted, ga4_purchases_delivered: delivered }));
  return response({ deleted, delivered }, 200);
}
