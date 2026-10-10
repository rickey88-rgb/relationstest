-- Phase 1: shadow-only Stripe payment ledger. No entitlement or test-result data.
create table if not exists public.stripe_webhook_events (
  stripe_event_id text primary key check (stripe_event_id like 'evt_%'),
  event_type text not null,
  livemode boolean not null,
  stripe_created_at timestamptz not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_status text not null check (processing_status in ('received', 'processed')),
  failure_code text
);

create table if not exists public.stripe_payments (
  stripe_checkout_session_id text primary key check (stripe_checkout_session_id like 'cs_%'),
  stripe_payment_intent_id text unique,
  stripe_payment_link_id text,
  product_key text not null default 'unmapped',
  amount_total_ore integer,
  currency text,
  checkout_status text,
  payment_status text,
  paid_at timestamptz,
  livemode boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stripe_payment_line_items (
  stripe_checkout_session_id text not null references public.stripe_payments(stripe_checkout_session_id) on delete cascade,
  stripe_price_id text not null check (stripe_price_id like 'price_%'),
  stripe_product_id text,
  quantity integer,
  unit_amount_ore integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (stripe_checkout_session_id, stripe_price_id)
);

create index if not exists stripe_payments_product_key_paid_at_idx on public.stripe_payments (product_key, paid_at desc);
create index if not exists stripe_payments_payment_link_idx on public.stripe_payments (stripe_payment_link_id);

-- These tables are server-only. The Vercel webhook uses DATABASE_URL directly;
-- no browser-facing Supabase client or Data API access is required.
alter table public.stripe_webhook_events enable row level security;
alter table public.stripe_payments enable row level security;
alter table public.stripe_payment_line_items enable row level security;
