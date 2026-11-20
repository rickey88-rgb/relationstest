import { immutable } from "../immutable";
import { parseSubmission as parseV3 } from "../v3/submission";
import { VERSIONS as v3 } from "../v3/manifest";
import { VERSIONS } from "./manifest";
export function parseSubmission(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw Error("Invalid PERSONA V6 submission");
  const value = input as Record<string, unknown>;
  if (value.reportVersion !== VERSIONS.report) throw Error("Invalid PERSONA V6 report version");
  const validated = parseV3({ ...value, reportVersion: v3.report });
  return immutable({ ...validated, reportVersion: VERSIONS.report });
}
