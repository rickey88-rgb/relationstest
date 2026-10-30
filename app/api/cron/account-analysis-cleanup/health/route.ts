import { accountCleanupHandler } from "../../../../_lib/accountCleanupContext.server";
import { NextRequest } from "next/server";
import { accountCronAuthorized } from "../../../../_lib/accountCron.server";
import { accountResponse } from "../../../../_lib/accountHttp.server";
import { accountCleanupHealth } from "../../../../_lib/accountPurchasesDb.server";
import { accountStorageMode, assertErasureJournalAvailable } from "../../../../_lib/accountErasureJournal.server";
import { accountMonitoringConfigured } from "../../../../_lib/accountMonitoring.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Read-only: an independent monitor must call this, never the deletion URL. */
async function readHealth(request: NextRequest) {
  if (!accountCronAuthorized(request)) return accountResponse({ error: "Unauthorized" }, 401);
  try {
    if (!["active", "maintenance"].includes(accountStorageMode()) || !accountMonitoringConfigured()) throw new Error("Account maintenance not active");
    await assertErasureJournalAvailable();
    const health = await accountCleanupHealth();
    return accountResponse(health, health.healthy ? 200 : 503);
  } catch { return accountResponse({ healthy: false, error: "Cleanup health unavailable" }, 503); }
}

export const GET = accountCleanupHandler("audhd", readHealth);
