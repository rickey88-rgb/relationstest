/** Complete, versioned answers only. Browser flags, scores and email are never accepted. */
export function parseAnswers(input: unknown, questionVersion: string, reportVersion: string, count: number) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid answers");
  const value = input as Record<string, unknown>;
  if (Object.keys(value).sort().join(",") !== "answers,questionVersion,reportVersion"
    || value.questionVersion !== questionVersion || value.reportVersion !== reportVersion
    || !Array.isArray(value.answers) || value.answers.length !== count
    || !Array.from(value.answers).every(a => typeof a === "number" && Number.isInteger(a) && a >= 0 && a <= 4)) throw new Error("Invalid answers");
  return [...value.answers] as number[];
}
