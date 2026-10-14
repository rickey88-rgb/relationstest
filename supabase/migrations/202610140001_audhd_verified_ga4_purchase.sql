-- GA4 attribution is optional and exists only after the visitor has opted in.
-- It is unrelated to payment verification, entitlement, or test answers.
alter table public.audhd_checkout_attempts
  add column if not exists ga4_client_id text check (ga4_client_id is null or ga4_client_id ~ '^[1-9][0-9]{0,19}\.[1-9][0-9]{0,19}$'),
  add column if not exists ga4_session_id bigint check (ga4_session_id is null or ga4_session_id > 0),
  add column if not exists ga4_attribution_captured_at timestamptz;

-- The Stripe ledger transaction creates exactly one outbox row for a paid,
-- allowlisted AuDHD Checkout session with opt-in GA4 attribution. A stable
-- transaction ID makes retries safe both here and in GA4.
create table if not exists public.ga4_purchase_deliveries (
  stripe_checkout_session_id text primary key references public.stripe_payments(stripe_checkout_session_id) on delete restrict,
  transaction_id text not null unique check (transaction_id like 'cs_live_%'),
  ga4_client_id text not null check (ga4_client_id ~ '^[1-9][0-9]{0,19}\.[1-9][0-9]{0,19}$'),
  ga4_session_id bigint not null check (ga4_session_id > 0),
  delivery_attempts integer not null default 0 check (delivery_attempts >= 0),
  last_attempt_at timestamptz,
  delivery_lease_token uuid,
  delivery_lease_expires_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ga4_purchase_deliveries_pending_idx
  on public.ga4_purchase_deliveries (created_at)
  where delivered_at is null;

alter table public.ga4_purchase_deliveries enable row level security;
