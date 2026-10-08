import { NextRequest, NextResponse } from "next/server";
import { ADHD_DELUXE_BOOK_ACCESS_COOKIE, bookAccessCookieOptions, hasBookAccessTokenSecret, issueBookAccessToken } from "../../_lib/bookAccess.server";
import { ADHD_DELUXE_BOOK, inspectAdhdDeluxeBookCheckoutSession, isStripeCheckoutSessionId } from "../../_lib/bookProducts.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectWithoutCaching(destination: URL) {
  const response = NextResponse.redirect(destination, 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const errorDestination = new URL("/adhd-deluxe/tack/fel", request.url);
  if (typeof sessionId !== "string" || !isStripeCheckoutSessionId(sessionId)) {
    return redirectWithoutCaching(errorDestination);
  }

  const verification = await inspectAdhdDeluxeBookCheckoutSession(sessionId);
  if (!verification.verified) {
    console.error("adhd_deluxe_checkout_verification_failed", {
      reason: verification.reason,
      observedPriceIds: verification.observedPriceIds,
    });
    return redirectWithoutCaching(errorDestination);
  }
  if (!hasBookAccessTokenSecret()) {
    console.error("adhd_deluxe_access_cookie_issue_failed", { reason: "access_token_secret_invalid" });
    return redirectWithoutCaching(errorDestination);
  }

  try {
    const response = redirectWithoutCaching(new URL("/adhd-deluxe/tack/klart", request.url));
    response.cookies.set(ADHD_DELUXE_BOOK_ACCESS_COOKIE, issueBookAccessToken(ADHD_DELUXE_BOOK.id), bookAccessCookieOptions());
    return response;
  } catch {
    console.error("adhd_deluxe_access_cookie_issue_failed", { reason: "access_token_issue_failed" });
    return redirectWithoutCaching(errorDestination);
  }
}
