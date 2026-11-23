-- The verified account owns the Stripe session from checkout creation.
-- No browser-facing policy or PostgREST grant is required.
create table public.overthinking_book_checkouts (
  stripe_checkout_session_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_price_id text not null,
  live_mode boolean not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index overthinking_book_checkouts_owner_idx
  on public.overthinking_book_checkouts (user_id, live_mode, created_at desc);

alter table public.overthinking_book_checkouts enable row level security;
revoke all on public.overthinking_book_checkouts from public, anon, authenticated;
