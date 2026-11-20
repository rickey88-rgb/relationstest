/* eslint-disable @typescript-eslint/no-require-imports -- deterministic browser-event harness, no provider access. */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
const createLoader=require("../../app/autism-test/test/test-loader.cjs");
const root=path.resolve(__dirname,"../.."),profiles=require("./insights-v2-full-fixtures.cjs");
function fixture(draft){
  const state=[],refs=[],deps=[],cleanups=[],effects=[],layouts=[],timers=new Map(),storage=new Map();
  let stateIndex=0,refIndex=0,effectIndex=0,now=0,sequence=0,focus=0;
  const old={setTimeout:global.setTimeout,clearTimeout:global.clearTimeout,localStorage:global.localStorage,window:global.window};
  global.setTimeout=(fn,ms)=>{const id=++sequence;timers.set(id,{fn,at:now+ms});return id;};
  global.clearTimeout=id=>timers.delete(id);
  global.localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)};
  global.window={confirm:()=>true};
  const effect=(list,fn,next)=>{
    const i=effectIndex++,previous=deps[i];
    if(!previous||next.some((v,k)=>v!==previous[k])){deps[i]=next;list.push(()=>{cleanups[i]?.();cleanups[i]=fn();});}
  };
  const Question=()=>null,Journey=()=>null,Paywall=()=>null;
  const styles={default:new Proxy({},{get:(_,key)=>String(key)})};
  const loader=createLoader({
    react:{useState:initial=>{const i=stateIndex++;if(!(i in state))state[i]=typeof initial==="function"?initial():initial;return[state[i],value=>{state[i]=typeof value==="function"?value(state[i]):value;}];},
      useRef:initial=>{const i=refIndex++;return refs[i]??(refs[i]={current:initial});},
      useEffect:(fn,next)=>effect(effects,fn,next),useLayoutEffect:(fn,next)=>effect(layouts,fn,next)},
    "next/link":{default:"a"},"./supplements.module.css":styles,"../persona/persona.module.css":styles,
    "../persona/test/PersonaQuestion":{default:Question},"../persona/test/PersonaJourney":{default:Journey},"../persona/test/PersonaPaywall":{default:Paywall},
    "./actions":{analyzePersonaV61:async()=>({state:"insufficient",title:"Kontroll",text:"Avgränsat resultat",description:"Inget köp",questions:[]})},
  });
  const draftApi=loader(path.join(root,"app/persona-v61/draft.ts"));
  if(draft)storage.set("relationsvarning_persona_v61_draft_v1",draftApi.serializeDraft(draft));
  const Flow=loader(path.join(root,"app/persona-v61/PersonaV61Flow.tsx")).default;
  function render(){
    stateIndex=refIndex=effectIndex=0;const view=Flow();
    // Attach a fake heading before running layout effects.
    for(const ref of refs)if(ref.current===null)ref.current={focus:options=>{assert.deepEqual(options,{preventScroll:true});focus++;}};
    layouts.splice(0).forEach(fn=>fn());effects.splice(0).forEach(fn=>fn());return view;
  }
  function nodes(node){return node&&typeof node==="object"?[node,...[node.props?.children].flat(Infinity).flatMap(nodes)]:[];}
  const find=(view,type)=>nodes(view).find(n=>n.type===type);
  return {render,state,find,Question,Journey,Paywall,storage,draftApi,
    start(){let view=render();view=render();find(view,"button").props.onClick();view=render();find(view,"button").props.onClick();return render();},
    tick(ms){now+=ms;for(const[id,timer]of Array.from(timers))if(timer.at<=now){timers.delete(id);timer.fn();}},
    close(){cleanups.forEach(fn=>fn?.());for(const[k,v]of Object.entries(old))if(v===undefined)delete global[k];else global[k]=v;},
    get focus(){return focus;},get timers(){return timers.size;}
  };
}
test("V6.1 locks double answers for 350ms, cancels Back and keeps keyboard alternative",()=>{
 const f=fixture();
 try{
  let view=f.start(),q=f.find(view,f.Question);
  q.props.onAnswer(5);q.props.onAnswer(1);view=f.render();
  assert.equal(f.state[0].answers[0],5);assert.equal(f.timers,1);assert.equal(f.find(view,f.Question).props.pending,true);
  f.tick(349);assert.equal(f.state[0].cursor,0);f.tick(1);view=f.render();assert.equal(f.state[0].cursor,1);
  f.find(view,f.Question).props.onAnswer(2);view=f.render();f.find(view,f.Journey).props.onBack();view=f.render();
  f.tick(350);view=f.render();assert.equal(f.state[0].cursor,0);
  q=f.find(view,f.Question);q.props.onSelect(4);view=f.render();assert.equal(f.timers,0);
  f.find(view,f.Question).props.onNext();view=f.render();assert.equal(f.state[0].cursor,1);assert(f.focus>1);
 }finally{f.close();}
});
test("V6.1 traverses the unchanged forty questions, all chapter gates, result review and reload",()=>{
 const f=fixture(),answers=profiles[0].answers;
 try{
  let view=f.start(),gates=1;
  for(let i=0;i<40;i++){
    const q=f.find(view,f.Question);assert.equal(q.props.question.id,"Q"+String(i+1).padStart(2,"0"));
    q.props.onAnswer(answers[i]);view=f.render();f.tick(350);view=f.render();
    if(f.state[0].phase==="chapter"){gates++;f.find(view,"button").props.onClick();view=f.render();}
  }
  assert.equal(gates,4);assert.equal(f.state[0].phase,"result");assert.deepEqual(f.state[0].answers,answers);
  const raw=Array.from(f.storage.values())[0],restored=f.draftApi.restoreDraft(raw);assert.equal(restored.phase,"result");
  const review=(function visit(n){if(!n||typeof n!=="object")return; if(n.type==="button"&&n.props.children==="Granska mina svar")return n;for(const child of[n.props?.children].flat(Infinity)){const found=visit(child);if(found)return found;}})(view);
  review.props.onClick();view=f.render();assert.equal(f.find(view,f.Question).props.question.id,"Q40");
 }finally{f.close();}
});
test("saved voluntary supplements restore without a purchase entitlement or changed base answers",()=>{
 const draft={answers:profiles[23].answers,cursor:39,phase:"result",supplement:{S01:"context",S02:"writing",S03:"asked",S04:"preserve"}},f=fixture(draft);
 try{f.render();f.render();assert.deepEqual(f.state[0],draft);assert.equal(f.state[0].paid,undefined);}finally{f.close();}
});
