import { receiveNpfDirectPurchase } from "../../../_lib/testAccounts/npfPurchaseAnalytics.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const reply = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });
  if (!request.headers.has("x-rv-signature")) return reply(400);
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const gaSecret = process.env.GA4_MEASUREMENT_PROTOCOL_API_SECRET?.trim();
  if (!signingSecret || !gaSecret) return reply(503);
  try {
    return reply(await receiveNpfDirectPurchase(request, signingSecret, gaSecret) ? 204 : 400);
  } catch {
    return reply(503);
  }
}
