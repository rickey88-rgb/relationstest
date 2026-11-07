import type { Submission } from "../types";
import { immutable } from "../immutable";
import { FIXED_COUNT, TOTAL_COUNT, UNKNOWN, VERSIONS } from "./manifest";
import { fixedAnswers, validAnswer } from "./answers";
import { selectAdaptive } from "./adaptive";
import { fixedQuestions, getQuestion } from "./questions";

/** Server boundary: never accept client-selected IDs, scores, findings or unlock flags. */
export function parseSubmission(input: unknown): Submission {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid PERSONA submission");
  const value = input as Record<string, unknown>;
  if (Object.keys(value).sort().join(",") !== "answers,questionVersion,reportVersion"
    || value.questionVersion !== VERSIONS.question || value.reportVersion !== VERSIONS.report
    || !Array.isArray(value.answers) || value.answers.length !== TOTAL_COUNT) throw new Error("Invalid PERSONA submission");
  const answers = Array.from(value.answers) as unknown[];
  const fixed = fixedAnswers(answers.slice(0, FIXED_COUNT));
  const selection = selectAdaptive(fixed);
  if (!selection.selectedIds.every((id, i) => validAnswer(getQuestion(id), answers[FIXED_COUNT + i]))) throw new Error("Invalid PERSONA adaptive answers");
  return immutable({ questionVersion: VERSIONS.question, reportVersion: VERSIONS.report, answers: answers as number[] });
}
/** Reconstructs the exact versioned wording, including selected adaptive questions. */
export function describeAnswers(input: unknown) {
  const submission = parseSubmission(input);
  const selection = selectAdaptive(submission.answers.slice(0, FIXED_COUNT));
  return immutable([...fixedQuestions, ...selection.selectedIds.map(getQuestion)].map((q, i) => ({
    questionId: q.id, title: q.title, question: q.prompt, value: submission.answers[i],
    answer: submission.answers[i] === UNKNOWN ? "Svårt att bedöma" : q.options[submission.answers[i]],
  })));
}
