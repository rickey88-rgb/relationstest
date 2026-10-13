import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { hashAudhdRecoveryToken, issueAudhdRecoveryToken } from "../../../_lib/audhdRecovery.server";
import { createAudhdRecoveryGrant } from "../../../_lib/audhdRecoveryDb.server";
import { inspectAudhdCheckoutSession } from "../../../_lib/audhdRecoveryPayment.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ISSUER_SECRET_MIN_LENGTH = 32;
const RECOVERY_ORIGIN = "https://www.relationsvarning.se";

function issuerSecret() {
  const value = process.env.AUDHD_RECOVERY_ISSUER_SECRET ?? "";
  return value.length >= ISSUER_SECRET_MIN_LENGTH ? value : "";
}

function isAuthorized(request: NextRequest) {
  const expected = issuerSecret();
  const authorization = request.headers.get("authorization");
  if (!expected || !authorization?.startsWith("Bearer ")) return false;

  const provided = Buffer.from(authorization.slice("Bearer ".length));
  const expectedBuffer = Buffer.from(expected);
  return provided.length === expectedBuffer.length && timingSafeEqual(provided, expectedBuffer);
}

function response(body: Record<string, string>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return response({ error: "Not found." }, 404);

  try {
    const body: unknown = await request.json();
    const checkoutSessionId = body && typeof body === "object" && !Array.isArray(body) && typeof (body as { checkoutSessionId?: unknown }).checkoutSessionId === "string"
      ? (body as { checkoutSessionId: string }).checkoutSessionId.trim()
      : "";
    const verification = await inspectAudhdCheckoutSession(checkoutSessionId);
    if (!verification.verified) return response({ error: "Payment could not be verified." }, 422);

    const token = issueAudhdRecoveryToken();
    await createAudhdRecoveryGrant({
      tokenHash: hashAudhdRecoveryToken(token),
      checkoutSessionId: verification.checkoutSessionId,
      paymentIntentId: verification.paymentIntentId,
      priceId: verification.priceId,
    });
    const recoveryUrl = new URL("/api/audhd-recovery/redeem", RECOVERY_ORIGIN);
    recoveryUrl.searchParams.set("token", token);
    return response({ recoveryUrl: recoveryUrl.toString() }, 200);
  } catch {
    // Do not reveal recovery-secret configuration or signing details.
    return response({ error: "Recovery service unavailable." }, 503);
  }
}
