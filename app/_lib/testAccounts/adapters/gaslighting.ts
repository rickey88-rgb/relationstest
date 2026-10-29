import { calculate, questions } from "../../../gaslightingtest/test/model";
import { parseAnswers } from "./schema";
export const gaslighting = {
  product: "gaslighting_test" as const, slug: "gaslightingtest", title: "Gaslighting", amount: 3900,
  testPath: "/gaslightingtest/test", questionVersion: "gaslightingtest-questions-v1", reportVersion: "gaslightingtest-report-v1",
  flagPrefix: "TEST_ACCOUNTS_GASLIGHTING", priceEnv: "TEST_ACCOUNTS_GASLIGHTING_PRICE_ID",
  parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
