/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const React = require("react");
const {renderToStaticMarkup} = require("react-dom/server");
const createLoader = require("../../autism-test/test/test-loader.cjs");
const load = createLoader();
const state = load(path.join(__dirname,"state.ts"));
const {createPersonaSession} = load(path.join(__dirname,"session.ts"));
const {getPersonaPreview} = load(path.join(__dirname,"actions.ts"));
const {createAutoAdvance,navigationKey,AUTO_ADVANCE_MS,EXIT_MS,ENTER_MS} = load(path.join(__dirname,"autoAdvance.ts"));
const {positionStep} = load(path.join(__dirname,"viewport.ts"));
const api = load(path.join(__dirname,"../_domain/index.ts"));
const {profiles,fixed} = require("../_domain/tests/v2-fixtures.cjs");
function finish(profile=profiles[0]) {
  let draft=state.initialDraft();
  const chapters=[];
  for(let i=0;i<40;i++) {
    if(draft.phase==="chapter") {chapters.push(state.chapterAt(draft.cursor));draft=state.reduceDraft(draft,{type:"start"});}
    const q=state.currentQuestion(draft);
    const value=i<34?fixed(profile)[i]:"ABCD".indexOf(profile.followups[q.id]);
    draft=state.reduceDraft(draft,{type:"answer",value});
    draft=state.reduceDraft(draft,{type:"next"});
  }
  return {draft,chapters};
}
const memoryStorage = () => {
  const map=new Map();
  return {map,getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};
};
function fakeClock() {
  let now=0,sequence=0;
  const tasks=new Map(),callbacks=[];
  return {
    callbacks,
    scheduler:{set:(callback,delay)=>{const id=++sequence;tasks.set(id,{at:now+delay,callback});callbacks.push(callback);return id;},clear:id=>tasks.delete(id)},
    tick(ms){const target=now+ms;while(true){const next=[...tasks].filter(([,task])=>task.at<=target).sort((a,b)=>a[1].at-b[1].at||a[0]-b[0])[0];if(!next)break;now=next[1].at;tasks.delete(next[0]);next[1].callback();}now=target;},
  };
}
function timedSession(draft) {
  const storage=memoryStorage();
  if(draft)storage.setItem(state.STORAGE_KEY,JSON.stringify(draft));
  const session=createPersonaSession(()=>storage);session.subscribe(()=>{});
  if(!draft)session.dispatch({type:"start"});
  const clock=fakeClock(),navigation=createAutoAdvance(session,clock.scheduler);
  return {storage,session,clock,navigation,key:()=>navigationKey(session.getSnapshot().draft)};
}

test("step focus requests preventScroll and never reads or changes viewport geometry", () => {
  const focused=[];
  positionStep({heading:{focus:options=>focused.push(options)}});
  assert.deepEqual(focused,[{preventScroll:true}]);
  positionStep({heading:null});
  const helper=fs.readFileSync(path.join(__dirname,"viewport.ts"),"utf8");
  assert(!/scrollTop|scrollBy|scrollTo|scrollIntoView|getBoundingClientRect|matchMedia/.test(helper));
});
test("step changes use focus only and keyed views, without imperative scroll positioning", () => {
  const source=fs.readFileSync(path.join(__dirname,"PersonaFlow.tsx"),"utf8");
  assert(source.includes("useLayoutEffect"));
  assert(source.includes("positionStep({ heading: heading.current })"));
  assert(source.includes('key={viewKey}'));
  assert(!/scrollTop|scrollBy|scrollTo|scrollIntoView/.test(source));
  assert(source.includes('disabled={count === 0}'),"reset slot remains stable during the journey");
});
test("journey and question components render every fixed/adaptive wording and option without truncation", () => {
  const styles=new Proxy({}, {get:(_,key)=>`persona_${String(key)}`});
  const loader=createLoader({"./persona-journey.module.css":{default:styles}});
  const Question=loader(path.join(__dirname,"PersonaQuestion.tsx")).default;
  const encode=text=>renderToStaticMarkup(React.createElement("span",null,text)).slice(6,-7);
  for(const question of api.questionBank) {
    const html=renderToStaticMarkup(React.createElement(Question,{question,selected:null,locked:false,pending:false,position:1,total:6,last:false,headingRef:{current:null},onAnswer:()=>{},onNext:()=>{}}));
    assert(html.includes(encode(question.title)),question.id+" title");
    assert(html.includes(encode(question.prompt)),question.id+" prompt");
    question.options.forEach(option=>assert(html.includes(encode(option)),question.id+" option"));
    assert.equal((html.match(/type="radio"/g)||[]).length,question.options.length+1);
    assert(html.includes('aria-describedby="persona-auto-hint"'));
    assert(html.includes('class="persona_alternateNext" disabled=""'));
    assert(!html.includes('class="persona_primary"'));
  }
});
test("CSS at laptop, desktop and mobile sizes budgets available height without fixed footers", () => {
  const postcss=require("postcss");
  const css=postcss.parse(fs.readFileSync(path.join(__dirname,"persona-journey.module.css"),"utf8"));
  function mediaMatches(params,width,height){
    if(params.includes("prefers-reduced-motion"))return false;
    return [...params.matchAll(/\((min|max)-(width|height):\s*(\d+)px\)/g)].every(([,bound,axis,n])=>bound==="min"?(axis==="width"?width:height)>=Number(n):(axis==="width"?width:height)<=Number(n));
  }
  function declarations(selector,width,height){
    const result={};
    css.walkRules(rule=>{
      if(!rule.selector.split(",").map(s=>s.trim()).includes(selector))return;
      let parent=rule.parent;
      while(parent&&parent!==css){if(parent.type==="atrule"&&parent.name==="media"&&!mediaMatches(parent.params,width,height))return;parent=parent.parent;}
      rule.nodes.filter(n=>n.type==="decl").forEach(n=>{result[n.prop]=n.value;});
    });return result;
  }
  for(const [width,height]of [[1366,768],[1920,1080]]) {
    const body=declarations(':global(body):has(.journey)',width,height);
    assert.equal(body.height,"100dvh");assert.equal(body.display,"flex");
    const journey=declarations('.journey',width,height);
    assert.equal(journey.width,"min(960px, 100%)");assert.equal(journey["grid-template-rows"],"auto minmax(0, 1fr) auto");
    assert.equal(declarations('.step',width,height)["overflow-y"],"auto");
    assert.equal(declarations('.title',width,height)["font-size"],"clamp(28px, 3.4vh, 32px)");
    const next=declarations('.alternateNext',width,height);
    assert.equal(next.background,"transparent");assert.equal(next.width,"auto");assert.equal(next["min-height"],"32px");
    assert.equal(declarations(".options",width,height)["grid-template-columns"],"minmax(0, 1fr)");
    assert.equal(declarations(':global([data-persona-root]):has(.journey) > :global(#persona-content)',width,height)["min-height"],"0");
  }
  assert.equal(declarations('.prompt',1366,768)["font-size"],"17px");
  assert.equal(declarations('.prompt',1920,1080)["font-size"],"18px");
  for(const [width,height] of [[390,844],[1366,500]]) {
    assert.equal(declarations('.journey',width,height).height,undefined);
    assert.equal(declarations('.step',width,height)["overflow-y"],undefined);
    assert.deepEqual(declarations(':global(body):has(.journey)',width,height),{});
  }
  assert.equal(declarations('.alternateNext',390,844)["min-height"],"48px");
  assert.equal(declarations('.alternateNext',390,844).width,"100%");
  for(const [width,height] of [[1366,768],[1920,1080],[390,844]]) {
    assert.equal(declarations(':global(body):has(.journey) > :global(aside[aria-label="Statistikinställningar"])',width,height).position,"static");
  }
  css.walkDecls("position",decl=>assert(!["fixed","sticky","absolute"].includes(decl.value)||decl.parent.selector.includes("input")||decl.parent.selector.endsWith(".check"),"no fixed/sticky journey navigation or footer"));
  css.walkDecls(decl=>assert(!["line-clamp","-webkit-line-clamp","text-overflow"].includes(decl.prop)));
  const reduced=[];css.walkAtRules("media",rule=>{if(rule.params.includes("prefers-reduced-motion"))reduced.push(rule.toString());});
  assert(reduced.some(rule=>rule.includes("animation: none !important")&&rule.includes("transition: none !important")));
});

test("auto-advance saves immediately, marks selection, and advances at exactly 350 ms", () => {
  const {storage,session,clock,navigation,key}=timedSession();
  assert.equal(AUTO_ADVANCE_MS,350);
  assert(navigation.answer(3,key()));
  assert.equal(navigation.getSnapshot().phase,"selected");
  assert.equal(JSON.parse(storage.getItem(state.STORAGE_KEY)).fixed[0],3);
  assert.equal(session.getSnapshot().draft.cursor,0);
  clock.tick(AUTO_ADVANCE_MS-EXIT_MS-1);assert.equal(navigation.getSnapshot().phase,"selected");
  clock.tick(1);assert.equal(navigation.getSnapshot().phase,"leaving");
  clock.tick(EXIT_MS-1);assert.equal(session.getSnapshot().draft.cursor,0);
  clock.tick(1);assert.equal(session.getSnapshot().draft.cursor,1);
  assert.equal(navigation.getSnapshot().phase,"entering");
  clock.tick(ENTER_MS);assert.equal(navigation.getSnapshot().phase,"idle");
  assert.equal(session.getSnapshot().draft.cursor,1);
});
test("rapid answers and manual next cannot compete with the pending timer", () => {
  const {session,clock,navigation,key}=timedSession();const originalKey=key();
  assert(navigation.answer(1,originalKey));
  assert.equal(navigation.answer(4,originalKey),false);
  assert.equal(navigation.navigate("next",originalKey),false);
  clock.tick(350);assert.equal(session.getSnapshot().draft.cursor,1);
  assert.equal(navigation.answer(0,key()),false,"click carried into the entering question must be blocked");
  clock.tick(ENTER_MS);
  assert.equal(navigation.answer(0,originalKey),false,"stale handlers stay invalid after unlock");
  assert.equal(session.getSnapshot().draft.fixed[0],1);
  assert.equal(session.getSnapshot().draft.fixed[1],null);
});
test("back cancels pending auto-navigation and ignores callbacks already queued", () => {
  const {session,clock,navigation,key}=timedSession();
  navigation.answer(3,key());clock.tick(100);
  const staleCallbacks=[...clock.callbacks];
  assert(navigation.navigate("back",key()));
  assert.equal(session.getSnapshot().draft.phase,"chapter");
  assert.equal(navigation.navigate("back",key()),false);
  staleCallbacks.forEach(callback=>callback());clock.tick(1000);
  assert.equal(session.getSnapshot().draft.phase,"chapter");
  assert.equal(session.getSnapshot().draft.fixed[0],3);
  assert.equal(navigation.getSnapshot().phase,"idle");
});
test("cleanup and external step changes prevent stale timer navigation", () => {
  for(const external of [false,true]) {
    const {session,clock,navigation,key}=timedSession();
    navigation.answer(2,key());const stale=[...clock.callbacks];
    if(external)session.dispatch({type:"next"});else navigation.cancel();
    stale.forEach(callback=>callback());clock.tick(1000);
    assert.equal(session.getSnapshot().draft.cursor,external?1:0);
    assert.equal(navigation.getSnapshot().phase,"idle");
  }
});
test("manual navigation of restored answers is also protected from double activation", () => {
  const completed=finish().draft;
  const {session,clock,navigation,key}=timedSession({...completed,cursor:3,phase:"question"});
  const previous=key();
  assert(navigation.navigate("next",previous));
  assert.equal(navigation.navigate("next",key()),false);
  assert.equal(session.getSnapshot().draft.cursor,4);
  clock.tick(ENTER_MS);
  assert.equal(navigation.navigate("next",previous),false);
  assert(navigation.navigate("back",key()));
  assert.equal(session.getSnapshot().draft.cursor,3);
});
test("auto-advance preserves chapter gates and reaches preview only after the last answer", () => {
  const completed=finish().draft;
  for(const cursor of [9,21,33,39]) {
    const {session,clock,navigation,key}=timedSession({...completed,cursor,phase:"question"});
    const answer=state.currentAnswer(session.getSnapshot().draft);
    assert(navigation.answer(answer,key()),"reselecting a previous answer starts the same controlled timer");
    clock.tick(350);
    assert.equal(session.getSnapshot().draft.phase,cursor===39?"preview":"chapter");
    assert.equal(session.getSnapshot().draft.cursor,cursor===39?39:cursor+1);
    assert.equal(navigation.navigate("start",key()),false,"cannot double-activate the new chapter during entry");
  }
});
test("unknown answers auto-advance, invalid input does not, and no timer lock is persisted", () => {
  const {storage,session,clock,navigation,key}=timedSession();
  for(const invalid of [-1,6,NaN,1.5])assert.equal(navigation.answer(invalid,key()),false);
  assert.equal(navigation.getSnapshot().phase,"idle");
  assert(navigation.answer(5,key()));clock.tick(350);
  const saved=JSON.parse(storage.getItem(state.STORAGE_KEY));
  assert.equal(saved.fixed[0],5);assert.equal(saved.cursor,1);
  assert.deepEqual(Object.keys(saved).sort(),["cursor","fixed","followups","phase","questionVersion","reportVersion","version"]);
  assert.equal(session.getSnapshot().draft.fixed[0],5);
});

test("all 40 questions follow the approved four-chapter journey", () => {
  for(const profile of profiles) {
    const {draft,chapters}=finish(profile);
    assert.deepEqual(chapters,[1,2,3,4]);
    assert.equal(draft.phase,"preview");assert.equal(state.answeredCount(draft),40);
    assert.deepEqual(draft.followups.map(item=>item.questionId),profile.selected);
    const submission=state.toSubmission(draft);
    assert(submission); assert.equal(submission.answers.length,40);
    assert.deepEqual(submission.answers.slice(0,34),fixed(profile));
    assert.deepEqual(draft,state.parseDraft(JSON.stringify(draft)));
  }
});
test("navigation requires a real answer; ordinary choices and unknown remain distinct", () => {
  let draft=state.initialDraft();
  assert.equal(state.reduceDraft(draft,{type:"answer",value:2}),draft);
  draft=state.reduceDraft(draft,{type:"start"});
  assert.equal(state.reduceDraft(draft,{type:"next"}),draft);
  for(const invalid of [-1,6,NaN,1.5,"2"])assert.equal(state.reduceDraft(draft,{type:"answer",value:invalid}),draft);
  draft=state.reduceDraft(draft,{type:"answer",value:2});
  assert.equal(state.currentAnswer(draft),2);
  draft=state.reduceDraft(draft,{type:"next"});
  assert.equal(state.currentQuestion(draft).id,"P02");
  assert.equal(state.reduceDraft(draft,{type:"answer",value:4}),draft);
  draft=state.reduceDraft(draft,{type:"answer",value:state.UNKNOWN});
  assert.equal(state.currentAnswer(draft),5);assert.equal(state.answeredCount(draft),2);
  draft=state.reduceDraft(draft,{type:"back"});assert.equal(state.currentAnswer(draft),2);
});
test("back works across chapter boundaries and from the preview", () => {
  let {draft}=finish();
  draft=state.reduceDraft(draft,{type:"back"});
  assert.equal(draft.cursor,39);assert.equal(draft.phase,"question");assert.notEqual(state.currentAnswer(draft),null);
  for(const boundary of [10,22,34]) {
    const previous=state.reduceDraft({...draft,cursor:boundary,phase:"chapter"},{type:"back"});
    assert.equal(previous.cursor,boundary-1);assert.equal(previous.phase,"question");
    const forward=state.reduceDraft(previous,{type:"next"});
    assert.equal(forward.phase,"chapter");assert.equal(forward.cursor,boundary);
  }
  const first=state.reduceDraft({...draft,cursor:0},{type:"back"});
  assert.equal(first.phase,"chapter");assert.equal(first.cursor,0);
});
test("editing recomputes adaptive IDs and retains surviving answers by ID", () => {
  const old=finish().draft;
  let changed=null;
  for(let i=0;i<34&&!changed;i++)for(let value=0;value<4;value++) {
    const candidate=state.reduceDraft({...old,cursor:i,phase:"question"},{type:"answer",value});
    if(candidate.followups.some(item=>!old.followups.some(prev=>prev.questionId===item.questionId))){changed=candidate;break;}
  }
  assert(changed);assert(state.answeredCount(changed)<40);
  assert.equal(state.toSubmission(changed),null);
  const expected=api.selectAdaptive(changed.fixed).selectedIds;
  assert.deepEqual(changed.followups.map(item=>item.questionId),expected);
  for(const item of changed.followups)assert.equal(item.answer,old.followups.find(prev=>prev.questionId===item.questionId)?.answer??null);
});
test("untrusted persistence rejects foreign versions, payloads and unlock flags", () => {
  const {draft}=finish();
  for(const raw of [null,"", "{bad", "null", "[]", "x".repeat(12001)])assert.equal(state.parseDraft(raw),null);
  for(const patch of [{version:1},{questionVersion:"other"},{reportVersion:"other"},{unlocked:true},{paid:true},{sections:[]},{cursor:40},{cursor:-1},{phase:"paid"},{fixed:[]},{followups:[{questionId:"P02",answer:1}]}]) {
    assert.equal(state.parseDraft(JSON.stringify({...draft,...patch})),null);
  }
  const bad={...draft,fixed:[...draft.fixed]};bad.fixed[1]=4;
  assert.equal(state.parseDraft(JSON.stringify(bad)),null);
  const duplicate={...draft,followups:[draft.followups[0],draft.followups[0]]};
  assert.equal(state.parseDraft(JSON.stringify(duplicate)),null);
});
test("stored adaptive order is reconstructed, not trusted", () => {
  const {draft}=finish();
  const restored=state.parseDraft(JSON.stringify({...draft,followups:[...draft.followups].reverse()}));
  assert.deepEqual(restored,draft);
  const incomplete={...draft,fixed:[...draft.fixed]};incomplete.fixed[3]=null;
  const repaired=state.parseDraft(JSON.stringify(incomplete));
  assert.equal(repaired.cursor,3);assert.equal(repaired.phase,"question");assert.deepEqual(repaired.followups,[]);
  const partial={...draft,followups:draft.followups.map((item,i)=>i===1?{...item,answer:null}:item)};
  const followupRepair=state.parseDraft(JSON.stringify(partial));
  assert.equal(followupRepair.cursor,35);assert.equal(followupRepair.phase,"question");
});
test("session initializes only in browser subscription and resumes a saved journey", () => {
  const storage=memoryStorage(),saved=finish().draft;
  storage.setItem(state.STORAGE_KEY,JSON.stringify(saved));
  let reads=0;const session=createPersonaSession(()=>{reads++;return storage;});
  assert.equal(reads,0);assert.equal(session.getServerSnapshot().hydrated,false);
  const stop=session.subscribe(()=>{});
  assert.equal(reads,1);assert.equal(session.getSnapshot().hydrated,true);
  assert.equal(session.getSnapshot().restored,true);assert.deepEqual(session.getSnapshot().draft,saved);
  assert.equal(session.getSnapshot(),session.getSnapshot());stop();
});
test("answer persistence and restart touch only the PERSONA storage key", () => {
  const storage=memoryStorage();storage.setItem("other-product","untouched");
  const session=createPersonaSession(()=>storage);session.subscribe(()=>{});
  session.dispatch({type:"start"});session.dispatch({type:"answer",value:3});
  const stored=JSON.parse(storage.getItem(state.STORAGE_KEY));
  assert.equal(stored.fixed[0],3);assert(!("unlocked"in stored));assert(!("preview"in stored));
  session.dispatch({type:"restart"});assert.equal(storage.getItem(state.STORAGE_KEY),null);
  assert.equal(storage.getItem("other-product"),"untouched");
  assert.equal(state.answeredCount(session.getSnapshot().draft),0);
});
test("storage failures keep the journey usable without claiming it was saved", () => {
  for(const factory of [()=>{throw new Error("blocked")},()=>({getItem:()=>null,setItem:()=>{throw new Error("quota")},removeItem:()=>{throw new Error("blocked")}})]) {
    const session=createPersonaSession(factory);session.subscribe(()=>{});
    session.dispatch({type:"start"});session.dispatch({type:"answer",value:3});
    assert.equal(session.getSnapshot().draft.fixed[0],3);
    assert.equal(session.getSnapshot().storageError,"unavailable");
  }
  const storage=memoryStorage();storage.setItem(state.STORAGE_KEY,"{bad");
  const session=createPersonaSession(()=>storage);session.subscribe(()=>{});
  assert.equal(session.getSnapshot().storageError,"invalid");
});
test("server preview returns exactly one real finding and no premium analysis", async () => {
  for(const profile of profiles) {
    const submission=state.toSubmission(finish(profile).draft);
    const preview=await getPersonaPreview(submission),report=api.buildPersonaReport(submission);
    assert.deepEqual(Object.keys(preview).sort(),["evidenceCount","kind","text"]);
    assert.equal(preview.kind,"insight");assert.equal(preview.text,report.preview.text);
    assert(preview.evidenceCount>0);assert.equal(report.preview.findingIds.length,1);
    assert(!("sections"in preview));assert(!("dimensions"in preview));assert(!("findings"in preview));
  }
  const input=state.toSubmission(finish().draft);
  assert.equal((await getPersonaPreview({...input,unlocked:true})).kind,"invalid");
  assert.equal((await getPersonaPreview(null)).kind,"invalid");
  const allUnknown={...input,answers:Array(40).fill(5)};
  const limited=await getPersonaPreview(allUnknown);
  assert.equal(limited.kind,"limited");assert.equal(limited.evidenceCount,0);
});
test("landing and shell render semantic content and locked brand without browser APIs", () => {
  const styles=new Proxy({}, {get:(_,key)=>`persona_${String(key)}`});
  const componentLoader=createLoader({
    "./persona.module.css":{default:styles},"../persona.module.css":{default:styles},
    "next/link":{default:({children,...props})=>React.createElement("a",props,children)},
    "../../_analytics/AnalyticsProvider":{AnalyticsSettings:()=>React.createElement("button",null,"Statistikinställningar")},
  });
  const Landing=componentLoader(path.join(__dirname,"../page.tsx")).default;
  const Shell=componentLoader(path.join(__dirname,"../_components/PersonaShell.tsx")).default;
  const html=renderToStaticMarkup(React.createElement(Shell,null,React.createElement(Landing)));
  assert(html.includes("Vem är du egentligen?"));assert(html.includes("Upptäck din personlighet"));
  assert(html.includes('href="/persona/test"'));assert(html.includes('data-persona-root="true"'));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal((html.match(/<main\b/g)||[]).length,1);
  assert(html.includes('aria-hidden="true"'));assert(!html.includes("buy.stripe.com"));assert(!html.includes("checkout.stripe.com"));
});
test("client boundary contains no report engine, payment recovery or unlock path", () => {
  const source=fs.readFileSync(path.join(__dirname,"PersonaFlow.tsx"),"utf8");
  assert(!/buildPersonaReport|usePaymentRecovery|useTestAccountCheckout|paid=true|window\.location\.search|URLSearchParams/.test(source));
  assert(source.includes('<PersonaPaywall submission={submission}'));
  assert(source.includes("getPersonaPreview"));
  const css=fs.readFileSync(path.join(__dirname,"../persona.module.css"),"utf8");
  assert(css.includes("#101626"));assert(css.includes("#C9A86B"));
  assert(css.includes("prefers-reduced-motion"));assert(css.includes("max-width: 360px"));
});

test("question markup has native radio groups, selection, navigation and no hidden premium copy", () => {
  const styles=new Proxy({}, {get:(_,key)=>`persona_${String(key)}`});
  const render=draft=>{
    const snapshot={hydrated:true,draft,storageError:null,restored:false};
    const renderLoader=createLoader({
      "../persona.module.css":{default:styles},
      "./persona-journey.module.css":{default:styles},
      "next/link":{default:({children,...props})=>React.createElement("a",props,children)},
      "./session":{createPersonaSession:()=>({subscribe:()=>()=>{},getSnapshot:()=>snapshot,getServerSnapshot:()=>snapshot,dispatch:()=>{}})},
      "./actions":{getPersonaPreview:async()=>{throw new Error("SSR must not request preview");}},
    });
    return renderToStaticMarkup(React.createElement(renderLoader(path.join(__dirname,"PersonaFlow.tsx")).default));
  };
  let draft=state.reduceDraft(state.initialDraft(),{type:"start"});
  let html=render(draft);
  assert.equal((html.match(/type="radio"/g)||[]).length,5);
  assert(html.includes('<legend class="persona_choiceLegend">Hur väl stämmer det på dig?</legend>'));
  assert(html.includes('disabled=""'));
  draft=state.reduceDraft(draft,{type:"answer",value:3});
  html=render(draft);assert(html.includes('checked=""'));assert(!html.includes('disabled=""'));
  draft=state.reduceDraft(draft,{type:"next"});html=render(draft);
  assert(html.includes('data-question-id="P02"'));assert.equal((html.match(/type="radio"/g)||[]).length,5);
  assert(html.includes("Bilden du helst slipper"));assert(html.includes("Tillbaka"));
  const completed=finish().draft;html=render(completed);
  assert(html.includes("Lås upp mitt porträtt – 79 kr"));assert(html.includes("Kontosparning är frivillig"));
  assert(html.includes('disabled=""'));assert(!html.includes("I flera av scenarierna gör du ansvar synligt"));
  const unknown=Array(34).fill(5);
  const reserve={...completed,fixed:unknown,followups:api.selectAdaptive(unknown).selectedIds.map(questionId=>({questionId,answer:null})),cursor:34,phase:"chapter"};
  html=render(reserve);
  assert(html.includes("Sex sista frågor ger fler sätt att känna efter."));
  assert(!html.includes("Sex personliga följdfrågor hjälper oss att fördjupa några av de avvägningar som framträtt."));
});
