import type { Dimension, DimensionScore } from "../types";
import { immutable } from "../immutable";
import { SKIPPED } from "./manifest";
import { coreQuestions } from "./questions";

const names: Record<Dimension, string> = {
  E: "Socialt sätt", A: "Hänsyn och samspel", C: "Struktur och genomförande",
  N: "Känslomässig reaktivitet", O: "Öppenhet för idéer och upplevelser",
};

export function scoreDimensions(answers: readonly number[]): readonly DimensionScore[] {
  return immutable((Object.keys(names) as Dimension[]).map(dimension => {
    const items = coreQuestions.flatMap((question, index) => question.dimension === dimension
      ? [{ question, answer: answers[index] }] : []);
    const valid = items.filter(item => item.answer !== SKIPPED);
    const coded = valid.map(({ question, answer }) => question.reverse ? 6 - answer : answer);
    const raw = coded.reduce((sum, value) => sum + value, 0);
    const mean = raw / valid.length;
    return {
      dimension, name: names[dimension], valid: valid.length, raw,
      missingIds: items.filter(item => item.answer === SKIPPED).map(item => item.question.id),
      value: valid.length < 4 ? null : Math.round(mean * 10) / 10,
      level: valid.length < 4 ? "insufficient" : valid.length < 6 ? "limited" : mean < 2.5 ? "lower" : mean > 3.5 ? "higher" : "middle",
      varied: coded.some(value => value <= 2) && coded.some(value => value >= 4),
      evidence: valid.map(({ question, answer }) => ({ questionId: question.id, answer })),
    };
  }));
}
