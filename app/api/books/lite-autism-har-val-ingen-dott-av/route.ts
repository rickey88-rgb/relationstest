import { NextResponse } from "next/server";
import { applicationOrigin } from "../../../_lib/authConfig.server";
import { bookAccessCookieOptions } from "../../../_lib/bookAccess.server";
import { LITE_AUTISM_ANALYSIS_PRICE, liteAutismBookAmount } from "../../../_lib/liteAutismBook";
import { parseBookAttribution } from "../../../_lib/liteAutismProof.server";
import { bookAccount, bookCheckoutEnabled, guestEditionAvailable, guestEditionOwned, guestBookCookieFrom, startGuestBookCheckout, liteAutismEdition } from "../../../_lib/overthinkingBook.server";

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
  if (!guestEditionAvailable(liteAutismEdition)) return json({ state: "none" });
  try {
    const account = await bookAccount(request);
    if (!account) return json({ error: "sign_in" }, 401);
    return json({ state: await guestEditionOwned(account, liteAutismEdition) ? "ready" : "none" });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}

export async function POST(request: Request) {
  if (!bookCheckoutEnabled(liteAutismEdition)) return json({ error: "unavailable" }, 503);
  try {
    if (request.headers.get("origin") !== applicationOrigin()) return json({ error: "origin" }, 403);
    const body = await request.text();
    if (body.length > 512) return json({ error: "invalid" }, 400);
    const attribution = body ? parseBookAttribution(JSON.parse(body)) : null;
    const analysisOffer = new URL(request.url).searchParams.get("offer") === "analysis";
    const offerPrice = analysisOffer ? process.env.NEXT_PUBLIC_LITE_AUTISM_BOOK_OFFER_PRICE_ID?.trim() : undefined;
    if (analysisOffer && (!offerPrice || liteAutismBookAmount(offerPrice) !== LITE_AUTISM_ANALYSIS_PRICE * 100)) {
      return json({ error: "unavailable" }, 503);
    }
    const guest = guestBookCookieFrom(request, liteAutismEdition);
    const { result, cookie } = await startGuestBookCheckout(guest, liteAutismEdition, attribution, offerPrice);
    const response = json(result);
    if (cookie) response.cookies.set(liteAutismEdition.cookie, cookie, bookAccessCookieOptions());
    return response;
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
