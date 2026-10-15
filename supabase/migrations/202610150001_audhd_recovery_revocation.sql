-- Recovery links are payment entitlements and must be revocable alongside the
-- browser-bound checkout access when Stripe reports a refund or dispute.
create index if not exists audhd_recovery_grants_payment_intent_idx
  on public.audhd_recovery_grants (stripe_payment_intent_id)
  where revoked_at is null;
