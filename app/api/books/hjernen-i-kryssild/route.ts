import { NextRequest, NextResponse } from "next/server";
import { GET as restoreCheckout } from "../../audhd-checkout/restore/route";
import { GET as restoreRecovery } from "../../audhd-recovery/restore/route";
import { bookAccessCookieOptions } from "../../../_lib/bookAccess.server";
import { bookDeliveryHeaders } from "../../../_lib/bookDelivery.server";
import { parseBookAttribution } from "../../../_lib/liteAutismProof.server";
import { norwayStripeEnvironment } from "../../../_lib/norwayLaunch.server";
import { norwegianBookAmount } from "../../../_lib/norwegianBook";
import { bookCheckoutEnabled, guestBookCookieFrom, norwegianBookEdition, startGuestBookCheckout } from "../../../_lib/overthinkingBook.server";
import { norwegian } from "../../../_content/market";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: bookDeliveryHeaders });
}

export async function POST(request: NextRequest) {
  if (!bookCheckoutEnabled(norwegianBookEdition)) return json({ error: "unavailable" }, 503);
  try {
    if (request.headers.get("origin") !== norwayStripeEnvironment().origin) return json({ error: "origin" }, 403);
    const text = await request.text();
    if (text.length > 512) return json({ error: "invalid" }, 400);
    const data = JSON.parse(text);
    let offerPrice: string | undefined;
    if (data?.offer === true) {
      offerPrice = process.env.NORWAY_BOOK_OFFER_PRICE_ID?.trim();
      if (norwegianBookAmount(offerPrice) !== norwegian.bookOffer * 100) return json({ error: "unavailable" }, 503);
      const proofRequest = new NextRequest(new URL("/api/audhd-checkout/restore?market=no", request.url), {
        headers: { cookie: request.headers.get("cookie") ?? "" },
      });
      const direct = await restoreCheckout(proofRequest);
      if (!direct.ok && !(await restoreRecovery(proofRequest)).ok) return json({ error: "offer" }, 403);
    }
    const guest = guestBookCookieFrom(request, norwegianBookEdition);
    const { result, cookie } = await startGuestBookCheckout(guest, norwegianBookEdition, parseBookAttribution(data?.analytics), offerPrice);
    const response = json(result);
    if (cookie) response.cookies.set(norwegianBookEdition.cookie, cookie, bookAccessCookieOptions());
    return response;
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
