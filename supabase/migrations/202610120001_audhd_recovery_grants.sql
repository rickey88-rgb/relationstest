-- Server-only support recovery grants. No test answers or customer profile data
-- are stored here; Stripe remains the payment source of truth.
create table if not exists public.audhd_recovery_grants (
  id uuid primary key,
  token_hash char(64) not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  stripe_checkout_session_id text not null unique check (stripe_checkout_session_id like 'cs_live_%'),
  stripe_payment_intent_id text not null check (stripe_payment_intent_id like 'pi_%'),
  stripe_price_id text not null check (stripe_price_id like 'price_%'),
  product_key text not null check (product_key = 'audhd_test'),
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create index if not exists audhd_recovery_grants_active_idx
  on public.audhd_recovery_grants (expires_at)
  where redeemed_at is not null and revoked_at is null;

alter table public.audhd_recovery_grants enable row level security;
