/* eslint-disable @typescript-eslint/no-require-imports -- isolated PostgreSQL and signed Stripe fixtures. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { PGlite } = require("@electric-sql/pglite");
const Stripe = require("stripe");
const loadSource = require("../autism-test/test/test-loader.cjs");
const pg = new PGlite();
const migrations = path.join(__dirname, "../../supabase/migrations");
const key = "whsec_isolated_checkout_test";
const signer = new Stripe("sk_test_synthetic_checkout_never_sent");
const now = Math.floor(Date.now() / 1000) - 1;
const origin = "https://www.relationsvarning.se";

function sql(client) {
  const query = async (parts, ...values) => {
    const text = parts.reduce((out, part, index) => out + (index ? "$" + index : "") + part, "");
    return (await client.query(text, values)).rows;
  };
  query.json = JSON.stringify;
  return query;
}
const db = sql(pg);
let failLedgerCommit = false;
db.begin = work => pg.transaction(async client => {
  const result = await work(sql(client));
  if (failLedgerCommit) {
    failLedgerCommit = false;
    throw Error("synthetic database interruption before commit");
  }
  return result;
});
const line = (price, amount) => ({ price: { id: price, product: "prod_synthetic", unit_amount: amount }, quantity: 1, amount_subtotal: amount, amount_discount: 0 });
const variants = Object.entries({
  adhd_test: 3900, autism_test: 3900, audhd_test: 7900, iq_test: 7900, screening_test: 3900,
  hsp_test: 4900, ptsd_test: 3900, angest_test: 3900, attachment_test: 3900, codependency_test: 3900,
  gaslighting_test: 3900, trauma_bond_test: 3900, narcissist_partner: 3900, narcissism_selftest: 3900,
  psychological_abuse_test: 3900, audhd_bok: 14900, autism_bok: 9900, adhd_deluxe: 9900,
});
if (fs.existsSync(path.join(__dirname, "../persona/page.tsx"))) variants.push(["persona_test", 7900]);
const fixtures = new Map();
const refunds = new Map();
const charges = new Map();
class StripeFixture {
  webhooks = signer.webhooks;
  checkout = { sessions: {
    retrieve: async id => fixtures.get(id).session,
    listLineItems: async id => ({ data: fixtures.get(id).lines, has_more: false }),
  } };
  paymentIntents = { retrieve: async id => ({ metadata: id.includes("direct") ? { rv_flow: "direct_customer_v1" } : {} }) };
  charges = { retrieve: async id => charges.get(id) };
  refunds = {
    retrieve: async id => refunds.get(id),
    list: async function* ({ charge }) { for (const refund of refunds.values()) if (refund.charge === charge) yield refund; },
  };
}
Object.assign(process.env, {
  DATABASE_URL: "postgres://synthetic.invalid/isolated",
  PAYMENT_LEDGER_V2_ENABLED: "true", STRIPE_WEBHOOK_SECRET: key,
  DIRECT_CUSTOMER_TESTS_WEBHOOK_ENABLED: "true",
  STRIPE_SECRET_KEY: "sk_test_synthetic_checkout_never_sent",
  GA4_MEASUREMENT_PROTOCOL_API_SECRET: "synthetic-never-sent",
  GA4_PURCHASE_ALLOWED_PRODUCTS: variants.map(([product]) => product).join(","),
  STRIPE_PAYMENT_PRODUCT_MAP_JSON: JSON.stringify(Object.fromEntries(variants.map(([product]) => [product, { priceIds: ["price_" + product] }]))),
});
delete process.env.TEST_ACCOUNTS_GUEST_RECOVERY_ENABLED;

const load = loadSource({ postgres: { default: () => db }, stripe: { default: StripeFixture } });
const resolve = (name) => path.resolve(__dirname, name);
const gateway = load(resolve("testAccounts/directWebhook.server.ts")).directStripeWebhook;
const route = load(resolve("../api/stripe/webhook/route.ts")).POST;
const capture = load(resolve("../api/checkout-measurement/route.ts")).POST;
const legacyCron = load(resolve("../api/cron/audhd-checkout-cleanup/route.ts")).GET;
const retryCron = load(resolve("../api/cron/stripe-measurement/route.ts")).GET;
process.env.CRON_SECRET = "synthetic_cron_secret";
function cronRequest(authorized = true) {
  return new Request(origin, { headers: authorized ? { authorization: "Bearer synthetic_cron_secret" } : {} });
}
const sends = [];
let failTransport = false;
global.fetch = async (url, request) => {
  assert.match(url, /^https:\/\/www\.google-analytics\.com\/mp\/collect\?/);
  sends.push(JSON.parse(request.body));
  return { ok: !failTransport };
};

function event(type, id, object, created = now, livemode = true) {
  return { id: "evt_" + id, type, created, livemode, data: { object } };
}
function request(url, input, valid = true) {
  const body = JSON.stringify(input);
  const signature = valid ? signer.webhooks.generateTestHeaderString({ payload: body, secret: key }) : "invalid";
  return new Request(url, { method: "POST", headers: { "stripe-signature": signature }, body });
}
async function post(input, valid = true) {
  return (await gateway(request("https://synthetic.supabase.co/functions/v1/customer-tests/stripe-webhook", input, valid), new StripeFixture(), async (_url, init) =>
    route(new Request(origin + "/api/stripe/webhook", init)))).status;
}
async function measurement(action, browserKey, fields, source = origin) {
  const response = await capture(new Request(origin + "/api/checkout-measurement", {
    method: "POST", headers: { origin: source, "content-type": "application/json" },
    body: JSON.stringify({ action, browserKey, ...fields }),
  }));
  return { status: response.status, ...(await response.json()) };
}
function captureBody(product) {
  return { consentVersion: "checkout-statistics-v1", product, clientId: "12345.12345", sessionId: String(now - 900),
    firstLanding: "/", lastLanding: "/adhd-test", firstReferrer: "https://example.com", lastReferrer: "https://example.org/path?secret=x",
    campaign: { utm_source: "newsletter", utm_campaign: "november", utm_term: "removed", gclid: "removed" },
    answers: [1, 2], email: "never@persist.invalid" };
}
function session(product, amount, { direct = true, reference, suffix = product, livemode = true, paid = true } = {}) {
  const id = "cs_" + (livemode ? "live_" : "test_") + suffix;
  const payment_intent = "pi_" + (direct ? "direct_" : "legacy_") + suffix;
  const object = { id, payment_intent, livemode, mode: "payment", status: paid ? "complete" : "open", payment_status: paid ? "paid" : "unpaid",
    amount_total: amount, currency: "sek", customer_details: { email: "never@persist.invalid" },
    client_reference_id: direct ? "ta:synthetic" : reference,
    payment_link: direct ? null : "plink_synthetic",
    metadata: direct ? { rv_flow: "direct_customer_v1", rv_measurement: reference } : {},
  };
  fixtures.set(id, { session: object, lines: [line("price_" + product, amount)] });
  return object;
}

(async () => {
  await pg.exec("create role anon; create role authenticated; create table public.audhd_checkout_attempts (stripe_checkout_session_id text, stripe_payment_intent_id text, expires_at timestamptz)");
  for (const name of ["202610100001_stripe_shadow_ledger.sql", "202610140001_audhd_verified_ga4_purchase.sql"]) {
    await pg.exec(fs.readFileSync(path.join(migrations, name), "utf8"));
  }
  delete process.env.PAYMENT_LEDGER_V2_ENABLED;
  const current = "cs_live_legacy_cron_fixture";
  const stale = "cs_live_legacy_expired_fixture";
  await db`insert into public.stripe_payments (stripe_checkout_session_id, livemode, paid_at)
    values (${current}, true, now() - interval '1 hour'), (${stale}, true, now() - interval '4 days')`;
  await db`insert into public.ga4_purchase_deliveries
      (stripe_checkout_session_id, transaction_id, ga4_client_id, ga4_session_id)
    values (${current}, ${current}, '123.456', 123), (${stale}, ${stale}, '123.456', 123)`;
  await db`insert into public.audhd_checkout_attempts (expires_at)
    values (now() - interval '1 day'), (now() + interval '1 day')`;

  const priorError = console.error;
  const errors = [];
  console.error = message => errors.push(JSON.parse(message));
  try {
    assert.equal((await legacyCron(cronRequest(false))).status, 401);
    assert.equal((await legacyCron(cronRequest())).status, 503);
    assert.equal(errors[0].stage, "ga4_delivery");
    assert.equal(errors[0].database_code, "23502");
  } finally { console.error = priorError; }
  assert.equal(sends.length, 1, "the old schema rejects the acknowledgement after the GA4 call");

  await pg.exec(fs.readFileSync(path.join(migrations, "202611080001_stripe_reconciliation.sql"), "utf8"));
  const recovery = await legacyCron(cronRequest());
  assert.equal(recovery.status, 200);
  assert.deepEqual(await recovery.json(), { deleted: 0, delivered: 1 });
  assert.equal((await db`select count(*) from public.audhd_checkout_attempts`)[0].count, 1);
  const [ack] = await db`select delivered_at, ga4_client_id, ga4_session_id from public.ga4_purchase_deliveries
    where stripe_checkout_session_id = ${current}`;
  assert(ack.delivered_at && ack.ga4_client_id === null && ack.ga4_session_id === null);
  assert.equal(sends.length, 2, "expired legacy rows never get re-dated to today");
  assert.equal(sends[0].events[0].params.transaction_id, sends[1].events[0].params.transaction_id);
  sends.length = 0;
  process.env.PAYMENT_LEDGER_V2_ENABLED = "true";
  assert.equal((await retryCron(cronRequest(false))).status, 401);

  const browser = "a".repeat(32);
  assert.equal((await measurement("capture", browser, captureBody("adhd_test"), "https://wrong.invalid")).status, 403);
  assert.equal((await measurement("capture", browser, { ...captureBody("adhd_test"), consentVersion: undefined })).reference, null);
  for (const [product, amount] of variants) {
    const direct = !product.includes("_bok") && product !== "adhd_deluxe";
    const { reference } = await measurement("capture", browser, captureBody(product));
    assert.match(reference, /^rv_[a-f0-9]{32}$/);
    const stripe = session(product, amount, { direct, reference });
    const paid = event("checkout.session.completed", product, stripe);
    assert.equal(await post(paid, false), 400);
    if (product === "adhd_test") {
      failLedgerCommit = true;
      assert.equal(await post(paid), 503, "failed webhook transaction asks Stripe to retry");
      assert.equal((await db`select count(*) from public.stripe_webhook_events where stripe_event_id = ${paid.id}`)[0].count, 0);
      assert.equal((await db`select count(*) from public.stripe_payments where stripe_checkout_session_id = ${stripe.id}`)[0].count, 0);
    }
    assert.equal(await post(paid), 200);
    assert.equal(await post(paid), 200);
    assert.equal(await post({ ...paid, id: paid.id + "_second" }), 200);
    const body = sends.at(-1);
    assert.equal(body.events[0].params.transaction_id, stripe.id);
    assert.equal(body.events[0].params.value, amount / 100);
    assert.equal(body.events[0].params.items[0].item_id, "price_" + product);
    assert.equal(body.consent.ad_personalization, "DENIED");
    assert.doesNotMatch(JSON.stringify(body), /never@persist|answers|newsletter|example\.com|gclid/);
  }
  assert.equal(sends.length, variants.length, "one server purchase per Checkout Session without a return");
  assert.deepEqual((await db`select context from public.checkout_measurement_attribution limit 1`)[0].context, {
    firstLanding: "/", lastLanding: "/adhd-test", firstReferrer: "https://example.com", lastReferrer: null,
    campaign: { utm_source: "newsletter", utm_campaign: "november" },
  });

  const withdrawn = await measurement("capture", browser, captureBody("adhd_test"));
  assert.equal((await measurement("withdraw", browser, {})).status, 200);
  assert.equal((await measurement("capture", browser, captureBody("adhd_test"))).reference, null);
  const noGa = session("adhd_test", 3900, { reference: withdrawn.reference, suffix: "withdrawn" });
  assert.equal(await post(event("checkout.session.completed", "withdrawn", noGa)), 200);
  const unknown = session("unknown", 3900, { suffix: "unmapped" });
  assert.equal(await post(event("checkout.session.completed", "unmapped", unknown)), 200);
  assert.equal(sends.length, variants.length, "withdrawn and unmapped purchases remain ledger-only");

  const { reference } = await measurement("capture", "b".repeat(32), captureBody("adhd_test"));
  const pending = session("adhd_test", 3900, { reference, suffix: "async", paid: false });
  const unpaid = event("checkout.session.completed", "unpaid", { ...pending });
  assert.equal(await post(unpaid), 200);
  assert.equal(sends.length, variants.length);
  const paid = { ...pending, status: "complete", payment_status: "paid" };
  fixtures.get(pending.id).session = paid;

  const refund = { id: "re_partial", payment_intent: pending.payment_intent, charge: "ch_synthetic", amount: 1000, currency: "sek", status: "pending", created: now };
  refunds.set(refund.id, refund);
  assert.equal(await post(event("refund.created", "refund_first", refund)), 200);
  refund.status = "succeeded";
  assert.equal(await post(event("refund.updated", "refund_succeeded", refund)), 200);
  assert.equal(await post(event("refund.updated", "refund_succeeded", refund)), 200);
  failTransport = true;
  assert.equal(await post(event("checkout.session.async_payment_succeeded", "paid_async", paid)), 200);
  const failedRetry = await retryCron(cronRequest());
  assert.equal(failedRetry.status, 503);
  assert.deepEqual(await failedRetry.json(), { accepted: 0, failed: 1 });
  failTransport = false;
  const retried = await retryCron(cronRequest());
  assert.equal(retried.status, 200);
  assert.deepEqual(await retried.json(), { accepted: 1, failed: 0 });
  const [order] = await db`select gross_ore, refunded_ore, net_ore, ga4_transport_accepted from public.stripe_checkout_reconciliation where stripe_checkout_session_id = ${paid.id}`;
  assert.equal(Number(order.net_ore), 2900);
  assert.equal(Number(order.refunded_ore), 1000);
  assert.equal(order.ga4_transport_accepted, true);
  refunds.set("re_remaining", { ...refund, id: "re_remaining", amount: 2900 });
  assert.equal(await post(event("charge.refunded", "charge_refunded", { id: refund.charge, payment_intent: refund.payment_intent })), 200);
  assert.equal(Number((await db`select net_ore from public.stripe_checkout_reconciliation where stripe_checkout_session_id = ${paid.id}`)[0].net_ore), 0);

  const abandoned = session("iq_test", 7900, { direct: false, suffix: "expired", paid: false });
  assert.equal(await post(event("checkout.session.expired", "expired", abandoned)), 200);
  assert.equal((await db`select count(*) from public.stripe_checkout_reconciliation where stripe_checkout_session_id = ${abandoned.id}`)[0].count, 0);
  assert.equal((await db`select count(*) from public.stripe_checkout_reconciliation`)[0].count, variants.length + 3);
  assert.equal(sends.at(-1).events[0].params.transaction_id, sends.at(-2).events[0].params.transaction_id, "GA4 retries retain the same transaction ID");
  const sandbox = session("adhd_test", 3900, { suffix: "sandbox", livemode: false });
  const sandboxEvent = event("checkout.session.completed", "sandbox", sandbox, now, false);
  const sendsBeforeSandbox = sends.length;
  assert.equal(await post(sandboxEvent), 400, "the live handler refuses a signed test-mode event");
  process.env.STRIPE_LEDGER_MODE = "test";
  try {
    assert.equal(await post(event("checkout.session.completed", "live_in_sandbox", paid)), 400);
    assert.equal(await post(sandboxEvent), 200);
    assert.equal((await db`select livemode from public.stripe_payments where stripe_checkout_session_id = ${sandbox.id}`)[0].livemode, false);
    assert.equal(sends.length, sendsBeforeSandbox, "sandbox payments cannot enter the live GA4 outbox");
  } finally { delete process.env.STRIPE_LEDGER_MODE; }
  await pg.exec("set role anon");
  await assert.rejects(() => db`select * from public.stripe_checkout_reconciliation`, /permission denied/);
  await assert.rejects(() => db`select * from public.checkout_measurement_attribution`, /permission denied/);
  await pg.exec("reset role");
  console.log("PASS: signed Stripe routes, direct and relay, " + variants.length + " products, abandonment, retry, refund-first, consent and RLS");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => pg.close());
