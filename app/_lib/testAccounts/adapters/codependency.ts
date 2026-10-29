import { calculate, questions } from "../../../medberoendetest/test/model";
import { parseAnswers } from "./schema";
export const codependency = {
  product: "codependency_test" as const, slug: "medberoendetest", title: "Medberoende", amount: 3900,
  testPath: "/medberoendetest/test", questionVersion: "medberoendetest-questions-v1", reportVersion: "medberoendetest-report-v1",
  flagPrefix: "TEST_ACCOUNTS_CODEPENDENCY", priceEnv: "TEST_ACCOUNTS_CODEPENDENCY_PRICE_ID",
  parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
