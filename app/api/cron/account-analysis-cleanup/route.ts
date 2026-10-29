import { accountLaunchUnavailable, accountPortalEnabled } from "../../../_lib/accountLaunch.server";
import { NextRequest } from "next/server";
import { accountResponse } from "../../../_lib/accountHttp.server";
import { accountCleanupHealth, accountStorageReady, deleteExpiredAccountAnalyses, recordAccountMonitorSuccess } from "../../../_lib/accountPurchasesDb.server";
import { accountCronAuthorized } from "../../../_lib/accountCron.server";
import { notifyAccountCleanup } from "../../../_lib/accountMonitoring.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  if (!accountPortalEnabled()) return accountLaunchUnavailable();
  if (!accountCronAuthorized(request)) return accountResponse({ error: "Unauthorized" }, 401);
  try {
    if (!await accountStorageReady()) throw new Error("Storage unavailable");
    const deleted = await deleteExpiredAccountAnalyses();
    if (!(await accountCleanupHealth(false)).healthy) throw new Error("Cleanup health failed");
    await notifyAccountCleanup(true);
    await recordAccountMonitorSuccess();
    console.info(JSON.stringify({ event: "account_analysis_cleanup_completed", deleted_count: deleted }));
    return accountResponse({ deleted }, 200);
  } catch {
    try { await notifyAccountCleanup(false); } catch { console.error(JSON.stringify({ event: "account_analysis_monitor_delivery_failed" })); }
    console.error(JSON.stringify({ event: "account_analysis_cleanup_failed" }));
    return accountResponse({ error: "Cleanup unavailable" }, 503);
  }
}
