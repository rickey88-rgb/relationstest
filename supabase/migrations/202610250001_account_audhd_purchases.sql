-- LOCAL PROPOSAL ONLY. Apply to production only after explicit approval.
-- Purchase history and encrypted analysis payloads have separate lifecycles.
begin;

create table public.account_purchases (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null check (product_key = 'audhd_test'),
  stripe_checkout_session_id text not null unique check (stripe_checkout_session_id ~ '^cs_live_[A-Za-z0-9]+$'),
  stripe_payment_intent_id text not null check (stripe_payment_intent_id ~ '^pi_[A-Za-z0-9]+$'),
  stripe_price_id text not null check (stripe_price_id ~ '^price_[A-Za-z0-9]+$'),
  purchased_at timestamptz not null,
  amount_total_ore integer not null check (amount_total_ore > 0),
  currency text not null check (currency = 'sek'),
  linked_at timestamptz not null default now(),
  proof_kind text not null check (proof_kind in ('checkout', 'recovery')),
  revoked_at timestamptz,
  analysis_removed_at timestamptz,
  analysis_removal_reason text check (analysis_removal_reason in ('expired', 'user_deleted', 'revoked'))
);

create index account_purchases_owner_idx on public.account_purchases (user_id, purchased_at desc, id);

create table public.account_audhd_analyses (
  purchase_id uuid primary key references public.account_purchases(id) on delete cascade,
  generation_id uuid not null unique,
  journal_identity text not null check (journal_identity ~ '^[0-9a-f-]{36}:[0-9a-f]{64}$'),
  report_version text not null check (report_version = 'audhd-v1'),
  answers_ciphertext text not null check (length(answers_ciphertext) between 1 and 16384),
  encryption_iv text not null,
  encryption_auth_tag text not null,
  consent_version text not null check (consent_version = 'account-analysis-v1'),
  saved_at timestamptz not null default now(),
  -- Seven-day backup horizon plus cleanup/incident/purge margin.
  -- Show this exact, earlier expiry date to the customer. Never extend on retry.
  expires_at timestamptz not null default (now() + interval '12 months' - interval '10 days'),
  check (expires_at > saved_at and expires_at <= saved_at + interval '12 months' - interval '10 days')
);

create index account_audhd_analyses_expiry_idx on public.account_audhd_analyses (expires_at);

-- No customer data. Written in the same transaction as successful cleanup.
create table public.account_analysis_cleanup_state (
  job_key text primary key check (job_key = 'account-analysis-cleanup'),
  last_success_at timestamptz not null,
  last_monitor_success_at timestamptz
);

-- Local receipts only unlock DELETE after the server has persisted the external
-- receipt. The external journal, never this table, is authoritative on restore.
create table public.account_analysis_erasure_receipts (
  generation_id uuid primary key,
  recorded_at timestamptz not null default now()
);
create function public.guard_account_analysis_erasure() returns trigger
language plpgsql set search_path = pg_catalog, public as $$
begin
  if TG_OP = 'UPDATE' then
    if NEW.generation_id <> OLD.generation_id or NEW.journal_identity <> OLD.journal_identity then raise exception 'Immutable analysis generation'; end if;
    return NEW;
  end if;
  if not exists (select 1 from public.account_analysis_erasure_receipts where generation_id = OLD.generation_id) then
    raise exception 'External erasure receipt required before analysis deletion';
  end if;
  return OLD;
end;
$$;
create trigger guard_account_analysis_erasure
before delete or update on public.account_audhd_analyses
for each row execute function public.guard_account_analysis_erasure();
revoke all on function public.guard_account_analysis_erasure() from public, anon, authenticated;

-- No browser/Data API access. Authenticated routes query through DATABASE_URL
-- and ALWAYS constrain both the purchase id and authenticated Supabase user id.
alter table public.account_purchases enable row level security;
alter table public.account_audhd_analyses enable row level security;
alter table public.account_analysis_cleanup_state enable row level security;
alter table public.account_analysis_erasure_receipts enable row level security;
revoke all on public.account_purchases from public, anon, authenticated;
revoke all on public.account_audhd_analyses from public, anon, authenticated;
revoke all on public.account_analysis_cleanup_state from public, anon, authenticated;
revoke all on public.account_analysis_erasure_receipts from public, anon, authenticated;

commit;
