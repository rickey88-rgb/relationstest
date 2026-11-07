import type { Dimension, DimensionScore } from "../types";
import { immutable } from "../immutable";
import { UNKNOWN } from "./manifest";
import { fixedAnswers, evidenceFor } from "./answers";
import { fixedQuestions } from "./questions";

export const dimensionNames: Readonly<Record<Dimension, string>> = immutable({ E: "Social energi", O: "Öppenhet", C: "Struktur och genomförande", A: "Samarbetsorientering", N: "Känslomässig reaktivitet" });
export const dimensionOrder: readonly Dimension[] = immutable(["E", "O", "C", "A", "N"]);
export function scoreDimensions(input: unknown): readonly DimensionScore[] {
  const answers = fixedAnswers(input);
  return immutable(dimensionOrder.map(dimension => {
    const questions = fixedQuestions.map((q, index) => ({ q, answer: answers[index] })).filter(({ q }) => q.dimension === dimension);
    const valid = questions.filter(item => item.answer !== UNKNOWN);
    const coded = valid.map(({ q, answer }) => q.reverse ? 4 - answer : answer);
    const raw = coded.reduce((sum, value) => sum + value, 0);
    const level = valid.length < 2 ? "insufficient" : valid.length < 3 ? "limited" : raw <= 4 ? "lower" : raw >= 8 ? "higher" : "middle";
    return { dimension, name: dimensionNames[dimension], valid: valid.length,
      missingIds: questions.filter(item => item.answer === UNKNOWN).map(item => item.q.id), raw,
      value: valid.length >= 2 ? Math.round(raw / (valid.length * 4) * 1000) / 10 : null,
      level, varied: coded.length >= 2 && Math.max(...coded) - Math.min(...coded) >= 3,
      evidence: valid.map(({ q, answer }) => evidenceFor(q.id, answer)),
    };
  }));
}
