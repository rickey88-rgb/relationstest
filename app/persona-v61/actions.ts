"use server";
import { notFound } from "next/navigation";
import { buildPurchaseReport, parsePurchase } from "../persona/_domain/purchase-v61/index";
import { personaPublicPaused } from "../_lib/personaAvailability.server";

/** Public response is deliberately a teaser, never the full report or its internal trace. */
export async function analyzePersonaV61(input: unknown) {
  if (personaPublicPaused() || process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED !== "true") notFound();
  const submission = parsePurchase(input, true);
  const missing = submission.answers.filter(a => a === 0).length;
  if (missing) return { state: "insufficient" as const, canPurchase: false,
    title: "Några svar saknas fortfarande", text: `Du har hoppat över ${missing} av 40 frågor. Granska dina svar och besvara dem innan du väljer premiumrapporten.`,
    description: "Köp öppnas när alla 40 frågor har giltiga svar.", questions: [] };
  const built = buildPurchaseReport(input);
  return {
    state: built.completion.after.state,
    canPurchase: true,
    ...built.teaser,
    description: built.completion.after.state === "ready" ? "Rapporten utvecklar fler perspektiv än den första insikten här ovanför." :
      "I din rapport skiljer vi tydligt på underbyggda slutsatser och reflektionsverktyg för det som svaren lämnar öppet.",
    questions: [],
  };
}
export type V61Preview = Awaited<ReturnType<typeof analyzePersonaV61>>;
