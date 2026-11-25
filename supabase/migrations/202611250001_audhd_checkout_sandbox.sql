-- Preview uses its own PostgreSQL database with the same checkout schema.
alter table public.audhd_checkout_attempts
  drop constraint audhd_checkout_attempts_stripe_checkout_session_id_check,
  add constraint audhd_checkout_attempts_stripe_checkout_session_id_check
  check (stripe_checkout_session_id is null or stripe_checkout_session_id like 'cs_live_%' or stripe_checkout_session_id ~ '^cs_test_[A-Za-z0-9]+$');
