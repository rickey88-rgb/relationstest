/* eslint-disable @typescript-eslint/no-require-imports -- exercise checkout events with controlled React hooks and provider transport. */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
const createLoader=require("../../app/autism-test/test/test-loader.cjs"),{root,payloadFor}=require("./runtime.cjs");
const load=createLoader(),input=payloadFor(load);
function fixture({eligible=true,version=input.questionVersion,submission=input,additionalReportVersions=[]}={}) {
  const values=[],refs=[],effects=[],calls=[];let cursor=0,refCursor=0,first=true,reject;
  const styles=new Proxy({}, {get:(_,key)=>String(key)});
  const loader=createLoader({
    react:{useState:value=>{const index=cursor++;if(!(index in values))values[index]=value;return [values[index],next=>{values[index]=next;}];},
      useRef:value=>{const index=refCursor++;return refs[index]??(refs[index]={current:value});},
      useEffect:effect=>{if(first)effects.push(effect);},useSyncExternalStore:()=>false},
    "../persona.module.css":{default:styles},
    "../../_lib/testAccounts/directPublic":{directCustomerEnabled:()=>true},
    "../../_lib/testAccounts/directClient":{pendingPurchases:()=>[],
      directRequest:async()=>({tests:[{product:"persona_test",checkout:true,questionVersion:version,reportVersion:input.reportVersion,additionalReportVersions}]}),
      startDirectCheckout:async(...args)=>{calls.push(args);await new Promise((_,fail)=>{reject=fail;});}},
  });
  const Paywall=loader(path.join(root,"app/persona/test/PersonaPaywall.tsx")).default;
  function render(){cursor=refCursor=0;const element=Paywall({submission,eligible});first=false;return element;}
  function consent(element){const label=element.props.children.find(item=>item?.type==="label");label.props.children[0].props.onChange({target:{checked:true}});}
  const submit=element=>element.props.onSubmit({preventDefault:()=>{}});
  return {calls,effects,render,consent,submit,reject:()=>reject(Error("Synthetic payment transport failure"))};
}
test("checkout needs consent, sends exact frozen answers once and permits retry after a sanitized error",async()=>{
  const f=fixture();let view=f.render();f.effects.forEach(effect=>effect());await new Promise(resolve=>setImmediate(resolve));
  view=f.render();f.submit(view);assert.equal(f.calls.length,0,"no consent, no checkout");
  f.consent(view);view=f.render();f.submit(view);f.submit(view);assert.equal(f.calls.length,1,"double submit cannot start two checkouts");
  assert.deepEqual(f.calls[0],["persona_test",input]);f.reject();await new Promise(resolve=>setImmediate(resolve));
  view=f.render();assert(view.props.children.some(item=>item?.props?.role==="alert"));
  f.submit(view);assert.equal(f.calls.length,2,"retry unlocks after failed transport");f.reject();await new Promise(resolve=>setImmediate(resolve));
});
test("ineligible answers or mismatched server capability versions never start a checkout",async()=>{
  for(const options of [{eligible:false},{version:"future-question-version"}]) {
    const f=fixture(options);let view=f.render();f.effects.forEach(effect=>effect());await new Promise(resolve=>setImmediate(resolve));
    view=f.render();f.consent(view);view=f.render();f.submit(view);assert.equal(f.calls.length,0);
  }
});

test("V6.1 uses the existing paywall only when the server explicitly advertises its version",async()=>{
  const submission={...input,reportVersion:"persona-report-v61-release1",supplement:null};
  for(const enabled of [false,true]) {
    const f=fixture({submission,additionalReportVersions:enabled?[submission.reportVersion]:[]});let view=f.render();f.effects.forEach(effect=>effect());await new Promise(resolve=>setImmediate(resolve));view=f.render();f.consent(view);view=f.render();f.submit(view);assert.equal(f.calls.length,enabled?1:0);if(enabled){assert.deepEqual(f.calls[0],["persona_test",submission]);f.reject();await new Promise(resolve=>setImmediate(resolve));}
  }
});
