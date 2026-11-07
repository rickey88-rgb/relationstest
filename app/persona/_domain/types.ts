export type Dimension = "E" | "O" | "C" | "A" | "N";
export type Theme = "R" | "L" | "M" | "F" | "G" | "S";
export type SectionId = "portrait" | "signature" | "dimensions" | "drivers" | "relationships" | "tensions" | "strengths" | "compass";
export type Evidence = Readonly<{ questionId: string; answer: number }>;
export type Condition = Readonly<{ questionId: string; answers: readonly number[] }>;
export type Question = Readonly<{
  id: string; chapter: 1 | 2 | 3 | 4; title: string; prompt: string;
  kind: "rating" | "scenario"; options: readonly string[];
  purpose: string; supports: readonly SectionId[]; source: "persona-original";
  dimension?: Dimension; reverse?: boolean; theme?: Theme;
}>;
export type CandidateScore = Readonly<{ id: string; theme: Theme; score: number; evidence: readonly Evidence[]; reason: "combination" | "single" | "fallback" }>;
export type Selection = Readonly<{ version: string; selectedIds: readonly string[]; candidates: readonly CandidateScore[]; totalScore: number }>;
export type DimensionScore = Readonly<{
  dimension: Dimension; name: string; valid: number; missingIds: readonly string[];
  raw: number; value: number | null; level: "lower" | "middle" | "higher" | "limited" | "insufficient";
  varied: boolean; evidence: readonly Evidence[];
}>;
export type Finding = Readonly<{
  id: string; ruleId: string; kind: "observation" | "combination" | "pattern" | "dimension";
  title: string; text: string; evidence: readonly Evidence[]; counterEvidence: readonly Evidence[];
  supports: readonly SectionId[]; strength: "situational" | "specific" | "recurrent" | "limited";
}>;
export type Paragraph = Readonly<{ id: string; text: string; findingIds: readonly string[]; scope: "personal" | "method" | "experiment" }>;
export type ReportSection = Readonly<{ id: SectionId; title: string; paragraphs: readonly Paragraph[] }>;
export type Submission = Readonly<{ questionVersion: string; reportVersion: string; answers: readonly number[] }>;
export type PersonaReport = Readonly<{
  product: "persona_test"; questionVersion: string; reportVersion: string; analysisVersion: string; adaptiveVersion: string;
  selection: Selection; dimensions: readonly DimensionScore[]; findings: readonly Finding[];
  sections: readonly ReportSection[];
  preview: Readonly<{ text: string; findingIds: readonly string[] }>;
  quality: Readonly<{ eligible: boolean; validScenarios: number; dimensionsWithEnoughAnswers: number; unknownCount: number; warnings: readonly string[] }>;
}>;
