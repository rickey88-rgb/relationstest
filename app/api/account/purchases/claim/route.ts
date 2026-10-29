import { accountLaunchUnavailable, accountPortalEnabled } from "../../../../_lib/accountLaunch.server";
import { NextRequest } from "next/server";
import { accountIdentity, accountRedirect, accountResponse, readAccountForm, sameAccountOrigin } from "../../../../_lib/accountHttp.server";
import { resolveAccountAudhdProof } from "../../../../_lib/accountAudhdProof.server";
import { accountCleanupHealth, accountStorageReady, saveAccountAudhdPurchase } from "../../../../_lib/accountPurchasesDb.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!accountPortalEnabled()) return accountLaunchUnavailable();
  if (!sameAccountOrigin(request)) return accountResponse({ error: "Åtkomst saknas." }, 403);
  const identity = await accountIdentity();
  if (identity.kind !== "authenticated") return accountResponse({ error: "Logga in för att spara analysen." }, identity.kind === "anonymous" ? 401 : 503);
  try {
    const form = await readAccountForm(request);
    const source = form?.get("source");
    if ((source !== "checkout" && source !== "recovery") || !["account-analysis-v1", "account-purchase-v1"].includes(form?.get("consent") ?? "")) return accountResponse({ error: "Bekräfta ditt val först." }, 400);
    const proof = await resolveAccountAudhdProof(source, request.cookies);
    if (proof.kind === "unavailable") return accountRedirect(request, "/mina-sidor/koppla?status=unavailable");
    if (proof.kind !== "verified" || form?.get("fingerprint") !== proof.fingerprint) return accountRedirect(request, "/mina-sidor/koppla?status=proof-required");
    if (form?.get("consent") !== (proof.encrypted ? "account-analysis-v1" : "account-purchase-v1")) return accountRedirect(request, "/mina-sidor/koppla?status=proof-required");
    if (!await accountStorageReady()) return accountRedirect(request, "/mina-sidor/koppla?status=unavailable");
    // Do not start/extend account storage before a successful cleanup run, or
    // while monitoring detects a missed run/overdue payloads. Reads/deletion
    // and all guest purchases remain independently available.
    if (!(await accountCleanupHealth()).healthy) return accountRedirect(request, "/mina-sidor/koppla?status=unavailable");
    const result = await saveAccountAudhdPurchase(identity.userId, proof);
    return accountRedirect(request, result.kind === "saved" ? (proof.encrypted ? "/mina-sidor?status=saved#analyser" : "/mina-sidor?status=purchase-linked#kop") : "/mina-sidor/koppla?status=not-linked");
  } catch { return accountRedirect(request, "/mina-sidor/koppla?status=unavailable"); }
}
