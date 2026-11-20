import "server-only";
import { randomUUID } from "node:crypto";
import { seal, unseal, context } from "./crypto.server";
import { createV61Envelope, reopenV61Envelope, type Resume } from "./personaV61Storage.server";
import { QUESTION_VERSION, REPORT_VERSION } from "../../persona/_domain/release-v61/manifest";

export interface PersonaSql { query<T>(statement:string,params?:unknown[]):Promise<{rows:T[]}>; }
export interface PersonaOwnerTransactions {
  withOwner<T>(owner:string,operation:(sql:PersonaSql)=>Promise<T>):Promise<T>;
}
export type VerifiedIdentity=(authorization:string|null)=>Promise<{userId:string}|null>;
export class PersonaPersistentError extends Error {
  constructor(public readonly code:"unauthorized"|"not_found"|"conflict"|"invalid_data"|"unavailable"){
    super("PERSONA persistent data unavailable");Object.setPrototypeOf(this,new.target.prototype);this.name="PersonaPersistentError";
  }
}
type Row={id:string;owner_id:string;revision:number;product:string;question_version:string;report_version:string;ciphertext:string};
const uuid=(v:unknown):v is string=>typeof v==="string"&&/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(v);
const fields="id,owner_id,revision,product,question_version,report_version,ciphertext";
function aad(id:string,owner:string){
  return context({product:"persona_test",question_version:QUESTION_VERSION,report_version:REPORT_VERSION},id,owner);
}
function decode(row:Row,owner:string){
  try{
    if(row.owner_id!==owner||row.product!=="persona_test"||row.question_version!==QUESTION_VERSION||
      row.report_version!==REPORT_VERSION||typeof row.ciphertext!=="string"||row.ciphertext.length>8192)throw Error();
    return reopenV61Envelope(unseal(row.ciphertext,aad(row.id,owner)));
  }catch{throw new PersonaPersistentError("invalid_data");}
}
function encode(input:unknown,id:string,owner:string,now:string,resume?:Resume,createdAt?:string){
  try{
    const envelope=createV61Envelope(input,{now,resume,createdAt});
    const ciphertext=seal(envelope,aad(id,owner));
    if(ciphertext.length>8192)throw Error();
    return {envelope,ciphertext};
  }catch{throw new PersonaPersistentError("invalid_data");}
}
async function guarded<T>(operation:()=>Promise<T>):Promise<T>{
  try{return await operation();}catch(error){
    if(error instanceof PersonaPersistentError)throw error;
    throw new PersonaPersistentError("unavailable");
  }
}
/** No connection, migration, registration or HTTP endpoint is created here.
 * Identity must be verified on the server on EVERY operation, never supplied in a payload.
 */
export function createPersonaPersistentAdapter(transactions:PersonaOwnerTransactions,verifyIdentity:VerifiedIdentity,clock:()=>Date=()=>new Date()){
  async function owner(authorization:string|null){
    const identity=await verifyIdentity(authorization);
    if(!identity||!uuid(identity.userId))throw new PersonaPersistentError("unauthorized");
    return identity.userId;
  }
  async function rowFor(sql:PersonaSql,user:string,id:unknown){
    if(!uuid(id))throw new PersonaPersistentError("not_found");
    const rows=await sql.query<Row>("SELECT "+fields+" FROM persona_v61_test.results WHERE id=$1 AND owner_id=$2",[id,user]);
    if(rows.rows.length!==1)throw new PersonaPersistentError("not_found");
    return rows.rows[0];
  }
  return {
    create(authorization:string|null,input:unknown,resume?:Resume){
      return guarded(async()=>{
        const user=await owner(authorization),id=randomUUID(),now=clock().toISOString();
        const saved=encode(input,id,user,now,resume);
        return transactions.withOwner(user,async sql=>{
          await sql.query("INSERT INTO persona_v61_test.results(id,owner_id,revision,product,question_version,report_version,ciphertext,created_at,updated_at) VALUES($1,$2,1,$3,$4,$5,$6,$7,$7)",
            [id,user,"persona_test",QUESTION_VERSION,REPORT_VERSION,saved.ciphertext,now]);
          return {id,revision:1,...reopenV61Envelope(saved.envelope)};
        });
      });
    },
    read(authorization:string|null,id:unknown){
      return guarded(async()=>{
        const user=await owner(authorization);
        return transactions.withOwner(user,async sql=>{const row=await rowFor(sql,user,id);return {id:row.id,revision:row.revision,...decode(row,user)};});
      });
    },
    update(authorization:string|null,id:unknown,revision:unknown,input:unknown,resume?:Resume){
      return guarded(async()=>{
        const user=await owner(authorization);
        return transactions.withOwner(user,async sql=>{
          const row=await rowFor(sql,user,id);
          if(typeof revision!=="number"||!Number.isSafeInteger(revision)||revision<1||row.revision!==revision)
            throw new PersonaPersistentError("conflict");
          const previous=decode(row,user),now=clock().toISOString();
          const saved=encode(input,row.id,user,now,resume,previous.envelope.metadata.createdAt);
          const changed=await sql.query<{revision:number}>(
            "UPDATE persona_v61_test.results SET ciphertext=$1,revision=revision+1,updated_at=$7 WHERE id=$2 AND owner_id=$3 AND revision=$4 AND question_version=$5 AND report_version=$6 RETURNING revision",
            [saved.ciphertext,row.id,user,revision,QUESTION_VERSION,REPORT_VERSION,now]);
          if(changed.rows.length!==1)throw new PersonaPersistentError("conflict");
          return {id:row.id,revision:changed.rows[0].revision,...reopenV61Envelope(saved.envelope)};
        });
      });
    },
  };
}
