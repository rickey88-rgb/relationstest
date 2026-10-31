/* eslint-disable @typescript-eslint/no-require-imports -- private Safari tab isolation and same-tab Supabase OTP regression. */
const assert=require('node:assert/strict'),{harness}=require('./payment-return.test.cjs');
(async()=>{
 const purchaseTab=harness('adhd_test',{hash:''});purchaseTab.render();await purchaseTab.settle();
 assert(purchaseTab.render().includes('data-paid-analysis'));
 let html=await purchaseTab.sendCode();assert(html.includes('Skriv in koden från mejlet'));assert(/autocomplete="one-time-code"/i.test(html));assert(html.includes('data-paid-analysis'),'requesting a code keeps possession and verified report in the purchase tab');
 await purchaseTab.submitCode();assert(!purchaseTab.calls.some(c=>c.body.action==='verifyOtp'),'empty code never submitted');
 purchaseTab.enterCode('123 456');html=await purchaseTab.submitCode();assert(html.includes('Inloggad som'));assert(html.includes('data-paid-analysis'));
 assert(purchaseTab.calls.some(c=>c.body.action==='verifyOtp'&&c.body.email==='synthetic@example.invalid'&&c.body.token==='123456'));
 purchaseTab.consent(true);html=await purchaseTab.click('Spara svar och analys på kontot');assert(html.includes('data-paid-analysis'));assert(purchaseTab.calls.some(c=>c.body.action==='save'&&c.options.possession&&c.options.authenticated));
 purchaseTab.event(null);await purchaseTab.settle();await purchaseTab.sendCode();purchaseTab.enterCode('123456');await purchaseTab.submitCode();
 html=await purchaseTab.click('Öppna svar och analys');assert(html.includes('Alla dina testsvar (30)'));purchaseTab.cleanup();
 const separateTab=harness('adhd_test',{pending:false,hash:''});separateTab.render();await separateTab.settle();assert(!separateTab.render().includes('data-paid-analysis'),'a new private tab has no purchase possession');separateTab.cleanup();
 const expired=harness('adhd_test',{pending:false,hash:'',loginError:true});expired.render();await expired.settle();await expired.sendCode();expired.enterCode('123456');html=await expired.submitCode();assert(html.includes('Koden är felaktig'));assert(!html.includes('Inloggad som'));assert(html.includes('Skriv in koden från mejlet'));expired.cleanup();
 console.log('PASS: same-private-tab email code preserves verified purchase, explicit consent/save, logout/relogin/owned answers; no transfer by email/new tab and invalid code denied.');
})().catch(error=>{console.error(error);process.exitCode=1;});
