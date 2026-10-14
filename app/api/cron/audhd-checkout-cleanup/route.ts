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
  try {
    const [deleted, delivered] = await Promise.all([deleteExpiredAudhdCheckoutAttempts(), deliverPendingGa4Purchases()]);
    console.info(JSON.stringify({ event: "audhd_checkout_maintenance_completed", deleted_count: deleted, ga4_purchases_delivered: delivered }));
    return response({ deleted, delivered }, 200);
  } catch (error) {
    console.error(JSON.stringify({ event: "audhd_checkout_maintenance_failed", error_class: safeErrorClass(error) }));
    return response({ error: "Maintenance unavailable." }, 503);
  }
}
