/* eslint-disable @typescript-eslint/no-require-imports -- Executable Node CommonJS test harness. */
// Run: node app/autism-test/test/flow.test.cjs
// Integration harness for the actual client page and unchanged payment hook.
// Browser/clock boundaries are controlled; no Stripe charge or GA request is made.
const assert = require('node:assert/strict');
const path = require('node:path');
const key='relationsvarning_autism_state_v1';
function mount({data=new Map(),paid=false,blocked=false}={}) {
  const slots=[],pending=[],timers=new Map(),listeners=new Map(),events=[];
  let cursor=0,dirty=true,tree,clock=0,sequence=0;
  const env={data,blocked,events};
  global.localStorage={getItem:k=>{if(env.blocked)throw Error('blocked');return data.get(k)??null;},setItem:(k,v)=>{if(env.blocked)throw Error('blocked');data.set(k,v);},removeItem:k=>{if(env.blocked)throw Error('blocked');data.delete(k);}};
  global.window={location:{href:'https://relationsvarning.se/autism-test/test'+(paid?'?paid=true':''),pathname:'/autism-test/test',search:paid?'?paid=true':''},scrollTo:()=>{},history:{replaceState:(...args)=>{const url=args[2];window.location.href='https://relationsvarning.se'+url;window.location.search=new URL(window.location.href).search;}},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
  window.location.assign=url=>{window.location.href=url;};
  global.setTimeout=(fn,delay)=>{const id=++sequence;timers.set(id,{at:clock+delay,fn});return id;};
  global.clearTimeout=id=>timers.delete(id);
  const react={
    useState:initial=>{const index=cursor++;if(!slots[index])slots[index]={value:typeof initial==='function'?initial():initial};return [slots[index].value,value=>{const next=typeof value==='function'?value(slots[index].value):value;if(next!==slots[index].value){slots[index].value=next;dirty=true;}}];},
    useRef:value=>{const index=cursor++;if(!slots[index])slots[index]={current:value};return slots[index];},
    useMemo:fn=>fn(),
    useEffect:(fn,deps)=>{const index=cursor++;const old=slots[index];if(!old||!deps||deps.some((d,i)=>!Object.is(d,old.deps[i]))){slots[index]={deps,cleanup:old?.cleanup};pending.push(()=>{slots[index].cleanup?.();slots[index].cleanup=fn();});}},
  };
  const tracking={answer:(...args)=>events.push(['answer',...args]),purchase:()=>events.push(['purchase']),checkout:()=>events.push(['checkout']),restart:()=>events.push(['restart']),paywallRef:()=>{}};
  const load=require('./test-loader.cjs')({react,'../../_analytics/useTestAnalytics':{useTestAnalytics:(id,total)=>{assert.equal(id,'autism_test');assert.equal(total,30);return tracking;}}});
  const Page=load(path.join(__dirname,'page.tsx')).default;
  function render(){let count=0;while(dirty||pending.length){if(++count>20)throw Error('render loop');if(dirty){dirty=false;cursor=0;tree=Page();}pending.splice(0).forEach(fn=>fn());}return tree;}
  function advance(ms){const target=clock+ms;for(;;){const next=[...timers].filter(([,t])=>t.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;clock=next[1].at;timers.delete(next[0]);next[1].fn();render();}clock=target;render();}
  function nodes(node=tree){if(!node||typeof node!=='object')return [];if(Array.isArray(node))return node.flatMap(n=>nodes(n));return[node,...nodes(node.props?.children ?? null)];}
  function text(node=tree){if(node==null||typeof node==='boolean')return '';if(typeof node!=='object')return String(node);if(Array.isArray(node))return node.map(n=>text(n)).join('');return text(node.props?.children ?? null);}
  function button(label){const found=nodes().find(n=>n.type==='button'&&text(n).trim()===label);assert(found,'Button: '+label);return found;}
  function click(label){const b=button(label);assert(!b.props.disabled);b.props.onClick({detail:1});render();}
  render();return {...env,env,render,advance,nodes,text,button,click,listeners};
}
const labels=['Aldrig','Sällan','Ibland','Ofta','Mycket ofta'];
function complete(app,answers){for(let n=0;n<30;n++){
  app.click(labels[answers[n]]);
  const selected=app.button(labels[answers[n]]);assert.equal(selected.props['aria-pressed'],true);assert.equal(selected.props.disabled,true);
  app.advance(219);assert.equal(app.button(labels[answers[n]]).props['aria-pressed'],true);
  app.advance(1);
}assert.equal(app.events.filter(e=>e[0]==='answer').length,30);}
let a=mount();complete(a,Array(30).fill(2));
assert(a.text().includes('Analyserar dina svar…'));assert(!a.text().includes('39 kr'));
a.advance(1000);assert(a.text().includes('Jämför mönster mellan sex områden…'));
a.advance(1000);assert(a.text().includes('Sammanställer din profil…'));
a.advance(999);assert(!a.text().includes('39 kr'));a.advance(1);
assert(a.text().includes('Flera områden förstärker varandra'));
for(const forbidden of ['50 / 100','Socialt samspel','Måttligt autismrelaterat mönster','Bred kombinerad profil','Din övergripande profil'])assert(!a.text().includes(forbidden),forbidden+' leaked before payment');
const checkout=a.button('Se min fullständiga analys – 39 kr');checkout.props.onClick();checkout.props.onClick();a.render();
assert.equal(a.events.filter(e=>e[0]==='checkout').length,1);
assert.equal(window.location.href,'https://buy.stripe.com/7sY6oG5ON6Eh0q3b720gw0n');
assert.deepEqual(JSON.parse(a.data.get(key)).answers,Array(30).fill(2));
a=mount({data:a.data,paid:true});assert(a.text().includes('Ditt test är upplåst'));assert(a.text().includes('Din övergripande profil'));assert(a.text().includes('50 / 100'));
assert(!a.text().includes('Se min fullständiga analys – 39 kr'));assert.equal(a.data.get(key+':paid'),'true');
a=mount({data:a.data});assert(a.text().includes('Din övergripande profil'));a.click('Börja om');assert(a.text().includes('Ditt test är upplåst'));
a=mount();complete(a,[...Array(5).fill(4),...Array(25).fill(0)]);a.advance(3000);assert(a.text().includes('Ett mönster i dina svar sticker ut'));assert(!a.text().includes('Socialt samspel'));
a.env.blocked=true;a.click('Se min fullständiga analys – 39 kr');assert(!a.events.some(e=>e[0]==='checkout'));assert(a.text().includes('kunde sparas säkert'));
a=mount({blocked:true,paid:true});assert(a.text().includes('Ditt test är upplåst'));assert(window.location.search.includes('paid=true'));a.click('Aldrig');a.advance(220);assert(a.text().includes('Fråga 2'));
console.log('PASS: actual page flow, 30 answers, 220 ms pressed state, 3-second transition, both teasers, no prepay result leak, checkout guard, saved answers, paid return, reload, restart entitlement, blocked storage.');
