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
  <head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Din personliga AuDHD-analys</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #f7f5f2; color: #202124; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      main { min-height: 100vh; min-height: 100dvh; display: grid; place-items: center; padding: 24px 16px; }
      .card { width: 100%; max-width: 560px; padding: clamp(28px, 6vw, 48px); background: #fff; border: 1px solid #e5e2de; border-radius: 26px; box-shadow: 0 12px 36px rgba(32, 33, 36, .06); }
      .brand { margin: 0 0 32px; color: #27666a; font-size: 14px; font-weight: 700; letter-spacing: .04em; }
      .eyebrow { margin: 0 0 12px; color: #27666a; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
      h1 { margin: 0; font-family: Georgia, serif; font-size: clamp(32px, 7vw, 44px); line-height: 1.15; font-weight: 600; }
      .intro { margin: 20px 0 28px; color: #454b4a; font-size: 17px; line-height: 1.65; }
      button { width: 100%; min-height: 56px; padding: 14px 20px; border: 0; border-radius: 14px; background: #27666a; color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
      button:hover { background: #1f5357; }
      button:focus-visible { outline: 3px solid #202124; outline-offset: 4px; }
      .help { margin: 22px 0 0; color: #555c5b; font-size: 14px; line-height: 1.6; }
      .help a { color: #1f5357; text-underline-offset: 3px; }
    </style>
  </head>
  <body>
    <main>
      <div class="card">
      <p class="brand">Relationsvarning.se</p>
      <p class="eyebrow">Ditt resultat</p>
      <h1>Din personliga AuDHD-analys</h1>
      <p class="intro">Din analys är redo att öppnas. Tryck på knappen för att komma till ditt sparade resultat.</p>
      <form method="post" action="/api/audhd-recovery/redeem">
        <input type="hidden" name="token" value="${escapeHtmlAttribute(token)}">
        <button type="submit">Öppna mitt resultat</button>
      </form>
      <p class="help">Behöver du hjälp med att öppna ditt resultat? <a href="mailto:support@relationsvarning.se">Kontakta oss</a>.</p>
      </div>
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
