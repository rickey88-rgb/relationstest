/* eslint-disable @typescript-eslint/no-require-imports -- synthetic runtime compatibility check. */
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const createLoader=require('../../autism-test/test/test-loader.cjs');
const original=process.env;let observed;
const fake=Object.freeze({SUPABASE_DB_URL:'postgresql://synthetic:synthetic@synthetic.invalid:5432/postgres'});
const tls={rejectUnauthorized:true,ca:'synthetic-public-ca',checkServerIdentity:()=>{}};
const load=createLoader({postgres:{default:(url,options)=>{observed={url,options};return {};}},'../accountDatabaseTls.server':{accountDatabaseTls:()=>tls},'../accountCleanupScope.server':{assertAccountDatabaseAccess:()=>{}}});
try {
  // Hosted Supabase rejects runtime environment writes; model that restriction.
  process.env=fake;delete global.testAccountsSql;
  load(path.join(__dirname,'store.server.ts')).db();
  assert.equal(observed.url,fake.SUPABASE_DB_URL);assert.equal(observed.options.ssl,tls);
  assert.equal(observed.options.ssl.rejectUnauthorized,true);assert.equal(observed.options.prepare,false);
  delete global.testAccountsSql;
  process.env=Object.freeze({...fake,DATABASE_URL:'postgresql://synthetic:synthetic@explicit.invalid:5432/postgres'});
  load(path.join(__dirname,'store.server.ts')).db();assert(observed.url.includes('explicit.invalid'));
  const entry=fs.readFileSync(path.resolve(__dirname,'../../../supabase/functions/customer-tests/index.ts'),'utf8');
  assert(!/process\.env[^\n]*=(?!=)|Deno\.env\.set\(/.test(entry),'Entrypoint must not write runtime secrets');
  console.log('PASS: read-only Edge environment, platform database fallback, explicit connection precedence and unchanged strict TLS.');
} finally {process.env=original;delete global.testAccountsSql;}
