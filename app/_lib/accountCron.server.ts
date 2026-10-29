import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export function accountCronAuthorized(request: NextRequest) {
  return authorized(request, process.env.CRON_SECRET?.trim());
}

/** Manual restore/account-erasure authority is separate from scheduler access. */
export function accountMaintenanceAuthorized(request: NextRequest) {
  const secret = process.env.ACCOUNT_MAINTENANCE_SECRET?.trim();
  return Boolean(secret && secret.length >= 32 && authorized(request, secret));
}

function authorized(request: NextRequest, secret: string | undefined) {
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  return Boolean(secret && actual.length === expected.length && timingSafeEqual(actual, expected));
}
