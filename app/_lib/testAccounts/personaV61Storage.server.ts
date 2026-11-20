import "server-only";
import { createHash } from "node:crypto";
import { seal, unseal, context } from "./crypto.server";
import { immutable } from "../../persona/_domain/immutable";
import { frozen, RELEASE, SCHEMA_VERSION, QUESTION_VERSION, REPORT_VERSION, type Completion } from "../../persona/_domain/release-v61/manifest";
import { parseSubmission, object, exact, invalid, type Submission } from "../../persona/_domain/release-v61/submission";

export type Resume = Readonly<{ screen:"questions"|"supplement"|"result"; questionIndex:number|null }>;
type Quality = ReturnType<typeof qualityOf>;
export type Envelope = Readonly<Submission & {
  schemaVersion:typeof SCHEMA_VERSION; product:"persona_test"; versions:typeof RELEASE;
  quality:Quality;
  metadata:Readonly<{ createdAt:string; updatedAt:string; resume:Resume }>;
  reopen:Readonly<{ algorithm:"sha256"; reportDigest:string }>;
}>;
export type Binding = Readonly<{ id:string; ownerId?:string; purchaseId?:string }>;
export type EncryptedRecord = Readonly<{
  id:string; product:"persona_test"; question_version:string; report_version:typeof REPORT_VERSION; ciphertext:string;
}>;
export type RecordStore = Readonly<{
  read:(id:string)=>Promise<unknown|null>;
  write:(id:string,record:EncryptedRecord)=>Promise<void>;
}>;

function canonical(value:unknown) {
  return JSON.stringify(value,(_key,item)=>item&&typeof item==="object"&&!Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key=>[key,item[key]])):item);
}
function digest(result:Completion) { return createHash("sha256").update(canonical(result)).digest("hex"); }
function qualityOf(result:Completion) {
  return {
    version:RELEASE.quality,offerPolicy:RELEASE.offerPolicy,state:result.after.state,baseState:result.before.state,
    reasons:result.after.reasons,
    counts:{validAnswers:result.before.validCount,assessedDimensions:result.before.dimensionDiagnostics.filter(d=>d.valid>=4).length,insights:result.before.insights,strengths:result.after.strengths,advice:result.after.advice,
      sections:result.after.meaningfulSections,independentUnits:result.after.independentContentUnits},
  };
}
function timestamp(value:unknown):string {
  if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)||
    !Number.isFinite(Date.parse(value))||new Date(value).toISOString()!==value)invalid();
  return value;
}
function resume(value:unknown):Resume {
  const r=object(value);exact(r,["screen","questionIndex"]);
  if(!["questions","supplement","result"].includes(r.screen as string))invalid();
  if(r.screen==="questions"){
    if(typeof r.questionIndex!=="number"||!Number.isInteger(r.questionIndex)||r.questionIndex<0||r.questionIndex>39)invalid();
  }else if(r.questionIndex!==null)invalid();
  return {screen:r.screen as Resume["screen"],questionIndex:r.questionIndex as number|null};
}
function calculate(submission:Submission) { return frozen.completeReport(submission.answers,submission.supplement?.answers??{}); }
function neutral():never { throw Error("PERSONA V6.1 data unavailable"); }

/** Server-created only. The quality snapshot is computed, never accepted as client authority. */
export function createV61Envelope(input:unknown,options:{now:string;createdAt?:string;resume?:Resume}):Envelope {
  try{
    const submission=parseSubmission(input),result=calculate(submission);
    const updatedAt=timestamp(options.now),createdAt=timestamp(options.createdAt??updatedAt);
    if(Date.parse(updatedAt)<Date.parse(createdAt))invalid();
    return immutable({
      schemaVersion:SCHEMA_VERSION,product:"persona_test",...submission,versions:RELEASE,
      quality:qualityOf(result),metadata:{createdAt,updatedAt,resume:resume(options.resume??{screen:"result",questionIndex:null})},
      reopen:{algorithm:"sha256",reportDigest:digest(result)},
    });
  }catch{neutral();}
}

/** Restore by the frozen implementation. Reject drift/mismatches rather than changing a saved report. */
export function reopenV61Envelope(input:unknown):Readonly<{envelope:Envelope;result:Completion}> {
  try{
    const value=object(input);exact(value,["schemaVersion","product","questionVersion","reportVersion","answers","supplement","versions","quality","metadata","reopen"]);
    exact(object(value.versions),Object.keys(RELEASE));
    if(value.schemaVersion!==SCHEMA_VERSION||value.product!=="persona_test"||canonical(value.versions)!==canonical(RELEASE))invalid();
    const submission=parseSubmission({questionVersion:value.questionVersion,reportVersion:value.reportVersion,answers:value.answers,supplement:value.supplement});
    const meta=object(value.metadata);exact(meta,["createdAt","updatedAt","resume"]);
    const createdAt=timestamp(meta.createdAt),updatedAt=timestamp(meta.updatedAt);
    if(Date.parse(updatedAt)<Date.parse(createdAt))invalid();
    const result=calculate(submission),quality=qualityOf(result);
    const storedQuality=object(value.quality);exact(storedQuality,["version","offerPolicy","state","baseState","reasons","counts"]);
    exact(object(storedQuality.counts),["validAnswers","assessedDimensions","insights","strengths","advice","sections","independentUnits"]);
    if(canonical(storedQuality)!==canonical(quality))invalid();
    const proof=object(value.reopen);exact(proof,["algorithm","reportDigest"]);
    if(proof.algorithm!=="sha256"||typeof proof.reportDigest!=="string"||!/^[a-f0-9]{64}$/.test(proof.reportDigest)||proof.reportDigest!==digest(result))invalid();
    const envelope:Envelope={
      schemaVersion:SCHEMA_VERSION,product:"persona_test",...submission,versions:RELEASE,quality,
      metadata:{createdAt,updatedAt,resume:resume(meta.resume)},
      reopen:{algorithm:"sha256",reportDigest:proof.reportDigest},
    };
    return immutable({envelope,result});
  }catch{neutral();}
}
function aad(binding:Binding) {
  const valid=(v:unknown)=>typeof v==="string"&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v);
  if(!valid(binding.id)||(binding.ownerId!==undefined&&!valid(binding.ownerId))||
    (binding.purchaseId!==undefined&&!valid(binding.purchaseId))||
    ((binding.ownerId===undefined)!==(binding.purchaseId===undefined)))invalid();
  return context({product:"persona_test",question_version:QUESTION_VERSION,report_version:REPORT_VERSION},
    binding.id,binding.ownerId,binding.purchaseId);
}
export function sealV61Envelope(input:unknown,binding:Binding):EncryptedRecord {
  try{
    const {envelope}=reopenV61Envelope(input),ciphertext=seal(envelope,aad(binding));
    if(ciphertext.length>8192)invalid(); // same bound as the existing unsealer
    return immutable({id:binding.id,product:"persona_test",question_version:QUESTION_VERSION,report_version:REPORT_VERSION,ciphertext});
  }catch{neutral();}
}
export function openV61Record(input:unknown,binding:Binding) {
  try{
    const record=object(input);exact(record,["id","product","question_version","report_version","ciphertext"]);
    if(record.id!==binding.id||record.product!=="persona_test"||record.question_version!==QUESTION_VERSION||
      record.report_version!==REPORT_VERSION||typeof record.ciphertext!=="string"||record.ciphertext.length>8192)invalid();
    return reopenV61Envelope(unseal(record.ciphertext,aad(binding)));
  }catch{neutral();}
}

/** Private persistence port, not an HTTP API or account/payment authorization layer.
 * Only opaque IDs/ciphertext reach the injected store. The caller must authenticate
 * ownership/possession before using this adapter in a future customer integration.
 */
export function createV61Repository(store:RecordStore,binding:Binding) {
  const bound=immutable({...binding});aad(bound);
  return {
    async load() {
      try{const record=await store.read(bound.id);return record===null?null:openV61Record(record,bound);}catch{neutral();}
    },
    async save(input:unknown,options:{now:string;resume?:Resume}) {
      try{
        const previous=await store.read(bound.id);
        // Unreadable or foreign data must not be overwritten by a fresh empty session.
        const existing=previous===null?null:openV61Record(previous,bound);
        const envelope=createV61Envelope(input,{...options,createdAt:existing?.envelope.metadata.createdAt});
        const record=sealV61Envelope(envelope,bound);
        await store.write(bound.id,record);
        return reopenV61Envelope(envelope);
      }catch{neutral();}
    },
  };
}
