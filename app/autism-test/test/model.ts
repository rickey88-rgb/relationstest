import { questions } from "./questions";
import type { levelTexts, profileTexts } from "./copy";
export { questions } from "./questions";

export const areas = ["socialInteraction", "socialCommunication", "predictabilityFlexibility", "sensory", "focusedInterests", "impactHistory"] as const;
export type Area = typeof areas[number];
export const symptomAreas = areas.slice(0, 5);
export const areaNames: Record<Area, string> = {
  socialInteraction: "Socialt samspel", socialCommunication: "Social kommunikation",
  predictabilityFlexibility: "Förutsägbarhet och flexibilitet", sensory: "Sensorisk känslighet",
  focusedInterests: "Fokuserade intressen och uppslukande fokus", impactHistory: "Vardagspåverkan och långvarighet",
};
export const answerLabels = ["Aldrig", "Sällan", "Ibland", "Ofta", "Mycket ofta"];
export const PRICE_SEK = 39;
export const STATE_VERSION = 1;
export const STORAGE_KEY = "relationsvarning_autism_state_v1";
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);
export const formatPercent = (value: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(value);
export function overallLevel(score: number): keyof typeof levelTexts {
  if (score >= 80) return "Mycket tydligt autismrelaterat mönster";
  if (score >= 65) return "Tydligt autismrelaterat mönster";
  if (score >= 45) return "Måttligt autismrelaterat mönster";
  if (score >= 25) return "Vissa autismrelaterade drag";
  return "Svagt autismrelaterat mönster";
}

export function calculate(answers: number[]) {
  if (answers.length !== 30 || !Array.from(answers).every(a => Number.isInteger(a) && a >= 0 && a <= 4)) throw new Error("Expected 30 answers, each 0–4");
  const raw = Object.fromEntries(areas.map((area, i) => [area, answers.slice(i * 5, i * 5 + 5).reduce((sum, n) => sum + n, 0)])) as Record<Area, number>;
  // raw / 20 * 100 = raw * 5; integer arithmetic keeps the 15-point boundary exact.
  const scores = Object.fromEntries(areas.map(area => [area, raw[area] * 5])) as Record<Area, number>;
  const symptomIndex = symptomAreas.reduce((sum, area) => sum + scores[area], 0) / 5;
  // Stable area order breaks sorting ties only; interpretation explicitly describes ties.
  const ranked = [...symptomAreas].sort((a, b) => scores[b] - scores[a]);
  const leadingGap = scores[ranked[0]] - scores[ranked[1]];
  const high = symptomAreas.filter(area => scores[area] >= 65);
  // Product heuristics ONLY, not clinical cutoffs/subtypes. Priority is deterministic:
  // 1. Index <25 => unspecified.
  // 2. Social pair each >=65; pair mean >=15 above EVERY remaining area.
  // 3. Predictability/sensory pair: same >=65 and >=15 dominance rules.
  // 4. Broad: >=3 areas >=65, highest three strictly <15 points apart.
  // 5. Focused: interests >=65, >=1 other area >=65, interests >=15 above
  //    the mean of the other four. Broad takes precedence for tied broad patterns.
  // 6. Otherwise unspecified; this can include isolated high areas at a higher index.
  let profileType: keyof typeof profileTexts = "Svagt eller ospecifikt mönster";
  if (symptomIndex >= 25) {
    const social = (scores.socialInteraction + scores.socialCommunication) / 2;
    const predictabilitySensory = (scores.predictabilityFlexibility + scores.sensory) / 2;
    if (scores.socialInteraction >= 65 && scores.socialCommunication >= 65 && social - Math.max(scores.predictabilityFlexibility, scores.sensory, scores.focusedInterests) >= 15) profileType = "Social-kommunikativ profil";
    else if (scores.predictabilityFlexibility >= 65 && scores.sensory >= 65 && predictabilitySensory - Math.max(scores.socialInteraction, scores.socialCommunication, scores.focusedInterests) >= 15) profileType = "Förutsägbarhets-/sensorisk profil";
    else if (high.length >= 3 && scores[ranked[0]] - scores[ranked[2]] < 15) profileType = "Bred kombinerad profil";
    else if (scores.focusedInterests >= 65 && high.some(area => area !== "focusedInterests") && scores.focusedInterests - (scores.socialInteraction + scores.socialCommunication + scores.predictabilityFlexibility + scores.sensory) / 4 >= 15) profileType = "Fokuserad/intensiv profil";
  }
  // impactHistory never changes symptomIndex or the product profile.
  // "High" impactHistory for low-index interpretation means >=60, as for marked impact.
  const impactModifier = symptomIndex >= 65 && scores.impactHistory < 40 ? "limited"
    : symptomIndex >= 65 && scores.impactHistory >= 60 ? "marked"
    : symptomIndex < 45 && scores.impactHistory >= 60 ? "impactWithoutPattern" : "standard";
  const supporting: string[] = [];
  if (high.length >= 3) supporting.push("Minst tre av de fem mönsterområdena ligger tydligt förhöjda i din självskattning.");
  if (scores.socialInteraction >= 65 && scores.socialCommunication >= 65) supporting.push("Socialt samspel och social kommunikation framträder samtidigt i svaren.");
  if ((scores.socialInteraction >= 65 || scores.socialCommunication >= 65) && (scores.predictabilityFlexibility >= 65 || scores.sensory >= 65 || scores.focusedInterests >= 65)) supporting.push("Dina förhöjda svar omfattar både sociala områden och förutsägbarhet, sensorik eller intressen.");
  // Inspect individual impact/history answers; a high combined score cannot prove all aspects.
  if (answers[28] >= 3) supporting.push("Du känner igen liknande mönster under en stor del av livet. Det fastställer inte när de började.");
  if (answers[29] >= 3 && answers[25] >= 3) supporting.push("Du beskriver både vardagspåverkan och mönster i mer än ett livsområde.");
  const lessClear: string[] = [];
  if (symptomIndex < 45) lessClear.push("Det samlade mönstret i de första fem områdena är svagt eller blandat, även om enskilda upplevelser kan vara viktiga.");
  if (high.length === 1) lessClear.push("Endast ett område ligger tydligt förhöjt. Ett enskilt drag ger begränsad information om helheten.");
  if (scores.socialInteraction < 25 && scores.socialCommunication < 25) lessClear.push("Socialt samspel och kommunikation framträder relativt lite. Det gör autismtolkningen mindre tydlig i denna modell.");
  if (scores.impactHistory < 40) lessClear.push("Den sammanvägda uppgiften om vardagspåverkan och långvarighet är begränsad.");
  if (answers[28] <= 1) lessClear.push("Ditt svar om tidigare delar av livet ger begränsat stöd för långvarighet. Det ersätter inte en utvecklingshistoria.");
  if (answers[29] <= 1) lessClear.push("Du beskriver sällan mönster i mer än ett livsområde.");
  if (answers[25] <= 1) lessClear.push("Du uppger begränsad påverkan på vardag, arbete, studier eller relationer i den direkta frågan om detta.");
  return { raw, scores, symptomIndex, ranked, leadingGap, level: overallLevel(symptomIndex), profileType, impactModifier, supporting, lessClear, historyAnswer: answers[28], impactAnswer: answers[25], settingsAnswer: answers[29] };
}
export type Result = ReturnType<typeof calculate>;

export function parseState(raw: string | null): { version: number; answers: number[]; index: number; unlocked: boolean } | null {
  try {
    const saved = JSON.parse(raw ?? "null");
    if (saved?.version !== STATE_VERSION || !Array.isArray(saved.answers) || saved.answers.length !== 30 || !saved.answers.every((a: unknown) => typeof a === "number" && Number.isInteger(a) && a >= -1 && a <= 4)) return null;
    return { version: STATE_VERSION, answers: saved.answers, index: Number.isInteger(saved.index) ? Math.max(0, Math.min(29, saved.index)) : 0, unlocked: saved.unlocked === true };
  } catch { return null; }
}
