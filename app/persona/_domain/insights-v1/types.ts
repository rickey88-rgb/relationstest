export type Family =
  | "motivation" | "contrasts" | "relationships"
  | "recovery" | "execution" | "development";

export type Answer = 1 | 2 | 3 | 4 | 5;
export type AnswerInput = readonly (number | null | undefined)[];

export type Condition = Readonly<{
  id: string;
  questionId: string;
  direction: "high" | "low";
  purpose: string;
}>;

export type Candidate = Readonly<{
  epistemicStatus: "preliminary-hypothesis";
  caution: "provisional";
  id: string;
  family: Family;
  title: string;
  questionIds: readonly string[];
  required: readonly Condition[];
  supporting: readonly Condition[];
  contradictory: readonly Condition[];
  nuances: readonly Condition[];
  limitations: readonly string[];
  minimumSupport: number;
  maximumContradictions: number;
  messageKey: string;
  adviceKey: string;
  observation: string;
  explanation: string;
  advice: string;
}>;

export type Evidence = Readonly<{
  questionId: string;
  answer: Answer;
  role: "required" | "supporting" | "contradictory" | "nuance";
  conditionId: string;
}>;

export type ConditionResult = Readonly<{
  condition: Condition;
  answer: Answer | null;
  status: "matched" | "opposed" | "neutral" | "missing";
}>;

export type Decision =
  | "selected" | "missing_required" | "required_not_met"
  | "insufficient_support" | "counterevidence" | "duplicate_message"
  | "overlapping_evidence" | "limit";

export type Evaluation = Readonly<{
  candidateId: string;
  family: Family;
  required: readonly ConditionResult[];
  supporting: readonly ConditionResult[];
  contradictory: readonly ConditionResult[];
  nuances: readonly ConditionResult[];
  evidence: readonly Evidence[];
  counterEvidence: readonly Evidence[];
  nuanceEvidence: readonly Evidence[];
  supportCount: number;
  contradictionCount: number;
  score: number;
  strength: "insufficient" | "limited" | "convergent";
  caution: "with_counterevidence" | "with_nuance" | "provisional";
  qualified: boolean;
  decision: Decision;
  reason: string;
}>;

export type Insight = Readonly<{
  id: string;
  family: Family;
  title: string;
  observation: string;
  possibleExplanation: string;
  evidence: readonly Evidence[];
  counterEvidence: readonly Evidence[];
  nuanceEvidence: readonly Evidence[];
  strength: "limited" | "convergent";
  caution: "with_counterevidence" | "with_nuance" | "provisional";
  caveat: string;
  selectionReason: string;
  limitations: readonly string[];
}>;

export type Advice = Readonly<{
  id: string;
  insightId: string;
  text: string;
  evidence: readonly Evidence[];
  counterEvidence: readonly Evidence[];
  nuanceEvidence: readonly Evidence[];
}>;

export type Analysis = Readonly<{
  engineVersion: string;
  catalogVersion: string;
  questionVersion: string;
  answered: number;
  missingQuestionIds: readonly string[];
  insights: readonly Insight[];
  advice: readonly Advice[];
  evaluations: readonly Evaluation[];
}>;
