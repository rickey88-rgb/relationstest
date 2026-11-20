import { immutable } from "../immutable";
import { frozen, QUESTION_VERSION, REPORT_VERSION, SUPPLEMENT_QUESTION_VERSION } from "./manifest";

export type Supplement = Readonly<{ questionVersion:typeof SUPPLEMENT_QUESTION_VERSION; answers:Readonly<Record<string,string>> }>;
export type Submission = Readonly<{
  questionVersion:string; reportVersion:typeof REPORT_VERSION; answers:readonly number[]; supplement:Supplement|null;
}>;
export function invalid(): never { throw Error("Invalid PERSONA V6.1 data"); }
export function object(value:unknown): Record<string,unknown> {
  if(!value||typeof value!=="object"||Array.isArray(value)||
    ![Object.prototype,null].includes(Object.getPrototypeOf(value)))invalid();
  return value as Record<string,unknown>;
}
export function exact(value:Record<string,unknown>,keys:readonly string[]) {
  if(Object.keys(value).sort().join(",")!==Array.from(keys).sort().join(","))invalid();
}
export function parseSubmission(input:unknown):Submission {
  const value=object(input);
  exact(value,Object.hasOwn(value,"supplement")?["answers","questionVersion","reportVersion","supplement"]:["answers","questionVersion","reportVersion"]);
  if(value.questionVersion!==QUESTION_VERSION||value.reportVersion!==REPORT_VERSION||
    !Array.isArray(value.answers)||value.answers.length!==40)invalid();
  const answers=Array.from(value.answers);
  if(!answers.every(a=>typeof a==="number"&&Number.isInteger(a)&&a>=0&&a<=5))invalid();
  let supplement:Supplement|null=null;
  if(Object.hasOwn(value,"supplement")&&value.supplement!==null){
    const extra=object(value.supplement);exact(extra,["questionVersion","answers"]);
    if(extra.questionVersion!==SUPPLEMENT_QUESTION_VERSION)invalid();
    const selections=object(extra.answers),canonical:Record<string,string>={};
    // The frozen completion parser validates option IDs and relevance. Never accept
    // guessed options or a newer question bank under an old release identity.
    for(const id of ["S01","S02","S03","S04"])if(Object.hasOwn(selections,id)){
      if(typeof selections[id]!=="string")invalid();canonical[id]=selections[id] as string;
    }
    if(Object.keys(canonical).length!==Object.keys(selections).length)invalid();
    supplement={questionVersion:SUPPLEMENT_QUESTION_VERSION,answers:canonical};
  }
  const submission:Submission={questionVersion:QUESTION_VERSION,reportVersion:REPORT_VERSION,answers,supplement};
  try{frozen.completeReport(answers,supplement?.answers??{});}catch{invalid();}
  return immutable(submission);
}
