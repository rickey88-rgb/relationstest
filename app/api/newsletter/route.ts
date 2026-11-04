import { NextRequest, NextResponse } from "next/server";
import { newsletterConfigured, subscribeNewsletter } from "../../_lib/newsletter.server";
import { newsletterBody, newsletterHeaders, newsletterOriginAllowed } from "../../_lib/newsletterHttp.server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json({ enabled: newsletterConfigured() }, { headers: newsletterHeaders }); }
export async function POST(request: NextRequest) {
  if (!newsletterOriginAllowed(request)) return NextResponse.json({ error: "Begäran kunde inte behandlas." }, { status: 403, headers: newsletterHeaders });
  try {
    const body = await newsletterBody(request);
    const result = await subscribeNewsletter(body, request.headers.get("x-real-ip") ?? "unknown");
    if (result === "invalid") return NextResponse.json({ error: "Kontrollera e-postadressen och godkänn nyhetsbrevet." }, { status: 400, headers: newsletterHeaders });
    if (result === "unavailable") return NextResponse.json({ error: "Registreringen är tillfälligt stängd. Försök igen senare." }, { status: 503, headers: newsletterHeaders });
    return NextResponse.json({ accepted: true }, { status: 202, headers: newsletterHeaders });
  } catch { return NextResponse.json({ error: "Kontrollera formuläret." }, { status: 400, headers: newsletterHeaders }); }
}
