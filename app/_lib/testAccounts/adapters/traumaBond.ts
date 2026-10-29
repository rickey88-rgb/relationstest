import { calculate, questions } from "../../../traumabindningtest/test/model";
import { parseAnswers } from "./schema";
export const traumaBond = {
 product: "trauma_bond_test" as const, slug: "traumabindningtest", title: "Traumabindning", amount: 3900,
 testPath: "/traumabindningtest/test", questionVersion: "traumabindningtest-questions-v1", reportVersion: "traumabindningtest-report-v1",
 flagPrefix: "TEST_ACCOUNTS_TRAUMA_BOND", priceEnv: "TEST_ACCOUNTS_TRAUMA_BOND_PRICE_ID",
 parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
