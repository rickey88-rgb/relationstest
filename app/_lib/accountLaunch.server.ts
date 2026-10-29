import { NextResponse } from "next/server";

/** Server-only rollout gate, independent of storage modes and per-product flags. */
export function accountPortalEnabled() {
  return process.env.ACCOUNT_PORTAL_ENABLED === "true";
}

export function assertAccountPortalEnabled() {
  if (!accountPortalEnabled()) throw new Error("Account portal unavailable");
}

/** Existing guest payments/recovery/books and logout deliberately remain available. */
export function isAccountLaunchPath(pathname: string) {
  return [
    "/mina-sidor", "/logga-in", "/auth/confirm",
    "/api/account", "/api/test-accounts", "/api/account-maintenance",
    "/api/cron/account-analysis-cleanup", "/api/cron/test-account-cleanup",
  ].some(prefix => pathname === prefix || pathname.startsWith(prefix + "/"));
}

export function accountLaunchUnavailable() {
  return NextResponse.json({ error: "Mina sidor är ännu inte öppet." }, {
    status: 503,
    headers: {
      "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      Pragma: "no-cache", "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
