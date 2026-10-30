import { calculateReport, REPORT_VERSION, PRICE_SEK, questions, contextQuestions } from "../../../audhd-test/test/model";
import { parseAnswers } from "./schema";
/** New sales only. Old AuDHD tables, cookies, links and payment rights are untouched. */
export const audhd = {
  product: "audhd_test" as const, slug: "audhd", title: "AuDHD", amount: PRICE_SEK * 100,
  testPath: "/audhd-test/test", questionVersion: "audhd-questions-v1", reportVersion: REPORT_VERSION,
  flagPrefix: "TEST_ACCOUNTS_AUDHD", priceEnv: "AUDHD_CHECKOUT_PRICE_ID",
  parse(input: unknown) {
    const values = parseAnswers(input, this.questionVersion, this.reportVersion, questions.length + contextQuestions.length);
    if (values[questions.length + 5] > 3) throw new Error("Invalid context answer");
    return values;
  },
  calculate(answers: number[]) { return calculateReport(answers.slice(0, questions.length), answers.slice(questions.length)); },
};
