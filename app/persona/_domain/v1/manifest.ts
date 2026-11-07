import { immutable } from "../immutable";
/** V1 imports its own manifest. A future current-version alias must not alter old reports. */
export const VERSIONS = immutable({
  question: "persona-questions-v1", report: "persona-report-v1",
  analysis: "persona-analysis-v1", adaptive: "persona-adaptive-v1",
  content: "persona-creative-revision-v1",
} as const);
export const UNKNOWN = 5;
export const FIXED_COUNT = 34;
export const ADAPTIVE_COUNT = 6;
export const TOTAL_COUNT = 40;
export const PRICE_SEK = 79;
