import type { Dimension, DimensionScore, Evidence } from "../types";
import type { Analysis } from "../insights-v1/types";

export type SectionId = "persona" | "insights" | "strengths" | "blindSpots" | "relationships" | "compass";
export type Reading = Readonly<{
  dimension: Dimension; direction: "high" | "low" | "mixed" | "middle" | "insufficient";
  support: readonly Evidence[]; counter: readonly Evidence[]; score: DimensionScore;
}>;
export type Block = Readonly<{
  id: string; theme: string; title: string;
  source: "dimension" | "archetype" | "insight" | "reflection";
  observation?: string; interpretation: string; example?: string;
  limitations: readonly string[]; evidence: readonly Evidence[]; counterEvidence: readonly Evidence[];
  contextEvidence?: readonly Evidence[];
  insightId?: string;
  topics?: readonly string[];
  presentationId?: string;
  claims?: readonly Claim[];
  adviceReason?: string;
}>;
export type Claim = Readonly<{ id: string; text: string; evidence: readonly Evidence[]; counterEvidence: readonly Evidence[] }>;
export type Section = Readonly<{
  id: SectionId; title: string; blocks: readonly Block[]; note?: string;
}>;
export type Report = Readonly<{
  product: "persona_test"; experimental: true; reportVersion: string; questionVersion: string;
  analysisVersion: string; insightVersion: string; catalogVersion: string; contentVersion: string;
  title: string; archetype: Readonly<{ id: string; name: string; evidence: readonly Evidence[] }> | null;
  method: string;
  dimensions: readonly DimensionScore[]; readings: readonly Reading[];
  sections: readonly Section[]; insightAnalysis: Analysis;
  quality: Readonly<{ eligible: boolean; warnings: readonly string[]; skipped: number; variedDimensions: readonly Dimension[] }>;
}>;
