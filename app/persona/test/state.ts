import { CHAPTER_SIZE, TOTAL_COUNT, VERSIONS as previous } from "../_domain/v3/manifest";
import { VERSIONS as v4 } from "../_domain/v4/manifest";
import { VERSIONS } from "../_domain/v5/manifest";
import { questions } from "../_domain/v3/questions";
import { validAnswer } from "../_domain/v3/submission";
import { parseSubmission } from "../_domain/v5/submission";
import type { Submission } from "../_domain/types";

export const STORAGE_KEY = "relationsvarning_persona_flow_v3";
export const FLOW_VERSION = 3;
export type Draft = {
  version: typeof FLOW_VERSION; questionVersion: string; reportVersion: string;
  answers: (number | null)[]; cursor: number; phase: "chapter" | "question" | "preview";
};
export type Action = { type: "answer"; value: number } | { type: "next" | "back" | "start" | "review" | "restart" };

export const chapterStarts = [0, CHAPTER_SIZE, CHAPTER_SIZE * 2, CHAPTER_SIZE * 3] as const;
export function chapterAt(cursor: number) { return questions[cursor].chapter; }

export function initialDraft(): Draft {
  return { version: FLOW_VERSION, questionVersion: VERSIONS.question, reportVersion: VERSIONS.report,
    answers: Array(TOTAL_COUNT).fill(null), cursor: 0, phase: "chapter" };
}

export function currentQuestion(draft: Draft) { return questions[draft.cursor]; }
export function currentAnswer(draft: Draft) { return draft.answers[draft.cursor]; }
export function answeredCount(draft: Draft) { return draft.answers.filter(answer => answer !== null).length; }

export function toSubmission(draft: Draft): Submission | null {
  if (!draft.answers.every(validAnswer)) return null;
  return parseSubmission({ questionVersion: draft.questionVersion, reportVersion: draft.reportVersion, answers: draft.answers });
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
  if (action.type === "answer" && validAnswer(action.value)) {
    if (currentAnswer(draft) === action.value) return draft;
    return { ...draft, answers: draft.answers.map((answer, index) => index === draft.cursor ? action.value : answer) };
  }
  if (action.type === "next" && currentAnswer(draft) !== null) {
    if (draft.cursor === TOTAL_COUNT - 1) return toSubmission(draft) ? { ...draft, phase: "preview" } : draft;
    const cursor = draft.cursor + 1;
    return { ...draft, cursor, phase: chapterStarts.some(start => start === cursor) ? "chapter" : "question" };
  }
  return draft;
}

/** Only answers and navigation state may be restored from untrusted browser storage. */
export function parseDraft(raw: string | null): Draft | null {
  try {
    if (!raw || raw.length > 12000) return null;
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return null;
    const value = saved as Record<string, unknown>;
    if (Object.keys(value).sort().join(",") !== "answers,cursor,phase,questionVersion,reportVersion,version"
      || value.version !== FLOW_VERSION || value.questionVersion !== VERSIONS.question || (value.reportVersion !== VERSIONS.report && value.reportVersion !== v4.report && value.reportVersion !== previous.report)
      || !Array.isArray(value.answers) || value.answers.length !== TOTAL_COUNT
      || !value.answers.every(answer => answer === null || validAnswer(answer))
      || typeof value.cursor !== "number" || !Number.isInteger(value.cursor) || value.cursor < 0 || value.cursor >= TOTAL_COUNT
      || (value.phase !== "chapter" && value.phase !== "question" && value.phase !== "preview")) return null;
    const firstPending = value.answers.indexOf(null);
    if (firstPending >= 0 && (firstPending < value.cursor || value.phase === "preview")) return null;
    if (value.phase === "chapter" && !chapterStarts.some(start => start === value.cursor)) return null;
    return { ...initialDraft(), answers: [...value.answers], cursor: value.cursor, phase: value.phase };
  } catch { return null; }
}
