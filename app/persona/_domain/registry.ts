import { immutable } from "./immutable";
import { VERSIONS as v1 } from "./v1/manifest";
import { buildReport } from "./v1/report";
import { parseSubmission, describeAnswers } from "./v1/submission";

// Add future implementations as separate entries; retain old content and calculators.
const implementations = immutable([{ versions: v1, buildReport, parseSubmission, describeAnswers }]);
export function resolvePersonaVersion(questionVersion: unknown, reportVersion: unknown) {
  const implementation = implementations.find(item => item.versions.question === questionVersion && item.versions.report === reportVersion);
  if (!implementation) throw new Error("Unsupported PERSONA version");
  return implementation;
}
export function buildPersonaReport(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid PERSONA submission");
  const value = input as Record<string, unknown>;
  return resolvePersonaVersion(value.questionVersion, value.reportVersion).buildReport(input);
}
