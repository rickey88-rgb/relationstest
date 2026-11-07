export { VERSIONS, UNKNOWN, PRICE_SEK, FIXED_COUNT, ADAPTIVE_COUNT, TOTAL_COUNT } from "./manifest";
export { CHAPTERS } from "../versions";
export { fixedQuestions, adaptiveQuestions, questionBank, getQuestion, ratingLabels, unknownLabel, introduction } from "./questions";
export { selectAdaptive } from "./adaptive";
export { scoreDimensions } from "./score";
export { parseSubmission, describeAnswers } from "./submission";
export { reconcileAdaptive } from "./editing";
export { buildPersonaReport, resolvePersonaVersion } from "../registry";
