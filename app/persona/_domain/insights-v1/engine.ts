import { immutable } from "../immutable";
import { VERSIONS as questionsVersion, TOTAL_COUNT } from "../v3/manifest";
import { questions } from "../v3/questions";
import { CATALOG, CATALOG_VERSION } from "./catalog";
import type {
  Analysis, Answer, AnswerInput, Candidate, Condition, ConditionResult,
  Decision, Evaluation, Evidence, Insight,
} from "./types";

export const ENGINE_VERSION = "persona-insights-v1.2";

function normalize(input: AnswerInput): readonly (Answer | null)[] {
  if (!Array.isArray(input) || input.length !== TOTAL_COUNT) throw new Error("Expected 40 PERSONA answer slots");
  return Array.from(input, value => {
    if (value === null || value === undefined || value === 0) return null;
    if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5) throw new Error("Invalid PERSONA answer");
    return value as Answer;
  });
}

function check(condition: Condition, answers: readonly (Answer | null)[]): ConditionResult {
  const index = questions.findIndex(question => question.id === condition.questionId);
  if (index < 0) throw new Error("Unknown PERSONA question in insight catalog");
  const answer = answers[index];
  if (answer === null) return { condition, answer, status: "missing" };
  if (answer === 3) return { condition, answer, status: "neutral" };
  const matched = condition.direction === "high" ? answer >= 4 : answer <= 2;
  return { condition, answer, status: matched ? "matched" : "opposed" };
}

function evidence(results: readonly ConditionResult[], role: Evidence["role"]): Evidence[] {
  return results.flatMap(result => result.status === "matched" && result.answer !== null
    ? [{ questionId: result.condition.questionId, answer: result.answer, role, conditionId: result.condition.id }] : []);
}

function evaluate(candidate: Candidate, answers: readonly (Answer | null)[]): Evaluation {
  const required = candidate.required.map(condition => check(condition, answers));
  const supporting = candidate.supporting.map(condition => check(condition, answers));
  const contradictory = candidate.contradictory.map(condition => check(condition, answers));
  const nuances = candidate.nuances.map(condition => check(condition, answers));
  const nuanceEvidence = evidence(nuances, "nuance");
  const used = [...evidence(required, "required"), ...evidence(supporting, "supporting")];
  const opposedRequired: Evidence[] = required.flatMap(result => result.status === "opposed" && result.answer !== null
    ? [{ questionId: result.condition.questionId, answer: result.answer, role: "contradictory" as const, conditionId: result.condition.id }] : []);
  const against = [...opposedRequired, ...evidence(contradictory, "contradictory")];
  const supportCount = new Set(used.map(item => item.questionId)).size;
  const contradictionCount = new Set(against.map(item => item.questionId)).size;
  const score = supportCount * 2 - contradictionCount * 3;
  let decision: Decision = "selected";
  let reason = "Alla nödvändiga villkor uppfylldes och det samlade stödet räcker för en preliminär hypotes.";
  if (required.some(result => result.status === "missing")) {
    decision = "missing_required";
    reason = "Ett nödvändigt svar saknas. Det kan inte ersättas av en neutral poäng.";
  } else if (required.some(result => result.status !== "matched")) {
    decision = "required_not_met";
    reason = "Minst ett nödvändigt villkor är neutralt eller går åt motsatt håll.";
  } else if (supportCount < candidate.minimumSupport) {
    decision = "insufficient_support";
    reason = "För få olika svar stöder hypotesen.";
  } else if (contradictionCount > candidate.maximumContradictions || score < candidate.minimumSupport * 2 - 1) {
    decision = "counterevidence";
    reason = "Motbeläggen gör det samlade stödet för svagt för urval.";
  }
  return {
    candidateId: candidate.id, family: candidate.family,
    required, supporting, contradictory, nuances, evidence: used, counterEvidence: against, nuanceEvidence,
    supportCount, contradictionCount, score,
    strength: decision !== "selected" ? "insufficient" : contradictionCount || supportCount < 4 ? "limited" : "convergent",
    caution: contradictionCount ? "with_counterevidence" : nuanceEvidence.length ? "with_nuance" : "provisional",
    qualified: decision === "selected", decision, reason,
  };
}

function overlaps(first: Evaluation, second: Evaluation) {
  const firstIds = new Set(first.evidence.map(item => item.questionId));
  const secondIds = new Set(second.evidence.map(item => item.questionId));
  const intersection = Array.from(firstIds).filter(id => secondIds.has(id)).length;
  return intersection / new Set([...Array.from(firstIds), ...Array.from(secondIds)]).size >= 0.5;
}

/** Standalone analysis. Raw Q01–Q40 ratings are never recoded or sent to a report/payment entry point. */
export function analyzeInsights(input: AnswerInput): Analysis {
  const answers = normalize(input);
  const evaluated = CATALOG.map(candidate => evaluate(candidate, answers));
  const ranked = evaluated.filter(item => item.qualified).sort((a, b) => b.score - a.score || (a.candidateId < b.candidateId ? -1 : a.candidateId > b.candidateId ? 1 : 0));
  const selected: Evaluation[] = [];
  const outcomes = new Map(evaluated.map(item => [item.candidateId, item]));
  for (const item of ranked) {
    const candidate = CATALOG.find(entry => entry.id === item.candidateId)!;
    const duplicate = selected.some(other => {
      const previous = CATALOG.find(entry => entry.id === other.candidateId)!;
      return candidate.messageKey === previous.messageKey || candidate.adviceKey === previous.adviceKey;
    });
    let decision: Decision = "selected";
    let reason = "Högst tillgängligt stöd efter avdrag för motbelägg, med ett budskap som skiljer sig från tidigare val.";
    if (duplicate) {
      decision = "duplicate_message";
      reason = "Ett högre rankat fynd täcker samma budskap eller råd.";
    } else if (selected.some(other => overlaps(item, other))) {
      decision = "overlapping_evidence";
      reason = "Svarunderlaget överlappar ett högre rankat fynd för mycket för en självständig insikt.";
    } else if (selected.length >= 3) {
      decision = "limit";
      reason = "Tre tydligt åtskilda insikter med högre rang har redan valts.";
    }
    const resolved = { ...item, decision, reason };
    outcomes.set(item.candidateId, resolved);
    if (decision === "selected") selected.push(resolved);
  }
  const insights: Insight[] = selected.map(item => {
    const candidate = CATALOG.find(entry => entry.id === item.candidateId)!;
    return {
      id: candidate.id, family: candidate.family, title: candidate.title,
      observation: candidate.observation, possibleExplanation: candidate.explanation,
      evidence: item.evidence, counterEvidence: item.counterEvidence, nuanceEvidence: item.nuanceEvidence,
      strength: item.strength === "convergent" ? "convergent" : "limited", caution: item.caution,
      caveat: item.contradictionCount
        ? "Svaren innehåller också en nyanserande signal. Se motbeläggen och pröva om tolkningen passar i den aktuella situationen."
        : item.nuanceEvidence.length ? "Svaren innehåller ytterligare sidor som kan samexistera med observationen. Läs nyanserna tillsammans med den preliminära tolkningen."
        : "Det här är en preliminär tolkning av dina svar. Regeln säger inget om varför mönstret uppstår eller hur det visar sig i varje situation.",
      selectionReason: item.reason, limitations: candidate.limitations,
    };
  });
  return immutable({
    engineVersion: ENGINE_VERSION, catalogVersion: CATALOG_VERSION, questionVersion: questionsVersion.question,
    answered: answers.filter(answer => answer !== null).length,
    missingQuestionIds: questions.filter((_, index) => answers[index] === null).map(question => question.id),
    insights,
    advice: selected.map(item => {
      const candidate = CATALOG.find(entry => entry.id === item.candidateId)!;
      return { id: candidate.adviceKey, insightId: candidate.id, text: candidate.advice,
        evidence: item.evidence, counterEvidence: item.counterEvidence, nuanceEvidence: item.nuanceEvidence };
    }),
    evaluations: CATALOG.map(candidate => outcomes.get(candidate.id)!),
  });
}
