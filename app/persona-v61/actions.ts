"use server";
import { notFound } from "next/navigation";
import { parseSubmission } from "../persona/_domain/release-v61/submission";
import { frozen } from "../persona/_domain/release-v61/manifest";

/** Public response is deliberately a teaser, never the full report or its internal trace. */
export async function analyzePersonaV61(input: unknown) {
  if (process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED !== "true") notFound();
  const submission = parseSubmission(input);
  const result = frozen.completeReport(submission.answers, submission.supplement?.answers ?? {});
  const insight = result.baseReport.sections.find(s => s.id === "insights")?.blocks.find(b => b.source === "insight");
  const addition = result.additions.find(a => a.section !== "compass");
  return {
    state: result.after.state,
    title: insight?.title ?? addition?.title ?? result.freeResult?.title ?? "En första bild av dig",
    text: insight ? [insight.observation, insight.interpretation].filter(Boolean).join(" ") :
      addition?.text ?? result.freeResult?.text ?? "Dina svar ger en avgränsad bild av hur du brukar vara. Den berättar inte allt om dig.",
    description: result.offer.description,
    questions: result.offeredQuestions.map(q => ({ id:q.id, prompt:q.prompt, options:q.options.map(o=>({id:o.id,label:o.label})) })),
  };
}
export type V61Preview = Awaited<ReturnType<typeof analyzePersonaV61>>;
