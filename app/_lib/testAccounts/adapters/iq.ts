import { calculate, PRICE_SEK, questions } from "../../../iq-test/test/model";
import { parseAnswers } from "./schema";
export const iq = {
  product: "iq_test" as const, slug: "iq", title: "IQ", amount: PRICE_SEK * 100,
  testPath: "/iq-test/test", questionVersion: "iq-questions-v2", reportVersion: "iq-report-v2",
  flagPrefix: "TEST_ACCOUNTS_IQ", priceEnv: "TEST_ACCOUNTS_IQ_PRICE_ID",
  parse(input: unknown) {
    const answers = parseAnswers(input, this.questionVersion, this.reportVersion, questions.length);
    if (answers.some((answer, index) => answer >= questions[index].options.length)) throw new Error("Invalid answers");
    return answers;
  }, calculate,
};
