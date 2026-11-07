import { buildPersonaReport } from "../../../persona/_domain/registry";
import { parseSubmission } from "../../../persona/_domain/v1/submission";
import { VERSIONS, PRICE_SEK } from "../../../persona/_domain/versions";

/** One frozen model for checkout, encrypted storage and every paid reopening. */
export const persona = {
  product: "persona_test" as const, slug: "persona", title: "PERSONA", amount: PRICE_SEK * 100,
  testPath: "/persona/test", questionVersion: VERSIONS.question, reportVersion: VERSIONS.report,
  flagPrefix: "TEST_ACCOUNTS_PERSONA", priceEnv: "TEST_ACCOUNTS_PERSONA_PRICE_ID",
  parse(input: unknown) {
    const submission = parseSubmission(input);
    if (!buildPersonaReport(submission).quality.eligible) throw new Error("Insufficient PERSONA answers");
    return [...submission.answers];
  },
  calculate(answers: number[]) {
    return buildPersonaReport({ answers, questionVersion: VERSIONS.question, reportVersion: VERSIONS.report });
  },
};
