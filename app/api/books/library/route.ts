import { NextResponse } from "next/server";
import { LEGACY_BOOKS } from "../../../_lib/bookCatalog";
import { ownedLegacyBooks, signedLegacyBookDownload } from "../../../_lib/legacyBookLibrary.server";
import { bookAccount } from "../../../_lib/overthinkingBook.server";

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
  try {
    const account = await bookAccount(request);
    if (!account) return json({ error: "sign_in" }, 401);
    const requested = new URL(request.url).searchParams.get("book");
    if (requested === null) return json({ owned: Array.from(await ownedLegacyBooks(account.verifiedEmail)) });
    const book = LEGACY_BOOKS.find(entry => entry.id === requested);
    if (!book) return json({ error: "not_found" }, 404);
    const owned = await ownedLegacyBooks(account.verifiedEmail, book.id);
    if (!owned.has(book.id)) return json({ error: "not_owned" }, 403);
    return json({ url: await signedLegacyBookDownload(book.id) });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
