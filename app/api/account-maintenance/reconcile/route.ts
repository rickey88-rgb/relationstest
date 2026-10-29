import { NextRequest } from "next/server";
import { accountMaintenanceAuthorized } from "../../../_lib/accountCron.server";
import { accountResponse, readAccountForm, sameAccountOrigin } from "../../../_lib/accountHttp.server";
import { reconcileAccountRestore } from "../../../_lib/accountPurchasesDb.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Manual operator action in an isolated maintenance deployment. Never imports
 * backups, changes subscription plans, or opens customer traffic.
 */
export async function POST(request: NextRequest) {
  if (!accountMaintenanceAuthorized(request) || !sameAccountOrigin(request)) return accountResponse({ error: "Unauthorized" }, 401);
  try {
    const form = await readAccountForm(request);
    if (form?.get("confirm") !== "reconcile-isolated-restore") return accountResponse({ error: "Confirmation required" }, 400);
    const date = new Date(form.get("snapshotCreatedAt") ?? "");
    const result = await reconcileAccountRestore(date, form.get("afterPurchaseId") || undefined);
    return accountResponse(result, 200);
  } catch { return accountResponse({ error: "Restore verification incomplete; remain in maintenance" }, 503); }
}
