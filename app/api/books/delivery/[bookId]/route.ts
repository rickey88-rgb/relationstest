import { bookPackageDownload } from "../../../../_lib/bookDelivery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  return bookPackageDownload(request, (await params).bookId);
}
