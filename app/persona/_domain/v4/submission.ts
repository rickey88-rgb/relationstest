import type { Submission } from "../types";
import { immutable } from "../immutable";
import { VERSIONS as previous } from "../v3/manifest";
import { parseSubmission as parseV3, describeAnswers as describeV3 } from "../v3/submission";
import { VERSIONS } from "./manifest";

function previousEnvelope(input: unknown): Submission {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid PERSONA submission");
  const value = input as Record<string, unknown>;
  if (Object.keys(value).sort().join(",") !== "answers,questionVersion,reportVersion"
    || value.questionVersion !== VERSIONS.question || value.reportVersion !== VERSIONS.report) throw new Error("Invalid PERSONA submission");
  return parseV3({ ...value, reportVersion: previous.report });
}

export function parseSubmission(input: unknown): Submission {
  return immutable({ ...previousEnvelope(input), reportVersion: VERSIONS.report });
}
export function describeAnswers(input: unknown) {
  return describeV3(previousEnvelope(input));
}
