-- One delivery per verified Checkout Session. Customer email and links stay out of the ledger.
create table if not exists public.book_email_deliveries (
  stripe_checkout_session_id text primary key,
  started_at timestamptz not null default now(),
  sent_at timestamptz
);

alter table public.book_email_deliveries enable row level security;
revoke all on public.book_email_deliveries from public, anon, authenticated;
