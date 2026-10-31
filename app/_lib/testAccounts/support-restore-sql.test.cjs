/* eslint-disable @typescript-eslint/no-require-imports -- isolated SQL reset guards and stale-proof revocation. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{PGlite}=require('@electric-sql/pglite');
const {plan}=require('../../../scripts/support-restore-plan.cjs');
const id='11111111-1111-4111-8111-111111111111',generation='22222222-2222-4222-8222-222222222222',owner='33333333-3333-4333-8333-333333333333',oldHash='a'.repeat(64),newHash='b'.repeat(64);
(async()=>{const db=new PGlite();try{
 await db.exec('create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);');
 await db.exec(fs.readFileSync(path.resolve(__dirname,'../../../supabase/migrations/202610260001_test_accounts.sql'),'utf8'));
 await db.query('insert into auth.users values($1)',[owner]);
 await db.query(`insert into test_account_attempts(id,analysis_id,product,question_version,report_version,browser_hash,journal_identity,ciphertext,session_id,price_id,live_mode,created_at,expires_at)
 values($1,$2,'autism_test','autism-questions-v1','autism-report-v1',$3,'synthetic','encrypted-unchanged','cs_test_synthetic','price_synthetic',true,now(),now()+interval '1 day')`,[id,generation,oldHash]);
 const request=plan({attemptId:id,sessionId:'cs_test_synthetic',product:'autism_test',oldHash,newHash});
 const before=(await db.query('select * from test_account_attempts')).rows[0];
 async function reset(){return db.transaction(async tx=>{await tx.query(request.lock,request.lockValues);return (await tx.query(request.sql,request.values)).rows.length;});}
 await db.query('insert into test_account_purchases values($1,$2,$3,$4,$5,$6,now(),3900,$7)',[id,owner,'autism_test','cs_test_synthetic','price_synthetic','pi_synthetic','sek']);
 assert.equal(await reset(),0,'claimed purchase must never reset to a guest holder');await db.query('delete from test_account_purchases');
 await db.query('insert into test_account_erasure_receipts values($1,now())',[generation]);assert.equal(await reset(),0,'deleted analysis never revived');await db.query('delete from test_account_erasure_receipts');
 await db.query("update test_account_attempts set created_at=now()-interval '2 days',expires_at=now()-interval '1 day'");assert.equal(await reset(),0,'expired analyses cannot be extended');
 await db.query('update test_account_attempts set created_at=$1,expires_at=$2',[before.created_at,before.expires_at]);
 assert.equal(await reset(),1);assert.equal(await reset(),0,'same approved reset cannot replay');
 const after=(await db.query('select * from test_account_attempts')).rows[0];const {browser_hash:old,...restBefore}=before,{browser_hash:changed,...restAfter}=after;
 assert.equal(old,oldHash);assert.equal(changed,newHash);assert.deepEqual(restAfter,restBefore,'answers, payment binding, expiry and all other fields unchanged');
 const createLoader=require('../../autism-test/test/test-loader.cjs'),load=createLoader(),store=load(path.join(__dirname,'store.server.ts'));
 function sql(connection){const tag=async(strings,...values)=>(await connection.query(strings.reduce((out,part,i)=>out+(i?'$'+i:'')+part,''),values)).rows;tag.begin=callback=>db.transaction(tx=>callback(sql(tx)));return tag;}
 global.testAccountsSql=sql(db);process.env.ACCOUNT_PORTAL_ENABLED='true';
 await assert.rejects(store.claim(before,owner,'pi_stale',new Date(),'saved-synthetic'),/Attempt changed/,'in-flight claim carrying revoked proof must fail after reset');
 assert.equal((await db.query('select count(*)::int as n from test_account_purchases')).rows[0].n,0);
 assert(fs.readFileSync(path.join(__dirname,'service.server.ts'),'utf8').includes('current.browser_hash !== row.browser_hash'));
 assert(fs.readFileSync(path.join(__dirname,'store.server.ts'),'utf8').includes('current[0]?.browser_hash !== row.browser_hash'));
 console.log('PASS: one-row reset rejects owned/deleted/expired/replayed targets; ciphertext/Stripe/retention unchanged; stale guest/save proof rechecked. No production connection or data.');
 }finally{delete global.testAccountsSql;await db.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
