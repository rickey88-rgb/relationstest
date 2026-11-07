"use server";
import { buildPersonaReport } from "../_domain/registry";

export type PreviewResult = { kind: "insight" | "limited" | "invalid"; text: string; evidenceCount: number };

/** Only a single free finding crosses the server boundary. Never return the premium report. */
export async function getPersonaPreview(input: unknown): Promise<PreviewResult> {
  try {
    const report = buildPersonaReport(input);
    const finding = report.findings.find(item => report.preview.findingIds.includes(item.id));
    return { kind: report.quality.eligible && finding ? "insight" : "limited",
      text: report.preview.text, evidenceCount: finding?.evidence.length ?? 0 };
  } catch {
    return { kind: "invalid", text: "Förhandsvisningen kunde inte skapas. Granska dina svar och försök igen.", evidenceCount: 0 };
  }
}
