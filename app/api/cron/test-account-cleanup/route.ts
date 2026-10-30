import { accountLaunchUnavailable, accountPortalEnabled } from "../../../_lib/accountLaunch.server";
import { accountCleanupHandler } from "../../../_lib/accountCleanupContext.server";
import { NextRequest } from "next/server";
import { accountCronAuthorized, accountMaintenanceAuthorized } from "../../../_lib/accountCron.server";
import { accountResponse, readAccountForm, sameAccountOrigin } from "../../../_lib/accountHttp.server";
import { cleanup, health, reconcile, eraseOwner } from "../../../_lib/testAccounts/operations.server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
async function readOrRunCleanup(request: NextRequest) {
  if (!accountCronAuthorized(request)) return accountResponse({ error: "Unauthorized" }, 401);
  try {
    if (request.nextUrl.searchParams.get("health") === "true") {
      const healthy = await health(); return accountResponse({ healthy }, healthy ? 200 : 503);
    }
    await cleanup(); return accountResponse({ ok: true }, 200);
  } catch { return accountResponse({ error: "Cleanup unavailable" }, 503); }
}
export const GET = accountCleanupHandler("tests", readOrRunCleanup);
export async function POST(request: NextRequest) {
  if (!accountPortalEnabled()) return accountLaunchUnavailable();
  if (!accountMaintenanceAuthorized(request) || !sameAccountOrigin(request)) return accountResponse({ error: "Unauthorized" }, 401);
  try {
    const form = await readAccountForm(request);
    if (request.nextUrl.searchParams.get("operation") === "erase-owner") {
      if (form?.get("confirm") !== "erase-test-account-analyses") return accountResponse({ error: "Confirmation required" }, 400);
      return accountResponse(await eraseOwner(form?.get("owner") ?? ""), 200);
    }
    if (form?.get("confirm") !== "reconcile-isolated-test-restore") return accountResponse({ error: "Confirmation required" }, 400);
    return accountResponse(await reconcile(form.get("snapshotAt") ?? "", form.get("after") || undefined), 200);
  } catch { return accountResponse({ error: "Restore verification incomplete; keep maintenance enabled" }, 503); }
}
