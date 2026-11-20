import type { Report } from "./types";
// Counts visible report prose, including headings and qualifications, excluding evidence appendix and technical metadata.
export function renderMarkdown(report: Report, evidence = false): string {
  const lines = ["# PERSONA – " + report.title, ""];
  for (const section of report.sections) {
    const shownLimits = new Set<string>();
    lines.push("## " + section.title, "");
    if (section.note) lines.push(section.note, "");
    for (const b of section.blocks) {
      lines.push("### " + b.title, "");
      if (b.observation) lines.push("**Observation:** " + b.observation, "", "**Möjlig tolkning:**", "");
      if (b.adviceReason) lines.push(b.adviceReason, "");
      lines.push(b.interpretation, "");
      if (b.example) lines.push("**Ett möjligt vardagsexempel:** " + b.example, "");
      for (const limit of b.limitations) {
        if (shownLimits.has(limit)) continue;
        shownLimits.add(limit);
        lines.push("*" + limit + "*", "");
      }
      if (evidence) {
        lines.push("Underlag: " + b.evidence.map(e => e.questionId + "=" + e.answer).join(", ") + ".", "");
        if (b.counterEvidence.length) lines.push("Motbelägg: " + b.counterEvidence.map(e => e.questionId + "=" + e.answer).join(", ") + ".", "");
        if (b.contextEvidence?.length) lines.push("Nyanser: " + b.contextEvidence.map(e => e.questionId + "=" + e.answer).join(", ") + ".", "");
      }
    }
  }
  lines.push("*" + report.method + "*", "");
  return lines.join("\n");
}
export function countWords(report: Report): number {
  return (renderMarkdown(report).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? []).length;
}
