import { coreQuestions } from "../v3/questions";
import { scoreDimensions } from "../v3/score";
import type { Reading } from "./types";
// Report confidence only. This never changes existing dimension scores or item coding.
export function readDimensions(answers: readonly number[]): readonly Reading[] {
  return scoreDimensions(answers).map(score => {
    if (score.valid < 4 || score.value === null) return { dimension: score.dimension, direction: "insufficient", support: [], counter: [], score };
    const mean = score.raw / score.valid;
    const sign = mean > 3.5 ? 1 : mean < 2.5 ? -1 : 0;
    const keyed = score.evidence.map(item => {
      const q = coreQuestions[Number(item.questionId.slice(1)) - 1];
      return { item, value: q.reverse ? 6 - item.answer : item.answer };
    });
    const support = keyed.filter(t => (t.value - 3) * sign >= 1).map(t => t.item);
    const counter = keyed.filter(t => (t.value - 3) * sign <= -1).map(t => t.item);
    const direction = sign && support.length >= 4 && counter.length <= 1 && support.length - counter.length >= 3
      ? sign === 1 ? "high" : "low" : score.varied ? "mixed" : "middle";
    return { dimension: score.dimension, direction, support: direction === "high" || direction === "low" ? support : score.evidence, counter, score };
  });
}
