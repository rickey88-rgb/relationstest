import type { Submission } from "../types";
import { immutable } from "../immutable";
import { SKIPPED, TOTAL_COUNT, VERSIONS } from "./manifest";
import { questions, ratingLabels, skippedLabel } from "./questions";

export function validAnswer(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= SKIPPED && value <= 5;
}

export function parseSubmission(input: unknown): Submission {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid PERSONA submission");
  const value = input as Record<string, unknown>;
  if (Object.keys(value).sort().join(",") !== "answers,questionVersion,reportVersion"
    || value.questionVersion !== VERSIONS.question || value.reportVersion !== VERSIONS.report
    || !Array.isArray(value.answers) || value.answers.length !== TOTAL_COUNT) throw new Error("Invalid PERSONA submission");
  const answers = Array.from(value.answers);
  if (!answers.every(validAnswer)) throw new Error("Invalid PERSONA answers");
  return immutable({ questionVersion: VERSIONS.question, reportVersion: VERSIONS.report, answers });
}

export function describeAnswers(input: unknown) {
  const { answers } = parseSubmission(input);
  return immutable(questions.map((question, index) => ({
    questionId: question.id, title: "", question: question.prompt, value: answers[index],
    answer: answers[index] === SKIPPED ? skippedLabel : ratingLabels[answers[index] - 1],
  })));
}
