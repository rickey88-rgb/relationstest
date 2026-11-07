/** Headless stage 1 only. Deliberately not registered in checkout, analytics or account readers. */
export { VERSIONS, UNKNOWN, CHAPTERS, PRICE_SEK, FIXED_COUNT, ADAPTIVE_COUNT, TOTAL_COUNT } from "./versions";
export { fixedQuestions, adaptiveQuestions, questionBank, getQuestion, ratingLabels, unknownLabel, introduction } from "./v1/questions";
export { selectAdaptive } from "./v1/adaptive";
export { scoreDimensions } from "./v1/score";
export { parseSubmission, describeAnswers } from "./v1/submission";
export { buildPersonaReport, resolvePersonaVersion } from "./registry";
export { reconcileAdaptive } from "./v1/editing";
export type * from "./types";
