// Isolated editorial gate. No registry, checkout or customer-flow imports.
import { immutable } from "../immutable";
import { coreQuestions } from "../v3/questions";
import { buildReport, VERSIONS } from "../v6/index";
import type { Block } from "../v6/types";

export const QUALITY_VERSION = "persona-report-quality-v1";
export const POLICY = immutable({
  minimumValid: 24, minimumAssessedDimensions: 4,
  minimumSections: 3, minimumBlocks: 4, minimumDistinctEvidence: 6,
  maximumReservationShare: 0.5,
  readyValid: 36, readySections: 6, readyStrengths: 2, readyAdvice: 2, readyInsights: 1,
});
export type QualityState = "ready" | "limited" | "insufficient";
const fallbackClaim = "no-simple-label";
const isAnswer = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
const unique = <T,>(items: readonly T[]) => Array.from(new Set(items));
export type FollowUp = Readonly<{
  id: string; purpose: string; question: string; format: "open" | "choice"; options?: readonly string[];
  limitation: string;
}>;
function proposals(missing: readonly string[], varied: number, neutral: number): FollowUp[] {
  const result: FollowUp[] = [];
  if (missing.length) result.push({
    id: "complete-existing", purpose: "Återbesök saknade svar utan nya skalfrågor.",
    question: "Vill du återvända till någon av de frågor du hoppade över, eller lämna dem obesvarade?",
    format: "choice", options: ["Återvända till frågorna", "Lämna dem obesvarade"],
    limitation: "Ett frivilligt erbjudande, inte ett krav på att välja en annan grad av igenkänning.",
  });
  if (neutral >= 15) result.push({
    id: "meaning-of-middle", purpose: "Skilja ett meningsfullt mittsvar från osäkerhet om formuleringen.",
    question: "När du väljer mitten, vad brukar det betyda för dig?",
    format: "choice", options: ["Det stämmer ungefär till hälften", "Det varierar mellan situationer", "Jag vet inte hur jag ska bedöma det", "Något annat"],
    limitation: "Ingen betydelse antas i förväg. Mittsvar får behållas.",
  });
  result.push({
    id: "context-and-difference", purpose: varied ? "Förstå situationer bakom motriktade svar." : "Få ett konkret sammanhang utöver skalvärden.",
    question: "Tänk på två nyliga tillfällen då du var med andra. Vad var likt eller olika i hur du deltog?",
    format: "open", limitation: "Skillnader kan vara rimliga. Svaret fastställer inte varför beteendet varierar.",
  }, {
    id: "resource-in-action", purpose: "Söka en självuppgiven resurs när rapporten saknar tydliga styrkor.",
    question: "Tänk på något litet du nyligen hanterade på ett sätt du är nöjd med. Vad gjorde du som hjälpte?",
    format: "open", limitation: "En enskild händelse belägger inte en generell förmåga.",
  }, {
    id: "chosen-next-step", purpose: "Förankra ett eventuellt råd i en självvald prioritering.",
    question: "Finns det något i din vardag du vill göra lättare eller bevara som det är? Beskriv ett konkret tillfälle.",
    format: "open", limitation: "Det är tillåtet att inte vilja förändra något. Ingen svårighet förutsätts.",
  });
  return result.slice(0, 4);
}

/** Assesses the current V6 report, not the validity or worth of a person's personality.
 * Unknown/missing ratings become SKIPPED only in this private analysis copy.
 * The report is always rebuilt from those answers; callers cannot supply a richer foreign report.
 */
export function assessReportQuality(input: readonly unknown[]) {
  if (!Array.isArray(input) || input.length > 40) throw Error("Expected at most 40 PERSONA ratings");
  const answers = Array.from({ length: 40 }, (_, index) => isAnswer(input[index]) ? input[index] as number : 0);
  const invalidIds = Array.from({ length: 40 }, (_, index) => index)
    .filter(i => input[i] !== undefined && input[i] !== null && input[i] !== 0 && !isAnswer(input[i]))
    .map(i => "Q" + String(i + 1).padStart(2, "0"));
  const missingIds = answers.flatMap((a, i) => a ? [] : ["Q" + String(i + 1).padStart(2, "0")]);
  const report = buildReport({ answers, questionVersion: VERSIONS.question, reportVersion: VERSIONS.report });
  const validCount = answers.filter(isAnswer).length;
  const dimensionDiagnostics = report.readings.map(reading => {
    const values = coreQuestions.flatMap((q, i) => q.dimension === reading.dimension && answers[i]
      ? [q.reverse ? 6 - answers[i] : answers[i]] : []);
    const high = values.filter(v => v >= 4).length, low = values.filter(v => v <= 2).length;
    return {
      dimension: reading.dimension, valid: values.length, direction: reading.direction,
      keyedValues: values, high, low, neutral: values.filter(v => v === 3).length,
      range: values.length ? Math.max(...values) - Math.min(...values) : null,
      // Descriptive agreement only: diverse facets are not redundant reliability items.
      dominantDirectionalShare: values.length ? Math.max(high, low) / values.length : null,
      bidirectional: high > 0 && low > 0,
    };
  });
  const validEvidence = (block: Block) => unique(block.evidence.filter(e => {
    const index = Number(e.questionId.slice(1)) - 1;
    return /^Q(?:0[1-9]|[12][0-9]|3[0-9]|40)$/.test(e.questionId) && isAnswer(e.answer) && answers[index] === e.answer;
  }).map(e => e.questionId));
  const personal = (block: Block) => {
    if (!block.interpretation.trim() || validEvidence(block).length < 2) return false;
    if (block.id === "portrait") return !!block.claims?.some(c => c.id !== fallbackClaim && c.evidence.length >= 2);
    return true;
  };
  const sections = report.sections.map(section => ({
    id: section.id, title: section.title,
    meaningfulBlockIds: section.blocks.filter(personal).map(b => b.id),
    excludedBlockIds: section.blocks.filter(b => !personal(b)).map(b => b.id),
    noteOnly: !section.blocks.some(personal),
  }));
  const blocks = report.sections.flatMap(s => s.blocks.filter(personal));
  const distinctEvidence = unique(blocks.flatMap(validEvidence));
  const sectionCount = sections.filter(s => !s.noteOnly).length;
  const count = (id: string) => sections.find(s => s.id === id)!.meaningfulBlockIds.length;
  const insightCount = report.sections.find(s => s.id === "insights")!.blocks.filter(b =>
    personal(b) && report.insightAnalysis.insights.some(i => i.id === b.insightId)).length;
  // Auditable proxy, not an NLP judgement: method, notes, qualifications and generic fallback
  // are reservations; supported observation/interpretation/example/reason text is personal prose.
  const reservationChars = report.method.length + report.sections.reduce((n, s) =>
    n + (s.note?.length ?? 0) + s.blocks.reduce((m, b) =>
      m + b.limitations.join(" ").length + (personal(b) ? 0 : b.interpretation.length), 0), 0);
  const personalChars = blocks.reduce((n, b) => n + [b.observation,b.interpretation,b.example,b.adviceReason].filter(Boolean).join(" ").length, 0);
  const reservationShare = reservationChars / Math.max(1, reservationChars + personalChars);
  const rawUniformExtreme = answers.every(a => a === 1) || answers.every(a => a === 5);
  const checks = {
    sufficientAnswers: validCount >= POLICY.minimumValid,
    sufficientDimensions: dimensionDiagnostics.filter(d => d.valid >= 4).length >= POLICY.minimumAssessedDimensions,
    sufficientSections: sectionCount >= POLICY.minimumSections,
    sufficientBlocks: blocks.length >= POLICY.minimumBlocks,
    diverseEvidence: distinctEvidence.length >= POLICY.minimumDistinctEvidence,
    usefulResource: count("strengths") > 0 || insightCount > 0,
    actionableAdvice: count("compass") > 0,
    personalContentDominates: reservationShare <= POLICY.maximumReservationShare,
  };
  const readyChecks = {
    nearCompleteAnswers: validCount >= POLICY.readyValid && invalidIds.length === 0,
    allDimensionsAssessed: dimensionDiagnostics.every(d => d.valid >= 4),
    allSectionsPersonal: sectionCount === POLICY.readySections,
    multipleStrengths: count("strengths") >= POLICY.readyStrengths,
    multipleAdvice: count("compass") >= POLICY.readyAdvice,
    combinationInsight: insightCount >= POLICY.readyInsights,
    interpretableResponsePattern: !rawUniformExtreme,
  };
  const failedMinimum = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key);
  const failedReady = Object.entries(readyChecks).filter(([, ok]) => !ok).map(([key]) => key);
  const state: QualityState = failedMinimum.length ? "insufficient" : failedReady.length ? "limited" : "ready";
  return immutable({
    version: QUALITY_VERSION, reportVersion: report.reportVersion, contentVersion: report.contentVersion,
    scope: "current-report-information-value" as const, state,
    validCount, missingIds, invalidIds, dimensionDiagnostics,
    neutralCount: answers.filter(a => a === 3).length,
    rawUniformExtreme, insights: insightCount, strengths: count("strengths"), advice: count("compass"),
    sections, meaningfulSections: sectionCount, meaningfulBlocks: blocks.length,
    distinctEvidenceIds: distinctEvidence, reservationShare, checks, readyChecks,
    reasons: failedMinimum.length ? failedMinimum : failedReady.length ? failedReady : ["allCriteriaMet"],
    followUpProposals: state === "insufficient" ? proposals(missingIds, dimensionDiagnostics.filter(d => d.bidirectional).length, answers.filter(a => a === 3).length) : [],
  });
}
