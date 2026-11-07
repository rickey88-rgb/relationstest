import type { Evidence, Question } from "../types";
import { fixedQuestions, getQuestion } from "./questions";
import { FIXED_COUNT, UNKNOWN } from "./manifest";

export function validAnswer(question: Question, value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value)
    && (value === UNKNOWN || (value >= 0 && value < question.options.length));
}
export function fixedAnswers(input: unknown): number[] {
  if (!Array.isArray(input) || input.length !== FIXED_COUNT) throw new Error("Invalid PERSONA fixed answers");
  // Array.from deliberately exposes sparse slots instead of silently skipping them.
  const values: unknown[] = Array.from(input);
  if (!values.every((value, index) => validAnswer(fixedQuestions[index], value))) throw new Error("Invalid PERSONA fixed answers");
  return values as number[];
}
export function answerMap(answers: readonly number[], adaptiveIds: readonly string[] = []): ReadonlyMap<string, number> {
  return new Map([...fixedQuestions.map(q => q.id), ...adaptiveIds].map((id, index) => [id, answers[index]]));
}
export function evidenceFor(questionId: string, value: number): Evidence {
  if (value === UNKNOWN || !validAnswer(getQuestion(questionId), value)) throw new Error("Invalid PERSONA evidence");
  return { questionId, answer: value };
}
