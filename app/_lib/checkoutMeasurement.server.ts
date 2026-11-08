import { createHash, randomUUID } from "node:crypto";
import { testConfig } from "../_analytics/config";
import { PAYMENT_PRODUCT_KEYS } from "./paymentProductCatalog.server";
import { parseAudhdCheckoutAnalyticsAttribution } from "./audhdCheckoutAnalytics.server";
import { paymentsDatabase } from "./paymentsDb.server";

export const CHECKOUT_MEASUREMENT_CONSENT = "checkout-statistics-v1";
const productKeys = new Set<string>(PAYMENT_PRODUCT_KEYS);
const paths = new Set([
  "/", "/tester", "/persona", "/persona/test", "/audhd-bok", "/autism-bok", "/adhd-deluxe",
  ...Object.values(testConfig).flatMap(test => [test.path, test.path.replace(/\/test$/, "")]),
]);

function safePath(value: unknown) {
  return typeof value === "string" && paths.has(value) ? value : null;
}

function safeReferrer(value: unknown) {
  if (typeof value !== "string" || value.length > 100) return null;
  try {
    const url = new URL(value);
    return url.origin === value && /^https?:$/.test(url.protocol) && !url.port ? url.origin : null;
  } catch { return null; }
}

function safeCampaign(value: unknown) {
  if (!value || typeof value !== "object") return {};
  const fields = value as Record<string, unknown>;
  return Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_id"].flatMap(key => {
    const field = fields[key];
    return typeof field === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(field) ? [[key, field]] : [];
  }));
}

export function attributionReference(value: unknown) {
  return typeof value === "string" && /^rv_[a-f0-9]{32}$/.test(value) ? value : null;
}

export async function handleCheckoutMeasurement(body: Record<string, unknown>) {
  if (typeof body.browserKey !== "string" || !/^[a-f0-9]{32}$/.test(body.browserKey)) return null;
  const hash = createHash("sha256").update(body.browserKey).digest("hex");
  const sql = paymentsDatabase();
  if (body.action === "withdraw") {
    await sql.begin(async transaction => {
      await transaction`select pg_advisory_xact_lock(hashtextextended(${hash}, 0))`;
      await transaction`
        insert into public.checkout_measurement_withdrawals (browser_hash) values (${hash})
        on conflict (browser_hash) do update set expires_at = excluded.expires_at
      `;
      await transaction`delete from public.checkout_measurement_attribution where browser_hash = ${hash}`;
    });
    return null;
  }
  if (body.action !== "capture" || body.consentVersion !== CHECKOUT_MEASUREMENT_CONSENT
      || typeof body.product !== "string" || !productKeys.has(body.product)) return null;
  const ids = parseAudhdCheckoutAnalyticsAttribution(body);
  if (!ids) return null;
  const reference = "rv_" + randomUUID().replaceAll("-", "");
  const product = body.product;
  const context = {
    firstLanding: safePath(body.firstLanding), lastLanding: safePath(body.lastLanding),
    firstReferrer: safeReferrer(body.firstReferrer), lastReferrer: safeReferrer(body.lastReferrer),
    campaign: safeCampaign(body.campaign),
  };
  return sql.begin(async transaction => {
    await transaction`select pg_advisory_xact_lock(hashtextextended(${hash}, 0))`;
    const rows = await transaction`
      insert into public.checkout_measurement_attribution
        (reference, browser_hash, consent_version, product_key, client_id, session_id, context)
      select ${reference}, ${hash}, ${CHECKOUT_MEASUREMENT_CONSENT}, ${product},
             ${ids.clientId}, ${ids.sessionId}::bigint, ${transaction.json(context)}
      where not exists (select 1 from public.checkout_measurement_withdrawals where browser_hash = ${hash})
        and (select count(*) from public.checkout_measurement_attribution
             where browser_hash = ${hash} and captured_at > now() - interval '1 hour') < 30
      returning reference
    `;
    return rows.length ? reference : null;
  });
}
