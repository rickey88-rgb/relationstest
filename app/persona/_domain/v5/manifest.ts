import { immutable } from "../immutable";
import { VERSIONS as previous } from "../v4/manifest";

export const VERSIONS = immutable({ ...previous, report: "persona-report-v5", analysis: "persona-analysis-v5" } as const);

export const SECTION_TITLES = {
  signature: "Din PERSONA",
  dimensions: "Din personlighetskarta",
  portrait: "Det som gör dig unik",
  strengths: "Styrkor och fallgropar",
  relationships: "Relationer och beslut",
  compass: "Din utvecklingskompass",
} as const;
