import { questions, SCREENING_PRICE_SEK } from "../../../test/screening";
import { calculateReport } from "../../../test/report";
import { parseAnswers } from "./schema";
export const screening = {
  product: "screening_test" as const, slug: "screening", title: "Relationstest", amount: SCREENING_PRICE_SEK * 100,
  testPath: "/test", questionVersion: "screening-questions-v2", reportVersion: "screening-report-v1",
  flagPrefix: "TEST_ACCOUNTS_SCREENING", priceEnv: "TEST_ACCOUNTS_SCREENING_PRICE_ID",
  parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate: calculateReport,
};
