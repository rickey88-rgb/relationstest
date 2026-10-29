import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { ADHD_DELUXE_BOOK_ACCESS_COOKIE, verifyBookAccessToken } from "../../../../_lib/bookAccess.server";
import { ADHD_DELUXE_BOOK, adhdDeluxeBookR2Config } from "../../../../_lib/bookProducts.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function protectedResponse(message: string, status: number) {
  return new NextResponse(message, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" } });
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADHD_DELUXE_BOOK_ACCESS_COOKIE)?.value ?? null;
  if (!verifyBookAccessToken(token, ADHD_DELUXE_BOOK.id)) return protectedResponse("Åtkomst saknas.", 403);

  const file = request.nextUrl.searchParams.get("file") ?? "book";
  if (file !== "book" && file !== "worksheets" && file !== "print") return protectedResponse("Filen finns inte.", 404);
  const filename = file === "worksheets" ? ADHD_DELUXE_BOOK.worksheetsFilename : file === "print" ? ADHD_DELUXE_BOOK.printWorksheetsFilename : ADHD_DELUXE_BOOK.downloadFilename;

  try {
    const config = adhdDeluxeBookR2Config(file);
    const client = new S3Client({ region: "auto", endpoint: config.endpoint, forcePathStyle: true, credentials: config.credentials });
    const command = new GetObjectCommand({
      Bucket: config.bucket,
      Key: config.key,
      ResponseContentType: "application/pdf",
      ResponseContentDisposition: `attachment; filename="${filename}"`,
      ResponseCacheControl: "private, no-store",
    });
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 });
    const response = NextResponse.redirect(signedUrl, 302);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  } catch {
    return protectedResponse("Boken kunde inte förberedas för nedladdning. Försök igen om en stund.", 503);
  }
}
