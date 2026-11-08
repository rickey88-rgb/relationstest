-- Shared Stripe ledger and consent-scoped purchase measurement.
alter table public.ga4_purchase_deliveries
  alter column ga4_client_id drop not null, alter column ga4_session_id drop not null;
alter table public.stripe_payments add column stripe_state_at timestamptz;
alter table public.stripe_payments add column checkout_flow text check (checkout_flow in ('direct_account', 'payment_link', 'checkout_session'));
revoke all on public.stripe_payments, public.stripe_payment_line_items, public.stripe_webhook_events,
  public.ga4_purchase_deliveries from anon, authenticated;
alter table public.stripe_payments add column tax_ore integer;
alter table public.stripe_payments add column shipping_ore integer;
alter table public.stripe_payment_line_items add column net_ore integer;

create table public.stripe_refunds (
  stripe_refund_id text primary key,
  stripe_payment_intent_id text not null,
  amount_ore integer not null check (amount_ore > 0),
  currency text not null,
  status text not null,
  livemode boolean not null,
  stripe_created_at timestamptz not null,
  stripe_state_at timestamptz not null
);
create index stripe_refunds_payment_idx on public.stripe_refunds (stripe_payment_intent_id, livemode);
alter table public.stripe_refunds enable row level security;
revoke all on public.stripe_refunds from anon, authenticated;

create table public.checkout_measurement_withdrawals (
  browser_hash text primary key,
  expires_at timestamptz not null default now() + interval '72 hours'
);
create table public.checkout_measurement_attribution (
  reference text primary key check (reference ~ '^rv_[a-f0-9]{32}$'),
  browser_hash text not null,
  consent_version text not null,
  product_key text not null,
  client_id text,
  session_id bigint,
  context jsonb not null,
  captured_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '72 hours'
);
create index checkout_measurement_attribution_browser_idx on public.checkout_measurement_attribution (browser_hash);
create index checkout_measurement_attribution_expiry_idx on public.checkout_measurement_attribution (expires_at);

create table public.stripe_purchase_measurements (
  stripe_checkout_session_id text primary key references public.stripe_payments,
  attribution_reference text unique references public.checkout_measurement_attribution on delete set null,
  attempts integer not null default 0,
  lease_token uuid,
  lease_until timestamptz,
  accepted_at timestamptz,
  skipped_at timestamptz,
  skip_reason text check (skip_reason in ('product', 'age_or_amount', 'withdrawn')),
  created_at timestamptz not null default now()
);
create index stripe_purchase_measurements_pending_idx on public.stripe_purchase_measurements (created_at)
  where accepted_at is null and skipped_at is null and attribution_reference is not null;

alter table public.checkout_measurement_withdrawals enable row level security;
alter table public.checkout_measurement_attribution enable row level security;
alter table public.stripe_purchase_measurements enable row level security;
revoke all on public.checkout_measurement_withdrawals, public.checkout_measurement_attribution,
  public.stripe_purchase_measurements from anon, authenticated;

-- A refund can arrive first. The intent join becomes effective when the purchase arrives.
create view public.stripe_checkout_reconciliation with (security_invoker = true) as
select payment.stripe_checkout_session_id, payment.stripe_payment_intent_id, payment.product_key,
       payment.currency, payment.livemode, payment.paid_at, payment.checkout_flow,
       payment.amount_total_ore as gross_ore, coalesce(refunds.refunded_ore, 0) as refunded_ore,
       payment.amount_total_ore - coalesce(refunds.refunded_ore, 0) as net_ore,
       (measurement.accepted_at is not null or legacy.delivered_at is not null) as ga4_transport_accepted
from public.stripe_payments payment
left join lateral (
  select sum(refund.amount_ore) as refunded_ore
  from public.stripe_refunds refund
  where refund.stripe_payment_intent_id = payment.stripe_payment_intent_id
    and refund.livemode = payment.livemode and refund.currency = payment.currency and refund.status = 'succeeded'
) refunds on true
left join public.stripe_purchase_measurements measurement using (stripe_checkout_session_id)
left join public.ga4_purchase_deliveries legacy using (stripe_checkout_session_id)
where payment.payment_status = 'paid' and payment.paid_at is not null;
revoke all on public.stripe_checkout_reconciliation from anon, authenticated;
