import { questions } from "./questions";
import type { levelTexts } from "./copy";
export { questions } from "./questions";
export const areas = ["attention", "organization", "impulsivity", "restlessness", "activation", "impact"] as const;
export type Area = typeof areas[number];
export const symptomAreas = areas.slice(0, 5);
export const areaNames: Record<Area, string> = {
  attention: "Uppmärksamhet och distraherbarhet", organization: "Organisation och exekutiva funktioner",
  impulsivity: "Impulsivitet", restlessness: "Hyperaktivitet och inre rastlöshet",
  activation: "Tid, igångsättning och motivation", impact: "Påverkan i vardagen",
};
export const answerLabels = ["Aldrig", "Sällan", "Ibland", "Ofta", "Mycket ofta"];
export const PRICE_SEK = 39;
export const STATE_VERSION = 1;
export const STORAGE_KEY = "relationsvarning_adhd_state_v1";
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);
export const formatPercent = (value: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(value);
export function overallLevel(score: number): keyof typeof levelTexts {
  if (score >= 80) return "Mycket tydligt ADHD-relaterat mönster";
  if (score >= 65) return "Tydligt ADHD-relaterat mönster";
  if (score >= 45) return "Måttligt ADHD-relaterat mönster";
  if (score >= 25) return "Vissa ADHD-relaterade drag";
  return "Svagt ADHD-relaterat mönster";
}
export function calculate(answers: number[]) {
  if (answers.length !== 30 || !answers.every(a => Number.isInteger(a) && a >= 0 && a <= 4)) throw new Error("Expected 30 answers, each 0–4");
  const raw = Object.fromEntries(areas.map((area, i) => [area, answers.slice(i * 5, i * 5 + 5).reduce((sum, n) => sum + n, 0)])) as Record<Area, number>;
  const scores = Object.fromEntries(areas.map(area => [area, raw[area] / 20 * 100])) as Record<Area, number>;
  const symptomIndex = symptomAreas.reduce((sum, a) => sum + scores[a], 0) / 5;
  const ranked = [...symptomAreas].sort((a,b) => scores[b] - scores[a]);
  const high = symptomAreas.filter(a => scores[a] >= 65);
  const inattentive = (scores.attention + scores.organization + scores.activation) / 3;
  const restless = (scores.impulsivity + scores.restlessness) / 2;
  // Product heuristics, not validated clinical cutoffs. High >=65, low <25; gap >=15.
  // Priority: low index, executive, inattentive, restless/impulsive, combined, unspecified.
  // Combined: at least 3 high symptom areas, with the top 3 less than 15 points apart.
  let profileType: "Ouppmärksam profil" | "Exekutiv profil" | "Rastlös/impulsiv profil" | "Kombinerad profil" | "Svagt/ospecifikt mönster" = "Svagt/ospecifikt mönster";
  if (symptomIndex >= 25) {
    const executive = (scores.organization + scores.activation) / 2;
    if (scores.organization >= 65 && scores.activation >= 65 && executive - Math.max(scores.attention, scores.impulsivity, scores.restlessness) >= 15) profileType = "Exekutiv profil";
    else if (inattentive >= 65 && Math.min(scores.attention, scores.organization, scores.activation) >= 45 && inattentive - restless >= 15) profileType = "Ouppmärksam profil";
    else if (scores.impulsivity >= 65 && scores.restlessness >= 65 && restless - inattentive >= 15) profileType = "Rastlös/impulsiv profil";
    else if (high.length >= 3 && scores[ranked[0]] - scores[ranked[2]] < 15) profileType = "Kombinerad profil";
  }
  // Impact is not included in symptomIndex; it modifies interpretation only.
  const impactModifier = symptomIndex >= 65 && scores.impact < 25 ? "limited" : symptomIndex >= 65 && scores.impact >= 65 ? "marked" : "standard";
  const supporting: string[] = [];
  if (high.length >= 3) supporting.push("Flera symptomområden ligger tydligt förhöjda i dina svar.");
  if (answers[28] >= 3) supporting.push("Du beskriver att liknande svårigheter ofta återkommer i flera delar av vardagen.");
  if (scores.attention >= 65 && scores.organization >= 65 && scores.activation >= 65) supporting.push("Uppmärksamhet, organisation och igångsättning ligger högt samtidigt.");
  if (answers[29] >= 3) supporting.push("Du känner ofta igen liknande problem från tidigare delar av livet. Svaret fastställer inte när problemen började.");
  if (symptomIndex >= 65 && scores.impact >= 65) supporting.push("Både symptomindex och den samlade vardagspåverkan är höga.");
  const lessClear: string[] = [];
  if (high.length === 1) lessClear.push("Endast ett symptomområde ligger tydligt högt.");
  if (scores.impact < 25) lessClear.push("Den samlade vardagspåverkan är relativt låg i dina svar.");
  if (scores.impulsivity < 25 && scores.restlessness < 25 && high.length > 0) lessClear.push("Impulsivitet och rastlöshet är låga trots andra förhöjda områden. Det utesluter inte ADHD med främst ouppmärksamhet.");
  if (high.length === 2) lessClear.push("De tydligt förhöjda värdena är koncentrerade till två symptomområden.");
  if (symptomAreas.filter(a => scores[a] < 25).length >= 3) lessClear.push("Flera symptomområden ligger relativt lågt.");
  if (answers[29] <= 1) lessClear.push("Ditt svar om tidigare delar av livet ger begränsat stöd för ett långvarigt mönster.");
  if (answers[28] <= 1) lessClear.push("Du beskriver sällan att svårigheterna återkommer i flera delar av livet.");
  return { raw, scores, symptomIndex, ranked, leadingGap: scores[ranked[0]] - scores[ranked[1]], level: overallLevel(symptomIndex), profileType, impactModifier, supporting: supporting.slice(0,4), lessClear: lessClear.slice(0,4) };
}
export type Result = ReturnType<typeof calculate>;
export function parseState(raw: string | null): { version: number; answers: number[]; index: number; unlocked: boolean } | null {
  try {
    const saved = JSON.parse(raw ?? "null");
    if (saved?.version !== STATE_VERSION || !Array.isArray(saved.answers) || saved.answers.length !== 30 || !saved.answers.every((a: unknown) => typeof a === "number" && Number.isInteger(a) && a >= -1 && a <= 4)) return null;
    return { version: STATE_VERSION, answers: saved.answers, index: Number.isInteger(saved.index) ? Math.max(0, Math.min(29, saved.index)) : 0, unlocked: saved.unlocked === true };
  } catch { return null; }
}
