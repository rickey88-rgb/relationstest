import { calculate, PRICE_SEK, questions } from "../../../narcissism-sjalvtest/test/model";
import { parseAnswers } from "./schema";
export const narcissism = {
  product: "narcissism_selftest" as const, slug: "narcissism-sjalvtest", title: "Narcissism – självtest", amount: PRICE_SEK * 100,
  testPath: "/narcissism-sjalvtest/test", questionVersion: "narcissism-sjalvtest-questions-v1", reportVersion: "narcissism-sjalvtest-report-v1",
  flagPrefix: "TEST_ACCOUNTS_NARCISSISM_SELFTEST", priceEnv: "TEST_ACCOUNTS_NARCISSISM_SELFTEST_PRICE_ID",
  parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
