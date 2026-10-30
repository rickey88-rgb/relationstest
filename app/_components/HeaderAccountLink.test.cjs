/* eslint-disable @typescript-eslint/no-require-imports -- isolated synthetic Auth/UI regression. */
const assert=require('node:assert/strict'),path=require('node:path'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const createLoader=require('../autism-test/test/test-loader.cjs');
const styles=Object.fromEntries(['header','inner','homeLink','brand','brandMark','actions','assurance','accountLink'].map(name=>[name,name]));
function harness({enabled=true,unavailable=false}={}){
 let state=false,effect,mounted=false,listener,subscriptions=0,unsubscribed=false,clientCalls=0;
 const overrides={
  react:{...React,useState:()=>[state,value=>{state=value}],useEffect:fn=>{if(!mounted){mounted=true;effect=fn}}},
  'next/link':{__esModule:true,default:({href,children,className,...props})=>React.createElement('a',{href,className,'aria-label':props['aria-label']},children)},
  './SiteHeader.module.css':{default:styles},'../_styles/design.module.css':{default:styles},
  '../_lib/testAccounts/directPublic':{directCustomerEnabled:()=>enabled},
  '../_lib/testAccounts/directClient':{directAuthClient:()=>{clientCalls++;if(unavailable)throw Error('Synthetic blocked storage');return {auth:{
   onAuthStateChange:fn=>{listener=fn;subscriptions++;return {data:{subscription:{unsubscribe:()=>{unsubscribed=true}}}}},
   getUser:()=>{throw Error('Header must not request private user data')},getSession:()=>{throw Error('Header must use existing local events')},
  }}}},
 };
 const load=createLoader(overrides),Component=load(path.join(__dirname,'HeaderAccountLink.tsx')).default;
 return {overrides,Component,render:()=>renderToStaticMarkup(Component()),mount:()=>effect(),event:(name,session)=>listener(name,session),status:()=>({state,subscriptions,unsubscribed,clientCalls})};
}
const valid=()=>({expires_at:Math.floor(Date.now()/1000)+3600,access_token:'synthetic-private-token',user:{id:'synthetic-private-id',email:'private@example.invalid',is_anonymous:false}});
function renderHeaderState(signedIn){
 const h=harness();h.render();h.mount();h.event('INITIAL_SESSION',signedIn?valid():null);
 const load=createLoader({...h.overrides,'./HeaderAccountLink':{__esModule:true,default:h.Component}});
 return renderToStaticMarkup(load(path.join(__dirname,'SiteHeader.tsx')).default());
}
if(require.main===module){
 const h=harness();assert(h.render().includes('Logga in'));const cleanup=h.mount();h.event('INITIAL_SESSION',null);assert(h.render().includes('href="/mina-sidor#login"'));
 h.event('SIGNED_IN',valid());const logged=h.render();assert(logged.includes('Mina sidor')&&logged.includes('href="/mina-sidor"'));for(const secret of ['private@example.invalid','synthetic-private-token','synthetic-private-id'])assert(!logged.includes(secret));
 h.event('TOKEN_REFRESHED',valid());assert(h.render().includes('Mina sidor'));assert.equal(h.status().subscriptions,1);assert.equal(h.status().clientCalls,1);
 h.event('SIGNED_OUT',null);assert(h.render().includes('Logga in'));
 h.event('INITIAL_SESSION',{...valid(),expires_at:1});assert(h.render().includes('Logga in'));
 h.event('INITIAL_SESSION',{...valid(),user:{is_anonymous:true}});assert(h.render().includes('Logga in'));
 cleanup();assert(h.status().unsubscribed);h.event('SIGNED_IN',valid());assert(h.render().includes('Logga in'),'late callback cannot update unmounted header');
 const disabled=harness({enabled:false});disabled.render();disabled.mount();assert.equal(disabled.status().clientCalls,0);
 const blocked=harness({unavailable:true});blocked.render();blocked.mount();assert(blocked.render().includes('Logga in'));
 assert(renderHeaderState(true).includes('Mina sidor'));assert(renderHeaderState(false).includes('Logga in'));
 console.log('PASS: header login/logout/refresh/expiry, shared local subscription, cleanup, unavailable storage, safe fixed URLs and no private account data.');
}
module.exports={renderHeaderState};
