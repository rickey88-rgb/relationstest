import { norwegianReportForSale, norwayStripeEnvironment } from "../../../_lib/norwayLaunch.server";
import { checkoutMarket, marketCookie } from "../../../_content/market";
import { NextRequest, NextResponse } from "next/server";
import { AUDHD_CHECKOUT_ATTEMPT_COOKIE, audhdCheckoutAttemptCookieMaxAge, encryptAudhdCheckoutAnswers, hashAudhdCheckoutBrowserSecret, issueAudhdCheckoutBrowserSecret, parseAudhdCheckoutAnswers } from "../../../_lib/audhdCheckoutAttempt.server";
import { createAudhdCheckoutAttempt } from "../../../_lib/audhdCheckoutAttemptsDb.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = process.env.NODE_ENV === "production"
    ? new Set(["https://www.relationsvarning.se"])
    : new Set(["http://localhost:3000", "http://127.0.0.1:3000"]);
  return allowed.has(origin);
}

function response(body: Record<string, string>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff" },
  });
}

/**
 * Stage 1 only: persists an encrypted draft and browser-bound secret. It does
 * not create a Stripe Session, alter a Payment Link, or grant report access.
 */
export async function POST(request: NextRequest) {
  const market = checkoutMarket(request);
  if (market === "no") {
    if (!norwegianReportForSale()) return response({ error: "Betaling er midlertidig utilgjengelig." }, 503);
    try { if (request.headers.get("origin") !== norwayStripeEnvironment().origin) return response({ error: "Ugyldig forespørsel." }, 404); }
    catch { return response({ error: "Betaling er midlertidig utilgjengelig." }, 503); }
  } else if (!sameOriginRequest(request)) return response({ error: "Not found." }, 404);
  try {
    const payload: unknown = await request.json();
    if (market === "no" && (!payload || typeof payload !== "object" || (payload as { processingConsent?: unknown }).processingConsent !== true)) return response({ error: "Samtykke kreves for levering av rapporten." }, 400);
    const answers = parseAudhdCheckoutAnswers(payload);
    if (!answers) return response({ error: "Invalid test answers." }, 400);

    const browserSecret = issueAudhdCheckoutBrowserSecret();
    const attempt = await createAudhdCheckoutAttempt({
      ...encryptAudhdCheckoutAnswers(answers),
      browserSecretHash: hashAudhdCheckoutBrowserSecret(browserSecret),
      reportVersion: answers.reportVersion,
    });
    const result = response({ attemptId: attempt.id }, 201);
    result.cookies.set(marketCookie(AUDHD_CHECKOUT_ATTEMPT_COOKIE, market), browserSecret, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      // The same HttpOnly secret is required by the next server-only Checkout
      // start and return routes; it is never exposed to page JavaScript.
      path: "/",
      maxAge: audhdCheckoutAttemptCookieMaxAge,
    });
    return result;
  } catch {
    return response({ error: "Checkout preparation is unavailable." }, 503);
  }
}
