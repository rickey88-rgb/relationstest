import snapshot from "./snapshot.cjs";
import type { completeReport } from "../supplement-v1/index";
export type Completion = ReturnType<typeof completeReport>;
type FrozenRuntime = Readonly<{
  completeReport: (answers: readonly unknown[], supplement?: unknown) => Completion;
  sourceFingerprint: string; sourceHashes: Readonly<Record<string,string>>;
  versions: Readonly<Record<"question"|"generator"|"analysis"|"reportContent"|"insightEngine"|"insightCatalog"|"supplement"|"supplementContent"|"quality"|"offerPolicy",string>>;
}>;
export const frozen = snapshot as unknown as FrozenRuntime;
export const SCHEMA_VERSION = "persona-result-envelope-v1";
export const QUESTION_VERSION = frozen.versions.question;
export const REPORT_VERSION = "persona-report-v61-release1";
export const SUPPLEMENT_QUESTION_VERSION = "persona-supplement-questions-v1";
export const RELEASE = Object.freeze({
  ...frozen.versions, implementation:frozen.sourceFingerprint,
  supplementQuestions:SUPPLEMENT_QUESTION_VERSION,
});
