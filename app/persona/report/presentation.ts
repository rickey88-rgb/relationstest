import type { Report } from "../_domain/v6/types";
// Explicit display projection: traces, answers and internal identifiers never reach the view.
export function presentReport(report: Report) {
  return {
    title: report.title, method: report.method,
    sections: report.sections.map(section => {
      const seen = new Set<string>();
      return {
        id: section.id, title: section.title, note: section.note,
        blocks: section.blocks.map(block => ({
          title: block.title, observation: block.observation,
          interpretation: block.interpretation, example: block.example, adviceReason: block.adviceReason,
          limitations: block.limitations.filter(limit => {
            if (seen.has(limit)) return false;
            seen.add(limit); return true;
          }),
        })),
      };
    }),
  };
}
