import { randomBytes, timingSafeEqual } from "node:crypto";
import { accountPortalEnabled } from "../accountGate.server";
import { runCleanupScope } from "../accountCleanupScope.server";
import { adapter, registeredAdapters, flags, consentVersion } from "./adapter";
import { paymentConfig, stripeClient } from "./payment.server";
import * as store from "./store.server";
import * as service from "./service.server";
import { cleanup, health } from "./operations.server";
import { describeAnswers } from "./answerDescriptions";
import { directIdentity } from "./directAuth.server";
import { guestProcessingConsentVersion } from "./consent";
import { directStripeWebhook } from "./directWebhook.server";

const defaults = { adapter, registeredAdapters, flags, paymentConfig, stripeClient, store, service, cleanup, health, describeAnswers, directIdentity };
const neutral = { error: "Åtgärden kunde inte genomföras. Försök igen från Mina sidor." };
async function boundedJson(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new Error("Invalid request");
  const reader = request.body?.getReader(); if (!reader) throw new Error("Invalid request");
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    for (;;) { const part = await reader.read(); if (part.done) break; length += part.value.length; if (length > 16384) { await reader.cancel(); throw new Error("Invalid request"); } chunks.push(part.value); }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let position = 0;
  for (const chunk of chunks) { bytes.set(chunk, position); position += chunk.length; }
  const body: unknown = JSON.parse(new TextDecoder().decode(bytes));
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid request");
  return body as Record<string, unknown>;
}
function cronAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET ?? "";
  const actual = Buffer.from(request.headers.get("authorization") ?? ""), expected = Buffer.from("Bearer " + secret);
  return secret.length >= 32 && actual.length === expected.length && timingSafeEqual(actual, expected);
}
/** Standard Web Request/Response only. No Next imports, response proxy or sensitive logging. */
export function directCustomerHandler(overrides: Partial<typeof defaults> = {}) {
  const d = { ...defaults, ...overrides };
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin");
    const allowed = process.env.TEST_ACCOUNTS_SITE_ORIGIN ?? "https://www.relationsvarning.se";
    const cors: Record<string, string> = origin === allowed ? { "Access-Control-Allow-Origin": allowed, Vary: "Origin" } : {};
    const respond = (body: unknown, status = 200) => Response.json(body, { status, headers: {
      ...cors, "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff",
    } });
    if (process.env.SB_REGION && process.env.SB_REGION !== "eu-central-1") return respond(neutral, 503);
    if (new URL(request.url).pathname.endsWith("/stripe-webhook")) {
      try { return await directStripeWebhook(request, d.stripeClient()); } catch { return respond(neutral, 503); }
    }
    // Cron authority never opens customer APIs and carries no customer payload.
    const jobPath = new URL(request.url).pathname;
    if (jobPath.endsWith("/cleanup") || jobPath.endsWith("/health")) {
      if (request.method !== "POST" || !cronAuthorized(request)) return respond(neutral, 404);
      try {
        if (jobPath.endsWith("/health")) { const healthy = await runCleanupScope("tests", () => d.health()); return respond({ healthy }, healthy ? 200 : 503); }
        await runCleanupScope("tests", () => d.cleanup()); return respond({ ok: true });
      }
      catch { return respond(neutral, 503); }
    }
    if (origin !== allowed) return respond(neutral, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: {
      ...cors, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "authorization, content-type, x-test-possession, x-region",
      "Access-Control-Max-Age": "600",
    } });
    if (request.method !== "POST") return respond(neutral, 405);
    if (process.env.DIRECT_CUSTOMER_TESTS_ENABLED !== "true" || !accountPortalEnabled()) return respond(neutral, 503);
    try {
      const body = await boundedJson(request);
      const action = body.action;
      if (action === "capabilities") return respond({ tests: d.registeredAdapters().map(model => ({
        product: model.product, slug: model.slug, title: model.title, questionVersion: model.questionVersion, reportVersion: model.reportVersion,
        checkout: d.flags(model.product).checkout && d.flags(model.product).save && d.flags(model.product).read,
      })), consentVersion });
      if (!["checkout", "guest", "save", "list", "open", "delete"].includes(String(action))) return respond(neutral, 404);
      // Non-guest actions verify Auth BEFORE looking at IDs, data or purchase ownership.
      const identity = action === "checkout" || action === "guest" ? null : await d.directIdentity(request.headers.get("authorization"));
      if (action !== "checkout" && action !== "guest" && !identity) return respond(neutral, 401);
      if (action === "list") { d.service.active(); return respond({ purchases: await d.store.list(identity!.userId) }); }
      const product = typeof body.product === "string" ? body.product : "";
      const model = d.adapter(product);
      const enabled = d.flags(product);
      if (action === "checkout") {
        if (!enabled.checkout || !enabled.save || !enabled.read) return respond(neutral, 503);
        if (body.consent !== guestProcessingConsentVersion) return respond(neutral, 400);
        if (!await d.health()) return respond(neutral, 503); // do not sell a new account-saving flow during a known cleanup outage
        model.parse(body.payload); // complete versioned answers; paid/email/owner fields are not purchase proof
        const config = d.paymentConfig(product), stripe = d.stripeClient();
        const price = await stripe.prices.retrieve(config.price);
        if (!price.livemode || !price.active || price.type !== "one_time" || price.unit_amount !== model.amount || price.currency !== "sek") throw new Error("Price unavailable");
        const supplied = request.headers.get("x-test-possession") ?? "";
        const secret = /^[A-Za-z0-9_-]{43}$/.test(supplied) ? supplied : randomBytes(32).toString("base64url");
        const id = await d.store.createAttempt(product, body.payload, secret, config.price, guestProcessingConsentVersion);
        // Identifiers are in a fragment: the Vercel HTTP request never receives them.
        const session = await stripe.checkout.sessions.create({ mode: "payment", client_reference_id: "ta:" + id,
          metadata: { rv_flow: "direct_customer_v1" }, payment_intent_data: { metadata: { rv_flow: "direct_customer_v1" } },
          line_items: [{ price: config.price, quantity: 1 }], allow_promotion_codes: false,
          success_url: allowed + "/mina-sidor#attempt=" + id, cancel_url: allowed + (model.testPath ?? "/" + model.slug + "-test/test"),
          expires_at: Math.floor(Date.now() / 1000) + 1800,
        }, { idempotencyKey: "test-account:" + id });
        if (!session.livemode || !session.url || new URL(session.url).origin !== "https://checkout.stripe.com") throw new Error("Checkout unavailable");
        await d.store.bindCheckout(id, session.id);
        return respond({ id, secret, url: session.url }, 201);
      }
      const id = typeof body.id === "string" ? body.id : "";
      if (!d.store.validId(id)) return respond(neutral, 404);
      if (action === "delete") { await d.service.remove(id, identity!.userId); return respond({ deleted: true }); }
      if (action === "save") {
        await d.service.save(id, request.headers.get("x-test-possession") ?? "", identity!.userId, typeof body.consent === "string" ? body.consent : "", product);
        return respond({ saved: true });
      }
      if (action === "guest" && !enabled.read) return respond(neutral, 503);
      const entry = action === "guest"
        ? await d.service.guestForProduct(id, request.headers.get("x-test-possession") ?? "", product)
        : await d.service.openEntryForProduct(id, identity!.userId, product);
      const data = entry.data as { answers: number[] };
      return respond({ product, title: model.title, result: entry.result, answers: d.describeAnswers(product, data.answers), expiresAt: entry.row.expires_at });
    } catch {
      // No provider messages, bodies, tokens, answers or identifiers in logs or error responses.
      return respond(neutral, 503);
    }
  };
}
