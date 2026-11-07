import type { CandidateScore, Condition, Selection, Theme } from "../types";
import { immutable } from "../immutable";
import { ADAPTIVE_COUNT, VERSIONS } from "./manifest";
import { answerMap, evidenceFor, fixedAnswers } from "./answers";

type Rule = Readonly<{ id: string; theme: Theme; conditions: readonly [Condition, Condition] }>;
const condition = (questionId: string, letters: string): Condition => ({ questionId, answers: letters.split("").map(letter => "ABCD".indexOf(letter)) });
const rule = (n: number, theme: Theme, q1: number, a1: string, q2: number, a2: string): Rule => ({
  id: `A${String(n).padStart(2, "0")}`, theme,
  conditions: [condition(`P${String(q1).padStart(2, "0")}`, a1), condition(`P${String(q2).padStart(2, "0")}`, a2)],
});
/** Editorial relevance, not a psychometric information estimate. Unknown never matches. */
export const adaptiveRules: readonly Rule[] = immutable([
  rule(1,"R",10,"AC",33,"AD"),rule(2,"R",10,"BD",33,"BC"),rule(3,"R",16,"BC",34,"D"),
  rule(4,"L",11,"AB",21,"BC"),rule(5,"L",4,"AD",16,"AD"),rule(6,"L",21,"AD",22,"AD"),
  rule(7,"M",8,"AB",14,"AB"),rule(8,"M",20,"AC",34,"AB"),rule(9,"M",8,"CD",14,"CD"),
  rule(10,"F",18,"AD",28,"AB"),rule(11,"F",18,"BC",28,"CD"),rule(12,"F",26,"CD",28,"AD"),
  rule(13,"G",22,"BC",26,"AD"),rule(14,"G",24,"BC",26,"BC"),rule(15,"G",30,"AD",34,"AD"),
  {id:"A16",theme:"S",conditions:[{questionId:"P07",answers:[2,3]},{questionId:"P32",answers:[2,3]}]},
  rule(17,"S",24,"CD",34,"AD"),rule(18,"S",33,"AD",34,"AB"),
]);
export function selectAdaptive(input: unknown): Selection {
  const values = answerMap(fixedAnswers(input));
  const candidates: CandidateScore[] = adaptiveRules.map(item => {
    const evidence = item.conditions.filter(c => c.answers.includes(values.get(c.questionId)!))
      .map(c => evidenceFor(c.questionId, values.get(c.questionId)!));
    return { id: item.id, theme: item.theme, score: evidence.length === 2 ? 9 : evidence.length === 1 ? 3 : 0,
      reason: evidence.length === 2 ? "combination" : evidence.length === 1 ? "single" : "fallback", evidence };
  });
  let best: CandidateScore[] = [];
  let bestScore = -1;
  let bestKey = "";
  let bestThemes = -1;
  function visit(start: number, chosen: CandidateScore[], counts: Map<Theme, number>, score: number) {
    if (chosen.length === ADAPTIVE_COUNT) {
      if (counts.size < 3) return;
      const key = chosen.map(c => c.id).join(",");
      if (score > bestScore || (score === bestScore && (counts.size > bestThemes || (counts.size === bestThemes && key < bestKey)))) {
        best = [...chosen]; bestScore = score; bestKey = key; bestThemes = counts.size;
      }
      return;
    }
    for (let i = start; i <= candidates.length - (ADAPTIVE_COUNT - chosen.length); i++) {
      const item = candidates[i];
      const count = counts.get(item.theme) ?? 0;
      if (count >= 3) continue;
      counts.set(item.theme, count + 1);
      chosen.push(item);
      visit(i + 1, chosen, counts, score + item.score);
      chosen.pop();
      if (count) counts.set(item.theme, count); else counts.delete(item.theme);
    }
  }
  visit(0, [], new Map(), 0);
  if (best.length !== ADAPTIVE_COUNT) throw new Error("PERSONA selection unavailable");
  const selectedIds = best.sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map(c => c.id);
  return immutable({ version: VERSIONS.adaptive, selectedIds, candidates, totalScore: bestScore });
}
