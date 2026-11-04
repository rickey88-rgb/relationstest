import { NextRequest, NextResponse } from "next/server";
import { confirmNewsletterToken, unsubscribeNewsletterToken } from "../../../_lib/newsletter.server";
import { newsletterBody, newsletterHeaders, newsletterOriginAllowed } from "../../../_lib/newsletterHttp.server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!newsletterOriginAllowed(request)) return NextResponse.json({ ok: false }, { status: 403, headers: newsletterHeaders });
  const { action } = await context.params;
  if (action !== "confirm" && action !== "unsubscribe") return NextResponse.json({ ok: false }, { status: 404, headers: newsletterHeaders });
  let body: Record<string, unknown>;
  try { body = await newsletterBody(request); }
  catch { return NextResponse.json({ ok: false }, { status: 400, headers: newsletterHeaders }); }
  try {
    const token = body.token;
    const confirmation = action === "confirm" ? await confirmNewsletterToken(token) : null;
    const ok = action === "confirm" ? Boolean(confirmation) : await unsubscribeNewsletterToken(token);
    return NextResponse.json({ ok, ...(confirmation ?? {}) }, { status: ok ? 200 : 410, headers: newsletterHeaders });
  } catch {
    console.error(JSON.stringify({ event: "newsletter_action_unavailable", reason: "service_unavailable" }));
    return NextResponse.json({ ok: false }, { status: 503, headers: newsletterHeaders });
  }
}
