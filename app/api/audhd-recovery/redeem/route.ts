import { NextRequest, NextResponse } from "next/server";
import { AUDHD_LEGACY_RECOVERY_COOKIE, AUDHD_RECOVERY_COOKIE, audhdBrowserUnlockMaxAge, hashAudhdRecoveryToken, isAudhdRecoveryToken, issueAudhdBrowserUnlockToken, issueAudhdLegacyBrowserUnlockToken, verifyAudhdLegacySupportRecoveryToken } from "../../../_lib/audhdRecovery.server";
import { loadAudhdRecoveryGrantForRedemption, redeemAudhdRecoveryGrant, revokeAudhdRecoveryGrantsForPaymentIntent } from "../../../_lib/audhdRecoveryDb.server";
import { inspectAudhdCheckoutSession } from "../../../_lib/audhdRecoveryPayment.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function recoveryDestination(request: NextRequest, state: "success" | "invalid") {
  const destination = new URL("/audhd-test/test", request.url);
  destination.searchParams.set("recovery", state);
  return destination;
}

function escapeHtmlAttribute(value: string) {
  return value.replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] as string);
}

export async function GET(request: NextRequest) {
  // Link previews, security scanners and mail clients may issue GET requests.
  // Deliberately do not validate, look up, revoke or redeem a grant here.
  const token = request.nextUrl.searchParams.get("token") ?? "";
  return new NextResponse(`<!doctype html>
<html lang="sv">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Återställ åtkomst</title></head>
  <body>
    <main>
      <h1>Återställ åtkomst till ditt resultat</h1>
      <p>Kontrollera att du vill öppna ditt betalda resultat. Åtkomsten aktiveras först när du väljer knappen nedan.</p>
      <form method="post" action="/api/audhd-recovery/redeem">
        <input type="hidden" name="token" value="${escapeHtmlAttribute(token)}">
        <button type="submit">Öppna mitt resultat</button>
      </form>
    </main>
  </body>
</html>`, {
    headers: {
      "cache-control": "private, no-store, max-age=0",
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      "referrer-policy": "no-referrer",
      "x-robots-tag": "noindex, nofollow, nosnippet",
    },
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submittedToken = formData.get("token");
  const token = typeof submittedToken === "string" ? submittedToken : null;
  const legacyToken = verifyAudhdLegacySupportRecoveryToken(token);
  if (legacyToken) {
    const remainingSeconds = legacyToken.exp - Math.floor(Date.now() / 1000);
    const response = NextResponse.redirect(recoveryDestination(request, "success"), 303);
    // Do not extend v1: this replacement cookie expires with the old link.
    response.cookies.set(AUDHD_LEGACY_RECOVERY_COOKIE, issueAudhdLegacyBrowserUnlockToken(legacyToken.exp), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: remainingSeconds });
    return response;
  }
  // v1 is a signed dotted token; v2 is a fixed-size opaque value. A legacy
  // shaped value is never hashed or considered by the v2 grant lookup.
  if (!isAudhdRecoveryToken(token)) {
    return NextResponse.redirect(recoveryDestination(request, "invalid"), 303);
  }
  let grantId: string | null = null;
  try {
    const tokenHash = hashAudhdRecoveryToken(token);
    const grant = await loadAudhdRecoveryGrantForRedemption(tokenHash);
    if (grant) {
      // Recovery is a payment entitlement. Recheck Stripe immediately before
      // consuming the one-time link rather than trusting a past support check.
      const payment = await inspectAudhdCheckoutSession(grant.checkoutSessionId);
      if (payment.verified && payment.paymentIntentId === grant.paymentIntentId && payment.priceId === grant.priceId) {
        grantId = await redeemAudhdRecoveryGrant(tokenHash);
      } else if (!payment.verified && (payment.reason === "payment_refunded" || payment.reason === "payment_disputed")) {
        await revokeAudhdRecoveryGrantsForPaymentIntent(grant.paymentIntentId);
      }
    }
  } catch {
    grantId = null;
  }
  if (!grantId) {
    return NextResponse.redirect(recoveryDestination(request, "invalid"), 303);
  }
  const response = NextResponse.redirect(recoveryDestination(request, "success"), 303);
  response.cookies.set(AUDHD_RECOVERY_COOKIE, issueAudhdBrowserUnlockToken(grantId), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: audhdBrowserUnlockMaxAge });
  return response;
}
