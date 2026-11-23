import { NextResponse } from "next/server";
import { applicationOrigin } from "../../../_lib/authConfig.server";
import { bookAccount, bookCheckoutEnabled, bookLibraryEnabled, bookLibraryState, guestBookCookie, guestBookCookieFrom, startBookCheckout, startGuestBookCheckout } from "../../../_lib/overthinkingBook.server";
import { bookAccessCookieOptions } from "../../../_lib/bookAccess.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers });
}

export async function GET(request: Request) {
  if (!bookLibraryEnabled()) return json({ error: "unavailable" }, 503);
  try {
    const userId = await bookAccount(request);
    if (!userId) return json({ error: "sign_in" }, 401);
    return json({ state: await bookLibraryState(userId) });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}

export async function POST(request: Request) {
  if (!bookCheckoutEnabled()) return json({ error: "unavailable" }, 503);
  try {
    if (request.headers.get("origin") !== applicationOrigin()) return json({ error: "origin" }, 403);
    const userId = await bookAccount(request);
    if (userId) return json(await startBookCheckout(userId));
    if (new URL(request.url).searchParams.get("guest") !== "1") return json({ error: "sign_in" }, 401);
    const { result, cookie } = await startGuestBookCheckout(guestBookCookieFrom(request));
    const response = json(result);
    if (cookie) response.cookies.set(guestBookCookie, cookie, bookAccessCookieOptions());
    return response;
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
