import { randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
import { accountLaunchUnavailable, accountPortalEnabled } from "../accountLaunch.server";
import { accountIdentity, accountResponse, accountRedirect, sameAccountOrigin, readAccountForm } from "../accountHttp.server";
import { adapter, assertFlag, flags } from "./adapter";
import { browserCookie, siteOrigin } from "./http.server";
import { paymentConfig, stripeClient } from "./payment.server";
import { bindCheckout, createAttempt } from "./store.server";
import { prepareLegacyImport, remove, save } from "./service.server";

const defaults = { accountIdentity, accountResponse, accountRedirect, sameAccountOrigin, readAccountForm, adapter, assertFlag, flags, paymentConfig, stripeClient, bindCheckout, createAttempt, prepareLegacyImport, remove, save };
export function testAccountHandlers(product: string, slug: string, overrides: Partial<typeof defaults> = {}) {
  const { accountIdentity, accountResponse, accountRedirect, sameAccountOrigin, readAccountForm, adapter, assertFlag, flags, paymentConfig, stripeClient, bindCheckout, createAttempt, prepareLegacyImport, remove, save } = { ...defaults, ...overrides };
type Context = { params: Promise<{ action: string }> };
async function GET(_request: NextRequest, { params }: Context) {
  if (!accountPortalEnabled()) return accountLaunchUnavailable();
  if ((await params).action !== "capabilities") return accountResponse({ error: "Not found" }, 404);
  return accountResponse({ checkout: flags(product).checkout }, 200);
}
async function POST(request: NextRequest, { params }: Context) {
  if (!accountPortalEnabled()) return accountLaunchUnavailable();
  if (!sameAccountOrigin(request)) return accountResponse({ error: "Forbidden" }, 403);
  try {
    const { action } = await params;
    if (!["checkout", "save", "delete", "legacy-import"].includes(action)) return accountResponse({ error: "Not found" }, 404);
    if (action === "checkout") assertFlag(product, "checkout");
    const form = await readAccountForm(request);
    if (!form) return accountResponse({ error: "Invalid request" }, 400);
    if (action === "checkout") {
      const origin = siteOrigin(request), model = adapter(product), config = paymentConfig(model.product);
      const input: unknown = JSON.parse(form.get("payload") ?? "null"); model.parse(input);
      const stripe = stripeClient();
      const price = await stripe.prices.retrieve(config.price);
      if (!price.active || !price.livemode || price.type !== "one_time" || price.unit_amount !== model.amount || price.currency !== "sek") throw new Error("Incorrect checkout price");
      const cookie = request.cookies.get(browserCookie)?.value;
      const secret = cookie && /^[A-Za-z0-9_-]{43}$/.test(cookie) ? cookie : randomBytes(32).toString("base64url");
      const id = await createAttempt(model.product, input, secret, config.price);
      const session = await stripe.checkout.sessions.create({ mode: "payment", client_reference_id: `ta:${id}`,
        line_items: [{ price: config.price, quantity: 1 }], allow_promotion_codes: false,
        success_url: `${origin}/mina-sidor/gast/${slug}/${id}`, cancel_url: `${origin}${model.testPath ?? `/${slug}-test/test`}`,
        expires_at: Math.floor(Date.now() / 1000) + 1800,
      }, { idempotencyKey: `test-account:${id}` });
      if (!session.livemode || !session.url || new URL(session.url).origin !== "https://checkout.stripe.com") throw new Error("Checkout unavailable");
      await bindCheckout(id, session.id);
      const response = accountResponse({ url: session.url }, 200);
      response.cookies.set(browserCookie, secret, { httpOnly: true, secure: request.nextUrl.protocol === "https:",
        sameSite: "lax", path: "/", maxAge: 7 * 86400 });
      return response;
    }
    const identity = await accountIdentity();
    if (identity.kind !== "authenticated") return accountResponse({ error: "Login required" }, 401);
    if (action === "legacy-import") { if (product !== "adhd_test") throw new Error("Legacy import unavailable"); prepareLegacyImport(Object.fromEntries(form)); }
    const id = form.get("id") ?? "";
    if (action === "save") await save(id, request.cookies.get(browserCookie)?.value ?? "", identity.userId, form.get("consent") ?? "", product);
    else if (action === "delete") await remove(id, identity.userId);
    return accountRedirect(request, "/mina-sidor/tester?status=done");
  } catch {
    // Neither answer content, identifiers nor provider exception messages belong in logs/responses.
    return accountResponse({ error: "Åtgärden kunde inte genomföras. Dina befintliga köp påverkas inte. Försök igen från analysen eller Mina sidor." }, 503);
  }
}

  return { GET, POST };
}
