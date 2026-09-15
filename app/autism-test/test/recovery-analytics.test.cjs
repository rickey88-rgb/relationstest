/* eslint-disable @typescript-eslint/no-require-imports -- Executable Node CommonJS test harness. */
// Run: node app/autism-test/test/recovery-analytics.test.cjs
// Exercise the unchanged shared hook with autism keys and a controlled browser/storage.
const assert = require('node:assert/strict');
const path = require('node:path');
const key='relationsvarning_autism_state_v1';
function environment({paid=false,blocked=false,silent=false}={}) {
  const data=new Map(), listeners=new Map(), effects=[], state=[];
  let unlocked=false;
  global.localStorage={getItem:k=>{if(blocked)throw Error('blocked');return data.get(k)??null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');if(!silent)data.set(k,v);},removeItem:k=>data.delete(k)};
  global.window={location:{href:'https://relationsvarning.se/autism-test/test'+(paid?'?paid=true':''),search:paid?'?paid=true':''},history:{replaceState:(...args)=>{const url=args[2];window.location.href='https://relationsvarning.se'+url;window.location.search=new URL(window.location.href).search;}},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
  const react={useRef:v=>({current:v}),useState:v=>{const index=state.length;state.push(v);return[v,next=>{state[index]=next;}];},useEffect:fn=>effects.push(fn)};
  const load=require('./test-loader.cjs')({react});
  const m=load(path.join(__dirname,'../../_components/usePaymentRecovery.ts'));
  const hook=m.usePaymentRecovery(key,false,value=>unlocked=value);
  const cleanup=effects.map(fn=>fn());
  return {data,listeners,state,hook,m,get unlocked(){return unlocked;},cleanup:()=>cleanup.forEach(fn=>fn?.())};
}
const saved={version:1,answers:Array(30).fill(2),index:29,unlocked:false};
let e=environment();
e.data.set('relationsvarning_adhd_state_v1:paid','true');
assert(e.hook.prepareCheckout(saved));
assert.deepEqual(JSON.parse(e.data.get(key)),saved);
assert(!e.hook.prepareCheckout(saved),'duplicate checkout rejected');
e.data.set(key+':paid','true');e.listeners.get('storage')({key:key+':paid'});
assert(e.unlocked,'old tab synchronizes');assert(!e.hook.prepareCheckout(saved));
assert.equal(e.data.get('relationsvarning_adhd_state_v1:paid'),'true');
e.cleanup();assert.equal(e.listeners.size,0);
e=environment({paid:true});assert(e.unlocked);assert.equal(e.data.get(key+':paid'),'true');assert(!e.hook.prepareCheckout(saved));
const persisted=e.data.get(key+':paid');
e=environment();e.data.set(key+':paid',persisted);e.listeners.get('pageshow')();assert(e.unlocked,'reload recovery');
e=environment({blocked:true});assert(!e.hook.prepareCheckout(saved));assert(e.state.some(v=>String(v).includes('kunde sparas')));
e=environment({silent:true});assert(!e.hook.prepareCheckout(saved),'silent storage failures rejected');
e=environment({blocked:true,paid:true});assert(e.unlocked);assert(window.location.search.includes('paid=true'));assert(!e.hook.prepareCheckout(saved));
e=environment();assert(!e.hook.prepareCheckout({...saved,answers:Array(30).fill(-1)}));

// All six analytics events, consent, deduplication, amount, identity and no answer data.
const store=new Map(), events=[];let consent='granted';
global.window={localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},sessionStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}}};
const load=require('./test-loader.cjs')({'./analytics':{ATTEMPT_PREFIX:'attempt:',consent:()=>consent,trackEvent:(name,params)=>{events.push({name,params});return true;}}});
const tracking=load(path.join(__dirname,'../../_analytics/testEvents.ts'));
for(let count=1;count<=30;count++)tracking.answerEvent('autism_test',count,count,30);
tracking.paywallEvent('autism_test');tracking.paywallEvent('autism_test');tracking.checkoutEvent('autism_test');tracking.purchaseEvent('autism_test');tracking.purchaseEvent('autism_test');
assert.deepEqual(events.map(e=>e.name),['test_start','test_progress','test_progress','test_progress','test_complete','paywall_view','checkout_start','purchase']);
for(const event of events){assert.equal(event.params.test_id,'autism_test');assert.equal(event.params.test_name,'Autismtest för vuxna');assert(!('answers' in event.params));assert(!('score' in event.params));}
assert.deepEqual(events.filter(e=>e.name==='test_progress').map(e=>e.params.progress_percent),[25,50,75]);
assert.equal(events.at(-1).params.value,39);assert.equal(events.at(-1).params.currency,'SEK');
assert(events.at(-1).params.transaction_id.startsWith('rv-autism_test-'));
const before=events.length;consent='denied';tracking.restartEvents('autism_test');tracking.answerEvent('autism_test',1,1,30);tracking.checkoutEvent('autism_test');tracking.purchaseEvent('autism_test');assert.equal(events.length,before);
console.log('PASS: recovery, old tab, persisted unlock, duplicate checkout, blocked/silent storage, paid return fallback, test isolation; all analytics events, consent, purchase 39 SEK and deduplication.');
