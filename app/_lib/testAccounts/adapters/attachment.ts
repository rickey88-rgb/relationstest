import { calculate, questions } from "../../../anknytningstest/test/model";
import { parseAnswers } from "./schema";
export const attachment = {
  product: "attachment_test" as const, slug: "anknytningstest", title: "Anknytning", amount: 3900,
  testPath: "/anknytningstest/test", questionVersion: "anknytningstest-questions-v1", reportVersion: "anknytningstest-report-v1",
  flagPrefix: "TEST_ACCOUNTS_ATTACHMENT", priceEnv: "TEST_ACCOUNTS_ATTACHMENT_PRICE_ID",
  parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
