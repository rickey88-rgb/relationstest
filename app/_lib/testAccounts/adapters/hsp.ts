import { calculate, PRICE_SEK, questions } from "../../../hsp-test/test/model";
import { parseAnswers } from "./schema";
export const hsp = {
  product: "hsp_test" as const, slug: "hsp", title: "HSP", amount: PRICE_SEK * 100,
  questionVersion: "hsp-questions-v1", reportVersion: "hsp-report-v1",
  flagPrefix: "TEST_ACCOUNTS_HSP", priceEnv: "TEST_ACCOUNTS_HSP_PRICE_ID",
  parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
