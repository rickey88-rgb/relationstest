import { NextResponse } from "next/server";
import { applicationOrigin } from "../../../_lib/authConfig.server";
import { bookAccount, bookCheckoutEnabled, guestEditionAvailable, guestEditionOwned, guestBookCookieFrom, startGuestBookCheckout, steinlerEdition } from "../../../_lib/overthinkingBook.server";
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
  if (!guestEditionAvailable(steinlerEdition)) return json({ state: "none" });
  try {
    const account = await bookAccount(request);
    if (!account) return json({ error: "sign_in" }, 401);
    return json({ state: await guestEditionOwned(account, steinlerEdition) ? "ready" : "none" });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}

export async function POST(request: Request) {
  if (!bookCheckoutEnabled(steinlerEdition)) return json({ error: "unavailable" }, 503);
  try {
    if (request.headers.get("origin") !== applicationOrigin()) return json({ error: "origin" }, 403);
    const { result, cookie } = await startGuestBookCheckout(guestBookCookieFrom(request, steinlerEdition), steinlerEdition);
    const response = json(result);
    if (cookie) response.cookies.set(steinlerEdition.cookie, cookie, bookAccessCookieOptions());
    return response;
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
