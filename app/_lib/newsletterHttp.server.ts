import { NextRequest } from "next/server";
export const newsletterHeaders = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff" };
export function newsletterOriginAllowed(request: NextRequest) {
  const origin = request.headers.get("origin");
  return origin === "https://www.relationsvarning.se" || (process.env.NODE_ENV !== "production" && origin === request.nextUrl.origin);
}
export async function newsletterBody(request: NextRequest): Promise<Record<string, unknown>> {
  if (!request.body || Number(request.headers.get("content-length") ?? 0) > 2048) throw new Error("Invalid request");
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 2048) { await reader.cancel(); throw new Error("Invalid request"); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  const body: unknown = JSON.parse(Buffer.concat(parts).toString("utf8"));
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid request");
  return body as Record<string, unknown>;
}
