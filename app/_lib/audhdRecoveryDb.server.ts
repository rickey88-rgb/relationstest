import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { AUDHD_RECOVERY_TOKEN_SECONDS } from "./audhdRecovery.server";

type Sql = ReturnType<typeof postgres>;

const globalForAudhdRecovery = globalThis as typeof globalThis & { audhdRecoverySql?: Sql };

function connectionString() {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) throw new Error("DATABASE_URL is not configured");
  return value;
}

function database() {
  if (!globalForAudhdRecovery.audhdRecoverySql) {
    globalForAudhdRecovery.audhdRecoverySql = postgres(connectionString(), {
      max: 1,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require",
    });
  }
  return globalForAudhdRecovery.audhdRecoverySql;
}

export type AudhdRecoveryGrantInput = {
  tokenHash: string;
  checkoutSessionId: string;
  paymentIntentId: string;
  priceId: string;
};

export type AudhdRecoveryGrant = {
  id: string;
  checkoutSessionId: string;
  paymentIntentId: string;
  priceId: string;
};

/**
 * Reissuing for the same Checkout Session atomically replaces the old token.
 * The raw token never reaches the database.
 */
export async function createAudhdRecoveryGrant(input: AudhdRecoveryGrantInput) {
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + AUDHD_RECOVERY_TOKEN_SECONDS * 1000);
  const rows = await database()<{ id: string; expires_at: Date }[]>`
    insert into public.audhd_recovery_grants (
      id, token_hash, stripe_checkout_session_id, stripe_payment_intent_id,
      stripe_price_id, product_key, expires_at
    ) values (
      ${id}, ${input.tokenHash}, ${input.checkoutSessionId}, ${input.paymentIntentId},
      ${input.priceId}, 'audhd_test', ${expiresAt}
    )
    on conflict (stripe_checkout_session_id) do update set
      id = excluded.id,
      token_hash = excluded.token_hash,
      stripe_payment_intent_id = excluded.stripe_payment_intent_id,
      stripe_price_id = excluded.stripe_price_id,
      product_key = excluded.product_key,
      expires_at = excluded.expires_at,
      redeemed_at = null,
      revoked_at = null,
      updated_at = now()
    returning id, expires_at
  `;
  if (rows.length !== 1) throw new Error("Recovery grant could not be persisted");
  return { id: rows[0].id, expiresAt: rows[0].expires_at };
}

/**
 * Automatic delivery never replaces a support-issued link. This avoids a
 * duplicate Stripe return invalidating a recovery link already sent by email.
 */
export async function createAutomaticAudhdRecoveryGrant(input: AudhdRecoveryGrantInput) {
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + AUDHD_RECOVERY_TOKEN_SECONDS * 1000);
  const rows = await database()<Array<{ id: string; expires_at: Date }>>`
    insert into public.audhd_recovery_grants (
      id, token_hash, stripe_checkout_session_id, stripe_payment_intent_id,
      stripe_price_id, product_key, expires_at
    ) values (
      ${id}, ${input.tokenHash}, ${input.checkoutSessionId}, ${input.paymentIntentId},
      ${input.priceId}, 'audhd_test', ${expiresAt}
    ) on conflict (stripe_checkout_session_id) do nothing
    returning id, expires_at
  `;
  return rows.length === 1 ? { kind: "created" as const, id: rows[0].id, expiresAt: rows[0].expires_at } : { kind: "existing" as const };
}

/**
 * If the mail transport did not accept a newly-created automatic link, remove
 * only that unused grant. A later verified return can then safely issue one
 * fresh link; no collection of active links is left behind.
 */
export async function discardUndeliveredAutomaticAudhdRecoveryGrant(input: { id: string; checkoutSessionId: string }) {
  const rows = await database()<{ id: string }[]>`
    delete from public.audhd_recovery_grants
    where id = ${input.id}
      and stripe_checkout_session_id = ${input.checkoutSessionId}
      and redeemed_at is null
      and revoked_at is null
    returning id
  `;
  return rows.length === 1;
}

export async function loadAudhdRecoveryGrantForRedemption(tokenHash: string): Promise<AudhdRecoveryGrant | null> {
  const rows = await database()<Array<{ id: string; stripe_checkout_session_id: string; stripe_payment_intent_id: string; stripe_price_id: string }>>`
    select id, stripe_checkout_session_id, stripe_payment_intent_id, stripe_price_id
    from public.audhd_recovery_grants
    where token_hash = ${tokenHash}
      and product_key = 'audhd_test'
      and expires_at > now()
      and redeemed_at is null
      and revoked_at is null
    limit 1
  `;
  const grant = rows[0];
  return grant ? { id: grant.id, checkoutSessionId: grant.stripe_checkout_session_id, paymentIntentId: grant.stripe_payment_intent_id, priceId: grant.stripe_price_id } : null;
}

/** Atomically consumes an opaque support link once. */
export async function redeemAudhdRecoveryGrant(tokenHash: string) {
  const rows = await database()<{ id: string }[]>`
    update public.audhd_recovery_grants
    set redeemed_at = now(), updated_at = now()
    where token_hash = ${tokenHash}
      and product_key = 'audhd_test'
      and expires_at > now()
      and redeemed_at is null
      and revoked_at is null
    returning id
  `;
  return rows.length === 1 ? rows[0].id : null;
}

/** A browser cookie remains valid only while its redeemed grant remains active. */
export async function isAudhdRecoveryGrantActive(grantId: string) {
  const rows = await database()<{ id: string }[]>`
    select id
    from public.audhd_recovery_grants
    where id = ${grantId}
      and product_key = 'audhd_test'
      and expires_at > now()
      and redeemed_at is not null
      and revoked_at is null
    limit 1
  `;
  return rows.length === 1;
}

export type AudhdRecoveryRestoreRecord = {
  checkoutSessionId: string;
  paymentIntentId: string;
  priceId: string;
  ciphertext: string;
  iv: string;
  authTag: string;
};

/** Recovery links may restore only the paid attempt that their redeemed grant names. */
export async function loadAudhdRecoveryRestoreRecord(grantId: string): Promise<AudhdRecoveryRestoreRecord | null> {
  const rows = await database()<Array<{ stripe_checkout_session_id: string; stripe_payment_intent_id: string; stripe_price_id: string; answers_ciphertext: string; encryption_iv: string; encryption_auth_tag: string }>>`
    select rg.stripe_checkout_session_id,
           rg.stripe_payment_intent_id,
           rg.stripe_price_id,
           attempt.answers_ciphertext,
           attempt.encryption_iv,
           attempt.encryption_auth_tag
    from public.audhd_recovery_grants rg
    join public.audhd_checkout_attempts attempt
      on attempt.stripe_checkout_session_id = rg.stripe_checkout_session_id
    where rg.id = ${grantId}
      and rg.product_key = 'audhd_test'
      and rg.expires_at > now()
      and rg.redeemed_at is not null
      and rg.revoked_at is null
      and attempt.expires_at > now()
      and attempt.revoked_at is null
    limit 1
  `;
  const record = rows[0];
  return record ? {
    checkoutSessionId: record.stripe_checkout_session_id,
    paymentIntentId: record.stripe_payment_intent_id,
    priceId: record.stripe_price_id,
    ciphertext: record.answers_ciphertext,
    iv: record.encryption_iv,
    authTag: record.encryption_auth_tag,
  } : null;
}

/** Signed Stripe refund/dispute events revoke every recovery entitlement for the payment. */
export async function revokeAudhdRecoveryGrantsForPaymentIntent(paymentIntentId: string) {
  if (!/^pi_[A-Za-z0-9]+$/.test(paymentIntentId)) return false;
  const rows = await database()<{ id: string }[]>`
    update public.audhd_recovery_grants
    set revoked_at = coalesce(revoked_at, now()), updated_at = now()
    where stripe_payment_intent_id = ${paymentIntentId}
      and revoked_at is null
    returning id
  `;
  return rows.length > 0;
}
