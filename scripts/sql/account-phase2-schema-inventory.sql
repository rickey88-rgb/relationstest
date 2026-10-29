-- METADATA ONLY. Execute with a read-only production connection.
-- No customer rows, Auth identities, payment rows or answer ciphertext are read.
begin read only;
set local statement_timeout = '15s';
set local lock_timeout = '2s';

with targets(schema_name, table_name) as (values
  ('auth','users'), ('public','stripe_payments'),
  ('public','audhd_checkout_attempts'), ('public','audhd_recovery_grants'),
  ('public','account_purchases'), ('public','account_audhd_analyses'),
  ('public','account_analysis_cleanup_state'),
  ('public','account_analysis_erasure_receipts'),
  ('supabase_migrations','schema_migrations')
), relations as (
  select t.*, c.oid, c.relkind, c.relrowsecurity, c.relforcerowsecurity,
    pg_get_userbyid(c.relowner) as owner_role
  from targets t
  left join pg_namespace n on n.nspname = t.schema_name
  left join pg_class c on c.relnamespace = n.oid and c.relname = t.table_name
)
select jsonb_build_object(
  'captured_at', now(),
  'read_only', current_setting('transaction_read_only'),
  'database_version', current_setting('server_version'),
  'tables', (select jsonb_agg(to_jsonb(r) - 'oid') from relations r),
  'columns', (select jsonb_agg(jsonb_build_object(
      'schema',r.schema_name,'table',r.table_name,'name',a.attname,
      'type',format_type(a.atttypid,a.atttypmod),'not_null',a.attnotnull,
      'default',pg_get_expr(d.adbin,d.adrelid)))
    from relations r join pg_attribute a on a.attrelid=r.oid and a.attnum>0 and not a.attisdropped
    left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
    where r.schema_name <> 'auth' or a.attname='id'),
  'constraints', (select jsonb_agg(jsonb_build_object('schema',r.schema_name,'table',r.table_name,
      'name',c.conname,'validated',c.convalidated,'definition',pg_get_constraintdef(c.oid)))
    from relations r join pg_constraint c on c.conrelid=r.oid where r.schema_name='public'),
  'indexes', (select jsonb_agg(jsonb_build_object('schema',r.schema_name,'table',r.table_name,
      'valid',i.indisvalid,'ready',i.indisready,'definition',pg_get_indexdef(i.indexrelid)))
    from relations r join pg_index i on i.indrelid=r.oid where r.schema_name='public'),
  'policies', (select jsonb_agg(to_jsonb(p)) from pg_policies p
    join targets t on p.schemaname=t.schema_name and p.tablename=t.table_name where t.schema_name='public'),
  'grants', (select jsonb_agg(to_jsonb(g)) from information_schema.role_table_grants g
    join targets t on g.table_schema=t.schema_name and g.table_name=t.table_name where t.schema_name='public'),
  'public_schema_default_acls', (select jsonb_agg(jsonb_build_object('owner',pg_get_userbyid(d.defaclrole),
      'object_type',d.defaclobjtype,'acl',d.defaclacl::text)) from pg_default_acl d
    join pg_namespace n on n.oid=d.defaclnamespace where n.nspname='public'),
  'triggers', (select jsonb_agg(jsonb_build_object('schema',r.schema_name,'table',r.table_name,
      'name',t.tgname,'enabled',t.tgenabled,'function',p.proname))
    from relations r join pg_trigger t on t.tgrelid=r.oid and not t.tgisinternal
    join pg_proc p on p.oid=t.tgfoid where r.schema_name='public')
) as schema_inventory;

rollback;
