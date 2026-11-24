import type { NextRequest } from "next/server";
import { bookPackageDownload } from "../../../../_lib/bookDelivery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return bookPackageDownload(request, "audhd-bok", "book");
}
