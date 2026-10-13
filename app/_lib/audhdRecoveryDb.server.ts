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
