import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { deleteExpiredAudhdCheckoutAttempts } from "../../../_lib/audhdCheckoutAttemptsDb.server";

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
    const deleted = await deleteExpiredAudhdCheckoutAttempts();
    console.info(JSON.stringify({ event: "audhd_checkout_attempts_cleaned", deleted_count: deleted }));
    return response({ deleted }, 200);
  } catch (error) {
    console.error(JSON.stringify({ event: "audhd_checkout_attempt_cleanup_failed", error_class: safeErrorClass(error) }));
    return response({ error: "Cleanup unavailable." }, 503);
  }
}
