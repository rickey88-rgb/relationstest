import { calculate, PRICE_SEK, questions } from "../../../angest-test/test/model";
import { parseAnswers } from "./schema";
export const angest = {
  product: "angest_test" as const, slug: "angest", title: "Ångest", amount: PRICE_SEK * 100,
  questionVersion: "angest-questions-v1", reportVersion: "angest-report-v1",
  flagPrefix: "TEST_ACCOUNTS_ANGEST", priceEnv: "TEST_ACCOUNTS_ANGEST_PRICE_ID",
  parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
