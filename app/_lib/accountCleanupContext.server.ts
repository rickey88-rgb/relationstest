import type { NextRequest, NextResponse } from "next/server";
import { accountCronAuthorized } from "./accountCron.server";
import { accountLaunchUnavailable, accountPortalEnabled } from "./accountLaunch.server";

import { jobEnabled, runCleanupScope, type CleanupJob } from "./accountCleanupScope.server";
export { hasCleanupContext, assertAccountDatabaseAccess } from "./accountCleanupScope.server";

/** Exact GET-only scheduler routes. Customer/admin POST paths never gain an exception. */
export function authorizedCleanupJob(request: NextRequest): CleanupJob | null {
  if (request.method !== "GET") return null;
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "");
  const job = pathname === "/api/cron/account-analysis-cleanup" || pathname === "/api/cron/account-analysis-cleanup/health"
    ? "audhd" : pathname === "/api/cron/test-account-cleanup" ? "tests" : null;
  return job && jobEnabled(job) && accountCronAuthorized(request) ? job : null;
}

/** The original handler retains its own Auth check and redacted error handling. */
export function accountCleanupHandler(job: CleanupJob, handler: (request: NextRequest) => Promise<NextResponse>) {
  return (request: NextRequest): Promise<NextResponse> => {
    if (authorizedCleanupJob(request) === job) return runCleanupScope(job, () => handler(request));
    // Preserve the existing active-portal handler behavior. Closed customer
    // traffic has no database exception, even if maintenance is configured.
    if (accountPortalEnabled()) return handler(request);
    return Promise.resolve(accountLaunchUnavailable());
  };
}
