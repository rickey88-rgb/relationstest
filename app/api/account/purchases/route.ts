import { accountLaunchUnavailable, accountPortalEnabled } from "../../../_lib/accountLaunch.server";
import { accountIdentity, accountResponse } from "../../../_lib/accountHttp.server";
import { accountStorageReady, listAccountPurchases } from "../../../_lib/accountPurchasesDb.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** No caller-supplied user-id or email is read, including query parameters. */
export async function GET() {
  if (!accountPortalEnabled()) return accountLaunchUnavailable();
  const identity = await accountIdentity();
  if (identity.kind !== "authenticated") return accountResponse({ error: "Åtkomst saknas." }, identity.kind === "anonymous" ? 401 : 503);
  try {
    if (!await accountStorageReady()) return accountResponse({ error: "Köpen kan inte hämtas just nu." }, 503);
    return accountResponse({ purchases: await listAccountPurchases(identity.userId) }, 200);
  } catch { return accountResponse({ error: "Köpen kan inte hämtas just nu." }, 503); }
}
