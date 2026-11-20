import { QUESTION_VERSION, REPORT_VERSION, SUPPLEMENT_VERSION } from "./constants";
export type Draft = { answers:(number|null)[]; cursor:number; phase:"landing"|"chapter"|"question"|"result"; supplement:Record<string,string> };
export const emptyDraft = ():Draft=>({answers:Array(40).fill(null),cursor:0,phase:"landing",supplement:{}});
export function restoreDraft(raw:string):Draft {
  const value=JSON.parse(raw);
  if(value.reportVersion!==REPORT_VERSION||value.questionVersion!==QUESTION_VERSION||
    !Array.isArray(value.answers)||value.answers.length!==40||
    !value.answers.every((a:unknown)=>a===null||typeof a==="number"&&Number.isInteger(a)&&a>=0&&a<=5)||
    !Number.isInteger(value.cursor)||value.cursor<0||value.cursor>39||
    !["landing","chapter","question","result"].includes(value.phase)||
    !value.supplement||typeof value.supplement!=="object"||Array.isArray(value.supplement)) throw Error("Invalid draft");
  const supplement:Record<string,string>={};
  const options:Record<string,string[]>={S01:["fits","context","uncertain","other","skip"],S02:["one","familiar","writing","spontaneous","no-difference","uncertain","skip"],S03:["listened","small-step","asked","alternative","no-example","uncertain","skip"],S04:["voice","pause","start","connection","preserve","none","uncertain","skip"]};
  for(const [id,option] of Object.entries(value.supplement)) {
    if(typeof option!=="string"||!options[id]?.includes(option)) throw Error("Invalid supplement");
    supplement[id]=option;
  }
  if(value.answers.slice(0,value.cursor).some((a:unknown)=>a===null)) throw Error("Unseen questions");
  if(value.phase==="result"&&value.answers.some((a:unknown)=>a===null)) throw Error("Incomplete result");
  return {answers:value.answers,cursor:value.cursor,phase:value.phase,supplement};
}
export function submissionFor(draft:Draft) {
  if(draft.answers.some(a=>a===null)) throw Error("Incomplete result");
  return {questionVersion:QUESTION_VERSION,reportVersion:REPORT_VERSION,answers:draft.answers as number[],
    supplement:Object.keys(draft.supplement).length?{questionVersion:SUPPLEMENT_VERSION,answers:draft.supplement}:null};
}
export function serializeDraft(draft:Draft) {return JSON.stringify({...draft,questionVersion:QUESTION_VERSION,reportVersion:REPORT_VERSION});}
