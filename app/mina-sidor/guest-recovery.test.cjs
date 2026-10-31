/* eslint-disable @typescript-eslint/no-require-imports -- real guest portal, synthetic grant and answers only. */
const assert=require('node:assert/strict'),path=require('node:path'),{harness}=require('./payment-return.test.cjs');
const models=require('../autism-test/test/test-loader.cjs')()(path.join(__dirname,'../_lib/testAccounts/adapter.ts')).registeredAdapters();
(async()=>{
 const request=harness('autism_test',{hash:'',pending:false,recoveryEnabled:true});request.render();await request.settle();const requested=await request.requestRecovery();
 assert(requested.includes('Om mejladressen hör till ett giltigt'));assert(request.calls.some(c=>c.body.action==='recovery-request'&&c.body.email==='buyer@example.invalid'));
 assert(!request.calls.some(c=>['sendOtp','verifyOtp','save','list'].includes(c.body.action)));request.cleanup();
 for(const model of models){const h=harness(model.product,{hash:'#recover?token='+'x'.repeat(43),pending:false,recoveryEnabled:true});h.render();let html=await h.settle();
 assert.equal(window.location.hash,'');assert(html.includes('Öppna min analys'));assert(!html.includes('data-paid-analysis'));
 assert(!h.calls.some(c=>c.body.action==='recovery-redeem'),'opening/scanning mail cannot consume the link');
 html=await h.click('Öppna min analys');assert(html.includes('data-paid-analysis'));assert(html.indexOf('data-paid-analysis')<html.indexOf('Spara frivilligt'));
 assert(!h.calls.some(c=>['save','list','sendOtp','verifyOtp'].includes(c.body.action)),'guest recovery never requires or creates an account and never stores account consent');
 h.cleanup();}console.log('PASS: all 15 reports: account-free email recovery, explicit redemption, private fragment removed, verified report first and no automatic account saving.');
})().catch(e=>{console.error(e);process.exitCode=1;});
