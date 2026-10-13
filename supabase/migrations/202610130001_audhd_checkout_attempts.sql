-- Encrypted, short-lived AuDHD answer drafts for the future verified Checkout flow.
-- This migration is local only until explicitly reviewed and applied.
create table if not exists public.audhd_checkout_attempts (
  id uuid primary key,
  browser_secret_hash char(64) not null unique check (browser_secret_hash ~ '^[0-9a-f]{64}$'),
  report_version text not null check (report_version = 'audhd-v1'),
  answers_ciphertext text not null,
  encryption_iv text not null,
  encryption_auth_tag text not null,
  checkout_reference_id text unique check (checkout_reference_id is null or checkout_reference_id ~ '^audhd_[A-Za-z0-9_-]{32}$'),
  stripe_checkout_session_id text unique check (stripe_checkout_session_id is null or stripe_checkout_session_id like 'cs_live_%'),
  stripe_payment_intent_id text unique check (stripe_payment_intent_id is null or stripe_payment_intent_id like 'pi_%'),
  checkout_started_at timestamptz,
  checkout_created_at timestamptz,
  paid_at timestamptz,
  access_expires_at timestamptz,
  revoked_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at),
  check (checkout_started_at is null or checkout_reference_id is not null),
  check (checkout_created_at is null or stripe_checkout_session_id is not null)
);

create index if not exists audhd_checkout_attempts_expiry_idx
  on public.audhd_checkout_attempts (expires_at);

create index if not exists audhd_checkout_attempts_active_access_idx
  on public.audhd_checkout_attempts (access_expires_at)
  where paid_at is not null and revoked_at is null;

-- Server-only: DATABASE_URL is used by server routes; no browser RLS policy exists.
alter table public.audhd_checkout_attempts enable row level security;
