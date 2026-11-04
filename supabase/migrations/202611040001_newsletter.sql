begin;

-- Independent opt-in register: deliberately no foreign keys to customers,
-- payments, accounts, tests or analyses. Existing addresses are NOT imported.
create table public.newsletter_subscribers (
  id uuid primary key,
  email text not null unique check (email = lower(btrim(email)) and length(email) <= 254),
  status text not null default 'pending' check (status in ('pending', 'active', 'unsubscribed')),
  source text not null check (source in ('home', 'article', 'footer', 'result')),
  consent_version text not null,
  consent_text text not null,
  legal_basis text not null default 'consent' check (legal_basis = 'consent'),
  registered_at timestamptz not null default now(),
  requested_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  confirmation_hash text unique,
  confirmation_expires_at timestamptz,
  unsubscribe_nonce uuid not null,
  check (status <> 'active' or (confirmed_at is not null and unsubscribed_at is null)),
  check ((confirmation_hash is null) = (confirmation_expires_at is null))
);
create index newsletter_active_source on public.newsletter_subscribers (source, confirmed_at) where status = 'active';

create table public.newsletter_rate_limits (
  key_hash text primary key,
  window_start timestamptz not null,
  attempts integer not null check (attempts > 0)
);
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_rate_limits enable row level security;
revoke all on public.newsletter_subscribers, public.newsletter_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.newsletter_subscribers, public.newsletter_rate_limits to service_role;
-- No public policies: access is through server DATABASE_URL only.
commit;
