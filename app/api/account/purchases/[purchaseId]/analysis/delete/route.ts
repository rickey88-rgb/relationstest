import { NextRequest } from "next/server";
import { accountIdentity, accountRedirect, accountResponse, readAccountForm, sameAccountOrigin } from "../../../../../../_lib/accountHttp.server";
import { removeOwnedAccountAnalysis } from "../../../../../../_lib/accountPurchasesDb.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, context: { params: Promise<{ purchaseId: string }> }) {
  if (!sameAccountOrigin(request)) return accountResponse({ error: "Åtkomst saknas." }, 403);
  const identity = await accountIdentity();
  if (identity.kind !== "authenticated") return accountResponse({ error: "Åtkomst saknas." }, identity.kind === "anonymous" ? 401 : 503);
  try {
    const form = await readAccountForm(request);
    if (form?.get("confirm") !== "delete-analysis") return accountResponse({ error: "Bekräftelse saknas." }, 400);
    const { purchaseId } = await context.params;
    if (!await removeOwnedAccountAnalysis(identity.userId, purchaseId)) return accountResponse({ error: "Analysen finns inte här." }, 404);
    return accountRedirect(request, "/mina-sidor?status=deleted#analyser");
  } catch { return accountResponse({ error: "Analysen kunde inte raderas just nu. Försök igen." }, 503); }
}
