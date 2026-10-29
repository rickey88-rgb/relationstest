-- LOCAL DELIVERY ONLY. Independent of account_audhd_*; run only after explicit production approval.
create table public.test_account_attempts (
  id uuid primary key, analysis_id uuid not null unique, product text not null,
  question_version text not null, report_version text not null,
  browser_hash text not null check (browser_hash ~ '^[a-f0-9]{64}$'),
  journal_identity text not null, ciphertext text not null,
  session_id text unique, price_id text not null, live_mode boolean not null check (live_mode),
  created_at timestamptz not null default now(), expires_at timestamptz not null,
  check (expires_at > created_at and expires_at <= created_at + interval '7 days')
);
create index test_account_attempts_expiry on public.test_account_attempts(expires_at);
create index test_account_attempts_created on public.test_account_attempts(created_at);
create index test_account_attempts_browser on public.test_account_attempts(browser_hash, created_at desc);
create table public.test_account_purchases (
  id uuid primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  product text not null, session_id text not null unique, price_id text not null,
  payment_intent_id text not null unique, purchased_at timestamptz not null,
  amount integer not null check (amount > 0), currency text not null check (currency = 'sek')
);
create index test_account_purchases_owner on public.test_account_purchases(owner_id, purchased_at desc);
create table public.test_account_analyses (
  purchase_id uuid primary key references public.test_account_purchases(id) on delete cascade,
  generation_id uuid not null unique, journal_identity text not null,
  product text not null, question_version text not null, report_version text not null,
  ciphertext text not null, consent_version text not null,
  saved_at timestamptz not null default now(), expires_at timestamptz not null,
  check (expires_at > saved_at and expires_at <= saved_at + interval '12 months' - interval '10 days')
);
create index test_account_analyses_expiry on public.test_account_analyses(expires_at);
create table public.test_account_erasure_receipts (generation_id uuid primary key, recorded_at timestamptz not null default now());
create table public.test_account_cleanup_state (
  id boolean primary key default true check(id), last_success_at timestamptz, last_monitor_at timestamptz
);
insert into public.test_account_cleanup_state(id) values(true);
create function public.guard_test_account_analysis() returns trigger language plpgsql set search_path = pg_catalog, public as $$
begin
  if TG_OP = 'UPDATE' then raise exception 'Saved analyses are immutable'; end if;
  if not exists(select 1 from public.test_account_erasure_receipts where generation_id = OLD.generation_id) then
    raise exception 'External erasure receipt required before deletion';
  end if;
  return OLD;
end $$;
create trigger test_account_analysis_guard before delete or update on public.test_account_analyses
for each row execute function public.guard_test_account_analysis();
alter table public.test_account_attempts enable row level security;
alter table public.test_account_purchases enable row level security;
alter table public.test_account_analyses enable row level security;
alter table public.test_account_erasure_receipts enable row level security;
alter table public.test_account_cleanup_state enable row level security;
-- Deliberately no client policies. All access uses the server, with explicit owner predicates.
revoke all on public.test_account_attempts, public.test_account_purchases, public.test_account_analyses,
  public.test_account_erasure_receipts, public.test_account_cleanup_state from public, anon, authenticated;
revoke all on function public.guard_test_account_analysis() from public, anon, authenticated;
