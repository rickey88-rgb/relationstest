import "server-only";
import profiles from "../../../tests/persona/insights-v2-full-fixtures.cjs";
import { QUESTION_VERSION, REPORT_VERSION, SUPPLEMENT_QUESTION_VERSION } from "../_domain/release-v61/manifest";
export function syntheticSubmission(profile:unknown,supplement:unknown) {
  const selected=profiles.find((p:{id:string})=>p.id===profile);
  if(!selected)throw Error("Unknown synthetic profile");
  return {questionVersion:QUESTION_VERSION,reportVersion:REPORT_VERSION,answers:selected.answers.slice(),
    ...(supplement===null?{}:{supplement:{questionVersion:SUPPLEMENT_QUESTION_VERSION,answers:supplement}})};
}

export function profileForAnswers(answers:readonly number[]) {
  return profiles.find((p:{answers:number[]})=>p.answers.length===answers.length&&p.answers.every((a:number,i:number)=>a===answers[i]))?.id??null;
}
