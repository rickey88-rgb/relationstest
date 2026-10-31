/* eslint-disable @typescript-eslint/no-require-imports -- synthetic return, Auth and real-report UI regression. */
const assert=require('node:assert/strict'),path=require('node:path'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server'),createLoader=require('../autism-test/test/test-loader.cjs');
const load=createLoader(),models=load(path.join(__dirname,'../_lib/testAccounts/adapter.ts')).registeredAdapters();
const {describeAnswers}=load(path.join(__dirname,'../_lib/testAccounts/answerDescriptions.ts'));
const id='11111111-1111-4111-8111-111111111111';
const session=user=>({user:{id:user,email:user+'@example.invalid'}});
function fixture(product){const model=models.find(m=>m.product===product);let answers;
 for(let n=1;n<=100;n++){try{const value=Array(n).fill(0);model.parse({answers:value,questionVersion:model.questionVersion,reportVersion:model.reportVersion});answers=value;break;}catch{}}
 assert(answers);return {product,title:model.title,result:model.calculate(answers),answers:describeAnswers(product,answers),expiresAt:'2026-11-06T12:00:00Z'};}
function harness(product,{failGuest=false,hash='#attempt='+id,pending=true,loginError=false,noSession=false,blockedStorage=false,deferGuest=false}={}){
 const slots=[],calls=[],cleanups=[];let cursor=0,effects=[],listener,tree,focused=0,scrolled=0,closed=false;
 const item={id,product},entry=fixture(product),list=[{id,product,purchased_at:'2026-10-31',expires_at:entry.expiresAt}],events=new Map();
 let completeGuest;const guestReady=deferGuest?new Promise(resolve=>{completeGuest=resolve;}):Promise.resolve();
 const changed=(a,b)=>!a||!b||a.length!==b.length||a.some((v,i)=>v!==b[i]);
 const memo=(fn,deps)=>{const i=cursor++;if(!slots[i]||changed(slots[i].deps,deps))slots[i]={value:fn,deps};return slots[i].value;};
 global.window={location:{hash,origin:'https://synthetic.example.invalid'},addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:(name,fn)=>{if(events.get(name)===fn)events.delete(name);}};
 global.history={replaceState:()=>{window.location.hash='';}};
 const parseLogin=createLoader({'@supabase/supabase-js':{}})(path.join(__dirname,'../_lib/testAccounts/directClient.ts')).readLoginFragment;
 const client={directAuthClient:()=>{if(blockedStorage)throw Error('Synthetic Safari storage denial');return {auth:{onAuthStateChange:fn=>{listener=fn;return {data:{subscription:{unsubscribe:()=>{closed=true;}}}}},signOut:async()=>{listener('SIGNED_OUT',null);return {};},
  verifyOtp:async body=>{calls.push({body:{action:'verifyOtp',...body}});assert.equal(body.type,'email');if(loginError)return {error:{code:'otp_expired'},data:{session:null,user:null}};
   if(noSession)return {error:null,data:{session:null,user:null}};const value=session('account-a');listener('SIGNED_IN',value);return {error:null,data:{session:value,user:value.user}};}}};},
  pendingPurchase:()=>pending?item:null,pendingPurchases:()=>pending?[item]:[],forgetPending:()=>{},readLoginFragment:parseLogin,directLoginRedirect:()=>'/mina-sidor#login',
  directRequest:async(body,options)=>{calls.push({body,options});if(body.action==='capabilities')return {tests:models,consentVersion:'test-account-storage-v1'};
   if(body.action==='guest'){assert.deepEqual(options,{possession:true});await guestReady;if(failGuest)throw Error('Synthetic unpaid, refunded or unavailable');return entry;}
   if(body.action==='open'){assert.deepEqual(options,{authenticated:true});return entry;}
   if(body.action==='list')return {purchases:list};if(body.action==='save'){assert.equal(body.consent,'test-account-storage-v1');assert.deepEqual(options,{authenticated:true,possession:true});return {saved:true};}
   throw Error('Unexpected synthetic request');}};
 const Component=createLoader({react:{...React,
  useState:initial=>{const i=cursor++;if(!Object.hasOwn(slots,i))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value;}];},
  useRef:initial=>{const i=cursor++;if(!slots[i])slots[i]={current:initial};return slots[i];},useCallback:memo,
  useEffect:(fn,deps)=>{const i=cursor++;if(!slots[i]||changed(slots[i].deps,deps)){slots[i]={deps};effects.push(fn);}},
 },'../_lib/testAccounts/directClient':client})(path.join(__dirname,'DirectAccountPortal.tsx')).default;
 function walk(node,fn){if(!node||typeof node!=='object')return;if(Array.isArray(node))return node.forEach(n=>walk(n,fn));fn(node);walk(node.props?.children,fn);}
 function render(){cursor=0;effects=[];tree=Component();walk(tree,node=>{if(node.props&&Object.hasOwn(node.props,'data-paid-analysis'))node.props.ref.current={focus:()=>{focused++;},scrollIntoView:options=>{assert.equal(options.block,'start');scrolled++;}};});return renderToStaticMarkup(tree);}
 async function settle(){for(let n=0;n<4;n++){const pendingEffects=effects;effects=[];for(const effect of pendingEffects){const cleanup=effect();if(typeof cleanup==='function')cleanups.push(cleanup);}await Promise.resolve();await Promise.resolve();render();}return render();}
 function find(predicate){let found;walk(tree,node=>{if(predicate(node))found=node;});assert(found,'element must exist');return found;}
 function text(node){return Array.isArray(node)?node.map(text).join(''):node&&typeof node==='object'?text(node.props?.children):typeof node==='string'||typeof node==='number'?String(node):'';}
 return {entry,calls,render,settle,event:value=>listener('AUTH',value),focus:()=>({focused,scrolled}),
  click:async label=>{const button=find(n=>n.type==='button'&&text(n.props.children)===label);assert(!button.props.disabled);button.props.onClick();return settle();},
  consent:value=>{find(n=>n.type==='input'&&n.props.type==='checkbox').props.onChange({target:{checked:value}});render();},
  returnHash:(value,event='hashchange')=>{window.location.hash=value;events.get(event)?.();render();},resolveGuest:()=>completeGuest?.(),
  cleanup:()=>{cleanups.forEach(fn=>fn());assert.equal(events.size,0);assert(closed||blockedStorage);}};
}
async function renderVerifiedReturn(product='adhd_test'){const h=harness(product);h.render();await h.settle();return h.render();}
async function run(){
 for(const model of models){const h=harness(model.product);let html=h.render();assert(!html.includes('Betalningen lyckades'));assert(!html.includes('Logga in med en mejllänk'));
  html=await h.settle();const report=html.indexOf('data-paid-analysis'),save=html.indexOf('Spara frivilligt'),login=html.indexOf('Logga in med en mejllänk');
  assert(report>=0&&report<save&&save<login,model.product+' displays report before storage and login');
  assert(html.includes('Betalningen lyckades! Här är din personliga analys.'));assert(!html.includes('<h1 class="mt-3'));
  assert(html.indexOf('Alla dina testsvar')<save,'all answer access precedes storage');
  assert(!h.calls.some(c=>c.body.action==='save'||c.body.action==='list'),'guest result needs neither account nor automatic saving');
  assert.equal(h.calls.filter(c=>c.body.action==='guest').length,1);assert.equal(h.focus().focused,1);assert.equal(h.focus().scrolled,1);
  h.event(session('account-a'));await h.settle();assert(h.render().includes('data-paid-analysis'),'late INITIAL_SESSION must not erase verified guest result');
  h.consent(true);html=await h.click('Spara svar och analys på kontot');assert(html.includes('data-paid-analysis'));assert(!html.includes('Spara frivilligt'));
  assert.equal(h.calls.filter(c=>c.body.action==='save').length,1);
  h.event(session('account-b'));await h.settle();assert(!h.render().includes('data-paid-analysis'),'account change clears account-owned result');
  h.event(session('account-a'));await h.settle();
  html=await h.click('Öppna svar och analys');assert(html.includes('data-paid-analysis'));assert(!html.includes('Betalningen lyckades'),'owned reopening is not a new payment');
  h.event(null);await h.settle();assert(!h.render().includes('data-paid-analysis'),'logout clears account-owned result');h.cleanup();
 }
 for(const options of [{failGuest:true},{hash:'#attempt=22222222-2222-4222-8222-222222222222'},{pending:false}]){
  const h=harness('adhd_test',options);h.render();const html=await h.settle();assert(!html.includes('data-paid-analysis'));assert(!html.includes('Betalningen lyckades'));assert(html.includes('Mina sidor'));h.cleanup();}
 console.log('PASS: all 15 real report returns: verified result first, no pre-result login/storage, focus/scroll, full answers, explicit save, late Auth, ownership switch/logout, reopening and rejected/unmatched purchase.');
}
if(require.main===module)run().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={renderVerifiedReturn,fixture,harness};
