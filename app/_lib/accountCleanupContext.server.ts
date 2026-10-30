import { AsyncLocalStorage } from "node:async_hooks";
import type { NextRequest, NextResponse } from "next/server";
import { accountCronAuthorized } from "./accountCron.server";
import { accountLaunchUnavailable, accountPortalEnabled } from "./accountLaunch.server";

type CleanupJob = "audhd" | "tests";
const cleanupContext = new AsyncLocalStorage<CleanupJob>();
const enabledMode = (mode: string | undefined) => mode === "maintenance" || mode === "active";

function jobEnabled(job: CleanupJob) {
  return enabledMode(process.env.ACCOUNT_STORAGE_MODE)
    && (job === "audhd" || enabledMode(process.env.TEST_ACCOUNTS_STORAGE_MODE));
}

/** Exact GET-only scheduler routes. Customer/admin POST paths never gain an exception. */
export function authorizedCleanupJob(request: NextRequest): CleanupJob | null {
  if (request.method !== "GET") return null;
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "");
  const job = pathname === "/api/cron/account-analysis-cleanup" || pathname === "/api/cron/account-analysis-cleanup/health"
    ? "audhd" : pathname === "/api/cron/test-account-cleanup" ? "tests" : null;
  return job && jobEnabled(job) && accountCronAuthorized(request) ? job : null;
}

export function hasCleanupContext(job: CleanupJob) {
  return cleanupContext.getStore() === job && jobEnabled(job);
}

/** A maintenance setting alone must never grant a database exception. */
export function assertAccountDatabaseAccess(job: CleanupJob) {
  if (!accountPortalEnabled() && !hasCleanupContext(job)) throw new Error("Account portal unavailable");
}

/** The original handler retains its own Auth check and redacted error handling. */
export function accountCleanupHandler(job: CleanupJob, handler: (request: NextRequest) => Promise<NextResponse>) {
  return (request: NextRequest): Promise<NextResponse> => {
    if (authorizedCleanupJob(request) === job) return cleanupContext.run(job, () => handler(request));
    // Preserve the existing active-portal handler behavior. Closed customer
    // traffic has no database exception, even if maintenance is configured.
    if (accountPortalEnabled()) return handler(request);
    return Promise.resolve(accountLaunchUnavailable());
  };
}
