import { NextRequest, NextResponse } from "next/server";
import { canOpenLocalReport } from "../../dev-report/access";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const COOKIE="rv_persona_v61_local_session";
const cookieOptions={httpOnly:true,sameSite:"strict" as const,secure:false,path:"/persona/dev-storage-v61",maxAge:3600};
const respond=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store","Referrer-Policy":"no-referrer","X-Content-Type-Options":"nosniff"}});
function failure(error:unknown) {
  const code=(error as {code?:string})?.code;
  return respond({error:code==="conflict"?"conflict":"unavailable"},code==="unauthorized"?401:code==="not_found"?404:code==="conflict"?409:code==="invalid_data"?422:503);
}
export async function GET(request:NextRequest) {
  if(process.env.NODE_ENV!=="development"||!(await canOpenLocalReport()))return respond({error:"not_found"},404);
  try{
    const {localRuntime}=await import("../runtime.server"),db=await localRuntime();
    const token=request.cookies.get(COOKIE)?.value,id=request.nextUrl.searchParams.get("result");
    if(!id)return respond(await db.session(token));
    const loaded=await db.read(token,id);
    const {profileForAnswers}=await import("../fixtures.server");
    return respond({profile:profileForAnswers(loaded.envelope.answers),id:loaded.id,revision:loaded.revision,quality:loaded.envelope.quality,
      supplement:loaded.envelope.supplement?.answers??{},resume:loaded.envelope.metadata.resume,digest:loaded.envelope.reopen.reportDigest});
  }catch(error){return failure(error);}
}
async function readBody(request:NextRequest):Promise<Record<string,unknown>> {
  const reader=request.body?.getReader();if(!reader)throw Error("Invalid body");
  const chunks:Uint8Array[]=[];let length=0;
  try{for(;;){const part=await reader.read();if(part.done)break;length+=part.value.length;
    if(length>8192){await reader.cancel();throw Error("Body too large");}chunks.push(part.value);}
  }finally{reader.releaseLock();}
  const data=new Uint8Array(length);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.length;}
  const body=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(data));
  if(!body||typeof body!=="object"||Array.isArray(body))throw Error("Invalid body");
  return body;
}
export async function POST(request:NextRequest) {
  if(process.env.NODE_ENV!=="development"||!(await canOpenLocalReport(true)))return respond({error:"not_found"},404);
  try{
    const {localRuntime}=await import("../runtime.server"),db=await localRuntime();
    let body:Record<string,unknown>;
    try{body=await readBody(request);}catch{return respond({error:"invalid_request"},400);}
    const token=request.cookies.get(COOKIE)?.value;
    if(body.action==="new-session"&&Object.keys(body).length===1){
      const session=await db.newSession(),response=respond({authorized:true});
      response.cookies.set(COOKIE,session.token,cookieOptions);return response;
    }
    if(body.action==="end-session"&&Object.keys(body).length===1){
      await db.endSession(token);const response=respond({authorized:false});
      response.cookies.set(COOKIE,"",{...cookieOptions,maxAge:0});return response;
    }
    if(body.action!=="create"&&body.action!=="save")return respond({error:"invalid_request"},400);
    const keys=Object.keys(body).sort().join(",");
    const expected=body.action==="create"?"action,profile,resume,supplement":"action,id,profile,resume,revision,supplement";
    if(keys!==expected)return respond({error:"invalid_request"},400);
    await db.session(token); // authenticate before loading fixtures or calculating
    const {syntheticSubmission,profileForAnswers}=await import("../fixtures.server");
    let input:ReturnType<typeof syntheticSubmission>;
    try{input=syntheticSubmission(body.profile,body.supplement);}catch{return respond({error:"invalid_request"},422);}
    const saved=body.action==="create"?await db.create(token,input,body.resume as never):
      await db.update(token,body.id,body.revision,input,body.resume as never);
    return respond({profile:profileForAnswers(saved.envelope.answers),id:saved.id,revision:saved.revision,quality:saved.envelope.quality,
      supplement:saved.envelope.supplement?.answers??{},resume:saved.envelope.metadata.resume,digest:saved.envelope.reopen.reportDigest});
  }catch(error){return failure(error);}
}
