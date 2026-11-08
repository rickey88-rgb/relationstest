/* eslint-disable @typescript-eslint/no-require-imports -- operator tool, no dotenv or provider writes. */
const { createHash } = require("node:crypto");
const path = require("node:path");
const Stripe = require("stripe");
const load = require("../app/autism-test/test/test-loader.cjs")();
const { processStripeWebhookEvent } = load(path.resolve(__dirname, "../app/_lib/stripeWebhook.server.ts"));
const { recordVerifiedStripePayment, paymentsDatabase } = load(path.resolve(__dirname, "../app/_lib/paymentsDb.server.ts"));
const { recordStripeRefunds, stripeId } = load(path.resolve(__dirname, "../app/_lib/stripeRefundLedger.server.ts"));

function utc(name, args) {
  const value = args.find(arg => arg.startsWith("--" + name + "="))?.split("=")[1];
  if (!value || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value)) throw Error("invalid_utc_window");
  const millis = Date.parse(value);
  if (!Number.isFinite(millis) || new Date(millis).toISOString() !== value.replace("Z", ".000Z")) throw Error("invalid_utc_window");
  return millis / 1000;
}

async function run() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("node scripts/stripe-checkout-backfill.cjs --since=YYYY-MM-DDT00:00:00Z --until=YYYY-MM-DDT00:00:00Z [--apply] [--protected-runtime]");
    return;
  }
  if (args.some(arg => !/^--(since=|until=|apply$|protected-runtime$)/.test(arg))) throw Error("invalid_argument");
  const start = utc("since", args), end = utc("until", args);
  if (end <= start || end - start > 31 * 86400) throw Error("invalid_utc_window");
  const key = process.env.RV_STRIPE_RECONCILIATION_KEY ?? "";
  const live = key.startsWith("rk_live_");
  if (!/^([sr]k_test_|rk_live_)[A-Za-z0-9]+$/.test(key)) throw Error("restricted_or_sandbox_key_required");
  if (live && !(args.includes("--protected-runtime") && process.env.CI === "true")) throw Error("live_key_requires_protected_runner");
  const apply = args.includes("--apply");
  const expected = process.env.RV_STRIPE_EXPECTED_ACCOUNT ?? "";
  if (!/^acct_[A-Za-z0-9]+$/.test(expected)) throw Error("expected_stripe_account_required");
  if (apply) {
    // Explicitly select the database. Never read the app's DATABASE_URL or dotenv.
    const database = new URL(process.env.RV_STRIPE_LEDGER_DATABASE_URL ?? "invalid:");
    const project = process.env.RV_LEDGER_SUPABASE_PROJECT ?? "";
    if (!/^postgres(ql)?:$/.test(database.protocol) || !/^[a-z]{20}$/.test(project)
      || !(database.hostname === "db." + project + ".supabase.co"
           || (database.hostname.endsWith(".pooler.supabase.com") && database.username.endsWith("." + project)))) throw Error("unexpected_supabase_project");
    process.env.DATABASE_URL = database.href;
    process.env.PAYMENT_LEDGER_V2_ENABLED = "true";
  }

  const stripe = new Stripe(key, { timeout: 15000, maxNetworkRetries: 2 });
  if ((await stripe.accounts.retrieve()).id !== expected) throw Error("unexpected_stripe_account");
  const interval = { gte: start, lt: end };
  const checkouts = new Map();
  const totals = {};
  let outsideCheckout = 0;
  let duplicateSessions = 0;
  for (const type of ["charge", "payment"]) {
    for await (const entry of stripe.balanceTransactions.list({ type, created: interval, expand: ["data.source"], limit: 100 })) {
      const charge = entry.source;
      if (charge?.object !== "charge" || !charge.paid || !charge.captured) throw Error("unexpected_balance_charge");
      if (charge.livemode !== live) throw Error("stripe_mode_mismatch");
      const intent = stripeId(charge.payment_intent);
      if (!intent) { outsideCheckout++; continue; }
      const found = await stripe.checkout.sessions.list({ payment_intent: intent, limit: 2 });
      if (!found.data.length) { outsideCheckout++; continue; }
      if (found.data.length !== 1 || found.has_more) throw Error("multiple_checkouts_for_payment");
      const session = found.data[0];
      if (session.mode !== "payment") { outsideCheckout++; continue; }
      if (checkouts.has(session.id)) { duplicateSessions++; continue; }
      if (session.status !== "complete" || session.payment_status !== "paid" || session.currency !== charge.currency
        || session.amount_total !== charge.amount_captured) throw Error("checkout_charge_mismatch");
      const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
      const result = await processStripeWebhookEvent({
        id: "evt_reconcile_" + createHash("sha256").update(session.id).digest("hex"),
        type: "checkout.session.completed", created: entry.created, livemode: live, data: { object: session },
      }, {
        ledgerV2: true,
        retrieveSession: async () => session,
        listLineItems: async () => lines,
        recordPayment: async payment => {
          checkouts.set(session.id, { ...payment, eventType: "reconciliation.checkout.paid", ledgerV2: { ...payment.ledgerV2, attributionReference: null } });
          return { duplicate: false };
        },
      });
      if (result.kind !== "recorded" || !result.paid) throw Error("checkout_not_reconciled");
      const group = totals[session.currency + "/" + result.productKey] ??= { payments: 0, grossMinor: 0 };
      group.payments++;
      group.grossMinor += session.amount_total;
    }
  }

  const refunds = new Map();
  // Refunds issued in the window also include orders paid before the window.
  for await (const refund of stripe.refunds.list({ created: interval, limit: 100 })) refunds.set(refund.id, refund);
  // Include newer/older refunds for the selected order cohort as of the audit.
  for (const order of checkouts.values()) {
    for await (const refund of stripe.refunds.list({ payment_intent: order.paymentIntentId, limit: 100 })) refunds.set(refund.id, refund);
  }
  const refundSummary = {};
  for (const refund of refunds.values()) {
    const group = refundSummary[refund.currency + "/" + refund.status] ??= { refunds: 0, minor: 0 };
    group.refunds++;
    group.minor += refund.amount;
  }

  const report = { mode: live ? "live" : "sandbox", apply, checkoutCount: checkouts.size, outsideCheckout, duplicateSessions, totals, refundSummary };
  console.log(JSON.stringify(report, null, 2));
  if (!apply) return;
  if ([...checkouts.values()].some(order => order.productKey === "unmapped")) throw Error("resolve_unmapped_products_before_apply");
  try {
    for (const order of checkouts.values()) await recordVerifiedStripePayment(order);
    for (const refund of refunds.values()) {
      await recordStripeRefunds({
        id: "evt_reconcile_refund_" + createHash("sha256").update(refund.id + "/" + refund.status).digest("hex"),
        type: "refund.updated", created: refund.created, livemode: live, data: { object: refund },
      }, stripe);
    }
    console.log(JSON.stringify({ outcome: "ledger_reconciled", checkouts: checkouts.size, refunds: refunds.size }));
  } finally { await paymentsDatabase().end(); }
}
run().catch(error => {
  const message = /^[a-z_]{3,80}$/.test(error.message) ? error.message : "stripe_or_database_reconciliation_failed";
  console.error(message);
  process.exitCode = 1;
});
