import { calculate, PRICE_SEK, questions } from "../../../autism-test/test/model";
import { parseAnswers } from "./schema";
export const autism = {
  product: "autism_test" as const, slug: "autism", title: "Autism", amount: PRICE_SEK * 100,
  testPath: "/autism-test/test", questionVersion: "autism-questions-v1", reportVersion: "autism-report-v1",
  flagPrefix: "TEST_ACCOUNTS_AUTISM", priceEnv: "TEST_ACCOUNTS_AUTISM_PRICE_ID",
  parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
