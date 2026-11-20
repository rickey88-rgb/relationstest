/* eslint-disable @typescript-eslint/no-require-imports -- local HTTP boundary, no provider access */
const test=require("node:test"),assert=require("node:assert/strict"),path=require("node:path");
const {NextRequest}=require("next/server"),createLoader=require("../../app/autism-test/test/test-loader.cjs");
const root=path.resolve(__dirname,"../.."),routePath=path.join(root,"app/persona/dev-storage-v61/api/route.ts");
let calls=0,authorized=false,allowLocal=true;
const fake={
 session:async()=>{if(!authorized)throw Object.assign(Error("hidden"),{code:"unauthorized"});return {authorized:true};},
 newSession:async()=>{calls++;return {token:"T".repeat(43)};},endSession:async()=>{calls++;},
 create:async()=>{calls++;throw Error("unexpected");},update:async()=>{calls++;throw Error("unexpected");},
 read:async()=>{if(!authorized)throw Object.assign(Error("hidden"),{code:"unauthorized"});throw Object.assign(Error("hidden"),{code:"not_found"});},
};
const load=createLoader({"../../dev-report/access":{canOpenLocalReport:async()=>allowLocal},"../runtime.server":{localRuntime:async()=>{calls++;return fake;}}});
const route=load(routePath),oldEnv=process.env.NODE_ENV;
const request=(method="GET",body,query="")=>new NextRequest("http://127.0.0.1:3000/persona/dev-storage-v61/api"+query,{
 method,headers:{origin:"http://127.0.0.1:3000","content-type":"application/json"},
 ...(body!==undefined?{body:typeof body==="string"?body:JSON.stringify(body)}:{})});
test.before(()=>{process.env.NODE_ENV="development";});
test.after(()=>{if(oldEnv===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=oldEnv;});
test.beforeEach(()=>{calls=0;authorized=false;allowLocal=true;});
test("production GET and POST deny access before creating any DB/session",async()=>{
 process.env.NODE_ENV="production";
 try{
  for(const method of ["GET","POST"]){
   const result=await route[method](request(method,method==="POST"?{action:"new-session"}:undefined));
   assert.equal(result.status,404);assert.equal(result.headers.get("set-cookie"),null);
  }
  assert.equal(calls,0);
 }finally{process.env.NODE_ENV="development";}
});
test("non-local requests deny access before database loading",async()=>{
 allowLocal=false;
 assert.equal((await route.GET(request())).status,404);
 assert.equal((await route.POST(request("POST",{action:"new-session"}))).status,404);
 assert.equal(calls,0);
});
test("result ID alone is unauthorized and errors do not reveal private data",async()=>{
 const response=await route.GET(request("GET",undefined,"?result=11111111-1111-4111-8111-111111111111"));
 assert.equal(response.status,401);assert.deepEqual(await response.json(),{error:"unavailable"});
 assert.match(response.headers.get("cache-control"),/no-store/);
});
test("new session secret appears only in an HttpOnly, scoped, strict cookie",async()=>{
 const response=await route.POST(request("POST",{action:"new-session"}));
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{authorized:true});
 const cookie=response.headers.get("set-cookie");
 assert(cookie.includes("T".repeat(43)));assert(cookie.includes("HttpOnly"));assert(cookie.includes("SameSite=strict"));
 assert(cookie.includes("Path=/persona/dev-storage-v61"));assert(cookie.includes("Max-Age=3600"));
});
test("malformed/oversized bodies and client-injected owner fields cannot write data",async()=>{
 for(const body of ["{", " ".repeat(8193),{action:"create",ownerId:"fake",profile:"F21",supplement:null,resume:{screen:"result",questionIndex:null}}]){
  const response=await route.POST(request("POST",body));assert.equal(response.status,400);
 }
 assert.equal(calls,3); // runtime lookup only, never session creation or data writes
});
test("unknown session actions cannot grant authority or mutate data",async()=>{
 const response=await route.POST(request("POST",{action:"login-as-owner",ownerId:"fake"}));
 assert.equal(response.status,400);assert.equal(calls,1);
});
test("Node runtime is explicit and GET without a result is a session check only",async()=>{
 assert.equal(route.runtime,"nodejs");authorized=true;
 const response=await route.GET(request());assert.equal(response.status,200);
 assert.deepEqual(await response.json(),{authorized:true});assert.equal(calls,1);
});
