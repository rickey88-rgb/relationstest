import { contextQuestions, questions, type Dimension } from "./questions";
export { contextQuestions, questions } from "./questions";

export const dimensions = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export type DimensionKey = typeof dimensions[number];
export const dimensionNames: Record<DimensionKey, string> = {
  A: "Uppmärksamhet & exekutiv funktion", B: "Impulsivitet & rastlöshet", C: "Social kommunikation", D: "Rutiner & flexibilitet", E: "Sensorisk känslighet", F: "Masking & kompensation", G: "AuDHD-friktion", H: "Vardagspåverkan",
};
export const answerLabels = ["Aldrig", "Sällan", "Ibland", "Ofta", "Nästan alltid"];
export const PRICE_SEK = 79;
export const REPORT_VERSION = "audhd-v1";
export const STORAGE_KEY = "relationsvarning_audhd_state_v1";
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);
export const emptyContextAnswers = () => Array<number>(contextQuestions.length).fill(-1);
export const formatPercent = (value: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(value);

export function descriptiveLevel(score: number) { return score < 25 ? "lågt" : score < 50 ? "vissa drag" : score < 75 ? "tydliga drag" : "mycket framträdande"; }

export function calculateDimensions(answers: number[]) {
  if (answers.length !== questions.length || !answers.every(value => Number.isInteger(value) && value >= 0 && value <= 4)) throw new Error("Expected 48 complete answers in range 0–4");
  const raw = Object.fromEntries(dimensions.map(key => [key, 0])) as Record<DimensionKey, number>;
  const max = Object.fromEntries(dimensions.map(key => [key, 0])) as Record<DimensionKey, number>;
  questions.forEach((question, index) => { raw[question.dimension] += answers[index]; max[question.dimension] += 4; });
  return Object.fromEntries(dimensions.map(key => [key, raw[key] / max[key] * 100])) as Record<DimensionKey, number>;
}

export function calculatePrimaryIndices(scores: Record<DimensionKey, number>) {
  return { adhdIndex: scores.A * .6 + scores.B * .4, autismIndex: scores.C * .4 + scores.D * .35 + scores.E * .25, maskingIndex: scores.F, frictionIndex: scores.G, functionalIndex: scores.H };
}

// These are product descriptions, never clinical cutoffs. The ±5 zone deliberately avoids a sharp 49/50 result change.
const inZone = (value: number, boundary: number) => Math.abs(value - boundary) <= 5;
export function determineMainProfile(adhd: number, autism: number, scores: Record<DimensionKey, number>) {
  const highest = Math.max(adhd, autism);
  const gap = Math.abs(adhd - autism);
  if (inZone(adhd, 50) || inZone(autism, 50) || inZone(adhd, 75) || inZone(autism, 75) || (highest >= 45 && gap <= 5)) return "Gränsnära/ojämn profil";
  if (adhd < 25 && autism < 25) return "Inget tydligt kombinerat mönster";
  if (adhd >= 75 && autism >= 75) return "Mycket framträdande kombinationsmönster";
  if (adhd >= 50 && autism >= 50) return gap <= 12 ? "Kombinerat dragmönster" : adhd > autism ? "ADHD-dominerat kombinationsmönster" : "Autismdominerat kombinationsmönster";
  if (adhd >= 50) return "Främst ADHD-liknande profil";
  if (autism >= 50) return "Främst autismrelaterad profil";
  if (adhd >= 25 && autism >= 25) return "Vissa drag från båda områdena";
  // A high stand-alone support domain is uneven, not evidence of a combined profile.
  return scores.G >= 50 || scores.F >= 50 ? "Gränsnära/ojämn profil" : "Inget tydligt kombinerat mönster";
}

export type Outlier = { key: Exclude<DimensionKey, "H">; kind: "stark topp" | "tydlig topp" | "tydlig dal"; difference: number };
export function findDimensionOutliers(scores: Record<DimensionKey, number>): Outlier[] {
  const relevant = dimensions.filter(key => key !== "H");
  const mean = relevant.reduce((sum, key) => sum + scores[key], 0) / relevant.length;
  return relevant.reduce<Outlier[]>((found, key) => {
    const difference = scores[key] - mean;
    // A relative high must also be an absolutely meaningful level; 35 can never be "strong".
    if (scores[key] >= 50 && difference >= 15) found.push({ key, kind: "stark topp", difference });
    else if (scores[key] >= 40 && difference >= 10) found.push({ key, kind: "tydlig topp", difference });
    else if (difference <= -10) found.push({ key, kind: "tydlig dal", difference });
    return found;
  }, []);
}

export function analyzeAdhdPattern(scores: Record<DimensionKey, number>) {
  const difference = scores.A - scores.B;
  const label = difference >= 12 ? "Exekutivt/ouppmärksamt dominerad" : difference <= -12 ? "Impulsivitet/rastlöshet dominerar" : "Blandad ADHD-relaterad profil";
  const text = difference >= 12 ? "Uppmärksamhet, igångsättning och vardagsstruktur väger tydligare än impulsivitet och rastlöshet i dina svar." : difference <= -12 ? "Impulsivitet, stimulansbehov och rastlöshet väger tydligare än exekutiva svårigheter i dina svar." : "De två ADHD-relaterade områdena ligger nära varandra i dina svar.";
  return { label, text, difference };
}

export function analyzeAutismPattern(scores: Record<DimensionKey, number>) {
  const keys = ["C", "D", "E"] as const;
  const ranked = [...keys].sort((a, b) => scores[b] - scores[a]);
  const difference = scores[ranked[0]] - scores[ranked[1]];
  const names = { C: "Social kommunikation dominerar", D: "Rutiner, flexibilitet och intressen dominerar", E: "Sensorisk känslighet dominerar" };
  const label = difference < 10 ? "Jämn autismrelaterad profil" : names[ranked[0]];
  return { label, text: difference < 10 ? "Social kommunikation, rutiner/flexibilitet och sensorik är relativt jämnt fördelade i dina svar." : `${dimensionNames[ranked[0]]} ligger tydligare högst av de tre autismrelaterade områdena.`, ranked, difference };
}

const frictions = ["Struktur kontra svårighet att följa struktur", "Stimulans kontra överstimulering", "Självvald spontanitet kontra externa planändringar", "Behov av system kontra svårt att upprätthålla system", "Variation kontra förutsägbarhet"];
export function analyzeFriction(answers: number[]) {
  const entries = questions.map((question, index) => ({ question, value: answers[index] })).filter(({ question }) => question.dimension === "G").sort((a, b) => b.value - a.value);
  return { top: entries.slice(0, 2).map(({ question, value }) => ({ label: frictions[Number(question.id.slice(1)) - 1], value })), text: "Friktion beskriver upplevda krockar mellan behov. Den används inte som bevis för ADHD, autism eller AuDHD." };
}

export function analyzeMasking(masking: number, autism: number) {
  if (masking >= 60 && autism >= 50) return { title: "Mycket aktiv anpassning", text: "Dina svar visar både hög aktiv anpassning och tydliga autismrelaterade drag. Anpassning i sig bevisar inte autism, men kan vara viktigt när du funderar på hur mycket energi vardagen tar." };
  if (masking >= 60) return { title: "Mycket aktiv anpassning", text: "Dina svar visar hög aktiv anpassning, medan de autismrelaterade områdena är måttliga eller lägre. Masking kan förekomma av många skäl och ska inte tolkas som direkt bevis." };
  if (masking < 25 && autism >= 50) return { title: "Begränsad rapporterad masking", text: "Dina autismrelaterade svar är tydliga, medan aktiv anpassning rapporteras i mindre grad. Det säger inte hur synligt eller osynligt mönstret är för andra." };
  return { title: "Masking och kompensation", text: "Dina svar om förberedelse, strategier och återhämtning efter anpassning ger en separat bild av hur mycket aktivt arbete vardagen kan kräva." };
}

export function analyzeFunctionalImpact(scores: Record<DimensionKey, number>, context: number[]) {
  const [,, work = 0, relations = 0, energy = 0] = context;
  const combined = (scores.H + work * 25 + relations * 25 + energy * 25) / 4;
  const title = combined >= 65 ? "Stor påverkan" : combined >= 35 ? "Tydlig påverkan" : "Begränsad påverkan";
  const largest = work > relations ? "arbete, studier eller andra krav" : relations > work ? "relationer eller socialt liv" : work >= 2 ? "flera delar av vardagen" : "vardagen i begränsad grad";
  return { title, combined, largest, text: `${title} framträder i dina svar, särskilt inom ${largest}.` };
}

export function analyzeDevelopmentContext(context: number[], core: number) {
  const [childhood = 4, settings = 4,,,, recent = 3] = context;
  if (core >= 50 && childhood >= 3 && settings >= 2 && recent <= 1) return { title: "Profilen är konsekvent", text: "Dina svar är förenliga med ett mer långvarigt mönster i flera miljöer. Det fastställer inte en utvecklingshistoria." };
  if (core >= 50 && childhood <= 1 && recent >= 2) return { title: "Profilen är svår att tolka", text: "Höga aktuella svar kombineras med begränsad barndomshistorik och ett i huvudsak nyare mönster. Därför behöver helhetsbilden tolkas mycket försiktigt." };
  return { title: "Profilen behöver tolkas försiktigt", text: "Svaren om tid, miljöer eller när mönstret blev tydligt ger inte en helt entydig utvecklingsbild." };
}

export function findContradictingEvidence(scores: Record<DimensionKey, number>, indices: ReturnType<typeof calculatePrimaryIndices>, context: number[]) {
  const evidence: string[] = [];
  if (indices.adhdIndex >= 50 && scores.B < 25) evidence.push("ADHD-relaterade drag är tydliga, men impulsivitet och rastlöshet är låga.");
  if ((scores.D >= 50 || scores.E >= 50) && scores.C < 25) evidence.push("Rutiner/flexibilitet eller sensorik framträder mer än social kommunikation.");
  if (Math.max(indices.adhdIndex, indices.autismIndex) >= 50 && context[0] <= 1) evidence.push("Aktuella drag är tydliga, men barndomshistoriken är mindre tydlig.");
  if (Math.max(indices.adhdIndex, indices.autismIndex) >= 65 && scores.H < 25) evidence.push("Flera drag är höga, men den rapporterade vardagspåverkan är låg.");
  return evidence;
}

export function generateKeyInsights(scores: Record<DimensionKey, number>, indices: ReturnType<typeof calculatePrimaryIndices>, friction: ReturnType<typeof analyzeFriction>, outliers: ReturnType<typeof findDimensionOutliers>, impact: ReturnType<typeof analyzeFunctionalImpact>) {
  const candidates: string[] = [];
  if (indices.frictionIndex >= 50 && friction.top[0]?.value >= 2) candidates.push(`Starkast friktion: ${friction.top[0].label.toLowerCase()}.`);
  const peak = outliers.find(item => item.kind !== "tydlig dal");
  if (peak) candidates.push(`${dimensionNames[peak.key]} är en ${peak.kind} jämfört med resten av din profil.`);
  if (indices.maskingIndex >= 60) candidates.push("Dina svar visar att aktiv anpassning kan ta mycket energi.");
  if (impact.combined >= 35) candidates.push(`Vardagspåverkan framträder särskilt inom ${impact.largest}.`);
  if (Math.abs(indices.adhdIndex - indices.autismIndex) >= 15) candidates.push("De ADHD- och autismrelaterade indexen är tydligt olika höga i din profil.");
  return candidates.slice(0, 3).concat(candidates.length < 3 ? ["Profilen behöver läsas som flera områden tillsammans, inte som en enda etikett."] : []).slice(0, 3);
}

export function generateTeaser(scores: Record<DimensionKey, number>, indices: ReturnType<typeof calculatePrimaryIndices>, outliers: ReturnType<typeof findDimensionOutliers>, context: number[]) {
  if (indices.frictionIndex >= 50) return { type: "friction", title: "Två av dina starkaste behov verkar motarbeta varandra.", body: "Din rapport visar vilka friktioner du skattade högst och hur de passar in i din helhet." };
  const peak = outliers.find(item => item.kind === "stark topp");
  if (peak) return { type: "dimension_gap", title: "Ett område ligger betydligt högre än resten av din profil.", body: "Den fullständiga rapporten visar vad som särskilt sticker ut och vad som nyanserar bilden." };
  if (indices.maskingIndex >= 60) return { type: "masking", title: "Dina svar visar mycket aktiv anpassning.", body: "Rapporten sätter masking och återhämtning i ett sammanhang, utan att göra det till ett bevis för något." };
  if (scores.E >= 60 && scores.E >= Math.max(scores.C, scores.D) + 10) return { type: "sensory_peak", title: "Sensoriska intryck framträder tydligare i din profil.", body: "Se hur sensorik samspelar med de övriga områdena." };
  if (Math.abs(indices.adhdIndex - indices.autismIndex) >= 15) return { type: "adhd_asymmetry", title: "De två huvudområdena är olika högt skattade.", body: "Rapporten visar hur den skillnaden påverkar din kombinationsprofil." };
  if (context[0] <= 1 && Math.max(indices.adhdIndex, indices.autismIndex) >= 50) return { type: "context_conflict", title: "En av dina sista svar gör helhetsbilden mindre självklar.", body: "Den fullständiga analysen förklarar varför utvecklingskontexten är viktig." };
  return { type: "generic", title: "Din profil är klar", body: "Din fullständiga rapport visar åtta områden och hur de kan samspela hos dig." };
}

export function calculateReport(answers: number[], contextAnswers: number[]) {
  if (contextAnswers.length !== contextQuestions.length || !contextAnswers.every(value => Number.isInteger(value) && value >= 0 && value <= 4)) throw new Error("Expected 6 complete context answers");
  const scores = calculateDimensions(answers); const indices = calculatePrimaryIndices(scores); const core = (indices.adhdIndex + indices.autismIndex) / 2;
  const outliers = findDimensionOutliers(scores); const friction = analyzeFriction(answers); const impact = analyzeFunctionalImpact(scores, contextAnswers); const development = analyzeDevelopmentContext(contextAnswers, core);
  return { reportVersion: REPORT_VERSION, scores, indices, profileType: determineMainProfile(indices.adhdIndex, indices.autismIndex, scores), outliers, adhd: analyzeAdhdPattern(scores), autism: analyzeAutismPattern(scores), friction, masking: analyzeMasking(indices.maskingIndex, indices.autismIndex), impact, development, contradicting: findContradictingEvidence(scores, indices, contextAnswers), keyFindings: generateKeyInsights(scores, indices, friction, outliers, impact), teaser: generateTeaser(scores, indices, outliers, contextAnswers) };
}
export type Report = ReturnType<typeof calculateReport>;

export type SavedState = { reportVersion: string; answers: number[]; contextAnswers: number[]; questionIndex: number; contextIndex: number; unlocked: boolean; report?: Report };
export function parseState(raw: string | null): SavedState | null { try { const state: any = JSON.parse(raw ?? "null"); if (state?.reportVersion !== REPORT_VERSION || !Array.isArray(state.answers) || state.answers.length !== 48 || !Array.isArray(state.contextAnswers) || state.contextAnswers.length !== 6 || !state.answers.every((v: unknown) => typeof v === "number" && Number.isInteger(v) && v >= -1 && v <= 4) || !state.contextAnswers.every((v: unknown) => typeof v === "number" && Number.isInteger(v) && v >= -1 && v <= 4)) return null; return { reportVersion: REPORT_VERSION, answers: state.answers, contextAnswers: state.contextAnswers, questionIndex: Math.max(0, Math.min(47, state.questionIndex || 0)), contextIndex: Math.max(0, Math.min(5, state.contextIndex || 0)), unlocked: state.unlocked === true, report: state.report }; } catch { return null; } }
