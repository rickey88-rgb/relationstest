/** Current PERSONA material. Archived v1 remains separate for regression and comparison. */
export { VERSIONS, UNKNOWN, CHAPTERS, PRICE_SEK, FIXED_COUNT, ADAPTIVE_COUNT, TOTAL_COUNT } from "./versions";
export { fixedQuestions, adaptiveQuestions, questionBank, getQuestion, ratingLabels, unknownLabel, introduction } from "./v2/questions";
export { selectAdaptive } from "./v2/adaptive";
export { scoreDimensions } from "./v2/score";
export { parseSubmission, describeAnswers } from "./v2/submission";
export { buildPersonaReport, resolvePersonaVersion } from "./registry";
export { reconcileAdaptive } from "./v2/editing";
export type * from "./types";
