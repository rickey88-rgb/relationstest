/* eslint-disable @typescript-eslint/no-require-imports -- manually reviewed operator plan, never an application endpoint. */
const assert=require('node:assert/strict');
/** Generates a parameterized one-row reset only. No database connection or execution. */
function plan({attemptId,sessionId,oldHash,newHash,product}){
 assert.match(attemptId,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
 assert.match(sessionId,/^cs_(?:live|test)_[A-Za-z0-9]+$/);assert.equal(product,'autism_test');
 assert.match(oldHash,/^[a-f0-9]{64}$/);assert.match(newHash,/^[a-f0-9]{64}$/);assert.notEqual(oldHash,newHash);
 return {lock:'select id from public.test_account_attempts where id=$1 for update',lockValues:[attemptId],
  sql:`update public.test_account_attempts a set browser_hash=$1 where a.id=$2 and a.session_id=$3 and a.product=$4
   and a.browser_hash=$5 and a.expires_at>now()
   and not exists(select 1 from public.test_account_purchases p where p.id=a.id)
   and not exists(select 1 from public.test_account_erasure_receipts r where r.generation_id=a.analysis_id)
   returning a.id`,values:[newHash,attemptId,sessionId,product,oldHash]};
}
module.exports={plan};
