import { randomBytes, randomUUID } from "node:crypto";
import postgres from "postgres";
import { AUDHD_CHECKOUT_ATTEMPT_RETENTION_SECONDS, type EncryptedAudhdCheckoutAnswers } from "./audhdCheckoutAttempt.server";
import type { AudhdCheckoutAnalyticsAttribution } from "./audhdCheckoutAnalytics.server";

type Sql = ReturnType<typeof postgres>;
const globalForAudhdCheckoutAttempts = globalThis as typeof globalThis & { audhdCheckoutAttemptsSql?: Sql };

function database() {
  if (!globalForAudhdCheckoutAttempts.audhdCheckoutAttemptsSql) {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) throw new Error("DATABASE_URL is not configured");
    globalForAudhdCheckoutAttempts.audhdCheckoutAttemptsSql = postgres(connectionString, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10, ssl: "require" });
  }
  return globalForAudhdCheckoutAttempts.audhdCheckoutAttemptsSql;
}

export type CreateAudhdCheckoutAttemptInput = EncryptedAudhdCheckoutAnswers & { browserSecretHash: string; reportVersion: string };

/** Creates an unbound, encrypted draft. It is deliberately not an entitlement. */
export async function createAudhdCheckoutAttempt(input: CreateAudhdCheckoutAttemptInput) {
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + AUDHD_CHECKOUT_ATTEMPT_RETENTION_SECONDS * 1000);
  const rows = await database()<{ id: string; expires_at: Date }[]>`
    insert into public.audhd_checkout_attempts (
      id, browser_secret_hash, report_version, answers_ciphertext, encryption_iv, encryption_auth_tag, expires_at
    ) values (
      ${id}, ${input.browserSecretHash}, ${input.reportVersion}, ${input.ciphertext}, ${input.iv}, ${input.authTag}, ${expiresAt}
    )
    returning id, expires_at
  `;
  if (rows.length !== 1) throw new Error("AuDHD checkout attempt could not be persisted");
  return { id: rows[0].id, expiresAt: rows[0].expires_at };
}

/**
 * Reserved for the next, server-created Checkout Session step. Only server code
 * receives a session ID; no browser input is accepted by this helper.
 */
export async function attachStripeCheckoutSessionToAudhdAttempt(attemptId: string, checkoutSessionId: string) {
  if (!/^cs_live_[A-Za-z0-9]+$/.test(checkoutSessionId)) throw new Error("AuDHD checkout session ID must be a live Stripe Checkout Session");
  const rows = await database()<{ id: string }[]>`
    update public.audhd_checkout_attempts
    set stripe_checkout_session_id = ${checkoutSessionId}, checkout_created_at = now(), updated_at = now()
    where id = ${attemptId}
      and expires_at > now()
      and stripe_checkout_session_id is null
    returning id
  `;
  if (rows.length !== 1) throw new Error("AuDHD checkout session could not be bound to its attempt");
}

type ReservedAttempt = {
  id: string;
  checkout_reference_id: string | null;
  stripe_checkout_session_id: string | null;
  checkout_started_at: Date | null;
};

export type AudhdCheckoutReservation =
  | { kind: "invalid" }
  | { kind: "in_progress" }
  | { kind: "existing"; checkoutSessionId: string; checkoutReferenceId: string }
  | { kind: "reserved"; checkoutReferenceId: string };

/**
 * Atomically assigns one non-sensitive Stripe client reference. A second click
 * can only reuse the already-created session or see a short in-progress state.
 */
export async function reserveAudhdCheckoutAttempt(attemptId: string, browserSecretHash: string): Promise<AudhdCheckoutReservation> {
  return database().begin(async transaction => {
    const rows = await transaction<ReservedAttempt[]>`
      select id, checkout_reference_id, stripe_checkout_session_id, checkout_started_at
      from public.audhd_checkout_attempts
      where id = ${attemptId}
        and browser_secret_hash = ${browserSecretHash}
        and expires_at > now()
      for update
    `;
    if (rows.length !== 1) return { kind: "invalid" };
    const attempt = rows[0];
    if (attempt.stripe_checkout_session_id && attempt.checkout_reference_id) {
      return { kind: "existing", checkoutSessionId: attempt.stripe_checkout_session_id, checkoutReferenceId: attempt.checkout_reference_id };
    }
    // A process can stop after reserving but before calling Stripe. The short
    // lease avoids leaving a customer's encrypted draft permanently stuck.
    if (attempt.checkout_reference_id && attempt.checkout_started_at && attempt.checkout_started_at.getTime() > Date.now() - 5 * 60 * 1000) return { kind: "in_progress" };

    const checkoutReferenceId = `audhd_${randomBytes(24).toString("base64url")}`;
    const updated = await transaction<{ id: string }[]>`
      update public.audhd_checkout_attempts
      set checkout_reference_id = ${checkoutReferenceId}, checkout_started_at = now(), updated_at = now()
      where id = ${attemptId}
        and stripe_checkout_session_id is null
      returning id
    `;
    if (updated.length !== 1) return { kind: "in_progress" };
    return { kind: "reserved", checkoutReferenceId };
  });
}

/** Releases only an unbound reservation after a Stripe/database failure; it never touches a bound Session. */
export async function releaseAudhdCheckoutReservation(input: { attemptId: string; browserSecretHash: string; checkoutReferenceId: string }) {
  await database()`
    update public.audhd_checkout_attempts
    set checkout_reference_id = null, checkout_started_at = null, updated_at = now()
    where id = ${input.attemptId}
      and browser_secret_hash = ${input.browserSecretHash}
      and checkout_reference_id = ${input.checkoutReferenceId}
      and stripe_checkout_session_id is null
  `;
}

/** Only a Stripe-confirmed expired Session may be detached for a fresh retry. */
export async function releaseExpiredAudhdCheckoutSession(input: { attemptId: string; browserSecretHash: string; checkoutReferenceId: string; checkoutSessionId: string }) {
  const rows = await database()<{ id: string }[]>`
    update public.audhd_checkout_attempts
    set stripe_checkout_session_id = null,
        checkout_created_at = null,
        checkout_reference_id = null,
        checkout_started_at = null,
        updated_at = now()
    where id = ${input.attemptId}
      and browser_secret_hash = ${input.browserSecretHash}
      and checkout_reference_id = ${input.checkoutReferenceId}
      and stripe_checkout_session_id = ${input.checkoutSessionId}
      and paid_at is null
      and expires_at > now()
    returning id
  `;
  return rows.length === 1;
}

/** Binds only the reservation owned by this browser-secret hash to the Session Stripe just created. */
export async function bindAudhdCheckoutSession(input: { attemptId: string; browserSecretHash: string; checkoutReferenceId: string; checkoutSessionId: string }) {
  if (!/^cs_live_[A-Za-z0-9]+$/.test(input.checkoutSessionId)) throw new Error("AuDHD checkout session ID must be a live Stripe Checkout Session");
  const rows = await database()<{ id: string }[]>`
    update public.audhd_checkout_attempts
    set stripe_checkout_session_id = ${input.checkoutSessionId}, checkout_created_at = now(), updated_at = now()
    where id = ${input.attemptId}
      and browser_secret_hash = ${input.browserSecretHash}
      and checkout_reference_id = ${input.checkoutReferenceId}
      and stripe_checkout_session_id is null
      and expires_at > now()
    returning id
  `;
  if (rows.length !== 1) throw new Error("AuDHD checkout session could not be bound to its attempt");
}

/**
 * Optional, consent-gated attribution. It is intentionally best-effort at the
 * route boundary and is never used to determine whether a payment is valid.
 * The first valid browser context wins, so repeated checkout clicks cannot
 * rewrite a purchase's original GA session association.
 */
export async function saveAudhdCheckoutAnalyticsAttribution(input: { attemptId: string; browserSecretHash: string; attribution: AudhdCheckoutAnalyticsAttribution }) {
  const rows = await database()<{ id: string }[]>`
    update public.audhd_checkout_attempts
    set ga4_client_id = coalesce(ga4_client_id, ${input.attribution.clientId}),
        ga4_session_id = coalesce(ga4_session_id, ${input.attribution.sessionId}::bigint),
        ga4_attribution_captured_at = coalesce(ga4_attribution_captured_at, now()),
        updated_at = now()
    where id = ${input.attemptId}
      and browser_secret_hash = ${input.browserSecretHash}
      and expires_at > now()
      and paid_at is null
    returning id
  `;
  return rows.length === 1;
}

export type AudhdCheckoutRestoreRecord = EncryptedAudhdCheckoutAnswers & { id: string; checkoutSessionId: string; paymentIntentId: string; expiresAt: Date; accessExpiresAt: Date };

/**
 * This conditional update is the payment entitlement boundary: the paid Stripe
 * facts must match the already-bound Session, internal reference and browser.
 */
export async function finalizeVerifiedAudhdCheckout(input: { browserSecretHash: string; checkoutReferenceId: string; checkoutSessionId: string; paymentIntentId: string }) {
  const rows = await database()<{ id: string; access_expires_at: Date }[]>`
    update public.audhd_checkout_attempts
    set stripe_payment_intent_id = ${input.paymentIntentId},
        paid_at = coalesce(paid_at, now()),
        access_expires_at = coalesce(access_expires_at, expires_at),
        updated_at = now()
    where browser_secret_hash = ${input.browserSecretHash}
      and checkout_reference_id = ${input.checkoutReferenceId}
      and stripe_checkout_session_id = ${input.checkoutSessionId}
      and (stripe_payment_intent_id is null or stripe_payment_intent_id = ${input.paymentIntentId})
      and expires_at > now()
      and revoked_at is null
    returning id, access_expires_at
  `;
  return rows.length === 1 ? { id: rows[0].id, accessExpiresAt: rows[0].access_expires_at } : null;
}

/**
 * A cookie-less Stripe return may prove a payment, but it never receives an
 * entitlement here. This only proves that an existing server-created attempt
 * is eligible for a separately authenticated recovery link.
 */
export async function hasAudhdCheckoutRecoveryCandidate(input: { checkoutReferenceId: string; checkoutSessionId: string }) {
  const rows = await database()<{ id: string }[]>`
    select id
    from public.audhd_checkout_attempts
    where checkout_reference_id = ${input.checkoutReferenceId}
      and stripe_checkout_session_id = ${input.checkoutSessionId}
      and expires_at > now()
      and revoked_at is null
    limit 1
  `;
  return rows.length === 1;
}

/** Read encrypted material only for a matching, live recovery candidate. */
export async function loadAudhdRecoveryCandidateAnswers(input: { checkoutReferenceId: string; checkoutSessionId: string }) {
  const rows = await database()<Array<{ answers_ciphertext: string; encryption_iv: string; encryption_auth_tag: string }>>`
    select answers_ciphertext, encryption_iv, encryption_auth_tag
    from public.audhd_checkout_attempts
    where checkout_reference_id = ${input.checkoutReferenceId}
      and stripe_checkout_session_id = ${input.checkoutSessionId}
      and expires_at > now()
      and revoked_at is null
    limit 1
  `;
  const row = rows[0];
  return row ? { ciphertext: row.answers_ciphertext, iv: row.encryption_iv, authTag: row.encryption_auth_tag } : null;
}

export type AudhdCheckoutPendingRecord = { checkoutReferenceId: string; checkoutSessionId: string };

/** A browser-bound retry reads the Session ID only from its own persisted attempt. */
export async function loadAudhdCheckoutPendingRecord(browserSecretHash: string): Promise<AudhdCheckoutPendingRecord | null> {
  const rows = await database()<Array<{ checkout_reference_id: string; stripe_checkout_session_id: string }>>`
    select checkout_reference_id, stripe_checkout_session_id
    from public.audhd_checkout_attempts
    where browser_secret_hash = ${browserSecretHash}
      and checkout_reference_id is not null
      and stripe_checkout_session_id is not null
      and paid_at is null
      and expires_at > now()
      and revoked_at is null
    order by checkout_created_at desc
    limit 1
  `;
  const record = rows[0];
  return record ? { checkoutReferenceId: record.checkout_reference_id, checkoutSessionId: record.stripe_checkout_session_id } : null;
}

/** The restored ciphertext is released only after both signed access and browser-secret checks. */
export async function loadAudhdCheckoutRestoreRecord(attemptId: string, browserSecretHash: string): Promise<AudhdCheckoutRestoreRecord | null> {
  const rows = await database()<Array<{ id: string; answers_ciphertext: string; encryption_iv: string; encryption_auth_tag: string; stripe_checkout_session_id: string; stripe_payment_intent_id: string; expires_at: Date; access_expires_at: Date }>>`
    select id, answers_ciphertext, encryption_iv, encryption_auth_tag, stripe_checkout_session_id, stripe_payment_intent_id, expires_at, access_expires_at
    from public.audhd_checkout_attempts
    where id = ${attemptId}
      and browser_secret_hash = ${browserSecretHash}
      and paid_at is not null
      and access_expires_at > now()
      and expires_at > now()
      and revoked_at is null
    limit 1
  `;
  if (rows.length !== 1) return null;
  const row = rows[0];
  if (!row.stripe_checkout_session_id || !row.stripe_payment_intent_id) return null;
  return { id: row.id, ciphertext: row.answers_ciphertext, iv: row.encryption_iv, authTag: row.encryption_auth_tag, checkoutSessionId: row.stripe_checkout_session_id, paymentIntentId: row.stripe_payment_intent_id, expiresAt: row.expires_at, accessExpiresAt: row.access_expires_at };
}

/** A refund or chargeback permanently disables this short-lived report entitlement. */
export async function revokeAudhdCheckoutAccessForPaymentIntent(paymentIntentId: string) {
  if (!/^pi_[A-Za-z0-9]+$/.test(paymentIntentId)) return false;
  const rows = await database()<{ id: string }[]>`
    update public.audhd_checkout_attempts
    set revoked_at = coalesce(revoked_at, now()), updated_at = now()
    where stripe_payment_intent_id = ${paymentIntentId}
      and paid_at is not null
      and revoked_at is null
    returning id
  `;
  return rows.length === 1;
}

/** Physical retention cleanup; the predicate deliberately cannot touch a live attempt. */
export async function deleteExpiredAudhdCheckoutAttempts() {
  const rows = await database()<{ deleted_count: number }[]>`
    with deleted as (
      delete from public.audhd_checkout_attempts
      where expires_at <= now()
      returning 1
    )
    select count(*)::int as deleted_count from deleted
  `;
  return rows[0]?.deleted_count ?? 0;
}
