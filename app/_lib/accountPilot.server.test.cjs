/* eslint-disable @typescript-eslint/no-require-imports -- synthetic pilot admission regression. */
const assert=require('node:assert/strict'),path=require('node:path');
const createLoader=require('../autism-test/test/test-loader.cjs');
const pilot=createLoader()(path.join(__dirname,'accountPilot.server.ts'));
const a={id:'11111111-1111-4111-8111-111111111111',email:'pilot-a@example.test'},b={id:'22222222-2222-4222-8222-222222222222',email:'pilot-b@example.test'};
const verified=u=>({...u,email_confirmed_at:'2026-10-30T00:00:00Z',is_anonymous:false});
delete process.env.ACCOUNT_PILOT_USERS_JSON;
assert(pilot.accountPilotEmailAllowed('legacy@example.test'));
assert(pilot.accountPilotUserAllowed(verified(a)));
process.env.ACCOUNT_PILOT_USERS_JSON=JSON.stringify([a,b]);
for(const u of [a,b]){assert(pilot.accountPilotEmailAllowed(u.email.toUpperCase()));assert(pilot.accountPilotUserAllowed(verified(u)));}
assert(!pilot.accountPilotEmailAllowed('outsider@example.test'));
for(const u of [null,verified({...a,id:'33333333-3333-4333-8333-333333333333'}),verified({...a,email:b.email}),{...verified(a),email_confirmed_at:undefined},{...verified(a),is_anonymous:true}])assert(!pilot.accountPilotUserAllowed(u));
for(const raw of ['', 'null','{}','[{}]',JSON.stringify([a]),JSON.stringify([a,a]),JSON.stringify([a,{...b,email:a.email}]),JSON.stringify([a,{...b,id:'bad'}]),JSON.stringify([a,{...b,extra:true}]),'x'.repeat(2049)]){
 process.env.ACCOUNT_PILOT_USERS_JSON=raw;assert(!pilot.accountPilotEmailAllowed(a.email));assert(!pilot.accountPilotUserAllowed(verified(a)));
}
console.log('PASS: two verified UUID/email pairs only; malformed lists fail closed; absent list preserves existing behavior; matching email alone never grants entry.');
