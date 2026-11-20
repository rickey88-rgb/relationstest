import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createV61Envelope, sealV61Envelope, openV61Record, type Resume } from "./personaV61Storage.server";
import { QUESTION_VERSION, REPORT_VERSION } from "../../persona/_domain/release-v61/manifest";

export interface LocalSql {
  exec(sql:string):Promise<unknown>;
  query<T>(sql:string,params?:unknown[]):Promise<{rows:T[]}>;
}
export class LocalDataError extends Error {
  constructor(public readonly code:"unauthorized"|"not_found"|"conflict"|"invalid_data") {
    super("Local PERSONA data unavailable"); this.name="LocalDataError";
  }
}
type Row={id:string;owner_id:string;revision:number;product:"persona_test";question_version:string;report_version:typeof REPORT_VERSION;ciphertext:string};
const uuid=(value:unknown):value is string=>typeof value==="string"&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
const tokenHash=(value:string)=>createHash("sha256").update(value).digest("hex");
const recordOf=(row:Row)=>({id:row.id,product:row.product,question_version:row.question_version,report_version:row.report_version,ciphertext:row.ciphertext});
const schema=`
CREATE TABLE persona_v61_local_sessions (
  token_hash text PRIMARY KEY CHECK(length(token_hash)=64),
  owner_id uuid NOT NULL, expires_at timestamptz NOT NULL
);
CREATE TABLE persona_v61_local_results (
  id uuid PRIMARY KEY, owner_id uuid NOT NULL, revision integer NOT NULL CHECK(revision>=1),
  product text NOT NULL CHECK(product='persona_test'),
  question_version text NOT NULL CHECK(question_version='persona-questions-v3'),
  report_version text NOT NULL CHECK(report_version='persona-report-v61-release1'),
  ciphertext text NOT NULL CHECK(length(ciphertext)<=8192),
  updated_at timestamptz NOT NULL
);
CREATE INDEX persona_v61_local_owner ON persona_v61_local_results(owner_id);
`;

/** Dedicated local database only. Never call with the customer database/production SQL connection.
 * Every query is parameterized; neither sessions nor answers are accepted as authority from the client.
 */
export async function createLocalDatabase(db:LocalSql,clock:()=>Date=()=>new Date()) {
  await db.exec(schema);
  async function authorize(token:unknown) {
    if(typeof token!=="string"||!/^[A-Za-z0-9_-]{43}$/.test(token))throw new LocalDataError("unauthorized");
    const result=await db.query<{owner_id:string}>(
      "SELECT owner_id FROM persona_v61_local_sessions WHERE token_hash=$1 AND expires_at>$2",
      [tokenHash(token),clock().toISOString()]);
    if(result.rows.length!==1)throw new LocalDataError("unauthorized");
    return result.rows[0].owner_id;
  }
  async function rowFor(owner:string,id:unknown) {
    if(!uuid(id))throw new LocalDataError("not_found");
    const result=await db.query<Row>("SELECT * FROM persona_v61_local_results WHERE id=$1 AND owner_id=$2",[id,owner]);
    if(result.rows.length!==1)throw new LocalDataError("not_found");
    return result.rows[0];
  }
  function decode(row:Row) {
    try{return openV61Record(recordOf(row),{id:row.id});}catch{throw new LocalDataError("invalid_data");}
  }
  function checkedRevision(value:unknown):number {
    if(typeof value!=="number"||!Number.isSafeInteger(value)||value<1)throw new LocalDataError("conflict");
    return value;
  }
  return {
    async newSession() {
      const token=randomBytes(32).toString("base64url"),owner=randomUUID();
      const expiry=new Date(clock().getTime()+60*60*1000).toISOString();
      await db.query("INSERT INTO persona_v61_local_sessions(token_hash,owner_id,expires_at) VALUES($1,$2,$3)",[tokenHash(token),owner,expiry]);
      return {token,expiresAt:expiry};
    },
    async session(token:unknown) {
      const owner=await authorize(token);
      const last=await db.query<{id:string}>("SELECT id FROM persona_v61_local_results WHERE owner_id=$1 ORDER BY updated_at DESC,id DESC LIMIT 1",[owner]);
      return {authorized:true as const,lastResultId:last.rows[0]?.id??null};
    },
    async endSession(token:unknown) {
      await authorize(token);
      await db.query("DELETE FROM persona_v61_local_sessions WHERE token_hash=$1",[tokenHash(token as string)]);
    },
    async create(token:unknown,input:unknown,resume?:Resume) {
      const owner=await authorize(token),id=randomUUID();
      try{
        const envelope=createV61Envelope(input,{now:clock().toISOString(),resume});
        const record=sealV61Envelope(envelope,{id});
        await db.query("INSERT INTO persona_v61_local_results(id,owner_id,revision,product,question_version,report_version,ciphertext,updated_at) VALUES($1,$2,1,$3,$4,$5,$6,$7)",
          [id,owner,record.product,record.question_version,record.report_version,record.ciphertext,clock().toISOString()]);
        return {id,revision:1,...openV61Record(record,{id})};
      }catch{throw new LocalDataError("invalid_data");}
    },
    async read(token:unknown,id:unknown) {
      const owner=await authorize(token),row=await rowFor(owner,id);
      return {id:row.id,revision:row.revision,...decode(row)};
    },
    async update(token:unknown,id:unknown,expectedRevision:unknown,input:unknown,resume?:Resume) {
      const owner=await authorize(token),row=await rowFor(owner,id),revision=checkedRevision(expectedRevision);
      if(row.revision!==revision)throw new LocalDataError("conflict");
      const previous=decode(row);
      let record;
      try{
        const envelope=createV61Envelope(input,{now:clock().toISOString(),createdAt:previous.envelope.metadata.createdAt,resume});
        record=sealV61Envelope(envelope,{id:row.id});
      }catch{throw new LocalDataError("invalid_data");}
      // Atomic compare-and-swap. Two readers of revision N cannot both write N+1.
      const changed=await db.query<{revision:number}>(
        "UPDATE persona_v61_local_results SET ciphertext=$1,revision=revision+1,updated_at=$7 WHERE id=$2 AND owner_id=$3 AND revision=$4 AND question_version=$5 AND report_version=$6 RETURNING revision",
        [record.ciphertext,row.id,owner,revision,QUESTION_VERSION,REPORT_VERSION,clock().toISOString()]);
      if(changed.rows.length!==1)throw new LocalDataError("conflict");
      return {id:row.id,revision:changed.rows[0].revision,...openV61Record(record,{id:row.id})};
    },
  };
}
