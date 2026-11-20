"use server";
import { questions, ratingLabels } from "../_domain/v3/questions";
import { VERSIONS } from "../_domain/v3/manifest";
import { parseSubmission } from "../_domain/v3/submission";
import { selectTeaser } from "../_domain/v3/teaser";
import { buildTeaser as buildV5Teaser } from "../_domain/v5/report";
import { VERSIONS as v5 } from "../_domain/v5/manifest";
import { buildTeaser } from "../_domain/v4/report";
import { VERSIONS as v4 } from "../_domain/v4/manifest";
import { buildPersonaReport } from "../_domain/registry";

export type PreviewResult = {
  kind: "insight" | "limited" | "invalid";
  headline?: string;
  why?: string;
  deeper?: string;
  qualified?: boolean;
  counterEvidence?: readonly { question: string; answer: string }[];
  text: string;
  evidenceCount: number;
  evidence?: readonly { question: string; answer: string }[];
};

/** The public response contains one teaser and its supporting answers. */
export async function getPersonaPreview(input: unknown): Promise<PreviewResult> {
  try {
    if (input && typeof input === "object" && "reportVersion" in input && (input.reportVersion === v5.report || input.reportVersion === v4.report)) {
      const teaser = input.reportVersion === v5.report ? buildV5Teaser(input) : buildTeaser(input);
      const describe = (items: typeof teaser.evidence) => items.map(item => ({
        question: questions[Number(item.questionId.slice(1)) - 1].prompt,
        answer: ratingLabels[item.answer - 1],
      }));
      return {
        kind: teaser.eligible ? "insight" : "limited", headline: teaser.headline, text: teaser.text,
        why: teaser.why, deeper: teaser.deeper, qualified: teaser.qualified, evidenceCount: teaser.evidence.length,
        evidence: describe(teaser.evidence), counterEvidence: describe(teaser.counterEvidence),
      };
    }
    if (input && typeof input === "object" && "questionVersion" in input && input.questionVersion === VERSIONS.question) {
      const { answers } = parseSubmission(input);
      const teaser = selectTeaser(answers);
      return {
        kind: teaser.eligible ? "insight" : "limited",
        headline: teaser.headline,
        text: teaser.text,
        evidenceCount: teaser.evidence.length,
        evidence: teaser.evidence.map(item => ({
          question: questions[Number(item.questionId.slice(1)) - 1].prompt,
          answer: ratingLabels[item.answer - 1],
        })),
      };
    }
    const report = buildPersonaReport(input);
    const finding = report.findings.find(item => report.preview.findingIds.includes(item.id));
    return { kind: report.quality.eligible && finding ? "insight" : "limited",
      text: report.preview.text, evidenceCount: finding?.evidence.length ?? 0 };
  } catch {
    return { kind: "invalid", text: "Förhandsvisningen kunde inte skapas. Granska dina svar och försök igen.", evidenceCount: 0 };
  }
}
