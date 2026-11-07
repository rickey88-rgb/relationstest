import type { Submission } from "../types";
import { immutable } from "../immutable";
import { fixedAnswers } from "./answers";
import { selectAdaptive } from "./adaptive";
import { parseSubmission } from "./submission";

/** Completed previous draft only. Answers survive edits by question ID, never by old position. */
export function reconcileAdaptive(previous: unknown, nextFixed: unknown) {
  const saved: Submission = parseSubmission(previous);
  const oldSelection = selectAdaptive(saved.answers.slice(0, 34));
  const fixed = fixedAnswers(nextFixed);
  const nextSelection = selectAdaptive(fixed);
  const previousById = new Map(oldSelection.selectedIds.map((id, index) => [id, saved.answers[34 + index]]));
  return immutable({ fixedAnswers: fixed, selection: nextSelection,
    followups: nextSelection.selectedIds.map(questionId => ({ questionId,
      // null means unanswered; UNKNOWN=5 remains a deliberate, completed response.
      answer: previousById.has(questionId) ? previousById.get(questionId)! : null })),
    removedIds: oldSelection.selectedIds.filter(id => !nextSelection.selectedIds.includes(id)),
  });
}
