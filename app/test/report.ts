import { calculate } from "./screening";
import { resultAnalysis } from "./analysis";
/** Original scoring and interpretation, including answer-specific markers and safety priorities. */
export function calculateReport(answers: number[]) {
  const profile = calculate(answers);
  return { profile, analysis: resultAnalysis(profile, answers) };
}
export type ScreeningReport = ReturnType<typeof calculateReport>;
