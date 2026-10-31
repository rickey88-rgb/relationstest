-- Local preparation only. No production execution is authorized by this delivery.
begin;
create table public.test_guest_recovery (
  attempt_id uuid primary key references public.test_account_attempts(id) on delete cascade,
  email_hash text not null check (email_hash ~ '^[a-f0-9]{64}$'),
  expires_at timestamptz not null,
  token_hash text unique check (token_hash ~ '^[a-f0-9]{64}$'),
  token_expires_at timestamptz,
  browser_hash_at_issue text check (browser_hash_at_issue ~ '^[a-f0-9]{64}$'),
  last_sent_at timestamptz,
  window_started_at timestamptz not null default now(),
  send_count integer not null default 0 check(send_count between 0 and 3),
  check ((token_hash is null and token_expires_at is null and browser_hash_at_issue is null)
    or (token_hash is not null and token_expires_at is not null and browser_hash_at_issue is not null and token_expires_at<=expires_at))
);
create index test_guest_recovery_email on public.test_guest_recovery(email_hash,expires_at);
alter table public.test_guest_recovery enable row level security;
revoke all on public.test_guest_recovery from public,anon,authenticated;
commit;
