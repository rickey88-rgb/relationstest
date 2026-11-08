-- Run with read-only access. Replace bounds once with the same UTC instants
-- used in Stripe and the GA4 export (the GA4 property can use another timezone).
begin transaction read only;
with bounds as (
  select now() - interval '28 days' as starts_at, now() as ends_at
)
select product_key, coalesce(checkout_flow, 'historical') as flow, currency, count(*) as paid_orders, sum(gross_ore) as gross_minor,
       sum(refunded_ore) as lifetime_refunds_for_order_cohort_minor, sum(net_ore) as cohort_net_minor,
       count(*) filter (where ga4_transport_accepted) as ga4_transport_accepted_orders
from public.stripe_checkout_reconciliation, bounds
where livemode and paid_at >= starts_at and paid_at < ends_at
group by product_key, flow, currency order by currency, gross_minor desc;

select currency, status, count(*) as refunds_created_in_window, sum(amount_ore) as refunded_minor
from public.stripe_refunds
where livemode and stripe_created_at >= now() - interval '28 days' and stripe_created_at < now()
group by currency, status order by currency, status;

select count(*) filter (where accepted_at is not null) as ga4_http_accepted,
       count(*) filter (where skipped_at is not null) as skipped,
       count(*) filter (where accepted_at is null and skipped_at is null and attribution_reference is null) as expired_or_withdrawn,
       count(*) filter (where accepted_at is null and skipped_at is null and attribution_reference is not null) as pending
from public.stripe_purchase_measurements where created_at >= now() - interval '28 days';

select event_type, count(*) as event_count
from public.stripe_webhook_events
where livemode and stripe_created_at >= now() - interval '28 days'
group by event_type order by event_type;
rollback;
