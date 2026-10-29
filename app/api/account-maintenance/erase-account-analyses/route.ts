import { accountLaunchUnavailable, accountPortalEnabled } from "../../../_lib/accountLaunch.server";
import { NextRequest } from "next/server";
import { accountMaintenanceAuthorized } from "../../../_lib/accountCron.server";
import { accountResponse, readAccountForm, sameAccountOrigin } from "../../../_lib/accountHttp.server";
import { eraseAccountPortalAnalyses, validAccountRecordId } from "../../../_lib/accountPurchasesDb.server";
import { accountStorageMode } from "../../../_lib/accountErasureJournal.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Approved operator workflow only. Does not delete an Auth user. */
export async function POST(request: NextRequest) {
  if (!accountPortalEnabled()) return accountLaunchUnavailable();
  if (!accountMaintenanceAuthorized(request) || !sameAccountOrigin(request)) return accountResponse({ error: "Unauthorized" }, 401);
  try {
    if (accountStorageMode() !== "maintenance") throw new Error("Maintenance required");
    const form = await readAccountForm(request);
    const userId = form?.get("userId");
    if (form?.get("confirm") !== "erase-account-analyses" || !validAccountRecordId(userId)) return accountResponse({ error: "Confirmation required" }, 400);
    await eraseAccountPortalAnalyses(userId);
    return accountResponse({ erased: true, authUserDeleted: false }, 200);
  } catch { return accountResponse({ error: "Erasure incomplete; retry before deleting Auth user" }, 503); }
}
