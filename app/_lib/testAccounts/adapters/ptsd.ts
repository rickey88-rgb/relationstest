import { calculate, PRICE_SEK, questions } from "../../../ptsd-test/test/model";
import { parseAnswers } from "./schema";
export const ptsd = {
  product: "ptsd_test" as const, slug: "ptsd", title: "PTSD", amount: PRICE_SEK * 100,
  questionVersion: "ptsd-questions-v1", reportVersion: "ptsd-report-v1",
  flagPrefix: "TEST_ACCOUNTS_PTSD", priceEnv: "TEST_ACCOUNTS_PTSD_PRICE_ID",
  parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
