-- ISOLATED TEST PROJECT ONLY. Intentionally outside supabase/migrations.
-- Reviewed manual application only; never run against the production project.
BEGIN;
CREATE ROLE persona_v61_backend NOLOGIN NOINHERIT NOSUPERUSER NOBYPASSRLS;
CREATE SCHEMA persona_v61_test;
REVOKE ALL ON SCHEMA persona_v61_test FROM PUBLIC, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA persona_v61_test TO persona_v61_backend;
CREATE TABLE persona_v61_test.results (
  id uuid PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  revision integer NOT NULL CHECK (revision >= 1),
  product text NOT NULL CHECK (product = 'persona_test'),
  question_version text NOT NULL CHECK (question_version = 'persona-questions-v3'),
  report_version text NOT NULL CHECK (report_version = 'persona-report-v61-release1'),
  ciphertext text NOT NULL CHECK (length(ciphertext) BETWEEN 1 AND 8192),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL CHECK (updated_at >= created_at)
);
CREATE INDEX persona_v61_results_owner_updated ON persona_v61_test.results(owner_id, updated_at DESC, id);
ALTER TABLE persona_v61_test.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_v61_test.results FORCE ROW LEVEL SECURITY;
CREATE POLICY persona_v61_owner ON persona_v61_test.results TO persona_v61_backend
  USING (owner_id = nullif(current_setting('persona_v61_test.owner_id', true), '')::uuid)
  WITH CHECK (owner_id = nullif(current_setting('persona_v61_test.owner_id', true), '')::uuid);
REVOKE ALL ON persona_v61_test.results FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON persona_v61_test.results TO persona_v61_backend;
-- Do not grant this backend role to anon, authenticated, service_role or authenticator.
-- A dedicated test-only runtime LOGIN role is provisioned separately after approval.
COMMIT;
