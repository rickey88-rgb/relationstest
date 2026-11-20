import { createV61Envelope, reopenV61Envelope } from "./personaV61Storage.server";
import { parseSubmission } from "../../persona/_domain/release-v61/submission";
import { REPORT_VERSION,QUESTION_VERSION } from "../../persona-v61/constants";
import { presentCompletion } from "../../persona/report/v61Presentation";

export function prepareV61Checkout(input:unknown){
  if(process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED!=="true")throw Error("PERSONA version unavailable");
  const submission=parseSubmission(input);
  const envelope=createV61Envelope(submission,{now:new Date().toISOString()});
  const opened=reopenV61Envelope(envelope);
  if(opened.result.after.state!=="ready")throw Error("PERSONA premium unavailable");
  // Build the exact deliverable before a Checkout can be created.
  const presentation=presentCompletion(opened.result);
  if(presentation.sections.length!==6||presentation.sections.some(s=>!s.blocks.length))throw Error("PERSONA report unavailable");
  return {envelope,questionVersion:QUESTION_VERSION,reportVersion:REPORT_VERSION,testPath:"/persona-v61"};
}
export function openV61Purchase(data:unknown){
  if(!data||typeof data!=="object"||Array.isArray(data))throw Error("PERSONA data unavailable");
  const {guestConsent: _consent,...envelope}=data as Record<string,unknown>;
  void _consent;
  const opened=reopenV61Envelope(envelope);
  if(opened.result.after.state!=="ready")throw Error("PERSONA report unavailable");
  return {product:"persona_test" as const,reportVersion:REPORT_VERSION,presentation:presentCompletion(opened.result)};
}
