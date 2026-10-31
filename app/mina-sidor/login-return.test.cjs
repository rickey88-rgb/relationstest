/* eslint-disable @typescript-eslint/no-require-imports -- synthetic email return and owned-result interaction. */
const assert=require('node:assert/strict'),{harness}=require('./payment-return.test.cjs');
const hash='#login?token_hash='+'a'.repeat(64)+'&type=email';
const confirms=html=>html.includes('Bekräfta din inloggning');
(async()=>{
 for(const event of ['initial','hashchange','pageshow']){
  const h=harness('adhd_test',{pending:false,hash:event==='initial'?hash:''});h.render();let html=await h.settle();
  if(event!=='initial'){assert(html.includes('Logga in med en mejllänk'));h.returnHash(hash,event);html=await h.settle();}
  assert(confirms(html),event+' recognizes email callback');assert(!html.includes('Logga in med en mejllänk'));assert.equal(window.location.hash,'');
  assert.equal(h.calls.filter(x=>x.body.action==='verifyOtp').length,0,'GET/scanning never consumes OTP');
  html=await h.click('Logga in');assert(html.includes('Inloggad som account-a@example.invalid'));assert(!confirms(html));
  assert(h.calls.some(x=>x.body.action==='list'&&x.options.authenticated));assert.equal(h.calls.filter(x=>x.body.action==='verifyOtp').length,1);
  html=await h.click('Öppna svar och analys');assert(html.includes('data-paid-analysis')&&html.includes('Alla dina testsvar (30)'));
  h.event(null);await h.settle();assert(!h.render().includes('data-paid-analysis'));h.cleanup();
 }
 const saved=harness('adhd_test',{hash:''});saved.render();await saved.settle();assert(saved.render().includes('data-paid-analysis'));
 saved.returnHash(hash);await saved.settle();assert(!saved.render().includes('data-paid-analysis'),'confirmation must not be buried below an old guest report');
 await saved.click('Logga in');await saved.click('Öppna ADHD');saved.consent(true);await saved.click('Spara svar och analys på kontot');
 assert(saved.calls.some(x=>x.body.action==='save'&&x.body.consent==='test-account-storage-v1'));
 saved.event(null);await saved.settle();saved.returnHash(hash);await saved.settle();await saved.click('Logga in');
 const reopened=await saved.click('Öppna svar och analys');assert(reopened.includes('Alla dina testsvar (30)'));saved.cleanup();
 const slow=harness('adhd_test',{deferGuest:true});slow.render();await slow.settle();slow.returnHash(hash);await slow.settle();slow.resolveGuest();
 await slow.settle();assert(confirms(slow.render())&&!slow.render().includes('data-paid-analysis'),'late guest response cannot obscure email confirmation');slow.cleanup();
 const expired=harness('adhd_test',{pending:false,hash,loginError:true});expired.render();await expired.settle();const failed=await expired.click('Logga in');
 assert(failed.includes('har gått ut eller har redan använts'));assert(!confirms(failed));assert(failed.includes('Logga in med en mejllänk'));assert(!expired.calls.some(x=>x.body.action==='list'));expired.cleanup();
 const absent=harness('adhd_test',{pending:false,hash,noSession:true});absent.render();await absent.settle();const missing=await absent.click('Logga in');assert(confirms(missing));assert(!missing.includes('Du är inloggad.'));absent.cleanup();
 const blocked=harness('adhd_test',{pending:false,blockedStorage:true});blocked.render();assert((await blocked.settle()).includes('webbplatsdata tillåts'));blocked.cleanup();
 console.log('PASS: fresh/reused/Safari-restored email returns, explicit OTP confirmation, session/list/owned report, voluntary save/relogin, late-response guard, expired links, missing session and blocked storage.');
})().catch(error=>{console.error(error);process.exitCode=1;});
