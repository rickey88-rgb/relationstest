import { verifyBookEmailLink } from "../../../../_lib/liteAutismProof.server";
import { bookAccount, guestEditionAvailable, guestEditionOwned, guestBookCookieFrom, guestBookPurchaseReady, liteAutismEdition, liteAutismEmailPurchaseReady, signLiteAutismDownload } from "../../../../_lib/overthinkingBook.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

export async function GET(request: Request) {
  if (!guestEditionAvailable(liteAutismEdition)) return new Response(null, { status: 503, headers });
  const path = new URL(request.url).searchParams;
  try {
    if (path.has("email")) {
      const sessionId = verifyBookEmailLink(path.get("email"));
      if (!sessionId || !await liteAutismEmailPurchaseReady(sessionId)) return new Response(null, { status: 403, headers });
    } else if (path.get("guest") === "1") {
      const proof = guestBookCookieFrom(request, liteAutismEdition);
      if (!proof) return new Response(null, { status: 401, headers });
      if (!await guestBookPurchaseReady(proof, liteAutismEdition)) return new Response(null, { status: 403, headers });
    } else {
      const account = await bookAccount(request);
      if (!account) return new Response(null, { status: 401, headers });
      if (!await guestEditionOwned(account, liteAutismEdition)) return new Response(null, { status: 403, headers });
      return Response.json({ url: await signLiteAutismDownload() }, { headers });
    }
    return new Response(null, { status: 303, headers: { ...headers, Location: await signLiteAutismDownload() } });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}
