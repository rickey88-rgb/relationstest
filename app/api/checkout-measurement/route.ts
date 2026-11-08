import { handleCheckoutMeasurement } from "../../_lib/checkoutMeasurement.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = (status: number, reference: string | null = null) =>
    Response.json({ reference }, { status, headers: { "Cache-Control": "no-store" } });
  if (request.headers.get("origin") !== new URL(request.url).origin
      || !/^application\/json(?:;|$)/i.test(request.headers.get("content-type") ?? "")) return response(403);
  if (process.env.PAYMENT_LEDGER_V2_ENABLED !== "true") return response(404);
  const reader = request.body?.getReader();
  if (!reader) return response(400);
  try {
    const bytes = new Uint8Array(2048);
    let length = 0;
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      if (length + part.value.length > bytes.length) {
        await reader.cancel();
        return response(413);
      }
      bytes.set(part.value, length);
      length += part.value.length;
    }
    let body: unknown;
    try { body = JSON.parse(new TextDecoder().decode(bytes.subarray(0, length))); }
    catch { return response(400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return response(400);
    return response(200, await handleCheckoutMeasurement(body as Record<string, unknown>));
  } catch {
    console.error(JSON.stringify({ event: "checkout_measurement_store_failed" }));
    return response(503);
  } finally { reader.releaseLock(); }
}
