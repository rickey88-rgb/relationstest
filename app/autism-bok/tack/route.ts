import { NextRequest, NextResponse } from "next/server";
import { AUTISM_BOOK_ACCESS_COOKIE, bookAccessCookieOptions, issueBookAccessToken } from "../../_lib/bookAccess.server";
import { AUTISM_BOOK, isStripeCheckoutSessionId, verifyAutismBookCheckoutSession } from "../../_lib/bookProducts.server";

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
  const errorDestination = new URL("/autism-bok/tack/fel", request.url);
  if (typeof sessionId !== "string" || !isStripeCheckoutSessionId(sessionId)) {
    return redirectWithoutCaching(errorDestination);
  }

  if (!await verifyAutismBookCheckoutSession(sessionId)) {
    return redirectWithoutCaching(errorDestination);
  }

  try {
    const response = redirectWithoutCaching(new URL("/autism-bok/tack/klart", request.url));
    response.cookies.set(AUTISM_BOOK_ACCESS_COOKIE, issueBookAccessToken(AUTISM_BOOK.id), bookAccessCookieOptions());
    return response;
  } catch {
    return redirectWithoutCaching(errorDestination);
  }
}
