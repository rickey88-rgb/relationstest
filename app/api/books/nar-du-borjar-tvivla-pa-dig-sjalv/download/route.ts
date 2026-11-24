import { STEINLER_BOOK as book } from "../../../../_lib/steinlerBook";
import { bookAccount, guestEditionAvailable, guestBookCookieFrom, readGuestBookPdf, readOwnedGuestEditionPdf, steinlerEdition } from "../../../../_lib/overthinkingBook.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

export async function GET(request: Request) {
  if (!guestEditionAvailable(steinlerEdition)) return new Response(null, { status: 503, headers });
  try {
    let bytes;
    if (new URL(request.url).searchParams.get("guest") === "1") {
      const guest = guestBookCookieFrom(request, steinlerEdition);
      if (!guest) return new Response(null, { status: 401, headers });
      bytes = await readGuestBookPdf(guest, steinlerEdition);
    } else {
      const account = await bookAccount(request);
      if (!account) return new Response(null, { status: 401, headers });
      bytes = await readOwnedGuestEditionPdf(account, steinlerEdition);
    }
    if (!bytes) return new Response(null, { status: 403, headers });
    return new Response(bytes, { headers: {
      ...headers,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${book.filename}"`,
      "Content-Length": String(bytes.byteLength),
    } });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}
