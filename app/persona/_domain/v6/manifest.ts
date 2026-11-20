import { immutable } from "../immutable";
import { VERSIONS as previous } from "../v3/manifest";
export const VERSIONS = immutable({
  question: previous.question, report: "persona-report-v6", analysis: "persona-analysis-v6",
  content: "persona-report-content-v6.3",
} as const);
export const SECTION_TITLES = immutable({
  persona: "Din PERSONA", insights: "Det du kanske inte ser hos dig själv",
  strengths: "Dina styrkor", blindSpots: "Dina blinda fläckar",
  relationships: "Du och andra människor", compass: "Din utvecklingskompass",
} as const);
