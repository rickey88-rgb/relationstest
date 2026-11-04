import postgres from "postgres";
import { randomUUID } from "node:crypto";
import { NEWSLETTER_CONSENT_TEXT, NEWSLETTER_CONSENT_VERSION, type NewsletterSource } from "./newsletter";

type Sql = ReturnType<typeof postgres>;
const globals = globalThis as typeof globalThis & { newsletterSql?: Sql };
function database() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("Newsletter unavailable");
  return globals.newsletterSql ??= postgres(url, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10, ssl: "verify-full" });
}

export async function newsletterRateLimit(keyHash: string, maximum: number) {
  const rows = await database()<{ attempts: number }[]>`
    insert into public.newsletter_rate_limits (key_hash, window_start, attempts) values (${keyHash}, now(), 1)
    on conflict (key_hash) do update set
      attempts = case when newsletter_rate_limits.window_start < now() - interval '1 hour' then 1 else newsletter_rate_limits.attempts + 1 end,
      window_start = case when newsletter_rate_limits.window_start < now() - interval '1 hour' then now() else newsletter_rate_limits.window_start end
    returning attempts`;
  return rows[0].attempts <= maximum;
}

/** The locked row reserves one confirmation email for each 15-minute window. */
export async function requestNewsletterConfirmation(email: string, source: NewsletterSource, tokenHash: string) {
  return database().begin(async tx => {
    await tx`insert into public.newsletter_subscribers
      (id, email, source, consent_version, consent_text, unsubscribe_nonce)
      values (${randomUUID()}, ${email}, ${source}, ${NEWSLETTER_CONSENT_VERSION}, ${NEWSLETTER_CONSENT_TEXT}, ${randomUUID()})
      on conflict (email) do nothing`;
    const rows = await tx<{ id: string; status: string; requested_at: Date; confirmation_hash: string | null }[]>`
      select id, status, requested_at, confirmation_hash from public.newsletter_subscribers where email = ${email} for update`;
    const row = rows[0];
    if (row.status === "active" || (row.confirmation_hash && new Date(row.requested_at).getTime() > Date.now() - 15 * 60_000)) return null;
    await tx`update public.newsletter_subscribers set confirmation_hash = ${tokenHash},
      confirmation_expires_at = now() + interval '24 hours', requested_at = now(),
      source = ${source}, consent_version = ${NEWSLETTER_CONSENT_VERSION}, consent_text = ${NEWSLETTER_CONSENT_TEXT}
      where id = ${row.id}`;
    return row.id;
  });
}

export async function confirmNewsletter(tokenHash: string) {
  const rows = await database()<{ source: NewsletterSource }[]>`
    update public.newsletter_subscribers set status = 'active', confirmed_at = now(), unsubscribed_at = null,
      registered_at = requested_at, unsubscribe_nonce = ${randomUUID()}, confirmation_hash = null, confirmation_expires_at = null
    where confirmation_hash = ${tokenHash} and confirmation_expires_at > now() and status <> 'active'
    returning source`;
  return rows[0]?.source ?? null;
}

export async function unsubscribeNewsletter(id: string, nonce: string) {
  const rows = await database()<{ id: string }[]>`
    update public.newsletter_subscribers set status = 'unsubscribed', unsubscribed_at = coalesce(unsubscribed_at, now()),
      confirmation_hash = null, confirmation_expires_at = null
    where id = ${id} and unsubscribe_nonce = ${nonce} returning id`;
  return rows.length === 1;
}

/** Server-only campaign selection. Recheck status immediately before each send. */
export async function newsletterRecipients(afterId = "00000000-0000-0000-0000-000000000000", limit = 100) {
  return database()<{ id: string; email: string; unsubscribe_nonce: string }[]>`
    select id, email, unsubscribe_nonce from public.newsletter_subscribers
    where status = 'active' and confirmed_at is not null and unsubscribed_at is null
      and legal_basis = 'consent' and consent_version = ${NEWSLETTER_CONSENT_VERSION} and id > ${afterId}
    order by id limit ${Math.max(1, Math.min(100, limit))}`;
}

/** Run daily before activation; deliberately touches newsletter tables only. */
export async function cleanupNewsletter() {
  await database()`delete from public.newsletter_rate_limits where window_start < now() - interval '48 hours'`;
  await database()`delete from public.newsletter_subscribers
    where (status = 'pending' and requested_at < now() - interval '30 days')
       or (status = 'unsubscribed' and unsubscribed_at < now() - interval '30 days')`;
}
