/* eslint-disable @typescript-eslint/no-require-imports -- real Supabase SDK with isolated synthetic Auth transport/storage. */
const assert=require('node:assert/strict'),path=require('node:path'),{createClient}=require('@supabase/supabase-js');
const createLoader=require('../../autism-test/test/test-loader.cjs');
const memory=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};};
const user={id:'11111111-1111-4111-8111-111111111111',aud:'authenticated',role:'authenticated',email:'synthetic@example.invalid',email_confirmed_at:'2026-10-31T00:00:00Z',created_at:'2026-10-31T00:00:00Z',app_metadata:{},user_metadata:{}};
const jwt=[{alg:'HS256',typ:'JWT'},{sub:user.id,email:user.email,aud:'authenticated',role:'authenticated',exp:Math.floor(Date.now()/1000)+3600},'synthetic-signature'].map(x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)).toString('base64url')).join('.');
const session={access_token:jwt,refresh_token:'synthetic-refresh-token-not-real',token_type:'bearer',expires_in:3600,user};
const requests=[],clients=[],requestedToken='a'.repeat(64),mailTab=memory(),requestTab=memory();
global.document={visibilityState:'visible',addEventListener:()=>{},removeEventListener:()=>{}};
global.window={location:{href:'https://www.relationsvarning.se/mina-sidor'},sessionStorage:mailTab,addEventListener:()=>{},removeEventListener:()=>{}};
global.BroadcastChannel=undefined;
Object.assign(process.env,{NEXT_PUBLIC_SUPABASE_URL:'https://synthetic.supabase.co',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'synthetic-public-key'});
async function transport(input,init={}){
 const url=new URL(String(input));assert.equal(url.origin,'https://synthetic.supabase.co');const body=init.body?JSON.parse(init.body):null;requests.push({path:url.pathname,body});
 if(url.pathname.endsWith('/verify')){assert.equal(body.token_hash,requestedToken);assert.equal(body.type,'email');assert(!body.code_verifier);return Response.json(session);}
 if(url.pathname.endsWith('/user')){assert.equal(new Headers(init.headers).get('authorization'),'Bearer '+jwt);return Response.json(user);}
 if(url.pathname.endsWith('/logout'))return new Response(null,{status:204});
 throw Error('Unexpected synthetic Auth request');
}
function clientFor(storage){window.sessionStorage=storage;return createLoader({'@supabase/supabase-js':{createClient:(url,key,options)=>{
 assert.equal(options.auth.storage,storage);assert.equal(options.auth.detectSessionInUrl,false);assert.equal(options.auth.persistSession,true);
 const client=createClient(url,key,{...options,auth:{...options.auth,autoRefreshToken:false},global:{fetch:transport}});clients.push(client);return client;
}}})(path.join(__dirname,'directClient.ts')).directAuthClient();}
(async()=>{
 try{
  const first=clientFor(mailTab);let signed=false;const {data:subscription}=first.auth.onAuthStateChange((event,value)=>{if(event==='SIGNED_IN')signed=!!value;});
  const result=await first.auth.verifyOtp({token_hash:requestedToken,type:'email'});assert.equal(result.error,null);assert.equal(result.data.user.id,user.id);assert(signed);
  assert(mailTab.getItem('rv-direct-auth-v1'),'verified session is persisted in email-opening tab');assert.equal(requestTab.getItem('rv-direct-auth-v1'),null);
  subscription.subscription.unsubscribe();await first.auth.stopAutoRefresh();
  const reloaded=clientFor(mailTab);const restored=await reloaded.auth.getSession();assert.equal(restored.data.session.user.id,user.id,'reload restores same verified account');
  assert.equal((await reloaded.auth.getUser()).data.user.id,user.id,'server validation confirms account identity');
  const separate=clientFor(memory());assert.equal((await separate.auth.getSession()).data.session,null,'unrelated tab is not silently authenticated');
  await reloaded.auth.signOut();assert.equal(mailTab.getItem('rv-direct-auth-v1'),null);assert.equal((await reloaded.auth.getSession()).data.session,null);
  assert.equal(requests.filter(x=>x.path.endsWith('/verify')).length,1);assert(!requests.some(x=>x.path.endsWith('/token')),'token hash does not need original-browser PKCE verifier');
  console.log('PASS: real Supabase SDK OTP/session event, sessionStorage persistence/reload, server identity, independent tabs and logout; no PKCE/cookies/Vercel transport or real account/payment.');
 }finally{for(const client of clients)await client.auth.stopAutoRefresh();}
})().catch(error=>{console.error(error);process.exitCode=1;});
