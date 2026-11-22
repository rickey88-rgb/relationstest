import { createV61Envelope, reopenV61Envelope } from "./personaV61Storage.server";
import { parseSubmission } from "../../persona/_domain/release-v61/submission";
import { REPORT_VERSION,QUESTION_VERSION } from "../../persona/_domain/release-v61/manifest";
import { presentCompletion } from "../../persona/report/v61Presentation";
import { createHash } from "node:crypto";
import { buildPurchaseReport, PURCHASE_VERSION, DELIVERY_VERSION } from "../../persona/_domain/purchase-v61/index";

function digest(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value, (_key, item) => item && typeof item === "object" && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item)).digest("hex");
}
function deliverable(presentation: ReturnType<typeof presentCompletion>) {
  if (presentation.sections.length !== 6 || presentation.sections.some(s => !s.blocks.length ||
    s.blocks.some(b => !b.title.trim() || !b.interpretation.trim()))) throw Error("PERSONA report unavailable");
}

export function prepareV61Checkout(input:unknown){
  if(process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED!=="true")throw Error("PERSONA version unavailable");
  if ((input as { reportVersion?: unknown } | null)?.reportVersion === PURCHASE_VERSION) {
    const built = buildPurchaseReport(input);
    deliverable(built.presentation);
    const base = createV61Envelope(built.submission, { now: new Date().toISOString() });
    const envelope = { ...base, reportVersion: PURCHASE_VERSION,
      delivery: { version: DELIVERY_VERSION, digest: digest(built.presentation) } };
    openV61Purchase(envelope); // Verify both frozen analysis and corrected delivery before charging.
    return { envelope, questionVersion: QUESTION_VERSION, reportVersion: PURCHASE_VERSION, testPath: "/persona-v61" };
  }
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
  if (envelope.reportVersion === PURCHASE_VERSION) {
    const { delivery, ...base } = envelope;
    const opened = reopenV61Envelope({ ...base, reportVersion: REPORT_VERSION });
    const built = buildPurchaseReport({
      questionVersion: opened.envelope.questionVersion, reportVersion: PURCHASE_VERSION,
      answers: opened.envelope.answers, supplement: opened.envelope.supplement,
    });
    deliverable(built.presentation);
    if (!delivery || typeof delivery !== "object" || Array.isArray(delivery) ||
      Object.keys(delivery).sort().join(",") !== "digest,version" ||
      (delivery as { version: unknown }).version !== DELIVERY_VERSION ||
      (delivery as { digest: unknown }).digest !== digest(built.presentation)) throw Error("PERSONA delivery unavailable");
    return { product: "persona_test" as const, reportVersion: PURCHASE_VERSION, presentation: built.presentation };
  }
  const opened=reopenV61Envelope(envelope);
  if(opened.result.after.state!=="ready")throw Error("PERSONA report unavailable");
  return {product:"persona_test" as const,reportVersion:REPORT_VERSION,presentation:presentCompletion(opened.result)};
}
