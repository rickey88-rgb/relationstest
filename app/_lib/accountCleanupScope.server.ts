import { AsyncLocalStorage } from "node:async_hooks";
import { accountPortalEnabled } from "./accountGate.server";
export type CleanupJob = "audhd" | "tests";
const scope = new AsyncLocalStorage<CleanupJob>();
const enabled = (mode: string | undefined) => mode === "maintenance" || mode === "active";
export function jobEnabled(job: CleanupJob) {
  return enabled(process.env.ACCOUNT_STORAGE_MODE) && (job === "audhd" || enabled(process.env.TEST_ACCOUNTS_STORAGE_MODE));
}
export function hasCleanupContext(job: CleanupJob) { return scope.getStore() === job && jobEnabled(job); }
export function assertAccountDatabaseAccess(job: CleanupJob) {
  if (!accountPortalEnabled() && !hasCleanupContext(job)) throw new Error("Account portal unavailable");
}
/** Caller must authenticate scheduler authority before entering this scope. */
export function runCleanupScope<T>(job: CleanupJob, callback: () => T): T { return scope.run(job, callback); }
