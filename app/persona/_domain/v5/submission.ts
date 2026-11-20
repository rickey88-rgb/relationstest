import { immutable } from "../immutable";
import { VERSIONS as previous } from "../v4/manifest";
import { parseSubmission as parsePrevious, describeAnswers as describePrevious } from "../v4/submission";
import { VERSIONS } from "./manifest";

function previousEnvelope(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid PERSONA submission");
  const value = input as Record<string, unknown>;
  if (value.reportVersion !== VERSIONS.report) throw new Error("Invalid PERSONA report version");
  return { ...value, reportVersion: previous.report };
}

export function parseSubmission(input: unknown) {
  return immutable({ ...parsePrevious(previousEnvelope(input)), reportVersion: VERSIONS.report });
}

export function describeAnswers(input: unknown) {
  return describePrevious(previousEnvelope(input));
}
