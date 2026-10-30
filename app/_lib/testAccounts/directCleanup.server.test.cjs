/* eslint-disable @typescript-eslint/no-require-imports -- synthetic credential-isolation regression. */
const assert=require('node:assert/strict'),path=require('node:path');
const load=require('../../autism-test/test/test-loader.cjs')();
const {forwardDirectCleanup}=load(path.join(__dirname,'directCleanup.server.ts'));
const originalFetch=global.fetch,originalEnv={...process.env};let calls=0,expected,healthy=false;
global.fetch=async(url,options)=>{calls++;assert.equal(new URL(url).origin,'https://synthetic.supabase.co');assert.equal(options.headers.Authorization,'Bearer '+expected);assert.equal(options.headers['x-region'],'eu-central-1');assert.equal(options.method,'POST');assert.equal(options.redirect,'error');assert.equal(options.body,undefined);return {ok:true,json:async()=>healthy?{healthy:true}:{ok:true}};};
(async()=>{
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://synthetic.supabase.co';process.env.CRON_SECRET='legacy-synthetic-'.repeat(4);process.env.TEST_ACCOUNTS_EDGE_CRON_SECRET='edge-synthetic-'.repeat(4);
 process.env.TEST_ACCOUNTS_EDGE_CLEANUP_ENABLED='false';assert.equal(await forwardDirectCleanup(false),null);assert.equal(calls,0);
 process.env.TEST_ACCOUNTS_EDGE_CLEANUP_ENABLED='true';expected=process.env.TEST_ACCOUNTS_EDGE_CRON_SECRET;assert.deepEqual(await forwardDirectCleanup(false),{ok:true});
 healthy=true;assert.deepEqual(await forwardDirectCleanup(true),{healthy:true});assert.equal(process.env.CRON_SECRET,'legacy-synthetic-'.repeat(4));
 process.env.TEST_ACCOUNTS_EDGE_CRON_SECRET='';await assert.rejects(forwardDirectCleanup(false),/^Error: Cleanup unavailable$/);assert.equal(calls,2);
 delete process.env.TEST_ACCOUNTS_EDGE_CRON_SECRET;expected=process.env.CRON_SECRET;healthy=false;assert.deepEqual(await forwardDirectCleanup(false),{ok:true});
 process.env.NEXT_PUBLIC_SUPABASE_URL='http://synthetic.supabase.co';await assert.rejects(forwardDirectCleanup(false));assert.equal(calls,3);
 console.log('PASS: dedicated Edge key; original scheduler key unchanged; flags off; invalid keys fail closed; HTTPS, legacy fallback and metadata-only requests preserved.');
})().catch(()=>{console.error('Synthetic regression failed; values withheld');process.exitCode=1;}).finally(()=>{global.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);});
