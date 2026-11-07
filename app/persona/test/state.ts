import { FIXED_COUNT, TOTAL_COUNT, UNKNOWN, VERSIONS } from "../_domain/versions";
import { fixedQuestions, getQuestion } from "../_domain/v2/questions";
import { validAnswer } from "../_domain/v2/answers";
import { selectAdaptive } from "../_domain/v2/adaptive";
import { parseSubmission } from "../_domain/v2/submission";
import type { Question, Submission } from "../_domain/types";

export const STORAGE_KEY = "relationsvarning_persona_flow_v2";
export const FLOW_VERSION = 2;
export type Followup = { questionId: string; answer: number | null };
export type Draft = {
  version: 2; questionVersion: string; reportVersion: string;
  fixed: (number | null)[]; followups: Followup[];
  cursor: number; phase: "chapter" | "question" | "preview";
};
export type Action = { type: "answer"; value: number } | { type: "next" | "back" | "start" | "review" | "restart" };
export const chapterStarts = [0, 10, 22, 34] as const;
export function chapterAt(cursor: number): 1 | 2 | 3 | 4 {
  return cursor < 10 ? 1 : cursor < 22 ? 2 : cursor < 34 ? 3 : 4;
}
export function initialDraft(): Draft {
  return { version: FLOW_VERSION, questionVersion: VERSIONS.question, reportVersion: VERSIONS.report,
    fixed: Array(FIXED_COUNT).fill(null), followups: [], cursor: 0, phase: "chapter" };
}
function completeFixed(fixed: readonly (number | null)[]): fixed is readonly number[] {
  return fixed.every((value, i) => validAnswer(fixedQuestions[i], value));
}
function selectedFollowups(fixed: readonly (number | null)[], previous: readonly Followup[]): Followup[] {
  if (!completeFixed(fixed)) return [];
  const previousById = new Map(previous.map(item => [item.questionId, item.answer]));
  return selectAdaptive(fixed).selectedIds.map(questionId => ({ questionId, answer: previousById.get(questionId) ?? null }));
}
export function currentQuestion(draft: Draft): Question | null {
  if (draft.cursor < FIXED_COUNT) return fixedQuestions[draft.cursor];
  const item = draft.followups[draft.cursor - FIXED_COUNT];
  return item ? getQuestion(item.questionId) : null;
}
export function currentAnswer(draft: Draft): number | null {
  return draft.cursor < FIXED_COUNT ? draft.fixed[draft.cursor] : draft.followups[draft.cursor - FIXED_COUNT]?.answer ?? null;
}
export function answeredCount(draft: Draft): number {
  return draft.fixed.filter(value => value !== null).length + draft.followups.filter(item => item.answer !== null).length;
}
export function toSubmission(draft: Draft): Submission | null {
  if (!completeFixed(draft.fixed) || draft.followups.length !== 6 || draft.followups.some(f => f.answer === null)) return null;
  return parseSubmission({ questionVersion: draft.questionVersion, reportVersion: draft.reportVersion,
    answers: [...draft.fixed, ...draft.followups.map(f => f.answer)] });
}
export function reduceDraft(draft: Draft, action: Action): Draft {
  if (action.type === "restart") return initialDraft();
  if (action.type === "review") return { ...draft, cursor: 0, phase: "question" };
  if (action.type === "start") return draft.phase === "chapter" ? { ...draft, phase: "question" } : draft;
  if (action.type === "back") {
    if (draft.phase === "preview") return { ...draft, cursor: TOTAL_COUNT - 1, phase: "question" };
    return draft.cursor === 0 ? { ...draft, phase: "chapter" } : { ...draft, cursor: draft.cursor - 1, phase: "question" };
  }
  if (draft.phase !== "question") return draft;
  if (action.type === "answer") {
    const question = currentQuestion(draft);
    if (!question || !validAnswer(question, action.value)) return draft;
    if (draft.cursor < FIXED_COUNT) {
      const fixed = draft.fixed.map((value, i) => i === draft.cursor ? action.value : value);
      return { ...draft, fixed, followups: selectedFollowups(fixed, draft.followups) };
    }
    return { ...draft, followups: draft.followups.map((item, i) => i === draft.cursor - FIXED_COUNT ? { ...item, answer: action.value } : item) };
  }
  if (action.type === "next" && currentAnswer(draft) !== null) {
    if (draft.cursor === TOTAL_COUNT - 1) return toSubmission(draft) ? { ...draft, phase: "preview" } : draft;
    const cursor = draft.cursor + 1;
    return { ...draft, cursor, phase: chapterStarts.some(start => start === cursor) ? "chapter" : "question" };
  }
  return draft;
}

/** Browser storage is untrusted: no unlock flag, scores, preview or client-selected order survives. */
export function parseDraft(raw: string | null): Draft | null {
  try {
    if (!raw || raw.length > 12000) return null;
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return null;
    const value = saved as Record<string, unknown>;
    if (Object.keys(value).sort().join(",") !== "cursor,fixed,followups,phase,questionVersion,reportVersion,version"
      || value.version !== FLOW_VERSION || value.questionVersion !== VERSIONS.question || value.reportVersion !== VERSIONS.report
      || !Array.isArray(value.fixed) || value.fixed.length !== FIXED_COUNT
      || !Array.from(value.fixed).every((answer, i) => answer === null || validAnswer(fixedQuestions[i], answer))
      || !Array.isArray(value.followups) || value.followups.length > 6
      || !Number.isInteger(value.cursor) || (value.cursor as number) < 0 || (value.cursor as number) >= TOTAL_COUNT
      || !["chapter", "question", "preview"].includes(value.phase as string)) return null;
    const fixed = [...value.fixed] as (number | null)[];
    const followups: Followup[] = [];
    const ids = new Set<string>();
    for (const item of value.followups) {
      if (!item || typeof item !== "object" || Array.isArray(item)
        || Object.keys(item).sort().join(",") !== "answer,questionId"
        || typeof item.questionId !== "string" || ids.has(item.questionId)
        || !/^A\d{2}$/.test(item.questionId)) return null;
      const question = getQuestion(item.questionId);
      if (item.answer !== null && !validAnswer(question, item.answer)) return null;
      ids.add(item.questionId); followups.push({ questionId: item.questionId, answer: item.answer });
    }
    const canonical = selectedFollowups(fixed, followups);
    const draft: Draft = { version: FLOW_VERSION, questionVersion: VERSIONS.question, reportVersion: VERSIONS.report,
      fixed, followups: canonical, cursor: value.cursor as number, phase: value.phase as Draft["phase"] };
    if (draft.cursor >= FIXED_COUNT && !completeFixed(fixed)) {
      draft.cursor = fixed.findIndex(answer => answer === null); draft.phase = "question";
    }
    if (draft.phase === "preview" && !toSubmission(draft)) {
      const first = [...draft.fixed, ...draft.followups.map(f => f.answer)].findIndex(answer => answer === null);
      draft.cursor = first >= 0 ? first : 0; draft.phase = "question";
    }
    if (draft.phase === "chapter" && !chapterStarts.some(start => start === draft.cursor)) draft.phase = "question";
    return draft;
  } catch { return null; }
}
export { UNKNOWN };
